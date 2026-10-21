# Astrometric Dual-Engine

The core foundation of Synodix is mathematical and observational rigor. Unlike legacy astrology software that relies on simplified lookup tables or single-source approximations, Synodix employs an **independent dual-engine architecture** that cross-validates celestial coordinates in real time.

---

## 🔭 The Dual-Ephemeris Invariant

Every chart calculation executes parallel queries against two distinct astronomical computation engines:

```mermaid
flowchart TD
    classDef input fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef engine fill:#022c22,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef check fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef pass fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    classDef fail fill:#4c0519,stroke:#f43f5e,stroke-width:2px,color:#f8fafc;

    Input["Birth Instant: Epoch (UTC), Lat, Lon, Alt"]:::input --> Normalizer["Time & Coordinate Normalizer"]:::input
    
    Normalizer -->|UTC Julian Day (t_ut)| SwissEph["Swiss Ephemeris 2.10 (pyswisseph)"]:::engine
    Normalizer -->|UTC Julian Day (t_ut)| JPL["NASA JPL DE421 (Skyfield Kernel)"]:::engine

    SwissEph --> CalcSE["calc_ut(): Apparent Geocentric Longitudes"]:::engine
    JPL --> CalcJPL["at(t).observe(body).apparent(): Ecliptic Longitudes"]:::engine

    CalcSE --> DeltaCheck{"Delta Difference Check: |Δλ| < 0.01° (36 arcsec)"}:::check
    CalcJPL --> DeltaCheck

    DeltaCheck -->|All 7 Traditional Bodies Pass| InvariantPass["Status: PARITY_VERIFIED"]:::pass
    DeltaCheck -->|Discrepancy >= 0.01°| InvariantFail["Status: DIVERGENCE_ALERT"]:::fail

    InvariantPass --> Traditions["Proceed to Tradition Calculators"]:::pass
    InvariantFail --> Diagnostic["Generate Parity Telemetry & Log Audit"]:::fail
```

### 1. Swiss Ephemeris 2.10 (`pyswisseph`)
- Derived from the French Bureau des Longitudes and NASA JPL ephemerides by Astrodienst (Alois Treindl & Dieter Koch).
- Accounts for:
  - Planetary perturbations.
  - Lunar libration and nutation in longitude and obliquity.
  - General relativistic light deflection and aberration.
  - True vs mean positions.
- Computes both **Tropical** (ecliptic of date) and **Sidereal** (Lahiri/Chitra Paksha ayanamsha) coordinate frames.

### 2. Skyfield & NASA JPL DE421 Kernel
- Python astronomy library developed by Brandon Rhodes.
- Directly evaluates the **NASA JPL Development Ephemeris 421** (DE421), an export-quality solar system barycentric integration created by the Jet Propulsion Laboratory.
- Computes topocentric and apparent geocentric positions completely independent of Swiss Ephemeris C-code.

---

## ⏱️ Time Normalization Equations

Accurate astrology requires knowing where the sun and stars were positioned relative to the observer's exact meridian, not just civil clock time.

### 1. Universal Time (UTC) and Delta-T ($\Delta T$)
Civil clock time is first adjusted for standard time zones and Daylight Saving Time (DST) using the IANA Olson database:
$$\text{UTC} = \text{Local Civil Time} - \text{TZ Offset}$$

The Earth's rotational speed is slowing irregularly due to tidal friction and core interactions. Ephemeris time ($TT$ or $TDB$) differs from Earth-rotation time ($UT$) by $\Delta T$:
$$TT = UT + \Delta T$$
For 2024–2026 epochs, $\Delta T \approx 69.2\text{ seconds}$.

### 2. Equation of Time ($EOT$)
Because the Earth's orbit is elliptical (Kepler's second law) and its rotational axis is tilted by $\epsilon \approx 23.44^\circ$, solar noon rarely occurs at exactly 12:00:00 mean time. The Equation of Time relates Local Mean Solar Time ($LMST$) to Local Apparent Solar Time ($LAST$):
$$LAST = LMST + EOT$$
$$EOT \approx 9.87 \sin(2B) - 7.53 \cos(B) - 1.5 \sin(B)$$
where $B = \frac{360^\circ}{365}(d - 81)$ and $d$ is the day of the year.

Synodix computes true solar time for traditions where solar noon or day-pillar cutoffs dictate calculations (such as BaZi Zi-hour cutoffs).

### 3. Local Sidereal Time ($LST$)
Sidereal time measures the rotation of the Earth relative to the vernal equinox rather than the Sun:
$$GMST_0 = 24110.54841 + 8640184.812866 \cdot T + 0.093104 \cdot T^2 - 6.2 \times 10^{-6} \cdot T^3$$
$$LMST = GMST + \frac{\text{Longitude}}{15^\circ}$$
Local Apparent Sidereal Time ($LAST$) incorporates nutation in right ascension:
$$LAST = LMST + \Delta\psi \cos\epsilon$$

---

## ⚠️ Cusp Sensitivity & Uncertainty Propagation

A major failure mode of automated astrology tools is false certainty: declaring an individual "Sun in Aries" when the Sun is at $00^\circ 00' 14''$ Aries and the birth certificate time is rounded to the nearest hour.

### 1. The 1.0° Boundary Orb
Synodix flags any celestial body within $1.0^\circ$ ($60\text{ arcminutes}$) of a zodiac sign cusp or house cusp:
$$\text{Proximity} = \min(\lambda \pmod{30^\circ}, 30^\circ - (\lambda \pmod{30^\circ}))$$
$$\text{If } \text{Proximity} < 1.0^\circ \implies \text{Cusp Sensitivity Flag} = \text{TRUE}$$

### 2. Temporal Drift Sweeps ($\pm 15$ Minutes)
When a birth time certainty is specified as "Approximate" or "Unknown", Synodix computes an envelope of planetary and ascendant positions across a $\pm 15\text{ minute}$ window:
$$\Delta\lambda_{\text{Ascendant}} \approx \frac{360^\circ}{24\text{ hours}} \times \frac{15}{60} \approx 3.75^\circ$$
Because the Ascendant moves approximately $1^\circ$ every 4 minutes, a 15-minute uncertainty can shift the rising sign and alter house cusps. The observatory UI renders this as a confidence interval and surfaces dual-sign interpretations.

---

## 🔬 Mathematical Invariants Enforced in Pipeline

| Invariant | Specification | Tolerance | Verification Mechanism |
| :--- | :--- | :--- | :--- |
| **SwissEph vs JPL Parity** | Geocentric longitudes of Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn | $|\lambda_{\text{SE}} - \lambda_{\text{JPL}}| < 0.01^\circ$ | Asserted in `test_api_integration.py` |
| **Rahu / Ketu Opposition** | Sidereal True or Mean Lunar Nodes | $|\lambda_{\text{Rahu}} - (\lambda_{\text{Ketu}} + 180^\circ)| = 0.000^\circ$ | Mathematical invariant in `backend/app/traditions/jyotisha.py` |
| **Maya Round-Trip** | Conversion of Julian Day to Tzolk'in-Haab and back | Exact calendar round match | Round-trip unit test in `backend/app/traditions/maya.py` |
| **Placidus House Monotonicity** | Sequential house cusp progression | $C_1 < C_2 < \dots < C_{12}$ modulo $360^\circ$ | Monotonicity check in `backend/app/traditions/western.py` |
| **BaZi 60-Cycle Invariant** | Stem-Branch parity (Yang stem with Yang branch, Yin with Yin) | Stems & Branches have identical parity | Checked in `backend/app/traditions/bazi.py` |

---
*Next: [Nine Traditions Engine](Nine-Traditions-Engine.md) • [Consensus Matrix](Consensus-Matrix.md)*
