# 06 — Scripting Basics & Remote Access Technologies

**Domain:** 4.0 Operational Procedures (21%)
**Maps to objectives:** 4.4 (scripting), 4.5 (remote access)

## Scripting fundamentals (conceptual — Core 2 does NOT require you to write complex code)

| File extension | Language |
|---|---|
| `.bat` | Windows batch file |
| `.ps1` | PowerShell |
| `.vbs` | VBScript |
| `.sh` | Shell script (Linux/macOS) |
| `.py` | Python |
| `.js` | JavaScript |

## Basic scripting constructs to recognize

- **Variables**: store data (`$name = "value"` in PowerShell, `set var=value` in batch)
- **Loops**: repeat an action (`for`, `while`)
- **Conditionals**: branch logic (`if/then/else`)
- **Comments**: non-executed notes (`#` in PowerShell/bash, `REM` in batch)

## Common use cases for scripts (why they matter operationally)

- Automating repetitive tasks (bulk user creation, mass file renaming)
- Restarting services, backups, updates on a schedule (via Task Scheduler)
- Gathering diagnostic info (system info dumps) quickly across many machines
- Mapping network drives / basic system setup on new machine deployment

## Scripting considerations (this is what's actually tested — the risks, not the syntax)

- **Unintended consequences**: a script can affect far more than intended if scope/parameters are wrong — always test in a controlled environment first
- **Data integrity risks**: a poorly-written script can corrupt/delete data at scale, much faster than a human could manually
- **Browser/system security implications**: scripts running with elevated permissions are a security risk if the source isn't trusted — malicious scripts are a common attack vector (see fileless malware, Phase 2)
- **Restricted permissions/environments**: some organizations disable scripting engines (e.g., PowerShell execution policy set to Restricted) specifically to reduce attack surface

## PowerShell execution policy (a specific testable detail)

Controls whether scripts can run at all: `Restricted` (no scripts), `AllSigned`, `RemoteSigned` (common default — local scripts run, downloaded ones need a signature), `Unrestricted`. Check/set with `Get-ExecutionPolicy` / `Set-ExecutionPolicy`.

---

## Remote access technologies

| Technology | Notes |
|---|---|
| **RDP** (Remote Desktop Protocol) | Windows-native, port 3389, full GUI remote control — Pro+ editions only as a host |
| **VNC** (Virtual Network Computing) | Cross-platform remote GUI access, third-party |
| **SSH** (Secure Shell) | Encrypted command-line remote access, port 22 — standard for Linux/network device administration |
| **VPN** | Establishes a secure tunnel into a private network first, remote access tools often run *through* it afterward |
| **Remote monitoring and management (RMM)** | Enterprise tools for IT to manage many endpoints remotely (patch, monitor, remote control) at scale |
| **Microsoft Remote Assistance / Quick Assist** | User-initiated, invites a helper to view/control their screen for support — different from RDP (RDP typically requires the account to have remote access permission set up in advance, and shows a locked screen to the local user; Quick Assist is consent-based screen-sharing) |
| **Third-party desktop-sharing tools** (TeamViewer, AnyDesk, etc.) | Common in SMB/consumer support scenarios, works through NAT/firewalls without configuration |

## Security considerations for remote access

- Always require **MFA** for remote access tools where possible
- **RDP should never be exposed directly to the internet** without a VPN in front of it — direct RDP exposure is a very common attack vector (brute force / credential stuffing target)
- Use encrypted protocols (SSH over Telnet, RDP with Network Level Authentication enabled)
- Log and audit remote access sessions

## Quick self-check
1. What's the default port for RDP, and why is exposing it directly to the internet risky?
2. What PowerShell execution policy setting is a common secure default that still allows local scripts to run?
3. What's the key difference between RDP and Quick Assist in terms of how the session starts?
4. Why should scripts always be tested in a controlled environment before running broadly?

<details>
<summary>Answers</summary>

1. Port 3389 — exposing it directly to the internet makes it a common target for brute-force/credential-stuffing attacks; it should sit behind a VPN instead.
2. `RemoteSigned` — allows locally-created scripts to run while requiring downloaded scripts to be digitally signed.
3. RDP typically connects to a pre-configured account/session (and can lock out the local user); Quick Assist is consent-based — the local user actively invites and approves the remote helper.
4. Because a script can have unintended consequences at scale (affecting more data/systems than intended) far faster than manual action — testing first limits the blast radius of mistakes.
</details>
