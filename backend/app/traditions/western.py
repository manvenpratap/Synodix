"""
Hellenistic and Traditional Western Astrology calculation module.
Uses Tropical Zodiac and Whole-Sign Houses.
Computes Sect, 5-fold Essential Dignities (Egyptian bounds, Dorothean triplicity),
Lots of Fortune & Spirit, Aspect Grid with applying/separating orbs, and Annual Profections.
Follows Step 4D of Six-Culture Verified Chart specification.
"""

from typing import Dict, Any, List, Tuple

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

ELEMENTS = {
    "Aries": "Fire", "Taurus": "Earth", "Gemini": "Air", "Cancer": "Water",
    "Leo": "Fire", "Virgo": "Earth", "Libra": "Air", "Scorpio": "Water",
    "Sagittarius": "Fire", "Capricorn": "Earth", "Aquarius": "Air", "Pisces": "Water"
}

DOMICILE = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

EXALTATION = {
    "Sun": "Aries", "Moon": "Taurus", "Mercury": "Virgo", "Venus": "Pisces",
    "Mars": "Capricorn", "Jupiter": "Cancer", "Saturn": "Libra"
}

FALL = {
    "Sun": "Libra", "Moon": "Scorpio", "Mercury": "Pisces", "Venus": "Virgo",
    "Mars": "Cancer", "Jupiter": "Capricorn", "Saturn": "Aries"
}

DETRIMENT = {
    "Sun": "Aquarius", "Moon": "Capricorn", "Mercury": ["Sagittarius", "Pisces"],
    "Venus": ["Aries", "Scorpio"], "Mars": ["Taurus", "Libra"],
    "Jupiter": ["Gemini", "Virgo"], "Saturn": ["Cancer", "Leo"]
}

# Dorothean Triplicity Rulers: (Day Ruler, Night Ruler, Participating Ruler)
DOROTHEAN_TRIPLICITIES = {
    "Fire":  ("Sun", "Jupiter", "Saturn"),
    "Earth": ("Venus", "Moon", "Mars"),
    "Air":   ("Saturn", "Mercury", "Jupiter"),
    "Water": ("Venus", "Mars", "Moon"),
}

# Egyptian Bounds (Sign: list of (limit_degree, planet))
EGYPTIAN_BOUNDS = {
    "Aries":       [(6, "Jupiter"), (12, "Venus"), (20, "Mercury"), (25, "Mars"), (30, "Saturn")],
    "Taurus":      [(8, "Venus"), (14, "Mercury"), (22, "Jupiter"), (27, "Saturn"), (30, "Mars")],
    "Gemini":      [(6, "Mercury"), (12, "Jupiter"), (17, "Venus"), (24, "Mars"), (30, "Saturn")],
    "Cancer":      [(7, "Mars"), (13, "Venus"), (19, "Mercury"), (26, "Jupiter"), (30, "Saturn")],
    "Leo":         [(6, "Jupiter"), (11, "Venus"), (18, "Saturn"), (24, "Mercury"), (30, "Mars")],
    "Virgo":       [(7, "Mercury"), (17, "Venus"), (21, "Jupiter"), (28, "Mars"), (30, "Saturn")],
    "Libra":       [(6, "Saturn"), (14, "Mercury"), (21, "Jupiter"), (28, "Venus"), (30, "Mars")],
    "Scorpio":     [(7, "Mars"), (11, "Venus"), (19, "Mercury"), (24, "Jupiter"), (30, "Saturn")],
    "Sagittarius": [(12, "Jupiter"), (17, "Venus"), (21, "Mercury"), (26, "Saturn"), (30, "Mars")],
    "Capricorn":   [(7, "Mercury"), (14, "Jupiter"), (22, "Venus"), (26, "Saturn"), (30, "Mars")],
    "Aquarius":    [(7, "Mercury"), (13, "Venus"), (20, "Jupiter"), (25, "Mars"), (30, "Saturn")],
    "Pisces":      [(12, "Venus"), (16, "Jupiter"), (19, "Mercury"), (28, "Mars"), (30, "Saturn")],
}

# Chaldean Decans/Faces (10-degree segments)
CHALDEAN_DECANS = {
    "Aries":       ["Mars", "Sun", "Venus"],
    "Taurus":      ["Mercury", "Moon", "Saturn"],
    "Gemini":      ["Jupiter", "Mars", "Sun"],
    "Cancer":      ["Venus", "Mercury", "Moon"],
    "Leo":         ["Saturn", "Jupiter", "Mars"],
    "Virgo":       ["Sun", "Venus", "Mercury"],
    "Libra":       ["Moon", "Saturn", "Jupiter"],
    "Scorpio":     ["Mars", "Sun", "Venus"],
    "Sagittarius": ["Mercury", "Moon", "Saturn"],
    "Capricorn":   ["Jupiter", "Mars", "Sun"],
    "Aquarius":    ["Venus", "Mercury", "Moon"],
    "Pisces":      ["Saturn", "Jupiter", "Mars"],
}

MAJOR_ASPECTS = [
    ("Conjunction", 0, 8.0),
    ("Sextile", 60, 6.0),
    ("Square", 90, 7.0),
    ("Trine", 120, 8.0),
    ("Opposition", 180, 8.0),
]

MINOR_ASPECTS = [
    ("Semi-Sextile", 30, 2.0),
    ("Quincunx", 150, 3.0),
    ("Semi-Square", 45, 2.0),
    ("Sesquiquadrate", 135, 2.0),
]

def get_bound_ruler(sign: str, deg_in_sign: float) -> str:
    bounds = EGYPTIAN_BOUNDS.get(sign, [])
    for limit, planet in bounds:
        if deg_in_sign < limit:
            return planet
    return bounds[-1][1] if bounds else "Unknown"

def get_decan_ruler(sign: str, deg_in_sign: float) -> str:
    decans = CHALDEAN_DECANS.get(sign, [])
    idx = min(int(deg_in_sign // 10), 2)
    return decans[idx] if decans else "Unknown"

def compute_essential_dignity(planet: str, sign: str, deg_in_sign: float, is_day_chart: bool) -> Dict[str, Any]:
    score = 0
    breakdown = []
    
    # 1. Domicile (+5)
    if DOMICILE.get(sign) == planet:
        score += 5
        breakdown.append("Domicile (+5)")
    # 2. Exaltation (+4)
    if EXALTATION.get(planet) == sign:
        score += 4
        breakdown.append("Exaltation (+4)")
    # 3. Triplicity (+3)
    elem = ELEMENTS[sign]
    tri_rulers = DOROTHEAN_TRIPLICITIES[elem]
    active_tri_ruler = tri_rulers[0] if is_day_chart else tri_rulers[1]
    if planet == active_tri_ruler:
        score += 3
        breakdown.append(f"Triplicity (+3, {'Day' if is_day_chart else 'Night'})")
    elif planet == tri_rulers[2]:
        score += 1
        breakdown.append("Triplicity Participating (+1)")
    # 4. Bounds (+2)
    bound_r = get_bound_ruler(sign, deg_in_sign)
    if planet == bound_r:
        score += 2
        breakdown.append(f"Bounds/Terms (+2, Egyptian)")
    # 5. Face/Decan (+1)
    decan_r = get_decan_ruler(sign, deg_in_sign)
    if planet == decan_r:
        score += 1
        breakdown.append(f"Face/Decan (+1, Chaldean)")
    # Detriment (-5)
    det = DETRIMENT.get(planet, [])
    if isinstance(det, str) and det == sign or (isinstance(det, list) and sign in det):
        score -= 5
        breakdown.append("Detriment (-5)")
    # Fall (-4)
    if FALL.get(planet) == sign:
        score -= 4
        breakdown.append("Fall (-4)")

    return {
        "score": score,
        "breakdown": breakdown,
        "bound_ruler": bound_r,
        "decan_ruler": decan_r,
    }

def angular_diff(lon1: float, lon2: float) -> float:
    diff = abs(lon1 - lon2) % 360.0
    return 360.0 - diff if diff > 180.0 else diff

def compute_aspect_list(planets_tropical: Dict[str, Any], bodies: List[str], aspect_definitions: List[Tuple[str, int, float]], category: str) -> List[Dict[str, Any]]:
    results = []
    dt = 0.01  # 0.01 day projection for dynamic applying/separating determination
    
    for i in range(len(bodies)):
        for j in range(i + 1, len(bodies)):
            p1 = bodies[i]
            p2 = bodies[j]
            if p1 not in planets_tropical or p2 not in planets_tropical:
                continue
                
            lon1 = planets_tropical[p1]["longitude"]
            lon2 = planets_tropical[p2]["longitude"]
            speed1 = planets_tropical[p1].get("speed", 0.0)
            speed2 = planets_tropical[p2].get("speed", 0.0)
            
            curr_diff = angular_diff(lon1, lon2)
            
            for asp_name, asp_deg, max_orb in aspect_definitions:
                curr_orb = abs(curr_diff - asp_deg)
                if curr_orb <= max_orb:
                    # Precise applying/separating calculation:
                    # Project positions forward by dt days using actual daily motion
                    fut_lon1 = (lon1 + speed1 * dt) % 360.0
                    fut_lon2 = (lon2 + speed2 * dt) % 360.0
                    fut_diff = angular_diff(fut_lon1, fut_lon2)
                    fut_orb = abs(fut_diff - asp_deg)
                    
                    if abs(fut_orb - curr_orb) < 1e-6:
                        status = "Stationary / Exact"
                    elif fut_orb < curr_orb:
                        status = "Applying"
                    else:
                        status = "Separating"
                    
                    results.append({
                        "planet_1": p1,
                        "planet_2": p2,
                        "aspect": asp_name,
                        "category": category,
                        "angle_deg": asp_deg,
                        "exact_orb_deg": round(curr_orb, 3),
                        "status": status
                    })
    return results

def compute_aspects(planets_tropical: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    # Include traditional 7 and modern outer planets
    all_bodies = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
    major = compute_aspect_list(planets_tropical, all_bodies, MAJOR_ASPECTS, "major")
    minor = compute_aspect_list(planets_tropical, all_bodies, MINOR_ASPECTS, "minor")
    return major, minor

def compute_antiscia(planets_tropical: Dict[str, Any], orb_limit: float = 2.0) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    bodies = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
    antiscia_pairs = []
    contra_pairs = []
    
    for i in range(len(bodies)):
        for j in range(i + 1, len(bodies)):
            p1, p2 = bodies[i], bodies[j]
            if p1 not in planets_tropical or p2 not in planets_tropical:
                continue
            lon1 = planets_tropical[p1]["longitude"]
            lon2 = planets_tropical[p2]["longitude"]
            
            # Antiscia: reflection across Cancer/Capricorn axis (180 - lon) % 360
            p1_ant = (180.0 - lon1) % 360.0
            diff_ant = angular_diff(p1_ant, lon2)
            if diff_ant <= orb_limit:
                antiscia_pairs.append({
                    "planet_1": p1,
                    "planet_2": p2,
                    "orb_deg": round(diff_ant, 3),
                    "type": "Antiscia (Solstitial Reflection)"
                })
                
            # Contra-antiscia: reflection across Aries/Libra axis (360 - lon) % 360
            p1_contra = (360.0 - lon1) % 360.0
            diff_contra = angular_diff(p1_contra, lon2)
            if diff_contra <= orb_limit:
                contra_pairs.append({
                    "planet_1": p1,
                    "planet_2": p2,
                    "orb_deg": round(diff_contra, 3),
                    "type": "Contra-Antiscia (Equinoctial Reflection)"
                })
                
    return antiscia_pairs, contra_pairs

def compute_mutual_receptions(planets_tropical: Dict[str, Any]) -> List[Dict[str, Any]]:
    traditional_7 = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"]
    receptions = []
    for i in range(len(traditional_7)):
        for j in range(i + 1, len(traditional_7)):
            p1, p2 = traditional_7[i], traditional_7[j]
            if p1 not in planets_tropical or p2 not in planets_tropical:
                continue
            sign1 = planets_tropical[p1]["sign"]
            sign2 = planets_tropical[p2]["sign"]
            ruler1 = DOMICILE.get(sign1)
            ruler2 = DOMICILE.get(sign2)
            if ruler1 == p2 and ruler2 == p1:
                receptions.append({
                    "planet_1": p1,
                    "sign_1": sign1,
                    "planet_2": p2,
                    "sign_2": sign2,
                    "type": "Mutual Reception by Domicile"
                })
    return receptions

def compute_western_chart(
    astronomical_base: Dict[str, Any],
    current_age: int = 35,
    has_birth_time: bool = True
) -> Dict[str, Any]:
    angles = astronomical_base["angles"]["tropical"]
    planets_trop = astronomical_base["planets_tropical"]
    
    asc_deg = angles["ascendant"] if has_birth_time else 0.0
    asc_sign_idx = int(asc_deg // 30) if has_birth_time else 0
    asc_sign = SIGNS[asc_sign_idx]

    # Sect determination: Sun in houses 7..12 = Day; houses 1..6 = Night
    sun_lon = planets_trop["Sun"]["longitude"]
    sun_sign_idx = int(sun_lon // 30)
    sun_house = (((sun_sign_idx - asc_sign_idx) % 12) + 1) if has_birth_time else 1
    is_day_chart = (sun_house in [7, 8, 9, 10, 11, 12]) if has_birth_time else True

    # Decorate planets with whole-sign house, sect team, and essential dignity
    sect_benefic = "Jupiter" if is_day_chart else "Venus"
    sect_malefic = "Saturn" if is_day_chart else "Mars"
    out_of_sect_malefic = "Mars" if is_day_chart else "Saturn"

    traditional_7 = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"]
    decorated_planets = {}
    
    for name, p in planets_trop.items():
        h = (((p["sign_index"] - asc_sign_idx) % 12) + 1) if has_birth_time else None
        dignity_info = compute_essential_dignity(name, p["sign"], p["degree_in_sign"], is_day_chart) if name in traditional_7 else {"score": 0, "breakdown": []}
        
        # Angularity
        angularity = "Cadent"
        if h in [1, 4, 7, 10]: angularity = "Angular"
        elif h in [2, 5, 8, 11]: angularity = "Succedent"

        decorated_planets[name] = {
            **p,
            "house": h,
            "angularity": angularity if has_birth_time else None,
            "dignity_score": dignity_info["score"],
            "dignity_breakdown": dignity_info["breakdown"],
            "is_traditional": name in traditional_7
        }

    # Hellenistic Lots (Lot of Fortune & Lot of Spirit)
    # Day Fortune: Asc + Moon - Sun; Night: Asc + Sun - Moon
    # Day Spirit: Asc + Sun - Moon; Night: Asc + Moon - Sun
    moon_lon = planets_trop["Moon"]["longitude"]
    if has_birth_time:
        if is_day_chart:
            fortune_lon = (asc_deg + moon_lon - sun_lon) % 360.0
            spirit_lon = (asc_deg + sun_lon - moon_lon) % 360.0
        else:
            fortune_lon = (asc_deg + sun_lon - moon_lon) % 360.0
            spirit_lon = (asc_deg + moon_lon - sun_lon) % 360.0
        
        f_sign_idx = int(fortune_lon // 30)
        s_sign_idx = int(spirit_lon // 30)
        lot_of_fortune = {
            "longitude": round(fortune_lon, 4),
            "sign": SIGNS[f_sign_idx],
            "degree": round(fortune_lon % 30, 2),
            "house": (((f_sign_idx - asc_sign_idx) % 12) + 1)
        }
        lot_of_spirit = {
            "longitude": round(spirit_lon, 4),
            "sign": SIGNS[s_sign_idx],
            "degree": round(spirit_lon % 30, 2),
            "house": (((s_sign_idx - asc_sign_idx) % 12) + 1)
        }
    else:
        lot_of_fortune = None
        lot_of_spirit = None

    # Annual Profections
    profection_house = ((current_age % 12) + 1) if has_birth_time else 1
    profection_sign_idx = (asc_sign_idx + profection_house - 1) % 12
    profection_sign = SIGNS[profection_sign_idx]
    lord_of_year = DOMICILE[profection_sign]

    # Aspects (Major & Minor)
    major_aspects, minor_aspects = compute_aspects(planets_trop)
    antiscia_pairs, contra_antiscia_pairs = compute_antiscia(planets_trop)
    mutual_receptions = compute_mutual_receptions(planets_trop)

    # Whole sign houses
    houses = []
    for h in range(1, 13):
        s_idx = (asc_sign_idx + h - 1) % 12
        s_name = SIGNS[s_idx]
        occupants = [p for p, d in decorated_planets.items() if d["house"] == h]
        houses.append({
            "house_number": h,
            "sign": s_name,
            "ruler": DOMICILE[s_name],
            "occupants": occupants
        })

    return {
        "tradition": "Hellenistic / Traditional Western",
        "zodiac": "Tropical",
        "house_system": "Whole Sign",
        "sect": {
            "is_day_chart": is_day_chart,
            "label": "Day Chart" if is_day_chart else "Night Chart",
            "sect_benefic": sect_benefic,
            "sect_malefic": sect_malefic,
            "out_of_sect_malefic": out_of_sect_malefic
        },
        "ascendant": {
            "sign": asc_sign,
            "degree": round(angles["ascendant_degree"], 2) if has_birth_time else 0.0,
            "longitude": round(asc_deg, 4) if has_birth_time else 0.0,
        },
        "planets": decorated_planets,
        "aspects": major_aspects,
        "minor_aspects": minor_aspects,
        "antiscia_pairs": antiscia_pairs,
        "contra_antiscia_pairs": contra_antiscia_pairs,
        "mutual_receptions": mutual_receptions,
        "lots": {
            "lot_of_fortune": lot_of_fortune,
            "lot_of_spirit": lot_of_spirit,
        },
        "annual_profection": {
            "current_age": current_age,
            "activated_house": profection_house,
            "activated_sign": profection_sign,
            "lord_of_year": lord_of_year,
            "natal_condition_of_lord": decorated_planets.get(lord_of_year, {}).get("dignity_breakdown", [])
        },
        "houses": houses
    }
