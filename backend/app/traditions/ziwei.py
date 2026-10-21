"""
Zi Wei Dou Shu (Purple Star Astrology) deterministic calculation module.
Computes 12 Palaces (Ming, Shen, etc.), Five Elements Bureau,
14 Major Stars, Four Transformations (Si Hua), and Decadal Periods (Da Xian).
Follows Step 4E of Six-Culture Verified Chart specification.
"""

from typing import Dict, Any, List
from lunar_python import Solar

BRANCHES = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"]
ALL_12_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]

PALACE_NAMES = [
    "Life (命宫)", "Siblings (兄弟)", "Spouse (夫妻)", "Children (子女)",
    "Wealth (财帛)", "Health (疾厄)", "Travel (迁移)", "Friends (交友)",
    "Career (官禄)", "Property (田宅)", "Karma/Pleasure (福德)", "Parents (父母)"
]

# Si Hua (Four Transformations) per Year Stem: (Lu, Quan, Ke, Ji)
SI_HUA = {
    "甲": {"Lu": "廉贞 (Lian Zhen)", "Quan": "破军 (Po Jun)", "Ke": "武曲 (Wu Qu)", "Ji": "太阳 (Tai Yang)"},
    "乙": {"Lu": "天机 (Tian Ji)", "Quan": "天梁 (Tian Liang)", "Ke": "紫微 (Zi Wei)", "Ji": "太阴 (Tai Yin)"},
    "丙": {"Lu": "天同 (Tian Tong)", "Quan": "天机 (Tian Ji)", "Ke": "文昌 (Wen Chang)", "Ji": "廉贞 (Lian Zhen)"},
    "丁": {"Lu": "太阴 (Tai Yin)", "Quan": "天同 (Tian Tong)", "Ke": "天机 (Tian Ji)", "Ji": "巨门 (Ju Men)"},
    "戊": {"Lu": "贪狼 (Tan Lang)", "Quan": "太阴 (Tai Yin)", "Ke": "右弼 (You Bi)", "Ji": "天机 (Tian Ji)"},
    "己": {"Lu": "武曲 (Wu Qu)", "Quan": "贪狼 (Tan Lang)", "Ke": "天梁 (Tian Liang)", "Ji": "文曲 (Wen Qu)"},
    "庚": {"Lu": "太阳 (Tai Yang)", "Quan": "武曲 (Wu Qu)", "Ke": "太阴 (Tai Yin)", "Ji": "天同 (Tian Tong)"},
    "辛": {"Lu": "巨门 (Ju Men)", "Quan": "太阳 (Tai Yang)", "Ke": "文曲 (Wen Qu)", "Ji": "文昌 (Wen Chang)"},
    "壬": {"Lu": "天梁 (Tian Liang)", "Quan": "紫微 (Zi Wei)", "Ke": "左辅 (Zuo Fu)", "Ji": "武曲 (Wu Qu)"},
    "癸": {"Lu": "破军 (Po Jun)", "Quan": "巨门 (Ju Men)", "Ke": "太阴 (Tai Yin)", "Ji": "贪狼 (Tan Lang)"},
}

# Five Elements Bureau table based on (Year Stem, Ming Branch)
# Branches mapped into pairs: Zi/Chou, Yin/Mao, Chen/Si, Wu/Wei, Shen/You, Xu/Hai
BUREAU_NAMES = {
    2: "Water 2nd Bureau (水二局)",
    3: "Wood 3rd Bureau (木三局)",
    4: "Metal 4th Bureau (金四局)",
    5: "Earth 5th Bureau (土五局)",
    6: "Fire 6th Bureau (火六局)",
}

# 14 Major Stars Brightness / Radiance matrix across 12 Earthly Branches
# 庙 (Miao = Peak), 旺 (Wang = Flourishing), 得 (De = Favorable), 利 (Li = Beneficial), 平 (Ping = Neutral), 陷 (Xian = Trapped)
STAR_BRIGHTNESS = {
    "紫微": {"子": "平", "丑": "庙", "寅": "庙", "卯": "旺", "辰": "得", "巳": "旺", "午": "庙", "未": "庙", "申": "旺", "酉": "旺", "戌": "得", "亥": "旺"},
    "天机": {"子": "庙", "丑": "陷", "寅": "得", "卯": "旺", "辰": "利", "巳": "平", "午": "庙", "未": "陷", "申": "得", "酉": "旺", "戌": "利", "亥": "平"},
    "太阳": {"子": "陷", "丑": "得", "寅": "旺", "卯": "庙", "辰": "庙", "巳": "庙", "午": "庙", "未": "得", "申": "得", "酉": "平", "戌": "陷", "亥": "陷"},
    "武曲": {"子": "旺", "丑": "庙", "寅": "得", "卯": "利", "辰": "庙", "巳": "平", "午": "旺", "未": "庙", "申": "得", "酉": "利", "戌": "庙", "亥": "平"},
    "天同": {"子": "旺", "丑": "陷", "寅": "利", "卯": "利", "辰": "平", "巳": "庙", "午": "陷", "未": "陷", "申": "旺", "酉": "平", "戌": "平", "亥": "庙"},
    "廉贞": {"子": "平", "丑": "利", "寅": "庙", "卯": "平", "辰": "旺", "巳": "陷", "午": "平", "未": "利", "申": "庙", "酉": "平", "戌": "旺", "亥": "陷"},
    "天府": {"子": "庙", "丑": "庙", "寅": "庙", "卯": "得", "辰": "庙", "巳": "得", "午": "旺", "未": "庙", "申": "得", "酉": "旺", "戌": "庙", "亥": "得"},
    "太阴": {"子": "庙", "丑": "庙", "寅": "平", "卯": "陷", "辰": "陷", "巳": "陷", "午": "陷", "未": "平", "申": "利", "酉": "旺", "戌": "旺", "亥": "庙"},
    "贪狼": {"子": "旺", "丑": "庙", "寅": "平", "卯": "利", "辰": "庙", "巳": "陷", "午": "旺", "未": "庙", "申": "平", "酉": "利", "戌": "庙", "亥": "陷"},
    "巨门": {"子": "旺", "丑": "平", "寅": "庙", "卯": "庙", "辰": "陷", "巳": "平", "午": "旺", "未": "平", "申": "庙", "酉": "庙", "戌": "陷", "亥": "旺"},
    "天相": {"子": "庙", "丑": "庙", "寅": "庙", "卯": "陷", "辰": "得", "巳": "得", "午": "旺", "未": "得", "申": "庙", "酉": "陷", "戌": "得", "亥": "得"},
    "天梁": {"子": "庙", "丑": "旺", "寅": "庙", "卯": "庙", "辰": "旺", "巳": "陷", "午": "庙", "未": "旺", "申": "陷", "酉": "得", "戌": "旺", "亥": "陷"},
    "七杀": {"子": "旺", "丑": "庙", "寅": "庙", "卯": "平", "辰": "得", "巳": "平", "午": "旺", "未": "庙", "申": "庙", "酉": "平", "戌": "得", "亥": "平"},
    "破军": {"子": "庙", "丑": "旺", "寅": "得", "卯": "陷", "辰": "旺", "巳": "得", "午": "庙", "未": "旺", "申": "得", "酉": "陷", "戌": "旺", "亥": "得"},
}

def get_star_radiance(s_name: str, branch: str) -> str:
    """Returns brightness tier: 庙 (Miao), 旺 (Wang), 得 (De), 利 (Li), 平 (Ping), 陷 (Xian)"""
    for prefix, table in STAR_BRIGHTNESS.items():
        if prefix in s_name:
            return table.get(branch, "平")
    return "平"

def get_bureau(year_stem: str, ming_branch: str) -> int:
    """Calculates Five Elements Bureau (2..6)"""
    # Stem index (0..4 based on 5 pairs)
    stem_group = (STEMS.index(year_stem)) % 5
    # Branch pairs: Zi/Chou=0, Yin/Mao=1, Chen/Si=2, Wu/Wei=3, Shen/You=4, Xu/Hai=5
    b_idx = ALL_12_BRANCHES.index(ming_branch)
    pair = b_idx // 2
    
    # Standard Liu Ren / Zi Wei bureau matrix
    matrix = [
        [2, 6, 5, 3, 4, 2],  # Jia/Ji
        [6, 5, 3, 4, 2, 6],  # Yi/Geng
        [5, 3, 4, 2, 6, 5],  # Bing/Xin
        [3, 4, 2, 6, 5, 3],  # Ding/Ren
        [4, 2, 6, 5, 3, 4],  # Wu/Gui
    ]
    return matrix[stem_group][pair]

def get_ziwei_branch(bureau: int, lunar_day: int) -> str:
    """Finds Earthly Branch of Zi Wei star from Bureau and Lunar Day"""
    # Canonical rule: Quotient = day // bureau, Remainder = day % bureau
    rem = lunar_day % bureau
    quot = lunar_day // bureau
    
    if rem == 0:
        # Start at Yin (index 0 in BRANCHES) and count forward (quot - 1)
        target_idx = (quot - 1) % 12
    else:
        add = bureau - rem
        if add % 2 == 1:
            # Odd: step backward add steps from (quot + 1)
            target_idx = (quot + 1 - 1 - add) % 12
        else:
            # Even: step forward add steps from (quot + 1)
            target_idx = (quot + 1 - 1 + add) % 12
            
    return BRANCHES[target_idx]

def compute_ziwei_chart(
    year: int, month: int, day: int,
    hour: int, minute: int, second: int = 0,
    gender: str = "male",
    has_birth_time: bool = True
) -> Dict[str, Any]:
    solar = Solar.fromYmdHms(year, month, day, hour, minute, second)
    lunar = solar.getLunar()
    eight_char = lunar.getEightChar()
    
    y_stem = eight_char.getYearGan()
    y_branch = eight_char.getYearZhi()
    
    lunar_m = abs(lunar.getMonth())
    lunar_d = lunar.getDay()
    
    # Hour branch index in ALL_12_BRANCHES
    if has_birth_time:
        h_branch = eight_char.getTimeZhi()
        h_idx_all = ALL_12_BRANCHES.index(h_branch)  # Zi = 0, Chou = 1, etc.
    else:
        h_branch = "午"  # Default noon (Wu)
        h_idx_all = 6

    # 1. Ming and Shen Palace branches
    # Count starting at Yin (寅, which is index 2 in ALL_12_BRANCHES):
    # Step forward (month - 1) branches, then step backward (hour_branch_idx) branches for Ming
    yin_idx = 2
    month_step = (yin_idx + (lunar_m - 1)) % 12
    ming_idx = (month_step - h_idx_all) % 12
    shen_idx = (month_step + h_idx_all) % 12
    
    ming_branch = ALL_12_BRANCHES[ming_idx]
    shen_branch = ALL_12_BRANCHES[shen_idx]

    # 2. Five Elements Bureau
    bureau_num = get_bureau(y_stem, ming_branch)
    bureau_name = BUREAU_NAMES[bureau_num]

    # 3. 12 Palaces counter-clockwise from Ming
    # In Zi Wei, palaces are ordered counter-clockwise: Ming -> Siblings -> Spouse ...
    palaces = []
    palace_branch_map = {}
    for i in range(12):
        p_name = PALACE_NAMES[i]
        b = ALL_12_BRANCHES[(ming_idx - i) % 12]
        palaces.append({
            "name": p_name,
            "branch": b,
            "stars": [],
            "star_details": [],
            "is_ming": (i == 0),
            "is_shen": (b == shen_branch)
        })
        palace_branch_map[b] = palaces[-1]

    # 4. Star Placements (14 Major Stars) with Radiance Rating
    zw_branch = get_ziwei_branch(bureau_num, lunar_d)
    zw_idx = ALL_12_BRANCHES.index(zw_branch)
    
    # Zi Wei group (counter-clockwise step)
    # Zi Wei, Tian Ji (-1), Tai Yang (-3), Wu Qu (-4), Tian Tong (-5), Lian Zhen (-8)
    zw_group = [
        ("紫微 (Zi Wei)", 0),
        ("天机 (Tian Ji)", -1),
        ("太阳 (Tai Yang)", -3),
        ("武曲 (Wu Qu)", -4),
        ("天同 (Tian Tong)", -5),
        ("廉贞 (Lian Zhen)", -8),
    ]
    for s_name, step in zw_group:
        b = ALL_12_BRANCHES[(zw_idx + step) % 12]
        if b in palace_branch_map:
            rad = get_star_radiance(s_name, b)
            palace_branch_map[b]["stars"].append(f"{s_name} [{rad}]")
            palace_branch_map[b]["star_details"].append({
                "name": s_name,
                "radiance": rad,
                "category": "major"
            })

    # Tian Fu group (symmetrical to Zi Wei across Yin-Shen axis)
    # Tian Fu branch = (4 - zw_idx) % 12 in ALL_12_BRANCHES
    tf_idx = (4 - zw_idx) % 12
    # Tian Fu group steps clockwise:
    # Tian Fu (0), Tai Yin (+1), Tan Lang (+2), Ju Men (+3), Tian Xiang (+4), Tian Liang (+5), Qi Sha (+6), Po Jun (+10)
    tf_group = [
        ("天府 (Tian Fu)", 0),
        ("太阴 (Tai Yin)", 1),
        ("贪狼 (Tan Lang)", 2),
        ("巨门 (Ju Men)", 3),
        ("天相 (Tian Xiang)", 4),
        ("天梁 (Tian Liang)", 5),
        ("七杀 (Qi Sha)", 6),
        ("破军 (Po Jun)", 10),
    ]
    for s_name, step in tf_group:
        b = ALL_12_BRANCHES[(tf_idx + step) % 12]
        if b in palace_branch_map:
            rad = get_star_radiance(s_name, b)
            palace_branch_map[b]["stars"].append(f"{s_name} [{rad}]")
            palace_branch_map[b]["star_details"].append({
                "name": s_name,
                "radiance": rad,
                "category": "major"
            })

    # 5. Auxiliary Stars Placements (6 Auspicious + 4 Malefic + Lu Cun)
    auxiliary_placements = []
    
    # (a) Wen Chang & Wen Qu (derived from hour branch)
    # Wen Chang: starts at Xu (index 10), counts counter-clockwise by hour branch
    # Wen Qu: starts at Chen (index 4), counts clockwise by hour branch
    wc_branch = ALL_12_BRANCHES[(10 - h_idx_all) % 12]
    wq_branch = ALL_12_BRANCHES[(4 + h_idx_all) % 12]
    auxiliary_placements.append(("[A] 文昌 (Wen Chang)", wc_branch, "Auspicious"))
    auxiliary_placements.append(("[A] 文曲 (Wen Qu)", wq_branch, "Auspicious"))

    # (b) Zuo Fu & You Bi (derived from lunar month)
    # Zuo Fu: starts at Chen (4), counts clockwise by (month - 1)
    # You Bi: starts at Xu (10), counts counter-clockwise by (month - 1)
    zf_branch = ALL_12_BRANCHES[(4 + (lunar_m - 1)) % 12]
    yb_branch = ALL_12_BRANCHES[(10 - (lunar_m - 1)) % 12]
    auxiliary_placements.append(("[A] 左辅 (Zuo Fu)", zf_branch, "Auspicious"))
    auxiliary_placements.append(("[A] 右弼 (You Bi)", yb_branch, "Auspicious"))

    # (c) Tian Kui & Tian Yue (Noble helpers derived from Year Stem)
    kui_yue_map = {
        "甲": ("丑", "未"), "戊": ("丑", "未"), "庚": ("丑", "未"),
        "乙": ("子", "申"), "己": ("子", "申"),
        "丙": ("亥", "酉"), "丁": ("亥", "酉"),
        "辛": ("午", "寅"),
        "壬": ("卯", "巳"), "癸": ("卯", "巳"),
    }
    tk_b, ty_b = kui_yue_map.get(y_stem, ("丑", "未"))
    auxiliary_placements.append(("[A] 天魁 (Tian Kui)", tk_b, "Auspicious"))
    auxiliary_placements.append(("[A] 天钺 (Tian Yue)", ty_b, "Auspicious"))

    # (d) Lu Cun, Qing Yang & Tuo Luo (derived from Year Stem)
    lu_cun_map = {
        "甲": 2, "乙": 3, "丙": 5, "丁": 6, "戊": 5,
        "己": 6, "庚": 8, "辛": 9, "壬": 11, "癸": 0
    }
    lc_idx = lu_cun_map.get(y_stem, 2)
    lc_branch = ALL_12_BRANCHES[lc_idx]
    qy_branch = ALL_12_BRANCHES[(lc_idx + 1) % 12]  # Ahead of Lu Cun
    tl_branch = ALL_12_BRANCHES[(lc_idx - 1) % 12]  # Behind Lu Cun
    auxiliary_placements.append(("[A] 禄存 (Lu Cun)", lc_branch, "Auspicious"))
    auxiliary_placements.append(("[A] 擎羊 (Qing Yang)", qy_branch, "Malefic"))
    auxiliary_placements.append(("[A] 陀罗 (Tuo Luo)", tl_branch, "Malefic"))

    # (e) Huo Xing & Ling Xing (derived from Year Branch + Hour Branch)
    y_branch_idx = ALL_12_BRANCHES.index(y_branch)
    if y_branch in ["寅", "午", "戌"]:
        huo_base, ling_base = 1, 3  # Chou, Mao
    elif y_branch in ["申", "子", "辰"]:
        huo_base, ling_base = 2, 10  # Yin, Xu
    elif y_branch in ["巳", "酉", "丑"]:
        huo_base, ling_base = 3, 10  # Mao, Xu
    else:  # 亥, 卯, 未
        huo_base, ling_base = 9, 10  # You, Xu

    huo_branch = ALL_12_BRANCHES[(huo_base + h_idx_all) % 12]
    ling_branch = ALL_12_BRANCHES[(ling_base + h_idx_all) % 12]
    auxiliary_placements.append(("[A] 火星 (Huo Xing)", huo_branch, "Malefic"))
    auxiliary_placements.append(("[A] 铃星 (Ling Xing)", ling_branch, "Malefic"))

    # Add auxiliary stars to palace stars
    for s_name, b, aux_type in auxiliary_placements:
        if b in palace_branch_map:
            palace_branch_map[b]["stars"].append(s_name)
            palace_branch_map[b]["star_details"].append({
                "name": s_name,
                "radiance": "得",
                "category": f"auxiliary_{aux_type.lower()}"
            })

    # 6. Star Quality Analysis for Ming Palace
    ming_palace = palace_branch_map[ming_branch]
    ming_stars = ming_palace["stars"]
    
    major_auspicious = ["紫微", "天府", "太阳", "太阴", "天机", "天同", "天梁", "天相", "武曲"]
    major_dynamic = ["贪狼", "七杀", "破军", "廉贞", "巨门"]
    
    maj_ausp_count = sum(1 for s in ming_stars if any(a in s for a in major_auspicious))
    maj_dyn_count = sum(1 for s in ming_stars if any(d in s for d in major_dynamic))
    aux_ausp_count = sum(1 for s in ming_stars if "[A]" in s and any(a in s for a in ["文昌", "文曲", "左辅", "右弼", "天魁", "天钺", "禄存"]))
    aux_mal_count = sum(1 for s in ming_stars if "[A]" in s and any(m in s for m in ["擎羊", "陀罗", "火星", "铃星"]))

    if (maj_ausp_count + aux_ausp_count) > (maj_dyn_count + aux_mal_count):
        assessment = "Fortified / Auspicious Alignment"
    elif aux_mal_count >= 2:
        assessment = "Frictional / High-Resistance Drive"
    else:
        assessment = "Balanced Dynamic Equilibrium"

    star_quality = {
        "ming_palace_branch": ming_branch,
        "major_auspicious_count": maj_ausp_count,
        "major_dynamic_count": maj_dyn_count,
        "auxiliary_auspicious_count": aux_ausp_count,
        "auxiliary_malefic_count": aux_mal_count,
        "assessment": assessment,
    }

    # 7. Si Hua (Four Transformations) for Year Stem
    si_hua_result = SI_HUA.get(y_stem, {})

    # 8. Decadal Periods (Da Xian)
    # Clockwise for Yang Male & Yin Female; Counter-clockwise for Yin Male & Yang Female
    year_is_yang = STEMS.index(y_stem) % 2 == 0
    is_clockwise = (year_is_yang and gender.lower() == "male") or ((not year_is_yang) and gender.lower() == "female")
    
    step_dir = -1 if is_clockwise else 1  # In counter-clockwise palace indexing
    da_xian_list = []
    for step_i in range(8):
        start_age = bureau_num + step_i * 10
        end_age = start_age + 9
        p_idx = (step_i * step_dir) % 12
        p = palaces[p_idx]
        da_xian_list.append({
            "step": step_i + 1,
            "start_age": start_age,
            "end_age": end_age,
            "palace": p["name"],
            "branch": p["branch"]
        })

    return {
        "tradition": "Zi Wei Dou Shu (Purple Star Astrology)",
        "lunar_date": {
            "year": y_stem + y_branch,
            "month": lunar_m,
            "day": lunar_d,
            "hour_branch": h_branch,
        },
        "ming_palace_branch": ming_branch,
        "shen_palace_branch": shen_branch,
        "five_elements_bureau": {
            "number": bureau_num,
            "name": bureau_name,
        },
        "si_hua_transformations": si_hua_result,
        "ming_star_quality": star_quality,
        "palaces": palaces,
        "da_xian_decades": da_xian_list,
        "invariants": {
            "unique_palaces_count": len(set(p["branch"] for p in palaces)),
            "is_valid_12_palaces": len(palaces) == 12 and len(set(p["branch"] for p in palaces)) == 12
        }
    }
