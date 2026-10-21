# ========================================================
# Six-Culture Verified Astrology: Production Dockerfile
# Multi-Stage Build: Node Frontend + Python 3.12 FastAPI
# ========================================================

# --- Stage 1: Build React Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /build

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Python Backend Runtime ---
FROM python:3.12-slim AS runtime
WORKDIR /app

# Install build dependencies for C-extensions (Swiss Ephemeris)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    python3-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy Backend Code
COPY backend /app/backend

# Copy compiled Frontend SPA into place where FastAPI mounts it
COPY --from=frontend-builder /build/dist /app/frontend/dist

# Set Environment Variables
ENV PYTHONPATH=/app \
    PORT=8000 \
    PYTHONUNBUFFERED=1

EXPOSE 8000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Launch production Uvicorn server
CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 2"]
