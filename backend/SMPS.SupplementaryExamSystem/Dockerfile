# Build Stage

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src



# 1. Copy ALL .csproj files first

# (This allows Docker to cache the restore layer, speeding up future builds)

COPY ["SMPS.API/SMPS.API.csproj", "SMPS.API/"]

COPY ["SMPS.Application/SMPS.Application.csproj", "SMPS.Application/"]

COPY ["SMPS.Infrastructure/SMPS.Infrastructure.csproj", "SMPS.Infrastructure/"]

COPY ["SMPS.Domain/SMPS.Domain.csproj", "SMPS.Domain/"]



# 2. Restore the API project (which implicitly restores its dependencies)

RUN dotnet restore "SMPS.API/SMPS.API.csproj"



# 3. Copy the rest of your backend source code

COPY . .



# 4. Build and Publish the API project

WORKDIR "/src/SMPS.API"

RUN dotnet build "SMPS.API.csproj" -c Release -o /app/build

RUN dotnet publish "SMPS.API.csproj" -c Release -o /app/publish /p:UseAppHost=false



# Runtime Stage

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .



# Expose port 8080 (Render's default expected port for web services)

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080



ENTRYPOINT ["dotnet", "SMPS.API.dll"]
