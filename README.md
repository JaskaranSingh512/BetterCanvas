
# BetterCanvas

BetterCanvas is a full-stack redesign of a student LMS dashboard focused on reducing clutter, improving readability, and making "what's due next" easier to understand.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling/UI: Tailwind CSS, Radix UI, Lucide icons
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- MongoDB running locally (default URI: `mongodb://127.0.0.1:27017`)

## Project Structure

- `src/` - frontend app
- `server/` - backend API
- `.env.example` - frontend env template
- `server/.env.example` - backend env template

## Current Features

- Cleaner dashboard experience with reduced navigation clutter
- Inbox behavior integrated as a top-right dropdown
- Focused course panel with customizable pinned course
- Calendar widget with larger task markers and course/day labels
- Day click flow:
  - if entries exist, opens existing day entries first
  - still supports creating a new assignment/event from a top tab
- Course detail tabs:
  - Overview
  - Announcements
  - Discussions
  - Files
  - Grades (Canvas-style gradebook layout)
- Hover previews on course cards for announcements/discussions/files
- Due Soon panel driven by real API task data (not hardcoded)
- Local profile photo upload and sidebar avatar display
- Dark mode toggle support

## Setup

Install dependencies:

```bash
npm install
npm --prefix server install
```

Create environment files:

```bash
copy .env.example .env
copy server\.env.example server\.env
```

On macOS/Linux:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

## DEMO
- `https://www.loom.com/share/700af9e8e2514f5194d1bb44ac3e85ed`


## Environment Variables

Frontend (`.env`):
- `VITE_API_BASE_URL=http://localhost:4000/api`

Backend (`server/.env`):
- `PORT=4000`
- `MONGO_URI=mongodb://127.0.0.1:27017/bettercanvas`
- `JWT_SECRET=bettercanvas_dev_secret`
- `ALLOWED_ORIGINS=http://localhost:5173`

## Run the App

Frontend only:

```bash
npm run dev
```

Backend only:

```bash
npm run dev:server
```

Frontend + backend together:

```bash
npm run dev:all
```

Default local URLs:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`

## Seed Data

Seed the database:

```bash
npm run seed
```

Notes:
- Seed data includes assignments/events across April 30 and May 2026 for realistic dashboard/calendar demos.
- Re-running the seed script clears and recreates demo data.

Demo login:
- Email: `student@university.edu`
- Password: `password123`
