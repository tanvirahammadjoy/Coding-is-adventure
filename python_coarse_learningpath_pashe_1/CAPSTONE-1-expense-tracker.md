# Phase 1 · Mini Capstone: CLI Expense Tracker

## Objective

Integrate every Phase 0–1 concept into one real, working tool: a command-line expense tracker with persistent storage.

## Requirements

1. **Package structure** (M1.11): `src/expense_tracker/` with `__init__.py`, `models.py`, `storage.py`, `cli.py`
2. **Data types** (M1.2): use `Decimal` for all money values — never `float`
3. **Control flow** (M1.4): use `match`/`case` to dispatch CLI subcommands (`add`, `list`, `summary`, `delete`)
4. **Collections** (M1.6): use appropriate structures — a `dict` keyed by category for fast summary lookups, a `list` for chronological entries
5. **Functions** (M1.7): clear signatures with keyword-only flags where appropriate (e.g., `add_expense(amount, category, *, note=None)`)
6. **Comprehensions** (M1.8): use them for filtering/summarizing entries by category or date range
7. **Error handling** (M1.9): custom exception hierarchy (`ExpenseError` → `InvalidAmountError`, `CategoryNotFoundError`), narrow except clauses, no bare `except:`
8. **File I/O** (M1.10): persist to a JSON file using `pathlib`, safe path handling, explicit UTF-8 encoding, use `with` throughout
9. **Tooling** (M0.6): the whole project passes `ruff check` and `mypy` cleanly with type hints on all public functions

## Suggested CLI

```bash
expense add 42.50 groceries --note "weekly shop"
expense list --category groceries
expense summary --month 2026-07
expense delete 3
```

## Stretch Goals (bridges into Phase 2)

- Add a `pytest` test suite (previews M2.10)
- Package it properly with `pyproject.toml` so it's installable via `pip install -e .` (previews M2.13)

## Evaluation Checklist

- [ ] No `float` used for money anywhere
- [ ] No bare `except:` anywhere
- [ ] All file operations use `with` and explicit encoding
- [ ] Passes `ruff check .` with zero warnings
- [ ] Package importable via `python -m expense_tracker`
- [ ] Handles at least 3 distinct error conditions with clear custom exceptions
