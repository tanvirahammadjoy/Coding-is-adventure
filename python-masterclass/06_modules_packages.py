"""
06 — MODULES & PACKAGES
==========================
Imports, __name__, packages, __init__.py, namespaces.

Run: python3 06_modules_packages.py
"""

# ---------------------------------------------------------------------------
# 1. IMPORTING — a module is just a .py file; a package is a folder with __init__.py
# ---------------------------------------------------------------------------
import math                          # import whole module, access via math.sqrt
from math import sqrt, pi            # import specific names into local namespace
from math import sqrt as square_root # import with an alias
import os.path as path               # import submodule with alias

print(f"math.sqrt(16)={math.sqrt(16)} sqrt(16)={sqrt(16)} pi={pi:.4f}")
print(f"square_root(25)={square_root(25)}")

# `import *` pulls in everything public — AVOID in real code, it pollutes the
# namespace and hides where names come from. Shown here only for awareness:
# from math import *

# ---------------------------------------------------------------------------
# 2. __name__ == "__main__"  — lets a file act as both a script and an importable module
# ---------------------------------------------------------------------------
print(f"\nThis file's __name__ is: {__name__!r}")
# When you run `python3 06_modules_packages.py` directly, __name__ == "__main__".
# When another file does `import 06_modules_packages`, __name__ == the module name,
# and code under `if __name__ == "__main__":` does NOT run — only definitions do.
# This is why every file in this course guards its demo output that way.

# ---------------------------------------------------------------------------
# 3. TYPICAL PACKAGE LAYOUT (illustrated, not created on disk here)
# ---------------------------------------------------------------------------
package_layout = """
myproject/
├── pyproject.toml          <- packaging metadata (see 17_packaging_deployment.py)
├── src/
│   └── mypackage/
│       ├── __init__.py     <- makes this folder a package; can re-export the public API
│       ├── core.py
│       ├── utils.py
│       └── subpkg/
│           ├── __init__.py
│           └── helpers.py
└── tests/
    └── test_core.py

# Inside mypackage/__init__.py, you often see:
#     from .core import main_function
#     __all__ = ["main_function"]
# This lets users do: from mypackage import main_function

# Inside core.py, a relative import reaches a sibling module:
#     from .utils import helper_function
#     from .subpkg.helpers import another_helper
"""
print(package_layout)

# ---------------------------------------------------------------------------
# 4. THE MODULE SEARCH PATH — how Python finds what you're importing
# ---------------------------------------------------------------------------
import sys
print("Python looks for modules in this order (sys.path), first match wins:")
for p in sys.path[:5]:
    print(f"  {p!r}")
print("  ... (truncated)")

# ---------------------------------------------------------------------------
# 5. DIR() AND INTROSPECTION
# ---------------------------------------------------------------------------
print(f"\nmath module has {len(dir(math))} public names, e.g.: {dir(math)[:8]}")
print(f"math.__doc__ starts with: {math.__doc__[:60]!r}")

# ---------------------------------------------------------------------------
# 6. RELOADING (rare, mostly for interactive/dev use)
# ---------------------------------------------------------------------------
# import importlib
# importlib.reload(some_module)   # re-executes the module — handy for REPL dev loops

if __name__ == "__main__":
    print("\n[06_modules_packages.py] Done. Next: 07_error_handling.py")
