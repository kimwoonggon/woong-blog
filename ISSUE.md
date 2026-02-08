# Issue Tracking

## [2026-02-09 00:44] Introduction Page Hydration Error
- **Issue**: The Introduction page's `<html-snippet>` content caused hydration errors (`Hydration failed because the server rendered HTML didn't match the client`). This resulted in:
  - Empty content area (Profile Card not visible)
  - Console errors about invalid `<html>` tag nesting
  - SSR/Client mismatch warnings

- **Root Cause**: 
  1. `html-react-parser` inserts `<html>`, `<head>`, `<body>` wrapper tags when parsing HTML fragments
  2. These wrapper tags are invalid inside React's component tree (`<html>` cannot be a child of `<div>`)
  3. Using multiple `<span dangerouslySetInnerHTML>` elements for "before/after" text caused SSR/Client mismatch

- **Solution**: Replaced `html-react-parser` with regex-based parsing in `InteractiveRenderer.tsx`:
  - Extract `html-snippet` content using regex
  - Decode HTML entities with pure regex (consistent SSR/Client)
  - Render with single `dangerouslySetInnerHTML` (no mismatch)

- **Status**: ✅ Resolved

- **Files Modified**:
  - `src/components/content/InteractiveRenderer.tsx`
