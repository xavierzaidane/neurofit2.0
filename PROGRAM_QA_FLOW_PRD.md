# PRD — Program Intake: Interactive Q&A Flow

**Project:** neurofit2.0 — `/program` route
**Type:** UX redesign of an existing form
**Status:** Ready for implementation
**Audience:** AI coding agent (e.g. Claude Code)

---

## 1. Summary

Replace the current all-at-once tabbed intake form (`ProgramFormTabs`) as the *default* entry experience with a **one-question-at-a-time, full-screen Q&A flow** (Typeform-style): black background, one question centered on screen, an answer input beneath it, and Next/Back navigation. After the last question is answered, the flow transitions into the existing tabbed form — now pre-filled with everything collected — so the user can review/edit before submitting. A small "Skip to form" button in the top-right corner lets users bail out of the Q&A at any point and go straight to the familiar manual tabbed form instead.

This is a front-end UX layer change only — the underlying form state (TanStack Form), the submit handler, the Convex `/generate-program` call, loading states, and validation all stay exactly as they are today. The Q&A flow is a new way of *populating* the same `form` object that `ProgramFormTabs` already consumes.

---

## 2. Goals

- New users land on a calm, focused, single-question-at-a-time experience instead of a long form with many visible fields at once.
- Every question maps to a field already in `ProgramFormData` / `initialProgramFormData` — no new data is collected, no fields are dropped.
- At the end of the Q&A, the existing `ProgramFormTabs` renders exactly as it does today, just pre-filled — so all existing tab logic, validation, and the "Generate program" submit flow are reused unchanged.
- A visible, easy-to-find "Skip to form" control lets power users or returning users bypass the Q&A entirely and fill the form manually, immediately.
- Users can go back a step in the Q&A to correct a previous answer without losing later answers.

## 3. Non-Goals

- No changes to the Convex submission payload, the `/generate-program` endpoint, timeout/abort logic, or error handling — all of that in the current `ProgramPage` component is preserved as-is.
- No changes to `ProgramFormActions`, the sample-data "Generate samples" button, or the success/error message rendering — these continue to live in the final review (tabbed form) step exactly as today.
- No conditional/branching question logic in v1 (e.g. skipping "injury details" if the user says "no injuries") — every question is asked in a fixed linear order. Branching can be a fast-follow, not part of this pass.
- No persistence of in-progress Q&A answers across a page reload in v1 (i.e. refreshing mid-flow restarts the Q&A) — flag as an open question in §10 if this matters to you.

---

## 4. User Flow

```
Land on /program
        │
        ▼
  ┌─────────────────────────────┐
  │  Q&A mode (default)         │◄──── "Skip to form" (top-right, always visible)
  │  One question, full screen  │
  │  Next / Back navigation     │────────────┐
  └─────────────────────────────┘            │
        │  (after last question)             │
        ▼                                    ▼
  ┌─────────────────────────────────────────────────┐
  │  Review mode = existing ProgramFormTabs          │
  │  Pre-filled with Q&A answers (or blank/defaults  │
  │  if skipped early)                               │
  │  + existing ProgramFormActions (submit/clear/     │
  │    generate samples)                              │
  └─────────────────────────────────────────────────┘
```

- **Skip to form** at any point during Q&A → immediately switches to review mode with whatever's been answered so far already filled in; remaining fields stay at their existing defaults from `initialProgramFormData`, exactly as they would if the user had never touched them in the current form.
- **Back** during Q&A → returns to the previous question, previously-entered answer is shown pre-filled (not cleared).
- **Next** during Q&A → validates the current question's answer (using the same validation rules already defined on the `form` field, if any exist) before advancing; shows an inline error and blocks advancing if invalid.
- Reaching the end of the question list → switches to review mode automatically, all answers pre-filled.

---

## 5. Question Set & Ordering

**Grouped, not one-field-per-screen.** 22 individual questions is too many taps/screens for users to sit through. Instead, group tightly-related fields into **9 themed screens**, each showing 2–5 fields together under one clear heading — still one focused "chapter" per screen (not the old all-at-once form), but far fewer steps to click through. Each screen still gets its own Next/Back and counts as one step in the progress indicator (e.g. "Step 3 of 9").

| Step | Screen title | Field(s) | Notes |
|---|---|---|---|
| 1 | "Let's start with the basics" | `age`, `height`, `weight`, `gender` | 4 inputs on one screen — the natural "who are you" cluster |
| 2 | "Where are you starting from?" | `status`, `bodyFat`, `injuries` | Current condition cluster; `bodyFat` and `injuries` skippable |
| 3 | "How do you want to train?" | `workoutDays`, `trainingStyle`, `targetTimeline` | Training cadence/style cluster |
| 4 | "What's your goal?" | `fitnessGoal`, `fitnessLevel` | Goal + self-assessed level |
| 5 | "Any dietary considerations?" | `dietaryRestrictions`, `foodAllergies` | Both skippable |
| 6 | "Nutrition targets (optional — skip if unsure)" | `dailyCalories`, `proteinTarget`, `carbsTarget`, `fatTarget`, `mealsPerDay` | Whole screen skippable in one action (see below), or per-field skip |
| 7 | "Your daily rhythm" | `workingHours`, `sleepHours`, `stressLevel` | Lifestyle cluster |
| 8 | "Workout logistics" | `workoutTime`, `availableEquipment` | When/what-with |
| 9 | "Where are you located?" | `countryRegion`, `cityRegion` | Final step before review |

Guidelines for building each grouped screen:
- Show all fields for that step's group on screen simultaneously (small stacked inputs under one heading), not as sub-steps within a step — this keeps total navigation to 9 clicks through the flow while still feeling focused per screen, unlike the old flat form.
- Each screen still validates only its own fields before allowing Next.
- For screens made entirely of optional fields (e.g. step 6), add a single "Skip this section" action in addition to (or instead of) per-field skip links, so users aren't forced to dismiss 5 individual fields one at a time.
- Keep required vs optional fields visually distinguished (e.g. optional fields labeled "(optional)" in their sub-label) so users immediately know what they can leave blank without needing to discover a skip control per field.

Agent should verify this grouping and field list against the real field set/types in `ProgramFormData` and `initialProgramFormData` (`@/data/samples`) before building, since exact field names, option lists (for selects), and which fields are optional vs required need to come from the actual type definitions and existing `ProgramFormTabs`/validation logic — do not invent option values not already used elsewhere in the form.

---

## 6. Component Architecture

### 6.1 New components

**`ProgramQAFlow.tsx`** (new, `components/program/`)
- Props: the same `form` object (TanStack Form instance) already created in `ProgramPage`, plus `onComplete: () => void` and `onSkip: () => void` callbacks.
- Internally tracks `currentStepIndex`.
- Renders one `QuestionCard` at a time based on the question config table (§5), stored as a typed array/config, not hardcoded JSX per question — build a small declarative question schema so adding/reordering questions later doesn't require touching layout code.
- On "Next": validate current field(s) via `form.validateField` (or equivalent TanStack Form API already in use), advance `currentStepIndex`, or call `onComplete()` if this was the last question.
- On "Back": decrement `currentStepIndex` (no-op if already at 0).
- Writes answers directly into the same `form` instance via `form.setFieldValue` — so by the time `onComplete()` fires, `form`'s state already has everything the review-mode `ProgramFormTabs` needs, with zero data transformation/copying required.

**`QuestionCard.tsx`** (new, `components/program/`)
- Props: `group` (screen title, an array of 2–5 field configs — each with field key, label, input type, options, required/skippable — plus an optional `skipWholeSection` flag), `form`.
- Renders the group's title large and centered at the top, then each field's own sub-label + input stacked beneath it (not one giant field — each still reads as its own labeled input within the themed screen).
- If `skipWholeSection` is set (e.g. step 6's nutrition targets), render a single "Skip this section" action in addition to/instead of per-field skip links, so optional-heavy screens can be dismissed in one action rather than field-by-field.
- Enter key (when focused in the last input of the group, or via a dedicated Next button) advances to the next screen, matching typeform-style keyboard-first interaction.

**`QAProgressIndicator.tsx`** (new, `components/program/`)
- Small, unobtrusive progress element (e.g. a thin bar at the very top of the screen, or "Question 4 of 22" text) — reference the mockup-parity principle from earlier Neurobot work: keep this minimal, not a heavy stepper UI, since the black-page/single-question aesthetic should stay dominant.

**`SkipToFormButton.tsx`** (new, or inline in `ProgramQAFlow.tsx` if trivial)
- Small ghost/outline button, fixed top-right corner, label "Skip to form" (or an icon + short label), visible throughout the entire Q&A. Clicking it calls `onSkip()` immediately — no confirmation dialog needed, this should be a low-friction escape hatch.

### 6.2 Modified files

**`app/program/page.tsx`**
- Add a `mode` state: `"qa" | "review"`, defaulting to `"qa"`.
- Keep the existing `form` (TanStack Form) instantiation exactly as-is — both modes share the same instance.
- Render logic:
  ```tsx
  {mode === "qa" ? (
    <ProgramQAFlow
      form={form}
      onComplete={() => setMode("review")}
      onSkip={() => setMode("review")}
    />
  ) : (
    // existing markup: heading, ProgramFormTabs, form.Subscribe → ProgramFormActions, error/success messages
  )}
  ```
- The existing `isLoading`/`ProgramFormSkeleton` initial-load state (900ms timer) can gate entry into `mode: "qa"` the same way it currently gates the form — show the skeleton first, then the Q&A, rather than skipping straight to Q&A before data is ready.
- `showSubmitLoading`/`LoadingScreen` overlay behavior is unchanged — that only applies during actual submission, which only happens from review mode, same as today.
- No changes needed to the `onSubmit`/`onSubmitInvalid` handlers on `useForm` — review mode's submit button still triggers the exact same `form.handleSubmit()` path.

### 6.3 Unchanged files
- `ProgramFormTabs.tsx`, `ProgramFormActions.tsx`, `ProgramFormSkeleton.tsx` — used as-is in review mode, no modifications required.

---

## 7. Styling

- Full black background (`bg-black`) for the Q&A screens, matching the request's "just a black page" — no card/border chrome around the question itself, keep it minimal and typographic.
- Question text: large, similar scale to the current page's `h1` ("Fitness Plan Intake" is `text-3xl`) — questions can go slightly larger (e.g. `text-2xl md:text-4xl`) since it's the sole focus of the screen.
- Reuse the existing `inputClassName` styling pattern (dark bordered input, mono font, white text) already defined in `ProgramPage` for consistency between the Q&A inputs and the review-mode tab inputs — don't invent a second visual language for inputs.
- Transition between questions: simple fade/slide (reuse `framer-motion`/`motion` if already a project dependency from the Neurobot work — check before adding a new one, consistent with the earlier reconciliation guidance given for Neurobot's ShiningText component).
- "Skip to form" button: small, low-visual-weight (ghost button, muted text), top-right, `fixed` or `absolute` positioned so it stays visible regardless of scroll.

---

## 8. Accessibility & Keyboard Support

- Enter key advances to the next question (from a focused input).
- Escape key does nothing destructive by default (don't wire it to Skip — that should require an explicit click, since it's a bigger action than dismissing a single question).
- Each `QuestionCard` input should autofocus on mount so users can start typing immediately without clicking.
- Progress indicator and current question must be announced to screen readers on change (e.g. `aria-live="polite"` region for the question text container).

---

## 9. Edge Cases

- **Skip on question 1** (before answering anything): review mode opens with the form in its full default state — identical to today's default experience.
- **Back past question 1**: no-op, Back button disabled/hidden on the first question.
- **Required field left blank, user clicks Next**: block advancement, show the same inline validation message style already used elsewhere in the form (check `ProgramFormTabs`/TanStack Form's existing error rendering pattern and reuse it). Only the invalid field(s) within the current group block advancement — other fields in the same group that are valid are unaffected.
- **Optional/skippable field**: a "Skip" link next to that individual field advances without requiring a value for just that field, leaving it at its default from `initialProgramFormData`; the rest of the group's fields (if any are required) still need to be filled before Next works.
- **All-optional group (e.g. step 6, nutrition targets)**: a single "Skip this section" action clears the need to touch any field in that group and advances immediately.
- **User reaches review mode, edits an answer there, then the flow doesn't go back to Q&A** — review mode is the final stage; there's no "back to Q&A" navigation once reached (consistent with Typeform's own pattern: reviewing/editing happens in the summary view, not by re-entering the linear flow).

---

## 10. Open Questions

1. Should in-progress Q&A answers persist across a page refresh (e.g. via sessionStorage) so an accidental reload doesn't lose progress? Not in scope for v1 per §3, but flag if this is actually important — it's a small addition (write to `sessionStorage` on each `Next`) if wanted.
2. Should any questions be conditionally skipped based on earlier answers (e.g. don't ask about injury details if a prior "any injuries?" toggle was "No")? Explicitly out of scope for v1 (§3) but worth deciding for a v2 pass.
3. Confirm the exact option lists for each single/multi-select question (gender, status, training style, fitness goal, fitness level, stress level, workout time, available equipment, dietary restrictions) against whatever `ProgramFormTabs` already uses today — this PRD assumes those are reused verbatim, not redefined.

---

## 11. Acceptance Criteria

- [ ] Landing on `/program` shows the Q&A flow by default (after the existing brief loading skeleton), 9 grouped themed screens (2–5 related fields each) on a black background — not 22 individual single-field screens.
- [ ] Next/Back navigation works correctly, including validation blocking advancement on invalid/required-but-empty answers.
- [ ] "Skip to form" is visible in the top-right corner at every step of the Q&A and immediately switches to the existing tabbed form when clicked.
- [ ] Reaching the end of the Q&A automatically switches to the tabbed form, fully pre-filled with every answer given.
- [ ] The tabbed form (review mode) behaves exactly as it does today — same validation, same submit flow, same `ProgramFormActions` (clear / generate samples / submit), same success/error messaging, same Convex call.
- [ ] Answers entered in the Q&A and any edits made afterward in review mode both correctly reach the final submit payload — verified by checking the actual `fetch` body sent to `/generate-program` matches what was entered.
- [ ] No regressions to loading states (`ProgramFormSkeleton` on initial load, `LoadingScreen` overlay on submit) or timeout/abort handling.
- [ ] `npx tsc --noEmit` passes with zero errors.
