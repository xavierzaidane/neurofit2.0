# NeuroFit AI

A React/Next.js web app that lets users generate personalized fitness programs through a structured intake flow powered by Ollama. Authentication is handled by Clerk and backend services run on Convex.

---

## Features

* Form-based intake for personalized program generation
* Personalized fitness program generation
* User authentication with Clerk
* Smooth UI with Tailwind CSS

---

## Tech Stack

### Core

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **UI:** React 19
* **Styling:** Tailwind CSS

### UI Components & UX

* **Component system:** shadcn/ui
* **Primitives:** Radix UI
* **Icons:** lucide-react
* **Animation:** motion

### Forms & Validation

* **Form state:** TanStack Form
* **Validation:** Zod (available for schema validation)

### Backend & Data

* **Backend:** Convex (database + serverless functions)
* **HTTP API:** Convex HTTP actions

### Auth & AI

* **Authentication:** Clerk
* **AI runtime:** Ollama (local or hosted)

### Utilities

* **Class utilities:** clsx, tailwind-merge, class-variance-authority

---

## Prerequisites

* Node.js >= 18
* npm or yarn
* Ollama running locally
* Clerk account & API keys
* Convex project & deployment

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
# or
yarn
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up


# Ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3.5:0.8b
OLLAMA_API_KEY=your_ollama_api_key

# Convex HTTP
NEXT_PUBLIC_CONVEX_HTTP_URL=https://your-deployment.convex.site

# Convex
CONVEX_DEPLOYMENT=dev:oceanic-snail-89
NEXT_PUBLIC_CONVEX_URL=https://oceanic-snail-89.convex.cloud

# Optional CORS
CORS_ORIGIN=http://localhost:3000
```

> Replace all keys with your actual credentials.

---

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 5. Build for production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

---

## Usage

1. Sign up or log in via Clerk.
2. Go to **Program** page.
3. Fill out the intake form.
4. Click **Submit** to generate your personalized fitness program.
5. You'll be redirected to your profile page automatically.

---

## Project Structure

* **src/app**: Next.js routes (App Router)
* **src/app/components**: Page-level components (landing, program, profile)
* **src/components/ui**: Shared UI components (shadcn/ui)
* **convex**: Backend logic, schema, and HTTP endpoints
* **public**: Static assets

## Environment Variable Reference

| Variable                            | Description                 |
| ----------------------------------- | --------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key          |
| `CLERK_SECRET_KEY`                  | Clerk backend key           |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`     | Sign-in route               |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`     | Sign-up route               |
| `OLLAMA_BASE_URL`                   | Ollama base URL             |
| `OLLAMA_MODEL`                      | Ollama model name           |
| `OLLAMA_API_KEY`                    | Ollama cloud API key        |
| `CONVEX_DEPLOYMENT`                 | Convex deployment reference |
| `NEXT_PUBLIC_CONVEX_URL`            | Convex endpoint             |
| `NEXT_PUBLIC_CONVEX_HTTP_URL`       | Convex HTTP endpoint        |
| `CORS_ORIGIN`                       | Allowed origin for HTTP     |

---

