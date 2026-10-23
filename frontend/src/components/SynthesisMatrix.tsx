import React, { useState } from 'react';
import type { Synthesis } from '../types';
import { DomainConsensusRadar } from './ChartWheelVisualizer';
import { ExplainerTrigger } from './ExplainerTrigger';

interface Props {
  synthesis: Synthesis;
  onNavigate?: (screen: 'workbench' | 'traditions' | 'synthesis' | 'dossier' | 'verification' | 'evidence') => void;
}

export const SynthesisMatrix: React.FC<Props> = ({ synthesis, onNavigate }) => {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'high' | 'divergent'>('all');
  const metrics = synthesis.divergence_metrics;
  const allDomains = Object.values(synthesis.domain_results);
  const totalDomainCount = allDomains.length;
  const consensusPercent = (100 - metrics.divergence_rate_percent).toFixed(1);

  const filteredDomains = allDomains.filter((d) => {
    if (filterMode === 'high') return d.grade === 'STRONG';
    if (filterMode === 'divergent') return d.grade === 'DIVERGENT';
    return true;
  });

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
    <div className="machined-bezel p-1 sm:p-1.5 rounded-2xl shadow-xl relative">
      <div className="machined-core border border-white/[0.06] rounded-[calc(1rem-1px)] p-4 sm:p-6 space-y-5 relative">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        {/* Header & Divergence Metric */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-[#1b2331] gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold block">
            05 / Cross-Cultural Synthesis Without Double-Counting
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <h3 className="text-base font-semibold text-slate-100">
              Cross-Cultural Convergence & Divergence Matrix
            </h3>
            <ExplainerTrigger id="three_cluster_consensus" label="Consensus Protocol" variant="badge" />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            3 primary votes: Jyotisha (1), Western (1), Sinic (1). Maya & Tibetan contribute as non-voting symbolic overlays.
          </p>
        </div>

        {/* Divergence Metric Badge */}
        <div className="flex items-center gap-3 bg-[#080a0f] px-3 py-2 rounded-md border border-[#1b2331]">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                Divergence Rate
              </span>
              <ExplainerTrigger id="honest_divergence_rate" size="xs" variant="icon" />
            </div>
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

      {/* Domain Consensus Radar Matrix */}
      <DomainConsensusRadar synthesis={synthesis} />

      {/* Stitch-Inspired Global Consensus & Signal Control Strip */}
      <div className="bg-[#080a0f] p-3.5 rounded-lg border border-[#1b2331] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#0d121c] border border-[#1e2738] flex flex-col items-center justify-center font-mono">
              <span className="text-sm font-bold text-cyan-300">{consensusPercent}%</span>
              <span className="text-[8px] text-slate-500 uppercase">INDEX</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                  GLOBAL TRIANGULATION CONSENSUS
                </span>
                <ExplainerTrigger id="three_cluster_consensus" label="Triangulation Math" variant="badge" />
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Composite Multi-Tradition Concordance (σ = 0.04)
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-[#1b2331] hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded bg-[#0d121c] border border-[#1b2331] text-[11px] font-mono">
              <span className="text-slate-400">Synchronized: </span>
              <strong className="text-emerald-400">{metrics.strong_domains + metrics.moderate_domains} / {totalDomainCount}</strong>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#0d121c] border border-[#1b2331] text-[11px] font-mono">
              <span className="text-slate-400">Divergent: </span>
              <strong className="text-rose-400">{metrics.divergent_domains} / {totalDomainCount}</strong>
            </div>
          </div>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin scroll-smooth overscroll-x-contain" role="group" aria-label="Filter domains">
          <button
            type="button"
            aria-pressed={filterMode === 'all'}
            onClick={() => setFilterMode('all')}
            className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] text-xs font-mono rounded cursor-pointer transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              filterMode === 'all'
                ? 'bg-[#182232] text-cyan-300 font-semibold border border-cyan-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121721] border border-transparent'
            }`}
          >
            All Domains ({totalDomainCount})
          </button>
          <button
            type="button"
            aria-pressed={filterMode === 'high'}
            onClick={() => setFilterMode('high')}
            className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] text-xs font-mono rounded cursor-pointer transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              filterMode === 'high'
                ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121721] border border-transparent'
            }`}
          >
            High Signal ({metrics.strong_domains})
          </button>
          <button
            type="button"
            aria-pressed={filterMode === 'divergent'}
            onClick={() => setFilterMode('divergent')}
            className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] text-xs font-mono rounded cursor-pointer transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              filterMode === 'divergent'
                ? 'bg-rose-950 text-rose-300 font-semibold border border-rose-800'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121721] border border-transparent'
            }`}
          >
            Divergent ({metrics.divergent_domains})
          </button>
        </div>
      </div>

      {/* Life Domains Table */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
            Life Domains ({filteredDomains.length} Shown)
          </span>
          <button
            type="button"
            onClick={() => setExpandedDomain((prev) => (prev === 'ALL' ? null : 'ALL'))}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer hover:underline py-2 px-2.5 min-h-[44px] inline-flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {expandedDomain === 'ALL' ? 'Collapse All Domains' : 'Expand All Domains'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {filteredDomains.map((dom) => {
            const isExpanded = expandedDomain === 'ALL' || expandedDomain === dom.domain_id;
            return (
              <div
                key={dom.domain_id}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`synthesis-domain-${dom.domain_id}`}
                className="bg-[#080a0f] border border-[#1b2331] rounded-md p-3 hover:border-slate-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a0f]"
                onClick={() => setExpandedDomain(isExpanded ? null : dom.domain_id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedDomain(isExpanded ? null : dom.domain_id);
                  }
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-300 w-7">
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
                      <span className="text-slate-400">•</span>
                      <span title="Western">W: <span className={getPolarityColor(dom.evaluations.western.polarity)}>{dom.evaluations.western.polarity[0]}</span></span>
                      <span className="text-slate-400">•</span>
                      <span title="Sinic">S: <span className={getPolarityColor(dom.evaluations.sinic.polarity)}>{dom.evaluations.sinic.polarity[0]}</span></span>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border uppercase tracking-wider ${getGradeBadge(dom.grade)}`}>
                      {dom.grade}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`text-slate-500 font-mono text-[10px] inline-block transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expanded Cluster Breakdown with Fluid Height Disclosure */}
                <div
                  id={`synthesis-domain-${dom.domain_id}`}
                  className={`accordion-content ${isExpanded ? 'is-open' : ''}`}
                >
                  <div className="accordion-inner">
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Temperament Axes */}
      <div className="pt-3 border-t border-[#1b2331]">
        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Temperament Axes (Computed Base + Attributed Overlays)
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
                {synthesis.chronology.jyotisha_vimshottari.active_mahadasha}
                {synthesis.chronology.jyotisha_vimshottari.active_antardasha && (
                  <span className="text-amber-300/80 font-normal"> / {synthesis.chronology.jyotisha_vimshottari.active_antardasha}</span>
                )}
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                {synthesis.chronology.jyotisha_vimshottari.span}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-1">
                Focus: {synthesis.chronology.jyotisha_vimshottari.activated_domain}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">BaZi Da Yun</span>
              <p className="font-semibold text-slate-200 mt-0.5 font-serif">
                {synthesis.chronology.bazi_da_yun.active_pillar}
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                {synthesis.chronology.bazi_da_yun.ten_god} (From age {synthesis.chronology.bazi_da_yun.start_age})
              </span>
              {synthesis.chronology.bazi_da_yun.current_liu_nian && (
                <span className="text-[10px] text-emerald-400/80 font-mono block mt-1">
                  Annual: {synthesis.chronology.bazi_da_yun.current_liu_nian.year} {synthesis.chronology.bazi_da_yun.current_liu_nian.pillar} ({synthesis.chronology.bazi_da_yun.current_liu_nian.ten_god})
                </span>
              )}
            </div>

            <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-semibold block">Annual Profection</span>
              <p className="font-semibold text-slate-200 mt-0.5">
                House {synthesis.chronology.western_profection.activated_house}
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                Lord of Year: {synthesis.chronology.western_profection.lord_of_year}
              </span>
              {synthesis.chronology.western_profection.active_transits_summary && synthesis.chronology.western_profection.active_transits_summary.length > 0 && (
                <span className="text-[10px] text-blue-300/80 font-mono block mt-1 truncate" title={synthesis.chronology.western_profection.active_transits_summary[0]}>
                  Transit: {synthesis.chronology.western_profection.active_transits_summary[0]}
                </span>
              )}
            </div>

            <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-semibold block">
                {synthesis.chronology.persian_firdaria ? "Zi Wei & Firdaria" : "Zi Wei Decadal"}
              </span>
              <p className="font-semibold text-slate-200 mt-0.5">
                {synthesis.chronology.ziwei_da_xian.active_palace}
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                Age: {synthesis.chronology.ziwei_da_xian.age_span}
              </span>
              {synthesis.chronology.persian_firdaria && (
                <span className="text-[10px] text-purple-300/80 font-mono block mt-1">
                  Firdaria: {synthesis.chronology.persian_firdaria.active_ruler} ({synthesis.chronology.persian_firdaria.years_span})
                </span>
              )}
            </div>
          </div>

          <div className="mt-2.5 p-2 rounded bg-[#121721] border border-[#1b2331] text-xs font-mono text-cyan-300">
            {synthesis.chronology.convergence_status}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Epistemological Journey Navigation Bar */}
      {onNavigate && (
        <div className="mt-6 pt-4 border-t border-[#1b2331] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('traditions')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-mono rounded-lg bg-[#101520] hover:bg-[#161d2c] text-slate-300 border border-[#1b2331] cursor-pointer transition-colors active:scale-[0.98]"
          >
            <span>← View Traditions</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dossier')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-mono rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-semibold cursor-pointer transition-all border border-cyan-500/80 shadow-xs active:scale-[0.98]"
          >
            <span>Read Full Corroboration Dossier →</span>
          </button>
        </div>
      )}
      </div>
    </div>
  );
};
