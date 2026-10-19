import React, { useState } from 'react';
import { Synthesis } from '../types';
import { GitCompare, Layers, Compass, Clock, CheckCircle2, AlertOctagon, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'MODERATE':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'DIVERGENT':
        return 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse';
      case 'WEAK':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-900 text-slate-500 border-slate-800';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header & Divergence Metric */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <span className="px-2 py-0.5 text-xs font-semibold tracking-wider text-purple-400 bg-purple-950/70 border border-purple-800 rounded-full uppercase">
            Step 7 • Synthesis Without Double-Counting
          </span>
          <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            Cross-Cultural Convergence & Divergence Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            3 primary votes: Jyotisha (1), Western (1), Sinic (1). Maya & Tibetan contribute as non-voting symbolic overlays.
          </p>
        </div>

        {/* Divergence Metric Badge */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
              Divergence Rate
            </span>
            <span className="text-base font-mono font-bold text-rose-400">
              {metrics.divergence_rate_percent}%
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="text-xs text-slate-400 space-y-0.5 font-mono">
            <div>Strong: <strong className="text-emerald-400">{metrics.strong_domains}</strong></div>
            <div>Moderate: <strong className="text-cyan-400">{metrics.moderate_domains}</strong></div>
            <div>Divergent: <strong className="text-rose-400">{metrics.divergent_domains}</strong></div>
          </div>
        </div>
      </div>

      {/* 9 Domains Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <GitCompare className="w-3.5 h-3.5 text-purple-400" /> Nine Life Domains (D1 – D9)
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {domains.map((dom) => {
            const isExpanded = expandedDomain === dom.domain_id;
            return (
              <div
                key={dom.domain_id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-all cursor-pointer"
                onClick={() => setExpandedDomain(isExpanded ? null : dom.domain_id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 w-8">
                      {dom.domain_id}
                    </span>
                    <div>
                      <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                        {dom.domain_name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {dom.consensus_theme}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Polarities summary */}
                    <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span title="Jyotisha polarity">J: <span className={getPolarityColor(dom.evaluations.jyotisha.polarity)}>{dom.evaluations.jyotisha.polarity[0]}</span></span>
                      <span className="text-slate-600">•</span>
                      <span title="Western polarity">W: <span className={getPolarityColor(dom.evaluations.western.polarity)}>{dom.evaluations.western.polarity[0]}</span></span>
                      <span className="text-slate-600">•</span>
                      <span title="Sinic polarity">S: <span className={getPolarityColor(dom.evaluations.sinic.polarity)}>{dom.evaluations.sinic.polarity[0]}</span></span>
                    </div>

                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${getGradeBadge(dom.grade)}`}>
                      {dom.grade}
                    </span>

                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Cluster Breakdown */}
                {isExpanded && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Jyotisha */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-amber-400">Jyotisha</span>
                        <span className={getPolarityColor(dom.evaluations.jyotisha.polarity)}>
                          {dom.evaluations.jyotisha.polarity} ({dom.evaluations.jyotisha.prominence} Prominence)
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px]">
                        {dom.evaluations.jyotisha.basis}
                      </p>
                    </div>

                    {/* Western */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-blue-400">Western / Hellenistic</span>
                        <span className={getPolarityColor(dom.evaluations.western.polarity)}>
                          {dom.evaluations.western.polarity} ({dom.evaluations.western.prominence} Prominence)
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px]">
                        {dom.evaluations.western.basis}
                      </p>
                    </div>

                    {/* Sinic */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-emerald-400">Sinic (BaZi + Zi Wei)</span>
                        <span className={getPolarityColor(dom.evaluations.sinic.polarity)}>
                          {dom.evaluations.sinic.polarity} ({dom.evaluations.sinic.prominence} Prominence)
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px]">
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

      {/* 6 Temperament Axes with Maya & Tibetan Overlays */}
      <div className="pt-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Compass className="w-3.5 h-3.5 text-cyan-400" /> Six Temperament Axes (Computed Base + Attributed Overlays)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {synthesis.temperament_axes.map((ax) => (
            <div key={ax.axis_id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-white">
                  {ax.axis_id} • {ax.name}
                </h5>
              </div>
              <p className="text-xs text-cyan-300 font-medium mt-1">
                {ax.expression}
              </p>
              <div className="mt-2 text-[10px] space-y-1 text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                <div><span className="text-slate-500">Base:</span> {ax.computed_base}</div>
                <div><span className="text-purple-400">Symbolic:</span> {ax.symbolic_overlay}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chronological Overlap */}
      <div className="pt-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Clock className="w-3.5 h-3.5 text-amber-400" /> Unified Chronology Alignment (Active Timing Cycles)
        </h4>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase text-amber-400 font-bold block">Vimshottari Dasha</span>
              <p className="font-semibold text-white mt-0.5">
                Lord: {synthesis.chronology.jyotisha_vimshottari.active_mahadasha}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                {synthesis.chronology.jyotisha_vimshottari.span}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase text-emerald-400 font-bold block">BaZi Da Yun</span>
              <p className="font-semibold text-white mt-0.5">
                Pillar: {synthesis.chronology.bazi_da_yun.active_pillar}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                {synthesis.chronology.bazi_da_yun.ten_god} (From age {synthesis.chronology.bazi_da_yun.start_age})
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase text-blue-400 font-bold block">Annual Profection</span>
              <p className="font-semibold text-white mt-0.5">
                House: {synthesis.chronology.western_profection.activated_house}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                Lord of Year: {synthesis.chronology.western_profection.lord_of_year}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase text-purple-400 font-bold block">Zi Wei Decadal</span>
              <p className="font-semibold text-white mt-0.5">
                Palace: {synthesis.chronology.ziwei_da_xian.active_palace}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                Age: {synthesis.chronology.ziwei_da_xian.age_span}
              </span>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/50 text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{synthesis.chronology.convergence_status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
