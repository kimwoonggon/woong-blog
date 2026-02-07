# Project Specification XML Schema Reference

This document defines each section of the `<project_specification>` XML structure. Use it as a checklist and structural guide when writing specs.

## Top-Level Structure

```xml
<project_specification>
  <project_name>...</project_name>
  <overview>...</overview>
  <technology_stack>...</technology_stack>
  <prerequisites>...</prerequisites>
  <core_data_entities>...</core_data_entities>
  <pages_and_interfaces>...</pages_and_interfaces>
  <core_functionality>...</core_functionality>
  <aesthetic_guidelines>...</aesthetic_guidelines>
  <advanced_functionality>...</advanced_functionality>
  <final_integration_test>...</final_integration_test>
  <success_criteria>...</success_criteria>
  <build_output>...</build_output>
  <key_implementation_notes>...</key_implementation_notes>
</project_specification>
```

Not all sections are required for every project. Include only sections relevant to the project type.

---

## Section Details

### `<project_name>`
Single line. Format: `AppName - Short Description`.

### `<overview>`
3-4 paragraphs covering:
- What the app does (1st paragraph: core purpose and value proposition)
- Key features and user workflows (2nd paragraph)
- Critical architectural constraints (3rd paragraph, prefixed with `CRITICAL:` for hard rules like "no server", "offline-only", etc.)

### `<technology_stack>`
Group by layer. Common sub-sections:

```xml
<technology_stack>
  <frontend_application>
    <framework>...</framework>
    <build_tool>...</build_tool>
    <styling>...</styling>
    <routing>...</routing>
    <state_management>...</state_management>
  </frontend_application>
  <data_layer>
    <database>...</database>
    <reactive_queries>...</reactive_queries>
    <search>...</search>
    <export>...</export>
    <note>...</note>  <!-- architectural constraints -->
  </data_layer>
  <backend> <!-- if applicable -->
    <runtime>...</runtime>
    <framework>...</framework>
    <auth>...</auth>
    <api_style>...</api_style>
  </backend>
  <build_output>
    <build_command>...</build_command>
    <note>...</note>
  </build_output>
  <libraries>
    <!-- one tag per library: name + version + purpose -->
    <dnd>@dnd-kit/core v6.3.1 for drag-and-drop</dnd>
    <charts>Recharts v3.5 for dashboard visualizations</charts>
  </libraries>
</technology_stack>
```

Rules:
- Always include exact version numbers
- State purpose after each library/tool
- Use `<note>` for architectural constraints ("NO server", "NO API", etc.)

### `<prerequisites>`
Sub-sections: `<environment_setup>` (runtime, tools) and `<build_configuration>` (build settings, plugins).

### `<core_data_entities>`
One child tag per entity. Each entity lists fields as `- field_name: type (constraints, description)`.

Field format examples:
```
- id: string (uuid)
- name: string (required, max 100 characters)
- status: enum (draft, active, archived)
- tags: string[] (array of tag IDs)
- settings: object (theme, notifications)
- createdAt: Date
- sortOrder: number (for manual ordering)
```

Include compound indexes when relevant to querying:
```
[projectId+status], [projectId+sprintId]
```

### `<pages_and_interfaces>`
The largest section. Organized hierarchically:

```xml
<pages_and_interfaces>
  <global_layout>
    <top_navigation>...</top_navigation>
    <sidebar>...</sidebar>
    <main_content>...</main_content>
  </global_layout>
  <page_name_view>
    <header>...</header>
    <main_section>...</main_section>
    <sub_component>...</sub_component>
    <empty_state>...</empty_state>
  </page_name_view>
  <!-- repeat for each page/view -->
  <keyboard_shortcuts_reference>...</keyboard_shortcuts_reference>
</pages_and_interfaces>
```

For each UI element, specify:
- Dimensions (px values: height, width, padding, gap)
- Colors (hex codes with semantic names)
- Behaviors (hover, click, drag, keyboard)
- Content structure (what appears, order, truncation)
- States (empty, loading, error, active, selected)
- Animations (duration, easing, effect)

### `<core_functionality>`
Group by functional domain. Each domain lists capabilities as bullet points.

```xml
<core_functionality>
  <entity_management>
    - CRUD operations
    - Relationships and linking
    - Bulk operations with specific actions listed
  </entity_management>
  <search_and_filter>...</search_and_filter>
  <data_persistence>...</data_persistence>
  <!-- etc. -->
</core_functionality>
```

### `<aesthetic_guidelines>`
The design system. Sub-sections:

```xml
<aesthetic_guidelines>
  <design_fusion>  <!-- high-level design philosophy -->
  <color_palette>
    <primary_colors>  <!-- brand colors with hex + usage -->
    <background_colors>
    <text_colors>
    <status_colors>
    <priority_colors>  <!-- or other semantic groups -->
    <dark_theme>  <!-- if applicable -->
  </color_palette>
  <typography>
    <font_families>  <!-- with fallback stacks -->
    <font_sizes>     <!-- with weight and context -->
    <line_heights>
  </typography>
  <spacing>  <!-- base unit and scale -->
  <borders_and_shadows>
    <borders>  <!-- thickness, color, radius -->
    <shadows>  <!-- named levels: card, dropdown, modal -->
  </borders_and_shadows>
  <component_styling>
    <!-- one sub-tag per component type: buttons, inputs, dropdowns, cards, badges, avatars, modals, panels -->
  </component_styling>
  <animations>
    <micro_interactions>
    <page_transitions>
    <drag_and_drop>
    <loading_states>
    <orchestrated_entrance>
  </animations>
  <icons>  <!-- library, sizes, stroke -->
  <accessibility>  <!-- WCAG, focus, keyboard, motion -->
</aesthetic_guidelines>
```

Color format: `- Semantic Name: #HEX - usage description`

### `<advanced_functionality>`
Features beyond core CRUD. Examples: bulk operations, keyboard shortcuts, smart defaults, notifications, offline support, multi-user.

### `<final_integration_test>`
Numbered test scenarios. Each scenario:

```xml
<test_scenario_N>
  <description>Scenario Title</description>
  <steps>
    1. Action step
    2. Verify expected result
    ...
  </steps>
</test_scenario_N>
```

Rules:
- 8-15 steps per scenario
- Alternate between user actions and verification steps
- Cover the critical user journeys end-to-end
- Include edge cases (empty states, limits, errors)

### `<success_criteria>`
Grouped by dimension:

```xml
<success_criteria>
  <functionality>  <!-- what must work -->
  <user_experience>  <!-- performance, usability -->
  <technical_quality>  <!-- code quality, architecture -->
  <visual_design>  <!-- design consistency -->
  <build>  <!-- deployment, compatibility -->
</success_criteria>
```

Each contains bullet points with specific, measurable criteria.

### `<build_output>`
Build command, output directory, contents description, deployment notes.

### `<key_implementation_notes>`
Technical guidance for the builder:

```xml
<key_implementation_notes>
  <critical_paths>  <!-- what to get right first -->
  <recommended_implementation_order>  <!-- numbered list -->
  <database_schema>  <!-- concrete code if applicable -->
  <performance_considerations>
  <testing_strategy>
  <tool_usage>  <!-- dev tools, screenshots, etc. -->
</key_implementation_notes>
```

---

## Section Applicability by Project Type

| Section | Web App | API/Backend | CLI Tool | Mobile | Library |
|---------|---------|-------------|----------|--------|---------|
| overview | ✅ | ✅ | ✅ | ✅ | ✅ |
| technology_stack | ✅ | ✅ | ✅ | ✅ | ✅ |
| prerequisites | ✅ | ✅ | ✅ | ✅ | ✅ |
| core_data_entities | ✅ | ✅ | △ | ✅ | △ |
| pages_and_interfaces | ✅ | ✗ | △ | ✅ | ✗ |
| core_functionality | ✅ | ✅ | ✅ | ✅ | ✅ |
| aesthetic_guidelines | ✅ | ✗ | ✗ | ✅ | ✗ |
| advanced_functionality | ✅ | △ | △ | ✅ | △ |
| final_integration_test | ✅ | ✅ | ✅ | ✅ | ✅ |
| success_criteria | ✅ | ✅ | ✅ | ✅ | ✅ |
| build_output | ✅ | ✅ | ✅ | ✅ | ✅ |
| key_implementation_notes | ✅ | ✅ | ✅ | ✅ | ✅ |

✅ = Include, △ = Optional, ✗ = Skip

---

## Writing Quality Checklist

- [ ] Every color is a hex code, not a name
- [ ] Every dimension is in px (or rem/% with rationale)
- [ ] Every library has an exact version number
- [ ] Every enum lists all possible values
- [ ] Data entities have complete field definitions with types
- [ ] UI specs include hover, active, disabled, empty states
- [ ] Keyboard shortcuts are specified for all key interactions
- [ ] Animations specify duration and easing
- [ ] Success criteria are measurable (numbers, not vague qualities)
- [ ] Implementation order reflects dependency chain
- [ ] Test scenarios cover all critical user journeys
