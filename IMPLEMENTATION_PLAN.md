# IMPLEMENTATION PLAN

## Project Goal
Implement an "AI Fix" feature in the Admin Blog Editor to automatically format and clean up blog posts using an LLM (GPT).

## Current Status
- Basic AI Fix feature implemented and verified.
- UI improvements requested: Draggable and Resizable window.

## Step-by-Step Plan
- [x] Install `openai` package.
- [x] Configure environment variables for Azure/OpenAI.
- [x] Create `/api/ai/fix-blog` route for handling GPT requests.
- [x] Create `AIFixDialog` component with Split View UI.
- [x] Integrate `AIFixDialog` into `BlogEditor`.
- [x] Refine `AIFixDialog` UI (Resizable panels, larger layout).
- [x] Test with sample messy content (text mixed with code and images).
- [x] Verify Code Block formatting and Image preservation.
- [x] Research reference repo `woong-azure-inference-demo-py3-typescript` for correct Azure config.
- [x] Refactor `/api/ai/fix-blog` to use `AzureOpenAI` client class.
- [x] Perform end-to-end browser verification of UI.
- [x] Document results in `walkthrough.md`.
- [x] Fix hydration error in `Navbar` component (Radix UI ID mismatch).
- [x] Improve `AIFixDialog` UI (Wider default size, prevent close on outside click).
- [x] Make `AIFixDialog` draggable and resizable using `react-rnd`.
    -   Install `react-rnd`.
    -   Modify `DialogContent` to act as a transparent overlay.
    -   Wrap inner interface in `Rnd` component.
    -   Configure `dragHandleClassName` for header dragging.
- [x] Fix hydration error in `AIFixDialog` (Radix UI `aria-controls` mismatch).
- [x] Refine `AIFixDialog` UI: Move "Apply Changes" to header, replace `ScrollArea` with native scrolling for better UX.

## Verification Plan
- **Manual Verification**:
    -   Open AI Fix Dialog.
    -   Drag the window by the header.
    -   Resize the window by dragging corners/edges.
    -   Verify interactions inside the dialog (scrolling, clicking) still work.
