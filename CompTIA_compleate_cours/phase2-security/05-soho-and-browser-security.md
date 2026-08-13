# 05 — SOHO Network Security & Browser Security

**Domain:** 2.0 Security (28%)
**Maps to objectives:** 2.5 (SOHO wireless/wired security), 2.6 (browser/web security)

## Securing a SOHO (Small Office/Home Office) router

Standard hardening checklist — very testable as a scenario ("a home router was just installed, what should you configure?"):

1. **Change the default admin username/password** — the #1 most-skipped step and most exploited
2. **Update firmware** to patch known vulnerabilities
3. **Change default SSID** (don't broadcast the make/model, which hints at known vulnerabilities) — and consider disabling SSID broadcast for lower visibility (weak security-by-obscurity, but still commonly tested)
4. **Enable WPA2/WPA3 encryption** (never WEP/WPA)
5. **Disable WPS** (Wi-Fi Protected Setup) — the PIN mechanism is vulnerable to brute force
6. **Enable the firewall** (usually on by default, verify it)
7. **Disable remote/WAN-side administration** unless specifically needed
8. **Set up a guest network** — isolates visitor devices from internal LAN resources
9. **MAC filtering** — allow-list specific device MACs (weak alone, since MACs can be spoofed, but adds a layer)
10. **Change default DHCP range / disable UPnP** if not needed — UPnP can let malware auto-open ports

## Content filtering & firewall rules

- **Content filtering**: block categories of sites (malicious, inappropriate) at the router or DNS level
- **Port forwarding**: opens a specific port to a specific internal device — only do this deliberately and narrowly (unused forwarded ports = attack surface)
- **DMZ (on consumer routers)**: exposes one device fully to the internet — last resort, high risk, avoid unless absolutely necessary

## Browser security

| Setting                                | Purpose                                                                                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Pop-up blocker**                     | Reduces malvertising/scam exposure                                                                                                      |
| **Password manager**                   | Encourages unique, strong passwords instead of reuse                                                                                    |
| **Ad blocker / tracking protection**   | Reduces malvertising and tracking exposure                                                                                              |
| **Private/incognito browsing**         | No local history/cookie retention — does **not** hide activity from the network/ISP                                                     |
| **Certificate warnings**               | Never train users to click through untrusted certificate warnings by habit                                                              |
| **Clearing cache/cookies**             | Common troubleshooting step for broken sites and a privacy hygiene step                                                                 |
| **Extensions/add-on review**           | Malicious browser extensions are a common attack vector — only install from official stores, review permissions requested               |
| **Secure connections (HTTPS/padlock)** | Verify before entering credentials — but note HTTPS alone doesn't guarantee a site is legitimate, only that the connection is encrypted |

**Exam trap:** "A user says incognito mode makes them anonymous online." → False — private browsing only prevents _local_ history/cookie storage; the ISP, network admin, and visited sites can still see/log activity.

## Quick self-check

1. What's the single most commonly exploited SOHO router misconfiguration?
2. Why should WPS be disabled?
3. What does a guest Wi-Fi network protect against?
4. Does HTTPS guarantee a website is legitimate/trustworthy?

<!-- markdownlint-disable MD033 -->
<details>
<summary>Answers</summary>

1. Leaving the default admin username/password unchanged.
2. Its PIN-based setup mechanism is vulnerable to brute-force attacks.
3. It isolates visitor/guest devices from the internal LAN and its resources.
4. No — it only guarantees the connection is encrypted, not that the site itself is trustworthy.

</details>
