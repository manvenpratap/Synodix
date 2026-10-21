"""
Ancient Egyptian Astronomy and Decanic Astrology (Hermetic & Temple Traditions).
Computes:
1. Temporal Planetary Hours (12 Watches of the Day and 12 Watches of the Night).
2. Personal Chronocrator (Ruling Planet of the Hour of Birth).
3. The 36 Egyptian Decans (Bakhtiu / Star Deities of Ra's Celestial Barque).
4. Sothic Civil Seasons (Akhet, Peret, Shemu) & 5 Sacred Epagomenal Days (Heru Renpet).
"""

from typing import Dict, Any, Tuple
import math

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# Chaldean planetary hour sequence
CHALDEAN_ORDER = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"]

# Day of week first hour rulers:
# Sunday=Sun, Monday=Moon, Tuesday=Mars, Wednesday=Mercury, Thursday=Jupiter, Friday=Venus, Saturday=Saturn
DAY_FIRST_HOUR_RULERS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]

# The 36 Ancient Egyptian Decans (Bakhtiu) from Temple of Hathor (Dendera) and Tomb of Senenmut
EGYPTIAN_DECANS_36 = [
    # Aries
    {"name": "Kenmet", "deity": "Kenmet (The Cloaked Flame)", "hieroglyph_meaning": "Double serpent / primal fire of Aries"},
    {"name": "Tepy-a Kenmet", "deity": "Foremost of Kenmet", "hieroglyph_meaning": "The leading crown of fire"},
    {"name": "Hery-ab Wia", "deity": "Horus in the Sacred Barque", "hieroglyph_meaning": "Lord of the solar helm"},
    # Taurus
    {"name": "Chnoumis", "deity": "Khnum (The Divine Potter)", "hieroglyph_meaning": "Molding physical reality and craft"},
    {"name": "Charchnoumis", "deity": "Ka of Khnum", "hieroglyph_meaning": "The enduring vessel of vital breath"},
    {"name": "Ha-tjat", "deity": "Hathor-Sekhmet", "hieroglyph_meaning": "Abundance, sensual rhythm, and material grounding"},
    # Gemini
    {"name": "Sahu-Tep", "deity": "Orion (Sahu / The Striding Hunter)", "hieroglyph_meaning": "The celestial architect crossing heaven"},
    {"name": "Sahu-Kher", "deity": "The Belt of Orion", "hieroglyph_meaning": "The triple bridge of cosmic transmission"},
    {"name": "A-Seped", "deity": "The Piercing Arrow", "hieroglyph_meaning": "Acute discernment, dialectic agility"},
    # Cancer
    {"name": "Sopdet (Sothis)", "deity": "Isis-Sopdet (Sirius / The Inundator)", "hieroglyph_meaning": "Mother of the Nile Flood and golden dawn"},
    {"name": "Sit-Sopdet", "deity": "The Daughter of Sirius", "hieroglyph_meaning": "Nourishing waters and ancestral memory"},
    {"name": "Khnemu-Per", "deity": "Khnum of the Sacred Pool", "hieroglyph_meaning": "Sanctuary, protective maternal shell"},
    # Leo
    {"name": "Ma-a-kheru", "deity": "The Victorious Lion", "hieroglyph_meaning": "Sovereignty of speech and solar command"},
    {"name": "Kenm-Tepy", "deity": "The Royal Cobra (Uraeus)", "hieroglyph_meaning": "Protective illumination on Pharaoh's brow"},
    {"name": "Ha-Setep", "deity": "Sekhmet the Radiant Fire", "hieroglyph_meaning": "Unstoppable creative radiance and dignity"},
    # Virgo
    {"name": "Wep-Wawat", "deity": "Opener of the Ways", "hieroglyph_meaning": "Analytical precision and methodical pathfinding"},
    {"name": "Kher-Khenmet", "deity": "The Scribe of Ma'at", "hieroglyph_meaning": "Measurement, exact harvest, sacred proportions"},
    {"name": "Smat", "deity": "The Divine Balance", "hieroglyph_meaning": "Purity of intention and forensic sorting"},
    # Libra
    {"name": "Ptah-Neb-Ankh", "deity": "Ptah (Master of Form)", "hieroglyph_meaning": "Harmonious balance, architecture, law"},
    {"name": "Tepy-a Kher", "deity": "The Dual Feather of Ma'at", "hieroglyph_meaning": "Reciprocal equity and social equilibrium"},
    {"name": "Kheri-Per", "deity": "Anubis the Justiciar", "hieroglyph_meaning": "The weighing of the heart in balance"},
    # Scorpio
    {"name": "Serqet", "deity": "Serqet (The Scorpion Goddess)", "hieroglyph_meaning": "Transmutation of poison into medicine"},
    {"name": "Shetu", "deity": "The Coiled Serpent", "hieroglyph_meaning": "Intense occult regeneration and resolve"},
    {"name": "Kher-Serqet", "deity": "The Sacred Stinger", "hieroglyph_meaning": "Uncompromising defense of hidden truth"},
    # Sagittarius
    {"name": "Neith-Satet", "deity": "Neith (The Primordial Weaver-Archer)", "hieroglyph_meaning": "The drawn bow aiming at transcendent horizons"},
    {"name": "Kher-Satet", "deity": "The Golden Arrowhead", "hieroglyph_meaning": "Philosophical exploration and relentless quest"},
    {"name": "Hery-Wia", "deity": "Horus the Far-Striding", "hieroglyph_meaning": "Expansion beyond territorial boundaries"},
    # Capricorn
    {"name": "Sebek-Ra", "deity": "Sobek (The Crocodile of the Depths)", "hieroglyph_meaning": "Mastery over primeval silt, patient construction"},
    {"name": "A-Sobek", "deity": "The Foundation Stone", "hieroglyph_meaning": "Unyielding discipline and pragmatic authority"},
    {"name": "Khenty-Heru", "deity": "The Summit of the Mountain", "hieroglyph_meaning": "Ascent to sovereign mastery through endurance"},
    # Aquarius
    {"name": "Hapi (The Nile Inundator)", "deity": "Hapi (Bearer of the Two Vases)", "hieroglyph_meaning": "Pouring cosmic consciousness into humanity"},
    {"name": "Tepy-a Hapi", "deity": "The Stream of the Heavens", "hieroglyph_meaning": "Universal brotherhood, egalitarian networks"},
    {"name": "Kher-Hapi", "deity": "The Confluence of Waters", "hieroglyph_meaning": "Revolutionary insight and future vision"},
    # Pisces
    {"name": "Remi (The Divine Fishes)", "deity": "The Twin Celestial Fish of the Abyss", "hieroglyph_meaning": "Dissolution into the primordial ocean (Nun)"},
    {"name": "Tepy-a Remi", "deity": "Nephthys the Veiled Mystery", "hieroglyph_meaning": "Transcendent compassion and mystic veil"},
    {"name": "Benu (The Phoenix)", "deity": "Bennu Bird of Heliopolis", "hieroglyph_meaning": "Resurrection from the ash, eternal renewal"}
]

def calculate_solar_hours(jd: float, lat: float, birth_time_str: str) -> Tuple[bool, int, str]:
    """
    Computes local temporal planetary hours (12 unequal day hours / 12 unequal night hours).
    Returns (is_day, hour_number_1_to_12, hour_ruler_planet).
    """
    # Parse birth time HH:MM to decimal hours (0.0 to 24.0)
    try:
        parts = birth_time_str.split(":")
        hh = float(parts[0])
        mm = float(parts[1]) if len(parts) > 1 else 0.0
        time_decimal = hh + (mm / 60.0)
    except Exception:
        time_decimal = 12.0

    # Solar declination approximation from Julian Day
    # Days since J2000.0 (JD 2451545.0)
    n = jd - 2451545.0
    # Mean solar longitude
    L = (280.460 + 0.9856474 * n) % 360.0
    # Mean anomaly
    g = math.radians((357.528 + 0.9856003 * n) % 360.0)
    # Ecliptic longitude of Sun
    lambda_sun = math.radians((L + 1.915 * math.sin(g) + 0.020 * math.sin(2 * g)) % 360.0)
    # Obliquity of ecliptic
    epsilon = math.radians(23.439 - 0.0000004 * n)
    # Solar declination
    delta = math.asin(math.sin(epsilon) * math.sin(lambda_sun))

    # Hour angle of sunrise / sunset for given latitude
    phi = math.radians(max(min(lat, 65.0), -65.0)) # Clamped to prevent polar extremes
    cos_H0 = -math.tan(phi) * math.tan(delta)
    cos_H0 = max(min(cos_H0, 1.0), -1.0)
    H0_hours = math.degrees(math.acos(cos_H0)) / 15.0 # Half-day length in hours

    sunrise = 12.0 - H0_hours
    sunset = 12.0 + H0_hours
    day_length = 2.0 * H0_hours
    night_length = 24.0 - day_length

    # Determine day of week for day-first hour ruler
    day_of_week = int(math.floor(jd + 1.5)) % 7
    first_hour_planet = DAY_FIRST_HOUR_RULERS[day_of_week]
    start_chaldean_idx = CHALDEAN_ORDER.index(first_hour_planet)

    if sunrise <= time_decimal < sunset:
        # Daytime hour
        is_day = True
        elapsed = time_decimal - sunrise
        hour_len = day_length / 12.0
        hour_num = int(elapsed / max(hour_len, 0.01)) + 1
        hour_num = max(1, min(12, hour_num))
        # Hour sequence offset: (hour_num - 1)
        ruler_idx = (start_chaldean_idx + (hour_num - 1)) % 7
    else:
        # Nighttime hour
        is_day = False
        if time_decimal >= sunset:
            elapsed = time_decimal - sunset
        else:
            elapsed = (24.0 - sunset) + time_decimal
        hour_len = night_length / 12.0
        hour_num = int(elapsed / max(hour_len, 0.01)) + 1
        hour_num = max(1, min(12, hour_num))
        # Night hours start after 12 day hours
        ruler_idx = (start_chaldean_idx + 12 + (hour_num - 1)) % 7

    hour_ruler = CHALDEAN_ORDER[ruler_idx]
    return is_day, hour_num, hour_ruler

def compute_egyptian_chart(
    astro_base: Dict[str, Any],
    birth_year: int = 1985,
    birth_month: int = 2,
    birth_day: int = 24,
    birth_time: str = "12:00",
    lat: float = 30.0,
    lon: float = 31.0
) -> Dict[str, Any]:
    """
    Computes Egyptian Decanic & Chronocrator Horoscopy.
    """
    jd = astro_base["jd_ut"]
    is_day, hour_num, hour_ruler = calculate_solar_hours(jd, lat, birth_time)

    # 1. Decans of key celestial markers
    planets = astro_base["planets_tropical"]
    angles = astro_base["angles"]["tropical"]
    asc_lon = angles["ascendant"]
    sun_lon = planets["Sun"]["longitude"]
    moon_lon = planets["Moon"]["longitude"]
    mc_lon = angles["mc"]

    def get_decan_info(deg: float) -> Dict[str, Any]:
        norm = deg % 360.0
        decan_idx = int(norm // 10.0) % 36
        d = EGYPTIAN_DECANS_36[decan_idx]
        sign_idx = int(norm // 30.0)
        deg_in_sign = norm % 30.0
        decan_num_in_sign = int(deg_in_sign // 10.0) + 1
        return {
            "sign": SIGNS[sign_idx],
            "decan_in_sign": decan_num_in_sign,
            "overall_decan_number": decan_idx + 1,
            "decan_name": d["name"],
            "presiding_deity": d["deity"],
            "hieroglyph_symbolism": d["hieroglyph_meaning"]
        }

    # 2. Egyptian Sothic Civil Calendar & Seasons
    # Civil Egyptian calendar: 365 days. 12 months x 30 days + 5 Epagomenal Days.
    # Egyptian year starts roughly mid-July (historic heliacal rising of Sirius / Sopdet ~ July 19)
    # We estimate season based on Gregorian month/day:
    # Akhet (Inundation): July 19 - November 15
    # Peret (Winter Sowing): November 16 - March 15
    # Shemu (Harvest / Summer): March 16 - July 13
    # Heru Renpet (5 Epagomenal Days): July 14 - July 18
    month = birth_month
    day = birth_day

    epagomenal_deity = None
    if month == 7 and 14 <= day <= 18:
        season = "Heru Renpet (The Five Epagomenal Days / Days Outside Time)"
        epag_names = [
            "Osiris (Wsir / Renewal & Sovereign Immortality)",
            "Horus the Elder (Heru Ur / Victory & Clear Celestial Vision)",
            "Set (Sutekh / Dynamic Fire & Uncompromising Strength)",
            "Isis (Aset / Supreme Magic, Healing & Divine Intuition)",
            "Nephthys (Nebet-Het / Master of Transition & Mystery)"
        ]
        epagomenal_deity = epag_names[day - 14]
    elif (month == 7 and day >= 19) or (month in [8, 9, 10]) or (month == 11 and day <= 15):
        season = "Akhet (Season of the Inundation / Nile Flood & Emergence)"
    elif (month == 11 and day >= 16) or (month in [12, 1, 2]) or (month == 3 and day <= 15):
        season = "Peret (Season of Sowing / Germination & Internal Growth)"
    else:
        season = "Shemu (Season of the Harvest & Radiant Solar Ripening)"

    return {
        "tradition": "Ancient Egyptian Temple & Decanic Astronomy",
        "chronocrator_watch": {
            "period": "Day Watch (Journey of Ra's Barque)" if is_day else "Night Watch (Amduat Underworld Passage)",
            "temporal_hour_number": hour_num,
            "hour_ruler_chronocrator": hour_ruler,
            "symbolic_significance": f"Governed by the cosmic watch of {hour_ruler} (Hour {hour_num} of {12})"
        },
        "decan_guardians": {
            "ascendant_decan": get_decan_info(asc_lon),
            "sun_decan": get_decan_info(sun_lon),
            "moon_decan": get_decan_info(moon_lon),
            "midheaven_decan": get_decan_info(mc_lon),
        },
        "sothic_civil_cycle": {
            "season": season,
            "epagomenal_birth_deity": epagomenal_deity,
            "solar_barque_alignment": f"Solar passage through {season}"
        }
    }
