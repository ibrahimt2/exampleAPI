from setuptools import setup
import subprocess
import pathlib

def get_version():
    root = pathlib.Path(__file__).parent.parent
    result = subprocess.run(
        ["python3", str(root / "scripts/get_version.py")],
        capture_output=True, text=True
    )
    return result.stdout.strip()

setup(
    name="my-api-server",
    version=get_version(),
    py_modules=["app"],
    install_requires=["flask"],
    include_package_data=True,
    entry_points={
        "console_scripts": [
            "run-my-api-server=app:app"
        ]
    }
)