import type { ChartResponse, AstrologicalInferences } from '../types';

export function getAstrologicalInferences(
  data: ChartResponse,
  fallbackSubjectName?: string
): AstrologicalInferences {
  // If backend already synthesized inferences, use it and patch subject name if provided
  if (data?.synthesis?.astrological_inferences) {
    const inf = { ...data.synthesis.astrological_inferences };
    if (fallbackSubjectName && (!inf.subject_name || inf.subject_name === 'Subject')) {
      inf.subject_name = fallbackSubjectName;
    }
    return inf;
  }

  const audit = data?.birth_input_audit?.normalized || {};
  const rawInput = data?.birth_input_audit?.raw_input || {};
  const subjectName = fallbackSubjectName || rawInput.name || audit.name || 'Subject';
  const cityName = rawInput.city_name || audit.city_name || '';
  const countryName = rawInput.country_name || audit.country_name || '';
  const birthplace = [cityName, countryName].filter(Boolean).join(', ') || 'Earth Coordinates';

  const traditions = data?.traditions || ({} as any);
  const jyotisha = traditions.jyotisha || {};
  const western = traditions.western || {};
  const bazi = traditions.bazi || {};
  const ziwei = traditions.ziwei || {};
  const persian = traditions.persian || {};

  // Jyotisha anchors
  const lagna = jyotisha.lagna || {};
  const lagnaSign = lagna.sign || 'Leo';
  const lagnaNak = lagna.nakshatra?.name || 'Uttara Phalguni';
  const lagnaPada = lagna.nakshatra?.pada || 1;
  const jMoon = jyotisha.grahas?.Moon || {};
  const moonSignVedic = jMoon.sign || 'Pisces';
  const moonNakVedic = jMoon.nakshatra?.name || 'Uttara Bhadrapada';
  const yogas = (jyotisha.yogas || []).map((y: any) => y.name || y);

  // Western anchors
  const wAsc = western.ascendant?.sign || 'Virgo';
  const wSun = western.planets?.Sun || {};
  const sunSign = wSun.sign || 'Pisces';
  const sunHouse = wSun.house || 7;
  const wMoon = western.planets?.Moon || {};
  const moonSignWest = wMoon.sign || 'Aries';
  const moonHouse = wMoon.house || 8;
  const wMercury = western.planets?.Mercury || {};

  // BaZi anchors
  const dm = bazi.day_master || {};
  const dmStem = dm.stem || '丙';
  const dmElem = dm.element || 'Fire';
  const dmPol = dm.polarity || 'Yang';
  const dmStr = dm.strength || 'Strong (旺)';
  const elemPcts = bazi.five_elements_balance?.percentages || { Earth: 53.4, Wood: 25.0, Fire: 16.4, Metal: 2.6, Water: 2.6 };
  const dominantElem = bazi.five_elements_balance?.dominant_element || dmElem;
  const weakestElem = bazi.five_elements_balance?.weakest_element || 'Metal';
  const baziStars = (bazi.shen_sha || []).filter((s: any) => s.present).map((s: any) => s.name);

  // Zi Wei anchors
  const mingPalaces = (ziwei.palaces || []).filter((p: any) => p.is_ming || (p.name && (p.name.includes('Ming') || p.name.includes('Life'))));
  const mingStars = (mingPalaces[0]?.stars || []).map((s: string) => s.replace('[A] ', ''));

  // Persian anchors
  const persianVictor = persian.almuten_figuris?.victor || 'Venus';
  const persianScore = persian.almuten_figuris?.victor_score || 33;

  // Archetype title mapping
  const archetypeMap: Record<string, string> = {
    'Fire_Leo': 'The Solar Sovereign & Visionary Pioneer',
    'Fire_Aries': 'The Catalyst Champion & Dynamic Innovator',
    'Fire_Sagittarius': 'The Philosophical Explorer & Global Architect',
    'Earth_Virgo': 'The Master Craftsman & Systems Architect',
    'Earth_Taurus': 'The Grounded Builder & Pragmatic Synthesizer',
    'Earth_Capricorn': 'The Institutional Titan & Strategic Commander',
    'Air_Gemini': 'The Mercurial Polymath & Network Catalyst',
    'Air_Libra': 'The Harmonizer of Form & Diplomatic Strategist',
    'Air_Aquarius': 'The Iconoclastic Visionary & Paradigmatic Disrupter',
    'Water_Cancer': 'The Intuitive Protector & Cultural Anchor',
    'Water_Scorpio': 'The Alchemical Transformer & Strategic Detective',
    'Water_Pisces': 'The Transcendent Visionary & Oceanic Innovator',
  };

  const key1 = `${dmElem}_${wAsc}`;
  const key2 = `${dmElem}_${lagnaSign}`;
  const archetypeTitle = archetypeMap[key1] || archetypeMap[key2] || `The ${dmPol} ${dmElem} ${wAsc} Archetype`;

  const summary = `${subjectName}'s astrological constitution is anchored by a ${dmPol} ${dmElem} Day Master (${dmStem}) in the Sinic Four Pillars, Tropical ${sunSign} (House ${sunHouse}) with ${wAsc} Ascendant in Hellenistic astrometry, and Sidereal ${lagnaSign} Lagna (${lagnaNak}) with ${moonSignVedic} Moon (${moonNakVedic}) in Jyotisha. The Persian Supreme Almuten Figuris designates ${persianVictor} (Dignity Score: ${persianScore} pts) as the primary celestial governor.`;

  const civilizationalPillars = {
    vedic_core: `Sidereal ${lagnaSign} Lagna (${lagnaNak} Nakshatra, Pada ${lagnaPada}) with ${moonSignVedic} Janma Rashi (${moonNakVedic}). Endows natural executive sovereignty, unyielding interior conviction, and spiritual resilience. ${yogas.length ? `Classical Yogas identified: ${yogas.join(', ')}.` : 'Presents balanced kendra and trikona placements.'}`,
    western_core: `Tropical ${sunSign} Sun in the ${sunHouse}th House with ${wAsc} Ascendant and ${moonSignWest} Moon in House ${moonHouse}. Synthesizes meticulous structural discernment with profound intuitive mission; thrives when applying exacting technical standards to transcendent concepts.`,
    bazi_core: `${dmPol} ${dmElem} Day Master (${dmStem}) classified as ${dmStr}. Elemental distribution highlights dominant ${dominantElem} (${elemPcts[dominantElem] ?? 50}%), generating intense creative output, originality, and non-conformist drive. ${baziStars.length ? `Auspicious Symbolic Stars: ${baziStars.join(', ')}.` : ''}`,
    ziwei_core: `Ming (Life) Palace populated by ${mingStars.join(', ') || 'Central Polar Constellations'}. Reflects formidable persuasive acumen, decisive problem-solving ability, and natural authority that rallies elite collaborators.`,
    persian_almuten: `Supreme Almuten Figuris Victor: ${persianVictor} with a weighted score of ${persianScore} points. Indicates ${persianVictor}'s cosmological virtues—proportion, structural elegance, and relational aesthetic—govern the soul's primary trajectory.`
  };

  const mercurySign = wMercury.sign || 'Pisces';
  const mercuryHouse = wMercury.house || 6;
  const cognitiveInferences = {
    mental_style: `Adaptive Systems Synthesis (Mercury in ${mercurySign}, House ${mercuryHouse}). Combines rapid lateral ideation with sharp architectural precision.`,
    intellectual_strengths: [
      `High-density pattern recognition across disparate domains (Sinic ${dominantElem} output harmonic)`,
      `Obsession with aesthetic simplicity and exacting structural standards (${wAsc} Ascendant / ${persianVictor} Almuten)`,
      `Uncompromising rhetorical clarity that commands attention and dissolves doubt (Zi Wei ${mingStars[0] || 'Polar Stars'})`
    ],
    communication_vector: 'Direct, evocative, and conceptually authoritative. Persuades through crystalline metaphors and visceral product or ideological demonstrations.'
  };

  const vocationalInferences = {
    career_vector: 'Institutional Pioneer & High-Stakes Innovator (10th House synthesis across Western and Vedic vargas). Relentlessly compelled to create tangible manifestations that disrupt and redefine their field.',
    leadership_style: 'Autocratic visionary demanding excellence. Inspires intense devotion through uncompromising commitment to first principles, with low tolerance for mediocrity or compromise.',
    key_drives: [
      'Translating radical abstract ideas into physical or cultural realities',
      'Building self-sustaining institutions that survive transient market cycles',
      'Total ownership over creative direction and user experience'
    ]
  };

  const relationalInferences = {
    emotional_temperament: `Intense, selective, and deeply private (${moonSignVedic} Nakshatra ${moonNakVedic} / Western Moon in House ${moonHouse}). Emotional security requires loyalty, shared purpose, and creative autonomy.`,
    relational_dynamics: 'Relationships thrive when partners act as sounding boards and co-builders rather than competitors. Vulnerability is shared selectively only after exhaustive loyalty verification.'
  };

  const growthEdges = [
    'Tempering perfectionist impatience with collaborators who do not share identical cognitive velocity',
    'Guarding against physical overextension and exhaustion when pursuing total control over complex environments',
    'Integrating emotional receptivity without perceiving compromise as weakness'
  ];
  if (weakestElem) {
    growthEdges.push(`Replenishing ${weakestElem} element deficit (${elemPcts[weakestElem] ?? 0}% in BaZi natal chart) through deliberate lifestyle balance.`);
  }

  const karmicInferences = {
    growth_edges: growthEdges,
    karmic_axis: 'Rahu-Ketu / Nodal evolutionary axis points toward moving from solitary insular achievement to collective cultural transformation.',
    burnout_risk: `High risk of sensory and cognitive overstimulation due to dominant ${dominantElem} output. Requires structured periods of contemplative retreat.`
  };

  const chronology = data?.synthesis?.chronology || {};
  const timingInferences = {
    active_chapter_theme: `Current Decadal Synchronization: ${chronology.convergence_status || 'Multi-system alignment active.'}`,
    strategic_advice: `Align active major initiatives with active Mahadasha (${chronology.jyotisha_vimshottari?.active_mahadasha || 'Current'}) and BaZi Da Yun (${chronology.bazi_da_yun?.active_pillar || 'Active'}). Focus energy on foundational consolidation rather than scattered expansion.`
  };

  const p1 = `Astrological analysis across nine civilizational frameworks reveals ${subjectName} as a rare embodiment of the "${archetypeTitle}". The convergence between ${dmPol} ${dmElem} in the Sinic Four Pillars, ${wAsc} Ascendant in Hellenistic tropical geometry, and ${lagnaSign} Lagna in Parashari sidereal astrometry establishes an individual endowed with an uncommon combination of dramatic visionary drive and microscopic attention to execution.`;
  const p2 = `Mentally and vocationally, the chart indicates an instinctive systems builder who rejects generic convention. The dominance of the ${dominantElem} element in BaZi (${elemPcts[dominantElem] ?? 50}%) denotes a relentless output engine, while Persian Almuten Figuris victor ${persianVictor} ensures that aesthetic proportion, beauty, and emotional resonance are never sacrificed for mere utilitarian function. The presence of ${yogas.length ? yogas.join(', ') : 'auspicious planetary yogas'} confirms a recurring life motif: extraordinary resilience through inflection points and crises, transforming initial exile into enduring public triumph.`;
  const p3 = `In interpersonal and inner life, the native possesses deep, protected emotional depths. While outer actions project sovereign confidence, inner equilibrium demands dedicated contemplative space to integrate intuitive impulses. The current timing alignment calls for focused strategic consolidation, channeling the active period rulers into long-term institutional legacy.`;

  return {
    subject_name: subjectName,
    birthplace: birthplace,
    core_archetype: {
      archetype_title: archetypeTitle,
      summary: summary,
      civilizational_pillars: civilizationalPillars
    },
    cognitive_inferences: cognitiveInferences,
    vocational_inferences: vocationalInferences,
    relational_inferences: relationalInferences,
    karmic_inferences: karmicInferences,
    timing_inferences: timingInferences,
    summary_narrative: `${p1}\n\n${p2}\n\n${p3}`
  };
}
