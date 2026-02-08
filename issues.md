# Resolved Issues

This document tracks technical issues that have been identified and resolved during development.

## 1. Deletion Functionality
- **Issue**: Delete buttons in the admin panel were visual-only and did not function.
- **Resolution**:
    - Implemented `DeleteButton` client component with confirmation dialog.
    - Added server actions `deleteWork` and `deleteBlog` in `actions.ts`.
    - Integrated button into admin tables.

## 2. Editor Data Persistence & Performance
- **Issue**:
    - Large content caused editor lag.
    - A 1000ms debounce on `onUpdate` caused data loss if the user saved immediately after typing.
- **Resolution**:
    - Replaced `lowlight/all` with `lowlight/common` (35 languages vs 190+) to reduce bundle size.
    - **Removed debounce**: `onChange` now fires immediately to ensure the latest content is always captured on save.

## 3. "Ghost" Items (Cache Invalidation)
- **Issue**: Deleted items remained visible on Home/List pages, leading to 404 errors when clicked.
- **Resolution**:
    - Added `revalidatePath('/', 'page')` to all create/update/delete actions to refresh the Home page.
    - Set `export const dynamic = 'force-dynamic'` on public Works/Blog list pages and Admin pages to prevent stale static rendering.

## 4. Unicode Slug Handling (Korean Titles)
- **Issue 1 (Revalidation)**: Updating posts with Korean titles caused `TypeError: Cannot convert argument to a ByteString`.
    - **Fix**: Encoded slugs in `revalidatePath` calls: `revalidatePath('/works/' + encodeURIComponent(slug))`.
- **Issue 2 (Routing)**: Accessing Korean URLs (e.g., `/works/ㅋㅋㅋ`) caused 404s and internal server errors (`negative time stamp`).
    - **Fix**: Added `decodeURIComponent(slug)` in `WorkDetailPage` and `BlogDetailPage` to correctly query the database with the raw Unicode string.

## 5. Error Handling
- **Issue**: Navigating to a non-existent URL caused a generic application crash.

## 6. Home Page Interactivity
- **Issue**: "Recent Posts" on the home page were not clickable, unlike the "Works" section.
- **Resolution**: Wrapped blog post titles in `Link` components in `src/app/(public)/page.tsx` to allow direct navigation to the post detail page.
