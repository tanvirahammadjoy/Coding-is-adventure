# 04 — Backup & Recovery Methods

**Domain:** 4.0 Operational Procedures (21%)
**Maps to objective:** 4.3 — Given a scenario, implement workstation backup and recovery methods

## Backup types (know the trade-offs, not just definitions)

| Type | What it captures | Restore speed | Backup speed/storage |
|---|---|---|---|
| **Full** | Everything, every time | Fastest restore (one backup set) | Slowest to run, most storage used |
| **Incremental** | Only data changed since the **last backup of any type** | Slower restore (need the last full + every incremental since) | Fastest to run, least storage |
| **Differential** | Only data changed since the **last full backup** | Medium restore (need the last full + the latest differential only) | Grows larger each day until the next full |
| **Synthetic full** | Combines a full + incrementals into a new "full" without re-reading all source data | Fast restore, efficient | Reduces backup window impact |

**Exam trap:** the classic "restore math" question — "A full backup runs Sunday, incrementals run Mon–Fri, the system fails Saturday. How many backup sets are needed to restore?" → Full (Sunday) + **every** incremental (Mon, Tue, Wed, Thu, Fri) = 6 total sets. If those were **differential** instead of incremental, you'd only need the full (Sunday) + the latest differential (Friday) = 2 sets.

## Backup rotation schemes

- **Grandfather-Father-Son (GFS)**: daily (son), weekly (father), monthly (grandfather) backup sets retained on a rotating schedule — balances storage cost against restore flexibility over time
- **3-2-1 rule**: keep **3** copies of data, on **2** different media types, with **1** copy off-site — the gold-standard general guidance, very testable as a concept

## Backup storage locations

| Location | Trade-off |
|---|---|
| **Local (external drive/NAS)** | Fast restore, but vulnerable to the same local disaster (fire, theft, flood) as the source |
| **Off-site** | Protects against local disasters, slower to access |
| **Cloud** | Off-site by nature, scalable, but depends on internet connectivity/bandwidth for restore |

## Testing backups

A backup that has never been test-restored is not a verified backup — this is one of the most-repeated real-world (and exam) lessons: **schedule regular restore tests**, don't just assume the backup job "succeeded" means the data is actually recoverable.

## System-level recovery tools (tie back to Phase 1)

- **System Restore**: rolls back system files/settings/registry to a restore point — does **not** affect personal files
- **File History (Windows)**: continuous backup of personal files to an external/network location
- **Reset this PC**: OS-level reset, "Keep files" vs "Remove everything"
- **Recovery image / factory image**: full pre-built system image for redeployment

## Quick self-check
1. Full backup Sunday, differential backups Mon–Fri, failure occurs Saturday — how many backup sets are needed to restore, and which ones?
2. What does the 3-2-1 backup rule specify?
3. Why is a backup that's never been restore-tested considered unverified?
4. Does System Restore affect a user's personal documents/photos?

<details>
<summary>Answers</summary>

1. Two sets: the full backup (Sunday) + the most recent differential (Friday) — differentials only require the last full plus the latest differential.
2. 3 copies of data, on 2 different media types, with 1 copy stored off-site.
3. Because backup software reporting "success" only confirms the job ran and wrote data — it doesn't confirm the data is actually intact and restorable until you've actually restored from it.
4. No — System Restore only affects system files/settings/registry, not personal files.
</details>
