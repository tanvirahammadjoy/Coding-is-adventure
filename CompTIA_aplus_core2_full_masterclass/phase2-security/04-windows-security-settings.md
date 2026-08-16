# 04 — Windows OS Security Settings

**Domain:** 2.0 Security (28%)
**Maps to objective:** 2.4 — Given a scenario, configure and use appropriate Microsoft Windows security settings

## User Account Control (UAC)

Prompts for permission/credentials before an action requiring admin rights runs — even a logged-in administrator gets the prompt (runs as a "standard user token" until elevation is approved). This prevents malware from silently gaining admin rights.

- Adjustable via slider (Control Panel > User Accounts > Change UAC settings) — lowering it reduces prompts but weakens protection

## BitLocker & EFS — two different encryption layers

| Feature | Scope | Notes |
|---|---|---|
| **BitLocker** | Whole-drive encryption | Requires TPM (or a USB startup key as a workaround), Pro/Enterprise editions only |
| **EFS** (Encrypting File System) | Per-file/folder encryption | Tied to the user's Windows login certificate — if the profile/cert is lost without a recovery agent, the files are unrecoverable |

**Exam trap:** "A file encrypted with EFS won't open after the user's account was deleted and recreated with the same name." → New account = new certificate = can't decrypt old EFS files, even though the username matches. This is why an EFS **recovery agent** should be configured in advance.

## Windows Defender Firewall (deeper than Phase 1's overview)

- **Allow-list model**: nothing gets through unless a rule permits it
- Rules can be scoped by app, port, protocol, and profile (Domain/Private/Public)
- **Inbound rules**: control what's allowed to reach this machine
- **Outbound rules**: control what this machine is allowed to send out (less commonly restricted by default, but useful for containing malware)

## Windows Defender / Antivirus

- Real-time protection, cloud-delivered protection, periodic scanning
- **Controlled folder access**: blocks unauthorized apps (like ransomware) from modifying protected folders

## Group Policy security settings (local or domain)

- Password policy (length, complexity, history, max age)
- Account lockout policy
- User rights assignment (who can log in locally, remotely, as a service)
- Software restriction policies / AppLocker (allow-listing which apps can run)

## Secure boot & TPM

- **Secure Boot**: UEFI feature that only allows digitally signed, trusted bootloaders/OS to load — blocks bootkit-style malware
- **TPM** (Trusted Platform Module): hardware chip that securely stores encryption keys (used by BitLocker) and supports attestation of system integrity

## Windows Hello

Biometric/PIN-based sign-in tied to the specific device's TPM — the credential doesn't transmit like a traditional password, reducing exposure if intercepted.

## Quick self-check
1. Why does even a logged-in Administrator still see UAC prompts?
2. What's the practical difference between BitLocker and EFS in terms of what they protect?
3. Why would deleting and recreating a user account (same username) break access to that user's EFS-encrypted files?
4. What hardware feature does BitLocker rely on to store its encryption keys?

<details>
<summary>Answers</summary>

1. Administrators still run with a standard-user token by default; UAC elevation is required for any action needing full admin rights, to stop malware from silently escalating privileges.
2. BitLocker encrypts the entire drive/volume; EFS encrypts individual files/folders tied to a specific user certificate.
3. The new account generates a new certificate — since EFS decryption depends on the original certificate, not just the username, the new account can't decrypt the old files.
4. TPM (Trusted Platform Module).
</details>
