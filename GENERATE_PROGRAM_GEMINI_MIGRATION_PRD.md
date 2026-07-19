# PRD — Generate Program: Migrate Groq → Google AI Studio (Gemini) + Prompt Optimization

**Project:** neurofit2.0 — `/program` → Convex `generate-program` action
**Type:** Provider migration + prompt engineering optimization
**Status:** Ready for implementation
**Audience:** AI coding agent (e.g. Claude Code)
**Related:** `NEUROBOT_GEMINI_MIGRATION_PRD.md` (Neurobot's separate Groq→Gemini-adjacent migration) — this is a **different feature, different codebase location, and will use a different Google account/API key**, not the same key as Neurobot.

---

## 1. Summary

The `/program` intake form currently generates the user's workout/diet plan via a Convex HTTP action (`/generate-program`) calling **Groq**. This PRD migrates that call to **Google AI Studio's Gemini API**, using a **second, separate Google account and API key** from the one used by Neurobot — so the project ends up with two independent Gemini keys, each with its own free-tier quota, isolated per feature. Alongside the provider swap, this PRD also specifies a **prompt optimization pass**: reduce input token usage by roughly 200–300 tokens per request while making the structured output (workout/diet plan JSON) more reliable, primarily by moving from "please output JSON" instruction-following to Gemini's native structured-output mode.

---

## 2. Why two separate Gemini keys, not one shared key

- **Isolated quota.** Neurobot (chat) and Generate Program (one-shot plan generation) have very different usage patterns — Neurobot is a chat app with many small requests per session; Generate Program is a single large structured-output request per plan creation. Sharing one key means a burst of Neurobot chat traffic could exhaust the free-tier quota and block someone from generating a program (or vice versa). Separate keys means each feature's usage is capped independently.
- **Separate accounts, not just separate keys under one account.** Per your setup, each key comes from a different Google account. This is fine (see prior conversation) as long as each account is a genuine separate account, not a throwaway created solely to multiply quota — that's the line Google's ToS cares about.
- **Clear operational ownership.** If one feature starts erroring due to rate limits, logs/env var naming make it immediately obvious which feature/key is responsible.

---

## 3. Environment Variable Changes

```diff
# Existing (Neurobot — from the prior Gemini migration, keep as-is)
GOOGLE_AI_STUDIO_API_KEY=
GOOGLE_AI_STUDIO_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai

# New (Generate Program — separate account/key)
+ GOOGLE_AI_STUDIO_API_KEY_PROGRAM=
+ GOOGLE_AI_STUDIO_BASE_URL_PROGRAM=https://generativelanguage.googleapis.com/v1beta/openai

# Remove once migration is confirmed working
- GROQ_API_KEY=
```

**Naming convention going forward:** since the project will now have multiple Gemini keys for different features, rename the existing Neurobot variable for clarity to avoid ambiguity once a second key exists:
```diff
- GOOGLE_AI_STUDIO_API_KEY=
- GOOGLE_AI_STUDIO_BASE_URL=
+ GOOGLE_AI_STUDIO_API_KEY_NEUROBOT=
+ GOOGLE_AI_STUDIO_BASE_URL_NEUROBOT=
```
Update Neurobot's `/api/neurobot/chat` route to read the renamed `_NEUROBOT` variable. This is a small follow-up to the earlier Neurobot migration PRD, done here since this is the point where a naming collision would otherwise become likely.

**Important — where these env vars live:** confirm whether the `generate-program` action runs as a **Convex HTTP action** (per the existing `convexHttpUrl` call in `program/page.tsx`) — if so, these env vars must be set in **Convex's own environment variable dashboard** (`npx convex env set ...` or the Convex dashboard), not just Vercel's. Vercel env vars are not automatically available inside Convex's runtime. Confirm this distinction before assuming the Vercel env var fix alone is sufficient.

---

## 4. Provider Swap — Convex `generate-program` Action

1. Locate the Convex HTTP action handling `POST /generate-program` (referenced in `program/page.tsx` via `${convexHttpUrl}/generate-program`).
2. Replace the Groq client/fetch call with a call to Gemini's OpenAI-compatible endpoint (`${GOOGLE_AI_STUDIO_BASE_URL_PROGRAM}/chat/completions`), using `GOOGLE_AI_STUDIO_API_KEY_PROGRAM` as the bearer token — same compatibility approach as the Neurobot migration (§3 of that PRD), so the request-building code changes minimally in shape (base URL, key, model id).
3. Choose an appropriate Gemini model for this feature: this is a single large structured-generation call (not a chat), so prioritize a model with strong instruction-following/structured-output support and a large enough context window for the full intake payload — `gemini-2.5-pro` or `gemini-2.5-flash` are reasonable starting points; confirm current model availability/pricing-free-tier fit before finalizing (verify against Google AI Studio's current model list, same caveat as the Neurobot migration PRD).
4. Add an explicit request timeout (AbortController, recommend 30–60s given this is a larger single generation, not a short chat turn) since program generation naturally takes longer than a chat message — but must still fail predictably rather than hang.
5. Preserve all existing response handling in `program/page.tsx` (`R6: Safe response parsing`, `R8: timeout-specific error detection`, `router.push("/profile")` on success) — this migration only changes what happens *inside* the Convex action, not the contract between the frontend and `/generate-program` (same request body in, same `{ success, error }` shape expected out).

---

## 5. Prompt Optimization: Reduce ~200–300 Input Tokens, Improve Reliability

### 5.1 Baseline first — measure before changing anything
Before optimizing, the agent must:
1. Locate the actual prompt(s) currently sent to Groq inside the `generate-program` Convex action (system prompt + however the 25 intake fields are serialized into the user message).
2. Use Gemini's `countTokens` capability (or an equivalent tokenizer check) to get an actual baseline input token count for a representative real request — do not estimate blindly. This baseline is what the 200–300 token reduction target is measured against.
3. Record the baseline in a comment or the eventual PR description so the "before/after" is verifiable, not just claimed.

### 5.2 Primary lever: switch to native structured output instead of instruction-based JSON

This is the change most likely to hit both goals (fewer tokens *and* more reliable output) at once, so prioritize it first:

- **Current likely pattern:** the prompt probably contains verbose natural-language instructions like "Return ONLY valid JSON matching this exact structure... do not include markdown code fences... do not add commentary..." — this kind of instruction text is typically 100–250+ tokens on its own, and models still occasionally violate it (wrapping output in ```json fences, adding a preamble sentence, etc.), which is presumably part of why reliability is a stated concern here.
- **Replacement:** use Gemini's native structured output mode — `response_mime_type: "application/json"` plus a `response_schema` (JSON Schema) describing the exact workout/diet plan shape, passed as a request parameter rather than described in prose inside the prompt text. This:
  - Removes essentially all of the "please format it like this / don't add markdown / don't add commentary" instruction text from the prompt (the schema enforces this structurally, not by asking nicely) — this is where most of the 200–300 token savings should come from.
  - Guarantees the model literally cannot return malformed/non-JSON output for the fields defined in the schema — directly improving reliability, since output shape is now enforced by the API rather than requested via natural language.
  - Note: confirm whether Gemini's OpenAI-compatible endpoint (which this migration uses per §4) supports `response_format: { type: "json_schema", json_schema: {...} }` in the OpenAI-compatible request shape, versus needing the native Generative Language API's `generationConfig.responseSchema` field instead — these are two different parameter shapes for the same underlying feature, and the OpenAI-compat layer's support for structured output should be verified directly against current Google documentation, not assumed.

### 5.3 Secondary levers (apply after §5.2, only as needed to close any remaining gap to the 200–300 token target)

- **Trim redundant field descriptions.** If the prompt currently re-explains each of the 25 intake fields in full sentences (e.g. "The user's daily calorie target, which represents..."), shorten to compact key: value pairs or a terse schema-adjacent format — the model doesn't need prose explanations of self-descriptive fields like `age`, `weight`, `sleepHours`.
- **Remove few-shot examples if present**, or shrink them. A full example workout/diet plan embedded in the prompt as a "here's the format" demonstration can easily be 150+ tokens by itself — if the structured-output schema (§5.2) is doing the format-enforcement job, a full example may be partially or fully redundant. Keep only if it's meaningfully improving output *quality* (not just format) — verify via testing, don't remove blindly if it's pulling weight.
- **Deduplicate instructions.** Check for repeated statements of the same constraint in different words (a common source of prompt bloat when a prompt has been edited incrementally over time) — consolidate to one clear statement per constraint.
- **Move static boilerplate to the system role, dynamic data to the user role**, if not already structured this way — this doesn't reduce token count by itself, but keeps the prompt easier to maintain and audit going forward, and some providers cache system-role content more effectively across requests (verify whether this applies to Gemini's setup here; treat as a nice-to-have, not the main lever).

### 5.4 What NOT to cut
Do not remove information the model actually needs to generate a *good* plan (the user's actual answers — age, goals, injuries, equipment, etc.) to hit the token target — the 200–300 token reduction must come from **instructional/formatting overhead**, not from the user's actual intake data. If the optimization pass is at risk of cutting real input data to hit the number, stop and flag it rather than degrading plan quality for a token-count target.

### 5.5 Reliability verification, not just token counting
"More reliable output" needs a concrete, testable definition here, not just a vibe:
- Run a batch of test requests (recommend 15–20) with varied realistic intake data through the new prompt + structured output setup.
- Confirm **100% valid-JSON-parse rate** (this should be at or near guaranteed once §5.2 is in place, since the API enforces it structurally).
- Spot-check a sample for **plan quality** (does the workout plan actually reflect the stated `workoutDays`/`fitnessLevel`/`injuries`? does the diet plan roughly respect `dailyCalories`/`dietaryRestrictions`?) — token/format optimization should not come at the cost of the model quietly ignoring input constraints; if quality regresses, investigate whether over-aggressive trimming from §5.3 removed something the model actually needed.

---

## 6. Verification Plan

1. Confirm `GOOGLE_AI_STUDIO_API_KEY_PROGRAM` is set in **Convex's** environment (not just Vercel's) and the action successfully authenticates.
2. Confirm `GOOGLE_AI_STUDIO_API_KEY_NEUROBOT` (renamed) still works correctly for Neurobot after the rename — no cross-contamination between the two keys/features.
3. Submit a real program generation end-to-end (via the actual `/program` form or Q&A flow) and confirm a valid plan is created and the user is redirected to `/profile`, matching current behavior.
4. Confirm the recorded baseline token count (§5.1) vs. the new optimized prompt's token count shows a reduction of at least 200–300 tokens — report both numbers.
5. Confirm the reliability test batch (§5.5) passes: 100% valid JSON parse rate across the test batch, with no obvious plan-quality regression on spot-check.
6. Confirm the explicit request timeout (§4.4) fails predictably (clear error, not a multi-minute hang) if simulated against an unreachable/slow endpoint.
7. Confirm `GROQ_API_KEY` and any Groq-specific client code/imports are fully removed once the migration is verified working (or clearly marked deprecated if kept temporarily for rollback per the same rollback-plan pattern used in the Neurobot migration).

---

## 7. Acceptance Criteria

- [ ] `generate-program` Convex action calls Google AI Studio (Gemini) instead of Groq.
- [ ] A dedicated `GOOGLE_AI_STUDIO_API_KEY_PROGRAM` (separate Google account from Neurobot's key) is used, set correctly in Convex's environment.
- [ ] Neurobot's existing key is renamed to `GOOGLE_AI_STUDIO_API_KEY_NEUROBOT` and confirmed still working post-rename.
- [ ] Structured output (`response_schema`/JSON mode) is used to enforce the plan's JSON shape, rather than natural-language formatting instructions.
- [ ] Measured input token count is reduced by at least 200–300 tokens versus the recorded Groq-prompt baseline, with both numbers reported.
- [ ] 100% valid-JSON-parse rate across a test batch of 15–20 varied generation requests.
- [ ] No regression in plan quality/relevance to stated user inputs, spot-checked across the test batch.
- [ ] Existing frontend contract (`program/page.tsx`'s fetch call, response shape, error/timeout handling, redirect-on-success) is unchanged.
- [ ] `GROQ_API_KEY` removed from active use once verified (kept in rollback history only, per §9 of the related Neurobot migration PRD's rollback pattern).
