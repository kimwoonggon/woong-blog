# Kinetic Minimalism Design System

This design system defines the visual language and interaction patterns for the **Woonggon Kim Portfolio & Blog**. It prioritizes clarity, motion, and a modern aesthetic ("Kinetic Minimalism").

## 1. Design Philosophy
- **Kinetic**: The interface feels alive with staggering entrance animations and smooth transitions.
- **Minimalism**: Content is king. Whitespace is used generously to create focus.
- **Modernity**: Uses current web trends like geometric sans-serifs, vivid accent colors, and bento/masonry grids.

---

## 2. Typography

We use a pairing of **Archivo** (variable weight, robust) for headings and **Space Grotesk** (geometric, technical) for body text.

### Font Families
| Role | Family | Variable | Usage |
|------|--------|----------|-------|
| **Headings** | `Archivo` | `--font-heading` | Page titles, section headers (`h1`, `h2`, `h3`) |
| **Body** | `Space Grotesk` | `--font-sans` | Paragraphs, UI labels, lists |
| **Code** | `Geist Mono` | `--font-mono` | Code blocks, technical specs, tags |

### Styles
- **H1 (Hero)**: `text-4xl md:text-6xl font-bold tracking-tight`
- **H2 (Section)**: `text-3xl md:text-4xl font-bold`
- **Body**: `text-base text-gray-600 dark:text-gray-300`
- **Small/Meta**: `text-sm text-gray-500 font-medium`

---

## 3. Color Palette

The palette uses **OKLCH** color space for perceptual uniformity. It supports both Light and Dark modes.

### Core Colors (Light Mode)
| Role | Color Name | Value (Approx Hex) | CSS Variable |
|------|------------|--------------------|--------------|
| **Background** | Vapor White | `#FAFAFA` | `--background` |
| **Foreground** | Deep Ink | `#2F2941` | `--foreground` |
| **Primary/Accent** | Accent Red | `#F3434F` | `--primary` |
| **Secondary** | Zinc-100 | `#F4F4F5` | `--secondary` |
| **Muted Text** | Text Secondary | `#4F4A63` | `--muted-foreground` |

### Core Colors (Dark Mode)
| Role | Color Name | Value (Approx Hex) | CSS Variable |
|------|------------|--------------------|--------------|
| **Background** | Deep Night | Dark Blue/Black | `--background` |
| **Foreground** | White | `#FFFFFF` | `--foreground` |
| **Primary/Accent** | Accent Red | `#F3434F` | `--primary` |
| **Card/Surface** | Surface Dark | Dark Gray | `--card` |

### CSS Variables (Source of Truth)
Refer to `src/app/globals.css` for exact `oklch()` values.

---

## 4. UI Components & Patterns

### Cards (Works & Blog)
- **Shape**: Rounded corners (`rounded-lg` or `border-radius: 0.625rem`).
- **Surface**:
  - Light: White (`bg-white`) with soft shadow (`shadow-sm`).
  - Dark: Dark Gray (`bg-gray-900`) with subtle border.
- **Hover**:
  - `hover:shadow-md`
  - Image scale: `group-hover:scale-105` (Works only)
  - Color shift: Title turns Primary Red on hover.

### Badges & Tags
- **Style**: Pill-shaped (`rounded-full` or `rounded-md`).
- **Background**: Secondary (`bg-gray-100` / `bg-[#142850]`).
- **Text**: Small, uppercase or medium weight.

### Layouts
1.  **Masonry Grid (Works)**:
    - Uses CSS Columns: `columns-1 md:columns-2 lg:columns-3`.
    - Items flow vertically and fill gaps.
2.  **List View (Blog)**:
    - Vertical stack of wide cards.
    - Focus on readability and scanning.

---

## 5. Animations ("Kinetic")

### Entrance Animation
- **Name**: `fadeInUp`
- **Description**: Elements fade in while moving up 20px.
- **Duration**: 0.8s ease-out.
- **Staggering**:
  - Hero elements have delays: 0ms (Image), 100ms (Headline), 200ms (Text).
  - List items have calculated delays based on index: `(index * 100) + 200`ms.

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Interactions
- **Focus Effect (Works)**:
  - Container class: `group/list`
  - Item class: `group-hover/list:opacity-40 hover:!opacity-100`
  - Result: When one item is hovered, others fade out to focus attention on the active item.

---

## 6. Implementation Notes
- **Framework**: Next.js 14+ (App Router).
- **Styling**: Tailwind CSS v4 (using `@theme` and CSS variables).
- **Icons**: Lucide React / simple-icons.
- **Data**: Supabase (PostgreSQL).

---
*Created by Antigravity Agent using ui-ux-pro-max skills.*
