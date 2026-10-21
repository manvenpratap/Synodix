import React, { useState } from 'react';
import type { ChartResponse } from '../types';
import {
  NorthIndianChart,
  WesternCircularWheel,
  BaZiElementPentagram,
  ZiWeiPalaceGrid,
  AlmutenDignityBarChart,
  MaramatakaLunarDial,
  TibetanMewaGrid,
  EgyptianDecanStarClock,
  MayaCalendarCompass
} from './ChartWheelVisualizer';

interface Props {
  data: ChartResponse;
}

export const TraditionCharts: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'jyotisha' | 'bazi' | 'western' | 'persian' | 'egyptian' | 'ziwei' | 'mayan' | 'tibetan' | 'maramataka'>('jyotisha');
  const [chartViewMode, setChartViewMode] = useState<'both' | 'chart' | 'table'>('both');

  const { jyotisha, bazi, western, ziwei, mayan, tibetan, persian, egyptian, maramataka } = data.traditions;

  return (
    <div className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-5">
      {/* Tradition Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[#1b2331] gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
            Deterministic Tradition Calculators
          </span>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">
            Cultural Computation Datasets
          </h3>
        </div>

        {/* Clean Typographic Tabs */}
        <div role="tablist" aria-label="Astrological tradition charts" className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'jyotisha', label: 'Jyotisha (Vedic)' },
            { id: 'bazi', label: 'BaZi (Four Pillars)' },
            { id: 'western', label: 'Western (Hellenistic)' },
            { id: 'persian', label: 'Persian (Almuten)' },
            { id: 'egyptian', label: 'Egyptian (Decans)' },
            { id: 'ziwei', label: 'Zi Wei Dou Shu' },
            { id: 'mayan', label: 'Maya Calendar' },
            { id: 'tibetan', label: 'Tibetan Elemental' },
            { id: 'maramataka', label: 'Polynesian Maramataka' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tradition-tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tradition-panel-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] ${
                  isActive
                    ? 'bg-[#182232] text-cyan-300 border border-cyan-800 shadow-xs'
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
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase tracking-wider">
                Sidereal Zodiac • Lahiri (Chitra Paksha) Ayanamsha
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Lagna (Ascendant): {jyotisha.lagna.sign} ({jyotisha.lagna.degree.toFixed(2)}°)
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Nakshatra: {jyotisha.lagna.nakshatra?.name} Pada {jyotisha.lagna.nakshatra?.pada} (Lord: {jyotisha.lagna.nakshatra?.lord}) | D9: {jyotisha.lagna.navamsha_sign} | D3: {jyotisha.lagna.drekkana_sign}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-amber-300 border border-amber-900/60">
                Ayanamsha: {data.astronomical_base.ayanamsha.degrees.toFixed(4)}°
              </span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-2.5 rounded-md border border-[#1b2331] gap-2">
            <span className="text-xs font-mono text-slate-400">Display Presentation:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setChartViewMode('both')}
                className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                  chartViewMode === 'both' ? 'bg-[#182232] text-cyan-300 font-semibold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Comprehensive (Kundali + Data)
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('chart')}
                className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                  chartViewMode === 'chart' ? 'bg-[#182232] text-cyan-300 font-semibold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Visual Kundali
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('table')}
                className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                  chartViewMode === 'table' ? 'bg-[#182232] text-cyan-300 font-semibold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Telemetry Tables
              </button>
            </div>
          </div>

          {/* Visual Kundali */}
          {chartViewMode !== 'table' && (
            <NorthIndianChart jyotisha={jyotisha} />
          )}

          {chartViewMode !== 'chart' && (
            <>
              {/* Grahas Table with Complete Divisional Subdivisions */}
              <div className="overflow-x-auto rounded border border-[#1b2331]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#080a0f] text-slate-400 border-b border-[#1b2331] font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3 sticky left-0 bg-[#080a0f] z-10 border-r border-[#1b2331]">Graha</th>
                  <th className="py-2 px-3">Sign</th>
                  <th className="py-2 px-3 font-mono">Degree</th>
                  <th className="py-2 px-3">House</th>
                  <th className="py-2 px-3">Dignity</th>
                  <th className="py-2 px-3">Nakshatra & Pada</th>
                  <th className="py-2 px-3">D9 Nav</th>
                  <th className="py-2 px-3">D10 Dash</th>
                  <th className="py-2 px-3">D3 Drek</th>
                  <th className="py-2 px-3">D7 Sapt</th>
                  <th className="py-2 px-3">D12 Dwad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2331] bg-[#0d1118] font-mono text-[11px] tabular-nums">
                {Object.entries(jyotisha.grahas).map(([name, g]: [string, any]) => (
                  <tr key={name} className="hover:bg-[#121721] transition-colors">
                    <td className="py-2 px-3 font-sans font-medium text-slate-100 flex items-center gap-1.5 whitespace-nowrap sticky left-0 bg-[#0d1118] z-10 border-r border-[#1b2331]">
                      {name}
                      {g.is_retrograde && <span className="text-[10px] text-amber-400 font-mono" title="Retrograde">(R)</span>}
                      {g.is_combust && <span className="text-[10px] text-rose-400 font-mono" title="Combust">(C)</span>}
                      {g.is_gandanta && (
                        <span className="text-[10px] text-rose-400 font-mono bg-rose-950/60 px-1 rounded border border-rose-900" title={g.gandanta_zone}>
                          GD
                        </span>
                      )}
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
                    <td className="py-2 px-3 text-slate-300 whitespace-nowrap">
                      {g.nakshatra?.name} P{g.nakshatra?.pada} ({g.nakshatra?.lord})
                    </td>
                    <td className="py-2 px-3 text-amber-300">{g.navamsha_sign}</td>
                    <td className="py-2 px-3 text-purple-300">{g.dashamsha_sign}</td>
                    <td className="py-2 px-3 text-slate-300">{g.drekkana_sign || '-'}</td>
                    <td className="py-2 px-3 text-slate-400">{g.saptamsha_sign || '-'}</td>
                    <td className="py-2 px-3 text-slate-400">{g.dwadashamsha_sign || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Planetary War Alert if Occurring */}
          {jyotisha.graha_yuddha && jyotisha.graha_yuddha.length > 0 && (
            <div className="bg-[#191013] p-3 rounded-md border border-rose-900/80">
              <span className="text-[10px] font-mono font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                Graha Yuddha (Planetary War within 1.0° Longitude)
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                {jyotisha.graha_yuddha.map((war: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:justify-between text-slate-300">
                    <div>
                      <strong className="text-rose-300">{war.planet_1} vs {war.planet_2}</strong> (Separation: {war.separation_deg}°)
                    </div>
                    <span className="text-emerald-400">{war.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classical Yogas Whitelist */}
          {jyotisha.yogas && jyotisha.yogas.length > 0 && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Classical Yogas Whitelist ({jyotisha.yogas.length} Formed)
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

          {/* Graha Drishti (Aspects) Collapsible / Compact Grid */}
          {jyotisha.graha_drishti && jyotisha.graha_drishti.length > 0 && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Parashari Graha Drishti (Full-Strength Aspects)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
                {jyotisha.graha_drishti.slice(0, 12).map((asp: any, idx: number) => (
                  <div key={idx} className="p-2 rounded bg-[#0d1118] border border-[#1b2331]">
                    <span className="text-amber-400 font-medium block">{asp.graha} (H{asp.source_house})</span>
                    <span className="text-slate-300 text-[11px] block">→ H{asp.target_house} ({asp.target_sign.slice(0, 3)})</span>
                    <span className="text-[9px] text-slate-500 block truncate">{asp.aspect_type.split(' ')[0]}</span>
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
          </>
          )}
        </div>
      )}

      {/* Tab 2: BaZi */}
      {activeTab === 'bazi' && (
        <div className="mt-4 space-y-4 animate-tab-enter">
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
                  {bazi.all_nayin && bazi.all_nayin[pKey] && (
                    <div className="mt-1 text-[9px] text-slate-400 font-mono">
                      Na Yin: <span className="text-amber-300">{bazi.all_nayin[pKey]}</span>
                    </div>
                  )}
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

          {/* Wu Xing Element Pentagram Diagram */}
          <BaZiElementPentagram bazi={bazi} />

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
                <div>Year Na Yin: {bazi.year_nayin}</div>
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

          {/* Branch & Stem Interactions (Combinations, Clashes, Harms, Punishments) */}
          {bazi.branch_interactions && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Pillar Interactions & Combinations (He / Chong / Xing / Hai)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono">
                {/* Harmonies & Combinations */}
                <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-emerald-400 font-semibold block mb-1">Harmonies & Transformations:</span>
                  {bazi.branch_interactions.six_harmonies.length === 0 &&
                   bazi.branch_interactions.three_harmonies.length === 0 &&
                   bazi.branch_interactions.stem_combinations.length === 0 ? (
                    <span className="text-slate-500 text-[11px]">No direct major harmonies active</span>
                  ) : (
                    <div className="space-y-1">
                      {bazi.branch_interactions.stem_combinations.map((sc: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {sc.type} ({sc.pillars.join(' + ')})
                        </div>
                      ))}
                      {bazi.branch_interactions.six_harmonies.map((sh: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {sh.type} ({sh.pillars.join(' + ')})
                        </div>
                      ))}
                      {bazi.branch_interactions.three_harmonies.map((th: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {th.type} ({th.pillars.join(', ')})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clashes, Punishments & Harms */}
                <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-rose-400 font-semibold block mb-1">Clashes, Harms & Punishments:</span>
                  {bazi.branch_interactions.six_clashes.length === 0 &&
                   bazi.branch_interactions.punishments.length === 0 &&
                   bazi.branch_interactions.six_harms.length === 0 ? (
                    <span className="text-slate-500 text-[11px]">No structural clashes or punishments active</span>
                  ) : (
                    <div className="space-y-1">
                      {bazi.branch_interactions.six_clashes.map((c: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {c.type} ({c.pillars.join(' vs ')})
                        </div>
                      ))}
                      {bazi.branch_interactions.punishments.map((p: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {p.type} ({p.pillars.join(', ')})
                        </div>
                      ))}
                      {bazi.branch_interactions.six_harms.map((h: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {h.type} ({h.pillars.join(' vs ')})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shen Sha (Symbolic Stars) */}
          {bazi.shen_sha && bazi.shen_sha.length > 0 && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Shen Sha (Symbolic & Auxiliary Spirits)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
                {bazi.shen_sha.map((star: any, idx: number) => (
                  <div key={idx} className={`p-2.5 rounded border ${
                    star.present ? 'bg-[#0d1118] border-cyan-900/60' : 'bg-[#080a0f] border-[#1b2331] opacity-60'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-semibold ${star.present ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {star.name}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                        star.present ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-300 border border-[#1b2331]'
                      }`}>
                        {star.present ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    {star.present && (
                      <span className="text-[10px] text-amber-300 block mb-0.5">
                        Found in: {star.locations.join(', ')}
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">{star.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
        <div className="mt-4 space-y-4 animate-tab-enter">
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

          {/* View Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-2.5 rounded-md border border-[#1b2331] gap-2">
            <span className="text-xs font-mono text-slate-400">Display Presentation:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setChartViewMode('both')}
                className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                  chartViewMode === 'both' ? 'bg-[#182232] text-cyan-300 font-semibold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Comprehensive (Wheel + Data)
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('chart')}
                className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                  chartViewMode === 'chart' ? 'bg-[#182232] text-cyan-300 font-semibold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Visual Wheel
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('table')}
                className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                  chartViewMode === 'table' ? 'bg-[#182232] text-cyan-300 font-semibold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Telemetry Tables
              </button>
            </div>
          </div>

          {/* Visual Western Wheel */}
          {chartViewMode !== 'table' && (
            <WesternCircularWheel western={western} />
          )}

          {chartViewMode !== 'chart' && (
            <>
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
                      ) : <span className="text-slate-400 font-normal">Modern</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-300 text-[11px]">
                      {p.dignity_breakdown?.join(', ') || 'Peregrine (0)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mutual Reception Banner if Present */}
          {western.mutual_receptions && western.mutual_receptions.length > 0 && (
            <div className="bg-[#0f1715] p-3 rounded-md border border-emerald-800/80">
              <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Mutual Reception by Domicile
              </span>
              <div className="space-y-1 text-xs font-mono text-slate-300">
                {western.mutual_receptions.map((mr: any, idx: number) => (
                  <div key={idx}>
                    • <strong className="text-emerald-300">{mr.planet_1}</strong> (in {mr.sign_1}) ↔ <strong className="text-emerald-300">{mr.planet_2}</strong> (in {mr.sign_2}) — mutual empowerment and shared agency
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Major Ptolemaic Aspects Grid */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Major Ptolemaic Aspects ({western.aspects.length} Active • Dynamic Motion)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
              {western.aspects.map((asp: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331] flex justify-between items-center">
                  <div>
                    <span className="text-slate-200">{asp.planet_1} {asp.aspect} {asp.planet_2}</span>
                    <span className={`text-[10px] block ${
                      asp.status === 'Applying' ? 'text-cyan-400' : 'text-slate-500'
                    }`}>{asp.status}</span>
                  </div>
                  <span className="text-cyan-400 font-medium tabular-nums">{asp.exact_orb_deg}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* Minor Aspects Grid */}
          {western.minor_aspects && western.minor_aspects.length > 0 && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Minor Harmonics & Keplarian Aspects (Quincunx, Semi-Sextile, Semi-Square, Sesquiquadrate)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
                {western.minor_aspects.map((asp: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331] flex justify-between items-center">
                    <div>
                      <span className="text-slate-300">{asp.planet_1} {asp.aspect} {asp.planet_2}</span>
                      <span className={`text-[10px] block ${
                        asp.status === 'Applying' ? 'text-amber-400' : 'text-slate-500'
                      }`}>{asp.status}</span>
                    </div>
                    <span className="text-amber-400 font-medium tabular-nums">{asp.exact_orb_deg}°</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Antiscia and Contra-Antiscia Reflections */}
          {((western.antiscia_pairs && western.antiscia_pairs.length > 0) ||
            (western.contra_antiscia_pairs && western.contra_antiscia_pairs.length > 0)) && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Solstitial & Equinoctial Reflections (Antiscia & Contra-Antiscia)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {western.antiscia_pairs?.map((p: any, idx: number) => (
                  <div key={`ant-${idx}`} className="p-2 rounded bg-[#0d1118] border border-[#1b2331] flex justify-between items-center">
                    <span className="text-slate-200">{p.planet_1} ☌ {p.planet_2} (Antiscia)</span>
                    <span className="text-cyan-400 text-[11px] tabular-nums">{p.orb_deg}° orb</span>
                  </div>
                ))}
                {western.contra_antiscia_pairs?.map((p: any, idx: number) => (
                  <div key={`contra-${idx}`} className="p-2 rounded bg-[#0d1118] border border-[#1b2331] flex justify-between items-center">
                    <span className="text-slate-200">{p.planet_1} ☍ {p.planet_2} (Contra-Antiscia)</span>
                    <span className="text-amber-400 text-[11px] tabular-nums">{p.orb_deg}° orb</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </>
          )}
        </div>
      )}

      {/* Tab 4: Zi Wei Dou Shu */}
      {activeTab === 'ziwei' && (
        <div className="mt-4 space-y-4 animate-tab-enter">
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

          {/* Ming Palace Star Quality Assessment */}
          {ziwei.ming_star_quality && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold block">
                  Ming Palace Star Dynamics
                </span>
                <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                  Configuration: {ziwei.ming_star_quality.assessment}
                </span>
                <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                  Major: {ziwei.ming_star_quality.major_auspicious_count} Auspicious / {ziwei.ming_star_quality.major_dynamic_count} Dynamic • Auxiliary: {ziwei.ming_star_quality.auxiliary_auspicious_count} Auspicious / {ziwei.ming_star_quality.auxiliary_malefic_count} Malefic
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-mono rounded border ${
                  ziwei.ming_star_quality.assessment.includes('Fortified')
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : ziwei.ming_star_quality.assessment.includes('Frictional')
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-purple-950 text-purple-300 border-purple-800'
                }`}>
                  {ziwei.ming_star_quality.assessment}
                </span>
              </div>
            </div>
          )}

          {/* Zi Wei Authentic 4x4 Courtyard Grid */}
          <ZiWeiPalaceGrid ziwei={ziwei} />

          {/* 12 Palaces Detailed List with Auxiliary Stars */}
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
                    p.stars.map((s: string, sIdx: number) => {
                      const isAux = s.startsWith('[A]');
                      return (
                        <span
                          key={sIdx}
                          className={`inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded mr-1 mb-1 border ${
                            isAux
                              ? 'bg-[#0b1622] border-cyan-900/60 text-cyan-300'
                              : 'bg-[#121721] border-[#1b2331] text-amber-300'
                          }`}
                        >
                          {s}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-slate-400 text-[10px] font-mono italic">Borrowing Stars</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Maya Calendar */}
      {activeTab === 'mayan' && (
        <div className="mt-4 space-y-4 animate-tab-enter">
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

          {/* Maya Sacred Calendar Round Dial */}
          <MayaCalendarCompass mayan={mayan} />

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
        <div className="mt-4 space-y-4 animate-tab-enter">
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

          {/* Tibetan Mewa Magic Square & Parkha */}
          <TibetanMewaGrid tibetan={tibetan} />

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

      {/* Tab: Persian & Medieval Arabic (Ilm al-Nujūm) */}
      {activeTab === 'persian' && persian && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase tracking-wider">
                Persian & Medieval Arabic • Ilm al-Nujūm (علم النجوم)
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Almuten Figuris (Supreme Soul Guide): <span className="text-amber-400 font-bold">{persian.almuten_figuris.victor}</span> (Score: {persian.almuten_figuris.victor_score} pts)
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {persian.sect.sect_name} • Planetary Day Ruler: <strong className="text-cyan-300">{persian.sect.day_ruler}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-amber-300 border border-amber-900/60">
                Almuten: {persian.almuten_figuris.victor}
              </span>
            </div>
          </div>

          {/* Almuten Comparative Dignity Bar Visualizer */}
          <AlmutenDignityBarChart persian={persian} />

          {/* Almuten Figuris Dignity Leaderboard */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Weighted Dignity Leaderboard (Abu Ma'shar / Al-Qabisi Point System)
            </span>
            <div className="overflow-x-auto rounded border border-[#1b2331]">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-[#0d1118] text-slate-400 border-b border-[#1b2331] uppercase text-[10px]">
                    <th className="py-2 px-3">Rank & Planet</th>
                    <th className="py-2 px-3 text-right">Essential Pts</th>
                    <th className="py-2 px-3 text-right">Accidental Pts</th>
                    <th className="py-2 px-3 text-right">Total Score</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2331] text-[11px] tabular-nums">
                  {persian.almuten_figuris.leaderboard.map((item: any, idx: number) => (
                    <tr key={item.planet} className={idx === 0 ? 'bg-[#141d2b] font-bold text-amber-300' : 'hover:bg-[#121721]'}>
                      <td className="py-2 px-3 text-slate-200">
                        #{idx + 1} {item.planet}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">+{item.essential_dignity}</td>
                      <td className="py-2 px-3 text-right text-slate-400">+{item.accidental_dignity}</td>
                      <td className="py-2 px-3 text-right font-bold text-cyan-300">{item.total_score}</td>
                      <td className="py-2 px-3">
                        {idx === 0 ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-950 text-amber-300 border border-amber-700">
                            ALMUTEN FIGURIS
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Candidate</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hermetic Arabic Parts (Lots) */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Hermetic Arabic Lots (Exact Mathematical Reflections)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-xs">
              {Object.entries(persian.hermetic_lots).map(([lotName, lot]: [string, any]) => (
                <div key={lotName} className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-cyan-300 font-semibold block truncate text-[11px]">{lotName}</span>
                  <div className="text-slate-300 mt-1">
                    {lot.sign} {lot.degree.toFixed(2)}° <span className="text-slate-500">(H{lot.house})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Firdaria 75-Year Planetary Chronocrator Timeline */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Firdaria Lifespan Timeline (75-Year Planetary Era Cycle)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-center text-xs font-mono">
              {persian.firdaria.timeline.map((f: any, idx: number) => (
                <div key={idx} className="p-2 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-[10px] text-slate-500 block">Ages {f.start_age}–{f.end_age}</span>
                  <span className="font-semibold text-amber-400 text-xs my-0.5 block">{f.planet}</span>
                  <span className="text-[9px] text-cyan-300 block">{f.duration_years} Years</span>
                  <span className="text-[9px] text-slate-500 block">{f.start_year}–{f.end_year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Ancient Egyptian (Decanic & Chronocrators) */}
      {activeTab === 'egyptian' && egyptian && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-cyan-400 font-mono font-semibold uppercase tracking-wider">
                Ancient Egyptian Temple Horoscopy • Dendera & Senenmut Decans
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Hour Ruler Chronocrator: <span className="text-cyan-300 font-bold">{egyptian.chronocrator_watch.hour_ruler_chronocrator}</span> ({egyptian.chronocrator_watch.period})
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {egyptian.sothic_civil_cycle.season}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-cyan-300 border border-cyan-800">
                Hour {egyptian.chronocrator_watch.temporal_hour_number} of 12
              </span>
            </div>
          </div>

          {/* Ra's Cosmic Barque 36-Decan Star Clock */}
          <EgyptianDecanStarClock egyptian={egyptian} />

          {/* 36 Decan Guardians */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Decanic Guardians of Ra's Cosmic Barque (10° Sky Segments)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              {Object.entries(egyptian.decan_guardians).map(([pointKey, decan]: [string, any]) => (
                <div key={pointKey} className="p-3 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    {pointKey.replace('_', ' ')}
                  </span>
                  <h5 className="font-semibold text-amber-300 text-sm mt-0.5">
                    {decan.decan_name}
                  </h5>
                  <div className="text-[11px] text-slate-300 mt-1 font-sans">
                    Deity: <strong className="text-slate-100">{decan.presiding_deity}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 italic font-sans">
                    {decan.hieroglyph_symbolism}
                  </div>
                  <div className="mt-2 text-[9px] text-cyan-400 font-mono">
                    {decan.sign} • Decan #{decan.decan_in_sign} (Overall #{decan.overall_decan_number})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sothic Calendar & Epagomenal Day */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Sothic Year Civil Alignment
            </span>
            <p className="text-xs text-slate-300 font-mono mt-1">
              {egyptian.sothic_civil_cycle.solar_barque_alignment}
            </p>
            {egyptian.sothic_civil_cycle.epagomenal_birth_deity && (
              <div className="mt-2 p-2 rounded bg-amber-950/40 border border-amber-800 text-xs text-amber-300 font-mono">
                ★ Born during the Five Epagomenal Days (*Heru Renpet*): {egyptian.sothic_civil_cycle.epagomenal_birth_deity}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Polynesian & Māori Maramataka */}
      {activeTab === 'maramataka' && maramataka && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase tracking-wider">
                Polynesian & Māori Maramataka • Oceanic Lunar Phase Archetype
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Lunar Night #{maramataka.lunar_night.number}: <span className="text-emerald-400 font-bold">{maramataka.lunar_night.name}</span>
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Vitality Index: <strong className="text-cyan-300">{maramataka.lunar_night.vitality_index}</strong> • Moon Illumination: {maramataka.lunar_night.illumination_percent}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-emerald-300 border border-emerald-800">
                Elongation: {maramataka.lunar_night.elongation_degrees}°
              </span>
            </div>
          </div>

          {/* Oceanic 30-Night Lunar Dial */}
          <MaramatakaLunarDial maramataka={maramataka} />

          {/* Behavioral & Vitality Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Biological & Behavioral Rhythm Profile
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {maramataka.lunar_night.behavioral_profile}
              </p>
            </div>

            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Oceanic Archetype & Action Guidance
              </span>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500">Elemental Mode:</span>{' '}
                  <span className="text-cyan-300">{maramataka.oceanic_archetype.elemental_mode}</span>
                </div>
                <div>
                  <span className="text-slate-500">Optimal Action:</span>{' '}
                  <span className="text-emerald-400 font-semibold">{maramataka.oceanic_archetype.optimal_action}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
