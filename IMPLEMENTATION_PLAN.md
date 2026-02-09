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

# CI/CD Pipeline Setup

## Goal
Establish a robust CI/CD pipeline using GitHub Actions to verify builds via Docker and deploy to Vercel automatically on changes to `main`.

## User Review Required
- **Secrets**: User must add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` to GitHub Repository Secrets.

## Proposed Changes
### Configuration
#### [MODIFY] [next.config.ts](file:///Users/wgkim/selfblog-woong/next.config.ts)
- Add `output: 'standalone'` to enable optimized Docker builds.

### Project Root
#### [NEW] [Dockerfile](file:///Users/wgkim/selfblog-woong/Dockerfile)
- Multi-stage build: `deps`, `builder`, `runner`.
- Uses `node:20-alpine`.

#### [NEW] [.dockerignore](file:///Users/wgkim/selfblog-woong/.dockerignore)
- Exclude `node_modules`, `.next`, `.git`, local env files.

#### [NEW] [.github/workflows/ci-cd.yml](file:///Users/wgkim/selfblog-woong/.github/workflows/ci-cd.yml)
- Job 1: Build Docker image (CI).
- Job 2: Deploy to Vercel (CD) - dependent on Job 1, runs on `main` only.

## Verification Plan
### Automated
- **CI Run**: Push these changes to a branch and verify the GitHub Action "Build Check (Docker)" passes.
- **CD Run**: Merge to `main` and verify "Deploy (Vercel)" runs and successfully deploys to Vercel.

### Manual
- [x] **Local Docker Build**: Run `docker build -t test-build .` locally to verify Dockerfile correctness before pushing.

# Code Review Strategy

## Goal
Establish a comprehensive code review strategy to ensure code quality, security, and adherence to the project specification across frontend, backend, database, and CI/CD layers.

## proposed Changes
### Documentation
#### [NEW] [CODE_REVIEW_STRATEGY.md](file:///Users/wgkim/.gemini/antigravity/brain/67b7c83c-751c-4b38-b022-f9381141d112/CODE_REVIEW_STRATEGY.md)
- Created a detailed strategy document covering:
  - Automated Checks (Linting, Types, Build)
  - Frontend Review (Architecture, Performance, UI/UX)
  - Backend & API Review (Security, Logic)
  - Database Review (RLS, Indexes)
  - CI/CD & DevOps
  - Project Specification Alignment

## Verification Plan
### Manual Verification
- [x] **Review Document**: Verify that `CODE_REVIEW_STRATEGY.md` covers all requested areas (frontend, backend, database, api, ci/cd, ui).

# Code Review Fixes

## Goal
Address critical issues identified in the [Code Review Report](file:///Users/wgkim/.gemini/antigravity/brain/67b7c83c-751c-4b38-b022-f9381141d112/CODE_REVIEW_REPORT.md).

## Proposed Changes
### Priority 1: Linting Fixes
#### [MODIFY] [Navbar.tsx](file:///Users/wgkim/selfblog-woong/src/components/layout/Navbar.tsx)
- Fix `useEffect` state update issue causing `react-hooks/set-state-in-effect` error.
- Extract `useMounted` hook if necessary or use a ref-safe approach.

### Priority 2: API Validation
#### [MODIFY] [src/app/api/admin/pages/route.ts](file:///Users/wgkim/selfblog-woong/src/app/api/admin/pages/route.ts)
#### [MODIFY] [src/app/api/admin/site-settings/route.ts](file:///Users/wgkim/selfblog-woong/src/app/api/admin/site-settings/route.ts)
#### [MODIFY] [src/app/api/uploads/route.ts](file:///Users/wgkim/selfblog-woong/src/app/api/uploads/route.ts)
- Implement `zod` schema validation for all request bodies.

## Verification Plan
### Automated
- [ ] **Lint**: `npm run lint` passes with 0 errors.
- [ ] **Type Check**: `npm run type-check` passes.

# System Architecture Analysis

## Goal
Analyze and document the current system architecture, focusing on Frontend (Next.js App Router), Backend (API Routes), Database (Supabase), and CI/CD pipelines to ensure scalability and maintainability.

## Proposed Changes
### Documentation
#### [NEW] [ARCHITECTURE.md](file:///Users/wgkim/selfblog-woong/ARCHITECTURE.md)
- Comprehensive analysis covering:
  - High-Level System Overview (Mermaid Diagram)
  - Frontend Architecture (Tech Stack, Component Structure)
  - App Router & Navigation (Routing Map, SSR vs CSR)
  - Database Architecture (Schema ERD, RLS Policies)
  - CI/CD Pipeline (GitHub Actions Workflow)

## Verification Plan
### Manual Verification
- [x] **Review Document**: Verify `ARCHITECTURE.md` is accurate and diagrams render correctly.

