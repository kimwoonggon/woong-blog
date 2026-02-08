---
trigger: manual
---

# GLOBAL RULE: IMPLEMENTATION PLAN & ISSUE TRACKING

You are an AI developer who strictly follows a "Plan-First" approach. You must adhere to the following rules regarding the Implementation Plan and Issue Tracking for every session.

## 1. Single Source of Truth: `IMPLEMENTATION_PLAN.md`
- **Mandatory File**: You must maintain a file named `IMPLEMENTATION_PLAN.md` in the project root.
- **Initialization**: At the start of any conversation, check if this file exists.
  - If NO: Create it immediately based on `PORTFOLIO_SPEC.md` and the current user request.
  - If YES: Read it to understand the current context and progress.

## 2. Specification Synchronization (`PORTFOLIO_SPEC.md`)
- **Continuous Alignment**: Before updating the plan, always cross-reference `PORTFOLIO_SPEC.md`.
- **Non-Destructive Merge Strategy**:
  - If `PORTFOLIO_SPEC.md` contains new requirements not in the plan, **APPEND** them to the `IMPLEMENTATION_PLAN.md`.
  - **CRITICAL**: Never overwrite or delete existing completed tasks (`[x]`) or strictly internal notes in `IMPLEMENTATION_PLAN.md` when syncing. Only **add** missing items or **update** specific changed logic. Preserve the history.

## 3. Dynamic Update Protocol
- **Immediate Reflection**: If the user provides a NEW instruction:
  1. **Stop**: Do not write code for the feature yet.
  2. **Update Plan**: Modify `IMPLEMENTATION_PLAN.md` to include the new steps, ensuring alignment with `PORTFOLIO_SPEC.md`.
  3. **Save**: Write the updated plan to disk.
  4. **Execute**: Proceed with coding only after the plan is saved.

## 4. Issue Tracking (`ISSUE.md`)
- **Mandatory File**: You must maintain a file named `ISSUE.md` to track bugs and blockers.
- **Cumulative Logging**:
  - **Trigger**: When a bug, build error, or unexpected behavior occurs during the "Verification" phase.
  - **Action**: Detailedly log the issue in `ISSUE.md`.
  - **Constraint**: **NEVER OVERWRITE** the existing history in `ISSUE.md`. Always **APPEND** new issues to the bottom of the file with a timestamp.

## 5. File Structures

### A. `IMPLEMENTATION_PLAN.md`
- **Project Goal**: Brief summary of the objective (derived from `PORTFOLIO_SPEC.md`).
- **Current Status**: Brief note on what is being worked on.
- **Step-by-Step Plan**: Detailed breakdown with checkboxes (`- [ ]`, `- [x]`).
- **New/Changed Requirements**: A section log for requirements added mid-project.

### B. `ISSUE.md`
- **[Date/Time]**: Timestamp of the issue.
- **Issue**: Short description of the error or bug.
- **Status**: Open / Resolved.
- **Solution/Note**: How it was fixed or what is being attempted.

**VERIFICATION:**
Before generating any functional code, ask yourself:
1. "Is this task represented in `IMPLEMENTATION_PLAN.md`?"
2. "Have I synced any new specs from `PORTFOLIO_SPEC.md` without deleting previous history?"
3. "If there was a previous error, is it logged in `ISSUE.md`?"