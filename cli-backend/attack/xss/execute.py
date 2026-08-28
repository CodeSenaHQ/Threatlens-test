from . import XSSAttack
import asyncio


config = {
    "target": {
        "base_url": "http://127.0.0.1:8000",
        "endpoint": "/xss/reflected",
        "method": "GET",
        "path_params": None,
        "query_params": {
            "q": ""
        }
    },

    "request": {
        "headers": {},
        "auth": None,
        "body": {}
    },

    "attack": {
        "requests_per_case": 1,
        "delay": 0.2,
        "timeout": 5,
        "on_failure": "continue"
    }
}


async def main():

    attack = XSSAttack(config)

    attack_id = await attack.start()

    print("Attack ID:", attack_id)

    while True:

        await asyncio.sleep(1)

        status = attack.get_status()

        print(status)

        if status["status"] in {
            "completed",
            "failed",
            "stopped",
        }:
            break


if __name__ == "__main__":
    asyncio.run(main())