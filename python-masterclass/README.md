# Python Master Class

A complete, hands-on Python course in runnable scripts — beginner to advanced.
Every file is self-contained: run it directly and read the comments as you go.

```bash
python3 01_basics.py
```

## How to use this

1. Work through the files in order (numbered 01 → 18).
2. Each file runs on its own and prints its own output — no setup required except
   a plain Python 3.10+ install (some files use `match` statements and modern typing).
3. Read the comments above each block _before_ the code — that's where the teaching is.
4. Modify and break things. That's how you actually learn this.

## Curriculum

| #   | File                               | Topics                                                                  |
| --- | ---------------------------------- | ----------------------------------------------------------------------- |
| 01  | `01_basics.py`                     | Variables, types, numbers, strings, operators, input/output             |
| 02  | `02_control_flow.py`               | if/elif/else, loops, `match` statements, comprehension previews         |
| 03  | `03_data_structures.py`            | list, tuple, dict, set, slicing, comprehensions, unpacking              |
| 04  | `04_functions.py`                  | args/kwargs, defaults, closures, lambdas, `*args`/`**kwargs`, recursion |
| 05  | `05_oop.py`                        | Classes, inheritance, dunder methods, properties, dataclasses, ABCs     |
| 06  | `06_modules_packages.py`           | Imports, `__name__`, packages, `__init__.py`, namespaces                |
| 07  | `07_error_handling.py`             | try/except/else/finally, custom exceptions, exception chaining          |
| 08  | `08_file_io.py`                    | Reading/writing files, context managers, `pathlib`, CSV/JSON            |
| 09  | `09_iterators_generators.py`       | Iterators, `yield`, generator expressions, `itertools`                  |
| 10  | `10_standard_library.py`           | `collections`, `functools`, `datetime`, `os`, `re`, `random`            |
| 11  | `11_typing_hints.py`               | Type hints, `typing` module, generics, `Protocol`, static checking      |
| 12  | `12_testing.py`                    | `unittest`, `pytest`-style assertions, mocking, fixtures                |
| 13  | `13_concurrency_async.py`          | `threading`, `multiprocessing`, `asyncio`, GIL explained                |
| 14  | `14_decorators_metaprogramming.py` | Decorators (with args), descriptors, metaclasses, `__slots__`           |
| 15  | `15_performance.py`                | Profiling, `timeit`, memory, Big-O tips, common pitfalls                |
| 16  | `16_design_patterns.py`            | Singleton, factory, observer, strategy, context manager pattern         |
| 17  | `17_packaging_deployment.py`       | venvs, pip, `pyproject.toml`, entry points, distributing packages       |
| 18  | `18_best_practices.py`             | PEP 8, idiomatic Python, EAFP vs LBYL, common anti-patterns             |

## Prerequisites

- Python 3.10+ (`python3 --version`)
- No third-party packages required — everything uses the standard library.
  Where a file discusses a popular external library (pytest, numpy, requests, FastAPI),
  it's explained in comments rather than imported, so the script still runs anywhere.
