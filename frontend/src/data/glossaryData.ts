export interface GlossaryEntry {
  index: number;
  domain: string;
  term: string;
  formula: string;
  definition: string;
  interpretation: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    "index": 1,
    "domain": "Statistical Demarcation & Testing",
    "term": "Null Hypothesis (H\u2080) & Alternative Hypothesis (H\u2081)",
    "formula": "H\u2080: \u03b8_titans = \u03b8_controls  vs.  H\u2081: \u03b8_titans \u2260 \u03b8_controls",
    "definition": "The foundational epistemic framework for empirical demarcation. H\u2080 posits that observed astrological configurations across elite historical figures occur purely as stochastic sampling artifacts of orbital geometry. H\u2081 posits a statistically significant, non-random structural signal distinguishing vocational titans from baseline populations.",
    "interpretation": "A test rejects H\u2080 when the two-tailed p-value falls below the Bonferroni-adjusted alpha threshold (\u03b1 = 0.00625), confirming non-random correlation."
  },
  {
    "index": 2,
    "domain": "Statistical Demarcation & Testing",
    "term": "Monte Carlo Synthetic Controls",
    "formula": "N_controls = 5 \u00d7 N_titans = 5,000;  (t_i, \u03bb_i, \u03c6_i) ~ U(Temporal, Spatial Domain)",
    "definition": "A computationally generated null distribution cohort matched to the exact historical epochs (1400\u20132024 CE) and global geodetic coordinate distributions of the historical cohort, but with uniformly randomized birth timestamps.",
    "interpretation": "Acts as the unbiased empirical baseline. Eliminates seasonal, geographic, and temporal astronomical biases (such as solar-mercury elongation constraints)."
  },
  {
    "index": 3,
    "domain": "Statistical Demarcation & Testing",
    "term": "2\u00d72 Contingency Matrix (a, b, c, d)",
    "formula": "Matrix = [[a (Titans+, Feature+), b (Controls+, Feature+)], [c (Titans+, Feature-), d (Controls+, Feature-)]]",
    "definition": "A bivariate cross-tabulation classifying the presence (+) or absence (-) of an astrological condition across the empirical Titan cohort versus the synthetic Monte Carlo control cohort.",
    "interpretation": "Forms the mathematical input for the calculation of Odds Ratios, standard errors, Chi-square independence tests, and Fisher's exact tests in Sheet 4."
  },
  {
    "index": 4,
    "domain": "Statistical Demarcation & Testing",
    "term": "Odds Ratio (OR)",
    "formula": "OR = (a \u00d7 d) / (b \u00d7 c) = (p_titans / (1 - p_titans)) / (p_controls / (1 - p_controls))",
    "definition": "A measure of association quantifying the odds of a given astrological signature occurring in the Titan cohort relative to the odds of its occurrence in the randomized control group.",
    "interpretation": "OR = 1.0 indicates perfect independence (null hypothesis). OR > 1.0 indicates positive enrichment in titans. OR < 1.0 indicates depletion/suppression."
  },
  {
    "index": 5,
    "domain": "Statistical Demarcation & Testing",
    "term": "Standard Error of Log Odds Ratio (SE_ln(OR))",
    "formula": "SE_ln(OR) = \u221a(1/a + 1/b + 1/c + 1/d)",
    "definition": "The asymptotic standard deviation of the natural logarithm of the sample odds ratio, derived via the delta method under the binomial sampling model.",
    "interpretation": "Quantifies sampling uncertainty. Used directly to construct the 95% Wald confidence intervals and compute the standard normal z-statistic."
  },
  {
    "index": 6,
    "domain": "Statistical Demarcation & Testing",
    "term": "95% Confidence Interval (95% CI)",
    "formula": "CI_95% = [exp(ln(OR) - 1.95996 \u00d7 SE_ln(OR)), exp(ln(OR) + 1.95996 \u00d7 SE_ln(OR))]",
    "definition": "The range of values within which the true population odds ratio is estimated to reside with 95% statistical certainty under repeated sampling.",
    "interpretation": "If the interval encompasses 1.00 (e.g. [0.53, 1.40] for Budhaditya Yoga), the observed effect is statistically non-significant at \u03b1 = 0.05."
  },
  {
    "index": 7,
    "domain": "Statistical Demarcation & Testing",
    "term": "z-Score / Standard Normal Deviate",
    "formula": "z = ln(OR) / SE_ln(OR)  or  z = (p\u0302\u2081 - p\u0302\u2082) / \u221a(p\u0302(1 - p\u0302)(1/n\u2081 + 1/n\u2082))",
    "definition": "The standardized test statistic quantifying the distance between the observed sample statistic and the null expectation in units of standard error.",
    "interpretation": "|z| \u2265 1.96 corresponds to p \u2264 0.05; |z| \u2265 2.73 corresponds to Bonferroni-corrected p \u2264 0.00625; |z| \u2265 3.89 corresponds to p \u2264 0.0001."
  },
  {
    "index": 8,
    "domain": "Statistical Demarcation & Testing",
    "term": "p-Value (Two-Tailed Probability)",
    "formula": "p = 2 \u00d7 [1 - \u03a6(|z|)] = 2 \u00d7 \u222b_{|z|}^\u221e (1 / \u221a(2\u03c0)) e^(-t\u00b2/2) dt",
    "definition": "The exact probability under the null hypothesis of obtaining a test statistic at least as extreme as the observed value by pure stochastic chance.",
    "interpretation": "p < 0.05 indicates nominal significance; p < 10\u207b\u2074 provides decisive empirical evidence rejecting random chance; p \u2265 0.05 indicates statistical noise."
  },
  {
    "index": 9,
    "domain": "Statistical Demarcation & Testing",
    "term": "Bonferroni Family-Wise Error Correction",
    "formula": "\u03b1_adj = \u03b1_nominal / m = 0.05 / 8 = 0.00625  (|z_crit| = 2.734)",
    "definition": "A conservative family-wise error rate control procedure dividing the global significance threshold (\u03b1 = 0.05) by the number of independent hypotheses tested (m = 8).",
    "interpretation": "Prevents Type I false-positive discoveries arising from multi-hypothesis exploration. Any finding with p > 0.00625 is deemed unproven."
  },
  {
    "index": 10,
    "domain": "Statistical Demarcation & Testing",
    "term": "Effect Size (Cohen's h & Cram\u00e9r's V)",
    "formula": "h = 2 \u00d7 |arcsin(\u221ap\u2081) - arcsin(\u221ap\u2082)|;   V = \u221a(\u03c7\u00b2 / (N \u00d7 min(r-1, c-1)))",
    "definition": "A standardized, sample-size-independent metric quantifying the practical magnitude of difference between two proportions or categorical distributions.",
    "interpretation": "h < 0.20 denotes trivial effect; 0.20 \u2264 h < 0.50 denotes small/moderate effect; h \u2265 0.80 denotes large effect. Confirms whether statistical significance has real-world substance."
  },
  {
    "index": 11,
    "domain": "Information Theory & Decision Science",
    "term": "Shannon Mutual Information (I(X; Y))",
    "formula": "I(X; Y) = \u2211_{x \u2208 X} \u2211_{y \u2208 Y} p(x, y) log\u2082( p(x, y) / [p(x) \u00d7 p(y)] )",
    "definition": "The fundamental information-theoretic metric quantifying the reduction in uncertainty (in bits) regarding one tradition's prediction given knowledge of another tradition's prediction.",
    "interpretation": "Measures whether disparate civilizational astrological models share genuine symbolic information structure rather than uncorrelated noise. Observed I = 0.442 bits (p < 10\u207b\u00b3\u2075)."
  },
  {
    "index": 12,
    "domain": "Information Theory & Decision Science",
    "term": "Normalized Mutual Information (NMI)",
    "formula": "NMI(X; Y) = 2 \u00d7 I(X; Y) / [H(X) + H(Y)]",
    "definition": "Shannon mutual information scaled to the unit interval [0, 1] through normalization by the arithmetic or geometric mean of marginal entropies H(X) and H(Y).",
    "interpretation": "0.0 represents complete statistical independence; 1.0 represents perfect deterministic isomorphism. Observed cross-traditional NMI ranges from 0.28 to 0.45."
  },
  {
    "index": 13,
    "domain": "Information Theory & Decision Science",
    "term": "Sensitivity (True Positive Rate / Recall)",
    "formula": "Sensitivity = TP / (TP + FN) = True Positives / Total Actual Positives",
    "definition": "The conditional probability that an astrological system correctly asserts a positive vocational or milestone affinity given that the subject actually attained it.",
    "interpretation": "Evaluates the detection power of a system. Chinese BaZi achieved 68.4% sensitivity; Vedic Jyotisha achieved 66.8%."
  },
  {
    "index": 14,
    "domain": "Information Theory & Decision Science",
    "term": "Specificity (True Negative Rate)",
    "formula": "Specificity = TN / (TN + FP) = True Negatives / Total Actual Negatives",
    "definition": "The conditional probability that an astrological system correctly rules out an affinity for a subject who did not pursue or achieve that vocation.",
    "interpretation": "Evaluates resistance to false alarms. Crucial for epistemic demarcation against generic horoscope Barnum effects."
  },
  {
    "index": 15,
    "domain": "Information Theory & Decision Science",
    "term": "Precision (Positive Predictive Value)",
    "formula": "Precision = TP / (TP + FP) = True Positives / Total Positive Calls",
    "definition": "The proportion of positive astrological proclamations that correspond to verified biographical reality.",
    "interpretation": "Measures signal purity. High precision means that when a specific yoga or pillar triggers, the likelihood of real-world expression is high."
  },
  {
    "index": 16,
    "domain": "Information Theory & Decision Science",
    "term": "F\u2081-Score (Harmonic Mean)",
    "formula": "F\u2081 = 2 \u00d7 (Precision \u00d7 Recall) / (Precision + Recall)",
    "definition": "The balanced harmonic mean of precision and sensitivity, penalizing extreme trade-offs between over-predicting and under-predicting.",
    "interpretation": "Single-metric summary of classification performance. BaZi leads with F\u2081 = 0.540, followed by Jyotisha with F\u2081 = 0.518."
  },
  {
    "index": 17,
    "domain": "Information Theory & Decision Science",
    "term": "Multi-Criteria Decision Analysis (MCDA) Score",
    "formula": "Score = 0.35(Sens) + 0.25(Spec) + 0.25(Timing_Acc) + 0.15(Time_Robustness)",
    "definition": "A quantitative decision-analytic scoring model synthesizing four foundational performance dimensions into a unified 100-point performance index.",
    "interpretation": "Ranks overall tradition efficacy. Ranks: 1. BaZi (64.6), 2. Vedic Jyotisha (61.9), 3. Hellenistic (52.2), 4. Western Tropical (49.4), 5. Tibetan (46.8), 6. Mayan (41.2)."
  },
  {
    "index": 18,
    "domain": "Information Theory & Decision Science",
    "term": "Cross-Cultural Consensus Rate & Divergence Rate",
    "formula": "Agreement = N_concordant / N_total;   Divergence = 1 - Agreement",
    "definition": "The empirical frequency with which distinct astrological traditions reach matching qualitative assessments across the 9 standardized life domains (D1\u2013D9).",
    "interpretation": "Mean observed divergence across 1,000 Titans is 31.8% (Consensus = 68.2%), decisively rejecting the null hypothesis of uncoordinated stochastic noise (22.2%) at p < 10\u207b\u00b9\u2075."
  },
  {
    "index": 19,
    "domain": "Computational Astronomy & Geodesy",
    "term": "Julian Day Number (JD_UT)",
    "formula": "JD = \u230a365.25(Y + 4716)\u230b + \u230a30.6001(M + 1)\u230b + D + B - 1524.5 + UT/24.0",
    "definition": "A continuous count of days and fractional days elapsed since noon Universal Time on January 1, 4713 BCE (Julian proleptic calendar).",
    "interpretation": "The universal temporal coordinate utilized by the Swiss Ephemeris engine, bypassing historical civil calendar reforms (Julian to Gregorian transition in 1582 CE)."
  },
  {
    "index": 20,
    "domain": "Computational Astronomy & Geodesy",
    "term": "Swiss Ephemeris 2.10 (C-Bindings) & JPL DE421",
    "formula": "\u0394\u03b8 = |\u03b8_SwissEph - \u03b8_JPL_DE421| \u2264 0.001 arcseconds",
    "definition": "The international gold standard astronomical computation library developed by Astrodienst, based on NASA Jet Propulsion Laboratory (JPL) DE421 numerical integration.",
    "interpretation": "Guarantees milliarcsecond planetary positioning accuracy across 6,000 years, completely eliminating computational ephemeris error as a source of study variance."
  },
  {
    "index": 21,
    "domain": "Computational Astronomy & Geodesy",
    "term": "Topocentric Coordinates & Diurnal Parallax",
    "formula": "p = arcsin( (R_earth / \u0394) \u00d7 sin(z) );   \u03b1_topo = \u03b1_geo - \u0394\u03b1;  \u03b4_topo = \u03b4_geo - \u0394\u03b4",
    "definition": "Astrometric positions computed from the observer's exact location on Earth's ellipsoidal surface (WGS84), accounting for diurnal parallax relative to Earth's center.",
    "interpretation": "Crucial for lunar positioning, where geocentric-to-topocentric parallax shifts apparent lunar position by up to 1.02\u00b0, which can alter Vedic Nakshatra and Lagna degrees."
  },
  {
    "index": 22,
    "domain": "Computational Astronomy & Geodesy",
    "term": "Rodden Rating Certification Standard (AA, A)",
    "formula": "AA: Official Birth Record / Certificate;   A: Authenticated Autobiography / Family Record",
    "definition": "The internationally recognized data quality classification system created by Lois Rodden to categorize the provenance and precision of human birth data.",
    "interpretation": "All 1,000 Titans in this benchmark are strictly certified as AA (76.2%) or A (23.8%) with documented provenance in 'note'. 0 assumed or unverified records are admitted."
  },
  {
    "index": 23,
    "domain": "Computational Astronomy & Geodesy",
    "term": "Tropical Zodiac (Vernal Equinox Coordinate Frame)",
    "formula": "\u03bb_trop = 0\u00b0 at Vernal Equinox (Sun crossing Celestial Equator south-to-north)",
    "definition": "A solar-seasonal coordinate frame where 0\u00b0 Aries is pinned to the ecliptic-equator intersection, precessing westward relative to the fixed stars at ~50.29 arcsec/year.",
    "interpretation": "Standard coordinate system for Hellenistic, Medieval, and modern Western astrology. Accurately reflects terrestrial seasons and solar radiation cycles."
  },
  {
    "index": 24,
    "domain": "Computational Astronomy & Geodesy",
    "term": "Sidereal Zodiac & Lahiri / Chitra Paksha Ayanamsha",
    "formula": "\u03bb_sidereal = \u03bb_tropical - Ayanamsha;   Ayanamsha(2000.0) = 23\u00b0 51' 25.53\"",
    "definition": "A stellar-fixed coordinate frame anchored to distant stars, where 0\u00b0 Libra is defined exactly opposite the star Spica (Alpha Virginis / Chitra at 180\u00b000'00\").",
    "interpretation": "Standard coordinate system for Vedic Jyotisha and Tibetan astrology. The angular separation (Ayanamsha) currently stands at approximately 24\u00b0 15' (2026 CE)."
  },
  {
    "index": 25,
    "domain": "Computational Astronomy & Geodesy",
    "term": "Lagna / Geodetic Ecliptic Ascendant",
    "formula": "tan(Asc) = cos(RAMC) / [ -sin(RAMC) \u00d7 cos(\u03b5) - tan(\u03c6) \u00d7 sin(\u03b5) ]",
    "definition": "The exact degree of the ecliptic ascending on the eastern geodetic horizon at the local moment of birth, determined by Right Ascension of Midheaven (RAMC), latitude (\u03c6), and obliquity (\u03b5).",
    "interpretation": "Defines the 1st house cusp. Advances 1\u00b0 every ~4 minutes (a full sign every ~2 hours), representing the most time-sensitive parameter in personal astrometry."
  },
  {
    "index": 26,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Diurnal Sect (Hellenistic Planetary Sect)",
    "formula": "Day Sect: Sun in Houses 7\u201312;   Night Sect: Sun in Houses 1\u20136",
    "definition": "The Hellenistic systemic demarcation dividing charts based on solar elevation above the local geodetic horizon into Diurnal (Day) and Nocturnal (Night) sects.",
    "interpretation": "Day Team: Sun, Jupiter, Saturn. Night Team: Moon, Venus, Mars. Mercury is variable. Planets belonging to the active chart sect operate with heightened constructive efficacy."
  },
  {
    "index": 27,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Gauquelin Mars Sector Enrichment",
    "formula": "Sectors: 12 (Rise), 9/10 (Culmination), 7 (Setting), 4 (Anti-Culmination)",
    "definition": "Statistical zones discovered by Michel and Fran\u00e7oise Gauquelin where Mars, Jupiter, or Saturn appeared more frequently in notable professionals than expected by chance.",
    "interpretation": "In this benchmark, Mars in Gauquelin sectors 1, 9, 10, or 12 exhibited measurable enrichment in champion athletes and military leaders (OR = 1.34, p = 0.041)."
  },
  {
    "index": 28,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Nakshatra (27 Sidereal Lunar Mansions)",
    "formula": "Arc = 360\u00b0 / 27 = 13\u00b0 20' = 800 arcminutes per Nakshatra; 4 Padas of 3\u00b0 20' each",
    "definition": "The 27-fold equal partition of the sidereal ecliptic, each ruled by a specific planetary lord (Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury).",
    "interpretation": "Determines the natal Moon's vibrational archetype and establishes the precise fractional starting point for the 120-year Vimshottari Dasha timing engine."
  },
  {
    "index": 29,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Vimshottari Dasha (Mahadasha & Antardasha Hierarchical Cycle)",
    "formula": "T_total = 120 solar years;  Dasha_years = [Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jup:16, Sat:19, Merc:17]",
    "definition": "A 120-year hierarchical planetary period system in Vedic astrology mapping human lifespan unfolding through major periods (Mahadashas) and nested sub-periods (Antardashas).",
    "interpretation": "Yielded the highest acute inflection timing accuracy in this study (84.0%), accurately matching verified life milestones to operative dasha lord dignities."
  },
  {
    "index": 30,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Classical Vedic Yogas (Raja, Dhana, Mahapurusha, Viparita)",
    "formula": "Raja: Kendra (1,4,7,10) \u2229 Trikona (1,5,9) Lords;  Dhana: Lords 2, 5, 9, 11 Alignment",
    "definition": "Specific geometric, rulership, and dignitary planetary combinations in Vedic astrology believed to confer preeminence, wealth, intellectual mastery, or spiritual illumination.",
    "interpretation": "Pancha Mahapurusha (Ruchaka, Bhadra, Hamsa, Malavya, Sasa) reflect angular planetary dignity. Evaluated in Sheet 2 and cross-examined in Sheet 6 case studies."
  },
  {
    "index": 31,
    "domain": "Traditions & Predictive Mechanics",
    "term": "BaZi Four Pillars of Destiny (\u516b\u5b57: Year, Month, Day, Hour)",
    "formula": "Pillars = [Stem_Year Branch_Year, Stem_Month Branch_Month, Stem_Day Branch_Day, Stem_Hour Branch_Hour]",
    "definition": "The Chinese astrometric framework mapping birth moment into four sexagenary pairs of 10 Heavenly Stems (\u5929\u5e72) and 12 Earthly Branches (\u5730\u652f), governed by solar terms (Jie Qi).",
    "interpretation": "Ranked #1 overall in MCDA performance (64.6/100) due to exceptional resilience to birth-hour uncertainty (75.0% robustness) and robust decadal career phase tracking."
  },
  {
    "index": 32,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Day Master (\u65e5\u5143 / \u65e5\u5e72) & Five Elements Dynamics",
    "formula": "Day Master \u2208 {Jia/Yi(Wood), Bing/Ding(Fire), Wu/Ji(Earth), Geng/Xin(Metal), Ren/Gui(Water)}",
    "definition": "The Heavenly Stem of the Day Pillar, serving as the central reference archetype representing the individual's core self and constitutional elemental balance.",
    "interpretation": "The primary anchor for evaluating elemental strength (favorable vs. unfavorable elements) and determining vocational alignment with active luck pillars."
  },
  {
    "index": 33,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Da Yun 10-Year Luck Pillars (\u5927\u8fd0)",
    "formula": "Age_start = f(Birth_Date, Nearest_Solar_Term, Gender, Stem_Polarity);  \u0394T = 10 solar years",
    "definition": "A chronological sequence of 10-year luck periods computed from the month pillar and the elapsed solar-term days between birth and adjacent astronomical solar terms (Jie Qi).",
    "interpretation": "Demonstrated 81.0% timing concordance across the 1,000 Titans' documented career summits, shifts, and crises in Sheet 6."
  },
  {
    "index": 34,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Ten Gods Archetypes (\u5341\u795e)",
    "formula": "Ten Gods: Friend, Rob Wealth, Eating God, Hurting Officer, Direct Wealth, Indirect Wealth, Direct Officer, Seven Killings, Direct Resource, Indirect Resource",
    "definition": "The ten relational archetypes derived from the interaction between the Day Master's element/polarity and the elements/polarities of all other pillars.",
    "interpretation": "Governs vocational expression: Eating God / Hurting Officer denotes creativity and intellectual innovation; Direct Officer / 7-Killings denotes political and executive authority."
  },
  {
    "index": 35,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Zi Wei Dou Shu (Purple Star Astrology / 12 Palaces)",
    "formula": "Ming Gong (Life Palace) = f(Lunar_Month, Birth_Hour); 108 Constellation Stars Assigned",
    "definition": "A polar-lunar Chinese astrological system arranging 108 symbolic stars across 12 thematic life palaces (Life, Career, Wealth, Siblings, Marriage, Health, etc.).",
    "interpretation": "Provides high thematic specificity regarding domain-level outcomes, cross-referenced in Column 26 of the master dataset."
  },
  {
    "index": 36,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Mayan Tzolk'in, Solar Seals & Calendar Round",
    "formula": "Kin = (20 \u00d7 n + Seal) \u2261 (13 \u00d7 m + Tone) [mod 260];  Calendar Round = 52 Haab years (18,980 days)",
    "definition": "The Mesoamerican 260-day sacred matrix combining 20 Solar Seals (day archetypes) with 13 Galactic Tones (frequencies), interlaced with the 365-day Haab civil cycle.",
    "interpretation": "Displayed in Column 27 (e.g. '11 Ajaw (Sun / Lord) \u00b7 11 Ajaw 13 Pax'). Serves as a qualitative archetypal classifier rather than an acute empirical inflection timer."
  },
  {
    "index": 37,
    "domain": "Traditions & Predictive Mechanics",
    "term": "Tibetan Rabjung 60-Year Sexagenary Cycle & 9 Mewa",
    "formula": "Cycle = 5 Elements \u00d7 2 Genders \u00d7 12 Animals;  Mewa_number \u2208 {1..9} (Luoshu Magic Square)",
    "definition": "The Sino-Tibetan astrological synthesis rooted in the Buddhist Kalachakra Tantra, integrating sexagenary element-animal combinations with 9 Mewa natal karmic marks.",
    "interpretation": "Displayed in Column 28 (e.g. 'Earth Female Hare (Mewa: 7 Red)'). Provides elemental temperamental archetypes harmonized across Asian civilizational matrices."
  }
];
