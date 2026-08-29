from attack.ddos import DDoSAttack
import asyncio
import json


config = {
    "target": {
        "base_url": "http://localhost:8000",
        "endpoint": "/tc-auth/login/password",
        "method": "POST",
        "path_params": None,
        "query_params": None,
    },

    "request": {
        "headers": {
            "Content-Type": "application/json",
        },
        "auth": None,
        "body": {
            "email": "test@example.com",
            "password": "test-password",
        },
    },

    "attack": {
        "duration": 30,
        "requests": 100,
        "concurrency": 10,
        "delay": 0.2,
        "timeout": 1,
        "retries": 0,
        "on_failure": "continue",
    },
}


async def data_burning():

    attack = DDoSAttack(config)

    attack_id = await attack.start()

    print("Attack ID:", attack_id)

    while True:

        await asyncio.sleep(3)

        status = attack.get_status()

        print(
            json.dumps(
                status,
                indent=2,
            )
        )

        if status["status"] in {
            "completed",
            "failed",
            "stopped",
        }:
            break


async def sse():

    attack = DDoSAttack(config)

    attack_id = await attack.start()

    print("Attack ID:", attack_id)

    async for status in attack.stream(
        interval=1
    ):
        print(
            json.dumps(
                status,
                indent=2,
            )
        )


if __name__ == "__main__":
    asyncio.run(sse())