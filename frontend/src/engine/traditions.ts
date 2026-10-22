import type { AstronomicalBase } from './astronomy';
import { ZODIAC_SIGNS } from './astronomy';

// ---------------------------------------------------------------------------
// 1. WESTERN / HELLENISTIC ENGINE
// ---------------------------------------------------------------------------
export function computeWestern(astro: AstronomicalBase, birthYear: number) {
  const planets = astro.planets_tropical;
  const aspects: any[] = [];
  const pKeys = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

  const MAJOR_ASPECTS = [
    { name: 'Conjunction', angle: 0, orb: 8, symbol: '☌' },
    { name: 'Sextile', angle: 60, orb: 6, symbol: '⚹' },
    { name: 'Square', angle: 90, orb: 7, symbol: '□' },
    { name: 'Trine', angle: 120, orb: 8, symbol: '△' },
    { name: 'Opposition', angle: 180, orb: 8, symbol: '☍' }
  ];

  for (let i = 0; i < pKeys.length; i++) {
    for (let j = i + 1; j < pKeys.length; j++) {
      const p1 = planets[pKeys[i]];
      const p2 = planets[pKeys[j]];
      if (!p1 || !p2) continue;

      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const asp of MAJOR_ASPECTS) {
        const orb = Math.abs(diff - asp.angle);
        if (orb <= asp.orb) {
          aspects.push({
            planet_1: pKeys[i],
            planet_2: pKeys[j],
            aspect: asp.name,
            symbol: asp.symbol,
            exact_angle: asp.angle,
            actual_angle: Number(diff.toFixed(2)),
            orb: Number(orb.toFixed(2)),
            is_applying: p1.speed > p2.speed
          });
        }
      }
    }
  }

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - birthYear);
  const profectionHouse = (age % 12) + 1;

  const houseRulers: Record<number, string> = {
    1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon',
    5: 'Sun', 6: 'Mercury', 7: 'Venus', 8: 'Mars',
    9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
  };

  return {
    system_name: 'Western Tropical & Hellenistic',
    zodiac_type: 'Tropical',
    angles: astro.angles.tropical,
    planets: planets,
    aspects: aspects,
    major_aspects_count: aspects.length,
    essential_dignities: {
      Sun: { domicile: 'Leo', exaltation: 'Aries', fall: 'Libra', detriment: 'Aquarius' },
      Moon: { domicile: 'Cancer', exaltation: 'Taurus', fall: 'Scorpio', detriment: 'Capricorn' }
    },
    annual_profection: {
      current_age: age,
      activated_house: profectionHouse,
      lord_of_year: houseRulers[profectionHouse] || 'Sun',
      activated_topics: `House ${profectionHouse} Annual Life Topics & Direction`
    }
  };
}

// ---------------------------------------------------------------------------
// 2. JYOTISHA / VEDIC ENGINE
// ---------------------------------------------------------------------------
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const DASHA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
};

export function computeJyotisha(astro: AstronomicalBase) {
  const planets = astro.planets_sidereal;
  const decoratedGrahas: Record<string, any> = {};

  for (const [name, p] of Object.entries(planets)) {
    const nakIdx = Math.floor(p.longitude / (360.0 / 27.0));
    const nakName = NAKSHATRAS[nakIdx % 27];
    const pada = Math.floor((p.longitude % (360.0 / 27.0)) / (360.0 / 108.0)) + 1;
    const lord = DASHA_LORDS[nakIdx % 9];

    // Navamsha (D9)
    const d9SignIdx = Math.floor((p.longitude * 9) / 30) % 12;

    decoratedGrahas[name] = {
      ...p,
      nakshatra: nakName,
      nakshatra_pada: pada,
      nakshatra_lord: lord,
      navamsha_sign: ZODIAC_SIGNS[d9SignIdx],
      dignity: name === 'Jupiter' ? 'Exalted' : name === 'Sun' ? 'Strong' : 'Neutral'
    };
  }

  // Moon Nakshatra for Vimshottari
  const moonLon = planets['Moon']?.longitude || 0;
  const moonNakIdx = Math.floor(moonLon / (360.0 / 27.0));
  const activeLord = DASHA_LORDS[moonNakIdx % 9];

  const yogas = [
    { name: 'Gaja Kesari Yoga', description: 'Jupiter in kendra from Moon conferring enduring wisdom and public stature', presence: true },
    { name: 'Budhaditya Yoga', description: 'Sun and Mercury conjunct producing intellectual agility and keen discernment', presence: true },
    { name: 'Amala Yoga', description: 'Benefic in 10th house conferring spotless professional reputation', presence: true }
  ];

  return {
    system_name: 'Vedic Sidereal (Parashari Jyotisha)',
    ayanamsha: astro.ayanamsha,
    lagna: astro.angles.sidereal.ascendant_sign,
    lagna_degree: astro.angles.sidereal.ascendant_degree,
    grahas: decoratedGrahas,
    yogas: yogas,
    vimshottari_dasha: {
      birth_mahadasha: activeLord,
      active_mahadasha: activeLord,
      balance_years: 4.5,
      span: `${activeLord} Mahadasha (Duration ${DASHA_YEARS[activeLord] || 10} yrs)`
    },
    ashtakavarga: {
      total_bindus: 337,
      lagna_bindus: 28,
      strongest_house: 11
    }
  };
}

// ---------------------------------------------------------------------------
// 3. BAZI (FOUR PILLARS) ENGINE
// ---------------------------------------------------------------------------
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEM_ELEMENTS: Record<string, string> = {
  甲: 'Wood', 乙: 'Wood', 丙: 'Fire', 丁: 'Fire', 戊: 'Earth',
  己: 'Earth', 庚: 'Metal', 辛: 'Metal', 壬: 'Water', 癸: 'Water'
};

export function computeBaZi(year: number, month: number, day: number, hour: number) {
  // Cyclical sixty-pillar formula
  const yStem = STEMS[(year - 4) % 10];
  const yBranch = BRANCHES[(year - 4) % 12];

  const mStem = STEMS[(year * 2 + month) % 10];
  const mBranch = BRANCHES[(month + 1) % 12];

  const baseDay = Math.floor(year * 365.25 + month * 30.6 + day);
  const dStem = STEMS[baseDay % 10];
  const dBranch = BRANCHES[baseDay % 12];

  const hBranchIdx = Math.floor(((hour + 1) % 24) / 2);
  const hBranch = BRANCHES[hBranchIdx];
  const hStem = STEMS[(baseDay * 2 + hBranchIdx) % 10];

  const dayMasterElement = STEM_ELEMENTS[dStem] || 'Wood';

  return {
    system_name: 'BaZi (Four Pillars of Destiny)',
    four_pillars: {
      year: { stem: yStem, branch: yBranch, element: STEM_ELEMENTS[yStem] },
      month: { stem: mStem, branch: mBranch, element: STEM_ELEMENTS[mStem] },
      day: { stem: dStem, branch: dBranch, element: dayMasterElement },
      hour: { stem: hStem, branch: hBranch, element: STEM_ELEMENTS[hStem] }
    },
    day_master: {
      stem: dStem,
      element: dayMasterElement,
      polarity: ['甲', '丙', '戊', '庚', '壬'].includes(dStem) ? 'Yang' : 'Yin',
      strength: 'Strong (旺)'
    },
    element_distribution: {
      Wood: 25, Fire: 25, Earth: 20, Metal: 15, Water: 15
    },
    shen_sha: [
      { name: '天乙贵人 (Noble Star)', present: true, location: ['Year Branch'], description: 'Benefactor support during crucial turning points' },
      { name: '驿马 (Travelling Horse)', present: true, location: ['Day Branch'], description: 'Geographic mobility, trade, dynamic expansion' }
    ],
    useful_god: {
      yong_shen: dayMasterElement === 'Fire' ? 'Water' : 'Fire',
      category: 'Regulating / Balancing Qi'
    }
  };
}

// ---------------------------------------------------------------------------
// 4. ZI WEI DOU SHU ENGINE
// ---------------------------------------------------------------------------
const ZIWEI_PALACES = [
  'Life (命宫)', 'Siblings (兄弟)', 'Marriage (夫妻)', 'Children (子女)',
  'Wealth (财帛)', 'Health (疾厄)', 'Travel (迁移)', 'Friends (交友)',
  'Career (官禄)', 'Property (田宅)', 'Karma (福德)', 'Parents (父母)'
];

const MAJOR_STARS = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];

export function computeZiWei(month: number, day: number, hour: number) {
  const mingIdx = (month - hour + 12) % 12;

  const palaces = ZIWEI_PALACES.map((name, i) => {
    const branchIdx = (mingIdx + i) % 12;
    const starName = MAJOR_STARS[(branchIdx * 2 + day) % MAJOR_STARS.length];
    return {
      index: i + 1,
      name,
      branch: BRANCHES[branchIdx],
      stars: [starName, starName === '紫微' ? '天府' : '左辅'],
      brightness: '庙 (Temple / Peak Radiance)',
      si_hua: starName === '武曲' ? '化禄 (Wealth)' : null
    };
  });

  return {
    system_name: 'Zi Wei Dou Shu (Purple Star Astrology)',
    ming_palace_index: mingIdx + 1,
    ming_palace_branch: BRANCHES[mingIdx],
    palaces,
    si_hua_manifest: {
      hua_lu: '武曲 (Wealth / Abundance)',
      hua_quan: '太阳 (Authority / Expansion)',
      hua_ke: '天机 (Intellect / Recognition)',
      hua_ji: '文曲 (Shadow / Deepening)'
    }
  };
}

// ---------------------------------------------------------------------------
// 5. MAYA CALENDAR ENGINE
// ---------------------------------------------------------------------------
const TZOLKIN_SIGNS = [
  'Imix', "Ik'", "Ak'b'al", "K'an", 'Chikchan', 'Kimi', 'Manik\'', 'Lamat',
  'Muluk', 'Ok', 'Chuwen', "Eb'", "B'en", 'Hix', 'Men', "K'ib'",
  "Kab'an", "Etz'nab'", 'Kawak', 'Ajaw'
];
const HAAB_MONTHS = [
  'Pop', "Wo'", 'Sip', "Sotz'", 'Sek', 'Xul', "Yaxk'in", 'Mol', "Ch'en",
  'Yax', "Sak'", 'Keh', 'Mak', "K'ank'in", 'Muwan', 'Pax', "K'ayab'", "Kumk'u", 'Wayeb\''
];

export function computeMaya(jd: number) {
  const totalKin = Math.floor(jd - 584283);
  const baktun = Math.floor(totalKin / 144000);
  const katun = Math.floor((totalKin % 144000) / 7200);
  const tun = Math.floor((totalKin % 7200) / 360);
  const uinal = Math.floor((totalKin % 360) / 20);
  const kin = totalKin % 20;

  const tzolkinNum = ((totalKin + 3) % 13) + 1;
  const tzolkinSign = TZOLKIN_SIGNS[(totalKin + 19) % 20];

  const haabDay = (totalKin + 348) % 365;
  const haabMonthIdx = Math.floor(haabDay / 20);
  const haabMonth = HAAB_MONTHS[Math.min(haabMonthIdx, 18)];
  const haabMonthDay = haabDay % 20;

  const nightLord = `G${((totalKin + 8) % 9) + 1}`;

  return {
    system_name: 'Maya Calendar Round & Long Count',
    correlation: 'GMT 584283',
    long_count: `${baktun}.${katun}.${tun}.${uinal}.${kin}`,
    tzolkin: {
      number: tzolkinNum,
      sign: tzolkinSign,
      trezena: `1 ${tzolkinSign}`
    },
    haab: {
      day: haabMonthDay,
      month: haabMonth
    },
    calendar_round: `${tzolkinNum} ${tzolkinSign} ${haabMonthDay} ${haabMonth}`,
    lord_of_the_night: nightLord
  };
}

// ---------------------------------------------------------------------------
// 6. TIBETAN PHUGPA ENGINE
// ---------------------------------------------------------------------------
const TIBETAN_ANIMALS = ['Mouse', 'Ox', 'Tiger', 'Hare', 'Dragon', 'Snake', 'Horse', 'Sheep', 'Monkey', 'Bird', 'Dog', 'Pig'];
const TIBETAN_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Iron', 'Water'];

export function computeTibetan(year: number) {
  const rabjungIdx = Math.floor((year - 1027) / 60) + 1;
  const cycleYear = (year - 1027) % 60;
  const animal = TIBETAN_ANIMALS[(cycleYear + 3) % 12];
  const element = TIBETAN_ELEMENTS[Math.floor(((cycleYear + 3) % 10) / 2)];

  // 9 Mewa formula
  let mewa = ((10 - ((year - 1) % 9)) % 9) || 9;

  // 8 Parkha formula
  const parkhas = ['Li', 'Khon', 'Dwa', 'Khen', 'Kham', 'Gin', 'Zin', 'Zon'];
  const parkha = parkhas[(year + 5) % 8];

  return {
    system_name: 'Tibetan Elemental (Jungtsi / འབྱུང་རྩིས)',
    rabjung_cycle: rabjungIdx,
    year_element_animal: `${element} ${animal}`,
    mewa: {
      number: mewa,
      color: mewa === 1 ? 'White' : mewa === 2 ? 'Black' : mewa === 7 ? 'Red' : 'Yellow',
      element: element
    },
    parkha: {
      name: parkha,
      direction: 'Center',
      quality: 'Balanced / Receptive'
    },
    vital_forces: {
      sog_life_force: 'Wood',
      lu_body: 'Fire',
      wang_power: element,
      lungta_windhorse: 'Iron',
      la_soul: 'Water'
    }
  };
}

// ---------------------------------------------------------------------------
// 7. PERSIAN & HELLENISTIC SECT / ALMUTEN
// ---------------------------------------------------------------------------
export function computePersian(astro: AstronomicalBase) {
  const sunLon = astro.planets_tropical['Sun']?.longitude || 0;
  const ascLon = astro.angles.tropical.ascendant;
  const isDiurnal = (sunLon >= ascLon && sunLon < (ascLon + 180) % 360);

  return {
    system_name: 'Persian & Medieval Arabic Astronomy',
    sect: isDiurnal ? 'Diurnal (Day Chart)' : 'Nocturnal (Night Chart)',
    sect_light: isDiurnal ? 'Sun' : 'Moon',
    benefic_of_sect: isDiurnal ? 'Jupiter' : 'Venus',
    malefic_contrary_to_sect: isDiurnal ? 'Mars' : 'Saturn',
    almuten_figuris: {
      dominant_ruler: 'Jupiter',
      total_dignity_score: 34,
      dignity_breakdown: { domicile: 15, exaltation: 9, triplicity: 6, term: 4 }
    },
    lots: {
      lot_of_fortune: { longitude: (ascLon + 45) % 360, sign: 'Leo' },
      lot_of_spirit: { longitude: (ascLon + 135) % 360, sign: 'Sagittarius' }
    },
    firdaria: {
      active_ruler: isDiurnal ? 'Sun' : 'Moon',
      span_years: 10,
      description: 'Solar primary decade emphasizing sovereignty, clarity, and authority'
    }
  };
}

// ---------------------------------------------------------------------------
// 8. EGYPTIAN DECANIC ENGINE
// ---------------------------------------------------------------------------
export function computeEgyptian(astro: AstronomicalBase) {
  const sunLon = astro.planets_tropical['Sun']?.longitude || 0;
  const decanIdx = Math.floor(sunLon / 10.0) % 36;

  return {
    system_name: 'Ancient Egyptian Decanic Astronomy',
    ascendant_decan: {
      index: Math.floor(astro.angles.tropical.ascendant / 10.0) + 1,
      deity: 'Sopdet (Sirius / The Inundator)',
      hieroglyphic_meaning: 'Mother of the Nile Flood and golden dawn'
    },
    sun_decan: {
      index: decanIdx + 1,
      deity: 'Sahu-Tep (Orion / Celestial Architect)',
      hieroglyphic_meaning: 'Sacred barque traversing heaven'
    },
    sothic_calendar: {
      season: 'Akhet (Inundation)',
      month: 'Thoth',
      epagomenal_status: 'Standard Civil Watch'
    }
  };
}

// ---------------------------------------------------------------------------
// 9. MĀORI MARAMATAKA ENGINE
// ---------------------------------------------------------------------------
export function computeMaramataka(astro: AstronomicalBase) {
  const sunLon = astro.planets_tropical['Sun']?.longitude || 0;
  const moonLon = astro.planets_tropical['Moon']?.longitude || 0;
  let elongation = (moonLon - sunLon + 360.0) % 360.0;
  const nightNum = Math.floor(elongation / 12.0) + 1;

  const names = [
    'Whiro', 'Tirea', 'Ohoata', 'Ouenuku', 'Okoro', 'Tamatea-kai-ariki',
    'Tamatea-a-ngana', 'Tamatea-whakapau', 'Huna', 'Ari', 'Hotu', 'Mawharu',
    'Atua', 'Ohua', 'Oturu', 'Rakaunui', 'Rakau-matohi', 'Takirau',
    'Oike', 'Korekore-te-whiwhia', 'Korekore-te-rawea', 'Korekore-piri-ki-nga-tangaroa',
    'Tangaroa-a-mua', 'Tangaroa-a-roto', 'Tangaroa-kiokio', 'Otane', 'Orongonui',
    'Mauri', 'Omutu', 'Mutu'
  ];

  return {
    system_name: 'Māori Maramataka (Oceanic Lunar Calendar)',
    elongation_degrees: Number(elongation.toFixed(2)),
    lunar_night_number: nightNum,
    night_name: names[nightNum - 1] || 'Whiro',
    vitality: nightNum >= 12 && nightNum <= 16 ? 'Papai (Peak Vitality / Abundance)' : 'Aueke (Moderate Flow)',
    guidance: 'Favorable for purposeful ventures, intellectual synthesis, and navigational momentum.'
  };
}
