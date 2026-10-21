"""
BaZi (Four Pillars of Destiny) deterministic calculation module.
Uses lunar_python for astronomical solar terms and pillar derivation,
and evaluates Ten Gods, Five Elements balance, Day Master strength, and Da Yun luck pillars.
Follows Step 4C of Six-Culture Verified Chart specification.
"""

from typing import Dict, Any, List
from datetime import datetime
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

# Six Clashes (六冲)
SIX_CLASHES = {
    ("子", "午"): "Water-Fire Clash (子午冲)",
    ("丑", "未"): "Earth-Earth Clash (丑未冲)",
    ("寅", "申"): "Wood-Metal Clash (寅申冲)",
    ("卯", "酉"): "Wood-Metal Clash (卯酉冲)",
    ("辰", "戌"): "Earth-Earth Clash (辰戌冲)",
    ("巳", "亥"): "Fire-Water Clash (巳亥冲)"
}

# Six Harmonies (六合)
SIX_HARMONIES = {
    ("子", "丑"): "Earth (土)",
    ("寅", "亥"): "Wood (木)",
    ("卯", "戌"): "Fire (火)",
    ("辰", "酉"): "Metal (金)",
    ("巳", "申"): "Water (水)",
    ("午", "未"): "Earth/Fire (土/火)"
}

# Three Harmonies (三合)
THREE_HARMONIES = [
    ({"申", "子", "辰"}, "Water Frame (申子辰水局)"),
    ({"亥", "卯", "未"}, "Wood Frame (亥卯未木局)"),
    ({"寅", "午", "戌"}, "Fire Frame (寅午戌火局)"),
    ({"巳", "酉", "丑"}, "Metal Frame (巳酉丑金局)"),
]

# Three Punishments (三刑)
PUNISHMENT_SETS = [
    ({"寅", "巳", "申"}, "Ungrateful Punishment (恃势之刑 / 寅巳申)"),
    ({"丑", "戌", "未"}, "Bullying Punishment (无恩之刑 / 丑戌未)"),
]

# Six Harms (六害)
SIX_HARMS = {
    ("子", "未"): "Zi-Wei Harm (子未相害)",
    ("丑", "午"): "Chou-Wu Harm (丑午相害)",
    ("寅", "巳"): "Yin-Si Harm (寅巳相害)",
    ("卯", "辰"): "Mao-Chen Harm (卯辰相害)",
    ("申", "亥"): "Shen-Hai Harm (申亥相害)",
    ("酉", "戌"): "You-Xu Harm (酉戌相害)"
}

# Heavenly Stem Combinations (天干五合)
STEM_COMBINATIONS = {
    ("甲", "己"): "Earth (土)",
    ("乙", "庚"): "Metal (金)",
    ("丙", "辛"): "Water (水)",
    ("丁", "壬"): "Wood (木)",
    ("戊", "癸"): "Fire (火)"
}

def analyze_branch_interactions(pillars: List[Dict[str, Any]]) -> Dict[str, Any]:
    clashes = []
    harmonies = []
    harms = []
    self_punishments = []
    
    active_branches = [(p["name"], p["branch"]) for p in pillars if p.get("available")]
    active_stems = [(p["name"], p["stem"]) for p in pillars if p.get("available")]
    
    for i in range(len(active_branches)):
        for j in range(i + 1, len(active_branches)):
            p1_name, b1 = active_branches[i]
            p2_name, b2 = active_branches[j]
            pair_fwd = (b1, b2)
            pair_rev = (b2, b1)
            
            # Clash
            clash_desc = SIX_CLASHES.get(pair_fwd) or SIX_CLASHES.get(pair_rev)
            if clash_desc:
                clashes.append({
                    "pillars": [p1_name, p2_name],
                    "branches": [b1, b2],
                    "type": clash_desc
                })
                
            # Six Harmony
            he_elem = SIX_HARMONIES.get(pair_fwd) or SIX_HARMONIES.get(pair_rev)
            if he_elem:
                harmonies.append({
                    "pillars": [p1_name, p2_name],
                    "branches": [b1, b2],
                    "transforms_to": he_elem,
                    "type": f"Six Harmony ({b1}+{b2} -> {he_elem})"
                })
                
            # Six Harm
            harm_desc = SIX_HARMS.get(pair_fwd) or SIX_HARMS.get(pair_rev)
            if harm_desc:
                harms.append({
                    "pillars": [p1_name, p2_name],
                    "branches": [b1, b2],
                    "type": harm_desc
                })
                
            # Zi-Mao Punishment
            if set([b1, b2]) == {"子", "卯"}:
                clashes.append({
                    "pillars": [p1_name, p2_name],
                    "branches": [b1, b2],
                    "type": "Uncivil Punishment (无礼之刑 / 子卯)"
                })
                
            # Self Punishment
            if b1 == b2 and b1 in ["辰", "午", "酉", "亥"]:
                self_punishments.append({
                    "pillars": [p1_name, p2_name],
                    "branch": b1,
                    "type": f"Self-Punishment ({b1}{b1} 自刑)"
                })

    # Three Harmonies (San He)
    all_b_set = set(b for _, b in active_branches)
    three_he_found = []
    for tri_set, desc in THREE_HARMONIES:
        inter = tri_set.intersection(all_b_set)
        if len(inter) == 3:
            matched_p = [p_name for p_name, b in active_branches if b in tri_set]
            three_he_found.append({
                "type": f"Full Three Harmony ({desc})",
                "branches": list(tri_set),
                "pillars": matched_p
            })
        elif len(inter) == 2:
            matched_p = [p_name for p_name, b in active_branches if b in inter]
            three_he_found.append({
                "type": f"Half Harmony (半合 {desc})",
                "branches": list(inter),
                "pillars": matched_p
            })

    # Three Punishments (San Xing)
    punishments_found = []
    for p_set, desc in PUNISHMENT_SETS:
        inter = p_set.intersection(all_b_set)
        if len(inter) == 3:
            matched_p = [p_name for p_name, b in active_branches if b in p_set]
            punishments_found.append({
                "type": f"Full Three Punishment ({desc})",
                "branches": list(p_set),
                "pillars": matched_p
            })
        elif len(inter) == 2:
            matched_p = [p_name for p_name, b in active_branches if b in inter]
            punishments_found.append({
                "type": f"Partial Punishment (半刑 {desc})",
                "branches": list(inter),
                "pillars": matched_p
            })
    punishments_found.extend(self_punishments)

    # Heavenly Stem Combinations
    stem_combs = []
    for i in range(len(active_stems)):
        for j in range(i + 1, len(active_stems)):
            p1_name, s1 = active_stems[i]
            p2_name, s2 = active_stems[j]
            stem_elem = STEM_COMBINATIONS.get((s1, s2)) or STEM_COMBINATIONS.get((s2, s1))
            if stem_elem:
                stem_combs.append({
                    "pillars": [p1_name, p2_name],
                    "stems": [s1, s2],
                    "transforms_to": stem_elem,
                    "type": f"Stem Harmony ({s1}+{s2} -> {stem_elem})"
                })

    return {
        "six_clashes": clashes,
        "six_harmonies": harmonies,
        "three_harmonies": three_he_found,
        "punishments": punishments_found,
        "six_harms": harms,
        "stem_combinations": stem_combs
    }

def compute_shen_sha(day_master: str, day_branch: str, year_branch: str, pillars: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    active_branches = [(p["name"], p["branch"]) for p in pillars if p.get("available")]
    stars = []
    
    # 1. Tian Yi Gui Ren (Noble Star / 天乙贵人)
    gui_ren_map = {
        "甲": ["丑", "未"], "戊": ["丑", "未"],
        "乙": ["子", "申"], "己": ["子", "申"],
        "丙": ["亥", "酉"], "丁": ["亥", "酉"],
        "庚": ["午", "寅"], "辛": ["午", "寅"],
        "壬": ["巳", "卯"], "癸": ["巳", "卯"],
    }
    target_gui = gui_ren_map.get(day_master, [])
    found_gui = [f"{p_name} ({b})" for p_name, b in active_branches if b in target_gui]
    stars.append({
        "name": "天乙贵人 (Tian Yi Noble Star)",
        "present": len(found_gui) > 0,
        "locations": found_gui,
        "nature": "Auspicious",
        "description": "Supreme guardian spirit that dissolves misfortune and draws influential mentors"
    })

    # 2. Tao Hua (Peach Blossom / 桃花)
    taohua_map = {
        "寅": "卯", "午": "卯", "戌": "卯",
        "巳": "午", "酉": "午", "丑": "午",
        "申": "酉", "子": "酉", "辰": "酉",
        "亥": "子", "卯": "子", "未": "子"
    }
    th_targets = set([taohua_map.get(day_branch), taohua_map.get(year_branch)]) - {None}
    found_th = [f"{p_name} ({b})" for p_name, b in active_branches if b in th_targets]
    stars.append({
        "name": "桃花 (Peach Blossom)",
        "present": len(found_th) > 0,
        "locations": found_th,
        "nature": "Mixed / Charisma",
        "description": "Magnetic interpersonal allure, artistic sensibility, and romance potential"
    })

    # 3. Yi Ma (Travelling Horse / 驿马)
    yima_map = {
        "寅": "申", "午": "申", "戌": "申",
        "巳": "亥", "酉": "亥", "丑": "亥",
        "申": "寅", "子": "寅", "辰": "寅",
        "亥": "巳", "卯": "巳", "未": "巳"
    }
    ym_targets = set([yima_map.get(day_branch), yima_map.get(year_branch)]) - {None}
    found_ym = [f"{p_name} ({b})" for p_name, b in active_branches if b in ym_targets]
    stars.append({
        "name": "驿马 (Travelling Horse)",
        "present": len(found_ym) > 0,
        "locations": found_ym,
        "nature": "Dynamic / Mobility",
        "description": "Geographical migration, career movement, and proactive expansion"
    })

    # 4. Hua Gai (Canopy / 华盖)
    huagai_map = {
        "寅": "戌", "午": "戌", "戌": "戌",
        "巳": "丑", "酉": "丑", "丑": "丑",
        "申": "辰", "子": "辰", "辰": "辰",
        "亥": "未", "卯": "未", "未": "未"
    }
    hg_targets = set([huagai_map.get(day_branch), huagai_map.get(year_branch)]) - {None}
    found_hg = [f"{p_name} ({b})" for p_name, b in active_branches if b in hg_targets]
    stars.append({
        "name": "华盖 (Imperial Canopy)",
        "present": len(found_hg) > 0,
        "locations": found_hg,
        "nature": "Reflective / Talent",
        "description": "Solitary genius, metaphysical depth, philosophical insight, and scholarly independence"
    })

    # 5. Yang Ren (Goat Blade / 羊刃)
    yangren_map = {
        "甲": "卯", "丙": "午", "戊": "午", "庚": "酉", "壬": "子"
    }
    yr_target = yangren_map.get(day_master)
    found_yr = [f"{p_name} ({b})" for p_name, b in active_branches if yr_target and b == yr_target]
    stars.append({
        "name": "羊刃 (Goat Blade)",
        "present": len(found_yr) > 0,
        "locations": found_yr,
        "nature": "Fierce / Decisive",
        "description": "Steely willpower, razor determination, competitive threshold, and physical courage"
    })

    return stars

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

def compute_yong_shen(
    dm_elem: str,
    dm_strength: str,
    month_branch: str,
    element_counts: Dict[str, float]
) -> Dict[str, Any]:
    """Calculates Yong Shen (Useful God), Xi Shen (Favorable), and Ji Shen (Unfavorable) elements"""
    cycle = ELEMENT_CYCLE[dm_elem]
    is_strong = "Strong" in dm_strength

    # 1. Climate adjustment (Tiao Hou) for extreme seasons
    winter_branches = ["亥", "子", "丑"]
    summer_branches = ["巳", "午", "未"]
    tiao_hou_element = None
    if month_branch in winter_branches and element_counts.get("Fire", 0) < 2.0:
        tiao_hou_element = "Fire"
    elif month_branch in summer_branches and element_counts.get("Water", 0) < 2.0:
        tiao_hou_element = "Water"

    # 2. Suppressing/Supporting Yong Shen
    if is_strong:
        primary_yong_shen = tiao_hou_element or cycle["output"]
        favorable_elements = [cycle["output"], cycle["wealth"], cycle["officer"]]
        unfavorable_elements = [dm_elem, cycle["resource"]]
        strategy = "Drain and channel strong self-energy into creative output, wealth acquisition, and disciplined leadership."
    else:
        primary_yong_shen = tiao_hou_element or cycle["resource"]
        favorable_elements = [cycle["resource"], dm_elem]
        unfavorable_elements = [cycle["officer"], cycle["wealth"], cycle["output"]]
        strategy = "Nourish self-energy through mentorship, scholarly learning, alliances, and steady health preservation."

    return {
        "useful_god_element": primary_yong_shen,
        "climate_adjustment": tiao_hou_element,
        "favorable_elements": favorable_elements,
        "unfavorable_elements": unfavorable_elements,
        "strategy": strategy,
        "strengthening_recommendation": f"Engage with {primary_yong_shen} element activities, industries, and life patterns."
    }

def compute_liu_nian(
    target_year: int,
    day_master: str,
    pillars: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Evaluates the annual luck pillar (Liu Nian) and its interactions with the natal chart"""
    cycle_offset = (target_year - 4) % 60
    s_idx = cycle_offset % 10
    b_idx = cycle_offset % 12
    year_stem = STEMS[s_idx]
    year_branch = BRANCHES[b_idx]
    year_stem_elem, year_stem_polar = STEM_ELEMENTS[year_stem]
    year_branch_elem = BRANCH_ELEMENTS[year_branch]
    
    ten_god = get_ten_god(day_master, year_stem)

    interactions = []
    for p in pillars:
        if not p.get("available"):
            continue
        p_name = p["name"]
        p_branch = p["branch"]
        p_stem = p["stem"]

        # Stem combination
        if (p_stem, year_stem) in STEM_COMBINATIONS or (year_stem, p_stem) in STEM_COMBINATIONS:
            trans = STEM_COMBINATIONS.get((p_stem, year_stem)) or STEM_COMBINATIONS.get((year_stem, p_stem))
            interactions.append(f"Stem Harmony with {p_name} Pillar ({p_stem}+{year_stem} transforms to {trans})")

        # Branch clash
        if (p_branch, year_branch) in SIX_CLASHES or (year_branch, p_branch) in SIX_CLASHES:
            desc = SIX_CLASHES.get((p_branch, year_branch)) or SIX_CLASHES.get((year_branch, p_branch))
            interactions.append(f"Clash with {p_name} Pillar ({p_branch} vs {year_branch}: {desc})")

        # Branch harmony
        if (p_branch, year_branch) in SIX_HARMONIES or (year_branch, p_branch) in SIX_HARMONIES:
            desc = SIX_HARMONIES.get((p_branch, year_branch)) or SIX_HARMONIES.get((year_branch, p_branch))
            interactions.append(f"Six Harmony with {p_name} Pillar ({p_branch}+{year_branch} transforms to {desc})")

    return {
        "year": target_year,
        "pillar": f"{year_stem}{year_branch}",
        "stem": year_stem,
        "branch": year_branch,
        "stem_element": year_stem_elem,
        "branch_element": year_branch_elem,
        "ten_god_to_day_master": ten_god,
        "interactions_with_natal": interactions if interactions else ["Smooth transit, no major direct clashes with natal branches."]
    }

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

    # Branch interactions & Shen Sha
    branch_interactions = analyze_branch_interactions(pillars)
    shen_sha = compute_shen_sha(day_master, d_zhi, y_zhi, pillars)

    # Yong Shen (Useful God) & Current Liu Nian (Annual Pillar)
    yong_shen = compute_yong_shen(dm_elem, dm_strength, m_zhi, element_counts)
    current_year = datetime.now().year
    current_liu_nian = compute_liu_nian(current_year, day_master, pillars)

    # 4-Pillar Na Yin
    all_nayin = {
        "year": eight_char.getYearNaYin(),
        "month": eight_char.getMonthNaYin(),
        "day": eight_char.getDayNaYin(),
        "hour": eight_char.getTimeNaYin() if has_birth_time else None
    }

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
        "branch_interactions": branch_interactions,
        "shen_sha": shen_sha,
        "yong_shen": yong_shen,
        "current_liu_nian": current_liu_nian,
        "solar_terms": {
            "prev_term": prev_jie.getName() if prev_jie else None,
            "next_term": next_jie.getName() if next_jie else None,
        },
        "year_nayin": eight_char.getYearNaYin(),
        "all_nayin": all_nayin,
    }
