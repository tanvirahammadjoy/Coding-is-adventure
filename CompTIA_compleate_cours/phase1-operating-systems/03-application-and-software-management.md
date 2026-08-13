# 03 — Application Installation & Software Management

**Domain:** 1.0 Operating Systems (28%)
**Maps to objective:** 1.10 — Given a scenario, configure applications on OS platforms

## Application requirements to check before installing

- **CPU architecture**: 32-bit vs 64-bit — a 32-bit app runs on 64-bit Windows (installs to `C:\Program Files (x86)`), but a 64-bit app will not run on 32-bit Windows at all
- **Memory / storage**: minimum RAM, free disk space
- **Graphics**: dedicated VRAM requirements for CAD/gaming/creative apps
- **External hardware tokens**: some enterprise software (licensing dongles, security keys) requires a physical USB token to run at all

## Distribution methods

| Method                                                     | Notes                                                                                                                 |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| App stores (Microsoft Store, Apple App Store, Google Play) | Sandboxed, vetted, auto-updating — safest default for end users                                                       |
| Physical media                                             | Legacy, still seen in some enterprise/offline environments                                                            |
| Downloadable installers (.exe/.msi/.dmg/.pkg)              | Verify via **digital signature/certificate** before running — unsigned installers are a red flag                      |
| ISO mounting                                               | Common for OS images and large enterprise software suites — Windows can mount ISOs natively without third-party tools |

**Security note**: always verify a downloaded installer's digital certificate/signature matches the vendor before running it — this is one of the most testable "safe installation" practices on Core 2.

## Business impacts of installing/upgrading software

- **Licensing models**: single-user, multi-user/volume, family, enterprise (site license) — picking the wrong one is a compliance/cost issue, not just technical
- **Support**: does IT now need to support a new app long-term?
- **Training**: end users may need onboarding time, which is a real cost to the business

## Operational impacts (how you deploy it)

- **Manual installs**: fine for one-off machines, doesn't scale
- **Automated deployment**: Group Policy Objects (GPO software deployment), Windows Deployment Services, Apple Business Manager (for macOS/iOS fleets) — used when rolling out to many machines

## Device impacts

Before deploying widely, **test against a performance baseline**. A memory-hungry or disk-intensive app can silently degrade an otherwise healthy fleet of machines — this is why baselining matters (ties back to Performance Monitor, covered later).

## Network impacts

A poorly-planned software rollout (e.g., every machine downloading a large installer or definition update at once) can **bottleneck the network or cause a denial-of-service-like effect**. Best practices:

- Cap per-device bandwidth usage during rollout (a commonly cited example figure is capping around 100 Mbps per stream)
- **Stagger deployments** across time/groups instead of pushing to everyone simultaneously

## Quick self-check

1. Where does a 32-bit application install on a 64-bit Windows system?
2. What should you verify before trusting a downloaded installer?
3. Name two enterprise tools used to push software to many machines automatically.
4. Why would you stagger a software rollout across a network instead of deploying to all machines at once?

<!-- markdownlint-disable MD033 -->
<details>
<summary>Answers</summary>

1. `C:\Program Files (x86)`.
2. Its digital signature/certificate matches the legitimate vendor.
3. GPO software deployment (Windows) and Apple Business Manager (Apple), among others like Windows Deployment Services.
4. To avoid bottlenecking/saturating network bandwidth and causing a denial-of-service-like slowdown for other users.

</details>
