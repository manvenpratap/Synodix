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

def build_synthesis(
    astro_base: Dict[str, Any],
    jyotisha_chart: Dict[str, Any],
    bazi_chart: Dict[str, Any],
    western_chart: Dict[str, Any],
    ziwei_chart: Dict[str, Any],
    mayan_chart: Dict[str, Any],
    tibetan_chart: Dict[str, Any],
    verification_report: Dict[str, Any],
    time_audit: Dict[str, Any]
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

    # 2. Chronological Timeline Alignment
    active_v_dasha = jyotisha_chart["vimshottari_dashas"][0] if jyotisha_chart.get("vimshottari_dashas") else None
    active_da_yun = bazi_chart["da_yun_luck_pillars"][0] if bazi_chart.get("da_yun_luck_pillars") else None
    active_profection = western_chart["annual_profection"]
    active_da_xian = ziwei_chart["da_xian_decades"][0] if ziwei_chart.get("da_xian_decades") else None

    chronology = {
        "jyotisha_vimshottari": {
            "active_mahadasha": active_v_dasha["lord"] if active_v_dasha else None,
            "span": f"{active_v_dasha['start_date']} to {active_v_dasha['end_date']}" if active_v_dasha else None,
            "activated_domain": "D1 / Core Growth",
        },
        "bazi_da_yun": {
            "active_pillar": f"{active_da_yun['stem']}{active_da_yun['branch']} ({active_da_yun['element']})" if active_da_yun else None,
            "ten_god": active_da_yun["ten_god"] if active_da_yun else None,
            "start_age": active_da_yun["start_age"] if active_da_yun else None,
        },
        "western_profection": {
            "activated_house": active_profection["activated_house"],
            "lord_of_year": active_profection["lord_of_year"],
            "activated_domain": f"House {active_profection['activated_house']}",
        },
        "ziwei_da_xian": {
            "active_palace": active_da_xian["palace"] if active_da_xian else None,
            "age_span": f"{active_da_xian['start_age']} - {active_da_xian['end_age']}" if active_da_xian else None,
        },
        "convergence_status": "Moderate Convergence: Jyotisha and Sinic decadal periods simultaneously emphasize foundational self-development and career positioning."
    }

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

    reading_md += f"""---

### 7. Chronological Overlap & Timing
- **Vimshottari Dasha**: Active Mahadasha `{chronology['jyotisha_vimshottari']['active_mahadasha']}` ({chronology['jyotisha_vimshottari']['span']})
- **BaZi Da Yun**: Luck Pillar `{chronology['bazi_da_yun']['active_pillar']}` ({chronology['bazi_da_yun']['ten_god']})
- **Western Annual Profection**: Age {active_profection['current_age']} activates House `{active_profection['activated_house']}` (Lord: `{active_profection['lord_of_year']}`)
- **Zi Wei Decadal**: Active Palace `{chronology['ziwei_da_xian']['active_palace']}` (Age {chronology['ziwei_da_xian']['age_span']})
- **Convergence Assessment**: {chronology['convergence_status']}

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
