# 02 — Windows Editions, Installation & Upgrades

**Domain:** 1.0 Operating Systems (28%)
**Maps to objectives:** 1.2 (installation/upgrade methods), 1.3 (Windows editions/versions)

## Windows editions — what each one actually unlocks

| Edition                  | Adds over the tier below                                                                                    | Domain join?           |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Home**                 | Base consumer features                                                                                      | ❌ No (workgroup only) |
| **Pro**                  | BitLocker, Group Policy Editor (gpedit.msc), Remote Desktop (host), Windows Information Protection, Hyper-V | ✅ Yes                 |
| **Pro for Workstations** | ReFS support, persistent memory, higher CPU/RAM ceilings                                                    | ✅ Yes                 |
| **Enterprise**           | App-V, UE-V, DirectAccess, Credential Guard, Windows To Go, volume licensing only                           | ✅ Yes                 |
| **Education**            | Enterprise features, licensed for schools                                                                   | ✅ Yes                 |

**Exam trap:** "A technician needs to enable BitLocker on a laptop but the option isn't there." → It's running **Windows Home**, which doesn't include BitLocker. Upgrade the edition (not reinstall — Windows supports edition upgrades via a product key, no data loss).

**Windows N editions**: EU-market versions with media player/codecs stripped out to comply with antitrust rulings. Fix = install the "Media Feature Pack" separately.

## 32-bit vs 64-bit

- 64-bit can address >4GB RAM; 32-bit is capped around 3.2–4GB usable.
- 64-bit Windows can run 32-bit apps (they install to `Program Files (x86)`); 32-bit Windows **cannot** run 64-bit apps at all.
- Windows 11 ships 64-bit only — no more 32-bit installation media.

## Installation types

| Type                            | When to use                                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Clean install**               | Wiping and starting fresh — best when the old OS is corrupted/heavily bloated, or moving to a new drive               |
| **In-place upgrade**            | Keep apps + files, jump to a newer OS version while running the current one — must run PC Health Check first (Win 11) |
| **Attended installation**       | Manual, interactive — one machine, small deployments                                                                  |
| **Unattended installation**     | Uses an `unattended.xml` (answer file) to automate installs at scale — no user interaction needed                     |
| **Image deployment**            | Push a pre-configured disk image to many machines (common in corporate imaging with tools like MDT/SCCM)              |
| **Remote network installation** | PXE boot to a network install source — no local media needed                                                          |

## Upgrade considerations checklist (exam loves this as a scenario question)

1. Verify hardware compatibility (TPM 2.0, Secure Boot, RAM/CPU) — use **PC Health Check** for Windows 11
2. Confirm driver support for peripherals, especially RAID controllers and network adapters (these often need OEM drivers slipstreamed for install to even see the disk)
3. **Back up data first** — always, regardless of how routine the upgrade seems
4. Check the app compatibility list for line-of-business software

## Product lifecycle

- **Mainstream support**: full support, feature updates, bug fixes, security patches
- **Extended support**: security patches only, no new features
- **End of Life (EOL)**: no more patches at all — a system past EOL is a security liability (this is a very common exam scenario: "why is this machine vulnerable?" → it's running an OS past EOL)

## Boot methods

- Optical media (legacy)
- USB drive (most common today)
- **PXE** (Preboot eXecution Environment) — network boot, used for imaging/unattended installs at scale
- Internet-based boot (Windows can reinstall via cloud download from the recovery environment)
- Internal recovery partition

Configure boot order in BIOS/UEFI; UEFI + GPT is required for Secure Boot and Windows 11.

## Partitioning

- **MBR** (Master Boot Record) — legacy, max 4 primary partitions (or 3 primary + 1 extended with logical drives inside), 2TB volume limit
- **GPT** (GUID Partition Table) — modern, up to 128 partitions, supports volumes >2TB, required for UEFI/Secure Boot
- Use **Disk Management** (GUI) or **DiskPart** (CLI) to partition, format, assign drive letters

## Recovery & reset

- **Recovery partition**: hidden partition holding WinRE (Windows Recovery Environment) — access via Settings > Recovery, or by interrupting boot 3x
- **Reset this PC**: choose "Keep my files" (removes apps, keeps personal data) vs "Remove everything" (full wipe)
- **Repair vs full recovery**: repair fixes boot/system files without wiping data; full recovery is a clean reinstall
- **Limitation**: Reset/recovery from a factory recovery partition can't help if the partition itself is damaged or the drive is failing — that's when you go to install media

## Quick self-check

1. A user's Home edition laptop can't join the office domain — why, and what's the fix?
2. Which partition table is required to boot in UEFI mode with Secure Boot?
3. What's the difference between mainstream support and extended support?
4. When would you choose PXE boot over USB installation media?

<!-- markdownlint-disable MD033 -->
<details>
<summary>Answers</summary>

1. Windows Home can't join a domain (workgroup only) — upgrade to Pro (or higher) via a product key upgrade, no reinstall needed.
2. GPT.
3. Mainstream = full support (features + fixes + security); extended = security patches only, no new features.
4. Deploying to many machines at once over the network without needing physical media at each machine — typical in corporate imaging.

</details>
