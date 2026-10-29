import React from 'react';

interface VedicChartProps {
  jyotisha: any;
  compact?: boolean;
}

/**
 * North Indian Diamond Chart (Kundali)

 * Layout:
 * A 400x400 square:
 * Center top diamond is House 1 (Tanu Bhava / Lagna).
 * Top-left triangle: House 2
 * Upper-left triangle: House 3
 * Left diamond: House 4
 * Lower-left triangle: House 5
 * Bottom-left triangle: House 6
 * Center bottom diamond: House 7
 * Bottom-right triangle: House 8
 * Lower-right triangle: House 9
 * Right diamond: House 10
 * Upper-right triangle: House 11
 * Top-right triangle: House 12
 */
export const NorthIndianChart: React.FC<VedicChartProps> = ({ jyotisha, compact }) => {
  // Map signs to 1-12
  const signOrder = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const lagnaSignIndex = signOrder.indexOf(jyotisha.lagna.sign);

  // Group planets by house (1 to 12)
  const houseGrahas: { [house: number]: string[] } = {};
  for (let h = 1; h <= 12; h++) houseGrahas[h] = [];

  Object.entries(jyotisha.grahas).forEach(([name, g]: [string, any]) => {
    const h = g.house || 1;
    houseGrahas[h].push(`${name.slice(0, 2)}${g.is_retrograde ? '(R)' : ''}`);
  });

  // Calculate sign number (1-12) in each house (North Indian houses are fixed in geometry; signs rotate)
  const getHouseSignNum = (houseNum: number) => {
    if (lagnaSignIndex === -1) return houseNum;
    return ((lagnaSignIndex + (houseNum - 1)) % 12) + 1;
  };

  // Center coordinates for placing text in each house
  const houseCenters: { [house: number]: { x: number; y: number } } = {
    1: { x: 200, y: 130 },
    2: { x: 100, y: 55 },
    3: { x: 45, y: 100 },
    4: { x: 125, y: 200 },
    5: { x: 45, y: 300 },
    6: { x: 100, y: 345 },
    7: { x: 200, y: 270 },
    8: { x: 300, y: 345 },
    9: { x: 355, y: 300 },
    10: { x: 275, y: 200 },
    11: { x: 355, y: 100 },
    12: { x: 300, y: 55 },
  };

  const svgContent = (
    <svg
      viewBox="0 0 400 400"
      className={`w-full select-none ${compact ? 'max-w-[170px] sm:max-w-[230px] lg:max-w-[270px] h-auto' : 'max-w-[360px] h-auto'}`}
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
      aria-hidden="true"
    >
      {/* Outer Square */}
      <rect x="10" y="10" width="380" height="380" fill="#0d1118" stroke="#1b2331" strokeWidth="2" />

        {/* Diagonal Cross */}
        <line x1="10" y1="10" x2="390" y2="390" stroke="#2a3649" strokeWidth="1.5" className="animate-kundali-draw" />
        <line x1="10" y1="390" x2="390" y2="10" stroke="#2a3649" strokeWidth="1.5" className="animate-kundali-draw" />

        {/* Inner Diamond (Kendra axis) */}
        <polygon
          points="200,10 390,200 200,390 10,200"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          className="animate-kundali-draw"
        />

        {/* House Highlights & Grahas (Fades into focus as kundali lines draw) */}
        <g className="animate-instrument-focus" style={{ animationDelay: '120ms' }}>
          {/* Kendra houses (1, 4, 7, 10) have subtle accent tint */}
          <polygon points="200,10 295,105 200,200 105,105" fill="#38bdf8" fillOpacity="0.04" />
          <polygon points="10,200 105,105 200,200 105,295" fill="#38bdf8" fillOpacity="0.04" />
          <polygon points="200,390 105,295 200,200 295,295" fill="#38bdf8" fillOpacity="0.04" />
          <polygon points="390,200 295,105 200,200 295,295" fill="#38bdf8" fillOpacity="0.04" />

          {/* House Content: Sign Number & Grahas */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => {
            const center = houseCenters[h];
            const signNum = getHouseSignNum(h);
            const grahas = houseGrahas[h] || [];

            return (
              <g key={h}>
                {/* Sign Number */}
                <text
                  x={center.x}
                  y={center.y - 14}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {signNum}
                </text>

                {/* Grahas in House */}
                {grahas.length === 0 ? (
                  <text
                    x={center.x}
                    y={center.y + 4}
                    textAnchor="middle"
                    fill="#334155"
                    fontSize="9"
                    fontFamily="sans-serif"
                  >
                    -
                  </text>
                ) : (
                  <text
                    x={center.x}
                    y={center.y + 2}
                    textAnchor="middle"
                    fill="#f1f5f9"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {grahas.map((g, idx) => (
                      <tspan key={idx} x={center.x} dy={idx === 0 ? 0 : 12} fill={g.includes('R') ? '#fbbf24' : '#e2e8f0'}>
                        {g}
                      </tspan>
                    ))}
                  </text>
                )}

                {/* Lagna marker for H1 */}
                {h === 1 && (
                  <text
                    x={center.x}
                    y={center.y - 28}
                    textAnchor="middle"
                    fill="#f59e0b"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    LAGNA
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
  );

  if (compact) {
    return (
      <div className="flex items-center justify-center w-full py-0.5">
        {svgContent}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between w-full max-w-[400px] mb-2 px-1">
        <span className="text-xs font-medium text-amber-400">
          North Indian Kundaḷī (Lagna: {jyotisha.lagna.sign})
        </span>
        <span className="text-xs font-sans text-slate-400">Fixed House Geometry</span>
      </div>
      {svgContent}
      <div className="mt-2 text-xs text-slate-400 font-sans text-center flex flex-wrap items-center justify-center gap-2">
        <span>Numbers indicate Zodiac Signs (1=Aries ... 12=Pisces)</span>
        <span className="w-px h-3 bg-slate-700 hidden sm:inline-block" aria-hidden="true" />
        <span>H1-H4-H7-H10 highlighted Kendras</span>
      </div>
    </div>
  );
};

interface WesternWheelProps {
  western: any;
  compact?: boolean;
}

/**
 * Western 360° Circular Wheel Chart
 * Shows 12 zodiac signs, house cusps, planet locations, and aspect chords.
 */
export const WesternCircularWheel: React.FC<WesternWheelProps> = ({ western, compact }) => {
  const size = 420;
  const center = size / 2;
  const radius = 180;
  const innerRadius = 140;
  const planetRadius = 110;
  const centerRadius = 80;

  const signs = [
    { name: 'Aries', symbol: 'ARI', start: 0, color: '#ef4444' },
    { name: 'Taurus', symbol: 'TAU', start: 30, color: '#10b981' },
    { name: 'Gemini', symbol: 'GEM', start: 60, color: '#f59e0b' },
    { name: 'Cancer', symbol: 'CAN', start: 90, color: '#06b6d4' },
    { name: 'Leo', symbol: 'LEO', start: 120, color: '#f97316' },
    { name: 'Virgo', symbol: 'VIR', start: 150, color: '#84cc16' },
    { name: 'Libra', symbol: 'LIB', start: 180, color: '#ec4899' },
    { name: 'Scorpio', symbol: 'SCO', start: 210, color: '#dc2626' },
    { name: 'Sagittarius', symbol: 'SAG', start: 240, color: '#8b5cf6' },
    { name: 'Capricorn', symbol: 'CAP', start: 270, color: '#64748b' },
    { name: 'Aquarius', symbol: 'AQU', start: 300, color: '#0ea5e9' },
    { name: 'Pisces', symbol: 'PIS', start: 330, color: '#14b8a6' },
  ];

  // In standard Western astrology, Ascendant is placed at 90° (West / 9 o'clock) or calculated relative to Ascendant
  const ascLon = western.ascendant.longitude || 0;

  // Function to convert astrological longitude (0° Aries to 360°) to SVG coordinate
  // We orient so Ascendant is at 180° (standard 9 o'clock position on SVG circle)
  const lonToAngle = (lon: number) => {
    // Standard chart orientation: 9 o'clock is 180° in polar coords
    const angleFromAsc = (lon - ascLon + 360) % 360;
    // Map to circle where 0° offset = 180° (left) and counter-clockwise
    const angleRad = ((180 - angleFromAsc) * Math.PI) / 180;
    return angleRad;
  };

  const getCoord = (lon: number, r: number) => {
    const angle = lonToAngle(lon);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build planet coords
  const planetPoints: { name: string; x: number; y: number; lon: number; isRetro: boolean }[] = [];
  Object.entries(western.planets).forEach(([name, p]: [string, any]) => {
    const lon = p.longitude;
    if (typeof lon === 'number') {
      const coord = getCoord(lon, planetRadius);
      planetPoints.push({
        name,
        x: coord.x,
        y: coord.y,
        lon,
        isRetro: p.is_retrograde || false,
      });
    }
  });

  const svgContent = (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size} ${size}`}
      className={`w-full select-none ${compact ? 'max-w-[170px] sm:max-w-[230px] lg:max-w-[270px] h-auto' : 'max-w-[380px] h-auto'}`}
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
    >
      {/* Background Circle */}
      <circle cx={center} cy={center} r={radius} fill="#0d1118" stroke="#1b2331" strokeWidth="2" />

      {/* 12 Sign Sectors & Astrolabe Dial Ring (Fluid entrance spin reveal) */}
      <g className="animate-dial-reveal" style={{ transformOrigin: `${center}px ${center}px` }}>
        {signs.map((s) => {
          const startAngle = lonToAngle(s.start);
          const midAngle = lonToAngle(s.start + 15);

          const x1 = center + radius * Math.cos(startAngle);
          const y1 = center + radius * Math.sin(startAngle);
          const x2 = center + innerRadius * Math.cos(startAngle);
          const y2 = center + innerRadius * Math.sin(startAngle);

          // Sector label coord
          const labelR = (radius + innerRadius) / 2;
          const lx = center + labelR * Math.cos(midAngle);
          const ly = center + labelR * Math.sin(midAngle);

          return (
            <g key={s.name}>
              {/* Radial cusp line */}
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a3649" strokeWidth="1" />

              {/* Sign Glyph / Name */}
              <text
                x={lx}
                y={ly + 4}
                textAnchor="middle"
                fill={s.color}
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                {s.symbol}
              </text>
            </g>
          );
        })}

        {/* Inner Cusp Ring */}
        <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="#2a3649" strokeWidth="1.5" />
      </g>

      {/* Central Hub Core & Horizon Cross */}
      <circle cx={center} cy={center} r={centerRadius} fill="#080a0f" stroke="#1b2331" strokeWidth="1.5" />

        {/* Aspect Chords in Inner Disc */}
        {western.aspects && western.aspects.slice(0, 15).map((asp: any, idx: number) => {
          const p1 = planetPoints.find((p) => p.name.toLowerCase() === asp.planet_1.toLowerCase());
          const p2 = planetPoints.find((p) => p.name.toLowerCase() === asp.planet_2.toLowerCase());
          if (!p1 || !p2) return null;

          const c1 = getCoord(p1.lon, centerRadius - 2);
          const c2 = getCoord(p2.lon, centerRadius - 2);

          const aspectColor =
            asp.aspect === 'Trine' || asp.aspect === 'Sextile'
              ? '#10b981' // Green for harmonizing
              : asp.aspect === 'Square' || asp.aspect === 'Opposition'
              ? '#f43f5e' // Rose for dynamic/tense
              : '#38bdf8'; // Blue for conjunction/others

          return (
            <line
              key={idx}
              x1={c1.x}
              y1={c1.y}
              x2={c2.x}
              y2={c2.y}
              stroke={aspectColor}
              strokeWidth="0.8"
              strokeOpacity="0.45"
              strokeDasharray={asp.aspect === 'Sextile' ? '3,2' : undefined}
              className="motion-safe:animate-beam-pulse motion-reduce:animate-none hover:stroke-opacity-100 hover:stroke-[1.6] transition-opacity duration-150 cursor-pointer"
            />
          );
        })}

        {/* Ascendant / Descendant Horizon Line */}
        <line
          x1={center - radius}
          y1={center}
          x2={center + radius}
          y2={center}
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          strokeOpacity="0.8"
        />

        {/* AC / DC labels */}
        <text x={center - radius + 14} y={center - 5} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
          ASC
        </text>
        <text x={center + radius - 20} y={center - 5} fill="#64748b" fontSize="10" fontFamily="monospace">
          DSC
        </text>

        {/* Planet Glyphs & Locations (Focus entrance reveal) */}
        <g className="animate-instrument-focus" style={{ animationDelay: '140ms' }}>
          {planetPoints.map((p) => (
            <g key={p.name}>
              <circle cx={p.x} cy={p.y} r="3" fill={p.isRetro ? '#fbbf24' : '#38bdf8'} />
              <text
                x={p.x}
                y={p.y - 6}
                textAnchor="middle"
                fill="#f1f5f9"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="600"
              >
                {p.name.slice(0, 2)}
                {p.isRetro ? ' Rx' : ''}
              </text>
            </g>
          ))}

          {/* Center Badge */}
          <text
            x={center}
            y={center - 4}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            TROPICAL
          </text>
          <text
            x={center}
            y={center + 10}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="8"
            fontFamily="monospace"
          >
            {western.sect.label.toUpperCase()} SECT
          </text>
        </g>
      </svg>
  );

  if (compact) {
    return (
      <div className="flex items-center justify-center w-full py-0.5">
        {svgContent}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between w-full max-w-[420px] mb-2 px-1">
        <span className="text-xs font-medium text-cyan-400">
          Western 360° Circular Wheel (Asc: {western.ascendant.sign} {western.ascendant.degree}°)
        </span>
        <span className="text-xs font-sans text-slate-400">Whole Sign Houses</span>
      </div>
      {svgContent}
      <div className="mt-2 text-xs text-slate-400 font-sans text-center flex flex-wrap items-center justify-center gap-2">
        <span>Aspect Chords:</span>
        <span className="text-emerald-400">Green = Trine/Sextile</span>
        <span className="w-px h-3 bg-slate-700 hidden sm:inline-block" aria-hidden="true" />
        <span className="text-rose-400">Rose = Square/Opposition</span>
        <span className="w-px h-3 bg-slate-700 hidden sm:inline-block" aria-hidden="true" />
        <span className="text-amber-400">® = Retrograde</span>
      </div>
    </div>
  );
};

interface BaZiPentagramProps {
  bazi: any;
  compact?: boolean;
}

/**
 * Wu Xing (Five Elements) Interactive Pentagram Flow Diagram
 * Shows Generating (Sheng) and Controlling (Ke) cycles with active percentages.
 */
export const BaZiElementPentagram: React.FC<BaZiPentagramProps> = ({ bazi, compact }) => {
  const size = 360;
  const center = size / 2;
  const radius = 115;

  const elements = [
    { name: 'Wood', ch: '木', angle: -90, color: '#10b981', desc: 'Growth / Vitality' },
    { name: 'Fire', ch: '火', angle: -18, color: '#f43f5e', desc: 'Radiance / Passion' },
    { name: 'Earth', ch: '土', angle: 54, color: '#f59e0b', desc: 'Grounding / Stability' },
    { name: 'Metal', ch: '金', angle: 126, color: '#e2e8f0', desc: 'Structure / Discernment' },
    { name: 'Water', ch: '水', angle: 198, color: '#06b6d4', desc: 'Wisdom / Fluidity' },
  ];

  const nodeCoords = elements.map((elem) => {
    const rad = (elem.angle * Math.PI) / 180;
    return {
      ...elem,
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
      pct: bazi.five_elements_balance?.percentages?.[elem.name] || 0,
    };
  });

  const dayMasterElement = bazi.day_master?.element;

  const svgContent = (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size} ${size}`}
      className={`w-full select-none ${compact ? 'max-w-[170px] sm:max-w-[230px] lg:max-w-[270px] h-auto' : 'max-w-[340px] h-auto'}`}
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
    >
        {/* Background Subtle Disc */}
        <circle cx={center} cy={center} r={radius + 35} fill="#0d1118" stroke="#1b2331" strokeWidth="1" />

        {/* Outer Generating Cycle (Sheng Cycle / Green Ring with Entrance Draw) */}
        {nodeCoords.map((pt, idx) => {
          const next = nodeCoords[(idx + 1) % 5];
          return (
            <line
              key={`gen-${pt.name}`}
              x1={pt.x}
              y1={pt.y}
              x2={next.x}
              y2={next.y}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              strokeOpacity="0.55"
              className="animate-cycle-flow animate-pentagram-draw"
              style={{ animationDelay: `${idx * 40}ms` }}
            />
          );
        })}

        {/* Inner Controlling Cycle (Ke Cycle / Star Chord Lines with Entrance Draw) */}
        {[0, 1, 2, 3, 4].map((i) => {
          const p1 = nodeCoords[i];
          const p2 = nodeCoords[(i + 2) % 5];
          return (
            <line
              key={`ctrl-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="4 3"
              strokeOpacity="0.45"
              className="animate-pentagram-draw motion-safe:animate-beam-pulse motion-reduce:animate-none hover:stroke-opacity-90 hover:stroke-[1.8] transition-opacity duration-150 cursor-pointer"
              style={{ animationDelay: `${(i + 5) * 35}ms` }}
            />
          );
        })}

        {/* Center Balance Core */}
        <g className="animate-instrument-focus" style={{ animationDelay: '100ms' }}>
          <circle cx={center} cy={center} r={24} fill="#080a0f" stroke="#1b2331" strokeWidth="1.5" />
          <text x={center} y={center - 3} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            {bazi.day_master?.strength?.slice(0, 6) || 'BAL'}
          </text>
          <text x={center} y={center + 8} textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">
            {bazi.day_master?.stem}
          </text>
        </g>

        {/* Five Element Nodes (Staggered Focus Pop-in) */}
        {nodeCoords.map((pt, idx) => {
          const isDayMaster = pt.name === dayMasterElement;
          return (
            <g
              key={pt.name}
              className="animate-instrument-focus"
              style={{ animationDelay: `${idx * 45 + 120}ms` }}
            >
              {/* Outer Glow for Day Master */}
              {isDayMaster && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={28}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="animate-celestial-glow"
                />
              )}

              {/* Node Circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={24}
                fill="#0b0e14"
                stroke={isDayMaster ? '#f59e0b' : pt.color}
                strokeWidth={isDayMaster ? '2' : '1.5'}
              />

              {/* Chinese Character */}
              <text
                x={pt.x}
                y={pt.y - 4}
                textAnchor="middle"
                fill={pt.color}
                fontSize="14"
                fontFamily="serif"
                fontWeight="bold"
              >
                {pt.ch}
              </text>

              {/* Element Name & Percentage */}
              <text
                x={pt.x}
                y={pt.y + 10}
                textAnchor="middle"
                fill="#f1f5f9"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="600"
              >
                {pt.pct}%
              </text>
            </g>
          );
        })}
      </svg>
  );

  if (compact) {
    return (
      <div className="flex items-center justify-center w-full py-0.5">
        {svgContent}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between w-full max-w-[360px] mb-2 px-1">
        <span className="text-xs font-medium text-emerald-400">
          Wu Xing Five Elements Flow (五行生克)
        </span>
        <span className="text-xs font-sans text-slate-400">Day Master: {bazi.day_master?.stem} ({dayMasterElement})</span>
      </div>
      {svgContent}
      <div className="mt-2 text-xs text-slate-400 font-sans text-center flex flex-wrap items-center justify-center gap-2">
        <span><strong className="text-emerald-400">Green Ring:</strong> Generating (生)</span>
        <span className="w-px h-3 bg-slate-700 hidden sm:inline-block" aria-hidden="true" />
        <span><strong className="text-rose-400">Dashed Star:</strong> Controlling (克)</span>
        <span className="w-px h-3 bg-slate-700 hidden sm:inline-block" aria-hidden="true" />
        <span><strong className="text-amber-400">Gold Glow:</strong> Day Master</span>
      </div>
    </div>
  );
};

interface ZiWeiGridProps {
  ziwei: any;
  compact?: boolean;
}

/**
 * Traditional Chinese 12-Palace Heavenly Grid (4x4 Perimeter Square)
 * Features the 12 branch perimeter boxes surrounding the Central Courtyard.
 */
export const ZiWeiPalaceGrid: React.FC<ZiWeiGridProps> = ({ ziwei, compact }) => {
  // Traditional branch positions in the 4x4 square:
  // Row 1 (top): 巳 (Si), 午 (Wu), 未 (Wei), 申 (Shen)
  // Row 2: 辰 (Chen) [left], [center 2x2], 酉 (You) [right]
  // Row 3: 卯 (Mao) [left],  [center 2x2], 戌 (Xu) [right]
  // Row 4 (bottom): 寅 (Yin), 丑 (Chou), 子 (Zi), 亥 (Hai)

  const branchToPalace: Record<string, any> = {};
  ziwei.palaces.forEach((p: any) => {
    branchToPalace[p.branch] = p;
  });

  const BRANCH_ORDER = ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'];

  const getPalaceCell = (branch: string) => {
    const p = branchToPalace[branch];
    if (!p) return null;
    const bIdx = Math.max(0, BRANCH_ORDER.indexOf(branch));
    return (
      <div
        key={branch}
        className={`rounded border flex flex-col justify-between text-left transition-colors duration-150 cursor-pointer animate-grid-cell-reveal ${
          compact ? 'p-0.5 sm:p-1' : 'p-2'
        } ${
          p.is_ming
            ? 'bg-slate-900 border-cyan-500 shadow-xs motion-safe:animate-aura-breathe motion-reduce:animate-none'
            : p.is_shen
            ? 'bg-slate-900 border-amber-400 motion-safe:animate-aura-breathe motion-reduce:animate-none'
            : 'bg-slate-950 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
        }`}
        style={{ animationDelay: `${bIdx * 20}ms` }}
      >
        {/* Header: Name + Branch + Badges */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-0.5">
          <span className={`font-semibold ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[11px]'} text-slate-100 flex items-center gap-0.5 sm:gap-1`}>
            {p.name}
            {p.is_ming && <span className="text-[7.5px] sm:text-[8px] px-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">M</span>}
            {p.is_shen && <span className="text-[7.5px] sm:text-[8px] px-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">S</span>}
          </span>
          <span className={`${compact ? 'text-[8px] sm:text-[9px]' : 'text-[11px]'} font-mono text-slate-500`}>{p.branch}</span>
        </div>

        {/* Major Stars */}
        <div className={`${compact ? 'my-0.5 space-y-0' : 'my-1 space-y-0.5'}`}>
          {p.stars.length === 0 ? (
            <span className={`${compact ? 'text-[8px] sm:text-[9px]' : 'text-[11px]'} text-slate-400 block truncate`}>Empty</span>
          ) : (
            p.stars.slice(0, compact ? 1 : 3).map((s: string, sIdx: number) => (
              <div
                key={sIdx}
                className={`${compact ? 'text-[8px] sm:text-[9px]' : 'text-[11px]'} font-mono truncate ${
                  s.startsWith('[A]')
                    ? 'text-cyan-400/90'
                    : 'text-amber-300 font-semibold'
                }`}
              >
                {s}
              </div>
            ))
          )}
        </div>

        {/* Footer: Decade Decennial Span */}
        <div className="text-[7.5px] sm:text-[9px] text-slate-500 font-mono text-right hidden sm:block">
          {compact ? `${p.decennial_span || '—'}` : `Age ${p.decennial_span || '—'}`}
        </div>
      </div>
    );
  };

  const gridContent = (
    <div className={`w-full max-w-[560px] grid grid-cols-4 grid-rows-4 gap-0.5 sm:gap-1.5 ${compact ? 'min-h-[135px] sm:min-h-[190px]' : 'min-h-[380px]'}`}>
      {/* Row 1 (Top): 巳, 午, 未, 申 */}
      {getPalaceCell('巳')}
      {getPalaceCell('午')}
      {getPalaceCell('未')}
      {getPalaceCell('申')}

      {/* Row 2: 辰 (Left), Courtyard (Center 2x2), 酉 (Right) */}
      {getPalaceCell('辰')}
      <div className={`col-span-2 row-span-2 bg-slate-900 rounded border border-amber-900/40 ${compact ? 'p-1' : 'p-3'} flex flex-col justify-center text-center select-none animate-instrument-focus`}>
        <div className={`${compact ? 'pb-0.5' : 'border-b border-slate-800 pb-1'}`}>
          {!compact && (
            <span className="text-xs font-sans text-amber-400 block font-semibold">
              Central Courtyard
            </span>
          )}
          <h4 className={`${compact ? 'text-[10px] leading-tight' : 'text-sm mt-0.5'} font-bold text-slate-100`}>
            {ziwei.five_elements_bureau?.name}
          </h4>
        </div>

        <div className={`${compact ? 'text-[9px] space-y-0.5 my-0.5' : 'text-xs space-y-1 my-auto'} text-slate-300 font-sans`}>
          <div>
            <span className="text-slate-400">Ming:</span> <strong className="text-cyan-300 font-mono">{ziwei.ming_palace_branch}</strong>
            <span className="mx-1 text-slate-600" aria-hidden="true">•</span>
            <span className="text-slate-400">Shen:</span> <strong className="text-amber-300 font-mono">{ziwei.shen_palace_branch}</strong>
          </div>
          <div className={`${compact ? 'text-[8.5px]' : 'text-[10px]'} text-slate-400`}>
            Lunar: Y<span className="font-mono tabular-nums">{ziwei.lunar_date?.year}</span>, M<span className="font-mono tabular-nums">{ziwei.lunar_date?.month}</span>, D<span className="font-mono tabular-nums">{ziwei.lunar_date?.day}</span>
          </div>
        </div>

        {!compact && (
          <div className="text-[9px] font-sans text-slate-500 pt-0.5 border-t border-slate-800">
            14 Major Stars
          </div>
        )}
      </div>
      {getPalaceCell('酉')}

      {/* Row 3: 卯 (Left), Courtyard spanned, 戌 (Right) */}
      {getPalaceCell('卯')}
      {getPalaceCell('戌')}

      {/* Row 4 (Bottom): 寅, 丑, 子, 亥 */}
      {getPalaceCell('寅')}
      {getPalaceCell('丑')}
      {getPalaceCell('子')}
      {getPalaceCell('亥')}
    </div>
  );

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-0.5">
        {gridContent}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between w-full max-w-[560px] mb-2 px-1">
        <span className="text-xs font-medium text-amber-400">
          Zi Wei Dou Shu 12-Palace Heavenly Grid (紫微斗数命盘)
        </span>
        <span className="text-xs font-sans text-slate-400">Bureau: {ziwei.five_elements_bureau?.name}</span>
      </div>

      {gridContent}

      <div className="mt-2 text-xs text-slate-400 font-sans text-center flex flex-wrap items-center justify-center gap-2">
        <span>Traditional clockwise layout</span>
        <span className="w-px h-3 bg-slate-700 hidden sm:inline-block" aria-hidden="true" />
        <span className="text-cyan-300">Cyan Border = Ming (Life)</span>
        <span className="w-px h-3 bg-slate-700 hidden sm:inline-block" aria-hidden="true" />
        <span className="text-amber-300">Amber Border = Shen (Body)</span>
      </div>
    </div>
  );
};

interface AlmutenBarProps {
  persian: any;
  compact?: boolean;
}

/**
 * Almuten Figuris Dignity Comparative Bar Visualizer
 */
export const AlmutenDignityBarChart: React.FC<AlmutenBarProps> = ({ persian, compact }) => {
  const leaderboard = persian.almuten_figuris?.leaderboard || [];
  const maxScore = Math.max(...leaderboard.map((item: any) => item.total_score), 40);
  const displayedItems = compact ? leaderboard.slice(0, 4) : leaderboard;

  const barContent = (
    <div className={`w-full ${compact ? 'max-w-[300px] space-y-1' : 'space-y-2'}`}>
      {displayedItems.map((item: any, idx: number) => {
        const isVictor = idx === 0;
        const essentialPct = (item.essential_dignity / maxScore) * 100;
        const accidentalPct = (item.accidental_dignity / maxScore) * 100;

        return (
          <div key={item.planet} className="space-y-0.5">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className={`flex items-center gap-1.5 ${isVictor ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                {isVictor ? '★' : `#${idx + 1}`} {item.planet}
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-200">
                {item.total_score} pts{' '}
                <span className="text-[11px] font-normal text-slate-500 font-sans">
                  ({item.essential_dignity} ess + {item.accidental_dignity} acc)
                </span>
              </span>
            </div>

            {/* Stacked Bar (Fluid GPU scaleX growth on reveal) */}
            <div className={`${compact ? 'h-1.5' : 'h-2'} w-full bg-slate-900 rounded overflow-hidden flex border border-slate-800`}>
              <div
                className="h-full bg-cyan-500 animate-bar-grow motion-safe:transition-opacity motion-reduce:transition-none"
                style={{
                  width: `${essentialPct}%`,
                  animationDelay: `${idx * 40}ms`,
                }}
                title={`Essential: +${item.essential_dignity}`}
              />
              <div
                className="h-full bg-amber-500 animate-bar-grow motion-safe:transition-opacity motion-reduce:transition-none"
                style={{
                  width: `${accidentalPct}%`,
                  animationDelay: `${idx * 40 + 25}ms`,
                }}
                title={`Accidental: +${item.accidental_dignity}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-0.5">
        {barContent}
        <div className="mt-1 text-[10px] sm:text-xs text-slate-400 font-sans flex items-center justify-center gap-3">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm bg-cyan-500"></span> Essential</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm bg-amber-500"></span> Accidental</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-medium text-amber-400">
          Almuten Figuris Point Distribution (Weighted Scoring)
        </span>
        <span className="text-xs font-sans text-slate-400">Victor: {persian.almuten_figuris?.victor}</span>
      </div>

      {barContent}

      <div className="mt-3 text-xs text-slate-400 font-sans flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span> Essential Dignity (Domicile, Exaltation, Bounds)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Accidental Dignity (House Angularity & Day Ruler)</span>
      </div>
    </div>
  );
};

interface MaramatakaDialProps {
  maramataka: any;
  compact?: boolean;
}

/**
 * Polynesian Maramataka Lunar Phase & Oceanic Dial
 */
export const MaramatakaLunarDial: React.FC<MaramatakaDialProps> = ({ maramataka, compact }) => {
  const night = maramataka.lunar_night;
  const currentNightNum = night.number || 1; // 1 to 30
  const size = 300;
  const center = size / 2;
  const dialRadius = 110;

  // Active night angle
  const activeAngle = ((currentNightNum - 1) / 30) * 360 - 90;
  const activeRad = (activeAngle * Math.PI) / 180;
  const pointerX = center + dialRadius * Math.cos(activeRad);
  const pointerY = center + dialRadius * Math.sin(activeRad);

  const svgContent = (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size} ${size}`}
      className={`w-full select-none ${compact ? 'max-w-[165px] sm:max-w-[210px] lg:max-w-[240px] h-auto' : 'max-w-[280px] h-auto'}`}
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
    >
      {/* Outer Dial Track & 30 Lunar Night Ticks (Fluid dial reveal) */}
      <g className="animate-dial-reveal" style={{ transformOrigin: `${center}px ${center}px` }}>
        <circle cx={center} cy={center} r={dialRadius} fill="#0d1118" stroke="#1b2331" strokeWidth="2" />

        {/* 30 Lunar Night Tick Marks */}
        {Array.from({ length: 30 }).map((_, i) => {
          const ang = (i / 30) * 360 - 90;
          const rad = (ang * Math.PI) / 180;
          const r1 = dialRadius - 8;
          const r2 = dialRadius;
          const isQuarter = i % 7 === 0;

          return (
            <line
              key={i}
              x1={center + r1 * Math.cos(rad)}
              y1={center + r1 * Math.sin(rad)}
              x2={center + r2 * Math.cos(rad)}
              y2={center + r2 * Math.sin(rad)}
              stroke={isQuarter ? '#38bdf8' : '#2a3649'}
              strokeWidth={isQuarter ? 2 : 1}
            />
          );
        })}
      </g>

      {/* Center Moon Illumination Globe */}
      <g className="animate-instrument-focus" style={{ animationDelay: '100ms' }}>
        <circle cx={center} cy={center} r={45} fill="#0b0e14" stroke="#1b2331" strokeWidth="1.5" />
        <circle
          cx={center}
          cy={center}
          r={42}
          fill="#182232"
          opacity={night.illumination_percent / 100}
          className="motion-safe:animate-celestial-glow motion-reduce:animate-none"
        />

        <text x={center} y={center - 8} textAnchor="middle" fill="#f1f5f9" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
          {night.name}
        </text>
        <text x={center} y={center + 8} textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">
          {night.vitality_index.slice(0, 10)}
        </text>
        <text x={center} y={center + 20} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
          {night.illumination_percent}% Lit
        </text>
      </g>

      {/* Active Night Pointer */}
      <g className="animate-instrument-focus" style={{ animationDelay: '160ms' }}>
        <circle
          cx={pointerX}
          cy={pointerY}
          r={10}
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          className="motion-safe:animate-radar-pulse motion-reduce:animate-none"
          style={{ transformOrigin: `${pointerX}px ${pointerY}px` }}
        />
        <circle cx={pointerX} cy={pointerY} r={6} fill="#10b981" stroke="#f1f5f9" strokeWidth="1.5" />
      </g>
    </svg>
  );

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-0.5">
        {svgContent}
        <div className="mt-1 text-[10px] text-slate-400 font-sans text-center flex items-center justify-center gap-1.5">
          <span>{maramataka.oceanic_archetype?.optimal_action}</span>
          <span className="w-px h-3 bg-slate-700 inline-block" aria-hidden="true" />
          <span className="font-mono tabular-nums">{night.elongation_degrees}°</span>
          <span>Elongation</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between w-full max-w-[320px] mb-2 px-1 font-sans">
        <span className="text-xs font-medium text-emerald-400">
          Maramataka 30-Night Oceanic Dial
        </span>
        <span className="text-[11px] text-slate-400">Night <span className="font-mono tabular-nums">#{currentNightNum}</span></span>
      </div>

      {svgContent}

      <div className="mt-2 text-[11px] text-slate-400 font-sans text-center flex items-center justify-center gap-1.5">
        <span>{maramataka.oceanic_archetype?.optimal_action}</span>
        <span className="w-px h-3 bg-slate-700 inline-block" aria-hidden="true" />
        <span className="font-mono tabular-nums">{night.elongation_degrees}°</span>
        <span>Elongation</span>
      </div>
    </div>
  );
};

interface RadarProps {
  synthesis: any;
}

/**
 * 9-Domain Cross-Cultural Consensus Polar/Radar Spider Chart
 */
export const DomainConsensusRadar: React.FC<RadarProps> = ({ synthesis }) => {
  const domains = Object.values(synthesis.domain_results || {});
  if (domains.length === 0) return null;

  const size = 380;
  const center = size / 2;
  const maxRadius = 130;
  const total = domains.length; // usually 9 (D1 to D9)

  const gradeToScore = (grade: string) => {
    switch (grade) {
      case 'STRONG': return 0.95;
      case 'MODERATE': return 0.70;
      case 'DIVERGENT': return 0.35;
      case 'WEAK': return 0.20;
      default: return 0.50;
    }
  };

  const getPoint = (index: number, score: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const r = score * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      angle
    };
  };

  // Generate radar polygon vertices
  const points = domains.map((d: any, i: number) => {
    const score = gradeToScore(d.grade);
    return getPoint(i, score);
  });

  const polygonPath = points.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Ring levels
  const rings = [0.25, 0.50, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-stone-950 rounded-lg border border-stone-800">
      <div className="flex items-center justify-between w-full max-w-[440px] mb-2 px-1 font-sans">
        <span className="text-xs font-medium text-amber-400">
          9-Domain Consensus Radar Matrix (D1 to D9)
        </span>
        <span className="text-[11px] text-stone-400">
          Divergence: <strong className="text-rose-400 font-mono tabular-nums">{synthesis.divergence_metrics?.divergence_rate_percent}%</strong>
        </span>
      </div>

      <svg
        aria-hidden="true"
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[360px] h-auto select-none"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
      >
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Concentric Nonagon / Polygon Web Rings */}
        {rings.map((ring) => {
          const ringPoints = Array.from({ length: total }).map((_, i) => {
            const p = getPoint(i, ring);
            return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
          }).join(' ') + ' Z';

          return (
            <path
              key={ring}
              d={ringPoints}
              fill="none"
              stroke="#2e2823"
              strokeWidth={ring === 1.0 ? '1.5' : '1'}
              strokeDasharray={ring === 1.0 ? undefined : '2 3'}
            />
          );
        })}

        {/* 9 Domain Radial Axes */}
        {domains.map((_: any, i: number) => {
          const outerPt = getPoint(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="#443c33"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Shaded Area of Consensus */}
        <path
          d={polygonPath}
          fill="url(#radarGradient)"
          stroke="#38bdf8"
          strokeWidth="2"
          className="motion-safe:animate-radar-reveal motion-reduce:animate-none"
        />

        {/* Data Points and Domain Badges */}
        {domains.map((dom: any, i: number) => {
          const pt = points[i];
          const outerPt = getPoint(i, 1.18);
          const isStrong = dom.grade === 'STRONG';
          const isDivergent = dom.grade === 'DIVERGENT';

          const nodeColor = isStrong
            ? '#10b981'
            : isDivergent
            ? '#f43f5e'
            : '#38bdf8';

          return (
            <g key={dom.domain_id}>
              {/* Vertex Circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill={nodeColor}
                stroke="#0c0a09"
                strokeWidth="1.5"
              />

              {/* Perimeter Label */}
              <text
                x={outerPt.x}
                y={outerPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isDivergent ? '#f43f5e' : '#cbd5e1'}
                fontSize="9"
                fontFamily="monospace"
                fontWeight={isStrong || isDivergent ? 'bold' : 'normal'}
              >
                {dom.domain_id}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-2 text-[11px] text-slate-400 font-sans text-center flex items-center justify-center gap-3 flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Strong (3/3)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span> Moderate (2/3)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span> Divergent (Conflict)
        </span>
      </div>
    </div>
  );
};

interface TibetanMewaProps {
  tibetan: any;
  compact?: boolean;
}

/**
 * Tibetan Mewa 3x3 Magic Square (Luoshu) & Eight Parkha Trigram Ring
 */
export const TibetanMewaGrid: React.FC<TibetanMewaProps> = ({ tibetan, compact }) => {
  const natalMewa = tibetan.mewa?.number || 1;
  const natalParkha = tibetan.parkha?.name || 'Li';

  // Luoshu 3x3 Magic Square positions:
  // [4, 9, 2]
  // [3, 5, 7]
  // [8, 1, 6]
  const square = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ];

  const mewaMeta: Record<number, { name: string; color: string; element: string; bg: string }> = {
    1: { name: '1 White', color: '#f1f5f9', element: 'Iron', bg: '#1e293b' },
    2: { name: '2 Black', color: '#94a3b8', element: 'Water', bg: '#0f172a' },
    3: { name: '3 Blue', color: '#38bdf8', element: 'Water', bg: '#0c4a6e' },
    4: { name: '4 Green', color: '#34d399', element: 'Wood', bg: '#064e3b' },
    5: { name: '5 Yellow', color: '#fbbf24', element: 'Earth', bg: '#78350f' },
    6: { name: '6 White', color: '#f1f5f9', element: 'Iron', bg: '#1e293b' },
    7: { name: '7 Red', color: '#f87171', element: 'Fire', bg: '#7f1d1d' },
    8: { name: '8 White', color: '#f1f5f9', element: 'Iron', bg: '#1e293b' },
    9: { name: '9 Maroon', color: '#fb7185', element: 'Fire', bg: '#881337' },
  };

  const gridCells = (
    <div className={`w-full ${compact ? 'max-w-[165px] sm:max-w-[210px] lg:max-w-[240px] gap-1' : 'max-w-[340px] gap-2'} grid grid-cols-3`}>
      {square.map((row, rIdx) =>
        row.map((num, cIdx) => {
          const isNatal = num === natalMewa;
          const meta = mewaMeta[num];
          const cellIdx = rIdx * 3 + cIdx;
          return (
            <div
              key={`${rIdx}-${num}`}
              className={`${compact ? 'p-1.5 rounded' : 'p-3 rounded-md'} border flex flex-col items-center justify-center text-center animate-grid-cell-reveal motion-safe:transition-colors motion-reduce:transition-none duration-150 ${
                isNatal
                  ? 'border-amber-400 bg-slate-800 shadow-md motion-safe:animate-celestial-glow motion-reduce:animate-none'
                  : 'border-slate-800 bg-slate-900'
              }`}
              style={{ animationDelay: `${cellIdx * 35}ms` }}
            >
              <span
                className={`${compact ? 'text-lg leading-tight' : 'text-2xl'} font-bold font-mono text-slate-100`}
              >
                {num}
              </span>
              <span className={`${compact ? 'text-[9px]' : 'text-[11px] mt-1'} font-sans font-medium text-slate-300`}>
                {meta?.element}
              </span>
              {isNatal && (
                <span className={`${compact ? 'mt-0.5 px-1 py-0.5 text-[8px]' : 'mt-1 px-1.5 py-0.5 text-[9px]'} font-sans font-medium rounded bg-amber-950 text-amber-300 border border-amber-600`}>
                  {compact ? 'Natal' : 'Natal Mewa'}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-0.5">
        {gridCells}
        <div className="mt-2 text-[10px] font-sans text-slate-400">
          Parkha: <strong className="text-cyan-300 font-mono">{natalParkha}</strong> ({tibetan.parkha?.element})
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between w-full max-w-[400px] mb-2 px-1 font-sans">
        <span className="text-xs font-medium text-rose-400">
          Tibetan Mewa Magic Square & Parkha (Luoshu Matrix)
        </span>
        <span className="text-[11px] text-slate-400">Sum = <span className="font-mono tabular-nums">15</span></span>
      </div>

      {gridCells}

      <div className="mt-3 p-2 bg-slate-900 border border-slate-800 rounded w-full max-w-[340px] flex items-center justify-between text-xs font-sans">
        <span className="text-slate-400">Natal Parkha Trigram:</span>
        <span className="text-cyan-300 font-bold font-mono">
          {natalParkha} ({tibetan.parkha?.element})
        </span>
      </div>
    </div>
  );
};

interface EgyptianClockProps {
  egyptian: any;
  compact?: boolean;
}

/**
 * Ancient Egyptian 36-Decan Cosmic Barque Star Clock
 */
export const EgyptianDecanStarClock: React.FC<EgyptianClockProps> = ({ egyptian, compact }) => {
  const guardians = egyptian.decan_guardians || {};
  const hourWatch = egyptian.chronocrator_watch;
  const size = 340;
  const center = size / 2;
  const radius = 120;

  // 36 decans, 10 degrees each
  const decans = Array.from({ length: 36 }).map((_, i) => {
    const angle = (i / 36) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    return {
      index: i + 1,
      angle,
      rad,
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  });

  const svgContent = (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size} ${size}`}
      className={`w-full select-none ${compact ? 'max-w-[165px] sm:max-w-[210px] lg:max-w-[240px] h-auto' : 'max-w-[300px] h-auto'}`}
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
    >
      {/* Outer Dial Track & 36 Decan Radial Ticks (Fluid dial reveal) */}
      <g className="animate-dial-reveal" style={{ transformOrigin: `${center}px ${center}px` }}>
        <circle cx={center} cy={center} r={radius} fill="#0d1118" stroke="#1b2331" strokeWidth="2" />
        <circle cx={center} cy={center} r={radius - 16} fill="none" stroke="#182335" strokeWidth="1" strokeDasharray="3 3" />

        {/* 36 Decan Radial Ticks */}
        {decans.map((d) => {
          const r1 = radius - (d.index % 3 === 1 ? 12 : 6);
          const r2 = radius;
          return (
            <line
              key={d.index}
              x1={center + r1 * Math.cos(d.rad)}
              y1={center + r1 * Math.sin(d.rad)}
              x2={center + r2 * Math.cos(d.rad)}
              y2={center + r2 * Math.sin(d.rad)}
              stroke={d.index % 3 === 1 ? '#38bdf8' : '#2a3649'}
              strokeWidth={d.index % 3 === 1 ? 1.5 : 1}
            />
          );
        })}
      </g>

      {/* Center Barque Wheel */}
      <g className="animate-instrument-focus" style={{ animationDelay: '100ms' }}>
        <circle cx={center} cy={center} r={52} fill="#090d15" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" />
        <text x={center} y={center - 14} textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
          TEMPORAL HOUR
        </text>
        <text x={center} y={center + 4} textAnchor="middle" fill="#f1f5f9" fontSize="14" fontFamily="serif" fontWeight="bold">
          {hourWatch?.hour_ruler_chronocrator}
        </text>
        <text x={center} y={center + 18} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
          Hour #{hourWatch?.temporal_hour_number} ({hourWatch?.period})
        </text>
      </g>

      {/* Key Decan Markers */}
      {guardians.ascendant_decan && (
        <g className="animate-instrument-focus" style={{ animationDelay: '160ms' }}>
          <circle
            cx={decans[(guardians.ascendant_decan.overall_decan_number - 1) % 36]?.x || center}
            cy={decans[(guardians.ascendant_decan.overall_decan_number - 1) % 36]?.y || center}
            r="10"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1"
            className="motion-safe:animate-radar-pulse motion-reduce:animate-none"
            style={{
              transformOrigin: `${decans[(guardians.ascendant_decan.overall_decan_number - 1) % 36]?.x || center}px ${decans[(guardians.ascendant_decan.overall_decan_number - 1) % 36]?.y || center}px`
            }}
          />
          <circle
            cx={decans[(guardians.ascendant_decan.overall_decan_number - 1) % 36]?.x || center}
            cy={decans[(guardians.ascendant_decan.overall_decan_number - 1) % 36]?.y || center}
            r="5"
            fill="#38bdf8"
            stroke="#f1f5f9"
            strokeWidth="1.5"
          />
        </g>
      )}
    </svg>
  );

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-0.5">
        {svgContent}
        <div className="mt-1 text-[10px] text-slate-400 font-sans text-center">
          Ascendant Decan: <span className="text-amber-300 font-medium">{guardians.ascendant_decan?.decan_name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between w-full max-w-[360px] mb-2 px-1 font-sans">
        <span className="text-xs font-medium text-cyan-400">
          Ra’s Cosmic Barque 36-Decan Star Clock
        </span>
        <span className="text-[11px] text-slate-400"><span className="font-mono tabular-nums">10°</span> Segments</span>
      </div>

      {svgContent}

      <div className="mt-2 text-[11px] text-slate-400 font-sans text-center">
        Ascendant Decan: <span className="text-amber-300 font-medium">{guardians.ascendant_decan?.decan_name}</span> (Deity: {guardians.ascendant_decan?.presiding_deity})
      </div>
    </div>
  );
};

interface MayanCompassProps {
  mayan: any;
  compact?: boolean;
}

/**
 * Maya Tzolk'in (260-day) and Haab' (365-day) Sacred Calendar Dial
 */
export const MayaCalendarCompass: React.FC<MayanCompassProps> = ({ mayan, compact }) => {
  const tzolkin = mayan.tzolkin;
  const haab = mayan.haab;
  const size = 320;
  const center = size / 2;
  const outerR = 115;
  const innerR = 75;

  const svgContent = (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size} ${size}`}
      className={`w-full select-none ${compact ? 'max-w-[165px] sm:max-w-[210px] lg:max-w-[240px] h-auto' : 'max-w-[280px] h-auto'}`}
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
    >
      {/* Outer Haab' Ring (365 days / 18 months + Wayeb) */}
      <circle cx={center} cy={center} r={outerR} fill="#0d1118" stroke="#1b2331" strokeWidth="2" />
      <g className="motion-safe:animate-gear-sync motion-reduce:animate-none" style={{ transformOrigin: `${center}px ${center}px` }}>
        {Array.from({ length: 19 }).map((_, i) => {
          const ang = (i / 19) * 360 - 90;
          const rad = (ang * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={center + (outerR - 10) * Math.cos(rad)}
              y1={center + (outerR - 10) * Math.sin(rad)}
              x2={center + outerR * Math.cos(rad)}
              y2={center + outerR * Math.sin(rad)}
              stroke="#0284c7"
              strokeWidth="1.5"
            />
          );
        })}
      </g>

      {/* Inner Tzolk'in Ring (260 days / 20 day signs x 13 numbers) */}
      <circle cx={center} cy={center} r={innerR} fill="#090d15" stroke="#0284c7" strokeWidth="1.5" />
      <g className="motion-safe:animate-gear-reverse motion-reduce:animate-none" style={{ transformOrigin: `${center}px ${center}px` }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const ang = (i / 20) * 360 - 90;
          const rad = (ang * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={center + (innerR - 8) * Math.cos(rad)}
              y1={center + (innerR - 8) * Math.sin(rad)}
              x2={center + innerR * Math.cos(rad)}
              y2={center + innerR * Math.sin(rad)}
              stroke="#38bdf8"
              strokeWidth="1"
            />
          );
        })}
      </g>

      {/* Hub: Kin & Calendar Round */}
      <g className="animate-instrument-focus" style={{ transformOrigin: `${center}px ${center}px`, animationDelay: '100ms' }}>
        <circle cx={center} cy={center} r={44} fill="#0b0f19" stroke="#38bdf8" strokeWidth="2" />
        <text x={center} y={center - 10} textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">
          {tzolkin?.formatted}
        </text>
        <text x={center} y={center + 6} textAnchor="middle" fill="#f1f5f9" fontSize="11" fontFamily="sans-serif">
          {haab?.formatted}
        </text>
        <text x={center} y={center + 20} textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">
          Glyph: {tzolkin?.symbol}
        </text>
      </g>
    </svg>
  );

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-0.5">
        {svgContent}
        <div className="mt-1 text-[10px] text-slate-400 font-sans text-center">
          Long Count: <span className="text-cyan-300 font-mono">{mayan.long_count?.formatted}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between w-full max-w-[340px] mb-2 px-1 font-sans">
        <span className="text-xs font-medium text-cyan-400">
          Maya Calendar Round Interlocking Wheels
        </span>
        <span className="text-[11px] text-slate-400"><span className="font-mono tabular-nums">52</span>-Year Cycle</span>
      </div>

      {svgContent}

      <div className="mt-2 text-[11px] text-slate-400 font-sans text-center flex items-center justify-center gap-1.5">
        <span>Long Count:</span>
        <span className="text-cyan-300 font-mono">{mayan.long_count?.formatted}</span>
        <span className="w-px h-3 bg-slate-700 inline-block" aria-hidden="true" />
        <span>Kin</span>
        <span className="font-mono tabular-nums">#{mayan.long_count?.total_kin}</span>
      </div>
    </div>
  );
};


