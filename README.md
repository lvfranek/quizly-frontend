# Quizly Frontend

> **This is the frontend repository.** The REST API lives in
> **[lvfranek/quizly-backend](https://github.com/lvfranek/quizly-backend)** (Django, DRF).

Web app for **Quizly**, which turns YouTube videos into quizzes. Paste a YouTube link and the backend's AI writes 10 multiple-choice questions about the video. You can play the quiz, review your answers, rename and delete quizzes.

**Live demo:** [quizly.franekkaminski.dev](https://quizly.franekkaminski.dev)
Demo login: `testuser` / `Testpasswort123!` (reset to sample quizzes on every login, max. 3 new quizzes per day)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [License](#license)

## Tech Stack

- `React` 19 with `TypeScript`
- `Vite` as dev server and build tool
- `React Router` for client-side routing
- CSS Modules with design tokens as CSS custom properties (no UI framework)
- `Oxlint` for linting
- Self-hosted fonts via `@fontsource` (Space Grotesk, JetBrains Mono)

## Features

- Animated intro page with the Quizly robot
- Register, log in and log out with client-side validation and server field errors
- Create a quiz from a YouTube link, with a live progress card while the AI works (about 20 to 30 seconds)
- Quiz library with skeleton loading, empty state and delete
- Quiz detail page with inline editing of title and description (autosave) and the embedded video
- Quiz player with progress bar and back/next navigation
- Result screen with score and a review of all answers, optionally with the correct solutions
- Legal notice and privacy policy
- Responsive layout down to phone width, visible focus states, reduced-motion support

## Getting Started

Requirements: Node.js 20.19 or newer and a running [Quizly backend](https://github.com/lvfranek/quizly-backend).

```bash
git clone https://github.com/lvfranek/quizly-frontend.git
cd quizly-frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5500**. The dev server runs on `127.0.0.1:5500` on purpose: the backend allows CORS requests from this origin. Use `127.0.0.1`, not `localhost`, otherwise the auth cookies are not sent.

## Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the API, with trailing slash |

Vite picks the file by mode, so nothing has to be switched by hand:

- `.env.development` (`npm run dev`): `http://127.0.0.1:8000/api/`
- `.env.production` (`npm run build`): `https://api.quizly.franekkaminski.dev/api/`

Create a `.env.local` to override the value on your machine.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Project Structure

```
src/
├── api/           # fetch wrapper with token refresh, auth and quiz endpoints
├── components/    # Layout (header/footer), form Field, RobotLogo
├── lib/           # validation, date formatting, YouTube helpers
├── pages/         # one component + CSS module per route
├── toast/         # toast notifications (context + provider)
├── App.tsx        # routes
├── index.css      # design tokens, base styles, buttons
└── main.tsx       # entry point
```

| Route | Page |
| --- | --- |
| `/` | Intro page |
| `/login`, `/register` | Authentication |
| `/library` | Create quizzes and list all quizzes |
| `/quiz/:id` | Quiz details, editing and video |
| `/quiz/:id/play` | Play the quiz, result and answer review |
| `/legal-notice`, `/privacy` | Legal pages |

## Authentication

The backend sets the JWT access token (5 minutes) and refresh token (1 day) as **HttpOnly cookies**. The frontend never reads or stores tokens. Every request is sent with `credentials: "include"`. When a protected request returns `401` or `403`, `apiFetch` calls `token/refresh/` once and retries the request. If that fails too, the user is redirected to `/login`.

## Deployment

The app is a static single-page app hosted on Vercel. `vercel.json` rewrites all paths to `index.html` so that client-side routes work on reload.

## License

All code in this repository was written by me. It was built as part of a project of the Developer Akademie.

Entwickelt im Rahmen des Weiterbildungsprogramms der Developer Akademie GmbH.
