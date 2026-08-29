import asyncio
import json
import time
import uuid
from pathlib import Path

import httpx


CASES_FILE = Path(__file__).parent / "cases.json"


class OriginProxyAttack:

    def __init__(self, config: dict):

        self.config = config

        self.attack_id = str(uuid.uuid4())

        self.status = "created"

        self.start_time = None
        self.end_time = None

        self._stop_event = asyncio.Event()
        self._task = None

        self.results = []

        self.stats = {
            "planned_requests": 0,
            "attempted_requests": 0,
            "successful": 0,
            "failed": 0,
            "timeouts": 0,
        }

    # --------------------------------------------------------
    # Load enabled test cases
    # --------------------------------------------------------

    def _load_tests(self):

        with open(
            CASES_FILE,
            "r",
            encoding="utf-8",
        ) as file:

            cases = json.load(file)

        tests = []

        for case_id, case in cases.items():

            if not case.get("enabled", False):
                continue

            for test in case.get("tests", []):

                tests.append(
                    {
                        "case": case_id,
                        "name": test.get("name"),
                        "method": test.get(
                            "method",
                            self.config["target"]["method"],
                        ),
                        "headers": test.get(
                            "headers",
                            {},
                        ),
                    }
                )

        return tests

    # --------------------------------------------------------
    # Build URL
    # --------------------------------------------------------

    def _build_url(self):

        target = self.config["target"]

        base_url = target["base_url"].rstrip("/")

        endpoint = target["endpoint"]

        if not endpoint.startswith("/"):
            endpoint = "/" + endpoint

        return base_url + endpoint

    # --------------------------------------------------------
    # Start Attack
    # --------------------------------------------------------

    async def start(self):

        tests = self._load_tests()

        self.stats["planned_requests"] = (
            len(tests)
            * self.config["attack"].get(
                "requests_per_case",
                1,
            )
        )

        self.status = "running"

        self.start_time = time.monotonic()

        self._task = asyncio.create_task(
            self._run(tests)
        )

        return self.attack_id

    # --------------------------------------------------------
    # Execute attack
    # --------------------------------------------------------

    async def _run(self, tests):

        attack = self.config["attack"]

        delay = attack.get("delay", 0.2)

        requests_per_case = attack.get(
            "requests_per_case",
            1,
        )

        timeout = attack.get(
            "timeout",
            5,
        )

        try:

            async with httpx.AsyncClient(
                timeout=timeout,
                follow_redirects=False,
            ) as client:

                for test in tests:

                    if self._stop_event.is_set():
                        break

                    for _ in range(requests_per_case):

                        if self._stop_event.is_set():
                            break

                        await self._execute_test(
                            client,
                            test,
                        )

                        if delay > 0:
                            await asyncio.sleep(delay)

            if self._stop_event.is_set():
                self.status = "stopped"

            else:
                self.status = "completed"

        except Exception as exc:

            self.results.append(
                {
                    "type": "engine_error",
                    "error": type(exc).__name__,
                    "message": str(exc),
                }
            )

            self.status = "failed"

        finally:

            self.end_time = time.monotonic()

    # --------------------------------------------------------
    # Execute individual test
    # --------------------------------------------------------

    async def _execute_test(
        self,
        client: httpx.AsyncClient,
        test: dict,
    ):

        target = self.config["target"]
        request_config = self.config["request"]

        url = self._build_url()

        method = test["method"]

        headers = dict(
            request_config.get(
                "headers",
                {},
            )
        )

        headers.update(
            test.get(
                "headers",
                {},
            )
        )

        params = target.get(
            "query_params"
        )

        if params is None:
            params = {}

        path_params = target.get(
            "path_params"
        )

        if path_params:
            for key, value in path_params.items():
                url = url.replace(
                    "{" + key + "}",
                    str(value),
                )

        body = request_config.get(
            "body"
        )

        self.stats["attempted_requests"] += 1

        result = {
            "case": test["case"],
            "test": test["name"],
            "request": {
                "method": method,
                "url": url,
                "headers": headers,
                "query_params": params,
            },
        }

        try:

            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                params=params,
                json=body if method.upper() != "GET"
                else None,
            )

            self.stats["successful"] += 1

            result["response"] = {
                "status_code": response.status_code,
                "headers": dict(
                    response.headers
                ),
            }

            result["metadata"] = (
                self._extract_metadata(
                    response
                )
            )

            result["analysis"] = (
                self._analyze_response(
                    response
                )
            )

        except httpx.TimeoutException as exc:

            self.stats["timeouts"] += 1

            result["error"] = {
                "type": "TimeoutException",
                "message": str(exc),
            }

        except Exception as exc:

            self.stats["failed"] += 1

            result["error"] = {
                "type": type(exc).__name__,
                "message": str(exc),
            }

        self.results.append(result)

    # --------------------------------------------------------
    # Extract useful response metadata
    # --------------------------------------------------------

    def _extract_metadata(self, response):

        headers = response.headers

        interesting_headers = {
            key: headers[key]
            for key in headers
            if (
                key.lower().startswith(
                    (
                        "access-control-",
                        "x-forwarded-",
                        "x-original-",
                        "x-real-",
                        "cf-",
                        "x-cache",
                        "via",
                        "server",
                        "forwarded",
                        "location",
                        "vary",
                    )
                )
            )
        }

        return {
            "status_code": response.status_code,
            "content_type": headers.get(
                "content-type"
            ),
            "content_length": headers.get(
                "content-length"
            ),
            "server": headers.get(
                "server"
            ),
            "via": headers.get(
                "via"
            ),
            "forwarded": headers.get(
                "forwarded"
            ),
            "cors_headers": {
                key: value
                for key, value in headers.items()
                if key.lower().startswith(
                    "access-control-"
                )
            },
            "proxy_headers": interesting_headers,
        }

    # --------------------------------------------------------
    # Analyze response
    # --------------------------------------------------------

    def _analyze_response(self, response):

        headers = response.headers

        cors_headers = {
            key: value
            for key, value in headers.items()
            if key.lower().startswith(
                "access-control-"
            )
        }

        proxy_headers = {
            key: value
            for key, value in headers.items()
            if key.lower() in {
                "via",
                "forwarded",
                "x-forwarded-for",
                "x-forwarded-host",
                "x-forwarded-port",
                "x-forwarded-proto",
                "x-real-ip",
                "x-original-host",
                "x-original-url",
                "cf-connecting-ip",
                "true-client-ip",
            }
        }

        findings = []

        if cors_headers:
            findings.append(
                {
                    "type": "cors_headers_observed",
                    "headers": cors_headers,
                }
            )

        if proxy_headers:
            findings.append(
                {
                    "type": "proxy_headers_observed",
                    "headers": proxy_headers,
                }
            )

        if response.headers.get("server"):
            findings.append(
                {
                    "type": "server_metadata",
                    "value": response.headers[
                        "server"
                    ],
                }
            )

        return {
            "findings": findings,
            "cors": {
                "observed": bool(cors_headers),
                "headers": cors_headers,
            },
            "proxy": {
                "observed": bool(proxy_headers),
                "headers": proxy_headers,
            },
        }

    # --------------------------------------------------------
    # Status
    # --------------------------------------------------------

    def get_status(self):

        elapsed = 0

        if self.start_time is not None:

            end = (
                self.end_time
                if self.end_time is not None
                else time.monotonic()
            )

            elapsed = end - self.start_time

        attempted = self.stats[
            "attempted_requests"
        ]

        return {
            "attack_id": self.attack_id,
            "status": self.status,
            "elapsed_seconds": elapsed,

            "progress": {
                "planned_requests": self.stats[
                    "planned_requests"
                ],
                "attempted_requests": attempted,
            },

            "requests": {
                "successful": self.stats[
                    "successful"
                ],
                "failed": self.stats[
                    "failed"
                ],
                "timeouts": self.stats[
                    "timeouts"
                ],
            },

            "findings": self.results,
        }

    # --------------------------------------------------------
    # Stop
    # --------------------------------------------------------

    async def stop(self):

        self._stop_event.set()

        if self._task is not None:

            await asyncio.sleep(0)

        self.status = "stopped"

    # --------------------------------------------------------
    # Stream status
    # --------------------------------------------------------

    async def stream(
        self,
        interval: float = 1.0,
    ):

        while True:

            yield self.get_status()

            if self.status in {
                "completed",
                "failed",
                "stopped",
            }:
                break

            await asyncio.sleep(interval)