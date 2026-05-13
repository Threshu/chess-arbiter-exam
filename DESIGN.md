# Design

## Three principles

1. **Reading-first.** This is a study tool used in long sessions on long-form text and chess diagrams. Typography, spacing, and contrast are tuned for legibility over personality. A user should be able to read a question stem and four options without scrolling on a 13" laptop, and without their eyes hurting after twenty minutes. Decorative elements (icons, dividers, illustrations) earn their place only by aiding comprehension.

2. **Mode-aware temperature.** The interface has three modes, each with its own affordances:
   - **Practice mode** is warm and conversational: instant feedback, color cues, room for explanation panels. The user is learning, and the UI encourages exploration.
   - **Exam mode** is cold and reduced: minimal chrome, no navigation, no theme toggle, no peripheral copy. The timer is prominent and the question is centered. The user is being measured, and the UI gets out of the way.
   - **Admin mode** is dense and utilitarian: tables, filters, fast inline edits. The user is operating on data, and the UI accepts higher information density in exchange for fewer round-trips.

3. **Restrained chess motif.** This is a chess product; visual references to the game are appropriate. They are not, however, the show. No stylized rook in the logo lockup, no checkered pattern across the page background, no knight icons used for unrelated actions. The motif appears where it earns its place — in the typography pairing (a serif headline against geometric body), in muted board-tone surface colors, in the actual board components — and nowhere else.

## Token reference

All tokens are declared in `app/assets/tokens.css` under a Tailwind v4 `@theme` block. Components reference them as Tailwind utility classes (`bg-primary`, `text-fg`, etc.) — never as raw hex.

### Color

| Token                | Light     | Dark      | Semantic intent                                                                                                                                      |
| -------------------- | --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-bg`         | `#FAF7F2` | `#0F1115` | Page background. Warm off-white in light, near-black in dark.                                                                                        |
| `--color-fg`         | `#0F1115` | `#F5F0E8` | Primary text.                                                                                                                                        |
| `--color-surface`    | `#F5F0E8` | `#161A21` | Card and panel surfaces. One step away from `bg`.                                                                                                    |
| `--color-border`     | `#DCD5C8` | `#2A2F38` | All borders and dividers.                                                                                                                            |
| `--color-muted`      | `#6B6A66` | `#8A8B90` | Secondary text, captions, helper copy.                                                                                                               |
| `--color-primary`    | `#1A2D4D` | (same)    | Primary brand color — deep navy, like a tournament board's dark squares interpreted through a print lens. Used for primary CTAs, links, focus rings. |
| `--color-primary-fg` | `#FAF7F2` | (same)    | Foreground on `primary` surfaces.                                                                                                                    |
| `--color-success`    | `#5A7850` | (same)    | Correct answers, "passed" badges, positive confirmations. Avoid the typical bright green.                                                            |
| `--color-danger`     | `#A53C32` | (same)    | Wrong answers, destructive actions, errors.                                                                                                          |
| `--color-warning`    | `#B5832C` | (same)    | Time pressure, draft state, non-blocking notices.                                                                                                    |

The semantic-colour set deliberately omits a separate `info` token. Use `muted` for informational surfaces.

### Typography

| Token            | Stack                                           | Use                                          |
| ---------------- | ----------------------------------------------- | -------------------------------------------- |
| `--font-display` | `"Fraunces", ui-serif, Georgia, serif`          | Hero titles, page headings, exam title bars. |
| `--font-sans`    | `"Inter", ui-sans-serif, system-ui, sans-serif` | Body, UI, forms, tables.                     |
| `--font-mono`    | `"JetBrains Mono", ui-monospace, monospace`     | FEN strings, PGN, codes, technical metadata. |

**Pairing rationale.** Fraunces is a contemporary serif with chunky weight transitions and a slight optical-size adjustment — it reads as confident and editorial at display sizes, which suits a credential-oriented product. Inter is the workhorse body face: tuned for screens, neutral, exhaustively legible at the small sizes that question text and option labels demand. The two together echo the print-meets-digital character of modern chess publications (think of the typographic feel of a well-typeset openings book versus a refereeing handbook).

### Spacing rhythm

Tailwind's default 4-pixel scale. The rhythm we enforce is: vertical rhythm in multiples of 4 (spacing tokens `1`, `2`, `3`, `4` etc., meaning 4 / 8 / 12 / 16 px). Section padding is at least `py-12` on mobile, `py-20` on desktop. Card internal padding is `p-6` for content cards, `p-4` for compact list rows. Inline form controls have `gap-3`; vertical form layouts have `gap-4`.

### Radius scale

| Token         | Value  | Use                                            |
| ------------- | ------ | ---------------------------------------------- |
| `--radius-sm` | `4px`  | Inline controls (badges, chips, small inputs). |
| `--radius-md` | `6px`  | Default buttons, default inputs, dropdowns.    |
| `--radius-lg` | `10px` | Cards, dialogs, large surfaces.                |

Anything that needs a rounder feel than `lg` is wrong — increase padding instead. We never use full-pill rounding (`rounded-full`) outside of avatars.

### Motion

| Token             | Value                           | Use                                        |
| ----------------- | ------------------------------- | ------------------------------------------ |
| `--ease-out`      | `cubic-bezier(0.16, 1, 0.3, 1)` | Default easing. Fast out, gentle settle.   |
| `--duration-fast` | `150ms`                         | Hover, focus, micro-state transitions.     |
| `--duration-base` | `200ms`                         | Modal open/close, drawer slide, accordion. |

The global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` collapses all animation and transition durations to `0.01ms`. Do not work around it. If a particular animation conveys essential information (e.g. exam timer pulse), provide a non-motion fallback (e.g. a color shift) — do not exempt the animation from the reduced-motion rule.

## Mode-specific UX

### Practice mode

- Instant feedback after each answer: the chosen option turns `success` or `danger`, the correct one is revealed if wrong.
- Explanations are revealed in an expandable panel below the options. Never auto-opened — the user opts in.
- Navigation is unconstrained: skip, go back, retry the same question, jump to any question in the set.
- Tone of copy is encouraging. Buttons read "Try another," not "Submit."

### Exam mode

- The `exam` layout strips header chrome. Only three regions are visible: a timer slot (top-right), a progress slot (top-left or top-center, depending on viewport), and the question content slot.
- No language toggle, no theme toggle, no logo link, no breadcrumbs, no help. Exit must be deliberate (a confirmed dialog).
- The timer turns `warning` orange at 5 minutes remaining, and `danger` red at 1 minute. It pulses (where motion is allowed) at the last 30 seconds.
- Submit confirmation is required (single dialog). Submission is one-way.
- Answer changes are accepted as long as `expiresAt > now`; the final write wins. No "lock in this answer" pattern.

### Admin mode

- The `admin` layout has a collapsed icon sidebar by default; expand on hover or via keyboard shortcut.
- Data tables are dense (28px row height baseline). Inline edits where possible; full-page edit only for content with media (questions with images).
- Bulk actions appear in a sticky footer when one or more rows are selected.
- Destructive actions require a typed confirmation (the exam name, the user's email) — never a single-click destructive button.

## Component naming and primitive inventory

Detailed naming rules live in `CONVENTIONS.md`. The primitive inventory (what `Ui*` components exist as of this scaffold) is:

| Primitive  | Variants                                                                                        | Notes                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `UiButton` | `primary`, `secondary`, `ghost`, `danger`; sizes `sm`, `md`, `lg`; `loading`, `disabled` states | Token-driven. Keyboard-activatable. Loading state preserves width to prevent layout shift.   |
| `UiInput`  | text inputs with `label`, `error`, `hint` slots                                                 | `id` and `aria-describedby` wired automatically. Focus ring uses `primary`.                  |
| `UiCard`   | `header`, `body`, `footer` slots                                                                | Border + tonal surface. No drop shadow — this product reads as print-inspired, not material. |

Additional primitives (`UiBadge`, `UiDialog`, `UiSelect`, `UiTooltip`, …) will be added in feature phases. Adding a new `Ui*` requires updating this inventory and the `/dev/ui` visual reference page.

## Accessibility (WCAG 2.2 AA — non-negotiable)

- **Focus rings are always visible** and use `primary` at sufficient contrast against any surface. Never rely solely on color change for focus state.
- **Color contrast:** 4.5:1 minimum for body text against its background, 3:1 for large text and UI components. The light and dark token sets are tuned to this; do not introduce new color combinations without verifying.
- **Semantic HTML:** buttons are `<button>`, links are `<a>`, headings nest properly (`h1` once per page, then descend without skipping levels). No `<div onclick>`.
- **Keyboard navigation:** every interactive element is reachable and operable by keyboard. Tab order follows visual order. Custom widgets follow the WAI-ARIA Authoring Practices.
- **Screen-reader-friendly chess boards:** the `ChessBoard` component (Phase 1+) exposes `aria-label` per square and announces moves to an `aria-live` region. The visual board has a textual fallback (a move list and an FEN string) that is always exposed to assistive tech.
- **Exam timer announcements:** the timer is in an `aria-live="polite"` region that announces on the minute, then every 10 seconds in the last minute. Do not flood with per-second announcements.
- **Reduced motion:** respected globally (see Motion section). Test with the OS-level "reduce motion" preference enabled.
- **Form errors:** inputs have an explicit `aria-invalid` and an `aria-describedby` pointer to the visible error text.
- **Language attribute:** the root `<html lang>` reflects the active locale (`pl-PL` or `en-US`).
- **Lighthouse a11y score ≥ 95** on every page — gate this in CI before merge.

## Responsive breakpoints

Tailwind v4 defaults. Design targets:

| Breakpoint         | Range      | Layout                                                                                               |
| ------------------ | ---------- | ---------------------------------------------------------------------------------------------------- |
| Mobile             | < 640px    | Single column. Sticky exam timer top. Admin sidebar collapsed by default.                            |
| Tablet (`sm`–`md`) | 640–1024px | Two-column where data permits; admin sidebar expandable.                                             |
| Desktop (`lg`+)    | ≥ 1024px   | Full layout: persistent sidebar (admin), generous reading column (`max-w-prose` for question stems). |

The reading column for question stems never exceeds `max-w-prose` (~65ch). This is non-negotiable; wider reading columns trade legibility for screen-filling, and we are reading-first.

## DO / DON'T

**DO:**

- Use tokens for every color, radius, and motion duration.
- Strip the chrome in exam layouts. Less is the point.
- Pair short sans-serif labels with serif headlines where hierarchy is needed.
- Test every page at the active reduced-motion setting.
- Run Lighthouse on every PR before requesting review.

**DON'T:**

- Add a hex color anywhere outside `tokens.css`.
- Decorate exam pages with anything that is not the timer, the progress indicator, or the question itself.
- Use the chess motif decoratively (icons unrelated to actual chess content, background patterns, etc.).
- Use `rounded-full` outside of avatars.
- Use drop shadows. Border + tonal surface is the elevation language.
- Lean on motion to convey state — provide a static fallback in parallel.
- Animate at full duration when the user has reduced-motion enabled. Respect the global override.
