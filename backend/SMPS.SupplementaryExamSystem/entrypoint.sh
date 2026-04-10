#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  sleep 1
done
echo "PostgreSQL is ready."

echo "Starting SMPS API..."
exec dotnet SMPS.API.dll
