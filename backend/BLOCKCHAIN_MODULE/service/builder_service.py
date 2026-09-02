from BLOCKCHAIN_MODULE.imports import *

def build_chain(
    config: dict,
    user: dict,
):
    account_id = user["account"]["id"]
    chain = InternalChain(
        chain_name=config["chain"],
        user=user,
    )

    # Repositories
    for repo in config.get("repos", []):
        repo_data = get_repositories(
            account_id=account_id,
            repo_id=repo["repo_id"],
            limit=1,
        )

        chain.create_block(
            type="repo",
            data=repo_data,
        )

    # Commit analysis
    for commit in config.get("commits", []):
        commit_data = get_commit_analysis(
            repo_id=commit["repo_id"],
            limit=commit["limit"],
        )

        chain.create_block(
            type="commit_analysis",
            data=commit_data,
        )

    # Attacks
    for attack in config.get("attacks", []):
        attack_data = get_attack(
            account_id=account_id,
            attack_type=attack["type"],
            limit=attack["limit"],
        )

        chain.create_block(
            type=attack["type"],
            data=attack_data,
        )

    # Usage
    if config.get("usage"):
        usage_data = get_usage(
            account_id=account_id,
        )

        chain.create_block(
            type="usage",
            data=usage_data,
        )

    # Custom blocks
    for custom in config.get("custom", []):
        chain.create_block(
            type="custom_"+custom["type"],
            data=custom.get("data", {}),
        )

    chain.commit()

    return chain