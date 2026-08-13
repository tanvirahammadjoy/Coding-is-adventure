# 04 — Windows Networking Configuration

**Domain:** 1.0 Operating Systems (28%)
**Maps to objective:** 1.7 — Given a scenario, configure Microsoft Windows networking features

## Connection types

| Type                | Key config points                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wired**           | Cat 6/6a/7 UTP, gigabit Ethernet is the current baseline; check Device Manager for adapter status; **Wake-on-LAN** lets a powered-down machine be woken remotely via a magic packet |
| **Wireless (WLAN)** | 802.11 standards, manage via "known networks," set privacy (public/private), DHCP vs static, WPA2/WPA3 security                                                                     |
| **WWAN** (cellular) | Cellular modems/hotspots — watch data caps, throttling, overage fees; Windows lets you mark a connection as **metered** to restrict background data usage                           |
| **VPN**             | Tunnels traffic from an untrusted network (coffee shop Wi-Fi) to a private/office network securely; verify your public IP changes to the VPN's exit IP once connected               |

## Network client configuration — the four essentials

Every IP client needs, either via DHCP (automatic) or manually:

1. **IP address**
2. **Subnet mask**
3. **Default gateway**
4. **DNS server(s)**

You can mix and match — e.g., static IP with DHCP-assigned DNS is possible but uncommon; usually it's all-DHCP or all-manual.

## Network locations (Public vs Private)

Windows prompts for a network location the first time you join a network — this controls:

- **Discoverability**: private networks allow device discovery (file/printer sharing); public networks hide the machine from others on the same network
- **Firewall profile**: different rule sets apply automatically depending on which profile is active (e.g., port 80/web-related exceptions differ)

**Exam trap:** A user connects a laptop to a hotel Wi-Fi and marks it "Public" by habit — but then can't find their office printer over VPN. That's expected: Public disables discovery/sharing by design.

## Proxy settings

A proxy server sits between the client and the internet to provide:

- Content filtering
- Logging/monitoring
- Caching (faster repeat access to common resources)

Configure via Settings > Network > Proxy, or `Internet Options` (legacy Control Panel applet). You can set **exemptions** for specific sites/addresses that should bypass the proxy (common for internal intranet sites).

## Quick self-check

1. What are the four core pieces of IP configuration a client needs to reach the network/internet?
2. Why would marking a WWAN connection as "metered" matter?
3. What's the practical difference in behavior between a Public and a Private network profile in Windows?
4. Name two benefits of routing traffic through a proxy server.

<!-- markdownlint-disable MD033 -->
<details>
<summary>Answers</summary>

1. IP address, subnet mask, default gateway, DNS server.
2. It restricts background data usage (updates, syncing) to avoid overage fees/throttling on limited cellular data plans.
3. Private allows device discovery and file/printer sharing with different firewall rules; Public disables discovery and applies stricter firewall rules by default.
4. Content filtering and caching (also logging/monitoring).

</details>
