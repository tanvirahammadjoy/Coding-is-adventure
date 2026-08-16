# 02 — Change Management

**Domain:** 4.0 Operational Procedures (21%)
**Maps to objective:** 4.2 — Explain basic change management best practices

## Why change management exists

Uncontrolled/undocumented changes are one of the top causes of outages. Change management forces a change through a formal, reviewed process **before** it touches production — even changes that seem small.

## The standard change process

1. **Document the purpose of the change** — what problem does it solve / what does it enable?
2. **Scope the change** — what exactly is being changed, what's the boundary?
3. **Risk analysis** — what could go wrong, how severe, how likely?
4. **Plan for change** — the actual implementation steps
5. **End-user acceptance** — who signs off that this change is wanted/expected
6. **Change board approval** — a **Change Advisory Board (CAB)** reviews and approves/rejects the change
7. **Backout plan** — the specific, tested steps to **undo** the change if something goes wrong
8. **Maintenance window** — scheduled time (usually off-hours) when the change will be implemented, minimizing user impact
9. **Sandbox testing** — test the change in an isolated, non-production environment first before touching production

## Key exam-tested concepts

- **Backout plan is mandatory** — a change without a tested rollback plan should not be approved. Exam scenario pattern: "a change was implemented and broke something; what should have been in place?" → a backout plan
- **Maintenance window** exists specifically to reduce business impact — changes shouldn't happen during peak business hours without strong justification
- **Sandbox testing** catches problems before they hit real users/systems — skipping this step is a common root cause in "what went wrong" scenario questions
- **Risk level classification** — some organizations classify changes as low/medium/high risk, which determines how much approval/review is required (a "standard" pre-approved low-risk change may skip full CAB review; high-risk changes require full review)

## Quick self-check
1. What board typically approves significant changes before implementation?
2. Why is a backout plan considered mandatory, not optional?
3. What's the purpose of a maintenance window?
4. What step catches problems with a change before it touches real users/production systems?

<details>
<summary>Answers</summary>

1. The Change Advisory Board (CAB).
2. Because if the change causes an unexpected problem, you need a tested, specific way to undo it quickly — without one, a bad change can leave systems broken with no clear recovery path.
3. To implement changes during a scheduled, typically off-hours window that minimizes disruption to business operations/users.
4. Sandbox testing (testing in an isolated, non-production environment first).
</details>
