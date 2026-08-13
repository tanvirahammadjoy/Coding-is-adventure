# 06 — Mobile Device Security & Secure Data Destruction

**Domain:** 2.0 Security (28%)
**Maps to objectives:** 2.7 (mobile security), 2.8 (data destruction/disposal methods)

## Mobile device security

| Control                                           | Purpose                                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Screen lock (PIN/pattern/biometric)**           | First line of defense if device is lost/stolen                                              |
| **Remote wipe**                                   | Erase device data remotely — critical if recovery isn't possible                            |
| **Remote lock / Find My Device / Find My iPhone** | Locate, lock, or trigger wipe remotely                                                      |
| **Failed login attempt limits**                   | Auto-wipe or lockout after N failed attempts                                                |
| **Full-device encryption**                        | Standard on modern iOS/Android by default                                                   |
| **OS/app updates**                                | Patch known vulnerabilities — often neglected on personal devices                           |
| **App permission review**                         | Limit what data/hardware (camera, mic, location) each app can access                        |
| **Avoid sideloading / unknown sources**           | Apps outside official stores skip vetting — higher malware risk                             |
| **Jailbreaking/rooting risk**                     | Removes built-in OS security sandboxing — strongly discouraged on managed/corporate devices |
| **BYOD containerization**                         | Separates corporate data/apps from personal, so a wipe can target only the work profile     |
| **Firmware OTA (over-the-air) update management** | Enterprise policy may control/delay rollout for testing                                     |

**Exam trap:** "A corporate iPhone was jailbroken by the user for a custom feature." → This is treated as a security violation — jailbreaking bypasses the sandboxing/security model the corporate MDM policy depends on.

## Secure data destruction & disposal (very testable — know which method fits which media/requirement)

| Method                                                       | What it does                                                                                  | Best for                                                                            |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Standard formatting**                                      | Marks space as available, doesn't erase data                                                  | Not secure — data is recoverable with tools                                         |
| **Low-level format / secure erase**                          | Overwrites data at a firmware level                                                           | More thorough than a quick format                                                   |
| **Overwriting (multiple passes)**                            | Repeatedly writes random data over the drive                                                  | Traditional method for HDDs — less effective/relevant for SSDs due to wear-leveling |
| **Degaussing**                                               | Uses a strong magnetic field to scramble data on magnetic media                               | **HDDs and tapes only** — does **not** work on SSDs (no magnetic storage)           |
| **Physical destruction (shredding, drilling, incineration)** | Destroys the media so data is physically unrecoverable                                        | Highest assurance method, required for the most sensitive data                      |
| **Certificate of destruction**                               | Documentation from a vendor proving destruction occurred — needed for compliance/audit trails |

**Key exam trap:** Degaussing does **nothing** to an SSD — SSDs store data electronically (flash memory), not magnetically. For SSDs, use the drive's built-in **Secure Erase** command or physical destruction.

## Data disposal for cloud/SaaS accounts

- Deprovision the account (disable login, revoke tokens/API keys)
- Confirm data retention/deletion policy with the provider
- Export any data needed for compliance/records before deletion

## Quick self-check

1. Why is a standard "Format" not considered secure data destruction?
2. Why doesn't degaussing work on an SSD?
3. What's the highest-assurance data destruction method for extremely sensitive data?
4. What corporate security control does jailbreaking/rooting a device bypass?

<!-- markdownlint-disable MD033 -->
<details>
<summary>Answers</summary>

1. Formatting just marks the space as available for reuse — the underlying data remains and is recoverable with the right tools.
2. SSDs store data electronically in flash memory, not magnetically, so a magnetic field has no effect on the stored data.
3. Physical destruction (shredding, drilling, incineration).
4. The OS's built-in security sandboxing/permission model that MDM and app security depend on.

</details>
