# 08 — Mobile OS & Device Connectivity

**Domain:** 1.0 Operating Systems (28%)
**Maps to objective:** 1.11 — Given a scenario, configure basic mobile device network connectivity and application support

## Connectivity types

| Type                               | Notes                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wi-Fi**                          | Standard connection setup — SSID, security type, saved networks                                                                                                                 |
| **Bluetooth**                      | Pairing process: discoverable mode → pair request → PIN/passkey confirm → connected. Common troubleshooting: device not discoverable, out of range, previously-paired conflicts |
| **NFC** (Near Field Communication) | Very short range (touch/tap) — used for mobile payments (Apple Pay/Google Pay), quick pairing                                                                                   |
| **Cellular data**                  | Managed through the carrier's APN (Access Point Name) settings; roaming toggles                                                                                                 |
| **Hotspot / tethering**            | Sharing the phone's cellular connection via Wi-Fi, Bluetooth, or USB                                                                                                            |
| **Airplane mode**                  | Disables all radios (cellular, Wi-Fi, Bluetooth) at once — Wi-Fi/Bluetooth can often be re-enabled individually afterward                                                       |
| **VPN**                            | Same concept as desktop — encrypted tunnel, configured under mobile network settings                                                                                            |

## Email configuration on mobile

| Protocol                      | Key trait                                                                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IMAP**                      | Syncs mail state (read/unread, folders) across all devices — mail stays on the server                                                               |
| **POP3**                      | Downloads mail to the device, often removing it from the server — poor for multi-device use                                                         |
| **Exchange ActiveSync (EAS)** | Corporate email + calendar + contacts sync, and the protocol used to push corporate security policies (PIN requirements, remote wipe) to the device |
| **S/MIME**                    | Adds digital signing/encryption to email                                                                                                            |

## Mobile device management (MDM) concepts

- **Corporate-owned vs BYOD**: different policy enforcement levels — corporate devices can be fully controlled, BYOD usually uses **containerization** (a separate encrypted work profile/app) to keep corporate and personal data apart
- **Profile/configuration push**: MDM tools push Wi-Fi, VPN, and email settings automatically without the user manually configuring anything
- **Remote wipe**: erase a lost/stolen device remotely — critical data-loss-prevention feature
- **App management**: MDM can push, restrict, or blacklist specific apps

## Common mobile app support scenarios

- App won't install → check available storage, OS version compatibility, region/store restrictions
- App crashes on launch → check for pending OS update, clear app cache/data, reinstall
- App won't sync → check background data/battery-optimization settings that may be pausing the app

## Quick self-check

1. Which email protocol should always be recommended for a user who checks mail on both a phone and a laptop?
2. What's the difference in security control between a corporate-owned mobile device and a BYOD device?
3. What does remote wipe protect against?
4. What very-short-range wireless tech is commonly used for mobile payments?

<!-- markdownlint-disable MD033 -->
<details>
<summary>Answers</summary>

1. IMAP (keeps state synced across devices, unlike POP3 which downloads and often removes mail from the server).
2. Corporate-owned devices can be fully managed/controlled by IT; BYOD typically uses a containerized work profile to separate corporate data from personal data/apps.
3. Data exposure from a lost or stolen device.
4. NFC.

</details>
