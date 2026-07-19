# PRD — Neurobot Redesign Fix v2 (Align to Reference Mockup)

**Project:** neurofit2.0 — `feature/neurobot`
**Type:** UI redesign / regression fix
**Status:** Ready for implementation
**Audience:** AI coding agent (e.g. Claude Code)
**Supersedes:** `NEUROBOT_UI_PARITY_FIX_PRD.md` where they conflict (this document is the current source of truth)

---

## 1. Context

The current implementation ("current," attached as the agent-generated screenshot) has drifted further from the approved reference design ("reference," the two screenshots showing the empty state and an active conversation). The current build introduced a full site header, a persistent chat-history sidebar, card-style templates, a different logo, and an orange accent theme — none of which match the reference. This PRD itemizes every gap and specifies the corrected target so the agent can bring the implementation back to spec.

The reference is a **fully isolated, minimal chat surface** with no site chrome. The current build reintroduced the global app shell (header nav + sidebar) around it, which directly contradicts the full-screen-isolated-view requirement already set in the previous PRD (§2.6 of the parity-fix doc). This document restates that requirement more forcefully and adds the newly observed regressions.

---

## 2. Defects to Fix

### 2.1 Global header / top nav — remove entirely, permanently
- **Current:** full site header persists at the top — "NEUROFIT 2.0" logo, Home/Generate/Neurobot/Profile nav links, "Sign Out" button, avatar icon.
- **Reference:** no header at all. The chat surface starts at the very top of the viewport.
- **Fix:** the Neurobot route renders with **zero** global site chrome — no header, no nav bar, no persistent icons or buttons of any kind outside the chat column itself. Use a dedicated isolated layout (or a `hideChrome: true` flag) so the site header never mounts on this route. There is no corner icon, no back button, no minimized logo — navigation away from Neurobot happens through the app's normal route/URL navigation (e.g. browser back, or a link elsewhere in the app), not through anything rendered on this screen.

### 2.2 Chat history — no sidebar, no drawer, no persistent UI element at all
- **Current:** a persistent left sidebar ("CHAT HISTORY", search box) is always visible, permanently consuming layout width.
- **Reference:** no sidebar, no history icon, no trigger of any kind visible in either the empty state or the active conversation.
- **Fix:** remove the sidebar component entirely — do not replace it with a drawer, overlay panel, or modal triggered by a button/icon. Chat history is accessed **exclusively** via the `/history` slash command (see base PRD §6.7 for the slash-command menu pattern). Typing `/history` in the composer opens the session list as a lightweight in-place UI (e.g. a command-palette-style list rendered above the composer, consistent with how `/templates` already works) — not a full-width docked sidebar and not a separate persistently-visible trigger button. When `/history` isn't active, absolutely nothing related to history should be rendered on screen.
- Searching within history is done by continuing to type after `/history` (e.g. `/history project plan` filters the list), rather than a separate search input box.

### 2.3 "New Chat" — slash command only
- **Current:** an orange "+ New Chat" pill button sits fixed in a top header bar.
- **Reference:** no such button is visible in the default/idle state.
- **Fix:** remove the button entirely. Starting a new chat is done exclusively via the `/new` slash command. No persistent button, icon, or header element should exist for this action.

### 2.4 Logo / brand mark
- **Current:** an orange location-pin icon inside a dark circular badge.
- **Reference:** the avocado mark (green half with red pit), no background badge/circle — just the icon directly on the page background.
- **Fix:** replace the pin icon with the avocado SVG mark, remove the circular container, size ~48–56px, matching the reference proportions.

### 2.5 Accent color — switch from orange to blue for Neurobot-specific controls
- **Current:** heavy orange/amber accent throughout — logo badge, send button, dropdown pill backgrounds, "New Chat" button, "Browse all templates" affordance.
- **Reference:** a muted blue accent is used specifically for the send button and the personality icon; everything else stays neutral gray/white on near-black. No orange anywhere in the reference chat surface.
- **Fix:** for this feature's UI only, override the site's default orange accent with the reference's blue accent token (define a scoped CSS variable, e.g. `--neurobot-accent: #3B82F6` or match the exact blue sampled from the reference, applied to the send button and personality icon only). Do not change the orange branding used elsewhere in neurofit2.0 — scope this override to the Neurobot component tree so the rest of the app is unaffected.

### 2.6 Heading typography (recurring issue — still not fixed)
- **Current:** "How can I help you?" still renders in a bold monospace/pixel font.
- **Reference:** clean bold sans-serif, consistent with the rest of the app's type system.
- **Fix:** same as previously specified — remove the monospace override, inherit the standard heading font/weight. Flagging again since it persisted through the last fix pass; verify the font-family rule isn't being reapplied by a parent/global style that needs a more specific override or `!important` removal at the source.

### 2.7 Template suggestions — chips, not full-width description cards
- **Current:** templates render as large, full-width stacked cards with icon, title, a full preview sentence of the prompt body, and a trailing arrow — plus a separate full-width "Browse all 17 templates" button below.
- **Reference:** compact, inline **pill-shaped chips** in a single horizontal row — icon + short label only, no description text, no per-item preview sentence. Exactly 3 chips + a "More →" chip that opens the full list (matches the already-specified §2.3 of the previous parity PRD).
- **Fix:** replace the card-list component with the pill/chip row component. Move "browse all templates" behavior onto the "More" chip itself rather than a separate full-width button beneath the three cards.

### 2.8 Composer — single compact card, not two visually separate boxes
- **Current:** the composer reads as two stacked elements: a text-input field on its own, then below it a separate-looking row (still inside the same rounded container, but with boxed/pill-style dropdown buttons for "Helpful Assistant" and "GPT OSS 120B" that look like standalone buttons, plus an extra "Templates" pill on the far right).
- **Reference:** one seamless rounded card: text input on the first line, and directly below it a single control row with plain (non-boxed) elements — `+` icon, personality name with small icon (no button/border styling, just text + chevron), model name with chevron, and a circular send button — separated only by subtle spacing/dividers, not individual pill buttons. There is **no separate "Templates" control** in the composer.
- **Fix:**
  - Remove the boxed/pill button styling from the personality and model selectors inside the composer — they should look like inline text controls with a small icon and chevron, not standalone buttons with their own background/border.
  - Remove the "Templates" button from the composer row entirely (templates are already reachable via the chip row above and the `/templates` slash command).
  - Reduce the composer's overall width — reference composer is a compact centered card (roughly 700–800px wide), not stretched near-full-width. Cap `max-width` accordingly and center it, consistent with the earlier parity PRD's centering requirement.

### 2.9 Overall width / centering of the whole chat surface
- **Current:** with the sidebar and header present, the chat content area is offset and stretched to fill remaining space, so nothing is truly centered on the viewport.
- **Reference:** everything — logo, heading, subtext, chips, composer, hint bar — is centered as one column in the full browser viewport.
- **Fix:** once §2.1–§2.3 are resolved (all chrome removed), verify the whole content column is horizontally centered in the full viewport width — there is no sidebar space to ever account for, since it no longer exists in any form.

### 2.10 Active conversation view — confirm this matches too
The reference conversation screenshot (user says "hello", assistant replies) establishes additional patterns not yet visible in the current build's screenshot — implement these when wiring up the message list:
- User message: right-aligned, light/white rounded bubble, no avatar.
- Assistant message: a collapsible line above the bubble reading **"› Thought for {N.N}s"** (collapsed by default, chevron rotates on expand) rather than an always-visible "reasoning panel" — this replaces/refines the earlier "collapsible reasoning panel" language from the base PRD with the exact interaction shown in the reference: a short summary line, not a permanently-expanded region.
- Assistant bubble: dark rounded bubble, left-aligned, no avatar.
- Below the assistant bubble: two small icon-only actions — copy and regenerate — left-aligned under the bubble, minimal/ghost styling (no borders/backgrounds until hover).
- The composer stays fixed at the bottom in the same compact centered card style as the empty state; it does not change shape or width when a conversation is active.

---

## 3. Out of Scope

- No changes to backend/streaming logic, model list, personality list, or the 17-template content — this is a visual/layout-only fix.
- Session persistence and share/QR features are unaffected; only the sidebar's *presentation* (overlay vs. docked) changes.

---

## 4. Acceptance Criteria

- [ ] No global site header/nav renders on the Neurobot route — zero persistent chrome of any kind.
- [ ] No sidebar, drawer, overlay, or history icon/button exists anywhere in the UI; chat history is reachable only by typing `/history` in the composer.
- [ ] No "New Chat" button anywhere; starting a new chat works only via `/new`.
- [ ] Logo is the avocado mark with no background badge.
- [ ] Send button and personality icon use the reference's blue accent; no orange appears anywhere in the Neurobot UI.
- [ ] Heading font is the standard app sans-serif, confirmed with devtools computed styles (no monospace font-family in the cascade for this element).
- [ ] Default template suggestions are 3 compact chips + "More →", no description text, no separate "browse all" button.
- [ ] Composer is one seamless rounded card, ~700–800px wide, centered; personality/model selectors are plain inline controls (not boxed buttons); no "Templates" button inside the composer.
- [ ] Whole chat column (logo through hint bar, and the conversation view) is centered in the full viewport, with no chrome of any kind ever affecting its width or position.
- [ ] Active conversation matches the reference: right-aligned light user bubble, "Thought for N.Ns" collapsed-by-default reasoning line, left-aligned dark assistant bubble, copy/regenerate icons beneath it.
- [ ] Side-by-side screenshot diff against the reference images shows matching structure, spacing, and color for both the empty state and an active conversation.
