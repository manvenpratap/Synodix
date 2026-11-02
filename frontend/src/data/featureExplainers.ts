export interface FeatureExplainer {
  id: string;
  title: string;
  subtitle?: string;
  category:
    | 'Astrometric Core'
    | 'Vedic Astrometry'
    | 'Chinese Metaphysics'
    | 'Hellenistic & Persian'
    | 'Indigenous Cosmologies'
    | 'Consensus & Triangulation'
    | 'Statistical Evidence';
  culturalTradition?: string;
  shortSummary: string;
  astronomicalFormula: string;
  howItWorks: string[];
  whyItMatters: string;
  historicalLineage: string;
}

export const FEATURE_EXPLAINERS: Record<string, FeatureExplainer> = {
  "time_normalization_eot": {
    "id": "time_normalization_eot",
    "title": "Local Apparent Solar Time & Equation of Time",
    "subtitle": "True Sundial Time vs. Civil Timezone Standard",
    "category": "Astrometric Core",
    "shortSummary": "Converts clock time into true solar time (LAST) based on the exact observer longitude and Earth’s orbital eccentricity.",
    "astronomicalFormula": "LAST = Local Mean Solar Time (LMST) + Equation of Time (EoT) = UTC + (Longitude / 15°) + EoT",
    "howItWorks": [
      "Earth’s axial tilt (23.44°) and elliptical orbit mean the Sun does not travel at a constant speed across the meridian.",
      "Civil clock zones round time across hundreds of miles; true local noon occurs when the Sun crosses the exact meridian of birth.",
      "Synodix computes the precise Equation of Time (variation between -14.3 and +16.4 minutes) to determine authentic solar noon.",
      "Crucial for accurate house cusps in Hellenistic/Vedic systems and precise Solar Jie Qi terms in BaZi."
    ],
    "whyItMatters": "A 4-minute time discrepancy shifts the Ascendant degree by approximately 1.0°, potentially altering house cusps, divisional harmonics, and BaZi hour pillars.",
    "historicalLineage": "Ptolemy’s Almagest (Book III) & Johannes Kepler’s Rudolphine Tables (1627 CE)."
  },
  "utc_instant_julian_day": {
    "id": "utc_instant_julian_day",
    "title": "UTC Instant & Julian Day (JD_UT)",
    "subtitle": "Universal Astronomical Continuous Day Count",
    "category": "Astrometric Core",
    "shortSummary": "The standardized continuous count of days since January 1, 4713 BCE, providing a continuous time axis for planetary ephemeris integration.",
    "astronomicalFormula": "JD = 367*Y - INT(7*(Y + INT((M+9)/12))/4) + INT(275*M/9) + D + 1721013.5 + UT/24",
    "howItWorks": [
      "Civil calendars (Gregorian vs Julian) feature historical leaps and regional adoption lags that corrupt celestial calculations.",
      "Julian Day number counts absolute days elapsed since astronomical epoch without month or leap-year ambiguities.",
      "Synodix computes JD_UT (Universal Time) and converts to Terrestrial Time (TT) via Delta-T (ΔT) for microsecond planetary coordinates."
    ],
    "whyItMatters": "Serves as the foundational numerical index passed into Swiss Ephemeris and NASA JPL orbital integrators.",
    "historicalLineage": "Joseph Justus Scaliger (1583 CE) named in honor of his father Julius Caesar Scaliger."
  },
  "cusp_proximity_audit": {
    "id": "cusp_proximity_audit",
    "title": "Boundary & Cusp Proximity Audit (<1.0°)",
    "subtitle": "Boundary Uncertainty & Sensitivity Detection",
    "category": "Astrometric Core",
    "shortSummary": "Identifies whether the Ascendant, Midheaven, or planets are within 1.0° of changing zodiac signs or house boundaries.",
    "astronomicalFormula": "Δ_cusp = min(λ mod 30.0°, 30.0° - (λ mod 30.0°)); flagged if Δ_cusp < 1.0°",
    "howItWorks": [
      "Birth times recorded on birth certificates are frequently rounded to the nearest 15 or 30 minutes.",
      "If an angle or planet is within 60 arcminutes (1.0°) of a sign boundary, an unverified birth time could cross boundaries.",
      "Synodix computes boundary proximity for all 7 classical planets, Ascendant, and lunar nodes, marking sensitive placements as Cusp Border."
    ],
    "whyItMatters": "Guarantees intellectual honesty: alerts the researcher when a reading hinges on a placement that could shift with a 4-minute clock variation.",
    "historicalLineage": "Al-Biruni’s Book of Instruction in the Elements of the Art of Astrology (1029 CE)."
  },
  "dual_engine_validation": {
    "id": "dual_engine_validation",
    "title": "Dual-Engine Ephemeris Cross-Validation",
    "subtitle": "Swiss Ephemeris 2.10 vs NASA JPL DE421 Parity",
    "category": "Astrometric Core",
    "shortSummary": "Computes celestial coordinates concurrently across two independent numerical engines and asserts parity within 0.01° (36 arcseconds).",
    "astronomicalFormula": "|λ_SwissEph - λ_SkyfieldDE421| < 0.01° for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn",
    "howItWorks": [
      "Engine A (Swiss Ephemeris 2.10): High-speed C-engine based on semi-analytical planetary theories and compressed JPL ephemeris files.",
      "Engine B (NASA JPL DE421 via Skyfield): Numerical relativistic n-body integration of the Solar System published by NASA Jet Propulsion Laboratory.",
      "Synodix compares both outputs in real-time. If any discrepancy exceeds 0.01°, calculation flags an invariant breach."
    ],
    "whyItMatters": "Eliminates black-box calculation errors, planetary drift bugs, and historical refraction misinterpretations.",
    "historicalLineage": "Modern Astrometric Standard: Jet Propulsion Laboratory (JPL) & Astrodienst Zürich."
  },
  "delta_t_earth_deceleration": {
    "id": "delta_t_earth_deceleration",
    "title": "Delta-T (ΔT) & Earth's Rotational Deceleration",
    "subtitle": "Terrestrial Time (TT) vs. Universal Time (UT1)",
    "category": "Astrometric Core",
    "shortSummary": "Compensates for the irregular deceleration of Earth’s rotation caused by tidal friction and core-mantle coupling.",
    "astronomicalFormula": "TT = UT1 + ΔT; ΔT ≈ -20 + 32 × ((Year - 1820)/100)² seconds (calibrated against IERS Bulletins)",
    "howItWorks": [
      "Gravitational tidal drag from the Moon transfers angular momentum, lengthening the terrestrial day by ~1.7 milliseconds per century.",
      "Ephemeris equations integrate Newtonian motion along uniform Terrestrial Time (TT), whereas civil clocks track rotating Earth (UT1).",
      "Synodix applies historical eclipse splines (Stephenson & Morrison) and modern IERS records to compute precise ΔT.",
      "Without ΔT correction, the calculated Moon position drifts by over 0.5 arcminutes, inducing errors in lunar mansion (Nakshatra) padas."
    ],
    "whyItMatters": "Guarantees sub-arcsecond coordinate precision for fast-moving bodies like the Moon across ancient and contemporary birth records.",
    "historicalLineage": "F.R. Stephenson (Historical Eclipses and Earth's Rotation, Cambridge 1997) & International Earth Rotation and Reference Systems Service (IERS)."
  },
  "topocentric_parallax_correction": {
    "id": "topocentric_parallax_correction",
    "title": "Topocentric vs. Geocentric Parallax Correction",
    "subtitle": "Surface Observer Perspective vs. Center-of-Earth Coordinates",
    "category": "Astrometric Core",
    "shortSummary": "Calculates planetary positions as seen from the exact geographic coordinates of the birth room rather than Earth's geometric center.",
    "astronomicalFormula": "sin(p) = (R_earth / d) * sin(z); λ_topo = λ_geo - p * cos(θ)",
    "howItWorks": [
      "Standard ephemerides output geocentric coordinates calculated from the dead center of the Earth.",
      "An observer on the surface is offset by up to 6,378 km, creating a noticeable parallax displacement for nearby bodies.",
      "For the Moon, horizontal parallax reaches up to 1°01′ (over twice the Moon's visible diameter), shifting house cusps and ingress timing.",
      "Synodix accounts for altitude above sea level, oblate Earth flattening (WGS84 ellipsoid), and local zenith angle."
    ],
    "whyItMatters": "The Moon’s apparent position on the birth horizon can shift by over 1.0°, altering divisional charts and boundary evaluations.",
    "historicalLineage": "Claudius Ptolemy, Syntaxis Mathematica (Book V, Parallax) & Modern International Astronomical Union (IAU) Standards."
  },
  "atmospheric_refraction_apparent": {
    "id": "atmospheric_refraction_apparent",
    "title": "Atmospheric Refraction & Apparent Horizon Ingress",
    "subtitle": "Optical Atmospheric Bending at the Earth's Limb",
    "category": "Astrometric Core",
    "shortSummary": "Calculates optical light bending near the horizon to determine exact apparent sunrise, sunset, and Ascendant emergence.",
    "astronomicalFormula": "R ≈ (1.02 / tan(h + 10.3/(h + 5.11))) * (P/1010) * (283 / (273 + T)) arcmin",
    "howItWorks": [
      "Light traveling through the density gradient of Earth’s atmosphere bends toward the ground normal.",
      "At the true horizon (altitude 0°), refraction lifts celestial objects upward by approximately 34 arcminutes (0.567°).",
      "When the upper limb of the Sun visually touches the dawn horizon, its geometric center is already 50 arcminutes beneath the line of sight.",
      "Synodix employs Bennett's formula adjusted for standard pressure (1010 hPa) and ambient temperature (10°C)."
    ],
    "whyItMatters": "Governs the exact second of sunrise/sunset, which dictates planetary sect (diurnal vs. nocturnal), temporal hours, and Vedic dina-mana.",
    "historicalLineage": "G.G. Bennett (Journal of Navigation, 1982) & Tycho Brahe (Astronomiae Instauratae Progymnasmata, 1602)."
  },
  "lahiri_ayanamsha": {
    "id": "lahiri_ayanamsha",
    "title": "Lahiri Sidereal Ayanamsha (Chitra Paksha)",
    "subtitle": "Precessional Offset of the Moving Vernal Equinox",
    "category": "Vedic Astrometry",
    "culturalTradition": "Jyotisha (Vedic)",
    "shortSummary": "The angular difference between the tropical equinox and the fixed sidereal zodiac, calibrated by fixing the star Chitra (Spica) at exactly 180°00′00″.",
    "astronomicalFormula": "Ayanamsha (Lahiri, Epoch 2000) = 23°51′25.5″ + 50.29″ per Julian year ≈ 24°10′ at current epoch",
    "howItWorks": [
      "Due to Earth’s axial precession (approx. 25,772-year cycle), the Vernal Equinox slowly slips backwards through the stars at ~50.29 arcseconds/year.",
      "Western astrology uses the tropical zodiac (anchored to the March Equinox = 0° Aries).",
      "Vedic astrology uses the sidereal zodiac (anchored to the fixed constellations).",
      "The Indian Government Calendar Reform Committee (1955, chaired by N.C. Lahiri) officially anchored the sidereal frame to fixed star Spica (Chitra = 180°)."
    ],
    "whyItMatters": "The ~24° shift moves approximately 80% of planetary placements back by one entire zodiac sign compared to tropical charts.",
    "historicalLineage": "Surya Siddhanta & Indian Government Calendar Reform Committee (1955 CE)."
  },
  "lagna_divisional_subdivisions": {
    "id": "lagna_divisional_subdivisions",
    "title": "Lagna & The Shodashavarga Harmonic Matrix",
    "subtitle": "16 Harmonic Divisions of the Ascendant Degree",
    "category": "Vedic Astrometry",
    "culturalTradition": "Jyotisha (Vedic)",
    "shortSummary": "Divides each 30° zodiac sign into integer harmonic subdivisions (D1 to D60) to reveal micro-astronomical soul attributes.",
    "astronomicalFormula": "Navamsha (D9) Sign Index = floor((λ_sidereal mod 30°) / (30°/9)); Shashtiamsha (D60) Arc = 30° / 60 = 0°30′00″",
    "howItWorks": [
      "D1 (Rashi, 30°): Physical manifest reality and general life framework.",
      "D9 (Navamsha, 3°20′): The spouse, internal dharma, spiritual potential, and late-life trajectory.",
      "D10 (Dasamsha, 3°00′): Public vocation, executive accomplishments, and societal legacy.",
      "D60 (Shashtiamsha, 0°30′): Highest karmic resolution, shifting every 2 minutes of real-world birth time."
    ],
    "whyItMatters": "Explains why twins born minutes apart develop distinct personalities and careers despite identical tropical natal charts.",
    "historicalLineage": "Maharishi Parashara, Brihat Parashara Hora Shastra (Shodashavarga Adhyaya)."
  },
  "nakshatras_108_padas": {
    "id": "nakshatras_108_padas",
    "title": "27 Nakshatras & 108 Pada Harmonics",
    "subtitle": "Sidereal Lunar Mansions & The Golden 9x12 Ratio",
    "category": "Vedic Astrometry",
    "culturalTradition": "Jyotisha (Vedic)",
    "shortSummary": "Partitions the 360° ecliptic into 27 lunar asterisms of 13°20′ each, subdivided into 108 resonant Padas of 3°20′.",
    "astronomicalFormula": "1 Nakshatra = 13°20′ = 800′; 1 Pada = 3°20′ = 200′; 27 × 4 = 108 Padas = 360°",
    "howItWorks": [
      "The ecliptic is measured against 27 primary star asterisms, from Ashwini (Beta Arietis) to Revati (Zeta Piscium).",
      "Each Nakshatra is quartered into 4 Padas, each corresponding directly to one sign of the Navamsha (D9) harmonic chart.",
      "The 108-pada cycle elegantly reconciles the 9 Vedic Grahas with the 12 Rashi signs (9 × 12 = 108).",
      "The natal Moon's Nakshatra and Pada govern the individual's primordial mind, presiding deity, and Vimshottari Dasha entry balance."
    ],
    "whyItMatters": "Provides granular psychological and archetypal analysis far beyond standard 30° solar sign generalities.",
    "historicalLineage": "Taittiriya Samhita (c. 1200 BCE), Atharva Veda, and Vedanga Jyotisha of Lagadha."
  },
  "gandanta_zones": {
    "id": "gandanta_zones",
    "title": "Gandanta Transformation Knots (Water-Fire Junctions)",
    "subtitle": "Critical Ecliptic Singularity at Zodiac Seams",
    "category": "Vedic Astrometry",
    "culturalTradition": "Jyotisha (Vedic)",
    "shortSummary": "The final 3°20′ of a water sign and the first 3°20′ of the subsequent fire sign where both Rashi and Nakshatra cycles reset simultaneously.",
    "astronomicalFormula": "Gandanta = (λ ∈ [116°40′, 123°20′] || λ ∈ [236°40′, 243°20′] || λ ∈ [356°40′, 003°20′]) sidereal",
    "howItWorks": [
      "Occurs at three specific junctions: Pisces-Aries (Revati-Ashwini), Cancer-Leo (Ashlesha-Magha), Scorpio-Sagittarius (Jyeshtha-Mula).",
      "Represents a dissolution of mental and elemental continuity, symbolized as a knot (granthi) that must be untied.",
      "Planets (especially Moon or Lagna) in Gandanta zones signify profound psychological rebirth, trials, or spiritual awakening."
    ],
    "whyItMatters": "Marks existential transition points requiring conscious integration rather than routine astrological interpretation.",
    "historicalLineage": "Varahamihira, Brihat Samhita & Jataka Parijata."
  },
  "graha_yuddha": {
    "id": "graha_yuddha",
    "title": "Graha Yuddha (Planetary War at <1.0°)",
    "subtitle": "Mutual Planetary Resource Depletion",
    "category": "Vedic Astrometry",
    "culturalTradition": "Jyotisha (Vedic)",
    "shortSummary": "Occurs when two non-luminary planets (Mars, Mercury, Jupiter, Venus, Saturn) are in longitudinal conjunction within 1°00′00″.",
    "astronomicalFormula": "|λ_planetA - λ_planetB| ≤ 1.00° (excluding Sun, Moon, Rahu, Ketu)",
    "howItWorks": [
      "The planet with higher northern celestial latitude, greater apparent diameter, and superior brightness wins the war.",
      "The defeated planet suffers severe functional debilitation, transferring its significations to the victorious planet.",
      "Creates psychological friction where two competing drives clash internally for dominant expression."
    ],
    "whyItMatters": "A planet may have high sign dignity but be rendered powerless if it loses a Graha Yuddha.",
    "historicalLineage": "Surya Siddhanta (Chapter VII, On Planetary Conjunctions)."
  },
  "vimshottari_dasha": {
    "id": "vimshottari_dasha",
    "title": "Vimshottari Dasha 120-Year Planetary Epochs",
    "subtitle": "Deterministic Chronological Life Unfolding",
    "category": "Vedic Astrometry",
    "culturalTradition": "Jyotisha (Vedic)",
    "shortSummary": "A 120-year chronological timing system mapping out which planetary archetypes govern each phase of human life.",
    "astronomicalFormula": "Initial Balance = ((Nakshatra_End - λ_Moon) / 13°20′) × Dasha_Total_Years",
    "howItWorks": [
      "The human lifespan is modeled as a 120-year cycle divided among 9 planets in a fixed sequence: Ketu (7y), Venus (20y), Sun (6y), Moon (10y), Mars (7y), Rahu (18y), Jupiter (16y), Saturn (19y), Mercury (17y).",
      "The exact longitudinal degree of the Moon at birth determines which planetary chapter begins the life and how many years remain in that opening chapter.",
      "Sub-periods (Antardashas and Pratyantardashas) create nested fractals of planetary interactions."
    ],
    "whyItMatters": "Explains why dormant natal promises activate at specific life ages rather than manifesting continuously.",
    "historicalLineage": "Brihat Parashara Hora Shastra (Vimshottari Dasha Adhyaya)."
  },
  "ashtakavarga_benefic_matrix": {
    "id": "ashtakavarga_benefic_matrix",
    "title": "Ashtakavarga Numerical Benefic Matrix",
    "subtitle": "Algorithmic 8-Fold Benefic Point Allocation (Sarvashtakavarga 337)",
    "category": "Vedic Astrometry",
    "culturalTradition": "Jyotisha (Vedic)",
    "shortSummary": "Translates qualitative astrological placements into an objective binary scoring system (337 total Bindus) across all 12 houses.",
    "astronomicalFormula": "BAV(Planet, House) ∈ {0, 1}; SAV(House) = Σ BAV(Planet, House) over 7 Planets + Lagna; Σ SAV = 337",
    "howItWorks": [
      "Each of the 7 classical planets plus Lagna contributes a benefic point (Bindu = 1) or zero point (Rekha = 0) to each house based on natal geometry.",
      "The Sarvashtakavarga (SAV) tallies the points per house: 28 points represents the dynamic neutral average.",
      "Houses scoring ≥ 30 bindus represent areas of natural strength, resilience, and effortless manifestation.",
      "Houses scoring < 25 bindus indicate domains requiring conscious discipline, structure, and patience during planetary transits."
    ],
    "whyItMatters": "Provides deterministic numerical scoring that eliminates subjective guesswork in evaluating house vitality and transit triggers.",
    "historicalLineage": "Brihat Parashara Hora Shastra (Chapters 66–72) & Kalyanavarma, Saravali."
  },
  "raja_dhana_yogas": {
    "id": "raja_dhana_yogas",
    "title": "Classical Raja & Dhana Yogas",
    "subtitle": "Kendra-Trikona Lord Synergy & Sovereign Dignity",
    "category": "Vedic Astrometry",
    "culturalTradition": "Jyotisha (Vedic)",
    "shortSummary": "Specific geometric combinations between action houses (Kendras) and grace houses (Trikonas) indicating high competence and prosperity.",
    "astronomicalFormula": "Raja Yoga = Lord(Kendra {1,4,7,10}) ⋈ Lord(Trikona {1,5,9}) via Conjunction, Mutual Aspect, or Parivartana",
    "howItWorks": [
      "Kendra houses (1, 4, 7, 10) embody Vishnu: physical exertion, societal governance, and executive will.",
      "Trikona houses (1, 5, 9) embody Lakshmi: virtue, past-life merit (Purva Punya), intelligence, and fortune.",
      "When a Kendra lord forms a harmonic bond with a Trikona lord, action and grace reinforce each other into high societal accomplishment.",
      "Special formations like the Pancha Mahapurusha Yogas (Ruchaka, Bhadra, Hamsa, Malavya, Sasa) grant monumental mastery in specialized vocations."
    ],
    "whyItMatters": "Identifies the core structural engines of career sovereignty, creative intellect, and social contribution in historical titan profiles.",
    "historicalLineage": "Varahamihira, Brihat Jataka (c. 505 CE) & Mantreswara, Phaladeepika."
  },
  "bazi_four_pillars": {
    "id": "bazi_four_pillars",
    "title": "BaZi Four Pillars of Destiny (八字)",
    "subtitle": "Solar Qi Matrix: Year, Month, Day, and Hour Pillars",
    "category": "Chinese Metaphysics",
    "culturalTradition": "BaZi (Four Pillars)",
    "shortSummary": "Calculates the dynamic interaction of the 10 Heavenly Stems and 12 Earthly Branches across four astronomical time coordinates.",
    "astronomicalFormula": "Pillar = Stem(Solar Epoch) ⊗ Branch(True Solar Longitude); 60-Year Sexagenary Cycle (Jia-Zi)",
    "howItWorks": [
      "Year Pillar: Roots, ancestral inheritance, social generation, and external social impressions.",
      "Month Pillar: The parents, career vocation, social environment, and seasonal climate Qi.",
      "Day Pillar: The core self (Day Master) and intimate life partner (Spouse Palace).",
      "Hour Pillar: Inner ambitions, children, private psychology, and legacy creations."
    ],
    "whyItMatters": "Constructs an objective solar energetic profile based on environmental thermodynamic balance.",
    "historicalLineage": "Master Li Xuzhong (Tang Dynasty) & Master Xu Ziping (Song Dynasty, c. 960 CE)."
  },
  "bazi_day_master": {
    "id": "bazi_day_master",
    "title": "BaZi Day Master (日主) & Elemental Strength",
    "subtitle": "The Subjective Core of Chinese Metaphysics",
    "category": "Chinese Metaphysics",
    "culturalTradition": "BaZi (Four Pillars)",
    "shortSummary": "Identifies the individual’s central energetic essence among the 10 Heavenly Stems and evaluates its seasonal strength.",
    "astronomicalFormula": "Day Master ∈ {Jia(+Wood), Yi(-Wood), Bing(+Fire), Ding(-Fire), Wu(+Earth), Ji(-Earth), Geng(+Metal), Xin(-Metal), Ren(+Water), Gui(-Water)}",
    "howItWorks": [
      "Evaluates whether the Day Master is born 'in season' by comparing its element to the Earthly Branch of the Month of birth.",
      "Assesses supporting elements (Resource and Companion) versus draining elements (Output, Wealth, and Power).",
      "Determines the Useful God (Yong Shen) needed to restore equilibrium (cooling hot charts, warming frozen charts, or releasing trapped energy)."
    ],
    "whyItMatters": "Dictates whether the subject thrives under challenge (Strong Day Master) or requires nurturing environments (Weak Day Master).",
    "historicalLineage": "Xu Ziping, Yuan Hai Zi Ping & Di Tian Sui (Dripping Heavenly Marrow)."
  },
  "wu_xing_pentagram": {
    "id": "wu_xing_pentagram",
    "title": "Wu Xing Dynamic Five Elements Pentagram",
    "subtitle": "Generating (Sheng) and Overcoming (Ke) Cycles",
    "category": "Chinese Metaphysics",
    "culturalTradition": "BaZi (Four Pillars)",
    "shortSummary": "The cyclic thermodynamic balance between Wood, Fire, Earth, Metal, and Water that sustains living systems.",
    "astronomicalFormula": "Generating: Wood→Fire→Earth→Metal→Water→Wood; Overcoming: Wood→Earth→Water→Fire→Metal→Wood",
    "howItWorks": [
      "Wood (Sprouting / Growth / Vision) feeds Fire.",
      "Fire (Radiance / Culmination / Passion) burns to ash creating Earth.",
      "Earth (Consolidation / Centering / Stability) compacts into Metal minerals.",
      "Metal (Precision / Structure / Refining) condenses moisture into Water.",
      "Water (Fluidity / Wisdom / Introspection) nourishes Wood plant life."
    ],
    "whyItMatters": "Provides an actionable framework for behavioral adjustments, dietary calibration, and environmental harmony.",
    "historicalLineage": "Zou Yan (School of Naturalists, c. 305–240 BCE) & I Ching (Book of Changes)."
  },
  "bazi_branch_interactions": {
    "id": "bazi_branch_interactions",
    "title": "Earthly Branch Interactions (Clashes & Combinations)",
    "subtitle": "Dynamic Catalysts of Transformation",
    "category": "Chinese Metaphysics",
    "culturalTradition": "BaZi (Four Pillars)",
    "shortSummary": "Geometric relationships between Earthly Branches that create sudden breakthroughs (Combinations) or structural ruptures (Clashes).",
    "astronomicalFormula": "Six Clashes (Oppositions, Δ = 180°): Zi-Wu, Chou-Wei, Yin-Shen, Mao-You, Chen-Xu, Si-Hai",
    "howItWorks": [
      "Six Combinations (Liu He): Merge two branches into a unified element, fostering diplomatic alliance and stability.",
      "Three Harmonies (San He): Connect branches separated by 120° into an overwhelming elemental tide (e.g. Shen-Zi-Chen Water Frame).",
      "Six Clashes (Liu Chong): Represent 180° polar collisions, triggering relocations, career pivots, relationship shakeups, or awakening.",
      "Penalties (Xing): Subtle internal friction, boundary violations, or legal friction."
    ],
    "whyItMatters": "Forecasts timing of life turbulence and stability during 10-Year Luck Pillars and Annual Transits.",
    "historicalLineage": "San Ming Tong Hui (The Complete Compendium of Three Destinies, Ming Dynasty)."
  },
  "ten_gods_shi_shen": {
    "id": "ten_gods_shi_shen",
    "title": "Ten Gods (Shi Shen 十神) Relational Dynamics",
    "subtitle": "Five-Element Polar Harmonics Relative to the Day Master",
    "category": "Chinese Metaphysics",
    "culturalTradition": "BaZi (Four Pillars)",
    "shortSummary": "Maps every Heavenly Stem and Earthly Branch into 10 psychological archetypes based on their element and polarity relative to the Day Master.",
    "astronomicalFormula": "Day Master ⨁ Element Vector → {Bi Jian, Jie Cai, Shi Shen, Shang Guan, Pian Cai, Zheng Cai, Qi Sha, Zheng Guan, Pian Yin, Zheng Yin}",
    "howItWorks": [
      "Same Element: Companions (Friend / Rob Wealth) governing peers, confidence, and competitive drives.",
      "Element Produced: Output (Eating God / Hurting Officer) governing artistic expression, innovation, rebellion, and strategy.",
      "Element Controlled: Wealth (Direct Wealth / Indirect Wealth) governing diligence, investment, enterprise, and asset stewardship.",
      "Element Controlling: Power (Direct Officer / Seven Killings) governing discipline, legal authority, executive bravery, and social status.",
      "Element Producing: Resource (Direct Resource / Indirect Resource) governing education, intuition, mentorship, and physical health."
    ],
    "whyItMatters": "Translates elemental physics into nuanced human psychology, career archetypes, and relational behavioral patterns.",
    "historicalLineage": "Master Shen Xiaozhan, Zi Ping Zhen Quan (True Interpretation of Zi Ping, Qing Dynasty)."
  },
  "solar_jie_qi_terms": {
    "id": "solar_jie_qi_terms",
    "title": "24 Solar Terms (Jie Qi 节气) True Ingress",
    "subtitle": "15° Ecliptic Segments Anchoring BaZi Month Pillars",
    "category": "Chinese Metaphysics",
    "culturalTradition": "BaZi (Four Pillars)",
    "shortSummary": "Calculates the exact second the Sun crosses each 15° solar longitude mark to determine precise BaZi Month Pillars independent of civil lunar months.",
    "astronomicalFormula": "λ_sun ≡ 15° × k (mod 360°); Ingress occurs at Lichun (315°), Jingzhe (345°), Qingming (15°), etc.",
    "howItWorks": [
      "BaZi Month Pillars do NOT change on the Lunar New Year; they change strictly at the 12 major solar ingress points (Jie).",
      "The BaZi Solar Year begins at Lichun (Spring Begins, Sun at 315° ecliptic longitude), typically occurring around February 4.",
      "Synodix computes the precise second of true solar ingress using NASA JPL DE421 ephemerides, avoiding incorrect pillar assignment for borderline births.",
      "Ensures absolute astrometric integrity without reliance on approximate civil Chinese almanacs."
    ],
    "whyItMatters": "Prevents month pillar and year pillar errors for individuals born during transitional seasonal boundaries.",
    "historicalLineage": "Taichu Calendar Reform (104 BCE, Han Dynasty) & Huainanzi."
  },
  "ziwei_palaces_stars": {
    "id": "ziwei_palaces_stars",
    "title": "Zi Wei Dou Shu (紫微斗數) 12-Palace Matrix",
    "subtitle": "Imperial Polar Star Constellation Horoscopy",
    "category": "Chinese Metaphysics",
    "culturalTradition": "Zi Wei Dou Shu",
    "shortSummary": "Distributes 14 Major Emperor Stars and 100+ auxiliary stars across 12 Palaces anchored to the North Celestial Pole.",
    "astronomicalFormula": "Ming Palace = (Month - Hour + 1) mod 12; Shen Palace = (Month + Hour - 1) mod 12; Bureau ∈ {Water 2, Wood 3, Metal 4, Earth 5, Fire 6}",
    "howItWorks": [
      "Ming Palace (Life Palace): Core character, soul mission, physical appearance, and intrinsic potential.",
      "Shen Palace (Body Palace): Late-life behavioral tendencies, conscious aspirations, and post-30 trajectory.",
      "Career, Wealth, Property, Travel, and Health Palaces map specific life arenas in an interconnected courtyard grid.",
      "14 Major Stars (Emperor Zi Wei, Finance Star Wu Qu, General Qi Sha, Wisdom Star Tian Ji, etc.) bring specific archetypal leadership styles."
    ],
    "whyItMatters": "Provides an astrometric diagnostic of organizational talent, family karma, and administrative destiny.",
    "historicalLineage": "Grandmaster Chen Tuan (Chen Xiyi, c. 980 CE, Song Dynasty)."
  },
  "ziwei_four_transformations": {
    "id": "ziwei_four_transformations",
    "title": "Four Flying Transformations (Si Hua 四化)",
    "subtitle": "Dynamic Catalysts of Imperial Star Radiance",
    "category": "Chinese Metaphysics",
    "culturalTradition": "Zi Wei Dou Shu",
    "shortSummary": "Modulates the innate behavior of major stars through four energetic transformations determined by Heavenly Stems.",
    "astronomicalFormula": "Year Stem S → {Hua Lu (祿), Hua Quan (權), Hua Ke (科), Hua Ji (忌)}",
    "howItWorks": [
      "Hua Lu (化祿 - Prosperity/Abundance): Infuses financial flow, optimism, generosity, and effortless social favor.",
      "Hua Quan (化權 - Authority/Power): Bestows executive command, administrative authority, competitive drive, and decisive willpower.",
      "Hua Ke (化科 - Fame/Intellect): Manifests academic renown, intellectual refinement, diplomatic grace, and public reputation.",
      "Hua Ji (化忌 - Obstacle/Karma): Focuses karmic debts, obsessive dedication, structural delays, and spiritual refinement through overcoming obstacles."
    ],
    "whyItMatters": "Identifies where an individual enjoys windfalls, commands authority, receives public honors, or encounters pivotal life challenges.",
    "historicalLineage": "Chen Tuan (Mount Hua Hermitage) & Imperial Qing Astronomical Archives."
  },
  "ziwei_major_stars_lineage": {
    "id": "ziwei_major_stars_lineage",
    "title": "14 Major Emperor Stars of Polar Horoscopy",
    "subtitle": "The Northern and Southern Celestial Enclosures",
    "category": "Chinese Metaphysics",
    "culturalTradition": "Zi Wei Dou Shu",
    "shortSummary": "The foundational stellar archetypes anchored to the North Celestial Pole representing the Imperial court bureaucracy.",
    "astronomicalFormula": "Northern Stars: {Zi Wei, Tian Ji, Tai Yang, Wu Qu, Tian Tong, Lian Zhen}; Southern Stars: {Tian Fu, Tai Yin, Tan Lang, Ju Men, Tian Xiang, Tian Liang, Qi Sha, Po Jun}",
    "howItWorks": [
      "Zi Wei (The Emperor): Sovereign dignity, leadership, benevolence, and administrative integrity.",
      "Tian Fu (The Treasury): Asset preservation, conservative strategy, wealth stewardship, and emotional stability.",
      "Wu Qu (The Financial General): Tactical decisiveness, commercial enterprise, martial energy, and relentless work ethic.",
      "Qi Sha (The Vanguard General): Piercing innovation, risk-taking, breakthrough leadership, and independent resolve.",
      "Po Jun (The Rebel Pioneer): Creative destruction, disruptive enterprise, breaking stagnant traditions, and radical innovation."
    ],
    "whyItMatters": "Provides a comprehensive archetype matrix for navigating statecraft, corporate governance, and complex social systems.",
    "historicalLineage": "Imperial Astronomical Bureau of the Ming & Qing Dynasties."
  },
  "western_sect": {
    "id": "western_sect",
    "title": "Hellenistic Planetary Sect (Diurnal vs. Nocturnal)",
    "subtitle": "The Foundational Organizing Principle of Classical Astrology",
    "category": "Hellenistic & Persian",
    "culturalTradition": "Western (Hellenistic)",
    "shortSummary": "Determines whether the chart is diurnal (Sun above horizon) or nocturnal (Sun below horizon), modifying the beneficence of every planet.",
    "astronomicalFormula": "Altitude_Sun > -0.833° → Diurnal Sect (Day); Altitude_Sun ≤ -0.833° → Nocturnal Sect (Night)",
    "howItWorks": [
      "Diurnal Team: Sun (Leader), Jupiter (Benefic), Saturn (Constructive Challenger).",
      "Nocturnal Team: Moon (Leader), Venus (Benefic), Mars (Constructive Challenger).",
      "Mercury is neutral, joining the sect of the planet it rises before.",
      "In a day chart, Saturn’s cold dryness is moderated by the Sun’s warmth, making it disciplined rather than destructive.",
      "In a night chart, Mars’s scorching heat is quenched by the nocturnal moisture, turning aggression into constructive courage."
    ],
    "whyItMatters": "Identifies which planet serves as the chart’s greatest benefic (support) and greatest malefic (challenge).",
    "historicalLineage": "Dorotheus of Sidon (Carmen Astrologicum, 1st Cent. CE) & Vettius Valens (Anthologies)."
  },
  "essential_dignities_score": {
    "id": "essential_dignities_score",
    "title": "Ptolemaic Essential Dignity Scoring Matrix",
    "subtitle": "Five-Fold Planetary Nobility Evaluation",
    "category": "Hellenistic & Persian",
    "culturalTradition": "Western (Hellenistic)",
    "shortSummary": "Calculates planetary authority based on Domicile (+5), Exaltation (+4), Triplicity (+3), Term/Bound (+2), and Face (+1).",
    "astronomicalFormula": "Score = Domicile(+5) + Exaltation(+4) + Triplicity(+3) + Term(+2) + Face(+1) - Detriment(-5) - Fall(-4)",
    "howItWorks": [
      "Domicile (+5): Planet is in its own home; enjoys complete autonomy and resources.",
      "Exaltation (+4): Planet is an honored guest; given supreme status and celebrated authority.",
      "Triplicity (+3): Elemental support; comfortable among trusted allies in its element (Fire/Earth/Air/Water).",
      "Terms/Bounds (+2): Egyptian bounds; granular rulership over specific degree ranges governing behavioral boundaries.",
      "Face/Decan (+1): Minimal dignity; retains only aesthetic appearance of strength."
    ],
    "whyItMatters": "Determines whether a planet has the moral and structural capacity to produce honorable outcomes.",
    "historicalLineage": "Claudius Ptolemy, Tetrabiblos (Book I) & Dorotheus of Sidon."
  },
  "antiscia_contra_antiscia": {
    "id": "antiscia_contra_antiscia",
    "title": "Antiscia & Contra-Antiscia (Solstice Shadows)",
    "subtitle": "Equidistant Solstitial Reflection Points",
    "category": "Hellenistic & Persian",
    "culturalTradition": "Western (Hellenistic)",
    "shortSummary": "Hidden celestial relationships reflected across the Solstice axis (0° Cancer / 0° Capricorn) sharing equal day length.",
    "astronomicalFormula": "λ_antiscia = (180° - λ) mod 360° across 0° Cancer/Capricorn axis; Contra-Antiscia = 180° opposite Antiscia",
    "howItWorks": [
      "Points with identical length of day and night share a sympathetic energetic resonance.",
      "Antiscia acts as a hidden conjunction; contra-antiscia acts as a hidden opposition.",
      "Planets that appear to have no traditional geometric aspect can form deep, unconscious bonds through solstice reflection."
    ],
    "whyItMatters": "Reveals unseen alliances, covert motivations, and private synergies unnoticed by basic aspect grids.",
    "historicalLineage": "Julius Firmicus Maternus, Matheseos Libri VIII (c. 334 CE)."
  },
  "hermetic_lots_fortune_spirit": {
    "id": "hermetic_lots_fortune_spirit",
    "title": "Hermetic Arabic Lots (Fortune, Spirit & Eros)",
    "subtitle": "Diurnal-Nocturnal Projected Ecliptic Angles",
    "category": "Hellenistic & Persian",
    "culturalTradition": "Western (Hellenistic)",
    "shortSummary": "Calculates mathematical Arabic Parts projected from the Ascendant based on the angular separation of cosmic archetypes.",
    "astronomicalFormula": "Fortune: Day = Asc + Moon - Sun; Night = Asc + Sun - Moon. Spirit: Day = Asc + Sun - Moon; Night = Asc + Moon - Sun.",
    "howItWorks": [
      "Lot of Fortune (Pars Fortunae): Governs the physical body, health, circumstantial inheritance, material bounty, and involuntary destiny.",
      "Lot of Spirit (Pars Daemonis): Governs intentional action, intellectual willpower, career initiatives, and moral autonomy.",
      "The calculation strictly inverts between day and night births, maintaining classical polar symmetry.",
      "Taking the Lot of Fortune as a temporary 1st house (Fortune Whole Signs) provides deep corroboration for life prosperity."
    ],
    "whyItMatters": "Separates circumstantial luck that happens to the native from conscious choices initiated by deliberate willpower.",
    "historicalLineage": "Vettius Valens (Anthologies, Book II) & Paulus Alexandrinus (c. 378 CE)."
  },
  "annual_profections_timelords": {
    "id": "annual_profections_timelords",
    "title": "Hellenistic Annual Profections & Time-Lords",
    "subtitle": "Sequential Whole-Sign House Activation by Age",
    "category": "Hellenistic & Persian",
    "culturalTradition": "Western (Hellenistic)",
    "shortSummary": "Advances the primary narrative of life by one whole-sign house for every completed year of life, highlighting the Lord of the Year.",
    "astronomicalFormula": "Profected House = (Age in Completed Years mod 12) + 1; Lord of the Year = Domicile Ruler of Profected Sign",
    "howItWorks": [
      "At birth (Age 0), the 1st House is active. At Age 1, the 2nd House activates. At Age 12, the cycle returns to the 1st House.",
      "The planetary domicile ruler of that year's profected house becomes the reigning Time-Lord (Chronocrator).",
      "Transits made to or from the Lord of the Year during that age trigger decisive, career-defining biographical events.",
      "Houses containing natal planets that activate during a profection year bring their specific natal promises to immediate manifestation."
    ],
    "whyItMatters": "One of antiquity's most reliable and elegant timing methods, establishing the overarching thematic focus of any biographical year.",
    "historicalLineage": "Vettius Valens (Anthologies, Book IV) & Dorotheus of Sidon."
  },
  "ptolemaic_aspects_orbs": {
    "id": "ptolemaic_aspects_orbs",
    "title": "Ptolemaic Major Aspects & Moieties of Orbs",
    "subtitle": "Geometric Harmonics of the 360° Sphere",
    "category": "Hellenistic & Persian",
    "culturalTradition": "Western (Hellenistic)",
    "shortSummary": "Measures planetary geometric relationships across Euclidean fractions of the circle, evaluated with radiant planetary orbs.",
    "astronomicalFormula": "Aspect Angle θ = |λ1 - λ2| ∈ {0° (Conjunction), 60° (Sextile), 90° (Square), 120° (Trine), 180° (Opposition)}; Max Orb = (Orb_A + Orb_B)/2",
    "howItWorks": [
      "Trine (120°): 1/3 harmonic; elemental affinity fostering harmonious, effortless flow between planets.",
      "Square (90°): 1/4 harmonic; dynamic structural tension compelling decisive crisis, transformation, and concrete action.",
      "Sextile (60°): 1/6 harmonic; friendly cooperative opportunity requiring conscious initiative to harvest.",
      "Opposition (180°): 1/2 harmonic; direct polar confrontation requiring negotiation, external mirror reflection, and integration."
    ],
    "whyItMatters": "Determines the psychological dialogue and cooperative synergy between competing planetary archetypes.",
    "historicalLineage": "Claudius Ptolemy, Tetrabiblos (Book I) & Johannes Kepler, Harmonices Mundi (1619 CE)."
  },
  "almuten_figuris": {
    "id": "almuten_figuris",
    "title": "Almuten Figuris (The Supreme Victor of the Chart)",
    "subtitle": "Ibn Ezra & Abu Ma’shar Point-System Synthesis",
    "category": "Hellenistic & Persian",
    "culturalTradition": "Persian (Almuten)",
    "shortSummary": "Calculates which single planet accumulates the highest total essential and accidental dignity across five critical astronomical Hyleg points.",
    "astronomicalFormula": "Victor = argmax(Σ Points across Sun, Moon, Ascendant, Midheaven, and Prenatal Syzygy)",
    "howItWorks": [
      "Evaluates planetary dignity at 5 core points: Sun, Moon, Ascendant, Part of Fortune, and Prenatal Syzygy (New/Full Moon before birth).",
      "Points awarded for Domicile (+5), Exaltation (+4), Triplicity (+3), Term (+2), and Face (+1).",
      "Additional points awarded for house placement (+12 for 1st house, +11 for 10th house, down to +1 for 12th house) and Day/Hour ruler.",
      "The planet with the highest score is crowned the Almuten Figuris—the true soul guardian and navigational helm of the chart."
    ],
    "whyItMatters": "Provides a single focal lens that synthesizes the entire chart into its most noble, coherent driving archetype.",
    "historicalLineage": "Abu Ma’shar al-Balkhi (Baghdad, 9th Cent.) & Abraham Ibn Ezra (Book of the Judgements of the Zodiacal Signs, 1148 CE)."
  },
  "firdaria_periods": {
    "id": "firdaria_periods",
    "title": "Persian Firdaria 75-Year Planetary Eras",
    "subtitle": "Medieval Islamic Chronocrator Master Cycle",
    "category": "Hellenistic & Persian",
    "culturalTradition": "Persian (Almuten)",
    "shortSummary": "A 75-year planetary epoch system alternating between major periods (7 to 12 years) and minor sub-rulers.",
    "astronomicalFormula": "Diurnal: Sun(10y)→Venus(8y)→Mercury(13y)→Moon(9y)→Saturn(11y)→Jupiter(12y)→Mars(7y)→NorthNode(3y)→SouthNode(2y)",
    "howItWorks": [
      "Diurnal charts begin life under the Sun (10 years), followed by Venus, Mercury, Moon, Saturn, Jupiter, Mars, and the Nodes.",
      "Nocturnal charts begin life under the Moon (9 years), followed by Saturn, Jupiter, Mars, Sun, Venus, Mercury, and the Nodes.",
      "Each major period divides equally into seven sub-periods ruled by secondary planets.",
      "Reveals the overarching societal and vocational 'chapter titles' of an individual’s life journey."
    ],
    "whyItMatters": "Bridges broad life eras with specific milestone events, explaining major mid-career pivots.",
    "historicalLineage": "Al-Andarzaghar & Abu Ma’shar al-Balkhi (House of Wisdom, Baghdad)."
  },
  "abu_mashar_accidental_dignity": {
    "id": "abu_mashar_accidental_dignity",
    "title": "Abu Ma'shar Accidental Dignity Points",
    "subtitle": "Positional and Environmental Planetary Potency",
    "category": "Hellenistic & Persian",
    "culturalTradition": "Persian (Almuten)",
    "shortSummary": "Evaluates a planet's actual capacity to manifest results in the physical world based on elevation, speed, combustion, and horizon placement.",
    "astronomicalFormula": "Score = Angular(+5) + Direct(+4) + Swift(+2) + Cazimi(+5) + Hayz(+1) - Combust(-5) - Retrograde(-5)",
    "howItWorks": [
      "Essential dignity measures a planet's character; accidental dignity measures its physical horsepower and effectiveness.",
      "Angular placement (+5 for 1st/10th, +4 for 7th, +3 for 4th) places the planet on the public stage of manifest events.",
      "Free from Combustion: Planets within 8°30′ of the Sun are 'burned' (-5), hiding their independent expression under solar glory.",
      "Cazimi (In the Heart of the Sun, within 17 arcminutes): Planet is co-enthroned with the solar monarch (+5 supreme empowerment)."
    ],
    "whyItMatters": "Explains why a planet in its home sign (high essential dignity) can struggle to produce results if it is combust or retrograde.",
    "historicalLineage": "Abu Ma’shar, Kitāb al-Milal wa-al-Duwal (Book of Religions and Dynasties) & Al-Qabisi (Alchabitius)."
  },
  "egyptian_decan_clock": {
    "id": "egyptian_decan_clock",
    "title": "Egyptian Decan Star Clock & Chronocrators",
    "subtitle": "The 36 Stellar Decanic Gates of Heaven",
    "category": "Indigenous Cosmologies",
    "culturalTradition": "Egyptian (Decans)",
    "shortSummary": "A 36-fold division of the celestial sphere based on the heliacal rising of indicator star decans across 10-day intervals.",
    "astronomicalFormula": "36 Decans = 360° / 10°; Chronocrator Hour = Temporal Night Division governed by the rising decan deity",
    "howItWorks": [
      "Originates from Egyptian tomb ceilings (Senenmut, c. 1473 BCE) and coffin star clocks dating back to 2100 BCE.",
      "Each 10° decan is presided over by a divine mediator (Netjeru) guiding souls across the celestial river.",
      "Hellenistic astrologers later synthesized decans into the 12 signs, assigning 3 decans per sign.",
      "Calculates the exact temporal hour ruler and decanic guardian for the moment of birth."
    ],
    "whyItMatters": "The earliest historical precursor to the 24-hour day and planetary hour chronocrators.",
    "historicalLineage": "Tomb of Senenmut (Theban Tomb TT353) & Dendera Zodiac."
  },
  "dendera_36_decanal_gates": {
    "id": "dendera_36_decanal_gates",
    "title": "Dendera Zodiac & The 36 Decanal Gates",
    "subtitle": "Hourly Star Deities of Pharaonic Star Watchers",
    "category": "Indigenous Cosmologies",
    "culturalTradition": "Egyptian (Decans)",
    "shortSummary": "The monumental circular sky bas-relief depicting the constellations, decans, and planetary exaltations of Pharaonic astronomy.",
    "astronomicalFormula": "36 Decans × 10° = 360°; Decan Index = floor(λ_ecliptic / 10.0°) + 1; Sothic Cycle = 1,460 Julian Years",
    "howItWorks": [
      "Sculpted on the ceiling of the pronaos of the Hathor Temple at Dendera during the late Ptolemaic period (c. 50 BCE).",
      "Combines native Egyptian decanal astronomy (the 36 Bakhtiu stellar guardians) with the 12 Mesopotamian-Greco zodiac figures.",
      "Aligns with the Sothic Cycle (the heliacal rising of Sirius/Sopdet), which governed the annual Nile inundation and civil calendar.",
      "Provides archetypal deity guidance for the specific 10° corridor occupied by the natal Sun and Ascendant."
    ],
    "whyItMatters": "Represents the grand historical synthesis of Egyptian stellar metaphysics and mathematical horoscopy.",
    "historicalLineage": "Hathor Temple at Dendera (Greco-Roman Period, now preserved in the Musée du Louvre, Paris)."
  },
  "maya_calendar_round": {
    "id": "maya_calendar_round",
    "title": "Maya Sacred Calendar Round (Tzolk’in & Haab’)",
    "subtitle": "The 52-Year Mesoamerican Interlocking Cogwheel",
    "category": "Indigenous Cosmologies",
    "culturalTradition": "Maya Calendar",
    "shortSummary": "The synchronization of the sacred 260-day Tzolk’in with the 365-day solar Haab’, repeating every 18,980 days (52 solar years).",
    "astronomicalFormula": "Calendar Round Period = LCM(260, 365) = 18,980 days = 52 Haab’ = 73 Tzolk’in",
    "howItWorks": [
      "Tzolk’in: 20 Day Signs (Nawales) combined with numbers 1 to 13 (260 days total), aligning with human gestation and corn growth.",
      "Haab’: 18 months of 20 days plus the 5-day transitional Wayeb’ period (365 days total).",
      "Any specific combination (e.g. 8 Chuwen 14 Pop) recurs once every 52 years, representing an elder’s completion of one full cycle of life.",
      "Synodix converts modern Julian Day to exact Mesoamerican Long Count, Tzolk’in, and Haab’ coordinates."
    ],
    "whyItMatters": "Grounds the birth moment in multi-layered cyclical cosmic resonance rather than linear timeline progression.",
    "historicalLineage": "Classic Maya Inscriptions (Copán, Palenque, Tikal) & Modern K’iche’ Daykeepers."
  },
  "maya_tzolkin_nawales": {
    "id": "maya_tzolkin_nawales",
    "title": "20 Sacred Nawales & 13 Trecena Galactic Numbers",
    "subtitle": "The 260-Day Chol Q'ij Gestational Matrix",
    "category": "Indigenous Cosmologies",
    "culturalTradition": "Maya Calendar",
    "shortSummary": "The 20 archetypal day lords and 13 sacred numbers that form the energetic DNA of every day in the Maya sacred count.",
    "astronomicalFormula": "Kin Index = (13 × (Number - 1) + 20 × (Sign - 1)) mod 260; 20 Signs: Imix to Ajpu",
    "howItWorks": [
      "The 20 Nawales reflect universal natural forces and animal spirits (B'atz', E, Aj, I'x, Tz'ikin, Ajmaq, No'j, Tijax, Kawoq, Ajpu...).",
      "The 13 numbers correspond to the 13 major articulations/joints of the human body and the 13 heavens of Maya cosmology.",
      "The birth Kin indicates the native's spiritual vocation, psychological strengths, interpersonal gifts, and communal responsibility.",
      "Preserved unbroken across five centuries of colonial suppression by the Ajq'ijab' daykeepers of Highland Guatemala."
    ],
    "whyItMatters": "A living, empirical psychology of cosmic archetypes connecting human consciousness with terrestrial ecology.",
    "historicalLineage": "Popol Vuh (Sacred Book of the K'iche' Maya) & Chilam Balam of Chumayel."
  },
  "maya_long_count_great_cycle": {
    "id": "maya_long_count_great_cycle",
    "title": "Maya Long Count Great Cycle & GMT Correlation",
    "subtitle": "Continuous Vigesimal Tally from the 3114 BCE Creation Epoch",
    "category": "Indigenous Cosmologies",
    "culturalTradition": "Maya Calendar",
    "shortSummary": "A base-20 linear tally measuring the continuous flow of days since August 11, 3114 BCE (proleptic Gregorian).",
    "astronomicalFormula": "Total Days = Baktun×144,000 + Katun×7,200 + Tun×360 + Uinal×20 + Kin; JD = Total Days + 584283 (Thompson Constant)",
    "howItWorks": [
      "Units: Kin (1 day), Uinal (20 days), Tun (360 days), Katun (7,200 days), Baktun (144,000 days ≈ 394.3 years).",
      "The 13-Baktun Great Cycle spans exactly 1,872,000 days (approx. 5,125.36 solar years), completing on 13.0.0.0.0 (December 21, 2012 CE).",
      "The Goodman-Martínez-Thompson (GMT) correlation constant of 584,283 days is verified by lunar age records, eclipses, and radiocarbon dating.",
      "Synodix maps modern Gregorian birth dates directly into authentic Long Count stela inscriptions."
    ],
    "whyItMatters": "Connects individual birth moments to macro-historical epochs of Mesoamerican chronometry.",
    "historicalLineage": "Stela C of Quiriguá, Temple of the Inscriptions at Palenque, and J. Eric S. Thompson."
  },
  "tibetan_mewa_parkha": {
    "id": "tibetan_mewa_parkha",
    "title": "Tibetan Mewa Magic Square & 8 Parkha Trigrams",
    "subtitle": "Phugpa School of Elemental Astrology (Jung-tsi)",
    "category": "Indigenous Cosmologies",
    "culturalTradition": "Tibetan Elemental",
    "shortSummary": "The interaction between the 9 Magic Mewa numbers (Lo Shu 3x3 square) and the 8 Parkha trigrams (I Ching roots) across the 60-year Rabjung cycle.",
    "astronomicalFormula": "Mewa_Year = ((10 - ((Year - 4) mod 9)) mod 9) || 9; Parkha = Trigram rotation based on gender and age",
    "howItWorks": [
      "9 Mewa: Color-numbered nodes (1 White, 2 Black, 3 Blue, 4 Green, 5 Yellow, 6 White, 7 Red, 8 White, 9 Red) indicating karmic origins and soul past lives.",
      "8 Parkha Trigrams: Li (Fire), Khon (Earth), Dwa (Metal), Khen (Sky), Kham (Water), Gin (Mountain), Zon (Wind), Zin (Tree).",
      "Computes the 5 Personal Vital Forces (Sog, Lu, Wang, Lungta, La) to identify energetic vulnerabilities.",
      "Assigns specific remedial protection amulets, mantras, and elemental compensations."
    ],
    "whyItMatters": "Synthesizes Chinese Taoist trigrams with Indian Buddhist Tantric astrology into a comprehensive healing tradition.",
    "historicalLineage": "Desi Sangye Gyatso, White Beryl treatise (Baidurya dKar-po, 1687 CE)."
  },
  "tibetan_five_personal_forces": {
    "id": "tibetan_five_personal_forces",
    "title": "Tibetan Phugpa Five Personal Forces",
    "subtitle": "Sog, Lu, Wang, Lungta, and La Energetic Vitality",
    "category": "Indigenous Cosmologies",
    "culturalTradition": "Tibetan Elemental",
    "shortSummary": "Evaluates the five vital subtle energies that sustain human embodiment, psychological resilience, and good fortune.",
    "astronomicalFormula": "Natal Forces = {Sog (Life), Lu (Body), Wang (Power), Lungta (Fortune), La (Soul)} derived from Natal Rabjung Element Matrix",
    "howItWorks": [
      "Sog (སྲོག - Life Force): Centered in the heart; governs life vitality, breath, and natural longevity.",
      "Lu (ལུས - Body Health): Governs biological constitution, physical immunity, and resistance to environmental pathogens.",
      "Wang (དབང - Power/Capacity): Governs personal charisma, social influence, executive ability, and resource accumulation.",
      "Lungta (རླུང་རྟ - Wind-Horse): Governs serendipity, good fortune, positive synchronicity, and protection from catastrophe.",
      "La (བླ - Soul/Psychic Vitality): Circulates through the body in rhythm with the 30 lunar days; governs emotional stability."
    ],
    "whyItMatters": "Provides specific holistic diagnostics for identifying whether obstacles stem from physical exhaustion, karmic friction, or loss of luck.",
    "historicalLineage": "Phugpa Lhundrup Gyatso (Phugpa School, 15th Century) & Desi Sangye Gyatso."
  },
  "maramataka_lunar_dial": {
    "id": "maramataka_lunar_dial",
    "title": "Māori Maramataka: 30 Oceanic Lunar Nights",
    "subtitle": "Oceanic Lunar Phase Wayfinding & Vitality Rhythm",
    "category": "Indigenous Cosmologies",
    "culturalTradition": "Polynesian Maramataka",
    "shortSummary": "The traditional 30-night Polynesian lunar calendar tracking the Moon’s exact illumination and elongation to guide human energy, marine tides, and social action.",
    "astronomicalFormula": "Lunar Night = floor(Moon Elongation from Sun / 12.0°) + 1, ranging from Whiro (New Moon, 1) through Rākau-nui (Full Moon, 15) to Mutu (30).",
    "howItWorks": [
      "Each night possesses a distinct biological and psychic energy (Mauri).",
      "High-energy nights (Tamatea, Rākau): Optimal for physical enterprise, harvest, and gathering, but carries emotional volatility.",
      "Low/Unstable nights (Whiro, Korekore): Ideal for reflection, fasting, internal planning, and rest.",
      "Mauri Vitality Index provides direct guidance for daily behavioral alignment."
    ],
    "whyItMatters": "Grounds celestial observation in empirical biological rhythms and environmental harmony.",
    "historicalLineage": "Tohunga Kōkōrangi oral astronomical traditions of Aotearoa (New Zealand) and Polynesia."
  },
  "maramataka_tidal_mauri_phases": {
    "id": "maramataka_tidal_mauri_phases",
    "title": "30 Polynesian Lunar Nights & Tidal Mauri",
    "subtitle": "Ecological Lunar Navigation from Whiro to Mutuwhenua",
    "category": "Indigenous Cosmologies",
    "culturalTradition": "Polynesian Maramataka",
    "shortSummary": "Tracks the relationship between the 30 lunar nights, marine biological abundance, coastal tides, and human psychological energy.",
    "astronomicalFormula": "Mauri Index = f(Moon Elongation, Gravitational Tidal Coefficient, Lunar Altitude); Night ∈ [1..30]",
    "howItWorks": [
      "Whiro (Night 1, Dark Moon): Low energy, spiritual introspection, inner boundary maintenance, avoid active planting or fishing.",
      "Tamatea Nights (Nights 6–9): Sudden squalls, turbulent tides, high emotional agitation requiring grounding and caution.",
      "Rakaunui (Night 15, Full Moon): Peak vitality, bountiful illumination, community feasts, peak ocean and root crop harvesting.",
      "Tangaroa Nights (Nights 23–26): Bountiful marine currents, deep calm, ideal for strategic deliberation, deep ocean fishing, and creative treaties.",
      "Mutuwhenua (Night 30): The moon lies dead beneath the earth; quiet preparation for the renewal of the cycle."
    ],
    "whyItMatters": "A living, empirical bioclimatic navigation calendar tested by Polynesian voyagers across thousands of open ocean miles.",
    "historicalLineage": "Te Whānau-ā-Apanui, Ngāti Porou, and Ngāti Kahungunu Tohunga Kōkōrangi; Wiremu Tawhai."
  },
  "three_cluster_consensus": {
    "id": "three_cluster_consensus",
    "title": "3-Cluster Non-Correlated Consensus Matrix",
    "subtitle": "Cross-Cultural Triangulation Without Double-Counting",
    "category": "Consensus & Triangulation",
    "shortSummary": "Synthesizes nine traditions into three statistically independent cultural voting clusters to prevent lineage-correlated bias.",
    "astronomicalFormula": "Cluster 1 (Greco-Mediterranean: Western, Persian, Egyptian); Cluster 2 (Indo-Sinitic: Vedic, BaZi, Zi Wei); Cluster 3 (Indigenous: Maya, Tibetan, Maramataka). Consensus requires ≥ 2 independent clusters in agreement.",
    "howItWorks": [
      "Vedic and Western astrology share Babylonian roots; BaZi and Zi Wei share Chinese calendar bases. Grouping them prevents duplicate votes.",
      "Evaluates life indicators across 9 standardized domains (Identity, Vitality, Emotion, Intellect, Relationships, Vocation, Prosperity, Transformation, Spirituality).",
      "Calculates an objective agreement score and surfaces the honest Divergence Rate (typically ~31.8%)."
    ],
    "whyItMatters": "Eliminates confirmation bias: provides genuine multi-system corroboration rather than hollow repetition.",
    "historicalLineage": "Synodix Triangulation Architecture (Consensus Epistemology & Bayesian Voting)."
  },
  "honest_divergence_rate": {
    "id": "honest_divergence_rate",
    "title": "Honest Divergence Rate (~31.8%)",
    "subtitle": "Preserving Creative Tension Between Cultural Worldviews",
    "category": "Consensus & Triangulation",
    "shortSummary": "Measures the mathematical frequency with which traditions disagree, presenting divergence as a productive dialectic rather than smoothing it over.",
    "astronomicalFormula": "Divergence % = (Number of contradictory domain indicators / Total evaluated indicator vectors) × 100",
    "howItWorks": [
      "When Western indicates expansive ambition (Jupiter 10th) but Vedic indicates introspective renunciation (Saturn-Ketu), typical apps hide the contradiction.",
      "Synodix flags divergence directly with a 'DIVERGENT' rating, explaining the differing cultural angles (e.g. social career vs inner spiritual detachment).",
      "A normal healthy divergence rate across 9 cultures ranges from 25% to 38%."
    ],
    "whyItMatters": "Protects intellectual integrity: human lives are multi-layered and contradictory, not flat stereotypes.",
    "historicalLineage": "Scientific Dialectics & Multi-Model Ensemble Epistemology."
  },
  "cross_tradition_synastry_matrix": {
    "id": "cross_tradition_synastry_matrix",
    "title": "Cross-Tradition Synastry & Inter-Chart Dynamics",
    "subtitle": "Harmonic Resonance & Astrometric Compatibility Across Cultures",
    "category": "Consensus & Triangulation",
    "shortSummary": "Compares celestial placements between two independent subjects across 9 global traditions to evaluate relational synergy and tension.",
    "astronomicalFormula": "Δ_AB = |λ_A - λ_B| mod 360°; Composite Midpoint M = (λ_A + λ_B)/2 ± 180°; Element Affinity Matrix W = E_A ⊗ E_B",
    "howItWorks": [
      "Computes geometric inter-aspects between Partner A and Partner B (Sun-Moon trines, Venus-Mars conjunctions, Saturn-Sun boundaries).",
      "Evaluates BaZi Day Master Heavenly Stem affinities (e.g. Jia Wood combining with Ji Earth) and Earthly Branch harmonies.",
      "Calculates Vedic Ashtakoota compatibility points across 8 distinct physiological and psychological filters (total 36 points).",
      "Generates composite midpoint charts to map the relationship itself as an autonomous systemic third entity."
    ],
    "whyItMatters": "Evaluates whether interpersonal chemistry is harmonious, mutually catalytic, complementary, or karmically turbulent.",
    "historicalLineage": "Claudius Ptolemy, Tetrabiblos (Book IV, Relational Ties) & Maharishi Parashara, Kuta Matching."
  },
  "nine_life_domains_architecture": {
    "id": "nine_life_domains_architecture",
    "title": "9 Standardized Life Domains Ontology",
    "subtitle": "Universal Semantic Cross-Mapping of Astrological Traditions",
    "category": "Consensus & Triangulation",
    "shortSummary": "A unified semantic ontology bridging the disparate structural systems of 9 traditions into 9 invariant human life domains.",
    "astronomicalFormula": "Domain Matrix D = {Identity, Vitality, Intellect, Vocation, Wealth, Relationships, Legacy, Philosophy, Inner Life}",
    "howItWorks": [
      "Western uses 12 Topical Houses; Vedic uses 12 Bhavas; BaZi uses 4 Pillars and 10 Gods; Zi Wei uses 12 Courtyard Palaces.",
      "Synodix maps these disparate models into 9 invariant universal domains without flattening their unique cultural perspectives.",
      "Domain 4 (Vocation) maps Midheaven/10th House (Western), Karma Bhava + D10 (Vedic), Month Pillar + Officer Stars (BaZi), and Career Palace (Zi Wei).",
      "Allows objective consensus scoring and honest divergence measurement across radically different historical traditions."
    ],
    "whyItMatters": "Solves the Babel problem of comparative astrometry by establishing a mathematically standardized semantic bridge.",
    "historicalLineage": "Synodix Epistemic Consensus Architecture & Comparative Astrometry."
  },
  "rodden_titan_benchmark": {
    "id": "rodden_titan_benchmark",
    "title": "500 Rodden-Rated Historical Titan Benchmark",
    "subtitle": "AA/A Verified Birth Certificate Empirical Dataset",
    "category": "Statistical Evidence",
    "shortSummary": "A curated dataset of 500 celebrated historical figures with verified birth certificates (Rodden Rating AA/A) used for statistical calibration.",
    "astronomicalFormula": "500 profiles across 6 vocational domains tested against 2,500 synthetic control charts (10,000 Monte Carlo permutations)",
    "howItWorks": [
      "Rodden Rating AA: Recorded in official state/hospital birth registry or primary birth certificate.",
      "Rodden Rating A: Quoted directly by the subject, immediate family member, or authoritative historical biography.",
      "Completely excludes unverified folklore or rectifications to preserve rigorous empirical test integrity.",
      "Cohort spans Science & Technology, Leaders & Statesmen, Arts & Music, Philosophy & Spirituality, Sports, and Enterprise."
    ],
    "whyItMatters": "Provides reproducible, verifiable empirical evidence that can be audited and scrutinized by independent data scientists.",
    "historicalLineage": "Lois Rodden Astro-Databank Standard & Synodix Empirical Research Laboratory."
  },
  "epistemic_humility_framework": {
    "id": "epistemic_humility_framework",
    "title": "Epistemic Humility & Non-Causal Synchronicity",
    "subtitle": "Astrology as Symbolic Language, Not Gravitational Determinism",
    "category": "Statistical Evidence",
    "shortSummary": "Synodix rejects claims that planets exert physical gravitational control over human destiny, treating astrological patterns as non-causal symbolic mirrors.",
    "astronomicalFormula": "Gravitational force of Jupiter on newborn F = G*(m1*m2)/r² ≈ 1.3×10⁻⁷ N (less than the attending obstetrician at 0.5m: ~3.0×10⁻⁷ N)",
    "howItWorks": [
      "Physical causality is mathematically absurd: the gravitational and electromagnetic forces of distant planets are dwarfed by local delivery room objects.",
      "Synodix adopts the hermeneutic model: astronomical cycles serve as a celestial clock, not a gravitational puppeteer.",
      "Like a mechanical grandfather clock that indicates 8:00 AM without causing people to eat breakfast, celestial alignments reflect synchronistic cycles of consciousness.",
      "Fosters intellectual rigor, humility, and philosophical depth over superstition and fortune-telling."
    ],
    "whyItMatters": "Distinguishes rigorous astronomical research from superstition, pseudoscientific fatalism, and commercial exploitation.",
    "historicalLineage": "Carl G. Jung (Synchronicity: An Acausal Connecting Principle, 1952 CE) & Plotinus (Enneads II.3)."
  },
  "gauquelin_mars_empirical_audit": {
    "id": "gauquelin_mars_empirical_audit",
    "title": "Gauquelin Mars Sector Empirical Audit",
    "subtitle": "Diurnal Culmination Sectors Tested on 500 Historical Titans",
    "category": "Statistical Evidence",
    "shortSummary": "Empirical re-examination of the historic 'Mars Effect' claim using modern computational controls and 500 AA-rated historical titans.",
    "astronomicalFormula": "Diurnal Plus Sectors: {House 1, House 9, House 10, House 12}; Null Hypothesis H0: P(Mars ∈ Plus) = 0.332",
    "howItWorks": [
      "In 1955, Michel and Françoise Gauquelin claimed champion athletes and military leaders had Mars disproportionately in rising/culminating sectors.",
      "Synodix audits this claim across its verified 500-Titan dataset against 2,500 synthetic control charts generated under true astronomical constraints.",
      "In the Sports Champion cohort (N=82): Observed 32.9% vs Baseline Control 33.2% (Odds Ratio 1.00, 95% CI [0.63, 1.59], p = 0.9581).",
      "Results confirm the null hypothesis: no statistically significant Gauquelin enrichment exists when astronomical selection bias is eliminated."
    ],
    "whyItMatters": "Exemplifies Synodix's commitment to ruthless intellectual honesty and empirical scientific auditing of historical claims.",
    "historicalLineage": "Michel Gauquelin (L'influence des astres, 1955) & Committee for Skeptical Inquiry (CSICOP, 1976)."
  },
  "permutation_monte_carlo_testing": {
    "id": "permutation_monte_carlo_testing",
    "title": "Monte Carlo Permutation Testing & Epistemic Humility",
    "subtitle": "10,000 Synthetic Cohorts Calibrated Against Random Noise",
    "category": "Statistical Evidence",
    "shortSummary": "Tests astrological claims by generating 10,000 synthetic control charts with randomized birth distributions to eliminate confirmation bias.",
    "astronomicalFormula": "p = (1 / N_perm) × Σ I(T_i ≥ T_obs); N_perm = 10,000; Bonferroni Adjusted α = 0.05 / K",
    "howItWorks": [
      "Traditional astrology suffers from severe post-hoc pattern matching (finding a planetary reason for an event after knowing the outcome).",
      "Synodix generates 10,000 synthetic permutations across identical geographic and seasonal distributions to compute the true mathematical null baseline.",
      "Tests specific yogas, aspects, and dignities to establish whether they occur more frequently than random probability.",
      "Applies Bonferroni multiple-comparison corrections to eliminate false-positive discoveries (p-hacking)."
    ],
    "whyItMatters": "Separates genuine mathematical anomalies from psychological pattern-seeking and cognitive bias.",
    "historicalLineage": "Ronald Fisher (The Design of Experiments, 1935) & Modern Computational Resampling Statistics."
  }
};


export const EXPLAINER_CATEGORIES: Array<{
  name: FeatureExplainer['category'];
  title: string;
  description: string;
}> = [
  {
    name: 'Astrometric Core',
    title: 'Astrometric & Time Calibration Core',
    description: 'Local Apparent Solar Time (LAST), Julian Days, Cusp Audits, and NASA JPL DE421 Ephemeris Parity.',
  },
  {
    name: 'Vedic Astrometry',
    title: 'Jyotisha (Vedic Sidereal Astrometry)',
    description: 'Chitra Paksha Ayanamsha, Varga Divisional Harmonics (D1–D12), Gandanta Knots, and Dasha Cycles.',
  },
  {
    name: 'Chinese Metaphysics',
    title: 'Chinese Metaphysics & Polar Horoscopy',
    description: 'BaZi Four Pillars, Day Master Strength, Wu Xing Balance, Branch Interactions, and Zi Wei Dou Shu.',
  },
  {
    name: 'Hellenistic & Persian',
    title: 'Western, Hellenistic & Persian Astrologia',
    description: 'Planetary Sect, Essential Dignity, Antiscia Shadows, Almuten Figuris, Lots, and Firdaria Eras.',
  },
  {
    name: 'Indigenous Cosmologies',
    title: 'Indigenous & Oceanic Cosmologies',
    description: 'Maya Calendar Round, Tibetan Phugpa Forces & Mewa, Egyptian Decans, and Polynesian Maramataka.',
  },
  {
    name: 'Consensus & Triangulation',
    title: 'Cross-Cultural Consensus & Triangulation',
    description: '3-Cluster Non-Correlated Voting, 9 Life Domains, and the Honest Divergence Metric (~31.8%).',
  },
  {
    name: 'Statistical Evidence',
    title: 'Empirical Evidence & Epistemology',
    description: '500 Rodden-Rated Titan Benchmark, Permutation Testing, and Non-Causal Synchronicity.',
  },
];

export function getFeatureExplainer(id: string): FeatureExplainer | undefined {
  return FEATURE_EXPLAINERS[id];
}
