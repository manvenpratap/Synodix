# REST API Reference

The Synodix backend is exposed via a high-performance, asynchronous FastAPI service adhering to OpenAPI 3.1 and REST standards. All computation endpoints run deterministically and complete in sub-second latency ($< 350\text{ms}$).

---

## ⏱️ Execution Sequence: API Request & Astrometric Triangulation

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Researcher
    participant UI as Observatory UI (React 19)
    participant API as FastAPI Core (/api/compute-chart)
    participant Audit as Time & Boundary Auditor
    participant Swiss as Swiss Ephemeris 2.10
    participant Sky as NASA JPL DE421 (Skyfield)
    participant Trad as 9 Tradition Engines
    participant Synth as Consensus Matrix

    User->>UI: Enter birth instant & coordinates
    UI->>API: POST /api/compute-chart (JSON)
    activate API

    API->>Audit: normalize_birth_input(date, time, lat, lon)
    activate Audit
    Audit-->>API: UTC Julian Day, LMST, LAST, Cusp proximity flags
    deactivate Audit

    API->>Swiss: calc_ut() planetary positions
    activate Swiss
    Swiss-->>API: Tropical & Lahiri Sidereal positions
    deactivate Swiss

    API->>Sky: at(t).observe(body).apparent()
    activate Sky
    Sky-->>API: JPL DE421 geocentric positions
    deactivate Sky

    Note over API,Sky: Parity check: |λ_Swiss - λ_JPL| < 0.01° (All Pass)

    API->>Trad: evaluate_nine_traditions(base_positions)
    activate Trad
    Trad-->>API: Payloads (Western, Vedic, BaZi, ZiWei, Maya, Tibetan, Persian, Egyptian, Māori)
    deactivate Trad

    API->>Synth: build_consensus_synthesis(traditions_data)
    activate Synth
    Synth-->>API: Consensus matrix, prominence, polarity, markdown dossier
    deactivate Synth

    API-->>UI: 200 OK (verified chart JSON payload)
    deactivate API

    UI-->>User: Render 10 interactive SVG wheels, radar matrix, & dossier
```

### Execution Sequence Details & Guarantees
1. **Request Intake (Steps 1–2)**: User enters birth datetime and coordinates in the React 19 UI. Payload is sent via HTTPS POST to `/api/compute-chart`.
2. **Astrometric Normalization (Steps 3–4)**: The Time & Boundary Auditor calculates Julian Day, LMST, LAST, and evaluates whether any planetary body sits within $1.0^\circ$ of a zodiacal or house boundary.
3. **Dual-Ephemeris Cross-Validation (Steps 5–9)**: Coordinates computed by Swiss Ephemeris 2.10 C-bindings are compared against NASA JPL DE421 numerical integrations. If disagreement exceeds $0.01^\circ$ (36 arcseconds), an invariant exception is raised.
4. **Autonomous Tradition Processing (Steps 10–11)**: All nine tradition modules evaluate their cultural logic independently without cross-contamination.
5. **Consensus Triangulation (Steps 12–13)**: The Consensus Matrix triangulates findings into a 3-cluster primary voting model and synthesizes the executive dossier.
6. **Reactive Client Render (Steps 14–15)**: The UI mounts 10 interactive SVG wheels, the 9-domain radar matrix, and executive markdown report without layout thrashing.

---

## 📡 Endpoints

### 1. `POST /api/compute-chart`
Calculates the complete multi-tradition astrometric chart, invariant audit, and consensus synthesis from birth telemetry.

#### Request Body Schema (`BirthInput`)
```json
{
  "year": 1990,
  "month": 7,
  "day": 15,
  "hour": 14,
  "minute": 30,
  "second": 0,
  "latitude": 28.6139,
  "longitude": 77.2090,
  "timezone": "Asia/Kolkata",
  "elevation_m": 216.0
}
```

#### Response Structure (`UnifiedChartResponse`)
* `meta`: Computation runtime, Julian day, LMST, and ephemeris source versions.
* `invariant_audit`: Dual-engine parity validation status and cusp proximity flags.
* `traditions`: Data dictionaries for all 9 systems (Western, Vedic, BaZi, Zi Wei, Maya, Tibetan, Persian, Egyptian, Māori).
* `consensus`: 3-cluster voting outcomes across 9 life domains, prominence scores, polarity indices, and divergence coefficient.
* `dossier_markdown`: Ready-to-render executive markdown document.

### 2. `GET /api/health`
Probes active system health, memory consumption, and verifies that Swiss Ephemeris and JPL DE421 ephemeris files are loaded in RAM.
