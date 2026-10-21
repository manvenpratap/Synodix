# System Architecture & Dual-Ephemeris Core

> **Executive Overview**: Synodix is architected as an asynchronous, decoupled, high-precision astrometric triangulation platform. It unifies high-precision modern astrometry (Swiss Ephemeris 2.10 and NASA JPL DE421) with nine distinct world astrological traditions, synthesizes their findings through a 3-cluster mathematical consensus matrix, and renders an observatory-class reactive interface with 10 interactive SVG wheels, radar matrices, and executive dossiers.

All system architectures, calculation workflows, API sequences, data flow pipelines, and computation lifecycles are embedded below as native Mermaid diagrams with full architectural explanations.

---

## 🏛️ 1. System Architecture

```mermaid
graph TD
    classDef client fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef edge fill:#022c22,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef core fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef trad fill:#311042,stroke:#c084fc,stroke-width:2px,color:#f8fafc;
    classDef synth fill:#4c0519,stroke:#f43f5e,stroke-width:2px,color:#f8fafc;

    subgraph Client_Observatory ["Client Observatory (React 19)"]
        UI["Observatory UI (React 19 SPA)"]:::client
        Form["Birth Telemetry Form"]:::client
        Wheels["10 Interactive SVG Wheels"]:::client
        Radar["9-Domain Consensus Radar"]:::client
        Dossier["Verified Dossier View"]:::client
        Form --> UI
        UI --> Wheels & Radar & Dossier
    end

    subgraph Edge_Gateway ["Ingestion & Normalization Layer"]
        API["FastAPI Gateway (/api/compute-chart)"]:::edge
        Solar["Solar Normalizer (LMST & LAST)"]:::edge
        CuspAudit["Cusp & Boundary Auditor"]:::edge
        API --> Solar --> CuspAudit
    end

    subgraph Dual_Astrometry ["Dual-Ephemeris Astrometric Core"]
        SwissEph["Swiss Ephemeris 2.10 (C-Bindings)"]:::core
        Skyfield["NASA JPL DE421 (Skyfield Kernel)"]:::core
        ParityCheck{"Ephemeris Parity Check (<0.01°)"}:::core
        SwissEph --> ParityCheck
        Skyfield --> ParityCheck
    end

    subgraph Nine_Traditions ["Multi-Tradition Calculation Engines"]
        Western["Western Tropical"]:::trad
        Vedic["Jyotisha (Lahiri)"]:::trad
        BaZi["BaZi (Four Pillars)"]:::trad
        ZiWei["Zi Wei Dou Shu"]:::trad
        Maya["Maya Calendar"]:::trad
        Hellenistic["Hellenistic Lots"]:::trad
        Uranian["Uranian Midpoints"]:::trad
        Kabbalistic["Kabbalistic Tree"]:::trad
        Tibetan["Tibetan Elemental"]:::trad
    end

    subgraph Triangulation ["Consensus & Synthesis Engine"]
        Consensus["3-Cluster Mathematical Consensus"]:::synth
        Chronos["Chronological Convergence Map"]:::synth
    end

    UI -->|"POST /api/compute-chart"| API
    CuspAudit --> SwissEph & Skyfield
    ParityCheck -->|"Verified Astrometric Coordinates"| Nine_Traditions
    Nine_Traditions --> Consensus --> Chronos
    Chronos -->|"Telemetry JSON Payload"| UI
```

### Architectural Breakdown & Component Responsibilities
* **Client Observatory (React 19 SPA)**: Modern reactive frontend built on React 19, Tailwind CSS, and Lucide icons. Renders 10 SVG astrometric projection wheels (Tropical, Sidereal, BaZi Solar, Zi Wei 12-Palace grid, Maya Tzolkin/Haab gears, Hellenistic bounds, Uranian 90° dial, Kabbalistic Sephirot tree, and Tibetan elemental matrix) with sub-pixel SVG precision.
* **FastAPI Edge Gateway**: High-throughput Python ASGI gateway validating incoming telemetry payloads (ISO-8601 UTC timestamp, geographic latitude/longitude, elevation).
* **Astrometric Normalization Layer**:
  * **Solar Normalizer**: Converts civil UTC time to Local Mean Sidereal Time (LMST) and Local Apparent Solar Time (LAST) to account for Earth's equation of time.
  * **Cusp & Boundary Auditor**: Audits planetary positions within 1° of zodiacal or house boundaries, tagging cusp ambivalences for downstream confidence scoring.
* **Dual-Ephemeris Core**:
  * **Swiss Ephemeris 2.10**: Direct C-bindings executing high-speed trigonometric planetary series.
  * **NASA JPL DE421 Kernel (`skyfield`)**: High-precision numerical integration ephemeris used as an independent cross-validation oracle.
  * **Parity Check (< 0.01°)**: Validates that planetary positions between Swiss Ephemeris and NASA JPL agree within 36 arcseconds before downstream calculation commences.
* **Nine World Astrological Traditions**: Pure mathematical engines computing positions, dignities, dashas, elemental balances, and planetary lots across 9 independent cultural paradigms.
* **Consensus & Synthesis Engine**: Calculates a 3-cluster mathematical agreement matrix across 9 domains, scoring corroboration strength and identifying divergence points.

---

## 🔄 2. Multi-Tradition Calculation Workflow

```mermaid
flowchart LR
    A["1. Ingest Telemetry\n(Time, Lat, Lon)"] --> B["2. Solar Time Normalization\n(LMST / LAST)"]
    B --> C["3. Dual Ephemeris Compute\n(SwissEph & JPL DE421)"]
    C --> D["4. 9 Traditions Evaluate\n(Western, Vedic, BaZi...)"]
    D --> E["5. Consensus Triangulation\n(3-Cluster Matrix)"]
    E --> F["6. Telemetry Output\n(10 Wheels & Dossier)"]
```

### Operational Workflow Stages
1. **Telemetry Ingestion**: Validates geographical coordinates and standardizes timestamps into Julian Day Ephemeris (JDE).
2. **Solar Normalization**: Resolves Earth's orbital eccentricity and axial tilt to establish precise local celestial hour angles.
3. **Dual-Ephemeris Evaluation**: Calculates apparent geocentric and topocentric longitudes, latitudes, distances, and daily motions for all planets, luminaries, and lunar nodes.
4. **Independent Tradition Evaluation**: Executes parallel calculation pipelines across Western, Vedic, Chinese, Maya, Hellenistic, Uranian, Kabbalistic, and Tibetan rules.
5. **Consensus Triangulation**: Normalizes symbols into universal archetypal domains (Career, Relationships, Vitality, Mind, Wealth, Spiritual, Conflict, Creativity, Heritage), scoring agreement coefficients.
6. **Observatory Rendering**: Formats the multi-dimensional calculation payload for reactive display across 10 interactive SVG wheels and executive dossiers.

---

## ⚡ 3. Astrometric Computation & Verification Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Researcher
    participant UI as React 19 UI
    participant API as FastAPI (:8000)
    participant Core as Dual Ephemeris
    participant Trad as 9 Traditions
    participant Synth as Consensus Matrix

    User->>UI: Enter Birth Telemetry
    UI->>API: POST /api/compute-chart
    API->>Core: compute_ephemeris(utc_dt, lat, lon)
    Core->>Core: Cross-validate SwissEph vs JPL (<0.01°)
    Core-->>API: Verified Coordinates
    API->>Trad: evaluate_all_traditions(coords)
    Trad-->>Synth: 9 Independent Symbolic Trees
    Synth->>Synth: Triangulate 3-Cluster Consensus
    Synth-->>API: Unified Dossier JSON
    API-->>UI: Return 200 OK + Payload
    UI-->>User: 10 SVG Wheels & Radar Matrix Live
```

### Execution Sequence Details
* **Steps 1–2**: User inputs birth location and datetime; UI submits an authenticated request.
* **Steps 3–5**: The dual-ephemeris engine verifies positional parity between Swiss Ephemeris and JPL DE421, rejecting discrepancies > 0.01°.
* **Steps 6–8**: Planetary coordinates are distributed across all 9 tradition processors simultaneously.
* **Steps 9–11**: The consensus matrix evaluates domain alignments, assembling executive summaries and confidence scores.
* **Step 12**: The React observatory mounts all 10 visual projection wheels smoothly.

---

## 🌊 4. Invariant Data Flow Pipeline

```mermaid
flowchart LR
    subgraph S1["1. Inputs"]
        UTC["📅 UTC ISO Timestamp\n(Geographic Coordinates)"]
    end
    subgraph S2["2. Ephemeris"]
        Eph["🪐 Dual Ephemeris Engine\n(SwissEph + JPL DE421)"]
    end
    subgraph S3["3. Traditions"]
        Trad["🏛️ 9 World Traditions\n(Western, Vedic, BaZi...)"]
    end
    subgraph S4["4. Consensus"]
        Matrix["⚖️ 3-Cluster Consensus\n(Domain Corroboration)"]
    end
    subgraph S5["5. Visuals"]
        Wheels["🎨 10 SVG Wheels\n(React 19 Observatory)"]
    end

    UTC --> Eph
    Eph --> Trad
    Trad --> Matrix
    Matrix --> Wheels
```

---

## ⏱️ 5. Astrometric Pipeline Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Server_Boot: Load SwissEph C-Lib & JPL Kernel
    Server_Boot --> Ready_Idle: Pre-warm Ephemeris Cache
    Ready_Idle --> Telemetry_Received: POST /api/compute-chart
    Telemetry_Received --> Ephemeris_Validation: Cross-Check SwissEph & JPL
    Ephemeris_Validation --> Tradition_Computation: Coordinates Verified (<0.01°)
    Ephemeris_Validation --> Parity_Failure: Discrepancy > 0.01°
    Parity_Failure --> [*]
    Tradition_Computation --> Consensus_Triangulation: 9 Matrix Trees Generated
    Consensus_Triangulation --> Payload_Delivered: Response Formatted
    Payload_Delivered --> Ready_Idle: Ready for Next Calculation
```
