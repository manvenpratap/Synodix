"""
Persian and Medieval Arabic Astrology (Ilm al-Nujūm / علم النجوم) calculation module.
Computes:
1. Almuten Figuris (The supreme ruling planet of the soul and chart via weighted dignity scoring).
2. Firdaria (75-year chronological planetary period and sub-period cycle).
3. The Hermetic Arabic Parts (Lots: Fortune, Spirit, Necessity, Eros, Courage, Nemesis).
4. Triplicity Lords of the Sect Light (Youth, Maturity, Old Age lifespan chapters).
"""

from typing import Dict, Any, List, Tuple
import math

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

TRADITIONAL_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"]

# Domicile rulers
DOMICILE_RULERS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

# Exaltation rulers
EXALTATION_RULERS = {
    "Aries": "Sun", "Taurus": "Moon", "Cancer": "Jupiter", "Virgo": "Mercury",
    "Libra": "Saturn", "Capricorn": "Mars", "Pisces": "Venus"
}

# Dorothean Triplicity rulers (Day, Night, Participating)
DOROTHEAN_TRIPLICITIES = {
    "Fire":  {"day": "Sun",     "night": "Jupiter", "part": "Saturn"},
    "Earth": {"day": "Venus",   "night": "Moon",    "part": "Mars"},
    "Air":   {"day": "Saturn",  "night": "Mercury", "part": "Jupiter"},
    "Water": {"day": "Venus",   "night": "Mars",    "part": "Moon"},
}

SIGN_ELEMENTS = {
    "Aries": "Fire", "Taurus": "Earth", "Gemini": "Air", "Cancer": "Water",
    "Leo": "Fire", "Virgo": "Earth", "Libra": "Air", "Scorpio": "Water",
    "Sagittarius": "Fire", "Capricorn": "Earth", "Aquarius": "Air", "Pisces": "Water"
}

# Chaldean Decans (10° per decan) starting from 0° Aries
CHALDEAN_DECANS = [
    ("Mars", "Sun", "Venus"),        # Aries
    ("Mercury", "Moon", "Saturn"),   # Taurus
    ("Jupiter", "Mars", "Sun"),      # Gemini
    ("Venus", "Mercury", "Moon"),    # Cancer
    ("Saturn", "Jupiter", "Mars"),   # Leo
    ("Sun", "Venus", "Mercury"),     # Virgo
    ("Moon", "Saturn", "Jupiter"),   # Libra
    ("Mars", "Sun", "Venus"),        # Scorpio
    ("Mercury", "Moon", "Saturn"),   # Sagittarius
    ("Jupiter", "Mars", "Sun"),      # Capricorn
    ("Venus", "Mercury", "Moon"),    # Aquarius
    ("Saturn", "Jupiter", "Mars"),   # Pisces
]

# Egyptian Terms (Bounds): List of (end_degree, planet) for each sign
EGYPTIAN_TERMS = {
    "Aries":       [(6, "Jupiter"), (12, "Venus"), (20, "Mercury"), (25, "Mars"), (30, "Saturn")],
    "Taurus":      [(8, "Venus"), (14, "Mercury"), (22, "Jupiter"), (27, "Saturn"), (30, "Mars")],
    "Gemini":      [(6, "Mercury"), (12, "Jupiter"), (17, "Venus"), (24, "Mars"), (30, "Saturn")],
    "Cancer":      [(7, "Mars"), (13, "Venus"), (19, "Mercury"), (26, "Jupiter"), (30, "Saturn")],
    "Leo":         [(6, "Jupiter"), (11, "Venus"), (18, "Saturn"), (24, "Mercury"), (30, "Mars")],
    "Virgo":       [(7, "Mercury"), (17, "Venus"), (21, "Jupiter"), (28, "Mars"), (30, "Saturn")],
    "Libra":       [(6, "Saturn"), (14, "Venus"), (21, "Jupiter"), (28, "Mercury"), (30, "Mars")],
    "Scorpio":     [(7, "Mars"), (11, "Venus"), (19, "Mercury"), (24, "Jupiter"), (30, "Saturn")],
    "Sagittarius": [(12, "Jupiter"), (17, "Venus"), (21, "Mercury"), (26, "Saturn"), (30, "Mars")],
    "Capricorn":   [(7, "Mercury"), (14, "Jupiter"), (22, "Venus"), (26, "Saturn"), (30, "Mars")],
    "Aquarius":    [(7, "Mercury"), (13, "Venus"), (20, "Jupiter"), (25, "Mars"), (30, "Saturn")],
    "Pisces":      [(12, "Venus"), (16, "Jupiter"), (19, "Mercury"), (28, "Mars"), (30, "Saturn")],
}

# Whole Sign House accidental dignity points (Guido Bonatti / Al-Qabisi)
HOUSE_ACCIDENTAL_POINTS = {
    1: 12, 10: 11, 7: 10, 4: 9, 11: 8, 5: 7, 2: 6, 9: 5, 8: 4, 3: 3, 12: 2, 6: 1
}

def get_sign_and_degree(lon: float) -> Tuple[str, float, int]:
    norm_lon = lon % 360.0
    sign_idx = int(norm_lon // 30)
    deg_in_sign = norm_lon % 30.0
    return SIGNS[sign_idx], deg_in_sign, sign_idx

def get_term_ruler(sign: str, deg_in_sign: float) -> str:
    terms = EGYPTIAN_TERMS.get(sign, [])
    for max_deg, ruler in terms:
        if deg_in_sign < max_deg:
            return ruler
    return terms[-1][1] if terms else "Mercury"

def get_decan_ruler(sign_idx: int, deg_in_sign: float) -> str:
    decan_idx = min(int(deg_in_sign // 10), 2)
    return CHALDEAN_DECANS[sign_idx][decan_idx]

def compute_persian_chart(astro_base: Dict[str, Any], birth_year: int = 1985, birth_time: str = "12:00") -> Dict[str, Any]:
    """
    Computes complete Persian/Arabic horoscopic calculations from astronomical baseline.
    """
    planets = astro_base["planets_tropical"]
    angles = astro_base["angles"]["tropical"]
    asc_lon = angles["ascendant"]
    mc_lon = angles["mc"]

    sun_lon = planets["Sun"]["longitude"]
    moon_lon = planets["Moon"]["longitude"]

    # Sect determination: Sun above horizon (Houses 7-12) vs below (Houses 1-6)
    # Using Whole-sign house of Sun relative to Ascendant
    asc_sign, _, asc_sign_idx = get_sign_and_degree(asc_lon)
    sun_sign, _, sun_sign_idx = get_sign_and_degree(sun_lon)
    sun_house = ((sun_sign_idx - asc_sign_idx) % 12) + 1
    is_day = 7 <= sun_house <= 12

    # 1. Hermetic Arabic Parts (Lots)
    # Lot of Fortune
    if is_day:
        lot_fortune_lon = (asc_lon + moon_lon - sun_lon) % 360.0
        lot_spirit_lon = (asc_lon + sun_lon - moon_lon) % 360.0
    else:
        lot_fortune_lon = (asc_lon + sun_lon - moon_lon) % 360.0
        lot_spirit_lon = (asc_lon + moon_lon - sun_lon) % 360.0

    # Part of Necessity (Material Constraints): Day = Asc + Fortune - Spirit, Night = Asc + Spirit - Fortune
    if is_day:
        lot_necessity_lon = (asc_lon + lot_fortune_lon - lot_spirit_lon) % 360.0
    else:
        lot_necessity_lon = (asc_lon + lot_spirit_lon - lot_fortune_lon) % 360.0

    # Part of Eros (Desire / Amity): Day = Asc + Venus - Spirit, Night = Asc + Spirit - Venus
    venus_lon = planets["Venus"]["longitude"]
    if is_day:
        lot_eros_lon = (asc_lon + venus_lon - lot_spirit_lon) % 360.0
    else:
        lot_eros_lon = (asc_lon + lot_spirit_lon - venus_lon) % 360.0

    # Part of Courage & Victory: Day = Asc + Jupiter - Mars, Night = Asc + Mars - Jupiter
    jup_lon = planets["Jupiter"]["longitude"]
    mars_lon = planets["Mars"]["longitude"]
    if is_day:
        lot_courage_lon = (asc_lon + jup_lon - mars_lon) % 360.0
    else:
        lot_courage_lon = (asc_lon + mars_lon - jup_lon) % 360.0

    # Part of Nemesis (Subterranean Peril / Saturn): Day = Asc + Fortune - Saturn, Night = Asc + Saturn - Fortune
    sat_lon = planets["Saturn"]["longitude"]
    if is_day:
        lot_nemesis_lon = (asc_lon + lot_fortune_lon - sat_lon) % 360.0
    else:
        lot_nemesis_lon = (asc_lon + sat_lon - lot_fortune_lon) % 360.0

    lots_data = {}
    for name, lon in [
        ("Lot of Fortune (Tykhe)", lot_fortune_lon),
        ("Lot of Spirit (Daimon)", lot_spirit_lon),
        ("Lot of Necessity (Ananke)", lot_necessity_lon),
        ("Lot of Eros (Love)", lot_eros_lon),
        ("Lot of Courage (Victory)", lot_courage_lon),
        ("Lot of Nemesis (Peril)", lot_nemesis_lon)
    ]:
        s, d, s_idx = get_sign_and_degree(lon)
        h = ((s_idx - asc_sign_idx) % 12) + 1
        lots_data[name] = {
            "longitude": round(lon, 4),
            "sign": s,
            "degree": round(d, 2),
            "house": h
        }

    # 2. Almuten Figuris Calculation across 5 Hylegical Points
    # 5 Points: Sun, Moon, Ascendant, Part of Fortune, Midheaven
    hyleg_points = [
        ("Sun", sun_lon),
        ("Moon", moon_lon),
        ("Ascendant", asc_lon),
        ("Lot of Fortune", lot_fortune_lon),
        ("Midheaven", mc_lon),
    ]

    scores: Dict[str, int] = {p: 0 for p in TRADITIONAL_PLANETS}
    essential_breakdown: Dict[str, Dict[str, int]] = {p: {"essential": 0, "accidental": 0} for p in TRADITIONAL_PLANETS}

    for pt_name, pt_lon in hyleg_points:
        s_name, s_deg, s_idx = get_sign_and_degree(pt_lon)
        elem = SIGN_ELEMENTS[s_name]

        # Domicile (+5)
        dom_lord = DOMICILE_RULERS[s_name]
        scores[dom_lord] += 5
        essential_breakdown[dom_lord]["essential"] += 5

        # Exaltation (+4)
        exalt_lord = EXALTATION_RULERS.get(s_name)
        if exalt_lord:
            scores[exalt_lord] += 4
            essential_breakdown[exalt_lord]["essential"] += 4

        # Dorothean Triplicity (+3)
        trip_data = DOROTHEAN_TRIPLICITIES[elem]
        trip_lord = trip_data["day"] if is_day else trip_data["night"]
        scores[trip_lord] += 3
        essential_breakdown[trip_lord]["essential"] += 3

        # Term (+2)
        term_lord = get_term_ruler(s_name, s_deg)
        if term_lord in scores:
            scores[term_lord] += 2
            essential_breakdown[term_lord]["essential"] += 2

        # Decan (+1)
        decan_lord = get_decan_ruler(s_idx, s_deg)
        if decan_lord in scores:
            scores[decan_lord] += 1
            essential_breakdown[decan_lord]["essential"] += 1

    # Accidental house scores for candidate planets
    for p in TRADITIONAL_PLANETS:
        p_lon = planets[p]["longitude"]
        _, _, p_s_idx = get_sign_and_degree(p_lon)
        p_house = ((p_s_idx - asc_sign_idx) % 12) + 1
        acc_pts = HOUSE_ACCIDENTAL_POINTS.get(p_house, 0)
        scores[p] += acc_pts
        essential_breakdown[p]["accidental"] += acc_pts

    # Day of week ruler (+7) bonus from Julian Day
    jd = astro_base["jd_ut"]
    day_of_week = int(math.floor(jd + 1.5)) % 7
    # 0 = Sunday (Sun), 1 = Monday (Moon), 2 = Tuesday (Mars), 3 = Wednesday (Mercury),
    # 4 = Thursday (Jupiter), 5 = Friday (Venus), 6 = Saturday (Saturn)
    DAY_RULERS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    day_ruler = DAY_RULERS[day_of_week]
    scores[day_ruler] += 7
    essential_breakdown[day_ruler]["accidental"] += 7

    # Sort planets by Almuten score
    ranked_almutens = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    almuten_figuris = ranked_almutens[0][0]

    # 3. Firdaria (75-year cycle)
    # Diurnal: Sun(10), Venus(8), Mercury(13), Moon(9), Saturn(11), Jupiter(12), Mars(7), NNode(3), SNode(2)
    # Nocturnal: Moon(9), Saturn(11), Jupiter(12), Mars(7), Sun(10), Venus(8), Mercury(13), NNode(3), SNode(2)
    if is_day:
        firdaria_order = [
            ("Sun", 10), ("Venus", 8), ("Mercury", 13), ("Moon", 9),
            ("Saturn", 11), ("Jupiter", 12), ("Mars", 7),
            ("North Node", 3), ("South Node", 2)
        ]
    else:
        firdaria_order = [
            ("Moon", 9), ("Saturn", 11), ("Jupiter", 12), ("Mars", 7),
            ("Sun", 10), ("Venus", 8), ("Mercury", 13),
            ("North Node", 3), ("South Node", 2)
        ]

    firdaria_timeline = []
    current_age = 0
    for planet_name, duration in firdaria_order:
        start_age = current_age
        end_age = current_age + duration
        firdaria_timeline.append({
            "planet": planet_name,
            "duration_years": duration,
            "start_age": start_age,
            "end_age": end_age,
            "start_year": birth_year + start_age,
            "end_year": birth_year + end_age
        })
        current_age = end_age

    # 4. Triplicity Lords of the Sect Light (Lifespan Tripartite Division)
    sect_light = "Sun" if is_day else "Moon"
    sect_light_lon = planets[sect_light]["longitude"]
    sect_light_sign, _, _ = get_sign_and_degree(sect_light_lon)
    sect_elem = SIGN_ELEMENTS[sect_light_sign]
    elem_triplicity = DOROTHEAN_TRIPLICITIES[sect_elem]

    if is_day:
        trip_lords = {
            "first_lord_youth": elem_triplicity["day"],
            "second_lord_maturity": elem_triplicity["night"],
            "third_lord_completion": elem_triplicity["part"]
        }
    else:
        trip_lords = {
            "first_lord_youth": elem_triplicity["night"],
            "second_lord_maturity": elem_triplicity["day"],
            "third_lord_completion": elem_triplicity["part"]
        }

    return {
        "tradition": "Persian & Medieval Arabic (Ilm al-Nujūm)",
        "sect": {
            "is_diurnal": is_day,
            "sect_name": "Diurnal (Day Chart)" if is_day else "Nocturnal (Night Chart)",
            "day_ruler": day_ruler,
            "day_of_week_index": day_of_week
        },
        "almuten_figuris": {
            "victor": almuten_figuris,
            "victor_score": ranked_almutens[0][1],
            "leaderboard": [
                {
                    "planet": p,
                    "total_score": score,
                    "essential_dignity": essential_breakdown[p]["essential"],
                    "accidental_dignity": essential_breakdown[p]["accidental"]
                }
                for p, score in ranked_almutens
            ],
            "archetypal_role": f"Supreme Guide of Character and Intellectual Destiny ({almuten_figuris})"
        },
        "hermetic_lots": lots_data,
        "firdaria": {
            "cycle_total_years": 75,
            "timeline": firdaria_timeline
        },
        "triplicity_lords_of_sect_light": {
            "sect_light": sect_light,
            "sign": sect_light_sign,
            "element": sect_elem,
            "life_chapters": trip_lords
        }
    }
