<project_specification>
  <project_name>JOHN_PORTFOLIO_V2</project_name>

  <overview>
    <paragraph_1>
      This project is a personal portfolio website that supports both web and mobile layouts. Anonymous visitors can freely browse Home, Introduction, Works, Work Detail, Blog, Blog Detail, Contact, and Resume pages without logging in.
    </paragraph_1>
    <paragraph_2>
      An administrator can sign in with Google OAuth and manage all content: edit single pages (Home/Introduction/Contact) with inline editing, create/update/delete Works and Blog posts, upload attachments (images/PDF/audio) to Supabase Storage, and view page-view analytics in an Admin dashboard.
    </paragraph_2>
    <paragraph_3>
      CRITICAL: All authorization MUST be enforced by Supabase Postgres RLS (and Storage RLS on storage.objects). UI hiding is for UX only and must not be relied upon for security. Public users are anonymous readers by default; only admin can write or upload.
    </paragraph_3>
  </overview>

  <technology_stack>
    <frontend_application>
      <framework>Next.js 15.1 (App Router) + React 19 + TypeScript 5.7</framework>
      <build_tool>Turbopack (Next.js built-in)</build_tool>
      <styling>Tailwind CSS v4 + shadcn/ui (latest)</styling>
      <routing>Next.js App Router (file-based routing with Route Groups)</routing>
      <state_management>Zustand v5 for client state; TanStack Query v5.62 for server state</state_management>
      <forms>React Hook Form v7.54 + Zod v3.24 for validation</forms>
    </frontend_application>

    <data_layer>
      <database>Supabase Postgres (managed)</database>
      <client>supabase-js v2.49 with generated TypeScript types</client>
      <file_storage>Supabase Storage (images, PDF, audio)</file_storage>
      <realtime>Supabase Realtime (optional; for future collaborative editing)</realtime>
      <vector_search>pgvector extension (future: embeddings for sources/search)</vector_search>
      <note>CRITICAL: All tables and storage access must be protected by RLS policies to isolate data by role (admin vs public).</note>
    </data_layer>

    <backend>
      <runtime>Next.js Route Handlers under app/api/* (Edge runtime where applicable)</runtime>
      <auth>Supabase Auth (Google OAuth 2.0)</auth>
      <api_style>REST endpoints with optional streaming responses</api_style>
    </backend>

    <libraries>
      <ui_icons>lucide-react (via shadcn/ui)</ui_icons>
      <pdf_viewer>react-pdf (recommended) for /resume PDF rendering</pdf_viewer>
      <dnd>@dnd-kit/core (recommended) for editor drag-and-drop blocks</dnd>
      <charts>Recharts (recommended) for admin analytics charts</charts>
      <testing_unit>Vitest + Testing Library</testing_unit>
      <testing_e2e>Playwright</testing_e2e>
    </libraries>

    <build_output>
      <build_command>npm run build</build_command>
      <output_directory>.next/</output_directory>
      <deployment>Vercel (recommended) or any Node.js hosting</deployment>
      <environment_variables>
        - NEXT_PUBLIC_SUPABASE_URL
        - NEXT_PUBLIC_SUPABASE_ANON_KEY
        - SUPABASE_SERVICE_ROLE_KEY (server-only)
        - GEMINI_API_KEY (optional; for AI features)
      </environment_variables>
    </build_output>
  </technology_stack>

  <prerequisites>
    <environment_setup>
      - Node.js: v20 LTS
      - Package manager: npm
      - Supabase project created (Postgres + Auth + Storage enabled)
      - Storage buckets created: public-assets (Public), public-resume (Public)
      - Google OAuth provider configured in Supabase Auth
      - Vercel project configured with environment variables
    </environment_setup>
    <build_configuration>
      - Enable RLS on all public tables and on storage.objects
      - Apply schema.sql (tables + indexes + policies + auth trigger)
      - Set up GitHub Actions CI (lint + typecheck + unit + build; optional e2e in Docker)
    </build_configuration>
  </prerequisites>

  <core_data_entities>

    <profiles>
      - id: uuid (PK, references auth.users.id, on delete cascade)
      - email: string (nullable)
      - role: enum (admin, user) (required, default user)
      - created_at: timestamptz (default now)
      - updated_at: timestamptz (default now)
      Indexes: [role]
      Relationships: auth.users(1) — profiles(1)
    </profiles>

    <assets>
      - id: uuid (PK)
      - bucket: string (required; e.g., public-assets, public-resume)
      - path: string (required; object key/path)
      - mime_type: string (nullable)
      - size: number (int64, nullable)
      - kind: enum (image, pdf, audio, other) (required)
      - created_by: uuid (nullable, references auth.users.id)
      - created_at: timestamptz (default now)
      Indexes: [bucket+path unique]
      Relationships: assets referenced by pages/site_settings/blogs/works
    </assets>

    <site_settings>
      - singleton: boolean (PK, must always be true)
      - owner_name: text (default 'John Doe') - displayed in Navbar, Footer, page title
      - tagline: text (default 'Creative Technologist') - displayed in metadata
      - facebook_url: text (default '') - Facebook profile/page URL
      - instagram_url: text (default '') - Instagram profile URL
      - twitter_url: text (default '') - Twitter profile URL
      - linkedin_url: text (default '') - LinkedIn profile URL
      - github_url: text (default '') - GitHub profile URL
      - profile_asset_id: uuid (nullable, FK -> assets.id)
      - resume_asset_id: uuid (nullable, FK -> assets.id)
      - updated_at: timestamptz (default now)
      Constraints: singleton check (= true)
      Note: Social URLs displayed as icons in footer; empty URLs hide the icon
    </site_settings>

    <pages>
      - id: uuid (PK)
      - slug: enum (home, introduction, contact) (required, unique)
      - title: string (nullable)
      - content: jsonb (required, default {})
      - hero_asset_id: uuid (nullable, FK -> assets.id)
      - updated_at: timestamptz (default now)
      Indexes: [slug unique]
      Note: content is used for inline edits for these “single pages”.
    </pages>

    <works>
      - id: uuid (PK)
      - slug: string (required, unique)
      - title: string (required)
      - excerpt: string (auto-generated from content)
      - content: jsonb (required, default { "html": "" })
      - thumbnail_asset_id: uuid (nullable, FK -> assets.id)
      - category: string (nullable)
      - tags: string[] (default [])
      - published: boolean (required, default false)
      - published_at: timestamptz (nullable, managed by system)
      - created_at: timestamptz (default now)
      - updated_at: timestamptz (default now)
      Indexes: [published+published_at desc], [slug unique]
    </works>

    <blogs>
      - id: uuid (PK)
      - slug: string (required, unique)
      - title: string (required)
      - excerpt: string (auto-generated from content)
      - content: jsonb (required, default { "html": "" })
      - cover_asset_id: uuid (nullable, FK -> assets.id)
      - tags: string[] (default [])
      - published: boolean (required, default false)
      - published_at: timestamptz (nullable, managed by system)
      - created_at: timestamptz (default now)
      - updated_at: timestamptz (default now)
      Indexes: [published+published_at desc], [slug unique]
    </blogs>

    <page_views>
      - id: int64 (PK, bigserial)
      - entity_type: enum (page, work, blog, resume) (required)
      - entity_id: uuid (nullable; required for work/blog)
      - path: string (required; e.g., /works/my-work)
      - session_id: uuid (required; cookie-based)
      - viewed_on: date (required; default current_date)
      - user_agent: string (nullable)
      - referrer: string (nullable)
      - created_at: timestamptz (default now)
      Constraints: unique(entity_type, entity_id_or_zero_uuid, path, session_id, viewed_on)
      Indexes: [entity_type+entity_id+viewed_on]
    </page_views>

  </core_data_entities>

  <pages_and_interfaces>

    <global_layout>
      <top_navigation>
        Desktop:
        - Height: 64px; Padding: 0 24px; Max content width: 1024px; Centered
        - Links order: Home (/), Introduction (/introduction), Works (/works), Blog (/blog), Contact (/contact), Resume (/resume)
        - Active link underline: 2px solid #F3434F
        - Hover: text color to #F3434F with 120ms ease-out
        Mobile:
        - Height: 56px; Padding: 0 16px
        - Left hamburger button opens drawer (Sheet)
        - Drawer width: 320px; Overlay: rgba(0,0,0,0.5)
        - Drawer animation: 180ms ease-out
        Admin visibility:
        - Admin link (/admin) appears ONLY when server-side isAdmin = true
      </top_navigation>

      <main_content>
        - Base padding: 24px desktop, 16px mobile
        - Page max width: 1024px desktop, 100% mobile
        - Loading state: skeleton blocks (min 600ms to avoid flicker)
        - Error state: centered message + retry button
      </main_content>

### Resume Management
- [x] Resume Management (Upload/Delete PDF) <!-- id: resume -->
- **Upload**: PDF file upload via Admin Panel (`/admin/pages`).
- **Storage**: Files stored in `public-resume` Supabase bucket.
- **Reference**: Managed via `site_settings.resume_asset_id` referencing `assets` table.
- **Display**: Rendered on `/resume` using an `<iframe>` viewer with a direct download option.
- **Navigation**: Link in Navbar/Footer persists across the site.

      <footer>
        - No top border
        - Centered layout (flex column, items-center)
        - Social icons row: Facebook, Instagram, Twitter, LinkedIn, GitHub
          - Icon size: 24px, gap: 24px (gap-6)
          - Color: #4B5563 (gray-600), hover: #F3434F with 120ms transition
          - Only icons with configured URLs are displayed
          - Links open in new tab (target="_blank")
        - Copyright text below icons: "Copyright ©{year} All rights reserved"
          - Font size: 14px, color: #6B7280 (gray-500), centered
      </footer>
    </global_layout>

    <home_page_view>
      <header>
        - Route: /
        - Server: fetch pages(home) + site_settings + blogs recent 2 + featured works (rule below)
      </header>

      <hero_section>
        Desktop layout:
        - Two columns: left text, right avatar
        - Column gap: 64px
        - Headline font: 44px/52px, weight 700, color #2F2941
        - Intro text: 16px/26px, color #4F4A63
        - Avatar: 240px circle, border 0
        Mobile layout:
        - Stacked (Flex Column Reverse): Image top, Text bottom.
        - Avatar centered, smaller if needed.
        - Text centered alignment.
        Admin-only UI:
        - Headline/intro: click-to-edit (InlineTextEditor); autosave debounce 800ms
        - Avatar: hover shows “Replace” icon (24px); requires explicit Save after upload
      </hero_section>

      <recent_posts_section>
        - Title: 22px/28px weight 700
        - View all link to /blog
        Desktop:
        - Grid: 2 columns, gap 20px
        - Card: padding 20px, radius 4px, bg #FFFFFF, border 1px solid #E6E6EA
        Mobile:
        - Stack: gap 16px; Single column.
        Card content order:
        - Title (18px, weight 700; **Clickable Link** to blog detail)
        - Meta row (date + tags) (14px, color #6B667A)
        - Excerpt (14px, 2-line clamp)
        Empty state:
        - “No posts yet” + admin-only “Create first post” button
      </recent_posts_section>

      <featured_works_section>
        Featured rule:
        - MVP: show latest 3 published works
        - Post-MVP: show top 3 by views in last 30 days
        Desktop:
        - List of 3 rows, row height 160px, gap 18px
        Mobile:
        - Show only 1 item, with “View all” link to /works
      </featured_works_section>
    </home_page_view>

    <works_list_view>
      <header>
        - Route: /works
        - Server: fetch published works ordered by published_at desc
      </header>
      <list>
        Desktop:
        - Vertical list, gap 18px
        - Work row: thumbnail 240x180, content area min 520px
        - Metadata badge: Show full published date (Managed by system)
        Mobile:
        - Thumbnail full width (stacked), content below (gap 10px)
      </list>
      <admin_actions>
        Client-only (admin):
        - Hover X button top-right of card (24px)
        - Multi-select delete marking; “Save changes” button fixed bottom-right
      </admin_actions>
      <empty_state>
        - Public: “No works yet”
        - Admin: show “Add work” button
      </empty_state>
    </works_list_view>

    <work_detail_view>
      <header>
        - Route: /works/:slug
        - Server: fetch work by slug + attachments referenced in content
      </header>
      <content>
        - Title: 32px/40px weight 700
        - Meta: Year badge + category + tags chips
        - Body renderer: renders content blocks (see block schema)
      </content>
      <admin_editor>
        Client-only (admin):
        - TiptapEditor (Notion-style) with slash commands.
        - Automated metadata: "Published" and "Last Modified" timestamps.
        - Auto-generated excerpt from first 160 characters of content.
        - Compact thumbnail selector (aspect 16:5).
      </admin_editor>
      <states>
        - Loading skeleton: 8 blocks
        - Not found: 404 page with link back to /works
      </states>
    </work_detail_view>

    <blog_list_view>
      <header>
        - Route: /blog
        - Server: fetch published blogs ordered by published_at desc
      </header>
      <list>
        Desktop:
        - Vertical list, gap 18px
        - Blog card padding 20px
        Mobile:
        - Stack, gap 16px
      </list>
      <admin_actions>
        Client-only (admin):
        - Same as works (delete mark + add)
      </admin_actions>
    </blog_list_view>

    <blog_detail_view>
      <header>
        - Route: /blog/:slug
        - Server: fetch blog by slug + attachments referenced in content
      </header>
      <admin_editor>
        Client-only (admin):
        - TiptapEditor (Notion-style) with slash commands.
        - Automated metadata: "Published" and "Last Modified" timestamps.
        - Auto-generated excerpt from first 160 characters of content.
        - Simplified media: Cover image optional; no dedicated thumbnail area required.
      </admin_editor>
    </blog_detail_view>

    <introduction_view>
      - Route: /introduction
      - Server: fetch pages(introduction)
      - Admin: inline edit + optional hero image replace
    </introduction_view>

    <contact_view>
      - Route: /contact
      - Server: fetch pages(contact)
      - Fields: linkedin, facebook, phone, email (all optional)
      - Admin: inline edit
    </contact_view>

    <resume_view>
      - Route: /resume
      - Server: fetch site_settings.resume_asset_id and build public URL
      - UI: PDF viewer (height 80vh desktop, 70vh mobile) + Download button
      - Download: direct public URL
    </resume_view>

    <admin_layout_and_views>
      <admin_layout>
        - Route group: (admin)
        - Server guard: if not admin -> redirect /login
        - Sidebar/tabs: Dashboard, Views, Works, Blog, Pages
      </admin_layout>

      <login_view>
        - Route: /login
        - Google OAuth sign-in button
        - After login: redirect to /admin
      </login_view>

      <admin_dashboard_view>
        - Route: /admin
        - Summary cards: total views (7d/30d), top work, top blog
      </admin_dashboard_view>

      <admin_views_view>
        - Route: /admin/views
        - Chart: daily views (last 30d)
        - Table: top content by views
      </admin_views_view>

      <admin_works_view>
        - Route: /admin/works
        - Manage works list: create, publish toggle, delete marking
      </admin_works_view>

      <admin_blog_view>
        - Route: /admin/blog
        - Manage blogs list: create, publish toggle, delete marking
      </admin_blog_view>

      <admin_pages_view>
        - Route: /admin/pages
        - Purpose: Hub editor for managing site settings and page content
        
        Site Settings Editor:
        - Site Owner Name: Text input for owner name (displayed in Navbar, Footer, page title)
        - Tagline / Role: Text input for tagline (displayed in page title metadata)
        - Social Media Links section:
          - Facebook URL input
          - Instagram URL input
          - Twitter URL input
          - LinkedIn URL input
          - GitHub URL input
        - Save Changes button: Saves to site_settings table
        - API Endpoint: PUT /api/admin/site-settings
        
        Home Page Hero Section Editor:
        - Profile Image: Upload/replace profile avatar (saves to Supabase Storage)
        - Headline: Editable text input for main title (e.g., "Hi, I am John, Creative Technologist")
        - Intro Text: Editable textarea for introduction description
        - Save Changes button: Saves content to pages.content as JSON
        - Content structure: { headline, introText, profileImageUrl }
        
        Introduction/Contact Page Editors:
        - Title: Editable page title input
        - Content: Notion-style Rich Text Editor (Tiptap)
          - Markdown shortcuts: # (H1), ## (H2), ### (H3), - (List), * (List), ``` (Code)
          - Slash Command Menu (`/`): Searchable list for all block types (Headings, Lists, Images, 3D Model, HTML Widget, Code Block).
            - Support for **keyboard navigation** (Up/Down/Enter) with **automatic scrolling** to keep selected items in view.
            - Support for **shortcuts/aliases** (e.g., `/c` for Code Block, `/1` for Heading 1, `/3` for 3D Model).

          - Bubble Menu: Floating toolbar for Bold, Italic, Strike, Highlight, and Headings
          - Fixed Toolbar: Standard formatting options (Undo, Redo, Headings, Lists, Images, Links, 3D, HTML)
          - Image handling: Drag-and-drop or upload via dialog (saves to Supabase Storage)
          - Content structure: { html: string } (JSON string containing the raw HTML)
        - Save Changes button: Saves content to pages.content as { html: string }
        
        API Endpoint: PUT /api/admin/pages
        - Requires admin authentication
        - Updates pages table content field
      </admin_pages_view>

    </admin_layout_and_views>

    <keyboard_shortcuts_reference>
      - Editor:
        - Ctrl/Cmd + S: force save immediately
        - Enter: new paragraph block
        - Shift + Enter: soft line break
        - Backspace at start: merge with previous block
        - Ctrl/Cmd + K: open “Insert” menu (image/file/divider)
      - Navigation:
        - / (optional): open quick navigation palette (post-MVP)
    </keyboard_shortcuts_reference>

  </pages_and_interfaces>

  <core_functionality>

    <public_read_only>
      - Anonymous visitors can read all public pages without login.
      - Works/Blogs only show published=true to public.
      - Resume is publicly viewable and downloadable.
    </public_read_only>

    <admin_auth_and_authorization>
      - Admin signs in using Supabase Auth Google OAuth.
      - Admin role is determined by profiles.role = 'admin' (server-side check).
      - CRITICAL: Admin UI must not render for non-admin; and API + RLS must block non-admin writes.
    </admin_auth_and_authorization>

    <content_management_pages>
      - Admin can edit Home/Introduction/Contact content via inline edits.
      - Admin can replace hero/profile images and resume PDF via upload.
    </content_management_pages>

    <content_management_works_and_blogs>
      - Admin can create, edit, delete works/blogs.
      - Published toggle controls visibility to the public.
      - Detail pages support rich content via block schema and attachments.
    </content_management_works_and_blogs>

    <uploads_and_assets>
      - Upload flow: client selects/drops file -> /api/uploads validates admin -> uploads to Storage -> inserts assets row -> returns asset reference.
      - Supported types: image/*, application/pdf, audio/*
      - Storage policies: only admin can insert/update/delete on storage.objects for allowed buckets.
    </uploads_and_assets>

    <analytics>
      - All public routes insert page_views (deduped by session_id + viewed_on).
      - Admin dashboard aggregates views by day, and top works/blogs by views.
    </analytics>

  </core_functionality>

  <aesthetic_guidelines>
    <design_fusion>
      Minimal editorial portfolio aesthetic with strong typography and light backgrounds. Accent color used sparingly for primary actions and active nav states.
    </design_fusion>

    <color_palette>
      <primary_colors>
        - Accent Red: #F3434F - primary buttons, active nav underline, hover tints
        - Deep Ink: #2F2941 - headings, badges background, primary text
      </primary_colors>
      <background_colors>
        - Page Background: #FFFFFF - main background
        - Subtle Blue-Gray: #EBF4F7 - soft section background (optional)
        - Surface: #FFFFFF - card surfaces
      </background_colors>
      <text_colors>
        - Text Primary: #2F2941
        - Text Secondary: #4F4A63
        - Text Muted: #6B667A
        - Text Inverse: #FFFFFF
      </text_colors>
      <border_and_divider_colors>
        - Border: #E6E6EA - card borders and separators
        - Divider: #D1D1D5 - subtle lines
      </border_and_divider_colors>
      <status_colors>
        - Success: #16A34A
        - Warning: #F59E0B
        - Error: #EF4444
      </status_colors>
      <dark_theme>
        - Background: #0B0A10
        - Surface: #151423
        - Text Primary: #F5F5F7
        - Text Secondary: #C9C7D1
        - Border: #2B2A3A
        - Accent Red: #F3434F (same)
      </dark_theme>
    </color_palette>

    <typography>
      <font_families>
        - Primary: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"
      </font_families>
      <font_sizes>
        - H1: 44px (700)
        - H2: 32px (700)
        - H3: 22px (700)
        - Body: 16px (400)
        - Small: 14px (400)
        - Caption: 12px (400)
      </font_sizes>
      <line_heights>
        - H1: 52px
        - H2: 40px
        - Body: 26px
        - Small: 22px
      </line_heights>
    </typography>

    <spacing>
      Base unit: 4px
      Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
    </spacing>

    <borders_and_shadows>
      <borders>
        - Card radius: 4px
        - Input radius: 4px
        - Badge radius: 12px
        - Border width: 1px
      </borders>
      <shadows>
        - Card: 0px 8px 24px rgba(47,41,65,0.08)
        - Dropdown: 0px 12px 28px rgba(47,41,65,0.14)
        - Modal: 0px 20px 40px rgba(47,41,65,0.18)
      </shadows>
    </borders_and_shadows>

    <component_styling>
      <buttons>
        - Primary: bg #F3434F; text #FFFFFF; height 48px; radius 4px; hover opacity 0.92 (120ms)
        - Secondary: bg transparent; border 1px solid #E6E6EA; text #2F2941; height 40px
        - Destructive: bg #EF4444; text #FFFFFF
      </buttons>
      <inputs>
        - Height 40px; padding 0 12px; border 1px solid #E6E6EA; focus ring 2px #F3434F
      </inputs>
      <cards>
        - bg #FFFFFF; border 1px solid #E6E6EA; padding 20px; radius 4px
      </cards>
      <chips_and_badges>
        - Tag chip: bg #EBF4F7; text #2F2941; padding 4px 10px; radius 999px
      </chips_and_badges>
    </component_styling>

    <animations>
      <micro_interactions>
        - Hover tint/opacity: 120ms ease-out
        - Button press: 80ms ease-in (scale 0.98)
        - Inline editor focus: 120ms ease-out highlight
      </micro_interactions>
      <page_transitions>
        - Use default Next.js transitions; optional fade-in 180ms for major sections
      </page_transitions>
      <drag_and_drop>
        - Drag preview shadow: 0px 20px 40px rgba(47,41,65,0.18)
        - Drop indicator: 2px line #F3434F
      </drag_and_drop>
      <loading_states>
        - Skeleton shimmer: 1200ms linear infinite
      </loading_states>
    </animations>

    <icons>
      - Library: lucide-react
      - Size: 20px default; 24px for key actions
      - Stroke: 1.75
    </icons>

    <accessibility>
      - Keyboard navigable menus and editor
      - Visible focus ring: 2px #F3434F
      - Reduced motion support: disable shimmer and large transitions
      - Color contrast: primary text (#2F2941) on white meets WCAG AA
    </accessibility>
  </aesthetic_guidelines>

  <advanced_functionality>
    <content_management_enhancements>
      - **Slug Generation**:
        - Unicode-aware logic supports Korean and other non-ASCII titles (e.g., "안녕하세요" -> "안녕하세요").
        - Automatic fallback to timestamp-based slugs (`post-123456`) if generation results in an empty string (e.g. emoji-only titles).
        - Slugs are **regenerated on update**, ensuring that renaming a post fixes any broken URL issues.
      - **Metadata / SEO**:
        - Dynamic `generateMetadata` implementation for detail pages.
        - Correctly decodes Unicode slugs to fetch title and excerpt for SEO tags.
      - **Deletion**:
        - Client-side `DeleteButton` with confirmation dialog.
        - Server-side actions (`deleteWork`, `deleteBlog`) securely remove records and revalidate cache.
    </content_management_enhancements>

    <notion_like_editor_v2>
      - **Performance**:
        - `lowlight/common` (35 languages) used instead of `all` (190+) to drastically reduce bundle size and main-thread blocking.
        - **No Debounce**: `onChange` fires immediately to ensure data integrity during rapid saves.
      - Block reordering with drag handles and keyboard shortcuts
      - Slash command menu ("/") to insert blocks
      - Inline image captions and resizing
      - Multi-file paste/upload
    </notion_like_editor_v2>

    <analytics_v2>
      - Bot filtering (simple UA blacklist) and IP rate limiting (server-side)
      - Materialized view for fast “Top content” queries (optional)
      - Export CSV from admin views
    </analytics_v2>

    <ai_fix_feature>
      - **Objective**: Fix messy blog content (text/code/images) using GPT.
      - **Trigger**: "AI Fix" button in BlogEditor toolbar.
      - **UI**: Split View (Original vs Fixed) for review before applying.
      - **Processing**:
        - Convert text to Tiptap code blocks where appropriate.
        - Fix grammar and formatting.
        - Preserve all image tags.
      - **Tech**: OpenAI API (gpt-4o or similar) via `/api/ai/fix-blog`.
    </ai_fix_feature>
  </advanced_functionality>

  <final_integration_test>

    <test_scenario_1>
      <description>Anonymous user browses the full site and downloads resume</description>
      <steps>
        1. Open "/" as an anonymous user.
        2. Verify Home hero renders with headline, intro text, and avatar.
        3. Click "Works" in nav and navigate to "/works".
        4. Verify Works list shows only published items.
        5. Open the first work detail and verify title/meta/body blocks render.
        6. Navigate to "/blog" and verify list renders published items.
        7. Open the first blog detail and verify body blocks render.
        8. Navigate to "/resume" and verify PDF viewer loads.
        9. Click Download and verify a PDF file downloads successfully.
        10. Verify no admin edit buttons are visible on any public page.
      </steps>
    </test_scenario_1>

    <test_scenario_2>
      <description>Non-admin cannot access admin routes or write APIs</description>
      <steps>
        1. As anonymous user, open "/admin".
        2. Verify redirect to "/login" (or "/") occurs.
        3. Sign in with a non-admin user account.
        4. Verify "/admin" still redirects away and admin link is not visible.
        5. Attempt POST "/api/uploads" and verify 401/403.
        6. Attempt UPDATE to works/blogs via client and verify RLS blocks (permission denied).
      </steps>
    </test_scenario_2>

    <test_scenario_3>
      <description>Admin edits Home headline and it updates immediately</description>
      <steps>
        1. Sign in with admin Google account.
        2. Navigate to "/admin/pages".
        3. Select Home and edit headline text via inline editor.
        4. Verify "Saving…" appears then "Saved".
        5. Open "/" in a new incognito session.
        6. Verify updated headline is visible to anonymous users.
      </steps>
    </test_scenario_3>

    <test_scenario_4>
      <description>Admin uploads new Resume PDF and it is publicly viewable</description>
      <steps>
        1. As admin, open "/admin/pages" and locate Resume management.
        2. Upload a new PDF to public-resume bucket.
        3. Verify assets row inserted and site_settings.resume_asset_id updated.
        4. Open "/resume" as anonymous user.
        5. Verify viewer shows the new PDF and download matches the uploaded file.
      </steps>
    </test_scenario_4>

    <test_scenario_5>
      <description>Admin creates a new Work and publishes it</description>
      <steps>
        1. As admin, open "/admin/works".
        2. Click "Add work", fill title, slug, year, excerpt, and save.
        3. Upload a thumbnail image and confirm it is stored in public-assets and linked.
        4. Toggle published=true and set published_at to today.
        5. Open "/works" as anonymous user and verify the new work appears.
        6. Open the work detail and verify content renders.
      </steps>
    </test_scenario_5>

    <test_scenario_6>
      <description>Page view dedupe counts only once per session per day</description>
      <steps>
        1. As anonymous user, open "/works".
        2. Refresh the page 5 times.
        3. Verify only one page_views row exists for that session_id and viewed_on for "/works".
        4. As admin, open "/admin/views" and verify the count increments by 1 only.
      </steps>
    </test_scenario_6>

  </final_integration_test>

  <success_criteria>
    <functionality>
      - Anonymous visitors can browse all public pages without login.
      - Admin-only pages are unreachable and invisible to non-admin users.
      - Admin can CRUD works and blogs, edit single pages, and upload files.
      - Resume is publicly viewable and downloadable.
    </functionality>

    <user_experience>
      - Mobile layout matches provided Figma structure with no broken sections (Stack layouts for Hero/Works).
      - Primary navigation works on all pages; active link state is visible.
      - Inline edits show clear saving/saved feedback within 1.5 seconds.
    </user_experience>

    <technical_quality>
      - RLS blocks all non-admin INSERT/UPDATE/DELETE on content tables.
      - Storage policies block non-admin uploads/updates/deletes.
      - CI passes: lint + typecheck + unit tests + build on every PR.
      - E2E tests cover at least scenarios 1 and 2.
    </technical_quality>

    <visual_design>
      - Colors and typography follow the defined tokens; no ad-hoc colors.
      - Dark mode uses the defined dark palette with consistent contrast.
    </visual_design>

    <build>
      - Production build succeeds on Vercel with environment variables set.
      - No server-only keys are exposed to the client bundle.
    </build>
  </success_criteria>

  <build_output>
    <build_command>npm run build</build_command>
    <output_directory>.next/</output_directory>
    <deployment_notes>
      - Recommended deployment on Vercel.
      - Ensure SUPABASE_SERVICE_ROLE_KEY is configured as a server-only env var.
    </deployment_notes>
  </build_output>

  <key_implementation_notes>

    <critical_paths>
      - Security-first: implement and verify RLS + Storage policies before building admin UI.
      - Define content block schema early to avoid rewrites in Works/Blog editor.
      - Separate Server Components (read/render) from Client Components (edit/interact).
    </critical_paths>

    <block_schema>
      CRITICAL: Works/Blogs content jsonb uses a normalized block array with stable IDs.
      Example shape:
      {
        "version": 1,
        "blocks": [
          { "id": "uuid", "type": "h1", "text": "Title" },
          { "id": "uuid", "type": "p", "text": "Paragraph", "marks": ["bold","italic"] },
          { "id": "uuid", "type": "image", "assetId": "uuid", "caption": "..." },
          { "id": "uuid", "type": "file", "assetId": "uuid", "label": "PDF attachment" },
          { "id": "uuid", "type": "divider" }
        ]
      }
     - **Block Types**:
  - Text: Paragraph, Headings (H1, H2, H3)
  - Layout: Bullet/Numbered lists, Blockquotes
  - Media: Images (Drag & Drop / Copy-Paste / Upload)
  - **Interactive Blocks**:
    - **3D Model**: Embeds a Three.js scene (e.g., rotating cube) with adjustable height.
    - **HTML Widget**: Allows direct insertion of custom HTML/CSS for advanced formatting or external embeds.
- **Slash Command Menu (`/`)**:
  - Typing `/` at the start of a line opens a searchable command palette.
  - Supports all block types with keyboard navigation (Up/Down/Enter) and automatic scrolling for long lists.
  - Supports quick shortcuts (e.g., `/c` for Code Block, `/h` for HTML Widget).

- **Public View Hydration**:
  - Custom HTML tags (e.g., `<three-js-block>`) are hydrated into interactive React components on the public-facing pages.
      Block enums:
      - type: enum (h1, h2, p, quote, ul, ol, image, file, divider, code, threeJsBlock, htmlBlock)
      - marks: enum (bold, italic, underline, highlight, link)
      - code: Supports syntax highlighting (Javascript, Typescript, HTML, CSS, etc.)
      Validation:
      - content.version required
      - every block.id must be unique
      - image/file blocks must reference existing assets.id
    </block_schema>

    <recommended_implementation_order>
      1. Repo setup: Next.js app + Tailwind v4 + shadcn/ui + lint/typecheck scripts.
      2. Supabase: apply schema.sql; create Storage buckets; verify RLS with anon key.
      3. Public site (MVP-Read):
         3.1 Implement app/(public) routes: /, /works, /works/[slug], /blog, /blog/[slug], /contact, /resume.
         3.2 Server Components fetch public data and render. Add basic loading/empty states.
         3.3 Add page_views insert (anon allowed) with cookie session_id and dedupe.
      4. Auth + Admin gating (MVP-Admin-Access):
         4.1 Implement /login Google OAuth.
         4.2 Implement server-side isAdmin check and admin route guard in (admin)/layout.tsx.
         4.3 Ensure admin links/buttons render only for isAdmin.
      5. Admin content management (MVP-Admin-CRUD):
         5.1 /admin/pages: inline edit pages(home/introduction/contact) + profile image + resume PDF replace.
         5.2 /admin/works and /admin/blog: CRUD metadata + publish toggle + delete marking flow.
      6. Editor V1 (Post-MVP):
         6.1 Implement BlockEditor + UploadDropzone + autosave.
         6.2 Replace textarea/markdown with block renderer on detail pages.
      7. Analytics dashboard (Post-MVP):
         7.1 Implement /api/admin/stats and /admin/views charts and tables.
         7.2 Switch Home “Featured works” rule to “top by views in last 30 days”.
      8. Testing:
         8.1 Unit tests: slug, role check, block validation.
         8.2 E2E: anonymous journey + admin guard.
      9. CI/CD:
         9.1 GitHub Actions: lint/typecheck/unit/build; optional Playwright in Docker.
         9.2 Deploy to Vercel.
    </recommended_implementation_order>

    <performance_considerations>
      - Prefer Server Components for list/detail rendering to reduce client JS.
      - Use next/image for optimized images and responsive sizes.
      - Cache public fetches with revalidate (e.g., 60s) where safe.
      - Avoid client-side fetching for initial page content unless necessary.
    </performance_considerations>

    <testing_strategy>
      - Unit: Vitest + Testing Library for pure utilities and client components.
      - E2E: Playwright with webServer config; run in Docker in CI for stability.
      - Security tests: verify RLS denies writes for non-admin.
    </testing_strategy>

    <tool_usage>
      - Use Supabase generated types for all DB reads/writes.
      - Use Zod schemas to validate API route inputs (uploads, admin actions).
      - Keep /api/admin/* routes server-only; do not expose service role key to browser.
    </tool_usage>

  </key_implementation_notes>
</project_specification>
