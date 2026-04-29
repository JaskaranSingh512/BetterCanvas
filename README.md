
# BetterCanvas

BetterCanvas is a full-stack app with:
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- MongoDB running locally (default URI: `mongodb://127.0.0.1:27017`)

## Project Structure

- `src/` - frontend app
- `server/` - backend API
- `.env.example` - frontend env template
- `server/.env.example` - backend env template

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

Demo login:
- Email: `student@university.edu`
- Password: `password123`

## Smoke Test

With backend running:

```bash
npm --prefix server run smoke
```

## requirements.txt Note

This repo is a Node.js project. A `requirements.txt` file is included only as a placeholder, and there are no Python dependencies required to run the app.
  