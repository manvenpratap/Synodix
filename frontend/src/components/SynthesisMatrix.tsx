import React, { useState } from 'react';
import type { Synthesis } from '../types';

interface Props {
  synthesis: Synthesis;
}

export const SynthesisMatrix: React.FC<Props> = ({ synthesis }) => {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const metrics = synthesis.divergence_metrics;
  const domains = Object.values(synthesis.domain_results);

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'STRONG':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/80';
      case 'MODERATE':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800/80';
      case 'DIVERGENT':
        return 'bg-rose-950 text-rose-300 border-rose-800/80';
      case 'WEAK':
        return 'bg-[#121721] text-slate-400 border-[#1b2331]';
      default:
        return 'bg-[#080a0f] text-slate-500 border-[#1b2331]';
    }
  };

  const getPolarityColor = (polarity: string) => {
    switch (polarity) {
      case 'Positive': return 'text-emerald-400 font-semibold';
      case 'Challenging': return 'text-rose-400 font-semibold';
      case 'Mixed': return 'text-amber-400 font-semibold';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-5 space-y-5">
      {/* Header & Divergence Metric */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-[#1b2331] gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold block">
            05 / Cross-Cultural Synthesis Without Double-Counting
          </span>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">
            Cross-Cultural Convergence & Divergence Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            3 primary votes: Jyotisha (1), Western (1), Sinic (1). Maya & Tibetan contribute as non-voting symbolic overlays.
          </p>
        </div>

        {/* Divergence Metric Badge */}
        <div className="flex items-center gap-3 bg-[#080a0f] px-3 py-2 rounded-md border border-[#1b2331]">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
              Divergence Rate
            </span>
            <span className="text-sm font-mono font-bold text-rose-400 tabular-nums">
              {metrics.divergence_rate_percent}%
            </span>
          </div>
          <div className="h-6 w-px bg-[#1b2331]"></div>
          <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
            <div>Strong: <strong className="text-emerald-400">{metrics.strong_domains}</strong></div>
            <div>Moderate: <strong className="text-cyan-400">{metrics.moderate_domains}</strong></div>
            <div>Divergent: <strong className="text-rose-400">{metrics.divergent_domains}</strong></div>
          </div>
        </div>
      </div>

      {/* 9 Domains Table */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
          Nine Life Domains (D1 – D9)
        </span>

        <div className="grid grid-cols-1 gap-2">
          {domains.map((dom) => {
            const isExpanded = expandedDomain === dom.domain_id;
            return (
              <div
                key={dom.domain_id}
                className="bg-[#080a0f] border border-[#1b2331] rounded-md p-3 hover:border-slate-700 transition-colors cursor-pointer"
                onClick={() => setExpandedDomain(isExpanded ? null : dom.domain_id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-400 w-7">
                      {dom.domain_id}
                    </span>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-200">
                        {dom.domain_name}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {dom.consensus_theme}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    {/* Polarities summary */}
                    <div className="flex items-center gap-1.5 text-xs font-mono bg-[#121721] px-2 py-0.5 rounded border border-[#1b2331]">
                      <span title="Jyotisha">J: <span className={getPolarityColor(dom.evaluations.jyotisha.polarity)}>{dom.evaluations.jyotisha.polarity[0]}</span></span>
                      <span className="text-slate-600">•</span>
                      <span title="Western">W: <span className={getPolarityColor(dom.evaluations.western.polarity)}>{dom.evaluations.western.polarity[0]}</span></span>
                      <span className="text-slate-600">•</span>
                      <span title="Sinic">S: <span className={getPolarityColor(dom.evaluations.sinic.polarity)}>{dom.evaluations.sinic.polarity[0]}</span></span>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border uppercase tracking-wider ${getGradeBadge(dom.grade)}`}>
                      {dom.grade}
                    </span>

                    <span className="text-slate-500 font-mono text-[10px]">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded Cluster Breakdown */}
                {isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-[#1b2331] grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    {/* Jyotisha */}
                    <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-amber-400 font-mono text-[11px]">Jyotisha</span>
                        <span className={`text-[10px] font-mono ${getPolarityColor(dom.evaluations.jyotisha.polarity)}`}>
                          {dom.evaluations.jyotisha.polarity} ({dom.evaluations.jyotisha.prominence})
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono text-[10px] leading-relaxed">
                        {dom.evaluations.jyotisha.basis}
                      </p>
                    </div>

                    {/* Western */}
                    <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-blue-400 font-mono text-[11px]">Western</span>
                        <span className={`text-[10px] font-mono ${getPolarityColor(dom.evaluations.western.polarity)}`}>
                          {dom.evaluations.western.polarity} ({dom.evaluations.western.prominence})
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono text-[10px] leading-relaxed">
                        {dom.evaluations.western.basis}
                      </p>
                    </div>

                    {/* Sinic */}
                    <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-emerald-400 font-mono text-[11px]">Sinic (BaZi + Zi Wei)</span>
                        <span className={`text-[10px] font-mono ${getPolarityColor(dom.evaluations.sinic.polarity)}`}>
                          {dom.evaluations.sinic.polarity} ({dom.evaluations.sinic.prominence})
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono text-[10px] leading-relaxed">
                        {dom.evaluations.sinic.basis}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Temperament Axes */}
      <div className="pt-3 border-t border-[#1b2331]">
        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Six Temperament Axes (Computed Base + Attributed Overlays)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {synthesis.temperament_axes.map((ax) => (
            <div key={ax.axis_id} className="p-3 rounded-md bg-[#080a0f] border border-[#1b2331]">
              <span className="text-[11px] font-mono font-semibold text-slate-200 block">
                {ax.axis_id} • {ax.name}
              </span>
              <p className="text-xs text-cyan-300 font-medium mt-1">
                {ax.expression}
              </p>
              <div className="mt-2 text-[10px] space-y-0.5 text-slate-400 pt-1.5 border-t border-[#1b2331] font-mono">
                <div><span className="text-slate-500">Base:</span> {ax.computed_base}</div>
                <div><span className="text-purple-400">Overlay:</span> {ax.symbolic_overlay}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chronological Overlap */}
      <div className="pt-3 border-t border-[#1b2331]">
        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Unified Chronology Alignment (Active Timing Cycles)
        </span>

        <div className="p-3.5 rounded-md bg-[#080a0f] border border-[#1b2331]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block">Vimshottari Dasha</span>
              <p className="font-semibold text-slate-200 mt-0.5">
                Lord: {synthesis.chronology.jyotisha_vimshottari.active_mahadasha}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                {synthesis.chronology.jyotisha_vimshottari.span}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">BaZi Da Yun</span>
              <p className="font-semibold text-slate-200 mt-0.5 font-serif">
                {synthesis.chronology.bazi_da_yun.active_pillar}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                {synthesis.chronology.bazi_da_yun.ten_god} (From age {synthesis.chronology.bazi_da_yun.start_age})
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-semibold block">Annual Profection</span>
              <p className="font-semibold text-slate-200 mt-0.5">
                House: {synthesis.chronology.western_profection.activated_house}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                Lord of Year: {synthesis.chronology.western_profection.lord_of_year}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-semibold block">Zi Wei Decadal</span>
              <p className="font-semibold text-slate-200 mt-0.5">
                {synthesis.chronology.ziwei_da_xian.active_palace}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                Age: {synthesis.chronology.ziwei_da_xian.age_span}
              </span>
            </div>
          </div>

          <div className="mt-2.5 p-2 rounded bg-[#121721] border border-[#1b2331] text-xs font-mono text-cyan-300">
            {synthesis.chronology.convergence_status}
          </div>
        </div>
      </div>
    </div>
  );
};
