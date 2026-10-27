# Astrometric & Cultural Feature Guide Encyclopedia

The **Synodix Feature Guide** is an authoritative compendium of 50 comprehensive explainers covering precision celestial astrometry, all nine civilizational astrological traditions, mathematical algorithms, historical lineages, and cultural worldviews.

---

## 🧭 Topic Inventory by Category

### 1. Precision Astrometry & Modern Geodetics
1. **NASA JPL DE421 Ephemeris Kernel** (`jpl_de421`): Numerical integration of solar system bodies using high-precision ephemerides.
2. **Swiss Ephemeris 2.10 (Moshier & DE431)** (`swisseph_engine`): High-speed astrometric calculations down to arcseconds.
3. **Equation of Time & True Solar Time (LAST/LMST)** (`time_normalization_eot`): Corrections for Earth's orbital eccentricity and axial obliquity ($\Delta t \approx -14 \text{ to } +16 \text{ mins}$).
4. **Cusp Proximity Auditor (<1.0°)** (`cusp_proximity_auditor`): Invariant safety checks detecting boundary vulnerability near sign and house cusps.
5. **Topocentric vs Geocentric Coordinates** (`topocentric_coordinates`): Parallax adjustments for observer latitude and elevation.
6. **Dual-Engine Validation Parity** (`dual_engine_validation`): Cross-engine consistency checks ($<0.01^\circ$ tolerance) between SwissEph and Skyfield.
7. **Astronomical Nutation & Obliquity** (`astronomical_nutation`): Periodic gravitational torque wobbles of Earth's rotational axis (18.6-year cycle).
8. **Delta T ($\Delta T$) Clock Correction** (`delta_t_clock_correction`): Dynamic discrepancy between uniform Terrestrial Time (TT) and Earth rotation (UT1).
9. **Speed-of-Light Planetary Aberration** (`speed_of_light_aberration`): Apparent displacement due to photon flight time and orbital motion.
10. **Precession of the Equinoxes** (`precession_of_equinoxes`): The 25,772-year Great Year shifting tropical coordinates relative to sidereal fixed stars.

### 2. Jyotisha & Vedic Sidereal Tradition
11. **Lahiri (Chitra Paksha) Ayanamsha** (`vedic_lahiri_ayanamsha`): Sidereal reference framework fixing Spica at 180° longitude.
12. **27 Nakshatras & 108 Padas** (`vedic_nakshatras_padas`): Lunar asterisms of $13^\circ 20'$ subdivided into $3^\circ 20'$ harmonic quarters.
13. **Vimshottari Dasha System** (`vedic_vimshottari_dasha`): 120-year planetary progression cycle rooted in the natal Moon's Nakshatra.
14. **Parashari Ashtakavarga System** (`vedic_ashtakavarga`): 8-fold benefic point matrix evaluating transit strength across 337 total bindus.
15. **Jaimini Chara Karakas** (`vedic_chara_karakas`): 7 variable planetary significators ranked strictly by longitude degrees within their signs.
16. **Varga Divisional Charts (D1 through D60)** (`vedic_vargas`): Harmonic sub-segmentations of the 360° zodiac examining nuanced life dimensions.
17. **12 Bhavas & Bhava Chalita** (`vedic_bhavas`): Houses of fortune and Sripathi unequal house division system.
18. **Shadbala Six-Fold Planetary Strength** (`vedic_shadbala`): Positional, directional, motional, temporal, motional, and natural potency scoring.

### 3. Western Classical & Hellenistic Tradition
19. **Hellenistic Essential Dignities & Debilities** (`western_essential_dignities`): Domicile, Exaltation, Triplicity, Term, and Face scoring matrix.
20. **Dorothean Triplicity Rulers** (`western_triplicity_rulers`): Elemental lords governing diurnal, nocturnal, and participating lifecycle phases.
21. **Ptolemaic Egyptian Terms (Bounds)** (`western_egyptian_bounds`): Unequal five-fold sign subdivisions governing planetary boundary conditions.
22. **Almuten Figuris (Victor of the Chart)** (`western_almuten_figuris`): Abu Ma'shar's multi-layered scoring algorithm identifying the chart's supreme ruler.
23. **Placidus Semi-Arc vs Whole Sign Houses** (`western_house_systems`): Comparison of temporal quadrant division vs Hellenistic zodiacal sign houses.
24. **Diurnal vs Nocturnal Sect (Hairesis)** (`western_sect`): Day/night polarity framework determining benefic and malefic planetary expression.
25. **Ptolemaic Major Aspects & Orbs** (`western_aspects`): Conjunction, Sextile, Square, Trine, and Opposition geometry with planetary body orbs.
26. **Harmonic Overtones & Antiscia** (`western_antiscia_harmonics`): Solstitial reflection points and Fourier wave divisions across the zodiacal circle.

### 4. Chinese BaZi & Zi Wei Dou Shu Traditions
27. **Wu Xing: Five Phase Elemental Dynamics** (`bazi_wu_xing`): Wood, Fire, Earth, Metal, Water in generating, controlling, and weakening cycles.
28. **10 Heavenly Stems & 12 Earthly Branches** (`bazi_stems_branches`): 60-year Sexagenary cycle (Jia Zi) structuring the Four Pillars of Destiny.
29. **The Ten Gods (Shi Shen)** (`bazi_ten_gods`): Relational polarities derived from the interaction of the Day Master with other stems.
30. **Zi Wei Dou Shu 12 Imperial Palaces** (`ziwei_twelve_palaces`): Ming, Brothers, Spouse, Children, Wealth, Health, Travel, Friends, Career, Property, Karma, Parents.
31. **The 14 Major Constellation Stars** (`ziwei_major_stars`): Northern and Southern dipper archetypes governing palace fortune and destiny.

### 5. Mesoamerican & Maya Sacred Calendars
32. **Tzolk'in 260-Day Sacred Calendar** (`maya_tzolkin_cycle`): Interlocking permutation of 20 Day Signs (Nawales) and 13 Intentional Tones.
33. **20 Nawales (Day Signs) & 13 Tones** (`maya_nawales_tones`): Sacred archetypes embodying natural, cosmic, and animal energy patterns.
34. **Haab' 365-Day Solar Agricultural Count** (`maya_haab_solar`): 18 months of 20 days plus the 5 Wayeb' portal days.
35. **Calendar Round (52-Year Synodic Alignment)** (`maya_calendar_round`): Least common multiple alignment of 260-day Tzolk'in and 365-day Haab' cycles.

### 6. Polynesian Māori Maramataka
36. **Maramataka 30-Night Lunar Calendar** (`maori_maramataka_phases`): Ecological tracking of the Moon's 29.53-day synodic passage.
37. **Tangaroa & Rongo Biological Tides** (`maori_tangaroa_rongo`): High-energy nights for oceanic harvesting, planting, and spiritual balance.

### 7. Egyptian Decanic Astrometry
38. **36 Decanic Star Clock Segments** (`egyptian_decans_star_clock`): 10-day stellar markers tracking the heliacal rising of stars over 360 days.
39. **Sothic Heliacal Rising of Sirius (Sopdet)** (`egyptian_sothic_rising`): Celestial herald of the annual Nile inundation (Akhet).

### 8. Hellenistic & Persian Arabic Parts
40. **Lots & Arabic Parts (Hermetic Tradition)** (`persian_lots_arabic_parts`): Longitude projection arcs representing specific existential dimensions.
41. **Firdaria (Medieval Planetary Lifecycle Periods)** (`persian_firdaria`): Persian chronocrator system dividing human lifespan into planetary reigns.

### 9. Tibetan Phugpa Lunisolar Tradition
42. **9 Mewa Magic Square Numerology** (`tibetan_mewa_square`): 3x3 Luoshu elemental grid representing past-life karmic imprint and vital essence.
43. **Lo-Gkor 12-Year Animal Cycle & Parkha Trigrams** (`tibetan_logkor_parkha`): Interlocking animal zodiac and 8 I Ching trigrams.

### 10. Epistemology & Cross-Cultural Triangulation
44. **Independent Cultural Transmission Lineages** (`independent_cultural_lineages`): Historical and geographical separation proving zero lineage collusion.
45. **Three-Cluster Consensus Framework** (`three_cluster_consensus`): Cluster 1 (Western/Hellenistic/Persian), Cluster 2 (Vedic/Tibetan/Egyptian), Cluster 3 (BaZi/Zi Wei/Maya/Māori).
46. **Epistemic Humility & Non-Determinism** (`epistemic_humility_framework`): Symbolic synchronicity versus mechanical physical determinism.
47. **Double-Blind 100 Titans Monte Carlo Benchmark** (`monte_carlo_100_titans`): Statistical null-hypothesis permutation tests against historical biographies.
48. **Synastry Cross-Aspect Conjunctions** (`synastry_conjunctions`): Cross-chart harmonic resonance and relational inter-aspect geometry.
49. **Ashtakoota 36-Point Compatibility** (`ashtakoota_compatibility`): Vedic 8-factor relationship score evaluating psychological, spiritual, and physical harmony.
50. **Composite Midpoint Chart** (`composite_midpoint_chart`): The mathematical midpoint entity representing the third autonomous field of a partnership.
