# Nine Traditions Engine

Synodix computes nine autonomous astrological systems from the normalized base ephemeris. Rather than forcing these traditions into a Western tropical mold, each engine calculates its positions according to its historic cultural and astronomical rules.

---

## 🔄 Multi-Tradition Calculation Workflow

```mermaid
flowchart TD
    classDef base fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef trad fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef cluster fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    classDef synth fill:#4c0519,stroke:#f43f5e,stroke-width:2px,color:#f8fafc;

    Ephem["Verified Base Ephemeris (Tropical & Lahiri Sidereal Longitudes)"]:::base

    subgraph Phase_Western ["1. Western & Hellenistic Stream"]
        Ephem --> West["Western Tropical\n• Placidus Houses\n• Major & Minor Aspects\n• Antiscia & Receptions"]:::trad
        Ephem --> Pers["Hellenistic & Persian\n• Sect (Diurnal/Nocturnal)\n• Almuten Figuris\n• Firdaria Periods\n• Lots (Fortune, Spirit)"]:::trad
        Ephem --> Egypt["Egyptian Decanic\n• 36 Decans\n• Sothic Heliacal Rising\n• Seasonal Cycles"]:::trad
    end

    subgraph Phase_Eastern ["2. Eastern & Sidereal Stream"]
        Ephem --> Vedic["Jyotisha (Vedic)\n• Lahiri Ayanamsha\n• Vimshottari Dasha\n• 27 Nakshatras & Padas\n• D1 Rasi & D9 Navamsha"]:::trad
        Ephem --> BaZi["BaZi (Four Pillars)\n• True Solar Time (LAST)\n• 10 Stems & 12 Branches\n• Hidden Stems & Qi Balance\n• Day Master Strength"]:::trad
        Ephem --> ZiWei["Zi Wei Dou Shu\n• 12 Palaces (Ming, Shen)\n• 14 Major Stars\n• Si Hua Mutators"]:::trad
        Ephem --> Tibet["Tibetan Phugpa\n• Elemental Balance\n• Mewa Numbers\n• Parkha Trigrams"]:::trad
    end

    subgraph Phase_Indigenous ["3. Mesoamerican & Polynesian Stream"]
        Ephem --> Maya["Maya Calendar\n• Tzolk'in 260-Day Count\n• Haab 365-Day Solar\n• 20 Nawales & 13 Numbers"]:::trad
        Ephem --> Maori["Māori Maramataka\n• 30 Lunar Phases\n• Matariki Stellar Horizon\n• Fishing & Harvest Qi"]:::trad
    end

    West & Pers & Egypt --> Clust1["Cluster 1: Greco-Mediterranean"]:::cluster
    Vedic & BaZi & ZiWei & Tibet --> Clust2["Cluster 2: Indo-Sinitic"]:::cluster
    Maya & Maori --> Clust3["Cluster 3: Indigenous & Lunar"]:::cluster

    Clust1 & Clust2 & Clust3 --> Synth["Consensus & Synthesis Engine"]:::synth
```

### Architectural Breakdown of Traditions
1. **Western Tropical**: Equinox-anchored ecliptic zodiac ($0^\circ \Upsilon$), Placidus house quadrant division, Ptolemaic aspects, and antiscia reflections.
2. **Hellenistic & Persian**: Planetary sect governance (diurnal vs. nocturnal conditions), Almuten calculations, planetary lots (Lot of Fortune, Lot of Spirit), and Firdaria planetary period cycles.
3. **Egyptian Decanic**: 36 ten-degree decans, Egyptian faces, and heliacal rising sequences.
4. **Vedic (Jyotisha)**: Fixed-star Chitra Paksha (Lahiri) ayanamsha, 27 Nakshatras divided into 108 Padas, Vimshottari 120-year dasha periods, D1 Rasi root chart, and D9 Navamsha harmonic chart.
5. **Chinese BaZi (Four Pillars)**: Year, Month, Day, and Hour pillars calculated with Local Apparent Solar Time (LAST). Ten Heavenly Stems, Twelve Earthly Branches, hidden stem interactions, and five-phase Wu Xing balance.
6. **Chinese Zi Wei Dou Shu (Purple Star)**: Twelve life palaces (Ming, Wealth, Career, Siblings, etc.), fourteen major stars, and Si Hua annual transformations.
7. **Tibetan Phugpa**: Synthesizes Indian Kalachakra with Chinese elemental calculations, computing 9 Mewa birth numbers and 8 Parkha trigrams.
8. **Maya Calendar**: Continuous Long Count progression correlating Tzolk'in (260-day sacred almanac) with Haab (365-day solar calendar) to identify the governing Nawal and Trecena energy.
9. **Māori Maramataka**: Thirty distinct lunar night phases tracking vitality, community action, and the seasonal heliacal rising of Matariki (Pleiades).
