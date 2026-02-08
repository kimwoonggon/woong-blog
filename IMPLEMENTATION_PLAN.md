# IMPLEMENTATION PLAN - Works Enhancement

## Project Goal
Refine the `works` feature to support project periods, icons, and flexible metadata properties. This includes database updates, admin editor enhancements, and public UI updates.

## Current Status
- [x] Initial research and specification update.
- [ ] Database schema updated (User: manual SQL).
- [/] Admin dashboard support for new columns.
- [ ] Public UI display for project periods.
- [ ] Fix missing excerpt/content in Works list.

## New Requirements (Added Mid-Project)
- Added `icon_asset_id`, `period`, and `all_properties` to `works` table.
- Display "프로젝트 기간" or "기간" in the public works list.
- **Urgent Fix**: Ensure works list displays actual content/excerpt correctly.

## Step-by-Step Plan
- [ ] **Database & Types**
  - [x] Support `icon_asset_id` (UUID), `period` (Text), and `all_properties` (JSONB) in TypeScript interfaces.
- [ ] **Admin Dashboard (`/admin/works`)**
  - [x] [MODIFY] `WorkEditor.tsx`: Add input field for `Period` and support for `icon`.
  - [x] [MODIFY] `actions.ts`: Update server actions to persist new fields.
  - [ ] **Bug Fix**: Review `generateExcerpt` logic in `actions.ts` to ensure it handles various HTML structures.
- [ ] **Public UI (`/works`)**
  - [x] [MODIFY] `WorksList` / `WorkDetail`: Display the project period metadata.
  - [ ] **Bug Fix**: Modify `WorksPage.tsx` to handle cases where `excerpt` might be empty or too short.

## Verification Plan
1. **Admin Panel**:
   - Re-save existing works to trigger auto-excerpt generation.
   - Verify `excerpt` column in Supabase (if possible).
2. **Public View**:
   - Navigate to `/works`.
   - Verify that all items have visible description text below the title.


## Verification Plan
1. **Admin Panel**:
   - Navigate to `/admin/works`.
   - Create/Edit a work and set a "Project Period" (e.g., "2024.01 - 2024.03").
   - Save and verify database persistence via Supabase dashboard or re-editing.
2. **Public View**:
   - Navigate to `/works`.
   - Verify that the "Project Period" (기간) is displayed correctly.
