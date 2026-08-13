# 02 — Authentication, Authorization & Access Control

**Domain:** 2.0 Security (28%)
**Maps to objective:** 2.2 — Compare and contrast wireless security protocols and authentication methods (plus general AAA concepts tested throughout)

## The AAA framework

- **Authentication** — proving you are who you say you are (login)
- **Authorization** — what you're allowed to do once authenticated (permissions)
- **Accounting** — logging what was done and when (audit trail)

## Authentication factors

| Factor type            | Example                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| Something you **know** | Password, PIN, security question                                       |
| Something you **have** | Smart card, hardware token (YubiKey), authenticator app code, SMS code |
| Something you **are**  | Fingerprint, facial recognition, retina scan                           |
| Somewhere you **are**  | Geolocation/geofencing                                                 |
| Something you **do**   | Behavioral biometrics (typing pattern, gait)                           |

**MFA** requires factors from **at least two different categories** — two passwords is not MFA (both are "something you know"); a password + authenticator app code **is** MFA.

## Wireless security protocols (ranked oldest/weakest → newest/strongest)

| Protocol | Status                                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **WEP**  | Broken/obsolete — never recommend                                                                                                              |
| **WPA**  | Legacy, deprecated                                                                                                                             |
| **WPA2** | Still widely used; AES encryption (much stronger than WPA's TKIP)                                                                              |
| **WPA3** | Current standard — adds stronger encryption (SAE replaces the pre-shared key handshake), better protection against offline brute-force attacks |

**Enterprise vs Personal mode**: Personal (PSK) uses a shared passphrase for everyone; Enterprise mode uses **802.1X** with a RADIUS server for individual per-user authentication — far better for organizations (revoke one user without changing the Wi-Fi password for everyone).

## Account management / policy hardening

- **Account lockout policy**: threshold (e.g., 3 failed attempts), lockout duration, reset counter after X minutes — protects against brute-force login attempts
- **Password complexity/history/age policies**: enforced via Local Security Policy or domain GPO
- **Disabling default/guest accounts**: reduces attack surface
- **Time-of-day restrictions**: limit login windows for certain accounts
- **Screen lock / auto-lock timeout**: minimizes exposure if a user walks away

## Single sign-on (SSO)

One login grants access to multiple connected systems/services — improves user experience but means a compromised SSO credential is now a bigger blast radius, so it's almost always paired with MFA.

## Quick self-check

1. Is "password + PIN" considered MFA? Why or why not?
2. What's the practical operational advantage of WPA2/WPA3 Enterprise over Personal mode in a business?
3. What does an account lockout policy protect against?
4. Why is SSO almost always paired with MFA in practice?

<!-- markdownlint-disable MD033 -->
<details>
<summary>Answers</summary>

1. No — both are "something you know," so it's still single-factor even though it's two credentials.
2. Enterprise mode authenticates each user individually via 802.1X/RADIUS, so you can revoke one person's access without changing a shared passphrase for the whole organization.
3. Brute-force password guessing attacks.
4. Because SSO consolidates access to many systems behind one credential — if that credential is compromised without MFA, the attacker gets broad access at once.

</details>
