"""
08 — FILE I/O & CONTEXT MANAGERS
===================================
Reading/writing files, context managers, pathlib, CSV/JSON.

Run: python3 08_file_io.py
(Creates and cleans up a temp folder next to this script — safe to run anywhere.)
"""

import json
import csv
import tempfile
from pathlib import Path

# Use a temp directory so this demo never touches real user files.
workdir = Path(tempfile.mkdtemp(prefix="pymc_"))
print(f"working in temp dir: {workdir}")

# ---------------------------------------------------------------------------
# 1. WRITING & READING TEXT FILES — always use a context manager (`with`)
# ---------------------------------------------------------------------------
text_file = workdir / "notes.txt"

with open(text_file, "w") as f:            # "w" = write (overwrites), auto-closes file
    f.write("line one\n")
    f.write("line two\n")

with open(text_file, "a") as f:            # "a" = append
    f.write("line three\n")

with open(text_file, "r") as f:            # "r" = read (default)
    content = f.read()
print(f"\nfull content:\n{content}")

with open(text_file, "r") as f:
    for line in f:                          # files are iterable line-by-line — memory efficient
        print(f"  line: {line.strip()!r}")

# Why context managers matter: `with` guarantees f.close() runs even if an
# exception occurs inside the block — equivalent to a try/finally.

# ---------------------------------------------------------------------------
# 2. PATHLIB — the modern, object-oriented way to handle filesystem paths
# ---------------------------------------------------------------------------
p = text_file
print(f"\n{p.name=} {p.stem=} {p.suffix=} {p.parent=}")
print(f"{p.exists()=} {p.is_file()=} {p.is_dir()=}")

subdir = workdir / "sub"
subdir.mkdir(exist_ok=True)                # exist_ok avoids error if it already exists
(subdir / "child.txt").write_text("hello from pathlib")
print(f"read via pathlib: {(subdir / 'child.txt').read_text()!r}")

print("files in workdir:", [f.name for f in workdir.iterdir()])

# ---------------------------------------------------------------------------
# 3. JSON — structured data interchange
# ---------------------------------------------------------------------------
data = {"name": "Ana", "age": 29, "skills": ["python", "sql"], "active": True}
json_file = workdir / "data.json"

with open(json_file, "w") as f:
    json.dump(data, f, indent=2)

with open(json_file, "r") as f:
    loaded = json.load(f)
print(f"\nloaded json: {loaded}")

json_string = json.dumps(data)              # serialize to a string (no file)
parsed_back = json.loads(json_string)       # deserialize from a string
print(f"round-trip equal: {parsed_back == data}")

# ---------------------------------------------------------------------------
# 4. CSV — tabular data
# ---------------------------------------------------------------------------
csv_file = workdir / "people.csv"
rows = [
    {"name": "Ana", "age": 29},
    {"name": "Bo", "age": 22},
]

with open(csv_file, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writeheader()
    writer.writerows(rows)

with open(csv_file, "r", newline="") as f:
    reader = csv.DictReader(f)
    read_rows = list(reader)
print(f"\ncsv rows: {read_rows}")

# ---------------------------------------------------------------------------
# 5. WRITING YOUR OWN CONTEXT MANAGER
# ---------------------------------------------------------------------------
from contextlib import contextmanager

@contextmanager
def timed_block(label):
    import time
    start = time.perf_counter()
    print(f"[{label}] starting...")
    try:
        yield                              # code inside the `with` block runs here
    finally:
        elapsed = time.perf_counter() - start
        print(f"[{label}] finished in {elapsed:.6f}s")

with timed_block("demo work"):
    total = sum(range(100_000))

# Class-based equivalent (what @contextmanager saves you from writing):
class TimedBlock:
    def __init__(self, label):
        self.label = label

    def __enter__(self):
        import time
        self.start = time.perf_counter()
        print(f"[{self.label}] (class-based) starting...")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        print(f"[{self.label}] (class-based) finished in {time.perf_counter() - self.start:.6f}s")
        return False        # False = don't suppress exceptions

with TimedBlock("class demo"):
    pass

# ---------------------------------------------------------------------------
# CLEANUP
# ---------------------------------------------------------------------------
import shutil
shutil.rmtree(workdir)
print(f"\ncleaned up {workdir}")

if __name__ == "__main__":
    print("\n[08_file_io.py] Done. Next: 09_iterators_generators.py")
