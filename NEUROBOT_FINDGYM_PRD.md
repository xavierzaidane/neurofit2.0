# PRD — Neurobot `/findgym` Feature

**Project:** neurofit2.0 — `feature/neurobot`
**Type:** New feature (slash command)
**Status:** Ready for implementation
**Audience:** AI coding agent (e.g. Claude Code)
**Builds on:** base Neurobot PRD (models/personalities/streaming/sessions) and the slash-command system already implemented (`/new`, `/history`, `/templates`, etc.)

---

## 1. Summary

`/findgym` is a new slash command that lets a user find nearby gyms without leaving the Neurobot chat. Unlike a normal chat message, this is a **scripted, deterministic two-turn flow** — the assistant asks for a location, the user replies, and the backend returns the top 5 nearest gyms as a card list. The underlying AI model (NVIDIA API) is never called during this flow; all responses are backend-driven, not model-generated, to guarantee accurate, non-hallucinated location data.

---

## 2. Goals

- User types `/findgym`, is asked for a location, replies with a location (typed text, or optionally their device GPS), and receives the 5 nearest gyms with name, address, and distance.
- Zero ongoing cost — built entirely on free, keyless location APIs (OpenStreetMap ecosystem), consistent with the "no budget" constraint for this feature.
- The flow integrates cleanly with the existing slash-command system and session/message model — results are stored as normal messages in the session (so they persist in `localStorage` and appear in `/history` and shared sessions like any other message).

## 3. Non-Goals

- No gym booking, membership sign-up, or class scheduling — discovery only.
- No ratings/reviews (not available from the free data source used — see §6).
- No saved/favorite gyms list in v1.
- No in-chat map rendering in v1 — results link out to an external map instead of an embedded map view.

---

## 4. User Flow

```
User: /findgym
Assistant (scripted): "Sure — what location or region should I search
                       near? (e.g. a neighborhood, city, or address)"
User: "Orchard Road, Singapore"
Assistant (scripted): "Searching for gyms near Orchard Road, Singapore..." (transient)
Assistant (scripted): [5 gym cards: name, address, distance, "Open in Maps" link]
```

Edge cases:
- Location can't be resolved → assistant asks the user to try a more specific location, flow stays open for another attempt.
- Location resolves but no gyms found nearby → assistant says so, flow stays open for another attempt.
- User sends another slash command (e.g. `/new`) while `/findgym` is awaiting a location → the pending `/findgym` flow is silently cancelled and the new command runs normally.
- Backend/network error → assistant shows a generic error, flow ends (does not loop).

---

## 5. Functional Requirements

### 5.1 Slash command registration
- Add `/findgym` to the existing slash-command menu/autocomplete, with description "Find gyms near a location" and an appropriate icon (e.g. `Dumbbell` from lucide-react).
- Triggering it does **not** send a message to the model. It pushes a scripted assistant message asking for a location and puts the conversation into a "pending command" state.

### 5.2 Pending-command state machine
- The app must track that a `/findgym` location reply is expected next. This state must:
  - Intercept the user's very next composer submission and route it to the gym-search flow instead of the normal chat pipeline.
  - Be cancelable by any other slash command the user issues instead (see §4 edge cases).
  - Be scoped to the active session only (switching sessions via `/history` clears any pending state).

### 5.3 Scripted messages
- All assistant messages in this flow (the location prompt, the "searching..." transient message, the results, and any error messages) are **not** model output. They must be visually/structurally marked as scripted (e.g. a `scripted: true` flag on the message) so the app never offers a "regenerate" action on them (there is no model call to regenerate).
- The user's location reply is still stored as a normal user-role message in the session, so the transcript reads naturally.

### 5.4 Location input
- **v1 required:** free-text location input (neighborhood, city, address, landmark) typed by the user in response to the assistant's prompt.
- **v1 optional enhancement (recommended, not required for launch):** if the browser supports `navigator.geolocation` and the user grants permission, offer a one-tap "Use my current location" affordance alongside the text prompt so the user can skip typing. If declined or unsupported, fall back to the typed-text flow. This should not block v1 if it adds complexity — ship typed-location first, add geolocation as a fast-follow if time allows.

### 5.5 Results
- Return exactly the top 5 nearest results when 5+ exist within a reasonable search radius; return fewer with a clear message if genuinely fewer exist even after widening the search radius (see §6.2).
- Each result card shows: gym name, address (if available), distance from the searched location (formatted as meters for <1km, kilometers with 1 decimal above that), and an "Open in Maps" link.
- Results are rendered as compact cards, consistent with the existing card/list visual pattern used elsewhere in Neurobot (templates, history) — not raw JSON, not a plain paragraph of text.

---

## 6. Backend Specification

### 6.1 Provider choice: OpenStreetMap (Nominatim + Overpass) — free, no API key

Given the no-budget constraint, this feature uses two free OSM services instead of a paid provider (Google Places, Yelp):

| Step | Service | Purpose |
|---|---|---|
| 1. Geocode | Nominatim (`nominatim.openstreetmap.org`) | Convert free-text location → lat/lng |
| 2. Search | Overpass API (`overpass-api.de`) | Find gym/fitness-centre POIs near a lat/lng |

**Known tradeoffs to accept:** OSM data is crowdsourced, not centrally verified — coverage is generally good in cities but can miss some gyms or have incomplete address/hours data. There are no star ratings or reviews (not part of OSM). This is an accepted tradeoff for a $0 solution; upgrading to a paid provider later is a drop-in swap at the backend layer only (frontend/card rendering doesn't need to change).

**Usage policy compliance (required, not optional):**
- All requests to Nominatim must include a descriptive `User-Agent` header identifying the app and a contact method (Nominatim will block generic/missing user agents per its usage policy).
- Nominatim requests must be rate-limited server-side to roughly 1 request/second — add a simple queue or in-memory limiter around this specific endpoint.

### 6.2 Endpoint: `GET /api/neurobot/findgym`

**Query param:** `location` (free text) — OR `lat`/`lng` directly if the geolocation fast-path (§5.4) is used, skipping the geocode step.

**Process:**
1. If `location` text was given: geocode via Nominatim (`?q={location}&format=json&limit=1`). If no result, return `{ error: "location_not_found" }` with HTTP 200 (this is an expected user-facing case, not a server error).
2. Search Overpass for `amenity=gym` and `leisure=fitness_centre` nodes within a 5km radius of the resolved coordinates.
3. If fewer than 5 results are returned, retry once with a wider radius (e.g. 15km) before giving up.
4. Compute distance from the search point to each result (haversine formula), sort ascending, take top 5.
5. Normalize each result to:
```json
{ "name": "...", "lat": 0, "lng": 0, "address": "... | omitted if unavailable", "distanceMeters": 850 }
```
   Build `address` from available OSM tags (e.g. `addr:housenumber`, `addr:street`, `addr:city`); omit the field entirely rather than showing an empty/undefined string if OSM has no address tags for that node.
6. If zero gyms are found even after the widened retry, return `{ error: "no_gyms_found", searchedLocation: { lat, lng, resolvedName } }`.

**Success response:**
```json
{
  "location": { "lat": 1.29, "lng": 103.85, "resolvedName": "Orchard Road, Singapore" },
  "gyms": [
    { "name": "Example Fitness", "lat": 1.291, "lng": 103.851, "address": "1 Orchard Rd", "distanceMeters": 850 }
  ]
}
```

### 6.3 "Open in Maps" link
No API key needed — link to OpenStreetMap directly:
`https://www.openstreetmap.org/?mlat={lat}&mlon={lng}#map=17/{lat}/{lng}`

---

## 7. Frontend Specification

### 7.1 State
```ts
type PendingCommand =
  | { type: "none" }
  | { type: "findgym_awaiting_location" };
```
Tracked alongside existing session/composer state in the `useNeurobot` hook or `page.tsx`.

### 7.2 Composer send interception
Before the composer's normal `sendMessage()` call fires, check `pendingCommand`:
- If `findgym_awaiting_location`: clear the pending state, append the user's text as a normal user message, then run the gym-search flow (geocode → search → render) instead of calling the model.
- Otherwise: behave exactly as today.

### 7.3 Message rendering
- Scripted assistant messages (`scripted: true`) render like normal assistant messages but never show a "regenerate" action.
- The "searching..." transient message may use the existing ShiningText shimmer component (already integrated for in-progress states) since this is a genuine loading state — replace it in place once results/errors arrive, rather than appending a second message.
- Gym results render as a card list component (new, reusable) — one row per gym: name (bold), address (if present), formatted distance, "Open in Maps" link.

### 7.4 Error messaging (scripted, user-facing)
| Case | Message | Flow outcome |
|---|---|---|
| `location_not_found` | "I couldn't find that location — could you try a more specific address or nearby landmark?" | Re-enter `findgym_awaiting_location` so the user can retry immediately |
| `no_gyms_found` | "I couldn't find any gyms within 15km of {resolved location}. Try a different area?" | Re-enter `findgym_awaiting_location` |
| Network/timeout error | "Something went wrong searching for gyms — please try again in a moment." | Clear pending state, flow ends (no auto-retry loop) |

---

## 8. Data Model Additions

Extend the existing `ChatMessage` type (see base PRD §11):
```ts
interface ChatMessage {
  // ...existing fields
  scripted?: boolean;   // true for non-model-generated messages (e.g. /findgym flow)
  gymResults?: {
    location: { lat: number; lng: number; resolvedName: string };
    gyms: { name: string; lat: number; lng: number; address?: string; distanceMeters: number }[];
  };
}
```
Storing results directly on the message (rather than only as rendered text) allows them to persist correctly in `localStorage`, survive `/history` reload, and render as proper cards again if a shared/forked session is reopened later.

---

## 9. Non-Functional Requirements

- **No cost at current scale**; if usage grows significantly, revisit self-hosting an Overpass instance or moving to a paid provider (backend-only change, per §6.1).
- **Respect third-party rate limits** (Nominatim ~1 req/s) — do not let concurrent `/findgym` requests from multiple users burst past this; queue if needed.
- **No model/NVIDIA API calls** anywhere in this flow — verify via network inspection during testing.
- **Graceful degradation:** if Nominatim or Overpass is down/slow, fail with the generic error message (§7.4) rather than hanging indefinitely — apply a reasonable timeout (e.g. 10–15s) per upstream call.

---

## 10. Acceptance Criteria

- [ ] `/findgym` appears in the slash-command menu and does not call the model when triggered.
- [ ] Typing a location after the prompt returns exactly 5 gyms (or fewer, with a clear explanation, only if genuinely fewer exist within the widened radius).
- [ ] Each result card shows name, address (when available), correctly formatted distance, and a working "Open in Maps" link.
- [ ] Invalid/unresolvable locations prompt the user to retry without needing to re-type `/findgym`.
- [ ] Locations with zero nearby gyms prompt the user to retry without needing to re-type `/findgym`.
- [ ] Sending `/new`, `/history`, or another slash command while `/findgym` is awaiting a location cancels the pending flow cleanly.
- [ ] Gym results persist correctly across a page reload (via `localStorage`) and re-render as cards, not raw text.
- [ ] Nominatim requests include a valid `User-Agent` header and are rate-limited server-side.
- [ ] No NVIDIA/model API calls occur at any point during the `/findgym` flow (verified via network tab).

---

## 11. Open Decision

Ship v1 with typed-location input only, or include the "Use my current location" browser-geolocation fast-path (§5.4) at launch? Typed-only is faster to ship and works identically on all devices; geolocation is a nicer UX on mobile but adds a permission-prompt edge case to handle. Recommendation: ship typed-only first, add geolocation as a fast-follow.
