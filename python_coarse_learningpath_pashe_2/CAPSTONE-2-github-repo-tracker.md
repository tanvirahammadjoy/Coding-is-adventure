# Phase 2 · Mini Capstone: REST-Consuming CLI/TUI Application

## Objective

A significantly more advanced project than Phase 1's, integrating every Phase 2 concept into one cohesive, professionally-structured tool: a CLI/TUI application that consumes a public REST API, persists data locally, and is fully typed, tested, and packaged.

## Suggested Project: "GitHub Repo Tracker"

Track GitHub repositories (stars, issues, PRs) for a user-specified list of repos, storing historical snapshots locally and showing trends.

## Requirements

1. **OOP design** (M2.1–M2.5): a clean class hierarchy — an `ABC`/`Protocol`-based `DataSource` interface (so the GitHub API client is swappable/mockable), value objects (`Repo`, `Snapshot`) with proper `__eq__`/`__hash__`/`__repr__`
2. **Decorators** (M2.6): a `@retry` decorator wrapping API calls, a `@rate_limit` decorator respecting GitHub's API rate limits
3. **Generators** (M2.7): stream/paginate through API results lazily rather than loading everything into memory
4. **Context managers** (M2.8): a transaction-safe context manager wrapping each database write batch
5. **Type hints** (M2.9): full `mypy --strict` coverage, using `Protocol` for the swappable data source
6. **Testing** (M2.10): a full pytest suite with the GitHub API entirely mocked (no real network calls in unit tests), plus fixtures and parametrized edge cases
7. **Stdlib mastery** (M2.11): `argparse`/`click` for the CLI, `logging` configured properly (no `print`), `datetime` handled as timezone-aware throughout
8. **Data persistence** (M2.12): `sqlite3` storage with parameterized queries, or SQLAlchemy if you want the extra practice
9. **Packaging** (M2.13): full `src/` layout, `pyproject.toml`, published to TestPyPI, installable and runnable via `pip install -e .`

## Suggested CLI

```bash
repo-tracker add anthropics/anthropic-sdk-python
repo-tracker snapshot        # fetches current stats for all tracked repos
repo-tracker history anthropics/anthropic-sdk-python --days 30
repo-tracker remove anthropics/anthropic-sdk-python
```

## Evaluation Checklist

- [ ] Zero real network calls in the unit test suite (fully mocked)
- [ ] `mypy --strict` passes with no errors
- [ ] All SQL is parameterized
- [ ] API pagination handled via a generator, not by loading all pages into memory upfront
- [ ] Package builds and installs cleanly from a wheel in a fresh venv
- [ ] README documents architecture decisions (why `Protocol` over `ABC` for the data source, etc.)

## What This Bridges Into

This project's architecture — a swappable data-source interface, mocked external calls, retry/rate-limit decorators — is a direct rehearsal for Phase 3's concurrency work (fetching multiple repos concurrently) and Phase 5's production reliability patterns (retries, backoff, observability).
