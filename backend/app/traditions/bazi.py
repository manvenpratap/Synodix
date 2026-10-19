"""
BaZi (Four Pillars of Destiny) deterministic calculation module.
Uses lunar_python for astronomical solar terms and pillar derivation,
and evaluates Ten Gods, Five Elements balance, Day Master strength, and Da Yun luck pillars.
Follows Step 4C of Six-Culture Verified Chart specification.
"""

from typing import Dict, Any, List
from lunar_python import Solar, Lunar

STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

STEM_ELEMENTS = {
    "甲": ("Wood", "Yang"), "乙": ("Wood", "Yin"),
    "丙": ("Fire", "Yang"), "丁": ("Fire", "Yin"),
    "戊": ("Earth", "Yang"), "己": ("Earth", "Yin"),
    "庚": ("Metal", "Yang"), "辛": ("Metal", "Yin"),
    "壬": ("Water", "Yang"), "癸": ("Water", "Yin"),
}

BRANCH_ELEMENTS = {
    "子": "Water", "丑": "Earth", "寅": "Wood", "卯": "Wood",
    "辰": "Earth", "巳": "Fire", "午": "Fire", "未": "Earth",
    "申": "Metal", "酉": "Metal", "戌": "Earth", "亥": "Water",
}

HIDDEN_STEMS = {
    "子": ["癸"],
    "丑": ["己", "癸", "辛"],
    "寅": ["甲", "丙", "戊"],
    "卯": ["乙"],
    "辰": ["戊", "乙", "癸"],
    "巳": ["丙", "庚", "戊"],
    "午": ["丁", "己"],
    "未": ["己", "丁", "乙"],
    "申": ["庚", "壬", "戊"],
    "酉": ["辛"],
    "戌": ["戊", "辛", "丁"],
    "亥": ["壬", "甲"],
}

ELEMENT_CYCLE = {
    # Element: (produces, controlled_by, produces_me, controls)
    "Wood":  {"output": "Fire",  "officer": "Metal", "resource": "Water", "wealth": "Earth"},
    "Fire":  {"output": "Earth", "officer": "Water", "resource": "Wood",  "wealth": "Metal"},
    "Earth": {"output": "Metal", "officer": "Wood",  "resource": "Fire",  "wealth": "Water"},
    "Metal": {"output": "Water", "officer": "Fire",  "resource": "Earth", "wealth": "Wood"},
    "Water": {"output": "Wood",  "officer": "Earth", "resource": "Metal", "wealth": "Fire"},
}

def get_ten_god(day_master: str, target_stem: str) -> str:
    """Calculates Ten God relationship of target_stem with respect to day_master"""
    dm_elem, dm_pol = STEM_ELEMENTS[day_master]
    t_elem, t_pol = STEM_ELEMENTS[target_stem]
    same_pol = (dm_pol == t_pol)
    
    if t_elem == dm_elem:
        return "Friend (比肩)" if same_pol else "Rob Wealth (劫财)"
    elif t_elem == ELEMENT_CYCLE[dm_elem]["output"]:
        return "Eating God (食神)" if same_pol else "Hurting Officer (伤官)"
    elif t_elem == ELEMENT_CYCLE[dm_elem]["wealth"]:
        return "Indirect Wealth (偏财)" if same_pol else "Direct Wealth (正财)"
    elif t_elem == ELEMENT_CYCLE[dm_elem]["officer"]:
        return "Seven Killings (七杀)" if same_pol else "Direct Officer (正官)"
    elif t_elem == ELEMENT_CYCLE[dm_elem]["resource"]:
        return "Indirect Resource (偏印)" if same_pol else "Direct Resource (正印)"
    return "Unknown"

def compute_bazi_chart(
    year: int, month: int, day: int,
    hour: int, minute: int, second: int = 0,
    gender: str = "male",
    has_birth_time: bool = True
) -> Dict[str, Any]:
    # 1. Solar & Lunar conversion via lunar_python
    solar = Solar.fromYmdHms(year, month, day, hour, minute, second)
    lunar = solar.getLunar()
    eight_char = lunar.getEightChar()

    # 2. Extract Four Pillars (Stems and Branches)
    y_gan, y_zhi = eight_char.getYearGan(), eight_char.getYearZhi()
    m_gan, m_zhi = eight_char.getMonthGan(), eight_char.getMonthZhi()
    d_gan, d_zhi = eight_char.getDayGan(), eight_char.getDayZhi()
    
    if has_birth_time:
        h_gan, h_zhi = eight_char.getTimeGan(), eight_char.getTimeZhi()
    else:
        h_gan, h_zhi = None, None

    day_master = d_gan
    dm_elem, dm_polarity = STEM_ELEMENTS[day_master]

    # 3. Hidden stems and Ten Gods for each pillar
    def format_pillar(stem, branch, name):
        if not stem or not branch:
            return {"name": name, "available": False}
        hidden = HIDDEN_STEMS.get(branch, [])
        return {
            "name": name,
            "available": True,
            "stem": stem,
            "branch": branch,
            "stem_element": STEM_ELEMENTS[stem][0],
            "stem_polarity": STEM_ELEMENTS[stem][1],
            "branch_element": BRANCH_ELEMENTS[branch],
            "ten_god_stem": get_ten_god(day_master, stem) if name != "Day" else "Day Master (日主)",
            "hidden_stems": [
                {
                    "stem": hs,
                    "element": STEM_ELEMENTS[hs][0],
                    "ten_god": get_ten_god(day_master, hs)
                } for hs in hidden
            ]
        }

    year_p = format_pillar(y_gan, y_zhi, "Year")
    month_p = format_pillar(m_gan, m_zhi, "Month")
    day_p = format_pillar(d_gan, d_zhi, "Day")
    hour_p = format_pillar(h_gan, h_zhi, "Hour")

    # 4. Five Elements Distribution
    element_counts = {"Wood": 0, "Fire": 0, "Earth": 0, "Metal": 0, "Water": 0}
    pillars = [p for p in [year_p, month_p, day_p, hour_p] if p["available"]]
    
    for p in pillars:
        element_counts[p["stem_element"]] += 1.0
        element_counts[p["branch_element"]] += 1.0
        # Add fractional weight for hidden stems
        for hs in p["hidden_stems"]:
            element_counts[hs["element"]] += 0.3

    total_score = sum(element_counts.values()) or 1.0
    element_percentages = {elem: round((count / total_score) * 100, 1) for elem, count in element_counts.items()}

    # 5. Day Master Strength Assessment
    # Is born in supportive season (Month branch element == Resource or Self)?
    month_branch_elem = BRANCH_ELEMENTS[m_zhi]
    in_season = month_branch_elem in [dm_elem, ELEMENT_CYCLE[dm_elem]["resource"]]
    
    # Rooting in branches
    roots = []
    for p in pillars:
        b = p["branch"]
        if any(STEM_ELEMENTS[hs][0] == dm_elem for hs in HIDDEN_STEMS.get(b, [])):
            roots.append(f"{p['name']} Branch ({b})")

    # Support (Resource + Self) vs Drain (Output + Wealth + Officer)
    support_score = element_counts[dm_elem] + element_counts[ELEMENT_CYCLE[dm_elem]["resource"]]
    drain_score = (
        element_counts[ELEMENT_CYCLE[dm_elem]["output"]] +
        element_counts[ELEMENT_CYCLE[dm_elem]["wealth"]] +
        element_counts[ELEMENT_CYCLE[dm_elem]["officer"]]
    )

    dm_strength = "Strong (旺)" if (support_score >= drain_score or (in_season and len(roots) >= 1)) else "Weak (身弱)"

    # 6. Da Yun (10-Year Luck Pillars)
    # Direction: Yang Male or Yin Female goes forward; Yin Male or Yang Female goes backward
    year_polarity = STEM_ELEMENTS[y_gan][1]
    is_forward = (year_polarity == "Yang" and gender.lower() == "male") or (year_polarity == "Yin" and gender.lower() == "female")

    # Generate 8 Da Yun pillars from Month Pillar
    da_yun_pillars = []
    m_stem_idx = STEMS.index(m_gan)
    m_branch_idx = BRANCHES.index(m_zhi)
    step = 1 if is_forward else -1

    # Approximate start age using lunar-python getDaYun
    try:
        dy_obj = eight_char.getDaYun(1 if gender.lower() == "male" else 0)
        da_yun_list = dy_obj.getDaYun()
        for i, dy in enumerate(da_yun_list[:8]):
            start_age = dy.getStartAge()
            start_yr = dy.getStartYear()
            gan_zhi = dy.getGanZhi()
            if gan_zhi and len(gan_zhi) >= 2:
                s, b = gan_zhi[0], gan_zhi[1]
                da_yun_pillars.append({
                    "step": i + 1,
                    "start_age": start_age,
                    "start_year": start_yr,
                    "stem": s,
                    "branch": b,
                    "element": STEM_ELEMENTS.get(s, ("Unknown",))[0],
                    "ten_god": get_ten_god(day_master, s)
                })
    except Exception:
        # Fallback deterministic math
        for i in range(1, 9):
            s = STEMS[(m_stem_idx + i * step) % 10]
            b = BRANCHES[(m_branch_idx + i * step) % 12]
            da_yun_pillars.append({
                "step": i,
                "start_age": i * 10 - 2,
                "start_year": year + (i * 10 - 2),
                "stem": s,
                "branch": b,
                "element": STEM_ELEMENTS[s][0],
                "ten_god": get_ten_god(day_master, s)
            })

    # Solar terms info
    prev_jie = lunar.getPrevJieQi()
    next_jie = lunar.getNextJieQi()

    return {
        "tradition": "BaZi (Four Pillars of Destiny)",
        "pillars": {
            "year": year_p,
            "month": month_p,
            "day": day_p,
            "hour": hour_p,
        },
        "day_master": {
            "stem": day_master,
            "element": dm_elem,
            "polarity": dm_polarity,
            "strength": dm_strength,
            "in_season": in_season,
            "rooting": roots,
            "support_score": round(support_score, 2),
            "drain_score": round(drain_score, 2),
        },
        "five_elements_balance": {
            "counts": {k: round(v, 2) for k, v in element_counts.items()},
            "percentages": element_percentages,
            "dominant_element": max(element_counts, key=element_counts.get),
            "weakest_element": min(element_counts, key=element_counts.get),
        },
        "da_yun_luck_pillars": da_yun_pillars,
        "solar_terms": {
            "prev_term": prev_jie.getName() if prev_jie else None,
            "next_term": next_jie.getName() if next_jie else None,
        },
        "year_nayin": eight_char.getYearNaYin(),
    }
