import yaml
import pathlib

root = pathlib.Path(__file__).parent.parent
spec_path = root / "spec/server.yaml"
with open(spec_path) as f:
    spec = yaml.safe_load(f)
    print(spec["info"]["version"])