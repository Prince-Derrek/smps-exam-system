# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files first for layer caching
COPY SMPS.SupplementaryExamSystem.sln ./
COPY SMPS.Domain/SMPS.Domain.csproj             SMPS.Domain/
COPY SMPS.Application/SMPS.Application.csproj   SMPS.Application/
COPY SMPS.Infrastructure/SMPS.Infrastructure.csproj SMPS.Infrastructure/
COPY SMPS.API/SMPS.API.csproj                   SMPS.API/

RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish SMPS.API/SMPS.API.csproj -c Release -o /app/publish

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install netcat for the entrypoint TCP health check
RUN apt-get update && apt-get install -y --no-install-recommends netcat-openbsd && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .

# Entrypoint script handles migrations then starts the API
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"]
