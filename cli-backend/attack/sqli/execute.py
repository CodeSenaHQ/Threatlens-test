from . import SQLInjectionAttack
import asyncio


config = {
  "target": {
    "base_url": "http://localhost:8000",
    "endpoint": "/login",
    "method": "POST",
    "path_params": None,
    "query_params": None
  },

  "request": {
    "headers": {
      "Content-Type": "application/json"
    },
    "auth": None,
    "body": {
      "username": "test",
      "password": "test"
    }
  },

  "attack": {
    "requests_per_case": 1,
    "delay": 0.2,
    "timeout": 5,
    "on_failure": "continue"
  }
}


async def main():

    attack = SQLInjectionAttack(config)
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