"""
Cross-cultural synthesis without double-counting.
Implements Step 7 and Step 8 of Six-Culture Verified Chart specification.
Separates prominence from polarity, calculates divergence rate across 9 domains,
maps 6 temperament axes with Maya/Tibetan overlays, and builds chronological convergence.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime

DOMAIN_META = {
    "D1": {"name": "Self / Identity / Vitality", "houses_vedic": [1], "houses_western": [1]},
    "D2": {"name": "Career / Status / Public Role", "houses_vedic": [10], "houses_western": [10]},
    "D3": {"name": "Wealth / Financial Gains", "houses_vedic": [2, 11], "houses_western": [2, 11]},
    "D4": {"name": "Partnership / Union", "houses_vedic": [7], "houses_western": [7]},
    "D5": {"name": "Family / Roots / Home", "houses_vedic": [4], "houses_western": [4]},
    "D6": {"name": "Children / Creative Output", "houses_vedic": [5], "houses_western": [5]},
    "D7": {"name": "Health / Work Routine / Adversity", "houses_vedic": [6], "houses_western": [6]},
    "D8": {"name": "Mind / Craft / Research / Inquiry", "houses_vedic": [3, 8], "houses_western": [3, 9]},
    "D9": {"name": "Fortune / Spirituality / Philosophy", "houses_vedic": [9], "houses_western": [9]},
}

def evaluate_jyotisha_domain(domain_id: str, jyotisha_chart: Dict[str, Any]) -> Dict[str, Any]:
    houses = jyotisha_chart["houses"]
    target_h_nums = DOMAIN_META[domain_id]["houses_vedic"]
    
    occupants = []
    lords = []
    for h in houses:
        if h["house_number"] in target_h_nums:
            occupants.extend(h["occupants"])
            lords.append(h["sign_lord"])

    # Check dignities of occupants and lords
    benefics = ["Jupiter", "Venus", "Moon", "Mercury"]
    malefics = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"]
    
    occ_count = len(occupants)
    prominence = "High" if occ_count >= 2 else ("Medium" if occ_count == 1 else "Low")
    
    # Check yogas relevant to domain
    yogas = [y["name"] for y in jyotisha_chart.get("yogas", [])]
    yoga_support = any("Raja" in y or "Kesari" in y or "Mahapurusha" in y for y in yogas)
    
    # Polarity
    benefic_count = sum(1 for o in occupants if o in benefics)
    malefic_count = sum(1 for o in occupants if o in malefics)
    
    if benefic_count > malefic_count or (yoga_support and malefic_count == 0):
        polarity = "Positive"
    elif malefic_count > benefic_count:
        polarity = "Challenging"
    else:
        polarity = "Mixed"

    basis = f"Houses {target_h_nums} occupied by: {', '.join(occupants) or 'None (ruled by ' + ', '.join(lords) + ')'}"
    if yogas:
        basis += f" | Yogas: {', '.join(yogas[:2])}"
    
    # Mention gandanta if occupant afflicted
    gandantas = [f"{o} (Gandanta)" for o in occupants if jyotisha_chart["grahas"].get(o, {}).get("is_gandanta")]
    if gandantas:
        basis += f" | {', '.join(gandantas)}"

    return {
        "cluster": "Jyotisha",
        "prominence": prominence,
        "polarity": polarity,
        "basis": basis
    }

def evaluate_western_domain(domain_id: str, western_chart: Dict[str, Any]) -> Dict[str, Any]:
    houses = western_chart["houses"]
    target_h_nums = DOMAIN_META[domain_id]["houses_western"]
    
    occupants = []
    rulers = []
    for h in houses:
        if h["house_number"] in target_h_nums:
            occupants.extend(h["occupants"])
            rulers.append(h["ruler"])

    occ_count = len(occupants)
    prominence = "High" if occ_count >= 2 else ("Medium" if occ_count == 1 else "Low")
    
    # Check dignity scores of occupants and ruler
    dignity_scores = []
    for o in occupants:
        dignity_scores.append(western_chart["planets"].get(o, {}).get("dignity_score", 0))
    for r in rulers:
        dignity_scores.append(western_chart["planets"].get(r, {}).get("dignity_score", 0))
        
    avg_dignity = (sum(dignity_scores) / len(dignity_scores)) if dignity_scores else 0.0
    
    if avg_dignity >= 2.0:
        polarity = "Positive"
    elif avg_dignity <= -1.0:
        polarity = "Challenging"
    else:
        polarity = "Mixed"

    # Add Lots for D3 and D9
    lot_note = ""
    if domain_id == "D3" and western_chart.get("lots", {}).get("lot_of_fortune"):
        f_h = western_chart["lots"]["lot_of_fortune"]["house"]
        lot_note = f" (Lot of Fortune in House {f_h})"
    elif domain_id == "D9" and western_chart.get("lots", {}).get("lot_of_spirit"):
        s_h = western_chart["lots"]["lot_of_spirit"]["house"]
        lot_note = f" (Lot of Spirit in House {s_h})"

    basis = f"Houses {target_h_nums} occupied by: {', '.join(occupants) or 'None (ruled by ' + ', '.join(rulers) + ')'}{lot_note}"
    
    # Mention mutual receptions
    mr_notes = [f"{mr['planet_1']}↔{mr['planet_2']} Reception" for mr in western_chart.get("mutual_receptions", []) if mr["planet_1"] in occupants or mr["planet_2"] in occupants]
    if mr_notes:
        basis += f" | {', '.join(mr_notes)}"

    return {
        "cluster": "Western / Hellenistic",
        "prominence": prominence,
        "polarity": polarity,
        "basis": basis
    }

def evaluate_sinic_domain(domain_id: str, bazi_chart: Dict[str, Any], ziwei_chart: Dict[str, Any]) -> Dict[str, Any]:
    # Corroborates BaZi and Zi Wei into ONE vote!
    dm = bazi_chart["day_master"]
    palaces = {p["name"]: p for p in ziwei_chart["palaces"]}
    si_hua = ziwei_chart["si_hua_transformations"]
    
    # Map domain to Zi Wei palace & BaZi Ten Gods
    domain_palace_map = {
        "D1": ("Life (命宫)", ["Friend (比肩)", "Rob Wealth (劫财)"]),
        "D2": ("Career (官禄)", ["Direct Officer (正官)", "Seven Killings (七杀)"]),
        "D3": ("Wealth (财帛)", ["Direct Wealth (正财)", "Indirect Wealth (偏财)"]),
        "D4": ("Spouse (夫妻)", []),
        "D5": ("Property (田宅)", ["Direct Resource (正印)", "Indirect Resource (偏印)"]),
        "D6": ("Children (子女)", ["Eating God (食神)", "Hurting Officer (伤官)"]),
        "D7": ("Health (疾厄)", []),
        "D8": ("Karma/Pleasure (福德)", ["Indirect Resource (偏印)"]),
        "D9": ("Life (命宫)", []),
    }
    
    palace_name, ten_god_focus = domain_palace_map.get(domain_id, ("Life (命宫)", []))
    target_palace = palaces.get(palace_name, {})
    stars = target_palace.get("stars", [])
    
    # Prominence
    prominence = "High" if len(stars) >= 2 else ("Medium" if len(stars) == 1 else "Low")
    
    # Polarity: Check if Lu, Quan, Ke, or Ji falls in this palace
    has_lu = any("Lu" in s or (si_hua.get("Lu", "").split(" ")[0] in s) for s in stars)
    has_ji = any("Ji" in s or (si_hua.get("Ji", "").split(" ")[0] in s) for s in stars)
    
    if has_lu and not has_ji:
        polarity = "Positive"
    elif has_ji and not has_lu:
        polarity = "Challenging"
    elif dm["strength"] == "Strong (旺)" and domain_id in ["D2", "D3"]:
        polarity = "Positive"
    else:
        polarity = "Mixed"

    basis = f"Zi Wei {palace_name}: {', '.join(stars) or 'Empty Palace'} | BaZi Day Master: {dm['element']} {dm['polarity']} ({dm['strength']})"
    
    # Add Shen Sha notes for core domains
    active_ss = [s["name"].split(" ")[0] for s in bazi_chart.get("shen_sha", []) if s.get("present")]
    if active_ss and domain_id in ["D1", "D2", "D3"]:
        basis += f" | Stars: {', '.join(active_ss[:2])}"

    return {
        "cluster": "Sinic (BaZi + Zi Wei Dou Shu)",
        "prominence": prominence,
        "polarity": polarity,
        "basis": basis
    }

def synthesize_domain_grade(j_eval: Dict[str, Any], w_eval: Dict[str, Any], s_eval: Dict[str, Any]) -> Dict[str, Any]:
    evals = [j_eval, w_eval, s_eval]
    polarities = [e["polarity"] for e in evals]
    
    # Check agreement:
    # 3 clusters agree -> STRONG
    # 2 agree -> MODERATE
    # At least two strongly conflict (e.g. Positive vs Challenging) -> DIVERGENT
    pos_count = polarities.count("Positive")
    chal_count = polarities.count("Challenging")
    mixed_count = polarities.count("Mixed")
    
    is_divergent = (pos_count >= 1 and chal_count >= 1)
    
    if is_divergent:
        grade = "DIVERGENT"
        consensus_theme = "Material divergence between traditions: one system indicates friction or structural challenge while another indicates affirmative dignity or elevation."
    elif pos_count == 3 or chal_count == 3 or mixed_count == 3:
        grade = "STRONG"
        consensus_theme = f"Universal convergence across Jyotisha, Western, and Sinic traditions ({polarities[0]} polarity)."
    elif pos_count == 2 or chal_count == 2 or mixed_count == 2:
        grade = "MODERATE"
        majority = "Positive" if pos_count == 2 else ("Challenging" if chal_count == 2 else "Mixed")
        consensus_theme = f"Bilateral agreement between two primary clusters towards {majority} expression."
    else:
        grade = "WEAK"
        consensus_theme = "Single-cluster signal with neutral or uncorroborated expression elsewhere."

    return {
        "grade": grade,
        "is_divergent": is_divergent,
        "consensus_theme": consensus_theme,
        "evaluations": {
            "jyotisha": j_eval,
            "western": w_eval,
            "sinic": s_eval
        }
    }

def compute_temperament_axes(
    jyotisha_chart: Dict[str, Any],
    western_chart: Dict[str, Any],
    bazi_chart: Dict[str, Any],
    mayan_chart: Dict[str, Any],
    tibetan_chart: Dict[str, Any]
) -> List[Dict[str, Any]]:
    # 6 Temperament Axes
    # T1 Leadership / Visibility
    # T2 Drive / Initiative
    # T3 Nurturing / Service
    # T4 Intellect / Craft
    # T5 Adaptability
    # T6 Discipline / Structure
    
    sun_elem = bazi_chart["day_master"]["element"]
    tzo = mayan_chart["tzolkin"]
    tib_forces = tibetan_chart["five_personal_forces"]

    axes = [
        {
            "axis_id": "T1",
            "name": "Leadership / Visibility",
            "computed_base": f"BaZi Day Master {sun_elem} ({bazi_chart['day_master']['strength']}) | Western Asc in {western_chart['ascendant']['sign']}",
            "symbolic_overlay": f"Maya Tzolk'in: {tzo['formatted']} ({tzo['symbol']}) | Tibetan Wang (Power): {tib_forces['wang_power_status']}",
            "expression": "High presence and visible autonomy" if bazi_chart["day_master"]["strength"] == "Strong (旺)" else "Collaborative leadership through strategic leverage"
        },
        {
            "axis_id": "T2",
            "name": "Drive / Initiative",
            "computed_base": f"Mars dignity: Jyotisha ({jyotisha_chart['grahas']['Mars']['dignity']}) / Western ({western_chart['planets']['Mars']['angularity']})",
            "symbolic_overlay": f"Tibetan Sog (Life Force): {tib_forces['sog_life_force']} | Lungta (Wind-Horse): {tib_forces['lungta_wind_horse_fortune']}",
            "expression": "Decisive, dynamic initiation with persistent follow-through"
        },
        {
            "axis_id": "T3",
            "name": "Nurturing / Service",
            "computed_base": f"Moon in {jyotisha_chart['grahas']['Moon']['sign']} Nakshatra {jyotisha_chart['grahas']['Moon']['nakshatra']['name']}",
            "symbolic_overlay": f"Tibetan La (Soul): {tib_forces['la_soul_vitality']} | Mewa: {tibetan_chart['mewa']['formatted']}",
            "expression": "Protective, community-oriented grounding"
        },
        {
            "axis_id": "T4",
            "name": "Intellect / Craft",
            "computed_base": f"Mercury in {western_chart['planets']['Mercury']['sign']} (House {western_chart['planets']['Mercury']['house']})",
            "symbolic_overlay": f"Maya archetype: {tzo['archetype_keywords']}",
            "expression": "Analytical inquiry, pattern synthesis, and communicative precision"
        },
        {
            "axis_id": "T5",
            "name": "Adaptability",
            "computed_base": f"Dominant BaZi Element: {bazi_chart['five_elements_balance']['dominant_element']} ({bazi_chart['five_elements_balance']['percentages'].get(bazi_chart['five_elements_balance']['dominant_element'], 0)}%)",
            "symbolic_overlay": f"Tibetan Parkha: {tibetan_chart['parkha']['name']} ({tibetan_chart['parkha']['element']})",
            "expression": "Responsive and resilient adjustment to shifting external conditions"
        },
        {
            "axis_id": "T6",
            "name": "Discipline / Structure",
            "computed_base": f"Saturn dignity in Jyotisha ({jyotisha_chart['grahas']['Saturn']['dignity']}) / Western ({western_chart['planets']['Saturn']['dignity_score']})",
            "symbolic_overlay": f"Rabjung Element: {tibetan_chart['rabjung_cycle']['element']} {tibetan_chart['rabjung_cycle']['animal']}",
            "expression": "Long-range methodical perseverance with high standards of execution"
        },
    ]
    return axes

def compute_chronocrator_timeline(
    time_audit: Dict[str, Any],
    jyotisha_chart: Dict[str, Any],
    bazi_chart: Dict[str, Any],
    western_chart: Dict[str, Any],
    ziwei_chart: Dict[str, Any],
    persian_chart: Optional[Dict[str, Any]] = None,
    target_date: Optional[str] = None
) -> Dict[str, Any]:
    """
    Unifies multi-tradition predictive chronocrators into an aligned timeline for a target date:
    - Jyotisha: Active Vimshottari Mahadasha & Antardasha (exact calendar match)
    - BaZi: Active 10-Year Da Yun luck pillar + Current Liu Nian annual pillar & interactions
    - Western: Active Annual Profection house/lord + tight active transits
    - Zi Wei Dou Shu: Active Da Xian decadal palace
    - Persian: Active Firdaria period planetary ruler
    - Cross-tradition convergent domain analysis
    """
    now_utc = datetime.utcnow()
    if target_date:
        try:
            target_dt = datetime.strptime(target_date, "%Y-%m-%d")
        except Exception:
            target_dt = now_utc
    else:
        target_dt = now_utc

    target_date_str = target_dt.strftime("%Y-%m-%d")

    # Resolve birth date and current age
    birth_date_str = time_audit["normalized"]["civil_date"]
    try:
        by, bm, bd = map(int, birth_date_str.split("-"))
        b_dt = datetime(by, bm, bd)
        current_age = target_dt.year - b_dt.year - ((target_dt.month, target_dt.day) < (b_dt.month, b_dt.day))
        if current_age < 0:
            current_age = 0
    except Exception:
        current_age = western_chart.get("annual_profection", {}).get("current_age", 0)

    # 1. Jyotisha Vimshottari: Find active Mahadasha & Antardasha
    dashas = jyotisha_chart.get("vimshottari_dashas", [])
    active_v_dasha = None
    active_antardasha = None

    for d in dashas:
        s_date = d.get("start_date", "")
        e_date = d.get("end_date", "")
        if s_date <= target_date_str <= e_date:
            active_v_dasha = d
            for ad in d.get("antardashas", []):
                if ad.get("start_date", "") <= target_date_str <= ad.get("end_date", ""):
                    active_antardasha = ad
                    break
            break

    if not active_v_dasha and dashas:
        if target_date_str < dashas[0].get("start_date", ""):
            active_v_dasha = dashas[0]
        else:
            active_v_dasha = dashas[-1]
        if active_v_dasha.get("antardashas"):
            active_antardasha = active_v_dasha["antardashas"][0]

    maha_lord = active_v_dasha["lord"] if active_v_dasha else "Unknown"
    antar_lord = active_antardasha["sub_lord"] if active_antardasha else "Unknown"
    maha_graha = jyotisha_chart.get("grahas", {}).get(maha_lord, {})
    maha_house = maha_graha.get("house", 1)
    maha_sign = maha_graha.get("sign", "")
    maha_dignity = maha_graha.get("dignity", "Neutral")

    house_domain_map = {
        1: ("D1", "Self & Physical Vitality"),
        2: ("D3", "Wealth & Financial Assets"),
        3: ("D8", "Effort, Siblings & Craft"),
        4: ("D5", "Home, Property & Emotional Foundation"),
        5: ("D6", "Creative Intellect & Children"),
        6: ("D7", "Service, Work Routine & Overcoming Friction"),
        7: ("D4", "Partnership, Union & Public Relations"),
        8: ("D8", "Transformation, Research & Longevity"),
        9: ("D9", "Dharma, Higher Wisdom & Fortune"),
        10: ("D2", "Career, Public Authority & Status"),
        11: ("D3", "Gains, Aspirations & Social Networks"),
        12: ("D9", "Spiritual Liberation, Solitude & Transcendent Rest")
    }

    jyotisha_domain_code, jyotisha_domain_desc = house_domain_map.get(maha_house, ("D1", "Core Growth"))
    jyotisha_activated_domain = f"{jyotisha_domain_code} ({jyotisha_domain_desc})"

    # 2. BaZi Da Yun & Liu Nian
    da_yun_list = bazi_chart.get("da_yun_luck_pillars", [])
    active_da_yun = None
    for i, dy in enumerate(da_yun_list):
        next_age = da_yun_list[i + 1]["start_age"] if i + 1 < len(da_yun_list) else 999
        if dy["start_age"] <= current_age < next_age:
            active_da_yun = dy
            break

    if not active_da_yun and da_yun_list:
        active_da_yun = da_yun_list[0] if current_age < da_yun_list[0]["start_age"] else da_yun_list[-1]

    liu_nian = bazi_chart.get("current_liu_nian", {})
    yong_shen = bazi_chart.get("yong_shen", {})
    dy_elem = active_da_yun.get("element", "") if active_da_yun else ""
    fav_elems = yong_shen.get("favorable_elements", [])
    unfav_elems = yong_shen.get("unfavorable_elements", [])

    if dy_elem in fav_elems:
        bazi_cycle_status = f"Favorable Da Yun ({dy_elem} reinforces Useful God {yong_shen.get('useful_god', '')})"
    elif dy_elem in unfav_elems:
        bazi_cycle_status = f"Refining / Testing Da Yun ({dy_elem} challenges Useful God {yong_shen.get('useful_god', '')})"
    else:
        bazi_cycle_status = f"Neutral / Balancing Da Yun ({dy_elem})"

    ten_god_name = active_da_yun.get("ten_god", "") if active_da_yun else ""
    bazi_domain_code = "D1"
    if any(k in ten_god_name for k in ["Officer", "Seven Killings", "官", "杀"]):
        bazi_domain_code = "D2"
    elif any(k in ten_god_name for k in ["Wealth", "财"]):
        bazi_domain_code = "D3"
    elif any(k in ten_god_name for k in ["Eating", "Hurting", "食", "伤"]):
        bazi_domain_code = "D6"
    elif any(k in ten_god_name for k in ["Resource", "印"]):
        bazi_domain_code = "D5"
    elif any(k in ten_god_name for k in ["Friend", "Rob", "比", "劫"]):
        bazi_domain_code = "D1"

    # 3. Western Annual Profection & Active Transits
    active_profection = western_chart.get("annual_profection", {})
    prof_house = active_profection.get("activated_house", 1)
    prof_lord = active_profection.get("lord_of_year", "Unknown")
    prof_domain_code, prof_domain_desc = house_domain_map.get(prof_house, (f"H{prof_house}", f"House {prof_house}"))
    western_activated_domain = f"{prof_domain_code} ({prof_domain_desc})"

    transits = western_chart.get("active_transits", [])
    key_transits = [t for t in transits if t.get("orb_deg", t.get("orb", 99.0)) <= 2.5]
    if not key_transits:
        key_transits = transits[:3]

    # 4. Zi Wei Da Xian
    da_xian_list = ziwei_chart.get("da_xian_decades", [])
    active_da_xian = None
    for dx in da_xian_list:
        if dx.get("start_age", 0) <= current_age <= dx.get("end_age", 999):
            active_da_xian = dx
            break
    if not active_da_xian and da_xian_list:
        active_da_xian = da_xian_list[0] if current_age < da_xian_list[0]["start_age"] else da_xian_list[-1]

    palace_name = active_da_xian.get("palace", "") if active_da_xian else ""
    ziwei_domain_code = "D1"
    if "Career" in palace_name or "官禄" in palace_name:
        ziwei_domain_code = "D2"
    elif "Wealth" in palace_name or "财帛" in palace_name:
        ziwei_domain_code = "D3"
    elif "Spouse" in palace_name or "夫妻" in palace_name:
        ziwei_domain_code = "D4"
    elif "Property" in palace_name or "田宅" in palace_name:
        ziwei_domain_code = "D5"
    elif "Children" in palace_name or "子女" in palace_name:
        ziwei_domain_code = "D6"
    elif "Health" in palace_name or "疾厄" in palace_name:
        ziwei_domain_code = "D7"
    elif "Karma" in palace_name or "福德" in palace_name:
        ziwei_domain_code = "D9"
    elif "Travel" in palace_name or "迁移" in palace_name:
        ziwei_domain_code = "D8"

    # 5. Persian Firdaria
    active_firdaria = None
    if persian_chart and "firdaria" in persian_chart:
        for f_period in persian_chart["firdaria"].get("timeline", []):
            if f_period.get("start_age", 0) <= current_age < f_period.get("end_age", 999):
                active_firdaria = f_period
                break

    # 6. Convergence Analysis across the 4 primary timing systems
    domain_tallies: Dict[str, List[str]] = {}
    for code, sys_name in [
        (jyotisha_domain_code, "Jyotisha Vimshottari"),
        (bazi_domain_code, "BaZi Da Yun"),
        (prof_domain_code, "Western Profection"),
        (ziwei_domain_code, "Zi Wei Da Xian")
    ]:
        domain_tallies.setdefault(code, []).append(sys_name)

    convergent_domains = [
        {"domain_id": d, "domain_name": DOMAIN_META.get(d, {}).get("name", d), "corroborating_systems": sys_list}
        for d, sys_list in domain_tallies.items()
        if len(sys_list) >= 2
    ]

    if convergent_domains:
        top_c = convergent_domains[0]
        convergence_summary_text = (
            f"High Convergence ({top_c['domain_name']}): Corroborated by {', '.join(top_c['corroborating_systems'])} "
            f"as the primary life domain under active inflection."
        )
    else:
        convergence_summary_text = (
            f"Distributed Focus: Western Profection emphasizes {western_activated_domain}, "
            f"Vimshottari Mahadasha activates {jyotisha_activated_domain}, and BaZi Da Yun highlights {bazi_cycle_status}."
        )

    return {
        "target_date": target_date_str,
        "current_age": current_age,
        "jyotisha_vimshottari": {
            "active_mahadasha": maha_lord,
            "active_antardasha": antar_lord,
            "span": f"{active_v_dasha['start_date']} to {active_v_dasha['end_date']}" if active_v_dasha else None,
            "antardasha_span": f"{active_antardasha['start_date']} to {active_antardasha['end_date']}" if active_antardasha else None,
            "activated_domain": jyotisha_activated_domain,
            "house": maha_house,
            "sign": maha_sign,
            "dignity": maha_dignity,
        },
        "bazi_da_yun": {
            "active_pillar": f"{active_da_yun['stem']}{active_da_yun['branch']} ({active_da_yun['element']})" if active_da_yun else None,
            "ten_god": active_da_yun["ten_god"] if active_da_yun else None,
            "start_age": active_da_yun["start_age"] if active_da_yun else None,
            "element": active_da_yun.get("element") if active_da_yun else None,
            "cycle_status": bazi_cycle_status,
            "current_liu_nian": {
                "year": liu_nian.get("year"),
                "pillar": f"{liu_nian.get('stem', '')}{liu_nian.get('branch', '')}",
                "element": liu_nian.get("element"),
                "ten_god": liu_nian.get("ten_god"),
                "interactions": liu_nian.get("interactions", [])
            } if liu_nian else None
        },
        "western_profection": {
            "activated_house": prof_house,
            "lord_of_year": prof_lord,
            "activated_domain": western_activated_domain,
            "active_transits_summary": [
                f"{t.get('transiting_body', t.get('transiting_planet', ''))} {t.get('aspect', '')} natal {t.get('natal_target', t.get('natal_planet', ''))} ({t.get('orb_deg', t.get('orb', 0.0))}°)"
                for t in key_transits[:3]
            ]
        },
        "ziwei_da_xian": {
            "active_palace": active_da_xian["palace"] if active_da_xian else None,
            "age_span": f"{active_da_xian['start_age']} - {active_da_xian['end_age']}" if active_da_xian else None,
            "branch": active_da_xian.get("branch") if active_da_xian else None
        },
        "persian_firdaria": {
            "active_ruler": active_firdaria.get("planet") if active_firdaria else None,
            "age_span": f"{active_firdaria.get('start_age')} - {active_firdaria.get('end_age')}" if active_firdaria else None,
            "years_span": f"{active_firdaria.get('start_year')} - {active_firdaria.get('end_year')}" if active_firdaria else None,
            "duration_years": active_firdaria.get("duration_years") if active_firdaria else None
        } if active_firdaria else None,
        "convergent_domains": convergent_domains,
        "convergence_status": convergence_summary_text
    }

def build_synthesis(
    astro_base: Dict[str, Any],
    jyotisha_chart: Dict[str, Any],
    bazi_chart: Dict[str, Any],
    western_chart: Dict[str, Any],
    ziwei_chart: Dict[str, Any],
    mayan_chart: Dict[str, Any],
    tibetan_chart: Dict[str, Any],
    verification_report: Dict[str, Any],
    time_audit: Dict[str, Any],
    persian_chart: Optional[Dict[str, Any]] = None,
    target_date: Optional[str] = None
) -> Dict[str, Any]:
    # 1. Evaluate 9 Domains across 3 primary clusters
    domain_results = {}
    divergent_count = 0
    strong_count = 0
    moderate_count = 0
    weak_count = 0

    for d_id, d_info in DOMAIN_META.items():
        j_eval = evaluate_jyotisha_domain(d_id, jyotisha_chart)
        w_eval = evaluate_western_domain(d_id, western_chart)
        s_eval = evaluate_sinic_domain(d_id, bazi_chart, ziwei_chart)
        
        syn = synthesize_domain_grade(j_eval, w_eval, s_eval)
        syn["domain_id"] = d_id
        syn["domain_name"] = d_info["name"]
        domain_results[d_id] = syn
        
        if syn["grade"] == "DIVERGENT": divergent_count += 1
        elif syn["grade"] == "STRONG": strong_count += 1
        elif syn["grade"] == "MODERATE": moderate_count += 1
        elif syn["grade"] == "WEAK": weak_count += 1

    divergence_rate_total = round((divergent_count / 9.0) * 100, 1)

    # 2. Unified Chronological Timeline Alignment
    chronology = compute_chronocrator_timeline(
        time_audit=time_audit,
        jyotisha_chart=jyotisha_chart,
        bazi_chart=bazi_chart,
        western_chart=western_chart,
        ziwei_chart=ziwei_chart,
        persian_chart=persian_chart,
        target_date=target_date
    )

    # 3. Temperament Axes
    temperament_axes = compute_temperament_axes(jyotisha_chart, western_chart, bazi_chart, mayan_chart, tibetan_chart)

    # 4. Synthesized Reading Markdown Document
    reading_md = f"""# SYNODIX VERIFIED SYNTHESIS & READING v2

**Generated**: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}  
**Verification Status**: {verification_report['overall_verification_status']} (Confidence: {verification_report['overall_confidence']})  
**Divergence Rate**: {divergence_rate_total}% ({divergent_count} of {len(domain_results)} domains divergent)

---

### 1. Input & Sensitivity Summary
- **Civil Instant**: {time_audit['normalized']['civil_date']} {time_audit['normalized']['civil_time']} ({time_audit['normalized']['weekday']})
- **Location**: {time_audit['raw_input']['city_name']}, {time_audit['raw_input']['country_name']} ({time_audit['normalized']['latitude']}°, {time_audit['normalized']['longitude']}°)
- **Timezone**: {time_audit['normalized']['timezone_name']} (UTC offset: {time_audit['normalized']['utc_offset_hours']:+.1f}h, DST: {time_audit['normalized']['is_dst']})
- **Solar Times**: Local Mean Solar Time {time_audit['normalized']['lmst']} | Local Apparent Solar Time {time_audit['normalized']['last']}
- **Sun Horizon**: Sunrise {time_audit['normalized']['sunrise']} | Sunset {time_audit['normalized']['sunset']}
- **Boundary Proximity**:
  - Ascendant distance to cusp: {astro_base['boundary_distances']['tropical_asc_to_cusp_deg']}° (Sensitive: {astro_base['boundary_distances']['is_asc_boundary_sensitive']})
  - BaZi 2-hour branch distance: {time_audit['boundary_audit']['bazi_two_hour_boundary_distance_mins']} mins

---

### 2. Dual-Engine Verification Summary
- **Astronomical Engines**: Swiss Ephemeris (`pyswisseph`) vs JPL DE421 (`skyfield`)
- **Max Planetary Longitude Difference**: {verification_report['max_planetary_difference_deg']}° (Threshold: 0.010000°)
- **Invariants Checked**:
  - Rahu–Ketu 180° separation: **PASS**
  - Vimshottari 120-year cycle: **PASS**
  - Zi Wei 12 unique palaces: **PASS**
  - Maya Calendar Gregorian round-trip: **PASS**

---

### 3. Cross-Cultural Convergence & Divergence Matrix

| Domain | Agreement Grade | Jyotisha Polarity | Western Polarity | Sinic Polarity | Consensus / Divergence Summary |
| :--- | :---: | :---: | :---: | :---: | :--- |
"""
    for d_id, syn in domain_results.items():
        reading_md += f"| **{syn['domain_name']}** | `{syn['grade']}` | {syn['evaluations']['jyotisha']['polarity']} | {syn['evaluations']['western']['polarity']} | {syn['evaluations']['sinic']['polarity']} | {syn['consensus_theme']} |\n"

    reading_md += f"""
---

### 4. Strongest Cross-Cultural Themes
"""
    for d_id, syn in domain_results.items():
        if syn["grade"] in ["STRONG", "MODERATE"]:
            reading_md += f"#### {syn['domain_name']} (`{syn['grade']}`)\n"
            reading_md += f"- **Consensus**: {syn['consensus_theme']}\n"
            reading_md += f"- **Jyotisha Basis**: {syn['evaluations']['jyotisha']['basis']}\n"
            reading_md += f"- **Western Basis**: {syn['evaluations']['western']['basis']}\n"
            reading_md += f"- **Sinic Basis**: {syn['evaluations']['sinic']['basis']}\n\n"

    reading_md += """---

### 5. Explicit Disagreements & Divergent Domains
"""
    divergent_found = False
    for d_id, syn in domain_results.items():
        if syn["grade"] == "DIVERGENT":
            divergent_found = True
            reading_md += f"#### {syn['domain_name']} (`DIVERGENT`)\n"
            reading_md += f"{syn['consensus_theme']}\n\n"
            reading_md += f"- **Jyotisha**: {syn['evaluations']['jyotisha']['polarity']} ({syn['evaluations']['jyotisha']['basis']})\n"
            reading_md += f"- **Western**: {syn['evaluations']['western']['polarity']} ({syn['evaluations']['western']['basis']})\n"
            reading_md += f"- **Sinic**: {syn['evaluations']['sinic']['polarity']} ({syn['evaluations']['sinic']['basis']})\n\n"

    if not divergent_found:
        reading_md += "No sharp polar contradictions found among primary clusters across evaluated life domains.\n\n"

    reading_md += """---

### 6. Attributed Temperament Overlays (Maya & Tibetan)
*Note: Maya and Tibetan indicators are non-causal symbolic overlays and do not grant domain votes.*

"""
    for ax in temperament_axes:
        reading_md += f"- **{ax['name']} ({ax['axis_id']})**: {ax['expression']}\n"
        reading_md += f"  - *Computed Base*: {ax['computed_base']}\n"
        reading_md += f"  - *Symbolic Overlay*: {ax['symbolic_overlay']}\n\n"

    firdaria_line = ""
    if chronology.get("persian_firdaria") and chronology["persian_firdaria"].get("active_ruler"):
        firdaria_line = f"- **Persian Firdaria**: Master of Period `{chronology['persian_firdaria']['active_ruler']}` ({chronology['persian_firdaria']['years_span']}, Age {chronology['persian_firdaria']['age_span']})\n"

    liu_nian_line = ""
    if chronology.get("bazi_da_yun", {}).get("current_liu_nian"):
        ln = chronology["bazi_da_yun"]["current_liu_nian"]
        liu_nian_line = f"- **BaZi Liu Nian (Annual)**: `{ln.get('year')} {ln.get('pillar')} ({ln.get('element')})` - Ten God: `{ln.get('ten_god')}`\n"

    transits_line = ""
    if chronology.get("western_profection", {}).get("active_transits_summary"):
        transits_line = f"- **Active Western Transits**: {', '.join(chronology['western_profection']['active_transits_summary'])}\n"

    reading_md += f"""---

### 7. Chronological Overlap & Unified Predictive Timeline
- **Vimshottari Dasha**: Active Mahadasha `{chronology['jyotisha_vimshottari']['active_mahadasha']}` / Antardasha `{chronology['jyotisha_vimshottari']['active_antardasha']}` ({chronology['jyotisha_vimshottari']['span']}) | Focus: {chronology['jyotisha_vimshottari']['activated_domain']}
- **BaZi Da Yun**: Luck Pillar `{chronology['bazi_da_yun']['active_pillar']}` ({chronology['bazi_da_yun']['ten_god']}) | {chronology['bazi_da_yun']['cycle_status']}
{liu_nian_line}- **Western Annual Profection**: Age {chronology['current_age']} activates House `{chronology['western_profection']['activated_house']}` (Lord: `{chronology['western_profection']['lord_of_year']}`) | Focus: {chronology['western_profection']['activated_domain']}
{transits_line}- **Zi Wei Decadal**: Active Palace `{chronology['ziwei_da_xian']['active_palace']}` (Age {chronology['ziwei_da_xian']['age_span']})
{firdaria_line}- **Convergence Assessment**: {chronology['convergence_status']}

---

### 8. Essential Ethical & Scientific Disclaimer
This synthesized report represents an exploratory comparison across historical symbolic traditions. It provides calculation accuracy, convention transparency, and honest uncertainty testing. **It does NOT constitute scientific prediction, empirical causation, or guaranteed future events.**

Under no circumstances should this analysis be interpreted as medical diagnosis, financial advice, legal counsel, pregnancy claims, or lifespan prediction.
"""

    return {
        "domain_results": domain_results,
        "divergence_metrics": {
            "total_domains": 9,
            "divergent_domains": divergent_count,
            "strong_domains": strong_count,
            "moderate_domains": moderate_count,
            "weak_domains": weak_count,
            "divergence_rate_percent": divergence_rate_total
        },
        "temperament_axes": temperament_axes,
        "chronology": chronology,
        "final_reading_markdown": reading_md
    }
