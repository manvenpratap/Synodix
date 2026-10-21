# State Lifecycle & Verification Machine

The Synodix calculation lifecycle is modeled as a deterministic state machine that guides each chart request from initial telemetry ingest through invariant verification, sensitivity checks, and terminal observatory states.

---

## ⏱️ Astrometric Calculation & Invariant State Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Queued: User submits birth telemetry

    state "Calculation Hot Path" as HotPath {
        Queued --> Normalizing: Parse inputs
        Normalizing --> Ephemeris: UTC & Solar Solved
        Ephemeris --> Traditions: Parity Check Passed
        Traditions --> Synthesizing: 9 Traditions Computed
    }

    state "Boundary & Invariant Gates" as InvariantGates {
        Ephemeris --> ParityGate: Cross-validate with JPL DE421
        ParityGate --> Ephemeris: Difference < 0.01°
        ParityGate --> Parity_Failure: Difference >= 0.01°

        Ephemeris --> CuspSweep: Scan sign/house cusps
        CuspSweep --> Traditions: Distance >= 1.0° (Clean)
        CuspSweep --> CuspAlert: Distance < 1.0° (Near Cusp)
        CuspAlert --> Traditions: Attach sensitivity flag
    }

    state "Consensus & Delivery" as Delivery {
        Synthesizing --> Voting: 3-Cluster Aggregation
        Voting --> Dossier_Compiled: Metrics Calculated
        Dossier_Compiled --> Active_Observatory: Render 10 SVG Wheels
    }

    Parity_Failure --> Error_Terminal: Abort computation
    Active_Observatory --> [*]
    Error_Terminal --> [*]
```

### Lifecycle State Machine Transitions
* **`Queued`**: Receives raw request payload; validates geographical bounds and calendar integrity.
* **`Normalizing`**: Resolves local daylight saving anomalies, converts to UTC, and calculates sidereal hour angles.
* **`ParityGate`**: Cross-validates Swiss Ephemeris against NASA JPL DE421 numerical coordinates. Discrepancies $\ge 0.01^\circ$ trigger `Parity_Failure`.
* **`CuspSweep`**: Evaluates cusp proximity. When bodies are within $1.0^\circ$ of a boundary, `CuspAlert` attaches sensitivity tags to prevent overconfident interpretations.
* **`Traditions`**: Concurrently evaluates the nine independent tradition models.
* **`Voting & Dossier_Compiled`**: Triangulates cross-tradition domain scores and compiles the markdown executive dossier.
* **`Active_Observatory`**: Terminal successful state where all 10 interactive SVG wheels render in the client browser.
