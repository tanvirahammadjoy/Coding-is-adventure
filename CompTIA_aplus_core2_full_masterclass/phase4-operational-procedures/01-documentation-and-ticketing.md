# 01 — Documentation & Ticketing Systems

**Domain:** 4.0 Operational Procedures (21% of exam)
**Maps to objective:** 4.1 — Given a scenario, implement best practices associated with documentation and support systems information management

## Ticketing systems

| Field | Purpose |
|---|---|
| **User information** | Who reported it, contact info |
| **Device information** | Asset tag, model, serial number |
| **Description of problem** | Symptoms as reported by the user |
| **Category/severity/priority** | Routes to the right team, sets SLA expectations |
| **Escalation levels** | Tier 1 → Tier 2 → Tier 3, when a problem needs to go deeper |
| **Problem resolution / notes** | What was tried, what worked |
| **Progress notes** | Ongoing status updates while open |

## Asset management

- **Asset ID / inventory tags**: physical barcode/tag tied to a database record — enables tracking location, owner, warranty status
- **Procurement life cycle**: purchase → deployment → maintenance → retirement/disposal — track at every stage
- **Warranty/licensing tracking**: know what's covered and when support/licenses expire

## Knowledge base / articles

- Internal KB articles document known issues + fixes, standard operating procedures (SOPs) — reduces repeat troubleshooting time and supports level-1 techs handling more issues independently

## Types of documentation

| Document | Purpose |
|---|---|
| **Network topology diagrams** | Visual map of physical/logical network layout |
| **Regulatory/compliance requirements** | Industry-specific rules (HIPAA, PCI-DSS, etc.) that dictate handling procedures |
| **Incident reports** | Formal record of a security/safety incident, what happened, response taken |
| **Standard operating procedures (SOPs)** | Step-by-step approved processes for recurring tasks |
| **Splash screens / acceptable use policy (AUP)** | Displayed policy users must acknowledge (e.g., at login) |

## Why documentation matters (exam framing)

Documentation isn't busywork — it's tested because:
- It supports the final step of the troubleshooting methodology (Phase 3, file 1)
- It creates continuity when a ticket is escalated or reassigned
- It's often legally/contractually required (compliance, audits)
- It builds the knowledge base that speeds up future resolutions

## Quick self-check
1. What ticket field determines how urgently an issue is handled?
2. What's the difference between an SOP and an incident report?
3. Why is documenting even a "quick and easy" fix still required?
4. Name a document type users are commonly required to acknowledge before using a system.

<details>
<summary>Answers</summary>

1. Priority/severity.
2. SOP = a pre-approved standard process for how to do a recurring task; incident report = a record of a specific event that already happened.
3. It supports future troubleshooting (knowledge base), continuity if escalated, and may be required for compliance/audit purposes — regardless of how simple the fix felt.
4. Acceptable Use Policy (AUP) — often shown as a splash screen at login.
</details>
