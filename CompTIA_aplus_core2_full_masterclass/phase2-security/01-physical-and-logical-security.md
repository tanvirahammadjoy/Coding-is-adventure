# 01 — Physical & Logical Security Concepts

**Domain:** 2.0 Security (28% of exam)
**Maps to objective:** 2.1 — Summarize various security measures and their purposes

## Physical security controls

| Control | Purpose |
|---|---|
| **Badge/key fob access** | Restrict entry to authorized personnel; logs who entered/when |
| **Biometric locks** | Fingerprint/retina/facial — hard to share/steal like a badge, but not unbeatable |
| **Mantrap** | Double-door vestibule — the first door must close before the second opens, preventing tailgating |
| **Access control vestibule** | Modern term for mantrap on the exam |
| **Video surveillance / CCTV** | Deterrence + evidence, not prevention |
| **Alarm systems / motion sensors** | Detect unauthorized entry after hours |
| **Security guards / reception** | Human verification layer |
| **Equipment locks (cable locks, locking cabinets)** | Prevent theft of physical hardware (laptops, servers) |
| **Privacy/security screens** | Prevent shoulder surfing on monitors |
| **Locking racks / server room access control** | Restrict physical access to critical infrastructure |
| **Bollards** | Prevent vehicle-based attacks near a building entrance |

**Tailgating/piggybacking** = an unauthorized person following an authorized person through a secured door. Mantraps and security awareness training are the primary defenses.

## Logical (technical) security controls

| Control | Purpose |
|---|---|
| **Least privilege** | Users/accounts get only the access they need to do their job — nothing more |
| **Access control lists (ACLs)** | File/folder/network permission rules |
| **Multifactor authentication (MFA)** | Something you know (password) + something you have (token/phone) + something you are (biometric) |
| **Mobile device management (MDM)** | Enforce policy on managed devices (see Phase 1 mobile notes) |
| **Active Directory / directory services** | Centralized account and policy management for a domain |
| **Encryption (at rest & in transit)** | Protects data even if intercepted/stolen |
| **Firewalls (host-based & network)** | Filter traffic by rule (allow-list model on Windows Defender Firewall) |
| **Antivirus/anti-malware** | Detect/quarantine/remove malicious software |

## Social engineering — recognize the pattern, not just the term

| Term | Pattern |
|---|---|
| **Phishing** | Fraudulent email trying to get credentials/money/malware execution |
| **Spear phishing** | Phishing targeted at a specific individual using personal info |
| **Whaling** | Spear phishing targeted at executives/high-value targets |
| **Vishing** | Voice/phone-based social engineering |
| **Smishing** | SMS/text-based social engineering |
| **Shoulder surfing** | Visually observing sensitive info (passwords, screens) |
| **Tailgating** | Physically following someone through a secured door |
| **Impersonation** | Pretending to be someone with authority (IT support, executive) to extract info or access |
| **Dumpster diving** | Retrieving sensitive info from improperly discarded trash/documents |
| **Pretexting** | Fabricating a scenario/backstory to manipulate someone into giving info |

**Exam pattern:** these questions describe a scenario and ask you to *name the attack*. Learn the pattern (who's targeted, what channel, what's being manipulated), not just the definition.

## Zero-day and unpatched vulnerabilities

A **zero-day** = a vulnerability being actively exploited before the vendor has released (or even knows about) a patch. Mitigation isn't "patch it" (there's no patch yet) — it's layered defenses: network segmentation, intrusion detection/prevention, disabling the vulnerable feature/service if possible.

## Quick self-check
1. What physical control specifically stops tailgating?
2. What's the difference between phishing, spear phishing, and whaling?
3. What security principle says users should only get the access they need to do their job?
4. Why can't a zero-day vulnerability be fixed by "just patching"?

<details>
<summary>Answers</summary>

1. A mantrap / access control vestibule.
2. Phishing = broad/generic; spear phishing = targeted at a specific individual with personal details; whaling = spear phishing aimed at executives/high-value targets.
3. Principle of least privilege.
4. Because no patch exists yet at the time of exploitation — it must be mitigated with other layered defenses until the vendor releases one.
</details>
