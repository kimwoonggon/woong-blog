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

# Design System Implementation

## Goal
Implement the "Kinetic Minimalism" design system approved by the user, including new color palette, typography (Archivo + Space Grotesk), layout changes (Masonry for Works), and entrance animations.

## User Review Required
- **Visual Regression**: The color palette change is significant. User should verify the "Vapor White" background vs "Pure White" cards manually.

## Proposed Changes
### `src/app`
#### [MODIFY] [globals.css](file:///Users/wgkim/selfblog-woong/src/app/globals.css)
- Update CSS variables to new color palette (Deep Ink, Electric Red, Vapor White).
- Update font variables.

#### [MODIFY] [layout.tsx](file:///Users/wgkim/selfblog-woong/src/app/layout.tsx)
- Import `Archivo` and `Space Grotesk` from `next/font/google`.
- Configure them with `variable` property.
- Add their variable classes to `body` or `html`.

#### [MODIFY] [page.tsx](file:///Users/wgkim/selfblog-woong/src/app/page.tsx)
- Add staggered animation classes (using `animate-in` utilities or custom `tw-animate-css` classes) to Hero elements.

### `src/app/works`
#### [MODIFY] [page.tsx](file:///Users/wgkim/selfblog-woong/src/app/works/page.tsx)
- Replace- [x] Refactor Works Page (Masonry Layout)
- [ ] Comprehensive UI Verification
    - [ ] Home Page
    - [ ] Works Page
    - [ ] Blog Page
    - [ ] Introduction Page
    - [ ] Contact Page
    - [ ] Resume Page
    - [x] Resume Page
    - [ ] Admin Panel Recursive Verification
        - [ ] Dashboard
        - [ ] Works (List & Detail)
        - [ ] Blog (List & Detail)
        - [ ] Pages (List & Detail) implementation.
- Use CSS columns (`columns-1 md:columns-2 lg:columns-3`) for simplicity and performance.

## Verification Plan
### Manual Verification
1.  **Fonts**: Open DevTools on localhost:3000. Verify `font-family` parses to `Archivo` for headings and `Space Grotesk` for body.
2.  **Colors**: Verify background is `#FAFAFA` and text is `#2F2941`.
3.  **Home Animation**:
    - Reload root page.
    - Confirm Profile Image appears first.
    - Confirm Headline appears ~100ms later.
    - Confirm Subtext appears ~100ms after headline.
4.  **Works Masonry**:
    - Navigate to `/works`.
    - Verify cards dovetail into each other.
    - Resize window to check responsiveness.
