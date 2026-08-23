from db import get_db

def set_usage(
    prompt_tokens: int,
    completion_tokens: int,
    total_tokens: int,
):
    db = get_db()

    db.execute(
        """
        UPDATE usage
        SET
            prompt_tokens = ?,
            completion_tokens = ?,
            total_tokens = ?,
            updated_at = unixepoch()
        WHERE id = 1
        """,
        (
            prompt_tokens,
            completion_tokens,
            total_tokens,
        ),
    )

    db.commit()


def get_usage():
    db = get_db()

    cursor = db.execute(
        """
        SELECT
            prompt_tokens,
            completion_tokens,
            total_tokens,
            synced_at,
            updated_at
        FROM usage
        WHERE id = 1
        """
    )

    return cursor.fetchone()


def patch_usage(
    prompt_tokens: int,
    completion_tokens: int,
    total_tokens: int,
):
    db = get_db()

    db.execute(
        """
        UPDATE usage
        SET
            prompt_tokens = prompt_tokens + ?,
            completion_tokens = completion_tokens + ?,
            total_tokens = total_tokens + ?,
            updated_at = unixepoch()
        WHERE id = 1
        """,
        (
            prompt_tokens,
            completion_tokens,
            total_tokens,
        ),
    )

    db.commit()


def sync_usage():
    db = get_db()

    db.execute(
        """
        UPDATE usage
        SET
            synced_at = unixepoch()
        WHERE id = 1
        """
    )

    db.commit()


def reset_usage():
    db = get_db()

    db.execute(
        """
        UPDATE usage
        SET
            prompt_tokens = 0,
            completion_tokens = 0,
            total_tokens = 0,
            synced_at = unixepoch(),
            updated_at = unixepoch()
        WHERE id = 1
        """
    )

    db.commit()