# NeuroFit AI

An AI-powered fitness platform built with Next.js that generates personalized workout programs, diet plans, macro breakdowns, and grocery lists — all from a single intake form. Powered by **Google AI Studio** (Gemini), authenticated with **Clerk**, and backed by **Convex**.

<p align="center">
  <img src="/public/neurofit2.0.png" alt="Project Image" width="100%">
</p>
---

## Features

- **AI Program Generation** — Personalized workout schedules, diet plans, macros, and grocery lists generated via Google AI Studio's Gemini 3.5 Flash model with native JSON schema formatting
- **Multi-step Intake Form** — Structured form flow collecting fitness goals, body metrics, dietary preferences, equipment, and lifestyle data
- **Neurobot Chatbot** — AI conversational assistant powered by Google AI Studio (Gemini) featuring customizable coaching personalities, markdown streaming, session management, and reasoning display
- **Slash Commands** — Command shortcuts including `/findgym` for geocoding and discovering local gyms, `/templates` for fitness prompt templates, `/history` for browsing past sessions, and `/new` to reset
- **Profile Dashboard** — View and manage generated plans with tabbed navigation (workout, diet, macros, grocery list)
- **PDF Export** — Download your fitness plans as formatted PDF documents
- **Dark Mode** — Theme switching via `next-themes`
- **Authentication** — Secure sign-in/sign-up powered by Clerk
- **Plan Caching** — Intelligent caching layer to avoid redundant AI calls for similar user profiles

---

## Tech Stack

### Core

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **UI:** React 19
- **Styling:** Tailwind CSS 4

### UI Components & UX

- **Component system:** shadcn/ui
- **Primitives:** Radix UI
- **Icons:** Lucide React, Hugeicons
- **Animation:** Motion (Framer Motion)
- **Theming:** next-themes

### Forms & Validation

- **Form state:** TanStack Form, React Hook Form
- **Validation:** Zod

### Backend & Data

- **Backend:** Convex (database + serverless functions)
- **HTTP API:** Convex HTTP actions
- **Webhooks:** Svix (Clerk webhook verification)

### AI & Chat Assistants

- **Program Generation Provider:** [Google AI Studio](https://aistudio.google.com) (Gemini API via OpenAI-compatible endpoint)
- **Program Generation Model:** `gemini-3.5-flash`
- **Intake Features:** Native structured output (`response_format` JSON schema) for 100% reliable structure compilation, optimized lightweight prompts, automatic retry, response validation & sanitization
- **Neurobot Provider:** [Google AI Studio](https://aistudio.google.com) (Gemini API via OpenAI-compatible endpoint)
- **Neurobot Models:** Gemini 3.5 Flash, Gemini 3.1 Flash Lite, Gemini 3.1 Pro (Preview)
- **Neurobot Features:** Custom fetch timeout (20s) to prevent socket hangs, real-time reasoning extraction (`<think>` blocks parsed into dedicated UI thought containers), streaming SSE responses, 7 customizable personas

### Maps & Location

- **Map rendering:** MapLibre GL

### PDF Generation

- **PDF export:** React-PDF, jsPDF

### Testing

- **E2E testing:** Playwright

### Utilities

- **Class utilities:** clsx, tailwind-merge, class-variance-authority

---

## Prerequisites

- Node.js >= 18
- npm or yarn
- [Clerk](https://clerk.com) account & API keys
- [Convex](https://convex.dev) project & deployment
- [Google AI Studio](https://aistudio.google.com) API keys (one for Program Generation, one for Neurobot Chat)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/xavierzaidane/neurofit-ai.git
cd neurofit-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_HTTP_URL=https://your-deployment.convex.site

# Google AI Studio (Gemini) - Program Generation (set in Convex dashboard)
GOOGLE_AI_STUDIO_API_KEY_PROGRAM=your_program_gemini_api_key
GOOGLE_AI_STUDIO_BASE_URL_PROGRAM=https://generativelanguage.googleapis.com/v1beta/openai

# Google AI Studio (Gemini) - Neurobot Chat (set in project env vars)
GOOGLE_AI_STUDIO_API_KEY_NEUROBOT=your_neurobot_gemini_api_key
GOOGLE_AI_STUDIO_BASE_URL_NEUROBOT=https://generativelanguage.googleapis.com/v1beta/openai
```

> Replace all placeholder values with your actual credentials. Groq environment variables are set in the [Convex dashboard](https://dashboard.convex.dev) as server-side env vars.

### 4. Start Convex

```bash
npx convex dev
```

### 5. Run the development server

In a separate terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Build for production

```bash
npm run build
npm start
```

---

## Usage

1. Sign up or log in via Clerk.
2. Navigate to the **Program** page.
3. Complete the multi-step intake form (body metrics, goals, diet, lifestyle).
4. Click **Generate** — the AI builds your personalized plan.
5. View your plan on the **Profile** page (workout, diet, macros, grocery list tabs).
6. Export your plan as a **PDF**.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign-in / Sign-up routes
│   ├── program/         # Intake form & plan generation
│   ├── profile/         # User dashboard & plan viewer
│   ├── neurobot/        # AI chatbot assistant
│   └── loading/         # Loading states
├── components/
│   ├── landing/         # Landing page components
│   ├── navigations/     # Nav bar & mobile menu
│   ├── neurobot/        # Chatbot UI components
│   ├── pdf/             # PDF export components
│   ├── profile/         # Profile page components
│   ├── program/         # Intake form components
│   └── ui/              # Shared UI components (shadcn/ui)
├── data/                # Static data & constants
├── lib/                 # Utility functions
├── providers/           # Context providers (Convex, Clerk, Theme)
└── types/               # TypeScript type definitions

convex/
├── http.ts              # HTTP actions (AI generation, webhooks)
├── schema.ts            # Database schema (users, plans, gyms, bookings, reminders)
├── plans.ts             # Plan queries & mutations
├── users.ts             # User queries & mutations
└── auth.config.ts       # Clerk auth configuration
```

---

## Environment Variable Reference

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key |
| `CLERK_SECRET_KEY` | Clerk backend secret key |
| `CLERK_WEBHOOK_SECRET` | Svix secret for Clerk webhooks |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route path |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route path |
| `CONVEX_DEPLOYMENT` | Convex deployment reference |
| `NEXT_PUBLIC_CONVEX_URL` | Convex client endpoint |
| `NEXT_PUBLIC_CONVEX_HTTP_URL` | Convex HTTP actions endpoint |
| `GOOGLE_AI_STUDIO_API_KEY_PROGRAM` | Gemini API key for program generation (set in Convex dashboard) |
| `GOOGLE_AI_STUDIO_BASE_URL_PROGRAM` | Base URL for program generation Gemini OpenAI-compatible endpoint |
| `GOOGLE_AI_STUDIO_API_KEY_NEUROBOT` | Gemini API key for Neurobot chat |
| `GOOGLE_AI_STUDIO_BASE_URL_NEUROBOT` | Base URL for Neurobot chat Gemini OpenAI-compatible endpoint |
| `CORS_ORIGIN` | Allowed CORS origin for HTTP actions |

---

## License

This project is for educational and personal use.
