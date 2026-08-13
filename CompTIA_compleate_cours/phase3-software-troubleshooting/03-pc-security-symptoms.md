# 03 — PC Security Problem Symptoms

**Domain:** 3.0 Software Troubleshooting (23%)
**Maps to objective:** 3.2 — Given a scenario, troubleshoot common PC security issues

This objective is the practical partner to Phase 2's malware file — here the focus is *recognizing symptoms in a scenario* and picking the right immediate response.

## Common infection symptoms

| Symptom | What it suggests |
|---|---|
| Random/excessive pop-ups | Adware, browser hijack |
| Browser redirected to unfamiliar search engine/homepage | Browser hijacker, malicious extension |
| Security software disabled unexpectedly | Active malware disabling defenses |
| Renamed system files, files with unfamiliar extensions | Ransomware or file-infecting virus |
| Ransom note/message demanding payment | Ransomware |
| Slow performance with high disk/CPU/network activity, no clear cause | Cryptominer, background malware, botnet participation |
| Emails sent from the user's account that they didn't send | Compromised account or email-worm |
| Unexpected outbound connections in `netstat` | Malware phoning home, botnet C2 traffic |
| OS update/patch fails repeatedly | Could be corruption, but also check for malware interfering with Windows Update |
| Certificate warnings / invalid certificate errors | Possible man-in-the-middle, or a system clock badly out of sync (check the boring explanation first) |
| Rogue antivirus pop-ups ("Your PC is infected, click here!") | Scareware — itself often a malware delivery vector |

## Response priority when infection is suspected

1. **Isolate/quarantine** — disconnect from the network immediately (physically unplug or disable Wi-Fi) to stop lateral spread or data exfiltration
2. Follow the malware removal 7-step process from Phase 2 (investigate → quarantine → disable System Restore → remediate → schedule scans → re-enable System Restore → educate user)
3. **Don't** just delete the ransom note and assume it's fixed — verify with a full scan and check for persistence mechanisms (scheduled tasks, registry run keys, services)

## Browser-specific security symptoms

- Unexpected toolbars/extensions the user didn't install → check `Extensions` list, remove unrecognized ones
- Default search engine changed without consent → browser hijack, reset browser settings
- Frequent "your browser is out of date" pop-ups from non-official sources → fake update prompts, a common malware delivery method — never click, update through the browser's own settings menu

## OS-level security symptom checks

- **Check installed programs list** for anything unfamiliar/unwanted
- **Check Task Scheduler** for suspicious scheduled tasks (a common persistence mechanism)
- **Check `msconfig`/Task Manager Startup tab** for unfamiliar startup entries
- **Check local user accounts** (`lusrmgr.msc`) for unauthorized accounts that shouldn't exist

## Quick self-check
1. What's the very first physical/network action to take once malware is confirmed on a machine?
2. A user reports their antivirus is suddenly "off" and they didn't disable it — what does this suggest?
3. Where would you look for a malware persistence mechanism disguised as a routine automated task?
4. Should you trust a pop-up claiming "your browser is out of date, click to update"? Why or why not?

<details>
<summary>Answers</summary>

1. Isolate/quarantine the machine — disconnect it from the network to prevent spread or data exfiltration.
2. Active malware likely disabled the security software itself.
3. Task Scheduler.
4. No — legitimate browser updates come through the browser's own settings menu, not third-party pop-ups; these are a common malware delivery vector.
</details>
