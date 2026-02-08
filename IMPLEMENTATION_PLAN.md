# Fix Hydration Error in InteractiveRenderer

## Goal
Prevent "Hydration failed" errors caused by users pasting full HTML documents (including `<html>`, `<head>`, `<body>` tags) into the content editor. The `InteractiveRenderer` should automatically strip these invalid root tags before rendering the content inside a `div`.

## User Review Required
None. This is a robust internal fix to handle invalid user input gracefully.

## Proposed Changes
### `src/components/content`
#### [MODIFY] [InteractiveRenderer.tsx](file:///Users/wgkim/selfblog-woong/src/components/content/InteractiveRenderer.tsx)
- Add a helper function `stripHtmlWrappers(html: string)` that removes `<!DOCTYPE ...>`, `<html>`, `</html>`, `<head>`, `</head>`, `<body>`, `</body>` tags using regular expressions.
- Apply this function to the `html` prop before rendering or parsing.
- Apply this function to `html-snippet` content before rendering.

## Verification Plan
### Manual Verification
1.  **Navigate** to the "Introduction" page editor or any page using `InteractiveRenderer`.
2.  **Paste** a full HTML structure into the content:
    ```html
    <!DOCTYPE html>
    <html>
    <body>
        <p>Test content verify</p>
    </body>
    </html>
    ```
3.  **Save** and **View** the page.
4.  **Verify** that the page renders "Test content verify" without crashing or showing a hydration error in the console.

## New/Changed Requirements
### Fix Introduction Visibility
- **Issue**: The `stripHtmlWrappers` regex fails to strip tags with whitespace (e.g., `< html>`), causing hydration errors. It also needs to preserve `<html-snippet>`.
- **Fix**: Update regex to handle optional whitespace and use negative lookahead to preserve `<html-snippet>`.
  - Proposed Regex: `/<\s*\/?\s*html(?!-)(?:\s[^>]*)?>/gi`
- **Target**: `src/components/content/InteractiveRenderer.tsx`.
