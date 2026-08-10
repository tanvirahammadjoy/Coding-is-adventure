"""
17 — PACKAGING & DEPLOYMENT
==============================
Virtual environments, pip, pyproject.toml, entry points, distributing packages.
This file is reference material printed to the console — packaging is a
tooling/workflow topic, not something you demo with executable snippets.

Run: python3 17_packaging_deployment.py
"""

print("""
1. VIRTUAL ENVIRONMENTS — isolate dependencies per project
=============================================================
python3 -m venv .venv              # create a venv in .venv/
source .venv/bin/activate          # activate it (macOS/Linux)
.venv\\Scripts\\activate             # activate it (Windows)
deactivate                         # leave the venv

Why: without a venv, `pip install` affects your whole system Python,
causing version conflicts between unrelated projects.

Alternatives: uv (fast, modern, increasingly standard), poetry, pipenv, conda.
""")

print("""
2. PIP — the package installer
=================================
pip install requests              # install a package
pip install requests==2.31.0      # pin an exact version
pip install -r requirements.txt   # install from a lockfile-like list
pip freeze > requirements.txt     # snapshot current environment
pip list --outdated               # see what needs updating
pip uninstall requests
""")

print("""
3. pyproject.toml — the modern standard for project + package metadata
==========================================================================
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "mypackage"
version = "0.1.0"
description = "A demo package"
readme = "README.md"
requires-python = ">=3.10"
dependencies = [
    "requests>=2.31",
    "click>=8.0",
]

[project.optional-dependencies]
dev = ["pytest", "mypy", "ruff"]

[project.scripts]
mycli = "mypackage.cli:main"      # creates a `mycli` terminal command after install

This ONE file replaces the old setup.py + setup.cfg + requirements.txt trio
for most modern projects.
""")

print("""
4. INSTALLING YOUR OWN PACKAGE
=================================
pip install -e .                  # "editable" install — code changes reflect immediately,
                                   # ideal during development
pip install .                     # regular install — snapshot copy, for real use

python -m build                   # builds a .whl and .tar.gz for distribution
                                   # (pip install build first)
twine upload dist/*                # publish to PyPI (pip install twine first)
""")

print("""
5. ENTRY POINTS — turn a function into a terminal command
=============================================================
# mypackage/cli.py
def main():
    print("Hello from mycli!")

# pyproject.toml:
[project.scripts]
mycli = "mypackage.cli:main"

# After `pip install -e .`, running `mycli` in the terminal calls that function.
""")

print("""
6. DEPLOYMENT PATTERNS (brief overview)
==========================================
- Simple script/CLI tool  -> pip package + entry point, or a Docker image
- Web service              -> Docker container + gunicorn/uvicorn behind nginx,
                               deployed to a cloud platform (AWS/GCP/Azure/Fly/Render)
- Serverless function      -> AWS Lambda / GCP Cloud Functions with a thin handler
- Data/ML pipeline         -> Docker + orchestration (Airflow, Prefect, Dagster)

A minimal Dockerfile for a Python app:
    FROM python:3.12-slim
    WORKDIR /app
    COPY pyproject.toml .
    RUN pip install .
    COPY . .
    CMD ["python", "-m", "mypackage"]
""")

if __name__ == "__main__":
    print("[17_packaging_deployment.py] Done. Next: 18_best_practices.py")
