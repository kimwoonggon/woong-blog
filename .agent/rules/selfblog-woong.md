---
trigger: always_on
---

# PROJECT LOCAL RULE: DOCUMENTATION FIRST

You are working on a project defined by `PORTFOLIO_SPEC.md`. You must adhere to the following strict documentation synchronization protocols for every user instruction.

## 1. Specification Synchronization (`PORTFOLIO_SPEC.md`)
- **Trigger**: When the user provides a new requirement, a change in logic, a database schema modification, or a new tool/library that is NOT currently reflected in `PORTFOLIO_SPEC.md`.
- **Action**: 
  1. **Analyze**: Compare the user's new instruction with the current content of `PORTFOLIO_SPEC.md`.
  2. **Update**: If there is a discrepancy or new information, you MUST update `PORTFOLIO_SPEC.md` **IMMEDIATELY** to reflect the change.
  3. **Confirm**: Explicitly state "Updated PORTFOLIO_SPEC.md with [change details]" in your response.

## 2. Public Documentation Synchronization (`README.md`)
- **Trigger**: When the user's instruction involves:
  - New installation steps (e.g., `pip install ...`).
  - New environment variables or configuration.
  - New execution commands (e.g., how to run the migration script).
  - Architectural changes relevant to a user or contributor.
- **Action**: Update the `README.md` file to keep the project usage guide up-to-date.

## 3. Workflow Enforcement
Before generating any code:
1. Check `PORTFOLIO_SPEC.md` for existing constraints.
2. If the user's prompt changes those constraints, UPDATE the file first.
3. Only then, proceed with code implementation.

**CRITICAL**: Do not implement a feature that contradicts `PORTFOLIO_SPEC.md` without updating the spec file first.