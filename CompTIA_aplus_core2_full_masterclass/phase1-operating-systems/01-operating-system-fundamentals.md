# 01 — Operating System Fundamentals

**Domain:** 1.0 Operating Systems (28% of exam)
**Maps to objective:** 1.1 — Identify basic features of OS types (Windows, macOS, Linux, ChromeOS, Android, iOS/iPadOS)

## Why this matters for the exam

Core 2 assumes you already know PC hardware from Core 1. This objective tests whether you can look at a device/scenario and pick the _right_ OS and the _right_ filesystem for the job — a classic Core 2 question pattern is "a user needs X, which OS/filesystem should you recommend?"

## The desktop/laptop OS family

| OS                       | Kernel base                           | License model                | Typical use case                                        | A+ trivia                                                                   |
| ------------------------ | ------------------------------------- | ---------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| Windows 10/11            | NT kernel                             | Proprietary, per-seat/device | Business + home desktops                                | Core 2 emphasizes end-user support, not server admin                        |
| Windows Server 2012–2025 | NT kernel                             | Proprietary, CALs            | Domain controllers, file/print/app servers              | Mentioned for context; deep server admin is out of scope                    |
| macOS                    | Darwin (Unix/BSD-based)               | Proprietary, hardware-locked | Creative pros, Apple-only shops                         | Only installs on genuine Apple hardware — licensing ties OS to hardware     |
| Linux (various distros)  | Linux kernel                          | Open source (GPL and others) | Servers, developers, embedded, some desktops            | Distros = Ubuntu, Fedora, Debian, Kali (security), RHEL/CentOS (enterprise) |
| ChromeOS                 | Linux-based, Google proprietary shell | Proprietary                  | Chromebooks/boxes — cloud-first, low-maintenance fleets | Runs Android apps in a sandbox; auto-updates aggressively                   |

## Mobile OS family

- **Android** — open-source Linux base (AOSP), but manufacturers (Samsung, Google, etc.) layer proprietary skins on top. Short official support lifecycle compared to iOS unless the vendor commits to extended updates. Historically used dessert-themed codenames (deprecated but still tested trivia).
- **iOS** (iPhone) / **iPadOS** (iPad) — both Apple, Unix-based, share a common code base. iPadOS diverges with multitasking (Split View, Stage Manager) and Apple Pencil support that iOS doesn't have.

**Exam trap:** Don't confuse "open source" (Android's core, Linux) with "open license for modification by manufacturers" — Android is open source but individual device builds are often locked down/proprietary on top.

## Filesystems — know these cold

| Filesystem | OS                            | Key traits                                                                                                                         |
| ---------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **NTFS**   | Windows                       | Journaling, permissions (ACLs), encryption (EFS), compression, large file/volume support — the default for Windows internal drives |
| **ReFS**   | Windows Server/Storage Spaces | Resilient File System — built for large-scale storage, self-healing, no EFS/compression support (trade-off vs NTFS)                |
| **FAT32**  | Cross-platform legacy         | Max file size 4GB, max volume 8TB (practically) — used for compatibility (USB drives, older firmware/BIOS updates)                 |
| **exFAT**  | Cross-platform, modern        | No 4GB file size limit like FAT32, but no journaling — common for USB/SD cards needing cross-OS compatibility (Windows + Mac)      |
| **ext4**   | Linux                         | Journaling, the default on most Linux distros today                                                                                |
| **XFS**    | Linux                         | High-performance journaling filesystem, common on RHEL/enterprise Linux for large files                                            |
| **APFS**   | macOS                         | Apple File System — replaced HFS+, optimized for SSDs, native encryption, snapshots, space sharing between volumes                 |

**Journaling** = the filesystem keeps a log of pending changes before committing them, so a crash mid-write doesn't corrupt the whole volume. NTFS, ext4, XFS, APFS all journal. FAT32 does **not** — that's why FAT32 volumes are more prone to corruption after unsafe removal.

**Exam trap:** "Which filesystem should you format a USB drive to share files between Windows and Mac, with files over 4GB?" → **exFAT** (FAT32 fails on the 4GB limit; NTFS write support on Mac is unreliable without extra drivers).

## Compatibility concerns when upgrading/choosing an OS

- **Hardware**: TPM 2.0 requirement (Windows 11), minimum RAM, legacy driver support for older peripherals (printers/scanners without updated drivers)
- **Software**: 32-bit vs 64-bit app compatibility, line-of-business apps that only run on older OS versions
- **Network**: domain join requirements (Windows Pro/Enterprise needed, not Home), authentication protocol support
- **People**: user retraining cost when moving between OS families (Windows → Mac, or old UI → new UI)

## Quick self-check

1. Why can't macOS legally run on non-Apple hardware?
2. Which two filesystems are journaling AND cross-platform-friendly on Windows?
3. A user needs to move a 10GB video file between a Windows PC and a Mac via USB stick — which filesystem?
4. What's the practical difference between iOS and iPadOS?

<details>
<summary>Answers</summary>

1. Apple's software license agreement restricts macOS installation to genuine Apple hardware (also technically enforced via T2/Apple Silicon security chips).
2. NTFS (Windows-native, journaling) is not natively writable cross-platform without drivers; the honest cross-platform journaling answer here is really just APFS/ext4 within their own ecosystems — for **cross-platform without extra drivers**, exFAT is the practical answer even though it doesn't journal. (This is a good example of an exam question that tests whether you understand the trade-off, not just memorize a table.)
3. exFAT (handles files >4GB, natively readable/writable on both Windows and Mac).
4. iPadOS adds multitasking features (Split View/Stage Manager) and Apple Pencil support that iOS lacks; otherwise they share the same Unix-based core.

</details>
