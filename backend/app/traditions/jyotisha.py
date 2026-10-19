"""
Jyotisha (Vedic Astrology) deterministic calculation module.
Computes D1 Rashi, Nakshatras & Padas, D9 Navamsha, D10 Dashamsha,
Vimshottari Dasha timeline, and declared Classical Yogas whitelist.
Follows Step 4B of Six-Culture Verified Chart specification.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta

NAKSHATRAS = [
    ("Ashwini", "Ketu", 7),
    ("Bharani", "Venus", 20),
    ("Krittika", "Sun", 6),
    ("Rohini", "Moon", 10),
    ("Mrigashira", "Mars", 7),
    ("Ardra", "Rahu", 18),
    ("Punarvasu", "Jupiter", 16),
    ("Pushya", "Saturn", 19),
    ("Ashlesha", "Mercury", 17),
    ("Magha", "Ketu", 7),
    ("Purva Phalguni", "Venus", 20),
    ("Uttara Phalguni", "Sun", 6),
    ("Hasta", "Moon", 10),
    ("Chitra", "Mars", 7),
    ("Swati", "Rahu", 18),
    ("Vishakha", "Jupiter", 16),
    ("Anuradha", "Saturn", 19),
    ("Jyeshtha", "Mercury", 17),
    ("Mula", "Ketu", 7),
    ("Purva Ashadha", "Venus", 20),
    ("Uttara Ashadha", "Sun", 6),
    ("Shravana", "Moon", 10),
    ("Dhanishta", "Mars", 7),
    ("Shatabhisha", "Rahu", 18),
    ("Purva Bhadrapada", "Jupiter", 16),
    ("Uttara Bhadrapada", "Saturn", 19),
    ("Revati", "Mercury", 17),
]

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

EXALTATION = {
    "Sun": ("Aries", 10.0),
    "Moon": ("Taurus", 3.0),
    "Mars": ("Capricorn", 28.0),
    "Mercury": ("Virgo", 15.0),
    "Jupiter": ("Cancer", 5.0),
    "Venus": ("Pisces", 27.0),
    "Saturn": ("Libra", 20.0),
    "Rahu": ("Taurus", 20.0),
    "Ketu": ("Scorpio", 20.0),
}

DEBILITATION = {
    "Sun": "Libra", "Moon": "Scorpio", "Mars": "Cancer", "Mercury": "Pisces",
    "Jupiter": "Capricorn", "Venus": "Virgo", "Saturn": "Aries",
    "Rahu": "Scorpio", "Ketu": "Taurus"
}

OWN_SIGNS = {
    "Sun": ["Leo"],
    "Moon": ["Cancer"],
    "Mars": ["Aries", "Scorpio"],
    "Mercury": ["Gemini", "Virgo"],
    "Jupiter": ["Sagittarius", "Pisces"],
    "Venus": ["Taurus", "Libra"],
    "Saturn": ["Capricorn", "Aquarius"],
    "Rahu": ["Aquarius"],
    "Ketu": ["Scorpio"],
}

def get_nakshatra_pada(lon: float) -> Dict[str, Any]:
    """Calculates nakshatra (0..26), pada (1..4), and remaining fraction"""
    lon = lon % 360.0
    span = 360.0 / 27.0  # 13.333333 degrees
    nak_idx = int(lon // span)
    rem_deg = lon % span
    pada_span = span / 4.0  # 3.333333 degrees
    pada = int(rem_deg // pada_span) + 1
    fraction_elapsed = rem_deg / span
    fraction_remaining = 1.0 - fraction_elapsed
    
    name, lord, years = NAKSHATRAS[nak_idx]
    return {
        "index": nak_idx + 1,
        "name": name,
        "lord": lord,
        "pada": pada,
        "degrees_in_nakshatra": round(rem_deg, 4),
        "fraction_elapsed": fraction_elapsed,
        "fraction_remaining": fraction_remaining,
        "dasha_years": years
    }

def get_navamsha_sign(lon: float) -> str:
    """Calculates D9 Navamsha sign for a sidereal longitude"""
    lon = lon % 360.0
    sign_idx = int(lon // 30)
    deg_in_sign = lon % 30.0
    pada_in_sign = int(deg_in_sign // (30.0 / 9.0))  # 0..8
    
    # Starting sign for navamsha calculation based on element
    # Fire (Aries, Leo, Sag) -> starts from Aries (0)
    # Earth (Taurus, Virgo, Cap) -> starts from Cap (9)
    # Air (Gemini, Libra, Aqua) -> starts from Libra (6)
    # Water (Cancer, Scorpio, Pisces) -> starts from Cancer (3)
    element_starts = [0, 9, 6, 3]  # Fire, Earth, Air, Water
    start_sign = element_starts[sign_idx % 4]
    target_sign_idx = (start_sign + pada_in_sign) % 12
    return SIGNS[target_sign_idx]

def get_dashamsha_sign(lon: float) -> str:
    """Calculates D10 Dashamsha sign for a sidereal longitude"""
    lon = lon % 360.0
    sign_idx = int(lon // 30)
    deg_in_sign = lon % 30.0
    part = int(deg_in_sign // 3.0)  # 0..9
    
    # Odd signs start from same sign; even signs start from 9th from sign
    if sign_idx % 2 == 0:  # Odd sign (Aries = 0, Gemini = 2)
        target_idx = (sign_idx + part) % 12
    else:  # Even sign (Taurus = 1, Cancer = 3)
        target_idx = (sign_idx + 8 + part) % 12
    return SIGNS[target_idx]

def get_dignity(planet: str, sign: str) -> str:
    """Determines basic Parashari dignity in D1 sign"""
    if planet in EXALTATION and EXALTATION[planet][0] == sign:
        return "Exalted"
    if planet in DEBILITATION and DEBILITATION[planet] == sign:
        return "Debilitated"
    if planet in OWN_SIGNS and sign in OWN_SIGNS[planet]:
        return "Own Sign"
    return "Neutral"

def compute_vimshottari_dasha(moon_nakshatra_info: Dict[str, Any], birth_dt: datetime) -> List[Dict[str, Any]]:
    """Computes Vimshottari Mahadashas for 120-year cycle starting from birth"""
    start_nak_idx = moon_nakshatra_info["index"] - 1
    # 9 dasha lords sequence starting from birth nakshatra lord
    cycle = [
        ("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10),
        ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19), ("Mercury", 17)
    ]
    # Find matching index in cycle
    start_lord = moon_nakshatra_info["lord"]
    lord_idx = next(i for i, (l, _) in enumerate(cycle) if l == start_lord)
    
    # First Mahadasha has balance of years
    balance_years = moon_nakshatra_info["fraction_remaining"] * cycle[lord_idx][1]
    
    dashas = []
    curr_start = birth_dt
    
    for i in range(9):
        idx = (lord_idx + i) % 9
        lord_name, total_years = cycle[idx]
        actual_years = balance_years if i == 0 else total_years
        
        # Approximate days using 365.2425 days per solar year
        days = actual_years * 365.2425
        curr_end = curr_start + timedelta(days=days)
        
        # Sub-periods (Antardashas)
        antardashas = []
        sub_curr_start = curr_start
        for j in range(9):
            sub_idx = (idx + j) % 9
            sub_lord, sub_total_years = cycle[sub_idx]
            # Formula: (Maha years * Antar years) / 120
            antar_fraction = sub_total_years / 120.0
            antar_days = actual_years * antar_fraction * 365.2425
            sub_curr_end = sub_curr_start + timedelta(days=antar_days)
            antardashas.append({
                "sub_lord": sub_lord,
                "start_date": sub_curr_start.strftime("%Y-%m-%d"),
                "end_date": sub_curr_end.strftime("%Y-%m-%d"),
            })
            sub_curr_start = sub_curr_end

        dashas.append({
            "lord": lord_name,
            "total_span_years": round(actual_years, 2),
            "start_date": curr_start.strftime("%Y-%m-%d"),
            "end_date": curr_end.strftime("%Y-%m-%d"),
            "antardashas": antardashas
        })
        curr_start = curr_end
        
    return dashas

def check_classical_yogas(lagna_sign_idx: int, planets: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Evaluates classical Parashari yoga whitelist"""
    yogas = []
    
    # Helper to get whole-sign house of planet (1..12)
    def house_of(p_name: str) -> int:
        if p_name not in planets: return -1
        p_sign_idx = planets[p_name]["sign_index"]
        return ((p_sign_idx - lagna_sign_idx) % 12) + 1

    # 1. Gaja Kesari Yoga: Jupiter in Kendra (1, 4, 7, 10) from Moon
    if "Moon" in planets and "Jupiter" in planets:
        m_house = house_of("Moon")
        j_house = house_of("Jupiter")
        dist = ((j_house - m_house) % 12) + 1
        if dist in [1, 4, 7, 10]:
            yogas.append({
                "name": "Gaja Kesari Yoga",
                "category": "Auspicious Wisdom & Reputation",
                "rule": "Jupiter is in a Kendra (angular house) from Moon",
                "involved_planets": ["Jupiter", "Moon"],
                "polarity": "Positive"
            })

    # 2. Budhaditya Yoga: Sun and Mercury conjunct in same sign
    if "Sun" in planets and "Mercury" in planets:
        if planets["Sun"]["sign_index"] == planets["Mercury"]["sign_index"]:
            diff = abs(planets["Sun"]["longitude"] - planets["Mercury"]["longitude"])
            if diff < 12.0:  # Valid without severe combustion extinction
                yogas.append({
                    "name": "Budhaditya Yoga",
                    "category": "Intellect & Administrative Skill",
                    "rule": "Sun and Mercury occupy the same sidereal sign",
                    "involved_planets": ["Sun", "Mercury"],
                    "polarity": "Positive"
                })

    # 3. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Kendra + Exalted or Own Sign)
    kendras = [1, 4, 7, 10]
    maha_checks = [
        ("Mars", "Ruchaka Yoga", "Courage, leadership, and athletic vigor"),
        ("Mercury", "Bhadra Yoga", "High intellect, eloquence, and trade acuity"),
        ("Jupiter", "Hamsa Yoga", "Spiritual wisdom, ethics, and revered character"),
        ("Venus", "Malavya Yoga", "Artistic refinement, beauty, luxury, and charm"),
        ("Saturn", "Sasa Yoga", "Authority over institutions, perseverance, and discipline"),
    ]
    for p_name, yoga_name, desc in maha_checks:
        if p_name in planets:
            h = house_of(p_name)
            dignity = planets[p_name]["dignity"]
            if h in kendras and dignity in ["Exalted", "Own Sign"]:
                yogas.append({
                    "name": yoga_name,
                    "category": "Pancha Mahapurusha (Noble Leader)",
                    "rule": f"{p_name} is in Kendra house {h} in {dignity}",
                    "involved_planets": [p_name],
                    "polarity": "Strongly Positive"
                })

    # 4. Viparita Raja Yoga (6th, 8th, or 12th lord occupying another dusthana 6, 8, 12)
    # Check 6th lord
    house_lords = {}
    for h in range(1, 13):
        s_idx = (lagna_sign_idx + h - 1) % 12
        s_name = SIGNS[s_idx]
        house_lords[h] = SIGN_LORDS[s_name]

    dusthanas = [6, 8, 12]
    vry_occurrences = []
    for d in dusthanas:
        lord = house_lords[d]
        l_house = house_of(lord)
        if l_house in dusthanas:
            vry_occurrences.append(f"Lord of {d} ({lord}) in house {l_house}")

    if vry_occurrences:
        yogas.append({
            "name": "Viparita Raja Yoga",
            "category": "Triumph Over Adversity",
            "rule": "; ".join(vry_occurrences),
            "involved_planets": list(set(house_lords[d] for d in dusthanas)),
            "polarity": "Mixed / Protective"
        })

    return yogas

def compute_jyotisha_chart(
    astronomical_base: Dict[str, Any],
    birth_dt: datetime,
    has_birth_time: bool = True
) -> Dict[str, Any]:
    angles = astronomical_base["angles"]["sidereal"]
    planets_sidereal = astronomical_base["planets_sidereal"]
    
    lagna_sign_idx = int(angles["ascendant"] // 30) if has_birth_time else 0
    lagna_sign = SIGNS[lagna_sign_idx]

    # Decorate planets with whole sign house, nakshatra, navamsha, dashamsha, dignity
    decorated_grahas = {}
    for name, p in planets_sidereal.items():
        nak_info = get_nakshatra_pada(p["longitude"])
        nav_sign = get_navamsha_sign(p["longitude"])
        dash_sign = get_dashamsha_sign(p["longitude"])
        dignity = get_dignity(name, p["sign"])
        
        house_num = (((p["sign_index"] - lagna_sign_idx) % 12) + 1) if has_birth_time else None
        
        # Combustion check: within 8.5 degrees of Sun (except Rahu/Ketu)
        is_combust = False
        if name not in ["Sun", "Rahu", "Ketu"] and "Sun" in planets_sidereal:
            sun_lon = planets_sidereal["Sun"]["longitude"]
            diff = abs(p["longitude"] - sun_lon)
            if diff > 180: diff = 360 - diff
            is_combust = diff < 8.5

        decorated_grahas[name] = {
            **p,
            "house": house_num,
            "dignity": dignity,
            "is_combust": is_combust,
            "nakshatra": nak_info,
            "navamsha_sign": nav_sign,
            "dashamsha_sign": dash_sign
        }

    # Ascendant nakshatra
    lagna_nak = get_nakshatra_pada(angles["ascendant"]) if has_birth_time else None
    lagna_navamsha = get_navamsha_sign(angles["ascendant"]) if has_birth_time else None

    # Vimshottari Dasha from Moon
    moon_nak = decorated_grahas["Moon"]["nakshatra"]
    vimshottari_timeline = compute_vimshottari_dasha(moon_nak, birth_dt)

    # Classical yogas
    yogas = check_classical_yogas(lagna_sign_idx, decorated_grahas) if has_birth_time else []

    # 12 Whole-sign houses
    houses_data = []
    for h in range(1, 13):
        s_idx = (lagna_sign_idx + h - 1) % 12
        s_name = SIGNS[s_idx]
        lord = SIGN_LORDS[s_name]
        occupants = [g for g, d in decorated_grahas.items() if d["house"] == h]
        houses_data.append({
            "house_number": h,
            "sign": s_name,
            "sign_lord": lord,
            "occupants": occupants
        })

    return {
        "tradition": "Jyotisha (Parashari)",
        "zodiac": "Sidereal (Lahiri / Chitra Paksha)",
        "house_system": "Whole Sign",
        "lagna": {
            "sign": lagna_sign,
            "degree": angles["ascendant_degree"] if has_birth_time else 0.0,
            "longitude": angles["ascendant"] if has_birth_time else 0.0,
            "nakshatra": lagna_nak,
            "navamsha_sign": lagna_navamsha
        },
        "grahas": decorated_grahas,
        "houses": houses_data,
        "vimshottari_dashas": vimshottari_timeline,
        "active_mahadasha": vimshottari_timeline[0]["lord"] if vimshottari_timeline else None,
        "yogas": yogas,
        "invariants": {
            "vimshottari_full_cycle_years": 120,
            "rahu_ketu_separation_deg": round(abs(decorated_grahas["Rahu"]["longitude"] - decorated_grahas["Ketu"]["longitude"]), 4)
        }
    }
