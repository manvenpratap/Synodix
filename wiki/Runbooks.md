# Runbooks & Operations Manual

This runbook provides actionable procedures for developing, testing, containerizing, and operating the Synodix Astrometric Triangulation Engine.

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **macOS** or **Linux** with Python 3.11+ and Node.js 20+.
- C compiler (`clang` or `gcc`) for compiling `pyswisseph` bindings.
- Git.

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/manvenpratap/Synodix.git
cd Synodix

# Run system diagnostic doctor
./pipeline.sh doctor
```

### 2. Environment Initialization
```bash
# Python virtual environment setup
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# Frontend dependencies setup
cd frontend
npm install
cd ..
```

### 3. Launch Development Daemons
```bash
# Terminal 1: Launch FastAPI Backend (Port 8000)
PYTHONPATH=. .venv/bin/python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Launch Vite Frontend Dev Server (Port 5173)
npm run dev --prefix frontend -- --host 127.0.0.1 --port 5173
```
- Observatory Web UI: `http://localhost:5173`
- Swagger API Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/health`

---

## 🛠️ The Pipeline Automation Engine (`pipeline.sh`)

Synodix uses a unified local pipeline script (`./pipeline.sh`) for all operational workflows:

```bash
# Run complete test suite with compact token summary (Minimal Tokens Protocol)
./pipeline.sh test --summary

# Run code style linting (Flake8, ESLint)
./pipeline.sh lint

# Automatically format backend & frontend code (Black, Prettier)
./pipeline.sh format

# Compile production frontend distribution
./pipeline.sh build

# Package distribution artifacts
./pipeline.sh package

# Automated verified release gate (runs doctor, tests, lint, package, and git commit)
./pipeline.sh ship "feat: description of verified feature"
```

---

## 🧪 Testing Protocol & Quality Gates

All tests must be executed using the **Minimal Tokens Protocol** to prevent dumping massive logs into context:
```bash
./pipeline.sh test --summary
```

### Mandatory Invariants for Every Commit:
1. **Zero Console Errors**: All frontend views must render cleanly without unhandled React errors or missing asset warnings.
2. **Dual-Ephemeris Parity**: Swiss Ephemeris vs JPL DE421 delta must be $< 0.01^\circ$ across all traditional celestial bodies.
3. **Rahu/Ketu Invariant**: Sidereal lunar nodes must maintain exact $180.000^\circ$ opposition.
4. **Maya Round-Trip**: Date conversion to Tzolk'in-Haab must reverse back to exact Gregorian Julian Day without drift.
5. **Consolidated Test Files**: Numbered test files (`test_NN_*`) must never accumulate beyond 10 files. Redundant tests must be consolidated.

---

## 🐳 Docker Containerization

### Build & Run via Docker Compose
```bash
# Build and launch both frontend and backend
docker compose up --build -d

# Check running container health
docker compose ps
docker compose logs -f api
```

### Standalone Backend Container
```bash
docker build -t synodix-api -f backend/Dockerfile .
docker run -p 8000:8000 synodix-api
```

---

## 🔧 Troubleshooting Guide

### 1. `pyswisseph` Compilation Failure
- **Symptom**: `error: command 'clang' failed with exit code 1` during `pip install`.
- **Root Cause**: Missing Xcode Command Line Tools or Python C development headers.
- **Resolution**:
  ```bash
  xcode-select --install
  pip install wheel setuptools
  pip install pyswisseph --no-cache-dir
  ```

### 2. Skyfield JPL Kernel Download Timeout
- **Symptom**: `urllib.error.URLError: <urlopen error timed out>` when loading `de421.bsp`.
- **Root Cause**: Blocked network connection during first-time kernel fetch from NASA servers.
- **Resolution**: Skyfield caches `de421.bsp` locally in `~/.skyfield/`. If firewalled, copy a pre-downloaded `de421.bsp` directly into the project root or configure an offline kernel path in `backend/app/ephemeris.py`.

### 3. Frontend CORS Errors
- **Symptom**: `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://127.0.0.1:8000/api/compute-chart`.
- **Root Cause**: Origin mismatch between Vite dev port (`5173`) and FastAPI CORS middleware.
- **Resolution**: Verify `backend/app/main.py` includes `http://localhost:5173` and `http://127.0.0.1:5173` in `allow_origins`.

---
*Return to [Home Overview](Home.md)*
