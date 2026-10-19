"""
Maya Calendar deterministic calculation and round-trip verification module.
Uses the standard GMT correlation constant 584283.
Computes Long Count, Tzolk'in, Haab', Calendar Round, and Lord of the Night (G1-G9).
Follows Step 4F of Six-Culture Verified Chart specification.
"""

from typing import Dict, Any
import convertdate.mayan as mayan

# Traditional Tzolk'in Day Signs and symbolic archetypes
TZOLKIN_SIGNS = [
    ("Imix", "Water Lily / Crocodile", "Primordial Waters, Beginnings, Nourishment"),
    ("Ik'", "Wind / Breath", "Communication, Spirit, Inspiration, Movement"),
    ("Ak'b'al", "Night / Darkness", "Enclosure, Intuition, The Unconscious, Dreamtime"),
    ("K'an", "Lizard / Seed / Corn", "Abundance, Germination, Fertility, Potential"),
    ("Chikchan", "Serpent", "Kundalini / Vital Force, Instinct, Sensory Acuity"),
    ("Kimi", "Death / Transformer", "Surrender, Metamorphosis, Ancestral Memory"),
    ("Manik'", "Deer / Hand", "Grasping, Healing, Accomplishment, Grace"),
    ("Lamat", "Rabbit / Star (Venus)", "Radiance, Beauty, Expansion, Harmony"),
    ("Muluk", "Water / Offering", "Purification, Emotional Depth, Gratitude"),
    ("Ok", "Dog", "Loyalty, Guardianship, Companionship, Emotional Truth"),
    ("Chuwen", "Monkey", "Play, Artistry, Weaving of Time, Humor"),
    ("Eb'", "Grass / Road", "Human Destiny, Community, Path of Service"),
    ("B'en", "Reed / Cane", "Spine, Moral Integrity, Authority, Pillars of Sky"),
    ("Hix", "Jaguar", "Shamanic Perception, Nocturnal Sight, Stealth, Power"),
    ("Men", "Eagle", "Higher Vision, Planetary Perspective, Ambition"),
    ("K'ib'", "Vulture / Owl", "Wisdom, Pardon, Cleansing, Inner Guidance"),
    ("Kab'an", "Earth / Movement", "Rhythm, Geological Force, Evolution, Synchronicity"),
    ("Etz'nab'", "Flint / Mirror", "Discernment, Truth, Severance of Illusion, Clarity"),
    ("Kawak", "Storm / Rain", "Transformation through Storm, Cleansing, Renewal"),
    ("Ajaw", "Sun / Lord", "Solar Enlightenment, Wholeness, Sovereignty, Completion"),
]

HAAB_MONTHS = [
    "Pop", "Wo'", "Sip", "Sotz'", "Sek", "Xul", "Yaxk'in", "Mol", "Ch'en",
    "Yax", "Sak'", "Keh", "Mak", "K'ank'in", "Muwan", "Pax", "K'ayab'", "Kumk'u", "Wayeb'"
]

def compute_mayan_chart(year: int, month: int, day: int) -> Dict[str, Any]:
    # 1. Long Count from Gregorian date (GMT 584283)
    lc = mayan.from_gregorian(year, month, day)
    baktun, katun, tun, uinal, kin = lc
    
    # 2. Tzolk'in and Haab'
    tz_num, tz_name = mayan.lc_to_tzolkin(*lc)
    hb_num, hb_month = mayan.lc_to_haab(*lc)

    # Find Tzolk'in sign archetype details
    tz_detail = next((item for item in TZOLKIN_SIGNS if item[0] == tz_name), (tz_name, "", ""))

    # 3. Calendar Round string
    calendar_round = f"{tz_num} {tz_name} {hb_num} {hb_month}"

    # 4. Lord of the Night (G1 to G9)
    # The 9 Lords of the Night cycle continuously with Kin: (kin % 9) + 1
    total_kin = baktun * 144000 + katun * 7200 + tun * 360 + uinal * 20 + kin
    # G1 to G9 formula relative to GMT epoch
    night_lord_num = ((total_kin + 8) % 9) + 1
    lord_of_the_night = f"G{night_lord_num}"

    # 5. Exact Round-trip verification check
    g_roundtrip = mayan.to_gregorian(*lc)
    is_roundtrip_valid = (g_roundtrip == (year, month, day))

    return {
        "tradition": "Maya Calendar",
        "correlation": "GMT 584283 (Goodman-Martínez-Thompson)",
        "overlay_type": "Attributed Symbolic Temperament Overlay (Non-causal)",
        "long_count": {
            "baktun": baktun,
            "katun": katun,
            "tun": tun,
            "uinal": uinal,
            "kin": kin,
            "formatted": f"{baktun}.{katun}.{tun}.{uinal}.{kin}",
            "total_kin": total_kin,
        },
        "tzolkin": {
            "number": tz_num,
            "day_sign": tz_name,
            "symbol": tz_detail[1],
            "archetype_keywords": tz_detail[2],
            "formatted": f"{tz_num} {tz_name}",
        },
        "haab": {
            "day_number": hb_num,
            "month_name": hb_month,
            "formatted": f"{hb_num} {hb_month}",
        },
        "calendar_round": calendar_round,
        "lord_of_the_night": lord_of_the_night,
        "round_trip_verification": {
            "source_date": f"{year:04d}-{month:02d}-{day:02d}",
            "recovered_date": f"{g_roundtrip[0]:04d}-{g_roundtrip[1]:02d}-{g_roundtrip[2]:02d}",
            "passes_invariant": is_roundtrip_valid,
        }
    }
