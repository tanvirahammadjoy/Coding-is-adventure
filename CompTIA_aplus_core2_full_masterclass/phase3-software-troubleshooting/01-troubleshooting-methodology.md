# 01 — The CompTIA Troubleshooting Methodology

**Domain:** 3.0 Software Troubleshooting (23% of exam) / also underlies 4.0 Operational Procedures
**Applies to:** every troubleshooting scenario question on both Core 1 and Core 2

This 6-step method is the backbone of nearly every scenario question in this domain. Questions often describe a tech skipping a step incorrectly, or ask "what's the next step" mid-scenario — memorize the **order**, not just the list.

## The 6 steps

1. **Identify the problem**
   - Gather information from the user (open-ended questions, don't assume)
   - Duplicate the problem if possible, or have the user reproduce it
   - Identify symptoms, question users, identify changes (what changed recently?)
   - **Back up data before doing anything risky**, if not already done

2. **Establish a theory of probable cause**
   - Question the obvious first (loose cable, powered off, etc.)
   - Consider multiple theories if the first doesn't hold up

3. **Test the theory to determine the cause**
   - Once confirmed, determine the next step to resolve
   - **If the theory is not confirmed, establish a new theory or escalate**

4. **Establish a plan of action and implement the solution**
   - Consider the full impact of the fix (will it affect other systems/users?)
   - Refer to vendor documentation/knowledge base as needed

5. **Verify full system functionality and implement preventive measures if applicable**
   - Don't just confirm the immediate symptom is gone — check the *whole* system works
   - Consider what would prevent recurrence

6. **Document findings, actions, and outcomes**
   - Always the last step, always required — even if the fix seemed trivial

**Exam trap:** A question describes a tech who fixes the issue but doesn't tell the user what happened or update the ticket. → They skipped **step 6**, which is a required step, not optional.

**Exam trap 2:** A tech's first theory doesn't pan out during testing (step 3) — the correct next move is to **re-establish a new theory** (back to step 2), not jump straight to implementing a random fix.

## Why this file leads Phase 3

Every subsequent troubleshooting file in this phase (Windows issues, PC security symptoms, mobile issues) assumes you're applying this exact 6-step loop to the specific symptom set described. The domain-specific files below are essentially "theory of probable cause" reference tables for their respective symptom categories.

## Quick self-check
1. What's the very first step in the troubleshooting methodology?
2. If your first theory is tested and disproven, what do you do next?
3. Which step is most commonly skipped by technicians under time pressure, and why is skipping it a problem?
4. At step 5, what should you verify beyond just "the original symptom is gone"?

<details>
<summary>Answers</summary>

1. Identify the problem (gather info, question the user, duplicate if possible).
2. Go back and establish a new theory of probable cause (step 2) — don't skip ahead.
3. Step 6 (documentation) — skipping it means no record for future techs, no ticket history, and no data for identifying recurring issues.
4. Full system functionality — that the fix didn't break something else and the whole system, not just the one symptom, is working correctly.
</details>
