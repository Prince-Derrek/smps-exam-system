# SMPS Supplementary Exam System — Frontend

React + Vite frontend for the SMPS Supplementary Exam System.

## Prerequisites

- [Node.js v18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the database)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (for the backend)

---

## Full Local Setup (First Time)

### 1. Start the Database

```bash
cd backend/SMPS.SupplementaryExamSystem
docker compose down -v && docker compose up -d
```

> The `-v` flag wipes any stale volume. This is required on first setup or if you get a **password authentication failed** error. PostgreSQL only applies the `.env` credentials on a fresh volume.

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

- API runs at: `http://localhost:5137`
- Swagger UI at: `http://localhost:5137/swagger`

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

- App runs at: `http://localhost:5173`

---

## Environment Variables

The frontend reads from `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5137
```

The backend reads from `backend/SMPS.SupplementaryExamSystem/SMPS.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5433;Database=smpsdb;Username=smps_user;Password=smps_pass"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY_MIN_32_CHARS",
    "Issuer": "SMPS.API",
    "Audience": "SMPS.Client",
    "ExpiryMinutes": 60
  }
}
```

---

## Common Issues

| Error | Cause | Fix |
|-------|-------|-----|
| `password authentication failed for user "smps_user"` | Stale Docker volume from a previous run | `docker compose down -v && docker compose up -d` |
| `CORS policy blocked` | Frontend running on wrong port | Vite is pinned to `5173` in `vite.config.js` — ensure nothing else is using that port |
| `address already in use` on port `5137` | Previous backend process didn't exit cleanly | Run `netstat -ano \| findstr :5137` then `taskkill /PID <pid> /F` |
| `Failed to bind to address` | Same as above | Same fix as above |
