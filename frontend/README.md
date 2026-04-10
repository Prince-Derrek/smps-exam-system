# SMPS Supplementary Exam System — Frontend

React + Vite frontend for the SMPS Supplementary Exam System.
Built with a unified corporate design system using the JKUAT green/white palette, Tailwind CSS v4, and Flowbite React.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js v18+](https://nodejs.org/) — local dev only
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) — local dev only

---

## Option 1 — Docker (Recommended)

Runs the entire stack (database + API + frontend) with one command.

```bash
# 1. Copy the env file and fill in your values
cp .env.example .env

# 2. Build and start everything
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| API | http://localhost:5137 |
| Swagger | http://localhost:5137/swagger |
| PostgreSQL | localhost:5433 |

To stop:
```bash
docker compose down
```

To wipe the database volume and start fresh:
```bash
docker compose down -v
```

---

## Option 2 — Local Development

### 1. Start the Database

```bash
cd backend/SMPS.SupplementaryExamSystem
docker compose down -v && docker compose up -d
```

> The `-v` flag wipes any stale volume. Required on first setup or if you get a **password authentication failed** error.

### 2. Apply Database Migrations

```bash
cd backend/SMPS.SupplementaryExamSystem
dotnet ef database update \
  --project SMPS.Infrastructure/SMPS.Infrastructure.csproj \
  --startup-project SMPS.API/SMPS.API.csproj
```

### 3. Start the Backend API

```bash
cd backend/SMPS.SupplementaryExamSystem/SMPS.API
dotnet run --launch-profile http
```

- API: `http://localhost:5137`
- Swagger: `http://localhost:5137/swagger`

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 + Flowbite React |
| Routing | React Router v7 |
| HTTP | Axios |
| Auth State | React Context API (`AuthContext`) |
| Icons | Lucide React |
| QR Code | react-qr-code, html5-qrcode |
| Real-time | SignalR (`@microsoft/signalr`) |
| Container | Docker + nginx |

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#1A6B3A` | Sidebar, buttons, active states |
| `--gold` | `#F5A623` | Accents, active nav, highlights |
| `--surface` | `#F4F7F5` | Page background |
| `--border` | `#E2EDE6` | Card borders, dividers |

All tokens defined in `src/App.css`.

---

## Project Structure

```
src/
├── assets/          # Static assets (jkuat-logo.png)
├── components/
│   ├── Auth/        # Login, Register
│   └── ui/          # Badge, Modal
├── features/
│   ├── auth/        # AuthContext
│   └── booking/     # BookingWizard + steps
├── layouts/         # StudentLayout
├── pages/           # Route-level pages
├── services/        # api.js (Axios instance)
└── utils/           # mockData.js (temporary)
```

---

## Common Issues

| Error | Cause | Fix |
|-------|-------|-----|
| `password authentication failed` | Stale Docker volume | `docker compose down -v && docker compose up -d` |
| `CORS policy blocked` | Frontend on wrong port | Vite is pinned to `5173` in `vite.config.js` |
| `address already in use :5137` | Previous backend didn't exit | `netstat -ano \| findstr :5137` then `taskkill /PID <pid> /F` |
| `NullReferenceException` on startup | Missing `appsettings.json` config | Ensure `JwtSettings` and `ConnectionStrings` are present |
