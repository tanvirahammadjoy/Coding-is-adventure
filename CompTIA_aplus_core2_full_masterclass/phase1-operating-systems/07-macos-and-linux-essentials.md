# 07 — macOS & Linux Essentials

**Domain:** 1.0 Operating Systems (28%)
**Maps to objectives:** 1.8 (macOS features/tools), 1.9 (Linux features/tools)

Core 2 doesn't expect you to be a Linux sysadmin — it expects you to recognize common features and basic commands well enough to support end users who use these systems.

## macOS features & tools

| Feature | Purpose |
|---|---|
| **Finder** | File manager (equivalent to File Explorer) |
| **Spotlight** (Cmd+Space) | System-wide search |
| **Mission Control** | Virtual desktops / window overview |
| **Keychain** | Built-in password/credential manager |
| **Time Machine** | Native backup utility — incremental, automatic, to an external/network drive |
| **Disk Utility** | Partition/format drives, run First Aid (repair) on volumes |
| **Terminal** | Unix shell access (bash/zsh) |
| **Force Quit** (Cmd+Opt+Esc) | Kill unresponsive apps — the macOS equivalent of Task Manager's "End Task" |
| **Software Update** | System Preferences/Settings > General — OS and App Store app updates |
| **Remote Disc / Screen Sharing** | Built-in remote access tools |
| **System Preferences/Settings** | Central config hub (renamed "System Settings" in modern macOS, styled closer to iOS) |
| **iCloud** | Sync photos, files, keychain, Find My Mac |
| **Gestures** | Multi-touch trackpad gestures configurable in Settings |

**FileVault** = macOS's full-disk encryption (the BitLocker equivalent).

## Linux features & tools

| Concept | Notes |
|---|---|
| **Distributions** | Ubuntu (Debian-based, beginner-friendly), Fedora/RHEL/CentOS (enterprise), Debian (stable/server), Kali (security/pentesting) |
| **Package managers** | `apt`/`apt-get` (Debian/Ubuntu), `yum`/`dnf` (RHEL/Fedora), `pacman` (Arch) |
| **Shell** | Bash is the default on most distros |
| **Root/superuser** | `sudo` grants temporary elevated privileges; logging in directly as `root` is discouraged |
| **File permissions** | `rwx` (read/write/execute) for owner/group/others — set via `chmod`; ownership via `chown` |
| **Filesystem hierarchy** | Single root `/` — no drive letters. Key dirs: `/home` (user files), `/etc` (config), `/var` (logs/variable data), `/bin` `/usr/bin` (binaries) |

### Common Linux commands (know these)

| Command | Does |
|---|---|
| `ls` | List directory contents (Linux's `dir`) |
| `cd` | Change directory |
| `pwd` | Print working directory |
| `cp` / `mv` / `rm` | Copy / move / delete |
| `mkdir` / `rmdir` | Make/remove directory |
| `cat` | Display file contents |
| `grep` | Search text within files |
| `sudo` | Run a command with elevated privileges |
| `chmod` | Change file permissions |
| `chown` | Change file owner |
| `ps` / `top` | View running processes (top = live view, like Task Manager) |
| `kill` / `killall` | Terminate a process by PID / by name |
| `df -h` | Show disk space usage, human-readable |
| `apt update && apt upgrade` | Refresh package lists and upgrade installed packages (Debian/Ubuntu) |
| `man <command>` | Manual/help page for a command |

**Exam trap:** A Core 2 question might describe a permission issue ("a user can't execute a script") — the fix involves `chmod +x filename` to add execute permission, not reinstalling anything.

## Quick self-check
1. What's the macOS equivalent of Windows' BitLocker?
2. Which macOS shortcut force-quits an unresponsive app?
3. What Linux command elevates a single command to root privileges without logging in as root?
4. How do you grant execute permission on a Linux script?

<details>
<summary>Answers</summary>

1. FileVault.
2. Cmd+Option+Esc.
3. `sudo`.
4. `chmod +x filename`.
</details>
