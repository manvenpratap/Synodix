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
  // --- 1. ASTROMETRIC CORE ---
  time_normalization_eot: {
    id: 'time_normalization_eot',
    title: 'Local Apparent Solar Time & Equation of Time',
    subtitle: 'True Sundial Time vs. Civil Timezone Standard',
    category: 'Astrometric Core',
    shortSummary:
      'Converts clock time into true solar time (LAST) based on the exact observer longitude and Earth’s orbital eccentricity.',
    astronomicalFormula:
      'LAST = Local Mean Solar Time (LMST) + Equation of Time (EoT) = UTC + (Longitude / 15°) + EoT',
    howItWorks: [
      'Earth’s axial tilt (23.44°) and elliptical orbit mean the Sun does not travel at a constant speed across the meridian.',
      'Civil clock zones round time across hundreds of miles; true local noon occurs when the Sun crosses the exact meridian of birth.',
      'Synodix computes the precise Equation of Time (variation between -14.3 and +16.4 minutes) to determine authentic solar noon.',
      'Crucial for accurate house cusps in Hellenistic/Vedic systems and precise Solar Jie Qi terms in BaZi.',
    ],
    whyItMatters:
      'A 4-minute time discrepancy shifts the Ascendant degree by approximately 1.0°, potentially altering house cusps, divisional harmonics, and BaZi hour pillars.',
    historicalLineage:
      'Ptolemy’s Almagest (Book III) & Johannes Kepler’s Rudolphine Tables (1627 CE).',
  },

  utc_instant_julian_day: {
    id: 'utc_instant_julian_day',
    title: 'UTC Instant & Julian Day (JD_UT)',
    subtitle: 'Universal Astronomical Continuous Day Count',
    category: 'Astrometric Core',
    shortSummary:
      'The standardized continuous count of days since January 1, 4713 BCE, providing a continuous time axis for planetary ephemeris integration.',
    astronomicalFormula:
      'JD = 367*Y - INT(7*(Y + INT((M+9)/12))/4) + INT(275*M/9) + D + 1721013.5 + UT/24',
    howItWorks: [
      'Civil calendars (Gregorian vs Julian) feature historical leaps and regional adoption lags that corrupt celestial calculations.',
      'Julian Day number counts absolute days elapsed since astronomical epoch without month or leap-year ambiguities.',
      'Synodix computes JD_UT (Universal Time) and converts to Terrestrial Time (TT) via Delta-T (ΔT) for microsecond planetary coordinates.',
    ],
    whyItMatters:
      'Serves as the foundational numerical index passed into Swiss Ephemeris and NASA JPL orbital integrators.',
    historicalLineage:
      'Joseph Justus Scaliger (1583 CE) named in honor of his father Julius Caesar Scaliger.',
  },

  cusp_proximity_audit: {
    id: 'cusp_proximity_audit',
    title: 'Boundary & Cusp Proximity Audit (<1.0°)',
    subtitle: 'Boundary Uncertainty & Sensitivity Detection',
    category: 'Astrometric Core',
    shortSummary:
      'Identifies whether the Ascendant, Midheaven, or planets are within 1.0° of changing zodiac signs or house boundaries.',
    astronomicalFormula:
      'Δ_cusp = min(λ mod 30.0°, 30.0° - (λ mod 30.0°)); flagged if Δ_cusp < 1.0°',
    howItWorks: [
      'Birth times recorded on birth certificates are frequently rounded to the nearest 15 or 30 minutes.',
      'If an angle or planet is within 60 arcminutes (1.0°) of a sign boundary, an unverified birth time could cross boundaries.',
      'Synodix computes boundary proximity for all 7 classical planets, Ascendant, and lunar nodes, marking sensitive placements as Cusp Border.',
    ],
    whyItMatters:
      'Guarantees intellectual honesty: alerts the researcher when a reading hinges on a placement that could shift with a 4-minute clock variation.',
    historicalLineage:
      'Al-Biruni’s Book of Instruction in the Elements of the Art of Astrology (1029 CE).',
  },

  dual_engine_validation: {
    id: 'dual_engine_validation',
    title: 'Dual-Engine Ephemeris Cross-Validation',
    subtitle: 'Swiss Ephemeris 2.10 vs NASA JPL DE421 Parity',
    category: 'Astrometric Core',
    shortSummary:
      'Computes celestial coordinates concurrently across two independent numerical engines and asserts parity within 0.01° (36 arcseconds).',
    astronomicalFormula:
      '|λ_SwissEph - λ_SkyfieldDE421| < 0.01° for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn',
    howItWorks: [
      'Engine A (Swiss Ephemeris 2.10): High-speed C-engine based on semi-analytical planetary theories and compressed JPL ephemeris files.',
      'Engine B (NASA JPL DE421 via Skyfield): Numerical relativistic n-body integration of the Solar System published by NASA Jet Propulsion Laboratory.',
      'Synodix compares both outputs in real-time. If any discrepancy exceeds 0.01°, calculation flags an invariant breach.',
    ],
    whyItMatters:
      'Eliminates black-box calculation errors, planetary drift bugs, and historical refraction misinterpretations.',
    historicalLineage:
      'Modern Astrometric Standard: Jet Propulsion Laboratory (JPL) & Astrodienst Zürich.',
  },

  // --- 2. VEDIC / JYOTISHA ---
  lahiri_ayanamsha: {
    id: 'lahiri_ayanamsha',
    title: 'Lahiri Sidereal Ayanamsha (Chitra Paksha)',
    subtitle: 'Precessional Offset of the Moving Vernal Equinox',
    category: 'Vedic Astrometry',
    culturalTradition: 'Jyotisha (Vedic)',
    shortSummary:
      'The angular difference between the tropical equinox and the fixed sidereal zodiac, calibrated by fixing the star Chitra (Spica) at exactly 180°00′00″.',
    astronomicalFormula:
      'Ayanamsha (Lahiri, Epoch 2000) = 23°51′25.5″ + 50.29″ per Julian year ≈ 24°10′ at current epoch',
    howItWorks: [
      'Due to Earth’s axial precession (approx. 25,772-year cycle), the Vernal Equinox slowly slips backwards through the stars at ~50.29 arcseconds/year.',
      'Western astrology uses the tropical zodiac (anchored to the March Equinox = 0° Aries).',
      'Vedic astrology uses the sidereal zodiac (anchored to the fixed constellations).',
      'The Indian Government Calendar Reform Committee (1955, chaired by N.C. Lahiri) officially anchored the sidereal frame to fixed star Spica (Chitra = 180°).',
    ],
    whyItMatters:
      'Planetary longitudes in Jyotisha are ~24° earlier than in Western charts, placing planets into their actual physical backdrop constellations.',
    historicalLineage:
      'Surya Siddhanta (c. 500 CE) & Indian Calendar Reform Committee (1955 CE).',
  },

  lagna_divisional_subdivisions: {
    id: 'lagna_divisional_subdivisions',
    title: 'Lagna (Ascendant) & Divisional Varga Harmonics',
    subtitle: 'D1 Rasi, D9 Navamsha, D3 Drekkana, D7, D10, D12',
    category: 'Vedic Astrometry',
    culturalTradition: 'Jyotisha (Vedic)',
    shortSummary:
      'Mathematical harmonic fractal divisions of the 30° zodiac signs providing micro-examination of specific life domains.',
    astronomicalFormula:
      'Navamsha (D9) = 30° / 9 = 3°20′ per pada; Drekkana (D3) = 10°00′; Dashamsha (D10) = 3°00′',
    howItWorks: [
      'D1 Rasi Chart: The physical baseline chart of outer manifestation.',
      'D9 Navamsha (1/9th subdivision): The soul’s inner dharma, marital compatibility, and late-life trajectory. If a planet is strong in D1 but debilitated in D9, its strength collapses.',
      'D3 Drekkana (1/3rd): Courage, siblings, and vital energy.',
      'D7 Saptamsha (1/7th): Lineage, children, and creative output.',
      'D10 Dashamsha (1/10th): Career prominence, status, and professional achievements.',
      'D12 Dwadashamsha (1/12th): Ancestral karma and parental lineage.',
    ],
    whyItMatters:
      'Provides structural resolution that prevents two individuals born on the same day from receiving identical readings.',
    historicalLineage:
      'Maharishi Parashara, Bṛhat Parāśara Horāśāstra (c. 600–750 CE).',
  },

  gandanta_zones: {
    id: 'gandanta_zones',
    title: 'Gandanta Knot (Water-Fire Sign Junctions)',
    subtitle: 'Karmic Transformation Zones at Nakshatra Boundaries',
    category: 'Vedic Astrometry',
    culturalTradition: 'Jyotisha (Vedic)',
    shortSummary:
      'The critical boundary zones where a water sign transitions into a fire sign (Pisces-Aries, Cancer-Leo, Scorpio-Sagittarius).',
    astronomicalFormula:
      'Within 3°20′ (one Nakshatra Pada) of 0° Aries, 0° Leo, or 0° Sagittarius sidereal.',
    howItWorks: [
      'In Vedic astronomy, water represents dissolution (Moksha) and fire represents creation/action (Dharma).',
      'The junction between Ashlesha-Magha (Cancer-Leo), Jyeshtha-Mula (Scorpio-Sagittarius), and Revati-Ashwini (Pisces-Aries) bridges both a sign boundary and a nakshatra boundary.',
      'Planets situated in these 3°20′ zones face psychological and spiritual knots (ganda) requiring profound restructuring.',
    ],
    whyItMatters:
      'Identifies points of vulnerability and transformative rebirth that flat aspect models overlook.',
    historicalLineage:
      'Varahamihira, Brihat Jataka (c. 505 CE).',
  },

  graha_yuddha: {
    id: 'graha_yuddha',
    title: 'Graha Yuddha (Planetary War)',
    subtitle: 'Planetary Longitude Conjunction within 1.0°',
    category: 'Vedic Astrometry',
    culturalTradition: 'Jyotisha (Vedic)',
    shortSummary:
      'When two non-luminary planets (Mercury, Venus, Mars, Jupiter, Saturn) are conjunct within 1.0° of longitude, they enter celestial warfare.',
    astronomicalFormula:
      '|λ_planet1 - λ_planet2| ≤ 1.00°; Victor determined by northern celestial latitude (β) and brightness.',
    howItWorks: [
      'The Sun, Moon, Rahu, and Ketu do not participate in Planetary War.',
      'The planet with higher northern celestial latitude or superior brightness emerges as the victor.',
      'The victor absorbs the signifying power of the defeated planet, while the defeated planet’s significations experience strain.',
    ],
    whyItMatters:
      'Radically alters planetary strength assessments: a technically exalted planet can lose all efficacy if defeated in Graha Yuddha.',
    historicalLineage:
      'Surya Siddhanta & Parashara Horashastra Chapter 17.',
  },

  vimshottari_dasha: {
    id: 'vimshottari_dasha',
    title: 'Vimshottari Mahadasha (120-Year Cycle)',
    subtitle: 'Moon Nakshatra Lifespan Planetary Progression',
    category: 'Vedic Astrometry',
    culturalTradition: 'Jyotisha (Vedic)',
    shortSummary:
      'A 120-year chronological sequence that unfolds life chapters based on the exact Nakshatra position of the Moon at birth.',
    astronomicalFormula:
      'Starting balance = (Nakshatra span remaining / 13°20′) × Mahadasha years; Order: Ketu(7y), Venus(20y), Sun(6y), Moon(10y), Mars(7y), Rahu(18y), Jupiter(16y), Saturn(19y), Mercury(17y)',
    howItWorks: [
      'The Moon’s natal longitude determines which planetary period is active at birth and how many years remain.',
      'Each Mahadasha activates the natal houses ruled and occupied by that planet.',
      'Sub-periods (Antardashas) create secondary fractal cycles providing pinpoint timing for events.',
    ],
    whyItMatters:
      'Explains why certain potentials in a birth chart remain dormant for decades before suddenly manifesting.',
    historicalLineage:
      'Bṛhat Parāśara Horāśāstra Chapter 38.',
  },

  // --- 3. BAZI (FOUR PILLARS) ---
  bazi_four_pillars: {
    id: 'bazi_four_pillars',
    title: 'BaZi: Four Pillars of Destiny (八字命理)',
    subtitle: 'Year, Month, Day, and Hour Solar Qi Coordinates',
    category: 'Chinese Metaphysics',
    culturalTradition: 'BaZi (Four Pillars)',
    shortSummary:
      'Constructs eight Chinese characters (BaZi) from the Year, Month, Day, and Hour based on the 60 Sexagenary cycle and Solar Terms (Jie Qi).',
    astronomicalFormula:
      'Year & Month calibrated to True Solar Longitude (Sun at 315° = Li Chun); Day calibrated to Midnight-to-Midnight Solar cycle; Hour to 12 double-hours (Shi Chen).',
    howItWorks: [
      'Year Pillar: Ancestral heritage, grandparents, public persona (ages 1–16).',
      'Month Pillar: Parents, career, upbringing, seasonal climate governing the chart (ages 17–32).',
      'Day Pillar: The Day Master (conscious self) and spouse palace (ages 33–48).',
      'Hour Pillar: Children, internal aspirations, late life, creative legacy (ages 49+).',
    ],
    whyItMatters:
      'Provides a solar-climate model of personal constitution that does not depend on tropical signs or sidereal constellations.',
    historicalLineage:
      'Master Xu Ziping (c. 907–960 CE), Yuan Hai Zi Ping.',
  },

  bazi_day_master: {
    id: 'bazi_day_master',
    title: 'Day Master & Seasonal Strength (日主强弱)',
    subtitle: 'The Focal Point of Chinese Metaphysical Analysis',
    category: 'Chinese Metaphysics',
    culturalTradition: 'BaZi (Four Pillars)',
    shortSummary:
      'The Heavenly Stem of the Day of birth represents the core self; its strength is evaluated against the birth season (Month Branch) and elemental rooting.',
    astronomicalFormula:
      'Strength = Seasonality (In Season / Born Out) + Direct Rooting in Earthly Branches + Support Stems (Resource/Peer) vs Drain (Wealth/Output/Power).',
    howItWorks: [
      '10 Heavenly Stems: Jia/Yi (Wood), Bing/Ding (Fire), Wu/Ji (Earth), Geng/Xin (Metal), Ren/Gui (Water).',
      'Born in Season: A Fire Day Master born in summer (Si, Wu, Wei) is strong by default.',
      'Rooting: Whether the stem has deep energetic roots in the branches below.',
      'Determines whether the chart needs strengthening (favorable Resource/Peer) or draining/regulating (favorable Wealth/Power/Output).',
    ],
    whyItMatters:
      'Determines the "Useful God" (Yong Shen) that brings balance, resilience, and vocational success.',
    historicalLineage:
      'Di Tian Sui (Drops of Heavenly Marrow) & Zi Ping Zhen Quan.',
  },

  wu_xing_pentagram: {
    id: 'wu_xing_pentagram',
    title: 'Wu Xing Elemental Pentagram (五行生剋)',
    subtitle: 'Generating (Sheng) and Overcoming (Ke) Cycles',
    category: 'Chinese Metaphysics',
    culturalTradition: 'BaZi (Four Pillars)',
    shortSummary:
      'The dynamic balance of the Five Phases: Wood generates Fire, Fire generates Earth, Earth generates Metal, Metal generates Water, Water generates Wood.',
    astronomicalFormula:
      'Percentage distribution calculated from 4 Heavenly Stems + all Hidden Stems within Earthly Branches weighted by sub-period qi days.',
    howItWorks: [
      'Generating Cycle (Outer circle): Wood feeds Fire feeds Earth bears Metal condenses Water nourishes Wood.',
      'Overcoming / Controlling Cycle (Star lines): Wood parts Earth, Earth dams Water, Water douses Fire, Fire melts Metal, Metal chops Wood.',
      'Identifies physiological strengths and constitutional imbalances.',
    ],
    whyItMatters:
      'Visualizes systemic equilibrium: health, behavioral temperament, and vocational flow.',
    historicalLineage:
      'Huangdi Neijing (Yellow Emperor’s Inner Canon, c. 300 BCE).',
  },

  bazi_branch_interactions: {
    id: 'bazi_branch_interactions',
    title: 'Pillar Interactions (He, Chong, Xing, Hai)',
    subtitle: 'Harmonies, Clashes, Punishments, and Harms',
    category: 'Chinese Metaphysics',
    culturalTradition: 'BaZi (Four Pillars)',
    shortSummary:
      'Geometric alignments between Earthly Branches indicating cooperation, friction, betrayal, or structural stress.',
    astronomicalFormula:
      'Six Clashes (180° opposition): Zi-Wu, Chou-Wei, Yin-Shen, Mao-You, Chen-Xu, Si-Hai. Six Harmonies: 30°/60° pairings.',
    howItWorks: [
      'Six Harmonies (Liu He): Mutual attraction, diplomatic alignment, stabilizing influences.',
      'Three Harmonies (San He): Powerful triangular elemental elemental transformations (e.g. Shen-Zi-Chen transforms to pure Water).',
      'Six Clashes (Liu Chong): Structural disruption, radical life changes, relocation, relationship friction.',
      'Three Punishments (San Xing): Internal conflict, legal issues, or emotional friction.',
      'Six Harms (Liu Hai): Subtle misunderstandings, quiet sabotage, emotional distance.',
    ],
    whyItMatters:
      'Reveals interpersonal dynamics, career transitions, and physiological stress triggers.',
    historicalLineage:
      'San Ming Tong Hui (The Compendium of Three Destinies, 1578 CE).',
  },

  // --- 4. WESTERN HELLENISTIC ---
  western_sect: {
    id: 'western_sect',
    title: 'Hellenistic Planetary Sect (Hairesis)',
    subtitle: 'Diurnal (Day) vs. Nocturnal (Night) Chart Governance',
    category: 'Hellenistic & Persian',
    culturalTradition: 'Western (Hellenistic)',
    shortSummary:
      'Determines whether the Sun is above or below the horizon, appointing the governing celestial team and establishing benefic/malefic roles.',
    astronomicalFormula:
      'Diurnal if Sun elevation angle ≥ 0° (Houses 7–12); Nocturnal if Sun elevation angle < 0° (Houses 1–6).',
    howItWorks: [
      'Day Charts: Sun is sect light; Jupiter is the most supportive benefic; Saturn is tempered and constructive; Mars is the most problematic out-of-sect malefic.',
      'Night Charts: Moon is sect light; Venus is the most supportive benefic; Mars is constructive and passionate; Saturn is the most challenging out-of-sect malefic.',
      'A planet performs constructively when supported by chart sect, and behaves frictionally when contrary to sect.',
    ],
    whyItMatters:
      'Prevents generic interpretations: Saturn in a day chart acts as an architectural teacher, while in a night chart it creates cold obstruction.',
    historicalLineage:
      'Vettius Valens, Anthologies (c. 175 CE) & Claudius Ptolemy, Tetrabiblos (Book III).',
  },

  essential_dignities_score: {
    id: 'essential_dignities_score',
    title: 'Ptolemaic Essential Dignities Score',
    subtitle: 'Domicile, Exaltation, Triplicity, Term, and Face',
    category: 'Hellenistic & Persian',
    culturalTradition: 'Western (Hellenistic)',
    shortSummary:
      'A weighted scoring system measuring a planet’s innate authority and moral integrity based on its zodiacal territory.',
    astronomicalFormula:
      'Domicile (+5), Exaltation (+4), Dorothean Triplicity (+3), Egyptian Term (+2), Face/Decan (+1), Detriment (-5), Fall (-4), Peregrine (0).',
    howItWorks: [
      'Domicile (+5): Planet is in its own home; possesses maximum agency and resource autonomy.',
      'Exaltation (+4): Planet is an honored guest of highest status.',
      'Triplicity (+3): Planet is supported by the elemental fellowship of its sect.',
      'Term / Bounds (+2): Specific degrees defining procedural boundaries.',
      'Face (+1): Surface appearance with minimal underlying authority.',
      'Peregrine (0): A wandering stranger with no local hospitality.',
    ],
    whyItMatters:
      'Measures capability vs intention: a debilitated benefic may desire good outcomes but lack the agency to deliver them.',
    historicalLineage:
      'Dorotheus of Sidon, Carmen Astrologicum (c. 75 CE).',
  },

  antiscia_contra_antiscia: {
    id: 'antiscia_contra_antiscia',
    title: 'Antiscia & Contra-Antiscia Reflections',
    subtitle: 'Solstitial and Equinoctial Shadow Symmetries',
    category: 'Hellenistic & Persian',
    culturalTradition: 'Western (Hellenistic)',
    shortSummary:
      'Planetary points of equal day-length reflected across the Solstice (Cancer/Capricorn) and Equinox (Aries/Libra) axes.',
    astronomicalFormula:
      'Antiscia: λ_reflected = (180° - λ) mod 360°; Contra-Antiscia: λ_contra = (360° - λ) mod 360°',
    howItWorks: [
      'Antiscia points share identical daylight hours and seasonal solar declination.',
      'Two planets configured by antiscia form a hidden conjunction: they operate in secrecy, subconscious alignment, and indirect agency.',
      'Contra-antiscia points share equal night-length, operating as hidden oppositions or polarization.',
    ],
    whyItMatters:
      'Discloses powerful hidden relationships between planets that appear to have zero standard geometric aspect.',
    historicalLineage:
      'Julius Firmicus Maternus, Mathesis (c. 334 CE).',
  },

  // --- 5. PERSIAN & MEDIEVAL ARABIC ---
  almuten_figuris: {
    id: 'almuten_figuris',
    title: 'Almuten Figuris (Supreme Soul Guide)',
    subtitle: 'Abu Ma’shar / Al-Qabisi Point-Weighted Victor',
    category: 'Hellenistic & Persian',
    culturalTradition: 'Persian (Almuten)',
    shortSummary:
      'The single planet that accumulates the highest composite dignity score across five foundational hyleg points, serving as the chart’s spiritual director.',
    astronomicalFormula:
      'Weighted score across Sun, Moon, Ascendant, Lot of Fortune, and Pre-natal Syzygy degrees, plus accidental house placement and planetary day/hour points.',
    howItWorks: [
      'Evaluates which planet holds the most legal titles across the five life-giving gates of the chart.',
      'Awards points for domicile (+5), exaltation (+4), triplicity (+3), term (+2), and decan (+1).',
      'Adds accidental points for angular house placement (1st, 10th, 7th, 4th) and sect ruler of the hour.',
      'The planet with the highest total score is crowned Almuten Figuris.',
    ],
    whyItMatters:
      'Designates the person’s ultimate intellectual daemon, innate vocation, and philosophical core.',
    historicalLineage:
      'Abu Ma’shar al-Balkhi, Kitab al-Milal wa al-Duwal (c. 850 CE) & Al-Qabisi (Alcabitius).',
  },

  firdaria_periods: {
    id: 'firdaria_periods',
    title: 'Firdaria: 75-Year Chronocrator Planetary Eras',
    subtitle: 'Persian Lifespan Planetary Time Lords',
    category: 'Hellenistic & Persian',
    culturalTradition: 'Persian (Almuten)',
    shortSummary:
      'A fixed 75-year cycle dividing lifespan into planetary chapters determined by day or night birth.',
    astronomicalFormula:
      'Day births: Sun(10y), Venus(8y), Mercury(13y), Moon(9y), Saturn(11y), Jupiter(12y), Mars(7y), North Node(3y), South Node(2y). Night births: Moon starts first.',
    howItWorks: [
      'Each major planetary period is subdivided into 7 equal sub-periods ruled by all seven traditional planets in order.',
      'When an era begins, that planet’s natal condition and house rulership become the central life theme.',
    ],
    whyItMatters:
      'Provides a clean macro-timeline of psychological and professional maturation.',
    historicalLineage:
      'Al-Andarzaghar & Abu Ma’shar, The Abbreviation of the Introduction to Astrology.',
  },

  // --- 6. ANCIENT EGYPTIAN ---
  egyptian_decan_clock: {
    id: 'egyptian_decan_clock',
    title: 'Egyptian 36-Decan Star Compass (Bakhtiu)',
    subtitle: 'Hourly Star Gods of Ra’s Cosmic Barque',
    category: 'Indigenous Cosmologies',
    culturalTradition: 'Egyptian (Decans)',
    shortSummary:
      'The 36 ten-degree divisions of the ecliptic, originating from the 36 decanal star constellations that marked the night hours in ancient Egypt.',
    astronomicalFormula:
      'Ecliptic divided into 36 segments of exactly 10° each, tied to the heliacal rising of Sirius (Sopdet).',
    howItWorks: [
      'Every 10 days throughout the year, a new decan star rose just before sunrise (heliacal rising).',
      'The decans were personified as 36 celestial guardians (Bakhtiu and Khentu) protecting Ra’s solar barque through the Underworld.',
      'Synodix charts which decan presided over the Ascendant, Sun, and Moon, and maps their ancient hieroglyphic symbolism.',
    ],
    whyItMatters:
      'Connects the birth chart directly to the oldest stellar timekeeping system in human civilization.',
    historicalLineage:
      'Senenmut Tomb Ceiling (c. 1473 BCE) & Dendera Zodiac (c. 50 BCE).',
  },

  // --- 7. ZI WEI DOU SHU ---
  ziwei_palaces_stars: {
    id: 'ziwei_palaces_stars',
    title: 'Zi Wei: Twelve Palaces & 14 Polar Stars (紫微斗數)',
    subtitle: 'Imperial Chinese Polar Constellation Horoscopy',
    category: 'Chinese Metaphysics',
    culturalTradition: 'Zi Wei Dou Shu',
    shortSummary:
      'A 4x4 courtyard matrix of Twelve Life Palaces populated by 14 Major Emperor stars whose positions are derived from the lunar birthday and Five Elements Bureau.',
    astronomicalFormula:
      'Ming Palace = (Month Branch - Hour Branch + 1); Five Elements Bureau (Water 2, Wood 3, Metal 4, Earth 5, Fire 6); Zi Wei Star = (Lunar Day / Bureau).',
    howItWorks: [
      '12 Palaces: Life (Ming), Siblings, Marriage, Children, Wealth, Health, Travel, Friends, Career, Property, Spirit (Fu De), Parents.',
      '14 Major Stars include Zi Wei (The Emperor), Tian Fu (The Treasury), Tai Yang (The Sun), Tai Yin (The Moon), Wu Qu (The General), Tian Ji (The Strategist), etc.',
      'Stars possess five radiance grades: Miao (Temple, strongest) down to Xian (Sunken, challenging).',
      'Si Hua (Four Transformations): Lu (Wealth/Flow), Quan (Authority), Ke (Fame/Intellect), Ji (Obstacle/Attachment).',
    ],
    whyItMatters:
      'Provides a comprehensive psychological and familial mirror rooted in Chinese imperial court symbolism.',
    historicalLineage:
      'Grandmaster Chen Tuan (Mount Hua, c. 980 CE), Song Dynasty.',
  },

  // --- 8. MAYA SACRED CALENDAR ---
  maya_calendar_round: {
    id: 'maya_calendar_round',
    title: 'Maya Tzolk’in, Haab’ & Classic Long Count',
    subtitle: 'Sacred Mesoamerican Interlocking Gear Wheels',
    category: 'Indigenous Cosmologies',
    culturalTradition: 'Maya Calendar',
    shortSummary:
      'The sacred 260-day Tzolk’in and 365-day solar Haab’ synchronize every 52 years, anchored to deep astronomical time via the Long Count.',
    astronomicalFormula:
      'Long Count Julian Day correlation GMT = 584283. Tzolk’in = 13 numbers × 20 Nawal day signs = 260 days. Haab’ = 18 months × 20 days + 5 Wayeb.',
    howItWorks: [
      'The 20 Day Signs (Nawales) represent archetypal animal, natural, and spiritual energies (e.g. Imix, Ik’, Ak’b’al, K’an).',
      'The 13 Sacred Tonalities represent the 13 ascending and descending cosmic pulses.',
      'The 52-year Calendar Round occurs when a Tzolk’in day and Haab’ day repeat on the exact same combination.',
      'Synodix computes the verified Long Count (Baktun.Katun.Tun.Uinal.Kin) with round-trip arithmetic validation.',
    ],
    whyItMatters:
      'Reveals individual purpose through non-linear, multi-dimensional time harmonics developed by Classic Maya skywatchers.',
    historicalLineage:
      'Classic Maya Copán and Palenque stelae; Dresden Codex (c. 1200 CE).',
  },

  // --- 9. TIBETAN PHUGPA ---
  tibetan_mewa_parkha: {
    id: 'tibetan_mewa_parkha',
    title: 'Tibetan Mewa Magic Square & Five Personal Forces',
    subtitle: 'Phugpa Lineage Elemental Dynamics (Kar-tsi & Jung-tsi)',
    category: 'Indigenous Cosmologies',
    culturalTradition: 'Tibetan Elemental',
    shortSummary:
      'The 3x3 Lo Shu magic square Mewa number, 8 Parkha trigrams, and five subtle personal forces governing health, fortune, and spiritual vitality.',
    astronomicalFormula:
      '60-year Rabjung cycle (calibrated to base 1027 CE); 9 Mewa cycle backward count; 5 forces: Sog (life), Lu (body), Wang (power), Lungta (wind horse), La (soul).',
    howItWorks: [
      'Natal Mewa (1 to 9): Represents karmic orientation, innate predispositions, and past-life residue.',
      'Natal Parkha (Trigram): Connects the individual to the 8 directions of space.',
      'Khams Lnga (Five Forces): Compares the birth animal’s element against the year element to evaluate vitality and spiritual fortune.',
    ],
    whyItMatters:
      'Synthesizes Indian tantric timekeeping (Kalachakra) with Taoist elemental dynamics into a holistic spiritual diagnostic.',
    historicalLineage:
      'Desi Sangye Gyatso, White Beryl treatise (Baidurya dKar-po, 1687 CE).',
  },

  // --- 10. POLYNESIAN MARAMATAKA ---
  maramataka_lunar_dial: {
    id: 'maramataka_lunar_dial',
    title: 'Māori Maramataka: 30 Oceanic Lunar Nights',
    subtitle: 'Oceanic Lunar Phase Wayfinding & Vitality Rhythm',
    category: 'Indigenous Cosmologies',
    culturalTradition: 'Polynesian Maramataka',
    shortSummary:
      'The traditional 30-night Polynesian lunar calendar tracking the Moon’s exact illumination and elongation to guide human energy, marine tides, and social action.',
    astronomicalFormula:
      'Lunar Night = floor(Moon Elongation from Sun / 12.0°) + 1, ranging from Whiro (New Moon, 1) through Rākau-nui (Full Moon, 15) to Mutu (30).',
    howItWorks: [
      'Each night possesses a distinct biological and psychic energy (Mauri).',
      'High-energy nights (Tamatea, Rākau): Optimal for physical enterprise, harvest, and gathering, but carries emotional volatility.',
      'Low/Unstable nights (Whiro, Korekore): Ideal for reflection, fasting, internal planning, and rest.',
      'Mauri Vitality Index provides direct guidance for daily behavioral alignment.',
    ],
    whyItMatters:
      'Grounds celestial observation in empirical biological rhythms and environmental harmony.',
    historicalLineage:
      'Tohunga Kōkōrangi oral astronomical traditions of Aotearoa (New Zealand) and Polynesia.',
  },

  // --- 11. CONSENSUS & TRIANGULATION ---
  three_cluster_consensus: {
    id: 'three_cluster_consensus',
    title: '3-Cluster Non-Correlated Consensus Matrix',
    subtitle: 'Cross-Cultural Triangulation Without Double-Counting',
    category: 'Consensus & Triangulation',
    shortSummary:
      'Synthesizes nine traditions into three statistically independent cultural voting clusters to prevent lineage-correlated bias.',
    astronomicalFormula:
      'Cluster 1 (Greco-Mediterranean: Western, Persian, Egyptian); Cluster 2 (Indo-Sinitic: Vedic, BaZi, Zi Wei); Cluster 3 (Indigenous: Maya, Tibetan, Maramataka). Consensus requires ≥ 2 independent clusters in agreement.',
    howItWorks: [
      'Vedic and Western astrology share Babylonian roots; BaZi and Zi Wei share Chinese calendar bases. Grouping them prevents duplicate votes.',
      'Evaluates life indicators across 9 standardized domains (Identity, Vitality, Emotion, Intellect, Relationships, Vocation, Prosperity, Transformation, Spirituality).',
      'Calculates an objective agreement score and surfaces the honest Divergence Rate (typically ~31.8%).',
    ],
    whyItMatters:
      'Eliminates confirmation bias: provides genuine multi-system corroboration rather than hollow repetition.',
    historicalLineage:
      'Synodix Triangulation Architecture (Consensus Epistemology & Bayesian Voting).',
  },

  honest_divergence_rate: {
    id: 'honest_divergence_rate',
    title: 'Honest Divergence Rate (~31.8%)',
    subtitle: 'Preserving Creative Tension Between Cultural Worldviews',
    category: 'Consensus & Triangulation',
    shortSummary:
      'Measures the mathematical frequency with which traditions disagree, presenting divergence as a productive dialectic rather than smoothing it over.',
    astronomicalFormula:
      'Divergence % = (Number of contradictory domain indicators / Total evaluated indicator vectors) × 100',
    howItWorks: [
      'When Western indicates expansive ambition (Jupiter 10th) but Vedic indicates introspective renunciation (Saturn-Ketu), typical apps hide the contradiction.',
      'Synodix flags divergence directly with a "DIVERGENT" rating, explaining the differing cultural angles (e.g. social career vs inner spiritual detachment).',
      'A normal healthy divergence rate across 9 cultures ranges from 25% to 38%.',
    ],
    whyItMatters:
      'Protects intellectual integrity: human lives are multi-layered and contradictory, not flat stereotypes.',
    historicalLineage:
      'Scientific Dialectics & Multi-Model Ensemble Epistemology.',
  },

  // --- 12. STATISTICAL EVIDENCE ---
  rodden_titan_benchmark: {
    id: 'rodden_titan_benchmark',
    title: '100 Rodden-Rated Historical Titan Benchmark',
    subtitle: 'AA/A Verified Birth Certificate Empirical Dataset',
    category: 'Statistical Evidence',
    shortSummary:
      'A curated dataset of 100 celebrated historical figures with verified birth certificates (Rodden Rating AA/A) used for statistical calibration.',
    astronomicalFormula:
      '100 profiles across 6 vocational domains tested against 10,000 synthetic permutations to evaluate statistical correlation vs random chance.',
    howItWorks: [
      'Rodden Rating AA: Recorded in official state/hospital birth registry or birth certificate.',
      'Rodden Rating A: Quoted by the subject, family member, or official biography.',
      'Eliminates unverified folklore birth times to ensure test integrity.',
      'Includes Einstein, Jobs, Marie Curie, Leonardo da Vinci, Gandhi, and other documented lives.',
    ],
    whyItMatters:
      'Provides reproducible, verifiable empirical evidence that can be audited by independent researchers.',
    historicalLineage:
      'Lois Rodden Astro-Databank Standard.',
  },

  epistemic_humility_framework: {
    id: 'epistemic_humility_framework',
    title: 'Epistemic Humility & Non-Causal Synchronicity',
    subtitle: 'Astrology as Symbolic Language, Not Gravitational Determinism',
    category: 'Statistical Evidence',
    shortSummary:
      'Synodix rejects claims that planets exert physical gravitational control over human destiny, treating astrological patterns as non-causal symbolic mirrors.',
    astronomicalFormula:
      'Gravitational force of Jupiter on newborn F = G*(m1*m2)/r² ≈ 1.3×10⁻⁷ N (less than the attending obstetrician at 0.5m: ~3.0×10⁻⁷ N).',
    howItWorks: [
      'Physical causality is mathematically absurd: the gravitational and electromagnetic forces of distant planets are dwarfed by local delivery room objects.',
      'Synodix adopts the hermeneutic model: astronomical cycles serve as a celestial clock, not a gravitational puppeteer.',
      'Like a mechanical grandfather clock that indicates 8:00 AM without causing people to eat breakfast, celestial alignments reflect synchronistic cycles of consciousness.',
    ],
    whyItMatters:
      'Distinguishes rigorous astronomical research from superstition and pseudoscientific fatalism.',
    historicalLineage:
      'Carl G. Jung (Synchronicity: An Acausal Connecting Principle, 1952 CE) & Plotinus (Enneads II.3).',
  },
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
    description: '100 Rodden-Rated Titan Benchmark, Permutation Testing, and Non-Causal Synchronicity.',
  },
];

export function getFeatureExplainer(id: string): FeatureExplainer | undefined {
  return FEATURE_EXPLAINERS[id];
}
