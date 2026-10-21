"""
Polynesian & Māori Maramataka (Oceanic Lunar Phase Calendar & Star Navigation).
Computes:
1. Exact Moon-Sun elongation angle (0° to 360°).
2. The 30 traditional lunar nights (Nga Po o te Maramataka).
3. Energy Vitality Index (Papai = Peak Vitality, Aueke = Moderate, Kino = Rest/Inward).
4. Behavioral and psychological rhythm profiles.
"""

from typing import Dict, Any
import math

MARAMATAKA_NIGHTS = [
    {
        "night": 1, "name": "Whiro", "vitality": "Kino (Lowest Vitality / Rest)",
        "profile": "New Moon. Energy is deeply internal, reserved, and quiet. Ideal for planning, strategy, and self-reflection; unfavorable for public launches or physical exhaustion."
    },
    {
        "night": 2, "name": "Tirea", "vitality": "Aueke (Emergence)",
        "profile": "First sliver of the crescent moon. Subtle creative impulses awaken. Planting seeds of long-term projects."
    },
    {
        "night": 3, "name": "Ohoata", "vitality": "Papai (Favorable / Awakening)",
        "profile": "Sensory alertness and mental clarity rise. Good for new beginnings and decisive communications."
    },
    {
        "night": 4, "name": "Ouenuku", "vitality": "Papai (Supportive Growth)",
        "profile": "Strong cooperative energy. Highly favorable for alliances, communal effort, and constructive labor."
    },
    {
        "night": 5, "name": "Okoro", "vitality": "Aueke (Calm & Steady)",
        "profile": "Stable, grounded, tranquil energy. Good for methodical execution and consolidation."
    },
    {
        "night": 6, "name": "Tamatea-kai-ariki", "vitality": "Aueke (Turbulent / Dynamic)",
        "profile": "The first of the turbulent Tamatea phases. Winds and emotions may shift rapidly; demands emotional discipline."
    },
    {
        "night": 7, "name": "Tamatea-a-ngana", "vitality": "Aueke (Tenacity)",
        "profile": "Pushing against resistance. Strong physical endurance required to overcome obstacles."
    },
    {
        "night": 8, "name": "Tamatea-whakapau", "vitality": "Kino (Climax of Friction)",
        "profile": "First Quarter. High energetic intensity. Avoid rash conflict; channel energy into rigorous physical work."
    },
    {
        "night": 9, "name": "Huna", "vitality": "Kino (Hidden / Camouflage)",
        "profile": "Things remain concealed. Favorable for deep research, confidential work, and behind-the-scenes mastery."
    },
    {
        "night": 10, "name": "Ari", "vitality": "Papai (Clear & Auspicious)",
        "profile": "Luminosity increases. Clear insight, intellectual breakthroughs, and fruitful strategic vision."
    },
    {
        "night": 11, "name": "Hotu", "vitality": "Aueke (Emotional Tide)",
        "profile": "Feelings run deep. Good for creative arts, storytelling, and deepening relational bonds."
    },
    {
        "night": 12, "name": "Mawharu", "vitality": "Papai (Abundant Harvest)",
        "profile": "One of the most auspicious days in the calendar. High productivity, warm social reception, and generosity."
    },
    {
        "night": 13, "name": "Atua", "vitality": "Aueke (Spiritual Focus)",
        "profile": "Reverence and ancestral connection. Mind is attuned to higher principles and moral integrity."
    },
    {
        "night": 14, "name": "Ohua", "vitality": "Papai (Ripening)",
        "profile": "Anticipation of peak power. Vigorous physical stamina and organizational effectiveness."
    },
    {
        "night": 15, "name": "Oturu", "vitality": "Papai (High Tide / Brilliance)",
        "profile": "Heightened emotional clarity and sensory perception. High social magnetism."
    },
    {
        "night": 16, "name": "Rākau-nui", "vitality": "Papai (Full Moon Climax / Peak Vitality)",
        "profile": "Full Moon apex. Maximum physical stamina, public visibility, charismatic authority, and creative output."
    },
    {
        "night": 17, "name": "Rākau-matohi", "vitality": "Papai (Generous Sharing)",
        "profile": "Post-full moon radiance. Excellent for sharing rewards, teaching, and mentorship."
    },
    {
        "night": 18, "name": "Takirau", "vitality": "Aueke (Consolidation)",
        "profile": "Energy begins gradual waning. Sorting priorities and reviewing achievements."
    },
    {
        "night": 19, "name": "Oike", "vitality": "Aueke (Careful Labor)",
        "profile": "Meticulous technical work. Pruning excesses and focusing on craftsmanship."
    },
    {
        "night": 20, "name": "Korekore-te-whiwhia", "vitality": "Kino (Restraint)",
        "profile": "First of the quiet Korekore days. Conservation of resources and emotional stillness."
    },
    {
        "night": 21, "name": "Korekore-te-rawea", "vitality": "Kino (Stillness)",
        "profile": "Meditation, patience, and non-reactivity. Do not force external outcomes."
    },
    {
        "night": 22, "name": "Korekore-whakapiri", "vitality": "Aueke (Regrouping)",
        "profile": "Gradual return of collective spirit. Gathering insights from solitude."
    },
    {
        "night": 23, "name": "Tangaroa-a-mua", "vitality": "Papai (Oceanic Flow)",
        "profile": "Presided over by Tangaroa (deity of the sea). Intuition flows effortlessly; immense luck in oceanic endeavors."
    },
    {
        "night": 24, "name": "Tangaroa-a-roto", "vitality": "Papai (Deep Mastery)",
        "profile": "Deep mental absorption and craft mastery. Highly productive for specialized research."
    },
    {
        "night": 25, "name": "Tangaroa-kiokio", "vitality": "Papai (Abundance)",
        "profile": "Sustained skill and precision. Rewards for diligent execution."
    },
    {
        "night": 26, "name": "Otane", "vitality": "Papai (Forest Strength)",
        "profile": "Grounded resilience (Tane Mahuta). Connection with physical earth, trees, and robust health."
    },
    {
        "night": 27, "name": "Orongonui", "vitality": "Papai (Peace & Harmony)",
        "profile": "Presided over by Rongo (deity of peace). Reconciliation, joy, and profound inner harmony."
    },
    {
        "night": 28, "name": "Mauri", "vitality": "Aueke (Life Spark)",
        "profile": "Protecting the inner life-force (mauri). Quiet mindfulness as darkness approaches."
    },
    {
        "night": 29, "name": "Mutuwhenua", "vitality": "Kino (The Moon Dead / Total Reset)",
        "profile": "The dark moon completely hidden. Total cleansing, detox, and release of old karmic cycles."
    },
    {
        "night": 30, "name": "Omutu", "vitality": "Kino (Void & Rebirth)",
        "profile": "The fertile void before Whiro emerges anew. Sacred rest before the dawn of the next cycle."
    }
]

def compute_maramataka_chart(astro_base: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes Polynesian Maramataka Lunar Phase Archetype.
    """
    sun_lon = astro_base["planets_tropical"]["Sun"]["longitude"]
    moon_lon = astro_base["planets_tropical"]["Moon"]["longitude"]

    # Elongation angle (0 to 360)
    elongation = (moon_lon - sun_lon) % 360.0

    # 360° divided into 30 lunar nights = 12° per night
    night_idx = int(elongation // 12.0) % 30
    night_info = MARAMATAKA_NIGHTS[night_idx]

    # Percentage illumination approximation
    phase_angle = abs(180.0 - elongation)
    illumination_pct = round(0.5 * (1.0 + math.cos(math.radians(phase_angle))) * 100.0, 1)

    return {
        "tradition": "Polynesian & Māori Maramataka",
        "lunar_night": {
            "number": night_info["night"],
            "name": night_info["name"],
            "elongation_degrees": round(elongation, 2),
            "illumination_percent": illumination_pct,
            "vitality_index": night_info["vitality"],
            "behavioral_profile": night_info["profile"]
        },
        "oceanic_archetype": {
            "elemental_mode": "Water / Oceanic Flow" if "Tangaroa" in night_info["name"] else (
                "Earth / Forest Stability" if "Otane" in night_info["name"] or "Orongo" in night_info["name"] else (
                    "Air / Wind Volatility" if "Tamatea" in night_info["name"] else "Solar Peak / Celestial Brilliance"
                )
            ),
            "optimal_action": "High Action & Expansion" if "Papai" in night_info["vitality"] else (
                "Strategic Rest & Reflection" if "Kino" in night_info["vitality"] else "Balanced Execution"
            )
        }
    }
