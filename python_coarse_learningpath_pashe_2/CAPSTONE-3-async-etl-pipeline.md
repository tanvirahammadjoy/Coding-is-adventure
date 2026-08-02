# Phase 3 · Mini Capstone: High-Throughput Async Web Scraper / ETL Pipeline

## Objective

Integrate every Phase 3 concept into a genuinely production-shaped concurrent data pipeline, with rigorous benchmarking proving your architectural decisions rather than assuming them.

## Suggested Project: "News Aggregator ETL Pipeline"

Fetch articles from multiple news APIs/RSS feeds concurrently, parse and normalize them, deduplicate, and persist to storage — at a scale (hundreds to thousands of sources) where naive sequential processing would be unacceptably slow.

## Requirements

1. **Memory awareness** (M3.1): use `__slots__` on high-volume article/entry objects; verify no reference-cycle leaks in long-running mode via `gc` inspection
2. **GIL-aware architecture** (M3.2): correctly justify (in writing) why the fetch stage uses asyncio (I/O-bound) and any heavy parsing/dedup stage uses `multiprocessing` (CPU-bound) if needed
3. **Async fetching** (M3.5): concurrent fetching of all sources using `asyncio.TaskGroup`, with per-source timeouts and a global concurrency limit (`asyncio.Semaphore`)
4. **Metaprogramming for extensibility** (M3.6/M3.7): a `__init_subclass__`-based auto-registering source-parser system, so adding a new source type requires no changes to the pipeline orchestration code
5. **Profiled performance** (M3.8): a documented before/after profiling report showing at least one genuine bottleneck found and fixed (not assumed)
6. **Safe serialization** (M3.10): all caching/persistence uses JSON or msgpack — explicitly justify why `pickle` is NOT used anywhere data crosses a trust boundary
7. **Regex safety** (M3.11): any regex used for parsing (e.g., extracting metadata from HTML) is audited for ReDoS vulnerability, with reasoning documented
8. **Idiomatic design** (M3.12): the source-parser system uses Protocol + first-class functions/registration rather than a heavy classical class-hierarchy pattern

## Suggested Architecture

```bash
[Source Registry] → [Async Fetch Pool (bounded concurrency)] → [Parse/Normalize]
                                                                        │
                                                          [Dedup] → [Persist (SQLite/JSON)]
```

## Evaluation Checklist

- [ ] Benchmarked and documented: sequential vs concurrent fetch time, with real numbers
- [ ] No `pickle` used on any data touching an external source
- [ ] All regex patterns audited for ReDoS
- [ ] New source types addable via a documented extension point, no core pipeline changes needed
- [ ] `gc`-verified: no reference-cycle memory growth over a sustained run
- [ ] Full test suite with all network calls mocked

## What This Bridges Into

This capstone's architecture — concurrent fetching, extensible plugin-style sources, careful serialization choices — is a direct rehearsal for Phase 4's architecture module and Phase 5's production deployment/observability work, where this exact pipeline would need containerization, monitoring, and horizontal scaling.

---

_This completes Phase 3. Confirm to proceed to Phase 4 (Expert: CPython internals, software architecture, security engineering, framework internals, APIs & databases at scale)._
