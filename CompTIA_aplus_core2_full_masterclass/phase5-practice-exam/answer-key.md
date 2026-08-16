# Practice Exam — Answer Key & Explanations

## Domain 1: Operating Systems

1. **C) exFAT** — handles files over 4GB (unlike FAT32) and is natively readable/writable on both Windows and Mac without extra drivers (unlike NTFS on Mac).
2. **B) Pro** — Home edition lacks domain join capability entirely.
3. **B) Windows Home** — BitLocker isn't included in Home edition, regardless of TPM status.
4. **B) GPT** — required for UEFI boot mode and Secure Boot.
5. **B) Unnecessary write cycles that reduce drive lifespan** — SSDs don't benefit from defragmentation the way HDDs do.
6. **C) `sfc /scannow`** — System File Checker, must run elevated.
7. **B) `netstat -abo`** — shows connections, owning executable, and PID together.
8. **C) HKEY_CURRENT_USER** — settings for the currently logged-in user specifically.
9. **B) FileVault** — macOS's full-disk encryption feature.
10. **C) `chmod +x script.sh`** — adds execute permission.
11. **B) IMAP** — syncs mail state across devices; POP3 downloads and often removes mail from the server.
12. **D) S4** — Hibernate (suspend to disk).
13. **B) PC Health Check** — Microsoft's tool specifically for diagnosing Windows 11 upgrade eligibility.
14. **B) MMC** (Microsoft Management Console) — lets you add multiple snap-ins into one custom console.
15. **B)** — 64-bit Windows runs both 32-bit and 64-bit apps; 32-bit Windows cannot run 64-bit apps at all.
16. **B) PXE boot** — network boot, ideal for mass deployment without physical media.
17. **C) apt** — used by Debian/Ubuntu; yum/dnf are RHEL/Fedora, pacman is Arch.

## Domain 2: Security

18. **B) Password + hardware token code** — spans two different factor categories (know + have). A and C use only "something you know" twice; D is still one factor category.
19. **C) Mantrap/access control vestibule** — specifically designed to prevent one person following another through a secured door.
20. **B) Whaling** — spear phishing specifically targeted at an executive/high-value target.
21. **C) WEP** — broken/obsolete, should never be used.
22. **B) Disable System Restore** — this is step 3 in the official 7-step process, done before remediation.
23. **C) Worm** — self-replicates across a network without needing a host file or user action (unlike a virus).
24. **B)** — a new account generates a new certificate; EFS decryption is tied to the certificate, not the username.
25. **B) TPM** — Trusted Platform Module securely stores BitLocker's encryption keys.
26. **B)** — SSDs use flash memory (electronic), not magnetic storage, so degaussing has no effect.
27. **B) Leaving default admin credentials unchanged** — the most commonly exploited SOHO misconfiguration.
28. **B)** — WPS's PIN mechanism is vulnerable to brute-force attacks.
29. **B)** — incognito/private mode only prevents local history/cookie storage; it doesn't hide activity from the network or visited sites.
30. **B) Isolate/quarantine the machine from the network** — this comes before remediation to prevent spread/exfiltration.
31. **B)** — jailbreaking removes the OS sandboxing that MDM/corporate security policy depends on.
32. **C) Physical destruction** — the highest-assurance method, especially since degaussing doesn't work on SSDs.
33. **B) WPA2/WPA3-Enterprise** — uses 802.1X + RADIUS for individual user authentication.
34. **B)** — even admins run with a standard-user token by default; UAC elevation is required for admin-level actions, preventing silent privilege escalation by malware.

## Domain 3: Software Troubleshooting

35. **B) Identify the problem** — always the first step (gather info, question the user, duplicate if possible).
36. **B) Establish a new theory of probable cause** — go back to step 2, don't skip ahead to implementation.
37. **B) Documenting findings, actions, and outcomes** — step 6, frequently skipped but required.
38. **B) `DISM /Online /Cleanup-Image /RestoreHealth`** — repairs the underlying component store that `sfc` relies on; run before retrying `sfc`.
39. **B) System clock drift** — Kerberos authentication requires clocks within a tight tolerance (~5 minutes).
40. **B) Restart the Print Spooler service and clear the spool folder** — the standard first fix for stuck print jobs.
41. **B) A corrupted user profile** — causing a temporary/default profile to load; other accounts on the same machine work fine.
42. **B) Device is unusually hot, slow, and drains battery quickly** — classic cryptomining malware signature.
43. **B) Active malware disabled it** — a common malware behavior to avoid detection.
44. **B) Clearing cache** — less destructive than clearing data (which resets the app to a fresh-install state); try cache first.
45. **B) Forget the network and reconnect** — resolves a common stale/corrupted saved network profile issue.
46. **B) Data cap/throttling** — a simple, common, non-technical explanation to rule out first.
47. **B) A browser hijacker/malicious extension** — matches the symptom pattern of pop-ups, search engine changes, unfamiliar toolbars.
48. **B) Boot into Safe Mode and roll back the recent driver** — addresses the most likely cause (the recent driver update) with minimal disruption.

## Domain 4: Operational Procedures

49. **B) Priority/severity** — determines urgency of response.
50. **B)** — supports future troubleshooting, ticket continuity, and compliance/audit needs regardless of fix complexity.
51. **B) The Change Advisory Board (CAB)** — reviews and approves significant changes.
52. **B)** — provides a tested way to undo the change if it causes problems.
53. **C) Class C** — rated for electrical equipment fires.
54. **B) The full backup plus every incremental from Monday through Friday (6 total)** — incrementals require the last full plus every incremental since, unlike differentials which only need the latest one.
55. **B) 3 copies of data, on 2 different media types, with 1 copy off-site** — the standard backup best-practice rule.
56. **C) Preserve the evidence and report it through the proper chain of custody/escalation procedure** — never act on personal judgment, confront the customer, or delete anything.
57. **B)** — PII identifies a person generally; PHI is specifically health-related data under regulations like HIPAA.
58. **B)** — untested scripts with elevated permissions can cause unintended, large-scale, fast-moving damage.
59. **B)** — RDP exposed directly to the internet is a common target for brute-force/credential-stuffing attacks; it should sit behind a VPN.
60. **B) The OS and everything above it** — in IaaS, the provider manages only the underlying physical infrastructure.

---

## Scoring guide

- **54–60 correct (90%+)**: Exam-ready — do a final pass over any missed topics.
- **45–53 correct (75–89%)**: Solid foundation — review the specific domain(s) where you missed the most questions before scheduling the real exam.
- **Below 45 (under 75%)**: Revisit the relevant phase files for your weakest domain(s) and retake this exam before scheduling.

Track which question numbers you missed and cross-reference them against the phase file topic headers — each question maps back to a specific file in Phases 1–4.
