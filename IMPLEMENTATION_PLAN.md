# IMPLEMENTATION PLAN - Works Enhancement

## Project Goal
Refine the `works` feature to support project periods, icons, and flexible metadata properties. This includes database updates, admin editor enhancements, and public UI updates.

## Current Status
- [x] Initial research and specification update.
- [ ] Database schema updated (User: manual SQL).
- [/] Admin dashboard support for new columns.
- [ ] Public UI display for project periods.

## New Requirements (Added Mid-Project)
- Added `icon_asset_id`, `period`, and `all_properties` to `works` table.
- Display "프로젝트 기간" or "기간" in the public works list.

## Step-by-Step Plan
- [ ] **Database & Types**
  - [ ] Support `icon_asset_id` (UUID), `period` (Text), and `all_properties` (JSONB) in TypeScript interfaces.
- [ ] **Admin Dashboard (`/admin/works`)**
  - [ ] [MODIFY] `WorkEditor.tsx`: Add input field for `Period` and support for `icon`.
  - [ ] [MODIFY] `actions.ts`: Update server actions to persist new fields.
- [ ] **Public UI (`/works`)**
  - [ ] [MODIFY] `WorksList` / `WorkDetail`: Display the project period metadata.

## Verification Plan
1. **Admin Panel**:
   - Navigate to `/admin/works`.
   - Create/Edit a work and set a "Project Period" (e.g., "2024.01 - 2024.03").
   - Save and verify database persistence via Supabase dashboard or re-editing.
2. **Public View**:
   - Navigate to `/works`.
   - Verify that the "Project Period" (기간) is displayed correctly.
