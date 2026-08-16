# 06 — Windows Administrative Tools & Command Line

**Domain:** 1.0 Operating Systems (28%)
**Maps to objectives:** 1.4 (GUI admin tools), 1.5 (command line tools)

This is one of the densest, most heavily-tested files in the whole course — command syntax questions show up constantly on Core 2.

## GUI administrative tools

| Tool | Purpose |
|---|---|
| **Task Manager** | CPU/memory/disk/network usage, process/service management, end tasks, Startup tab |
| **Device Manager** | Hardware inventory, driver update/rollback/uninstall, flag conflicts (yellow ⚠) |
| **Disk Management** (`diskmgmt.msc`) | Initialize disks, create/format partitions, GPT/MBR, build RAID (striped/mirrored) volumes |
| **Disk Defragmenter / Disk Cleanup** | Defrag = reorganizes fragmented data on **HDDs only** (never defrag an SSD — causes unnecessary wear); Cleanup = removes temp files/recycling bin/old system files |
| **Task Scheduler** | Automate tasks via triggers/actions/conditions (e.g., run a script nightly) |
| **Event Viewer** | Application/Security/Setup/System logs; severities from Information → Warning → Error → Critical; Friendly vs XML view |
| **Performance Monitor** (`perfmon`) | Real-time + logged counters (CPU, memory, disk, network) — used for baselining and long-term trend analysis |
| **Local Users and Groups** (`lusrmgr.msc`) | Local account/group management, password policy, home drive mapping (Pro+ only, not Home) |
| **Group Policy Editor** (`gpedit.msc`) | Local security/password policies; domain GPOs push settings to many machines (Pro+ only) |
| **Certificate Manager** (`certmgr.msc`) | View/import/request digital certificates; personal store vs trusted root authorities |
| **System Information** (`msinfo32`) | Full system report: OS build, hardware resources, components, startup programs |
| **Resource Monitor** (`resmon`) | Deeper than Task Manager — per-process handles/modules, detailed network connections |
| **System Configuration** (`msconfig`) | Boot options (Normal/Diagnostic/Selective startup), services, startup items, BCD edits |
| **Registry Editor** (`regedit`) | Direct edits to HKEY hives — HKLM (machine-wide), HKCU (current user), etc. Classic exam example: block USB mass storage by setting the USBSTOR service `Start` value from 3 to 4 |
| **Microsoft Management Console** (`mmc`) | Build a custom console by adding snap-ins (Device Manager, Disk Management, Event Viewer, GPO, etc.) into one window |

**Registry hives to memorize:**
- `HKEY_LOCAL_MACHINE` (HKLM) — machine-wide settings
- `HKEY_CURRENT_USER` (HKCU) — settings for the logged-in user
- `HKEY_CLASSES_ROOT` — file associations
- `HKEY_USERS` — all loaded user profiles
- `HKEY_CURRENT_CONFIG` — active hardware profile

## Command-line tools

### Navigation & file management

| Command | Does |
|---|---|
| `cd` | Change directory |
| `dir` | List directory contents |
| `md` / `mkdir` | Make directory |
| `rmdir` | Remove directory |
| `type` | Display file contents |
| `cls` | Clear screen |
| `copy` | Copy files |
| `move` | Move/rename files |
| `xcopy` | Advanced copy (directories, attributes) |
| `robocopy` | "Robust copy" — handles network drives, long NTFS names, resumable backups; more powerful than xcopy |

### System / identity

| Command | Does |
|---|---|
| `whoami` | Shows current logged-in user; `/groups` shows group memberships, `/priv` shows privileges — useful for permission troubleshooting |
| `winver` | Shows Windows version/build in a dialog |
| `systeminfo` | Full text dump: build, install date, owner, hotfixes — often piped (`| more`) or redirected to a file |
| `sfc /scannow` | **System File Checker** — verifies protected system files against a cache and repairs corruption; run from an **elevated** (administrator) prompt |
| `shutdown` | `/s` shutdown, `/r` restart, `/h` hibernate, `/l` log off, `/t` delay timer, `/a` abort a pending shutdown |

### Disk

| Command | Does |
|---|---|
| `diskpart` | Interactive disk partitioning: `list disk`, `select disk`, create/format partitions, change drive letters |
| `chkdsk` | Scans and repairs filesystem errors; `/f` fixes errors, `/r` locates bad sectors |
| `format` | Formats a volume to a chosen filesystem (NTFS, FAT32, etc.) |

### Networking

| Command | Does |
|---|---|
| `ipconfig` | Shows IP config; `/all` shows full details (MAC, DHCP lease, DNS); `/release` and `/renew` manage DHCP leases; `/flushdns` clears DNS cache |
| `ping` | Tests reachability to a host |
| `tracert` | Traces the network path (hop by hop) to a destination |
| `pathping` | Combines ping + tracert — shows packet loss per hop over time |
| `hostname` | Shows the local machine's name |
| `nslookup` | Resolves domain names to IPs; interactive mode lets you query specific record types (A, MX, etc.) |
| `netstat` | Shows active connections/listening ports; `-a` all connections, `-b` show owning executable, `-n` numeric addresses, `-o` show process ID — critical for spotting malware phoning home |
| `gpupdate` | Forces a Group Policy refresh (`/force` reapplies everything) |
| `gpresult` | Shows which GPOs are currently applied to a user/machine — `/r` for a summary |

**Exam trap combo:** "A technician suspects malware is communicating over the network." → Run `netstat -abo` to see the connection, the owning executable, and the process ID together, then cross-reference with Task Manager.

## Quick self-check
1. Should you ever run Disk Defragmenter on an SSD? Why or why not?
2. Which command shows the current user's group memberships?
3. What registry value/hive change is the classic exam example for blocking USB mass storage devices?
4. Which single command combination reveals both the process using a network connection and its PID?

<details>
<summary>Answers</summary>

1. No — SSDs don't benefit from defragmentation and unnecessary write cycles reduce their lifespan.
2. `whoami /groups`.
3. `HKEY_LOCAL_MACHINE` → USBSTOR service → change `Start` value from 3 to 4.
4. `netstat -abo` (or `-o` alone for PID, `-b` for the executable name).
</details>
