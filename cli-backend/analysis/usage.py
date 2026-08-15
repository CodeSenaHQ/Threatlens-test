from .structure import RepositoryAnalyzer
from repo.repository import Repository
import json


repo = Repository("https://github.com/atharv-thakre/tc_auth")

analyzer = RepositoryAnalyzer(repo)

result = analyzer.analyze().to_dict()
print(json.dumps(result, indent=3))

repo.close()