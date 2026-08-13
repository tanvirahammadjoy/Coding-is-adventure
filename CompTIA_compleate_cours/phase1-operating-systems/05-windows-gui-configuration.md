# 05 — Control Panel & Settings App

**Domain:** 1.0 Operating Systems (28%)
**Maps to objective:** 1.6 — Given a scenario, use the appropriate Microsoft Windows 10/11 Control Panel or Settings item

Core 2 tests whether you know **where** a given configuration lives. Windows has two overlapping UIs (legacy Control Panel and the modern Settings app) — know both, and know which one is being retired for what.

## Control Panel applets (the legacy admin toolbox)

| Applet                         | Use                                                                                                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User Accounts**              | Manage Administrator/Standard/Guest accounts, local vs roaming profiles, credential management                                                       |
| **Programs and Features**      | Uninstall software, view installed updates, toggle Windows Features on/off (e.g., enable Hyper-V)                                                    |
| **Devices and Printers**       | Add/configure printers and devices, view print queues, install drivers                                                                               |
| **Internet Options**           | Legacy IE/Edge engine settings — security zones, connections, proxy                                                                                  |
| **Network and Sharing Center** | Adapter status, quick view of active networks, media streaming options                                                                               |
| **Windows Defender Firewall**  | Allow-list based: inbound/outbound rules per app/port/protocol, separate rules for private/public profiles                                           |
| **Mail**                       | Configure Outlook profiles, manage OST (offline) data files                                                                                          |
| **Sound**                      | Input/output device defaults, playback/recording testing, enhancements                                                                               |
| **System**                     | Advanced system properties — performance settings, virtual memory, DEP, System Protection (restore points), Remote Desktop/Remote Assistance toggles |
| **Device Manager**             | View/edit hardware, update/roll back/uninstall drivers                                                                                               |
| **Administrative Tools**       | Shortcuts into Computer Management, Component Services, Registry Editor, etc.                                                                        |
| **Indexing Options**           | Controls what File Explorer search indexes — tune for faster search on specific folders                                                              |
| **File Explorer Options**      | Show hidden files, single vs double-click, default view behaviors                                                                                    |
| **Power Options**              | Balanced/Power Saver/High Performance plans; advanced sleep/hibernate timers; ACPI states (see below)                                                |
| **Ease of Access**             | Accessibility: Narrator, high contrast, Magnifier, alternative input                                                                                 |

### ACPI power states (common exam recall item)

| State | Meaning                                                                         |
| ----- | ------------------------------------------------------------------------------- |
| S0    | Fully on                                                                        |
| S1–S3 | Various sleep states (S3 = "Suspend to RAM," the common modern "Sleep")         |
| S4    | Hibernate (suspend to disk — session saved, power off)                          |
| S5    | Soft off (fully powered off, but still receiving trickle power for Wake-on-LAN) |

## Settings app (modern, replacing Control Panel over time)

| Section                | Covers                                                                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Accounts**           | Sign-in options (PIN, biometric, password), sync settings across devices, email/accounts                                                            |
| **System**             | Display, sound, notifications, power/battery, "About" (specs, build number, rename PC)                                                              |
| **Update & Security**  | Windows Update, Windows Security (Defender), Backup, Troubleshoot, Recovery, Activation, Find My Device, Developer options, Windows Insider Program |
| **Network & Internet** | Status, data usage monitoring, adapter management, VPN, proxy, airplane mode                                                                        |
| **Devices**            | Bluetooth, printers/scanners, USB, mouse/typing, pen/Windows Ink                                                                                    |
| **Privacy**            | App permissions (camera, mic, location), advertising ID, diagnostics, activity history                                                              |
| **Time & Language**    | Date/time, time zone, region formats, speech                                                                                                        |
| **Personalization**    | Background, colors, lock screen, Start menu/taskbar layout                                                                                          |
| **Apps**               | Install/uninstall, default apps, startup items, optional features                                                                                   |
| **Gaming**             | Game Mode, Xbox Game Bar (recording/streaming), networking/latency options                                                                          |

**Exam trap:** "Where do you change what apps launch at startup?" → In modern Windows this moved to **Settings > Apps > Startup**, not just Task Manager's Startup tab (though Task Manager still shows/can disable them too — both are valid answers depending on the Windows version in the question).

## Quick self-check

1. Where do you enable/disable Windows Features like Hyper-V?
2. What ACPI state corresponds to Hibernate?
3. Which Settings section controls per-app camera/microphone permissions?
4. Where would you configure Windows Defender Firewall inbound/outbound rules?

<!-- markdownlint-disable MD033 -->
<details>
<summary>Answers</summary>

1. Control Panel > Programs and Features > "Turn Windows features on or off."
2. S4.
3. Settings > Privacy.
4. Control Panel > Windows Defender Firewall (Advanced Settings for granular rules).

</details>
