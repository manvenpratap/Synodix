# Data Pipelines & Ingestion Flow

The Synodix data pipeline processes raw human birth telemetry into verified astrometric coordinates, multi-tradition symbolic matrices, and reactive visualization layers.

---

## 🌊 Invariant Data Flow Pipeline

```mermaid
flowchart LR
    classDef stage0 fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef stage1 fill:#022c22,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef stage2 fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef stage3 fill:#311042,stroke:#c084fc,stroke-width:2px,color:#f8fafc;
    classDef stage4 fill:#4c0519,stroke:#f43f5e,stroke-width:2px,color:#f8fafc;

    subgraph Stage_0 ["Stage 0: Sources"]
        Input["Birth Telemetry\n• Date, UTC, Coordinates"]:::stage0
        GeoDB["Geo & Ephemeris DB\n• Olson TZ & Delta-T"]:::stage0
    end

    subgraph Stage_1 ["Stage 1: Ingest & Audit"]
        SolarNorm["Solar Auditor\n• LMST, LAST, Eq of Time"]:::stage1
        CuspGuard["Cusp Boundary Guard\n• Orb & Sensitivity Check"]:::stage1
    end

    subgraph Stage_2 ["Stage 2: Astrometric Core"]
        SwissEph["SwissEph 2.10\n• calc_ut() high-precision"]:::stage2
        Skyfield["NASA JPL DE421\n• Skyfield cross-validator"]:::stage2
    end

    subgraph Stage_3 ["Stage 3: Tradition Synthesis"]
        Traditions["9 Tradition Engines\n• Western, Vedic, BaZi..."]:::stage3
        Consensus["Consensus Engine\n• 3-cluster voting & radar"]:::stage3
    end

    subgraph Stage_4 ["Stage 4: Observatory"]
        Dossier["Observatory Dossier\n• Executive synthesis doc"]:::stage4
        Wheels["Astrometric Wheels\n• 10 interactive SVG wheels"]:::stage4
    end

    Input -->|raw birth instant| SolarNorm
    GeoDB -->|offsets & timezones| CuspGuard
    SolarNorm -->|sidereal times| CuspGuard
    SolarNorm -->|UTC Julian date| SwissEph
    SwissEph -->|diff check <0.01°| Skyfield
    SwissEph -->|verified planetary states| Traditions
    Traditions -->|9 autonomous models| Consensus
    Consensus -->|radar & metrics| Wheels
    Consensus -->|compiled report| Dossier
```

---

## 🔄 Detailed Pipeline Stages

### Stage 0: Telemetry Ingest & Validation
- **Input Sanitization**: Parses birth coordinates (latitude $\in [-90, +90]$, longitude $\in [-180, +180]$) and checks ISO-8601 calendar validity.
- **Timezone Resolution**: Maps IANA Olson timezone strings to compute exact historical UTC offsets, accounting for wartime daylight saving time shifts.

### Stage 1: Solar & Boundary Normalization
- **Equation of Time**: Solves Earth's orbital eccentricity and obliquity to calculate Greenwich Mean Sidereal Time ($GMST$), Local Mean Sidereal Time ($LMST$), and Local Apparent Sidereal Time ($LAST$).
- **Cusp Proximity Auditor**: Scans planetary bodies against sign and house boundaries; bodies within $1.0^\circ$ are tagged with sensitive boundary alerts.

### Stage 2: Dual Astrometric Core
- **Swiss Ephemeris 2.10**: Computes geocentric and topocentric longitudes, latitudes, distances, and daily velocities ($d\lambda/dt$).
- **NASA JPL DE421 Parity Check**: Independent verification checking $|\lambda_{\text{SE}} - \lambda_{\text{JPL}}| < 0.01^\circ$.

### Stage 3: Multi-Tradition Evaluation & Consensus
- **9 Autonomous Engines**: Computes Western, Vedic, BaZi, Zi Wei, Maya, Tibetan, Persian, Egyptian, and Māori systems.
- **Consensus Triangulation**: 3-cluster voting identifies high-confidence convergent life themes and isolates cultural divergence metrics ($ar{d} pprox 31.8\%$).

### Stage 4: Reactive Observatory
- **10 SVG Wheels**: Interactive vector wheels render in React 19 with zoom, pan, and hover telemetry.
- **Executive Dossier**: Formatted markdown narrative summarizing convergent archetypes.
