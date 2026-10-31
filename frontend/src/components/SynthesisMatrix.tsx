import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
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
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      case 'MODERATE':
        return 'bg-stone-900 text-stone-300 border-stone-700/80';
      case 'DIVERGENT':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/80';
      case 'WEAK':
        return 'bg-stone-900 text-stone-400 border-stone-800';
      default:
        return 'bg-stone-950 text-stone-500 border-stone-800';
    }
  };

  const getPolarityColor = (polarity: string) => {
    switch (polarity) {
      case 'Positive': return 'text-amber-300 font-semibold';
      case 'Challenging': return 'text-rose-400 font-semibold';
      case 'Mixed': return 'text-stone-300 font-semibold';
      default: return 'text-stone-400';
    }
  };

  return (
    <div className="machined-bezel p-4 sm:p-6 rounded-2xl shadow-xl relative space-y-5">
      <div className="reticle-corner-tl" />
      <div className="reticle-corner-tr" />
      <div className="reticle-corner-bl" />
      <div className="reticle-corner-br" />

      {/* Header & Divergence Metric */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-stone-800 gap-3">
        <div>
          <span className="text-xs text-amber-400 font-serif font-medium block">
            Step 3 · Tradition Comparison &amp; Agreement
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <h2 className="text-base font-serif font-semibold text-stone-100">
              Where Traditions Agree vs Differ
            </h2>
            <ExplainerTrigger id="three_cluster_consensus" label="How We Compare" variant="badge" />
          </div>
          <p className="text-xs text-stone-400 mt-0.5 hidden sm:block max-w-[65ch] text-pretty">
            Comparing Vedic (Indian), Western (Hellenistic), and Chinese (BaZi) traditions. Maya &amp; Tibetan traditions provide additional symbolic layers.
          </p>
        </div>

        {/* Divergence Metric Badge */}
        <div className="flex items-center gap-3 px-3 py-1.5 border-l border-stone-800/80">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs text-stone-300 font-medium block">
                Traditions Differ
              </span>
              <ExplainerTrigger id="honest_divergence_rate" size="xs" variant="icon" />
            </div>
            <span className="text-sm font-mono font-bold text-rose-400 tabular-nums">
              {metrics.divergence_rate_percent}%
            </span>
          </div>
          <div className="h-6 w-px bg-stone-800"></div>
          <div className="text-xs text-stone-400 space-y-0.5 font-sans">
            <div>High Agreement: <strong className="text-amber-300 font-mono">{metrics.strong_domains}</strong></div>
            <div>Moderate: <strong className="text-stone-300 font-mono">{metrics.moderate_domains}</strong></div>
            <div>Different: <strong className="text-rose-400 font-mono">{metrics.divergent_domains}</strong></div>
          </div>
        </div>
      </div>

      {/* Domain Consensus Radar Matrix */}
      <DomainConsensusRadar synthesis={synthesis} />

      {/* Stitch-Inspired Global Consensus & Signal Control Strip */}
      <div className="pt-3.5 pb-3 border-b border-stone-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex flex-col items-center justify-center font-mono border-r border-stone-800/80 pr-2">
              <span className="text-sm font-bold text-amber-300">{consensusPercent}%</span>
              <span className="text-[11px] text-stone-400 font-medium">Index</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-stone-300 font-medium block">
                  Overall Tradition Agreement
                </span>
                <ExplainerTrigger id="three_cluster_consensus" label="Comparison Method" variant="badge" />
              </div>
              <span className="text-xs text-stone-400 font-sans hidden sm:block">
                Overall consistency score across independent astrological traditions
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-stone-800 hidden sm:block"></div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <div>
              <span className="text-stone-400">Synchronized: </span>
              <strong className="text-amber-300 font-mono">{metrics.strong_domains + metrics.moderate_domains} / {totalDomainCount}</strong>
            </div>
            <div className="h-4 w-px bg-stone-800"></div>
            <div>
              <span className="text-stone-400">Divergent: </span>
              <strong className="text-rose-400 font-mono">{metrics.divergent_domains} / {totalDomainCount}</strong>
            </div>
          </div>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1 lg:pb-0" role="group" aria-label="Filter domains">
          <button
            type="button"
            aria-pressed={filterMode === 'all'}
            onClick={() => setFilterMode('all')}
            className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] text-xs font-mono rounded cursor-pointer transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              filterMode === 'all'
                ? 'bg-amber-950 text-amber-200 font-semibold border border-amber-700/80 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-transparent'
            }`}
          >
            All Domains ({totalDomainCount})
          </button>
          <button
            type="button"
            aria-pressed={filterMode === 'high'}
            onClick={() => setFilterMode('high')}
            className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] text-xs font-mono rounded cursor-pointer transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              filterMode === 'high'
                ? 'bg-amber-950/80 text-amber-300 font-semibold border border-amber-800'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-transparent'
            }`}
          >
            High Signal ({metrics.strong_domains})
          </button>
          <button
            type="button"
            aria-pressed={filterMode === 'divergent'}
            onClick={() => setFilterMode('divergent')}
            className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] text-xs font-mono rounded cursor-pointer transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              filterMode === 'divergent'
                ? 'bg-rose-950 text-rose-300 font-semibold border border-rose-800'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-transparent'
            }`}
          >
            Divergent ({metrics.divergent_domains})
          </button>
        </div>
      </div>

      {/* Life Domains Table */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-stone-300 block">
            Life Domains ({filteredDomains.length} Shown)
          </span>
          <button
            type="button"
            onClick={() => setExpandedDomain((prev) => (prev === 'ALL' ? null : 'ALL'))}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 cursor-pointer hover:underline py-2 px-2.5 min-h-[44px] inline-flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {expandedDomain === 'ALL' ? 'Collapse All Domains' : 'Expand All Domains'}
          </button>
        </div>

        <div className="divide-y divide-stone-800/80 border-y border-stone-800/80">
          {filteredDomains.map((dom) => {
            const isExpanded = expandedDomain === 'ALL' || expandedDomain === dom.domain_id;
            return (
              <div
                key={dom.domain_id}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`synthesis-domain-${dom.domain_id}`}
                className="py-3 px-1.5 sm:px-2 hover:bg-stone-900/30 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                onClick={() => setExpandedDomain(isExpanded ? null : dom.domain_id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedDomain(isExpanded ? null : dom.domain_id);
                  }
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs font-bold text-stone-300 w-7 shrink-0">
                      {dom.domain_id}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-stone-200">
                        {dom.domain_name}
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5 line-clamp-1 max-w-[60ch] text-pretty">
                        {dom.consensus_theme}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                    {/* Polarities summary */}
                    <div className="flex items-center gap-2 text-xs font-sans text-stone-400 px-1 py-0.5">
                      <span title="Jyotisha">J: <span className={`font-mono ${getPolarityColor(dom.evaluations.jyotisha.polarity)}`}>{dom.evaluations.jyotisha.polarity[0]}</span></span>
                      <span className="w-px h-2.5 bg-stone-700" aria-hidden="true" />
                      <span title="Western">W: <span className={`font-mono ${getPolarityColor(dom.evaluations.western.polarity)}`}>{dom.evaluations.western.polarity[0]}</span></span>
                      <span className="w-px h-2.5 bg-stone-700" aria-hidden="true" />
                      <span title="Sinic">S: <span className={`font-mono ${getPolarityColor(dom.evaluations.sinic.polarity)}`}>{dom.evaluations.sinic.polarity[0]}</span></span>
                    </div>

                    {/* Visual Agreement Mini Meter */}
                    <div className="w-12 sm:w-16 h-1.5 rounded-full bg-stone-800 overflow-hidden shrink-0 hidden xs:block" aria-hidden="true">
                      <div
                        className={`h-full rounded-full transition-colors duration-200 ${
                          dom.grade === 'STRONG'
                            ? 'w-full bg-amber-400'
                            : dom.grade === 'MODERATE'
                            ? 'w-2/3 bg-amber-300'
                            : 'w-1/3 bg-rose-400'
                        }`}
                      />
                    </div>

                    <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${getGradeBadge(dom.grade)}`}>
                      {dom.grade}
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-stone-400 motion-safe:transition-transform motion-reduce:transition-none duration-200 ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Cluster Breakdown with Fluid Height Disclosure */}
                <div
                  id={`synthesis-domain-${dom.domain_id}`}
                  className={`accordion-content ${isExpanded ? 'is-open' : ''}`}
                >
                  <div className="accordion-inner">
                    <div className="mt-3 pt-3 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-800/80 text-xs">
                      {/* Jyotisha */}
                      <div className="pt-2.5 md:pt-0 md:px-3 first:pl-0 last:pr-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-serif font-medium text-amber-400 text-xs">Jyotisha</span>
                          <span className={`text-xs font-sans ${getPolarityColor(dom.evaluations.jyotisha.polarity)}`}>
                            {dom.evaluations.jyotisha.polarity} ({dom.evaluations.jyotisha.prominence})
                          </span>
                        </div>
                        <p className="text-stone-300 font-sans text-xs leading-relaxed max-w-[60ch] text-pretty">
                          {dom.evaluations.jyotisha.basis}
                        </p>
                      </div>

                      {/* Western */}
                      <div className="pt-2.5 md:pt-0 md:px-3 first:pl-0 last:pr-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-serif font-medium text-stone-300 text-xs">Western</span>
                          <span className={`text-xs font-sans ${getPolarityColor(dom.evaluations.western.polarity)}`}>
                            {dom.evaluations.western.polarity} ({dom.evaluations.western.prominence})
                          </span>
                        </div>
                        <p className="text-stone-300 font-sans text-xs leading-relaxed max-w-[60ch] text-pretty">
                          {dom.evaluations.western.basis}
                        </p>
                      </div>

                      {/* Sinic */}
                      <div className="pt-2.5 md:pt-0 md:px-3 first:pl-0 last:pr-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-serif font-medium text-amber-300 text-xs">Sinic (BaZi + Zi Wei)</span>
                          <span className={`text-xs font-sans ${getPolarityColor(dom.evaluations.sinic.polarity)}`}>
                            {dom.evaluations.sinic.polarity} ({dom.evaluations.sinic.prominence})
                          </span>
                        </div>
                        <p className="text-stone-300 font-sans text-xs leading-relaxed max-w-[60ch] text-pretty">
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
      <div className="pt-3 border-t border-stone-800">
        <h3 className="text-xs font-medium text-stone-300 block mb-2.5">
          Temperament Axes (Computed Base + Attributed Overlays)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {synthesis.temperament_axes.map((ax) => (
            <div key={ax.axis_id} className="pt-2.5 pb-3 border-t border-stone-800/80">
              <span className="text-xs font-sans font-semibold text-stone-200 block">
                <span className="font-mono text-amber-400">{ax.axis_id}</span> • {ax.name}
              </span>
              <p className="text-xs text-amber-300 font-medium mt-1">
                {ax.expression}
              </p>
              <div className="mt-2 text-xs space-y-0.5 text-stone-400 pt-1.5 border-t border-stone-800/60 font-sans">
                <div><span className="text-stone-500">Base:</span> <span className="font-mono text-stone-300">{ax.computed_base}</span></div>
                <div><span className="text-amber-400">Overlay:</span> <span className="font-mono text-amber-300">{ax.symbolic_overlay}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chronological Overlap */}
      <div className="pt-3 border-t border-stone-800">
        <h3 className="text-xs font-medium text-stone-300 block mb-2.5">
          Unified Chronology Alignment (Active Timing Cycles)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Vimshottari Dasha */}
          <div className="pt-2.5 pb-2 border-t border-stone-800/80">
            <span className="text-xs text-amber-400 font-medium block">Vimshottari Dasha</span>
            <p className="font-semibold text-stone-200 mt-0.5">
              {synthesis.chronology.jyotisha_vimshottari.active_mahadasha}
              {synthesis.chronology.jyotisha_vimshottari.active_antardasha && (
                <span className="text-amber-300/80 font-normal"> / {synthesis.chronology.jyotisha_vimshottari.active_antardasha}</span>
              )}
            </p>
            <span className="text-xs text-stone-400 font-sans block mt-0.5">
              {synthesis.chronology.jyotisha_vimshottari.span}
            </span>
            <span className="text-xs text-stone-400 font-sans block mt-1">
              Focus: {synthesis.chronology.jyotisha_vimshottari.activated_domain}
            </span>
          </div>

          {/* BaZi Da Yun */}
          <div className="pt-2.5 pb-2 border-t border-stone-800/80">
            <span className="text-xs text-amber-300 font-medium block">BaZi Da Yun</span>
            <p className="font-semibold text-stone-200 mt-0.5 font-serif">
              {synthesis.chronology.bazi_da_yun.active_pillar}
            </p>
            <span className="text-xs text-stone-400 font-sans block mt-0.5">
              {synthesis.chronology.bazi_da_yun.ten_god} (From age <span className="font-mono">{synthesis.chronology.bazi_da_yun.start_age}</span>)
            </span>
            {synthesis.chronology.bazi_da_yun.current_liu_nian && (
              <span className="text-xs text-stone-300 font-sans block mt-1">
                Annual: <span className="font-mono">{synthesis.chronology.bazi_da_yun.current_liu_nian.year}</span> {synthesis.chronology.bazi_da_yun.current_liu_nian.pillar} ({synthesis.chronology.bazi_da_yun.current_liu_nian.ten_god})
              </span>
            )}
          </div>

          {/* Annual Profection */}
          <div className="pt-2.5 pb-2 border-t border-stone-800/80">
            <span className="text-xs text-stone-300 font-medium block">Annual Profection</span>
            <p className="font-semibold text-stone-200 mt-0.5">
              House <span className="font-mono">{synthesis.chronology.western_profection.activated_house}</span>
            </p>
            <span className="text-xs text-stone-400 font-sans block mt-0.5">
              Lord of Year: {synthesis.chronology.western_profection.lord_of_year}
            </span>
            {synthesis.chronology.western_profection.active_transits_summary && synthesis.chronology.western_profection.active_transits_summary.length > 0 && (
              <span className="text-xs text-stone-300 font-sans block mt-1 truncate" title={synthesis.chronology.western_profection.active_transits_summary[0]}>
                Transit: {synthesis.chronology.western_profection.active_transits_summary[0]}
              </span>
            )}
          </div>

          {/* Zi Wei & Firdaria */}
          <div className="pt-2.5 pb-2 border-t border-stone-800/80">
            <span className="text-xs text-amber-400 font-medium block">
              {synthesis.chronology.persian_firdaria ? "Zi Wei & Firdaria" : "Zi Wei Decadal"}
            </span>
            <p className="font-semibold text-stone-200 mt-0.5">
              {synthesis.chronology.ziwei_da_xian.active_palace}
            </p>
            <span className="text-xs text-stone-400 font-sans block mt-0.5">
              Age: <span className="font-mono">{synthesis.chronology.ziwei_da_xian.age_span}</span>
            </span>
            {synthesis.chronology.persian_firdaria && (
              <span className="text-xs text-amber-300/80 font-sans block mt-1">
                Firdaria: {synthesis.chronology.persian_firdaria.active_ruler} (<span className="font-mono">{synthesis.chronology.persian_firdaria.years_span}</span>)
              </span>
            )}
          </div>
        </div>

        {/* Convergence status banner */}
        <div className="mt-3 pt-2 pb-1 border-t border-stone-800 text-xs font-sans text-amber-300 max-w-[55ch] text-pretty">
          {synthesis.chronology.convergence_status}
        </div>
      </div>

      {/* Mobile & Tablet Journey Navigation Bar */}
      {onNavigate && (
        <div className="mt-6 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('traditions')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-stone-300 border border-stone-800 cursor-pointer transition-colors active:scale-[0.98] whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="whitespace-nowrap">Step 2 · 9 Traditions<span className="sr-only"> View Traditions</span></span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dossier')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-serif font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 cursor-pointer transition-colors duration-150 border border-amber-300 shadow-xs active:scale-[0.98] whitespace-nowrap"
          >
            <span className="whitespace-nowrap">Step 4 · Complete Birth Reading<span className="sr-only"> Read Full Corroboration Dossier</span></span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
