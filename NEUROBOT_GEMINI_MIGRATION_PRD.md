# PRD — Neurobot Provider Migration: NVIDIA NIM → Google AI Studio (Gemini)

**Project:** neurofit2.0 — `feature/neurobot`
**Type:** Backend provider migration
**Status:** Ready for implementation
**Audience:** AI coding agent (e.g. Claude Code)
**Trigger:** Wrong model id (`nemotron-3-embed-1b`, an embedding model) was used against the chat/completions endpoint, causing socket errors. Rather than just fixing the model id, this PRD switches the whole provider to Google AI Studio.

---

## 1. Summary

Replace NVIDIA NIM as Neurobot's model provider with **Google AI Studio's Gemini API**. This changes the API key, base URL, and — critically — the available model list, since Google AI Studio only serves Google's own Gemini models (it cannot host GPT OSS, DeepSeek, Minimax, or Nemotron, which were NVIDIA-hosted open-weight models). The streaming and chat-completion request/response contract stays the same shape on the frontend by using **Gemini's OpenAI-compatible endpoint**, minimizing changes outside the backend.

---

## 2. Why this changes the model list (read before implementing)

The original 5-model lineup (GPT OSS 120B, Gemma 4 31B, DeepSeek V4 Flash, Minimax M2.7, Nemotron 120B) was possible because **NVIDIA NIM hosts many different open-weight models behind one API**. Google AI Studio does not work that way — it only serves **Gemini** models. This means:

- The 5-model switcher cannot stay as-is with the same 5 entries; it must be replaced with actual Gemini model variants.
- This is a real product tradeoff, not just a config change — flagging it explicitly so it's a conscious decision, not a silent regression.

**Recommended replacement lineup** (verify exact current model ids in Google AI Studio's model list before hardcoding, since these are renamed/retired periodically):

| # | Display name | Suggested Gemini model id | Notes |
|---|---|---|---|
| 1 | Gemini 2.5 Flash | `gemini-2.5-flash` | Best default — fast, generous free tier |
| 2 | Gemini 2.5 Flash-Lite | `gemini-2.5-flash-lite` | Fastest/cheapest, lighter reasoning |
| 3 | Gemini 2.5 Pro | `gemini-2.5-pro` | Strongest reasoning, lower free-tier request volume |
| 4 | Gemini 2.5 Flash (Thinking) | `gemini-2.5-flash` with thinking config enabled | Use for chain-of-thought — see §5 |
| 5 | *(optional)* latest preview model | e.g. `gemini-3-flash-preview` if available | Confirm availability/stability before shipping — preview models can be unstable |

Agent should treat this table as a starting point, not gospel — confirm current model ids and free-tier availability directly against Google AI Studio's documentation/model list at implementation time.

**Alternative if you want to keep multi-vendor variety:** instead of a full replacement, route through **OpenRouter** (free tier, one API key, many providers including Gemini) so you can keep a mixed lineup across vendors. This PRD assumes a direct-to-Google migration per your request, but flag this alternative back if variety matters more than simplicity.

---

## 3. API compatibility approach

Google AI Studio exposes two ways to call Gemini:
1. **Native Generative Language API** (`generativelanguage.googleapis.com`) — Google's own request/response shape, different from what the backend currently sends to NVIDIA.
2. **OpenAI-compatible endpoint** (`https://generativelanguage.googleapis.com/v1beta/openai/`) — accepts the same `chat/completions` request shape (messages array, `stream: true`, etc.) that the code already sends to NVIDIA.

**Decision: use the OpenAI-compatible endpoint.** This means the existing `/api/neurobot/chat` route's request-building and SSE-forwarding logic barely changes — mostly the base URL, auth header, and model id mapping. Do not rewrite the route to use Google's native SDK/format; that's a much larger change for no benefit here.

---

## 4. Environment & Config Changes

### 4.1 Environment variables
```diff
- NVIDIA_API_KEY=
- NVIDIA_API_BASE_URL=https://integrate.api.nvidia.com/v1
+ GOOGLE_AI_STUDIO_API_KEY=
+ GOOGLE_AI_STUDIO_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
```
- Get the key from Google AI Studio (aistudio.google.com) — no billing/credit card required for the free tier as of this writing, but confirm current signup requirements since these change.
- Do not reuse the `NVIDIA_*` variable names for the new key — rename cleanly so there's no confusion about which provider is active, and remove the old NVIDIA variables from `.env`/`.env.example` once migration is confirmed working.

### 4.2 Model config file
Update `models.config.ts` (or equivalent) to the new Gemini lineup from §2 — `id`, `display name`, `context window`, `supports-reasoning flag`, `max tokens`, `icon` per entry, same shape as before so nothing downstream (composer dropdown, `/model` slash command) needs structural changes — only the data.

### 4.3 Personality config
No changes needed — personalities are just system prompts, provider-agnostic. Verify system-prompt-as-first-message still works correctly against Gemini's OpenAI-compat endpoint (some providers handle the `system` role slightly differently — test this specifically, see §7).

---

## 5. Chain-of-Thought / Reasoning

Gemini 2.5 models support "thinking" (extended reasoning) but it's controlled differently than NVIDIA's reasoning models:
- Thinking must be explicitly enabled per-request via a `thinking_config`/`reasoning_effort`-style parameter (exact field name depends on whether you're using the native API or the OpenAI-compat layer — verify current parameter name in Google's docs, this has changed across API versions).
- When enabled, reasoning tokens may come back as a distinct field/block rather than interleaved with content — confirm whether the OpenAI-compat endpoint exposes this as `reasoning_content` (matching what the backend already expects to normalize into `reasoning_delta` SSE events) or under a different key that needs mapping.
- **Action:** update the backend's stream-normalization logic (the part that emits `reasoning_delta` vs `content_delta` SSE events) to read from whatever field Gemini's OpenAI-compat layer actually returns for reasoning — this is likely the single trickiest part of the migration and needs hands-on verification against a real streaming response, not just documentation.
- If Gemini's reasoning output doesn't cleanly separate from content in the OpenAI-compat mode, an acceptable fallback is to disable the "Thought for N.Ns" UI for Gemini models specifically until this is resolved — do not fabricate a fake "Thought for Xs" label if no real reasoning content was returned.

---

## 6. Backend Route Changes (`/api/neurobot/chat`)

1. Replace the `fetch(`${apiBaseUrl}/chat/completions`, ...)` call's base URL and headers:
   - NVIDIA used a `Authorization: Bearer ${NVIDIA_API_KEY}` header — confirm Google's OpenAI-compat layer expects the same header format (it generally does, via API key as bearer token) rather than a query-param key, and adjust if not.
2. Map the frontend's model id (from the updated `models.config.ts`) directly to Gemini's model id in the request body's `model` field — no other request shape changes needed if staying on the OpenAI-compat endpoint.
3. Add a clear startup/health check: `/api/neurobot/health` (already spec'd in the base PRD) should now verify `GOOGLE_AI_STUDIO_API_KEY` is present, not `NVIDIA_API_KEY`.
4. **Add an explicit fetch timeout** (AbortController, ~15–30s) if not already present — this was actually the proximate cause of the original bug report (a hung socket with no timeout took 2.8 minutes to fail). Do this regardless of provider; it should have existed already.
5. Error normalization: Google's error response shape/codes differ from NVIDIA's — update the error-mapping logic so rate-limit, invalid-model, and auth errors from Google surface as the same friendly `{ code, message }` shape the frontend already expects, rather than leaking Google-specific error JSON into the chat UI.

---

## 7. Verification Plan

1. **Env & auth:** confirm `GOOGLE_AI_STUDIO_API_KEY` loads correctly (log presence/length only, never the key itself).
2. **Basic chat:** send a plain message with each of the new Gemini model options; confirm streaming works end-to-end and content renders token-by-token, not all-at-once.
3. **System prompt / personality:** confirm each of the 7 personalities still produces distinctly different tone/behavior when tested against Gemini (system-role handling can differ subtly between providers).
4. **Reasoning:** confirm whether `reasoning_delta` events are actually populated for the "Thinking" model variant; if not cleanly separable, confirm the fallback behavior from §5 (no fake "Thought for Xs" label) is in place instead of silently breaking.
5. **Rate limits:** deliberately send enough requests to hit Google AI Studio's free-tier rate limit at least once, and confirm the resulting error surfaces as a clear, friendly in-chat message (not a raw 429 dump or a hung request).
6. **Timeout:** simulate a slow/unreachable endpoint (e.g. temporarily point `GOOGLE_AI_STUDIO_BASE_URL` at an invalid host) and confirm the request fails within the new timeout window (~15–30s), not after several minutes.
7. **Mock-streaming fallback:** confirm the frontend's mock-streaming fallback (flagged as a separate concern previously) still only activates in development and clearly indicates mock mode — this migration should not accidentally make mock mode more likely to trigger silently.
8. **Regression check:** confirm `/findgym`, `/templates`, `/history`, `/share`, and all other non-model-dependent slash commands are completely unaffected (they should be, since none of them call the chat model).

---

## 8. Non-Functional / Privacy Note

Google AI Studio's free tier may use submitted prompts to improve their models (data policy varies by region — the EU/UK/EEA has different terms). Since Neurobot may carry personal fitness/health-adjacent conversation content (per the app's domain), consider surfacing a brief in-app disclosure near the composer or in a settings/about panel: something like "Conversations may be processed by Google's Gemini API; see Google's terms for data usage." This is a product/legal decision, not purely technical — flag to product owner before shipping publicly, especially if EU/UK users are in scope (different data-use defaults may apply there).

---

## 9. Rollback Plan

Keep the NVIDIA integration code intact (do not delete `NVIDIA_*` handling from git history — just stop using it) for at least one release cycle, in case Google AI Studio's free tier proves too rate-limited for real usage and a rollback or hybrid (multi-provider) approach is needed. Consider, as a fast-follow rather than part of this migration, making the provider a config-level switch rather than a hardcoded single provider, so future swaps (or fallback-on-rate-limit logic) don't require another full migration pass.

---

## 10. Acceptance Criteria

- [ ] `NVIDIA_API_KEY`/`NVIDIA_API_BASE_URL` fully replaced with `GOOGLE_AI_STUDIO_API_KEY`/`GOOGLE_AI_STUDIO_BASE_URL` in `.env`, `.env.example`, and all code references.
- [ ] Model selector shows the new Gemini-based lineup; old NVIDIA-hosted model names (GPT OSS, DeepSeek, Minimax, Nemotron) are removed from the UI and config.
- [ ] Streaming chat works correctly for every model in the new lineup, with a hard timeout in place (no multi-minute hangs).
- [ ] All 7 personalities still function correctly against the new provider.
- [ ] Reasoning/"Thought for Xs" either works correctly with real reasoning content, or is cleanly disabled for models where it can't be verified — never fabricated.
- [ ] Rate-limit and auth errors from Google surface as friendly in-chat messages, not raw error dumps or hangs.
- [ ] `/findgym`, `/templates`, `/history`, `/share`, `/new` all continue working unaffected.
- [ ] `/api/neurobot/health` correctly reflects the new provider's key presence.
- [ ] No lingering references to NVIDIA anywhere in active code paths (search the codebase to confirm), though the integration may remain in git history per §9.
