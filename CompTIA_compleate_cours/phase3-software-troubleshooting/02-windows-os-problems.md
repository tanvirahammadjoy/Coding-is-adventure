# 02 — Common Windows OS Problems

**Domain:** 3.0 Software Troubleshooting (23%)
**Maps to objective:** 3.1 — Given a scenario, troubleshoot common Windows OS problems

## Boot problems

| Symptom | Likely cause | Fix |
|---|---|---|
| **Blue Screen of Death (BSOD)** | Driver conflict, failing hardware, corrupted system file | Note the stop code, boot into Safe Mode, check Event Viewer, roll back recent driver/update |
| **Black screen, no boot** | Corrupted boot files, failing drive, loose cable | Boot to WinRE, run `bootrec /fixmbr`, `/fixboot`, `/rebuildbcd` |
| **Boot loop / spontaneous restart** | Overheating, failing RAM, corrupted update | Check thermals, run `chkdsk`, `sfc /scannow`, uninstall recent update |
| **"Operating system not found"** | Boot order misconfigured, drive not detected, MBR/GPT corruption | Check BIOS boot order, verify drive is detected, repair boot sector |
| **Slow boot** | Too many startup programs, disk fragmentation (HDD), failing drive | Trim startup items (Task Manager/Settings), check drive health |

## Performance & stability problems

| Symptom | Likely cause | Fix |
|---|---|---|
| **Slow performance** | Insufficient RAM, malware, too many background processes, failing/full disk | Task Manager to identify resource hog, check disk space, malware scan |
| **Application crashes/freezes** | Corrupted app files, insufficient resources, incompatible version | Reinstall app, check compatibility mode, update |
| **High CPU/memory usage by a specific process** | Runaway process, malware, poorly optimized app | Task Manager > end task, check if it recurs, investigate via Resource Monitor |
| **Spontaneous shutdown** | Overheating, PSU failure, driver issue | Check Event Viewer, monitor temps |

## File/system corruption

| Symptom | Fix |
|---|---|
| Missing/corrupted system files | `sfc /scannow` (must run elevated) |
| `sfc` can't fix everything it finds | `DISM /Online /Cleanup-Image /RestoreHealth` first, then re-run `sfc` |
| Corrupted user profile (temp profile loads at login) | Rename/rebuild the profile in the registry (`ProfileList` key) or create a new profile and migrate data |
| Disk errors | `chkdsk /f /r` |

## Update problems

- Update fails to install → check disk space, run Windows Update Troubleshooter, clear the SoftwareDistribution cache folder
- Update causes a regression → uninstall the specific update via `Settings > Update History > Uninstall updates`, or roll back via System Restore

## Windows-specific symptoms (exam favorites)

- **Print spooler issues**: stuck print jobs → restart the **Print Spooler service** (`services.msc` or `net stop spooler && net start spooler`), clear the spool folder
- **Service won't start**: check dependencies in `services.msc`, check the account it runs under
- **Time sync drift**: causes Kerberos authentication failures on a domain (Kerberos requires clocks within ~5 min) — resync via `w32tm /resync`
- **Aero/graphics glitches**: usually a graphics driver issue — update/roll back driver

## Quick self-check
1. What two commands work together to repair deeply corrupted system files that `sfc` alone can't fix?
2. Why would a domain login fail purely because of a clock discrepancy?
3. What's the standard fix for a stuck Windows print queue?
4. A user's desktop looks completely default/reset at every login — what's likely happening and where would you look to fix it?

<details>
<summary>Answers</summary>

1. `DISM /Online /Cleanup-Image /RestoreHealth` (repairs the underlying component store) followed by `sfc /scannow`.
2. Kerberos authentication requires client and server clocks to be within a tight tolerance (~5 minutes) — if too far off, authentication fails.
3. Restart the Print Spooler service and clear the spool folder.
4. A corrupted user profile is loading a temporary profile — fix by rebuilding/renaming the profile via the registry's ProfileList key or creating a new profile and migrating data.
</details>
