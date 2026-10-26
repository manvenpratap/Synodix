# Anti-AI-Slop Remediation Plan: Synodix Astrometric Workspace

> **Audit Date:** 2026-10-27  
> **Status:** Ready for Execution  
> **AI-Slop Score:** 1,003 Floor Violations, 287 Reflex Violations across 17 files  
> **Target Viewports:** Desktop (1280px / 1440px / 1920px) & Mobile (375px / 390px)  
> **Design Philosophy:** Authentic High-Precision Astrometric Instrument & Astronomical Monograph  

---

## 1. Executive Summary & Design Direction

### 1.1 Brand Identity & Voice
- **Tone:** Authoritative, scholarly, high-precision astronomical monograph and empirical calculation laboratory.
- **Voice Guidelines:**
  - Strip generic LLM buzzwords ("unlock", "seamless", "empower your journey").
  - Ground all copy in concrete celestial mechanics: ephemeris algorithms (Swiss Ephemeris 2.10, JPL DE421), coordinate transformations, historical lineage citations, and verifiable statistical metrics.
  - Eliminate excessive middle-dot joined meta strings (`• • •`) and artificial em dashes.

### 1.2 The Worst AI Tells Identified in Current Build
1. **Pervasive `font-mono` on All Text (Reflex 64 - 287 occurrences)**:
   - Every label, button, badge, header, and paragraph is currently stamped with `font-mono`, mimicking a generic "hacker / cyber HUD" template rather than a legible, human-crafted scholarly observatory.
   - *Remediation*: Reserve monospace strictly for numerical data, coordinates, dates, formulas, and ephemeris telemetry. Use an elegant humanist grotesque or sans for headings, navigation, labels, and analytical prose.
2. **Excessive All-Caps Tracked Labels (Floor 67 - 210 occurrences)**:
   - Repeated `uppercase tracking-wider text-[11px]` on buttons, tags, headings, and tab headers creating visual visual exhaustion.
   - *Remediation*: Shift to natural sentence case or title case in the body/label face with standard letter-spacing.
3. **Pervasive `transition-all` (Floor 10a - 34 occurrences)**:
   - Lazy `transition-all duration-300` on buttons and containers animating layout reflows and width/height.
   - *Remediation*: Explicit composite-only transitions: `transition-colors`, `transition-opacity`, and `transition-transform` with Snappy 150ms-200ms cubic beziers.
4. **Pervasive Raw Hex Color Literals (Floor 48 - 697 occurrences)**:
   - Inline classes littered with arbitrary hex values (`bg-[#090d15]`, `border-[#1b2331]`, `text-[#38bdf8]`, `bg-[#0d1624]`).
   - *Remediation*: Consolidate into structured CSS tokens declared at `:root` / `[data-theme="light"]` (`--surface-base`, `--surface-card`, `--surface-inset`, `--border-subtle`, `--border-accent`, `--text-primary`, `--text-secondary`, `--text-tertiary`).
5. **Generic Neon Glows and Heavy Frosty Glass (Gate 29)**:
   - Glowing cyan drop-shadows (`shadow-[0_0_8px_#38bdf8]`) and heavy backdrop blur filters that muddy contrast and look like generic sci-fi templates.
   - *Remediation*: Solid structural surfaces, crisp 1px borders, subtle tone-on-tone elevation, and genuine astronomical depth.
6. **Viewport & Overflow Mechanics (Floor 34)**:
   - `overflow-x: hidden` on `body` breaks native CSS sticky headers and positioning.
   - *Remediation*: Upgrade to `overflow-x: clip` on both `html` and `body`.

---

## 2. Evidence-Based 30-Pattern Audit Matrix

| # | Pattern | Status | Evidence / Location | Severity | Recommended Improvement |
|---|---------|--------|---------------------|----------|-------------------------|
| 1 | Generic marketing copy | Present | `App.tsx:1081` ("Unlock full astrometric...") | Low | Replace with direct functional copy: "Compute multi-tradition natal positions" |
| 2 | Floating gradient orbs | Absent | None found | - | Retain clean structural dark canvas |
| 3 | Lucide icons everywhere | Partially Present | Buttons have icons next to obvious text | Medium | Keep icons only where they aid recognition (close, chevrons, search, copy); remove redundant decoration |
| 4 | Default 3D illustrations | Absent | Authentic custom 3D Canvas / WebGL used | - | Retain genuine Three.js celestial sphere & Astrolabe |
| 5 | Gradient text headlines | Partially Present | Top banner headings occasionally use text gradients | Medium | High-contrast solid typography with deliberate optical weight |
| 6 | Stock-photo testimonials | Absent | None; 100 historical titans dataset is authentic | - | Retain Rodden AA/A verified historical database |
| 7 | Identical corner radii | Partially Present | `rounded-xl` and `rounded-2xl` used uniformly across cards and buttons | Medium | Implement inward contracting scale: Outer containers `12px`, cards `8px`, buttons `6px`, badges `4px` |
| 8 | Fake terminal windows | Absent | Formula boxes show genuine mathematical equations | - | Retain real LaTeX/Unicode astronomical formulas |
| 9 | Unverifiable statistics | Absent | All metrics backed by 1,000 Monte Carlo control runs | - | Retain verified empirical study documentation |
| 10 | Bento grids everywhere | Partially Present | Bento grid cards in Feature Guide and Workbench | Low | Retain structured data tables and clean split layouts |
| 11 | Excessive em dashes | Present | Copious `--` and `—` in explanatory narratives | Medium | Streamline sentences with standard punctuation |
| 12 | Shadows on every card | Present | `shadow-md`, `shadow-xs` combined with borders | Low | Commit to crisp 1px borders; use elevation only on interactive hover |
| 13 | Generic purple/black palette | Absent | Uses deep space navy, brass, and cyan (`#080a0f`, `#0284c7`, `#d4a373`) | - | Retain nautical/astronomical brass and obsidian identity |
| 14 | Repetitive section layouts | Partially Present | Several cards repeat icon + title + box | Medium | Vary composition: tables, side-by-side matrices, telemetry rows |
| 15 | Emojis as feature icons | Present | `BirthDataForm.tsx:903` (`▶`), `ChartWheelVisualizer.tsx` (`♈`, `🕉️`, `🏛️`) | High | Replace inline emoji glyphs with custom SVG or standardized unicode numerals |
| 16 | Missing product demos | Absent | Full interactive workbench with 100 presets | - | Retain live calculation engine |
| 17 | Decorative dot grids | Absent | None found | - | Clean background maintained |
| 18 | Pointless animations | Partially Present | `transition-all` on dozens of static elements | High | Strip `transition-all`; use composite-only `transform` and `opacity` |
| 19 | Repetitive three-card layouts | Absent | Dynamic multi-tradition matrices and 12-column layouts | - | Clean domain-specific structures |
| 20 | Unnecessary liquid glass | Present | `backdrop-blur-md` on sidebars and banners | Medium | Use solid high-opacity surfaces (`rgba(11, 14, 20, 0.96)`) |
| 21 | Generic typography | Present | `font-mono` overused everywhere for non-numeric content | High | Pair classic academic sans for prose and headers with tabular mono for telemetry |
| 22 | Floating dashboard mockups | Absent | Real live interactive UI | - | Direct flat rendering |
| 23 | Checkmark-heavy lists | Partially Present | Checkmarks in launch checklists | Low | Convert to status badges or compact progress bars |
| 24 | Random rainbow accents | Partially Present | Cyan, amber, emerald, rose tags mixed on single views | Medium | Disciplined semantic palette: Neutral (slate), Data (cyan), Historical (brass/amber), Validation (emerald) |
| 25 | "It's not X, it's Y" copy | Absent | Clean technical writing | - | Maintain scholarly tone |
| 26 | Missing UI states | Partially Present | Some buttons lack distinct `:focus-visible` ring | High | Ensure high-contrast outline on all interactive controls |
| 27 | Sparkle icons (✨) | Partially Present | Sparkles icon imported and displayed in headers | Medium | Remove decorative sparkles; describe actual calculation method |
| 28 | Oversaturated gradients | Absent | Gradients are dark navy to obsidian | - | Refine to subtle linear tonal gradations |
| 29 | Generic calls to action | Partially Present | "Explore", "Compute", "Open" | Low | Refine to explicit action labels |
| 30 | Color-left-border cards | Absent | Clean 4-sided borders used | - | Maintain clean border discipline |

---

## 3. Design System Tokens Specification (`tokens.css`)

### 3.1 Color Tokens
```css
:root {
  /* Surface hierarchy */
  --surface-space: #07090e;
  --surface-ground: #0a0e16;
  --surface-card: #0e131d;
  --surface-raised: #141b27;
  --surface-inset: #090c12;

  /* Border hierarchy */
  --border-subtle: #192231;
  --border-standard: #222d40;
  --border-strong: #32435e;
  --border-focus: #38bdf8;

  /* Typography color tokens */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --text-link: #38bdf8;

  /* Domain accents */
  --accent-astronomy: #0ea5e9;
  --accent-brass: #d4a373;
  --accent-audit: #10b981;
  --accent-alert: #f43f5e;
}

[data-theme="light"] {
  --surface-space: #f6f8fa;
  --surface-ground: #ffffff;
  --surface-card: #ffffff;
  --surface-raised: #f1f5f9;
  --surface-inset: #f8fafc;

  --border-subtle: #e2e8f0;
  --border-standard: #cbd5e1;
  --border-strong: #94a3b8;
  --border-focus: #0284c7;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --text-link: #0284c7;

  --accent-astronomy: #0284c7;
  --accent-brass: #b45309;
  --accent-audit: #059669;
  --accent-alert: #e11d48;
}
```

### 3.2 Typography Rules
- **Display & Headings**: Inter / Plus Jakarta Sans, semi-bold (`font-semibold`), sentence case, standard tracking.
- **Body & Explanatory Prose**: Inter, regular (`font-normal`), line-height 1.6, legible slate.
- **Data & Telemetry Only**: Space Mono / Roboto Mono with `tabular-nums` for coordinates, dates, Julian Days, formulas, and percentages.
- **Labels & Micro-copy**: 12px/13px sentence case, body face, untracked. Eliminate all uppercase tracking on labels.

### 3.3 Geometry Scale
- Container wrappers: `12px` (`rounded-xl`)
- Main cards: `8px` (`rounded-lg`)
- Interactive buttons & inputs: `6px` (`rounded-md`)
- Badges & pills: `4px` (`rounded`)

---

## 4. Execution Phases

- [ ] **Phase 1: Foundation & Token Architecture**:
  - Update `frontend/src/index.css` with Hallmark tokens and `overflow-x: clip`.
  - Fix focus-visible styling and eliminate fuzzy drop-shadows.
- [ ] **Phase 2: Transition & Motion Hardening**:
  - Replace all 34 `transition-all` instances across `App.tsx`, `FeatureGuideScreen.tsx`, and `BirthDataForm.tsx` with explicit composite-only transitions (`transition-colors`, `transition-transform`).
- [ ] **Phase 3: Typography & Monospace Demarcation**:
  - Reserve `font-mono` strictly for coordinates, times, formulas, and numeric telemetry.
  - Convert uppercase tracked labels into elegant sentence-case typography.
- [ ] **Phase 4: Iconography & Emoji Replacement**:
  - Replace raw emoji glyphs in buttons and controls with clean SVGs or standardized unicode numerals.
  - Remove decorative sparkle icons (✨).
- [ ] **Phase 5: Verification & sloplint Pass**:
  - Re-run `sloplint.mjs` to verify dramatic reduction in Floor and Reflex findings.
  - Ensure 100% pass rate across all 25 test suites.
