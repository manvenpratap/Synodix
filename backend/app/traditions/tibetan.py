"""
Tibetan Elemental Astrology (Jungtsi / འབྱུང་རྩིས) calculation module.
Computes 60-year Rabjung cycle, Year Element-Animal, 9 Mewa, 8 Parkha,
and the Five Personal Forces (Sog, Lu, Wang, Lungta, La).
Follows Step 4G of Six-Culture Verified Chart specification.
"""

from typing import Dict, Any

ANIMALS = [
    "Mouse", "Ox", "Tiger", "Hare", "Dragon", "Snake",
    "Horse", "Sheep", "Monkey", "Bird", "Dog", "Pig"
]

ELEMENTS = ["Wood", "Fire", "Earth", "Iron", "Water"]

# 9 Mewa (Magic Square) definitions
MEWA_DATA = {
    1: {"color": "White", "element": "Iron", "direction": "North", "nature": "Clear, pure, introspective"},
    2: {"color": "Black", "element": "Water", "direction": "Southwest", "nature": "Deep, cautious, receptive"},
    3: {"color": "Indigo Blue", "element": "Water", "direction": "East", "nature": "Quiet, steady, fluid"},
    4: {"color": "Green", "element": "Wood", "direction": "Southeast", "nature": "Growth-oriented, lively, flexible"},
    5: {"color": "Yellow", "element": "Earth", "direction": "Center", "nature": "Stable, grounded, sovereign"},
    6: {"color": "White", "element": "Iron", "direction": "Northwest", "nature": "Direct, principled, sharp"},
    7: {"color": "Red", "element": "Fire", "direction": "West", "nature": "Passionate, communicative, warm"},
    8: {"color": "White", "element": "Iron", "direction": "Northeast", "nature": "Resolute, persevering, quiet"},
    9: {"color": "Maroon", "element": "Fire", "direction": "South", "nature": "Luminous, expressive, dynamic"},
}

# 8 Parkha (Trigrams)
PARKHA_DATA = {
    "Li":   {"element": "Fire",  "direction": "South",     "meaning": "Luminosity, warmth, vision"},
    "Khon": {"element": "Earth", "direction": "Southwest", "meaning": "Receptivity, maternal support, nourishment"},
    "Dwa":  {"element": "Iron",  "direction": "West",      "meaning": "Joy, completion, autumn harvest"},
    "Khen": {"element": "Sky",   "direction": "Northwest", "meaning": "Vastness, paternal order, strength"},
    "Kham": {"element": "Water", "direction": "North",     "meaning": "Depth, adaptability, nocturnal wisdom"},
    "Gin":  {"element": "Mountain","direction": "Northeast","meaning": "Stillness, steadfastness, meditation"},
    "Zin":  {"element": "Thunder","direction": "East",      "meaning": "Initiation, electric impulse, awakening"},
    "Zon":  {"element": "Wind",  "direction": "Southeast", "meaning": "Penetration, gentleness, dispersal"},
}

# Animal life force (Sog) elements
ANIMAL_SOG_ELEMENT = {
    "Tiger": "Wood", "Hare": "Wood",
    "Horse": "Fire", "Snake": "Fire",
    "Monkey": "Iron", "Bird": "Iron",
    "Pig": "Water", "Mouse": "Water",
    "Dragon": "Earth", "Sheep": "Earth", "Dog": "Earth", "Ox": "Earth"
}

# Wind-Horse (Lungta) element derived from animal trine
LUNGTA_TRINES = {
    "Tiger": "Iron", "Horse": "Iron", "Dog": "Iron",
    "Pig": "Fire", "Sheep": "Fire", "Hare": "Fire",
    "Mouse": "Wood", "Dragon": "Wood", "Monkey": "Wood",
    "Bird": "Water", "Ox": "Water", "Snake": "Water"
}

# Element generation cycle for Soul (La) force: Mother produces Child
# Wood -> Fire -> Earth -> Iron -> Water -> Wood
ELEMENT_MOTHER = {
    "Wood": "Water",
    "Fire": "Wood",
    "Earth": "Fire",
    "Iron": "Earth",
    "Water": "Iron"
}

def compute_tibetan_chart(year: int, gender: str = "male") -> Dict[str, Any]:
    # 1. 60-Year Rabjung Cycle
    # Rabjung 1 began in 1027 CE (Fire Female Hare)
    rabjung_number = ((year - 1027) // 60) + 1
    year_in_cycle = ((year - 1027) % 60) + 1

    # 1027 CE was Fire Hare
    # Element index: 1027 was Fire (index 1). Each element spans 2 years (Male/Female).
    elem_idx = (((year - 1027) // 2) + 1) % 5
    year_element = ELEMENTS[elem_idx]
    year_gender = "Male" if (year % 2 == 0) else "Female"

    # Animal index: 1027 was Hare (index 3).
    animal_idx = ((year - 1027) + 3) % 12
    year_animal = ANIMALS[animal_idx]

    # 2. Year Mewa (1 to 9 Magic Square)
    # Traditional formula: Mewa counts backwards
    # 1985 -> Mewa 6
    mewa_num = (10 - ((year - 4) % 9))
    if mewa_num == 10: mewa_num = 1
    if mewa_num > 9: mewa_num = ((mewa_num - 1) % 9) + 1
    mewa_info = MEWA_DATA.get(mewa_num, MEWA_DATA[1])

    # 3. Natal Parkha (Trigram)
    # Male counts clockwise starting from Li (Fire) at age 1
    # Female counts counter-clockwise starting from Khon (Earth) at age 1
    parkha_names = ["Li", "Khon", "Dwa", "Khen", "Kham", "Gin", "Zin", "Zon"]
    tibetan_age = 35  # Nominal or current
    if gender.lower() == "female":
        p_idx = (1 - (tibetan_age - 1)) % 8
    else:
        p_idx = (0 + (tibetan_age - 1)) % 8
    parkha_name = parkha_names[p_idx]
    parkha_info = PARKHA_DATA[parkha_name]

    # 4. Five Personal Forces (Khams Lnga)
    sog_elem = ANIMAL_SOG_ELEMENT[year_animal]
    lu_elem = mewa_info["element"]
    wang_elem = year_element
    lungta_elem = LUNGTA_TRINES[year_animal]
    la_elem = ELEMENT_MOTHER.get(sog_elem, "Earth")  # Mother of Life force protects the Soul

    return {
        "tradition": "Tibetan Elemental Astrology (Jungtsi)",
        "overlay_type": "Attributed Symbolic Temperament Overlay (Non-causal)",
        "rabjung_cycle": {
            "rabjung_number": rabjung_number,
            "year_in_cycle": year_in_cycle,
            "element_gender_animal": f"{year_element} {year_gender} {year_animal}",
            "element": year_element,
            "gender": year_gender,
            "animal": year_animal,
        },
        "mewa": {
            "number": mewa_num,
            "color": mewa_info["color"],
            "element": mewa_info["element"],
            "direction": mewa_info["direction"],
            "nature": mewa_info["nature"],
            "formatted": f"{mewa_num} {mewa_info['color']}",
        },
        "parkha": {
            "name": parkha_name,
            "element": parkha_info["element"],
            "direction": parkha_info["direction"],
            "meaning": parkha_info["meaning"],
        },
        "five_personal_forces": {
            "sog_life_force": sog_elem,
            "lu_body_health": lu_elem,
            "wang_power_status": wang_elem,
            "lungta_wind_horse_fortune": lungta_elem,
            "la_soul_vitality": la_elem,
        }
    }
