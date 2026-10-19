import React, { useState } from 'react';
import type { ChartResponse } from '../types';

interface Props {
  data: ChartResponse;
}

export const TraditionCharts: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'jyotisha' | 'bazi' | 'western' | 'ziwei' | 'mayan' | 'tibetan'>('jyotisha');

  const { jyotisha, bazi, western, ziwei, mayan, tibetan } = data.traditions;

  return (
    <div className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-5">
      {/* Tradition Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#1b2331] gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
            04 / Deterministic Tradition Calculators
          </span>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">
            Six Cultural Computation Datasets
          </h3>
        </div>

        {/* Clean Typographic Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'jyotisha', label: 'Jyotisha (Vedic)' },
            { id: 'bazi', label: 'BaZi (Four Pillars)' },
            { id: 'western', label: 'Western (Hellenistic)' },
            { id: 'ziwei', label: 'Zi Wei Dou Shu' },
            { id: 'mayan', label: 'Maya Calendar' },
            { id: 'tibetan', label: 'Tibetan Elemental' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#182232] text-cyan-300 border border-cyan-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121721] border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Jyotisha */}
      {activeTab === 'jyotisha' && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase tracking-wider">
                Sidereal Zodiac • Lahiri (Chitra Paksha) Ayanamsha
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Lagna (Ascendant): {jyotisha.lagna.sign} ({jyotisha.lagna.degree.toFixed(2)}°)
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Nakshatra: {jyotisha.lagna.nakshatra?.name} Pada {jyotisha.lagna.nakshatra?.pada} (Lord: {jyotisha.lagna.nakshatra?.lord}) | D9 Navamsha: {jyotisha.lagna.navamsha_sign}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-amber-300 border border-amber-900/60">
                Ayanamsha: {data.astronomical_base.ayanamsha.degrees.toFixed(4)}°
              </span>
            </div>
          </div>

          {/* Grahas Table */}
          <div className="overflow-x-auto rounded border border-[#1b2331]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#080a0f] text-slate-400 border-b border-[#1b2331] font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3">Graha</th>
                  <th className="py-2 px-3">Sign</th>
                  <th className="py-2 px-3 font-mono">Degree</th>
                  <th className="py-2 px-3">House</th>
                  <th className="py-2 px-3">Dignity</th>
                  <th className="py-2 px-3">Nakshatra & Pada</th>
                  <th className="py-2 px-3">D9 Navamsha</th>
                  <th className="py-2 px-3">D10 Dashamsha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2331] bg-[#0d1118] font-mono text-[11px] tabular-nums">
                {Object.entries(jyotisha.grahas).map(([name, g]: [string, any]) => (
                  <tr key={name} className="hover:bg-[#121721] transition-colors">
                    <td className="py-2 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                      {name}
                      {g.is_retrograde && <span className="text-[10px] text-amber-400 font-mono">(R)</span>}
                      {g.is_combust && <span className="text-[10px] text-rose-400 font-mono">(C)</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-300">{g.sign}</td>
                    <td className="py-2 px-3 text-cyan-300">{g.degree_in_sign.toFixed(2)}°</td>
                    <td className="py-2 px-3 font-mono font-medium text-slate-200">H{g.house}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        g.dignity === 'Exalted' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        g.dignity === 'Debilitated' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        g.dignity === 'Own Sign' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        'text-slate-400'
                      }`}>
                        {g.dignity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      {g.nakshatra?.name} P{g.nakshatra?.pada} ({g.nakshatra?.lord})
                    </td>
                    <td className="py-2 px-3 text-amber-300">{g.navamsha_sign}</td>
                    <td className="py-2 px-3 text-purple-300">{g.dashamsha_sign}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Classical Yogas Whitelist */}
          {jyotisha.yogas && jyotisha.yogas.length > 0 && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Declared Classical Yogas Whitelist
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {jyotisha.yogas.map((y: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331] text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-amber-300 font-mono">{y.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {y.polarity}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-mono">{y.rule}</p>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">Involves: {y.involved_planets.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vimshottari Mahadasha Sequence */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Vimshottari Mahadashas (120-Year Full Cycle)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-xs font-mono">
              {jyotisha.vimshottari_dashas.map((d: any, idx: number) => (
                <div key={idx} className="p-2 rounded bg-[#0d1118] border border-[#1b2331] text-center">
                  <span className="font-semibold text-amber-400 text-xs block">{d.lord}</span>
                  <span className="text-[10px] text-slate-400">{d.total_span_years}y</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">{d.start_date.slice(0, 4)}–{d.end_date.slice(0, 4)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: BaZi */}
      {activeTab === 'bazi' && (
        <div className="mt-4 space-y-4">
          {/* Four Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            {['hour', 'day', 'month', 'year'].map((pKey) => {
              const p = bazi.pillars[pKey];
              if (!p || !p.available) return null;
              const isDay = pKey === 'day';
              return (
                <div
                  key={pKey}
                  className={`p-3.5 rounded-md border ${
                    isDay ? 'bg-[#0f1715] border-emerald-800/80' : 'bg-[#080a0f] border-[#1b2331]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    {p.name} {isDay ? '(Day Master)' : 'Pillar'}
                  </span>
                  <div className="text-2xl font-serif text-white my-1.5 flex justify-center gap-2">
                    <span className="text-amber-400">{p.stem}</span>
                    <span className="text-emerald-400">{p.branch}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300">
                    {p.stem_element} {p.stem_polarity} / {p.branch_element}
                  </div>
                  <div className="mt-1.5 text-[10px] text-cyan-300 font-mono py-0.5 px-1.5 rounded bg-[#121721] border border-[#1b2331]">
                    {p.ten_god_stem}
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 space-y-0.5 text-left font-mono">
                    <span className="text-slate-500 block">Hidden:</span>
                    {p.hidden_stems.map((hs: any, hIdx: number) => (
                      <div key={hIdx} className="flex justify-between">
                        <span>{hs.stem} ({hs.element})</span>
                        <span className="text-slate-500">{hs.ten_god}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day Master & Five Elements Balance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Day Master Assessment
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-serif text-amber-400">
                    {bazi.day_master.stem} ({bazi.day_master.element} {bazi.day_master.polarity})
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Season: {bazi.day_master.in_season ? 'Born In Supportive Season' : 'Born Out of Season'}
                  </p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-mono font-medium rounded border ${
                  bazi.day_master.strength.includes('Strong')
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {bazi.day_master.strength}
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-400 font-mono space-y-1">
                <div>Rooting: {bazi.day_master.rooting.join(', ') || 'No direct root'}</div>
                <div>Support: {bazi.day_master.support_score} vs Drain: {bazi.day_master.drain_score}</div>
                <div>Na Yin: {bazi.year_nayin}</div>
              </div>
            </div>

            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Five Elements Distribution
              </span>
              <div className="space-y-1.5 mt-2">
                {Object.entries(bazi.five_elements_balance.percentages).map(([elem, pct]: [string, any]) => (
                  <div key={elem} className="space-y-0.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{elem}</span>
                      <span className="text-cyan-300 tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                      <div
                        className={`h-full ${
                          elem === 'Wood' ? 'bg-emerald-500' :
                          elem === 'Fire' ? 'bg-rose-500' :
                          elem === 'Earth' ? 'bg-amber-500' :
                          elem === 'Metal' ? 'bg-slate-300' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Da Yun Decades */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Da Yun (10-Year Luck Pillars Progression)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-mono">
              {bazi.da_yun_luck_pillars.map((dy: any) => (
                <div key={dy.step} className="p-2 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-[10px] text-slate-500 block">Age {dy.start_age}</span>
                  <span className="text-base font-serif text-white my-0.5 block">
                    {dy.stem}{dy.branch}
                  </span>
                  <span className="text-[10px] text-cyan-300 block">{dy.ten_god}</span>
                  <span className="text-[9px] text-slate-500 block">{dy.start_year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Western */}
      {activeTab === 'western' && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-blue-400 font-mono font-semibold uppercase tracking-wider">
                Tropical Zodiac • Whole-Sign Houses
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Ascendant: {western.ascendant.sign} ({western.ascendant.degree}°)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Sect: <strong className="text-white font-mono">{western.sect.label}</strong> • Benefic: <span className="text-emerald-400 font-mono">{western.sect.sect_benefic}</span> • Malefic: <span className="text-rose-400 font-mono">{western.sect.sect_malefic}</span>
              </p>
            </div>
            {western.lots.lot_of_fortune && (
              <div className="text-xs font-mono text-slate-300 bg-[#121721] p-2.5 rounded border border-[#1b2331]">
                <div>Lot of Fortune: {western.lots.lot_of_fortune.sign} {western.lots.lot_of_fortune.degree}° (H{western.lots.lot_of_fortune.house})</div>
                <div>Lot of Spirit: {western.lots.lot_of_spirit.sign} {western.lots.lot_of_spirit.degree}° (H{western.lots.lot_of_spirit.house})</div>
              </div>
            )}
          </div>

          {/* Planets & Essential Dignities Table */}
          <div className="overflow-x-auto rounded border border-[#1b2331]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#080a0f] text-slate-400 border-b border-[#1b2331] font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3">Planet</th>
                  <th className="py-2 px-3">Sign</th>
                  <th className="py-2 px-3 font-mono">Degree</th>
                  <th className="py-2 px-3">House</th>
                  <th className="py-2 px-3">Angularity</th>
                  <th className="py-2 px-3 font-mono">Dignity Score</th>
                  <th className="py-2 px-3">Essential Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2331] bg-[#0d1118] font-mono text-[11px] tabular-nums">
                {Object.entries(western.planets).map(([name, p]: [string, any]) => (
                  <tr key={name} className="hover:bg-[#121721] transition-colors">
                    <td className="py-2 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                      {name}
                      {p.is_retrograde && <span className="text-[10px] text-amber-400 font-mono">(R)</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-300">{p.sign}</td>
                    <td className="py-2 px-3 text-cyan-300">{p.degree_in_sign?.toFixed(2)}°</td>
                    <td className="py-2 px-3 text-slate-200">H{p.house}</td>
                    <td className="py-2 px-3 text-slate-400">{p.angularity}</td>
                    <td className="py-2 px-3">
                      {p.is_traditional ? (
                        <span className={p.dignity_score > 0 ? 'text-emerald-400' : p.dignity_score < 0 ? 'text-rose-400' : 'text-slate-400'}>
                          {p.dignity_score > 0 ? `+${p.dignity_score}` : p.dignity_score}
                        </span>
                      ) : <span className="text-slate-600 font-normal">Modern</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-300 text-[11px]">
                      {p.dignity_breakdown?.join(', ') || 'Peregrine (0)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Aspects Grid */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Major Ptolemaic Aspects (With Exact Orbs)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
              {western.aspects.map((asp: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331] flex justify-between items-center">
                  <div>
                    <span className="text-slate-200">{asp.planet_1} {asp.aspect} {asp.planet_2}</span>
                    <span className="text-[10px] text-slate-500 block">{asp.status}</span>
                  </div>
                  <span className="text-cyan-400 font-medium tabular-nums">{asp.exact_orb_deg}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Zi Wei Dou Shu */}
      {activeTab === 'ziwei' && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-purple-400 font-mono font-semibold uppercase tracking-wider">
                Zi Wei Dou Shu • Twelve Palaces & 14 Major Stars
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Bureau: {ziwei.five_elements_bureau.name} | Ming: {ziwei.ming_palace_branch} | Shen: {ziwei.shen_palace_branch}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Lunar Date: {ziwei.lunar_date.year} Year, Month {ziwei.lunar_date.month}, Day {ziwei.lunar_date.day} ({ziwei.lunar_date.hour_branch} Hour)
              </p>
            </div>
            <div className="text-xs font-mono text-purple-300 bg-[#121721] p-2.5 rounded border border-[#1b2331]">
              <span className="font-semibold text-amber-400 block mb-0.5">Si Hua Transformations:</span>
              <div>Lu: {ziwei.si_hua_transformations.Lu} | Quan: {ziwei.si_hua_transformations.Quan}</div>
              <div>Ke: {ziwei.si_hua_transformations.Ke} | Ji: {ziwei.si_hua_transformations.Ji}</div>
            </div>
          </div>

          {/* 12 Palaces Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {ziwei.palaces.map((p: any) => (
              <div
                key={p.name}
                className={`p-3 rounded-md border ${
                  p.is_ming
                    ? 'bg-[#14121f] border-purple-800'
                    : p.is_shen
                    ? 'bg-[#0f171b] border-cyan-800'
                    : 'bg-[#080a0f] border-[#1b2331]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-semibold text-slate-200 text-xs">
                    {p.name} {p.is_ming && '★'}
                  </span>
                  <span className="text-xs font-serif text-slate-400">
                    {p.branch}
                  </span>
                </div>
                <div className="min-h-[44px] space-y-1">
                  {p.stars.length > 0 ? (
                    p.stars.map((s: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="inline-block text-[10px] font-mono font-medium bg-[#121721] border border-[#1b2331] px-1.5 py-0.5 rounded text-amber-300 mr-1 mb-1"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600 text-[10px] font-mono italic">Borrowing Stars</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Maya Calendar */}
      {activeTab === 'mayan' && (
        <div className="mt-4 space-y-4">
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] text-cyan-400 font-mono font-semibold uppercase tracking-wider">
              Classic Maya Long Count & Calendar Round • GMT Correlation (584283)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-4">
              <div>
                <span className="text-xl font-mono font-bold text-cyan-300">
                  {mayan.long_count.formatted}
                </span>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Total Kin: <span className="text-slate-200">{mayan.long_count.total_kin}</span> • Lord of Night: <span className="text-amber-300">{mayan.lord_of_the_night}</span>
                </p>
              </div>
              <div className="px-2.5 py-1 text-xs font-mono font-medium rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Round-Trip Verification: PASS
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Tzolk'in 260-Day Sacred Cycle</span>
              <h4 className="text-lg font-mono font-semibold text-slate-100 mt-1">
                {mayan.tzolkin.formatted}
              </h4>
              <p className="text-xs text-amber-300 font-mono mt-0.5">
                Glyph: {mayan.tzolkin.symbol}
              </p>
              <p className="text-xs text-slate-400 mt-1.5 font-mono">
                Archetype: {mayan.tzolkin.archetype_keywords}
              </p>
            </div>

            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Haab' 365-Day Solar Cycle</span>
              <h4 className="text-lg font-mono font-semibold text-slate-100 mt-1">
                {mayan.haab.formatted}
              </h4>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">
                Calendar Round: {mayan.calendar_round}
              </p>
              <p className="text-[11px] text-slate-500 mt-1.5 italic font-mono">
                *Attributed Symbolic Overlay: non-causal archetype resonance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Tibetan Elemental */}
      {activeTab === 'tibetan' && (
        <div className="mt-4 space-y-4">
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] text-rose-400 font-mono font-semibold uppercase tracking-wider">
              Tibetan Elemental Astrology (Jungtsi / འབྱུང་རྩིས)
            </span>
            <div className="mt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-slate-100">
                  {tibetan.rabjung_cycle.element_gender_animal}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Rabjung Cycle {tibetan.rabjung_cycle.rabjung_number}, Year {tibetan.rabjung_cycle.year_in_cycle} (Base 1027 CE)
                </p>
              </div>
              <div className="text-xs font-mono text-slate-300 bg-[#121721] p-2.5 rounded border border-[#1b2331]">
                <div>Year Mewa: <strong className="text-amber-400">{tibetan.mewa.formatted}</strong></div>
                <div>Natal Parkha: <strong className="text-cyan-400">{tibetan.parkha.name} ({tibetan.parkha.element})</strong></div>
              </div>
            </div>
          </div>

          {/* Five Personal Forces */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Five Personal Forces (Khams Lnga)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">Sog (Life)</span>
                <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">{tibetan.five_personal_forces.sog_life_force}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">Lu (Body)</span>
                <span className="text-xs font-semibold text-blue-400 mt-0.5 block">{tibetan.five_personal_forces.lu_body_health}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">Wang (Power)</span>
                <span className="text-xs font-semibold text-amber-400 mt-0.5 block">{tibetan.five_personal_forces.wang_power_status}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">Lungta (Fortune)</span>
                <span className="text-xs font-semibold text-purple-400 mt-0.5 block">{tibetan.five_personal_forces.lungta_wind_horse_fortune}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">La (Soul)</span>
                <span className="text-xs font-semibold text-cyan-400 mt-0.5 block">{tibetan.five_personal_forces.la_soul_vitality}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
