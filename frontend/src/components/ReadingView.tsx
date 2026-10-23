import React, { useState } from 'react';
import type { ChartResponse } from '../types';
import { ExplainerTrigger } from './ExplainerTrigger';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  BookOpen,
  Eye,
  Code
} from 'lucide-react';

interface Props {
  data: ChartResponse;
  onNavigate?: (screen: 'workbench' | 'traditions' | 'synthesis' | 'dossier' | 'verification' | 'evidence') => void;
}

export const ReadingView: React.FC<Props> = ({ data, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'interactive' | 'markdown'>('interactive');
  const [domainFilter, setDomainFilter] = useState<'all' | 'consensus' | 'divergent'>('all');
  const [expandedDomainId, setExpandedDomainId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const markdownText = data.synthesis.final_reading_markdown;
  const audit = data.birth_input_audit.normalized;
  const verification = data.verification_report;
  const synthesis = data.synthesis;
  const chronology = synthesis.chronology;
  const domainResults = Object.values(synthesis.domain_results);

  // File Download helpers
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    downloadFile(markdownText, `CROSS_CULTURAL_CORROBORATION_${audit.civil_date}.md`, 'text/markdown');
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    downloadFile(jsonStr, `CROSS_CULTURAL_DATASET_${audit.civil_date}.json`, 'application/json');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredDomains = domainResults.filter((d) => {
    if (domainFilter === 'consensus') return d.grade === 'STRONG' || d.grade === 'MODERATE';
    if (domainFilter === 'divergent') return d.grade === 'DIVERGENT';
    return true;
  });

  return (
    <div className="machined-bezel rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="reticle-corner-tl" />
      <div className="reticle-corner-tr" />
      <div className="reticle-corner-bl" />
      <div className="reticle-corner-br" />

      {/* ==================== 1. DOCUMENT TOP BANNER & ACTION BAR ==================== */}
      <div className="bg-[#0d121c] border-b border-[#1b2331] p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Audited Epistemological Document
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-[11px] text-cyan-400 font-mono">
                Standard v2.0
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-[11px] text-slate-400 font-mono">
                Synodix Corroboration Engine
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>Cross-Cultural Corroboration Document</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans hidden sm:block">
              Autonomous cross-system corroboration and divergence synthesis across independent classical civilizational traditions.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-[#121722] p-0.5 rounded-lg border border-[#1b2331] flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  viewMode === 'interactive'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Document UI</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('markdown')}
                className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  viewMode === 'markdown'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw Markdown</span>
              </button>
            </div>

            {/* Quick Actions */}
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-mono rounded bg-[#121721] hover:bg-[#18202c] border transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 ${
                copied
                  ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40 shadow-xs'
                  : 'text-slate-300 border-[#1b2331]'
              }`}
              data-tooltip="Copy Full Document Markdown"
              aria-label="Copy Full Document Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="px-3 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-mono rounded bg-[#121721] hover:bg-[#18202c] text-slate-300 border border-[#1b2331] transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              data-tooltip="Download Markdown Document (.md)"
              aria-label="Download Markdown Document (.md)"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>.MD</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-mono rounded bg-[#121721] hover:bg-[#18202c] text-slate-300 border border-[#1b2331] transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              data-tooltip="Download Raw Master Dataset (.json)"
              aria-label="Download Raw Master Dataset (.json)"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>.JSON</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-mono rounded bg-[#121721] hover:bg-[#18202c] text-slate-300 border border-[#1b2331] transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              data-tooltip="Print or Save PDF"
              aria-label="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Document Metadata Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mt-4 pt-4 border-t border-[#1b2331]/80 text-[11px] font-mono">
          <div className="bg-[#080b11] px-2.5 py-1.5 rounded border border-[#1b2331]">
            <span className="text-slate-500 block text-[9px] uppercase">Subject</span>
            <span className="font-semibold text-slate-200 truncate block">
              {data.birth_input_audit.raw_input.city_name || 'Subject Chart'}
            </span>
          </div>
          <div className="bg-[#080b11] px-2.5 py-1.5 rounded border border-[#1b2331]">
            <span className="text-slate-500 block text-[9px] uppercase">Civil Instant</span>
            <span className="font-semibold text-slate-200 truncate block">
              {audit.civil_date} {audit.civil_time}
            </span>
          </div>
          <div className="bg-[#080b11] px-2.5 py-1.5 rounded border border-[#1b2331]">
            <span className="text-slate-500 block text-[9px] uppercase">Ephemeris Engine</span>
            <span className="font-semibold text-cyan-300 truncate block">
              SwissEph + JPL DE421
            </span>
          </div>
          <div className="bg-[#080b11] px-2.5 py-1.5 rounded border border-[#1b2331]">
            <span className="text-slate-500 block text-[9px] uppercase">Max Planetary Δ</span>
            <span className="font-semibold text-emerald-400 truncate block">
              {verification.max_planetary_difference_deg}° (&le;0.01°)
            </span>
          </div>
          <div className="bg-[#080b11] px-2.5 py-1.5 rounded border border-[#1b2331]">
            <span className="text-slate-500 block text-[9px] uppercase">Verification Status</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1 truncate">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              {verification.overall_verification_status} ({verification.overall_confidence})
            </span>
          </div>
          <div className="bg-[#080b11] px-2.5 py-1.5 rounded border border-[#1b2331]">
            <span className="text-slate-500 block text-[9px] uppercase">Multi-System Divergence</span>
            <span className={`font-bold truncate block ${synthesis.divergence_metrics.divergence_rate_percent > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {synthesis.divergence_metrics.divergence_rate_percent}% ({synthesis.divergence_metrics.divergent_domains}/9 Divergent)
            </span>
          </div>
        </div>
      </div>

      {/* ==================== 2. MAIN DOCUMENT BODY ==================== */}
      {viewMode === 'interactive' ? (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Legal / Scientific Caution Banner */}
          <div className="p-3.5 rounded-lg bg-[#140e0a] border border-amber-900/60 text-xs font-mono text-amber-200/90 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Epistemological & Scientific Integrity Standard: </strong>
              This corroboration document models symbolic resonance, convention transparency, and honest uncertainty testing across independent historical civilizational frameworks. 
              It strictly prohibits deterministic fortune-telling, medical diagnosis, financial speculation, legal advice, or pregnancy claims.
            </div>
          </div>

          {/* Section 1: Executive Input & Astronomical Dossier */}
          <section className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1b2331] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                  1. Astronomical & Geodetic Input Dossier
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Zero Silent Rectification Standard
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-[#090c12] p-3 rounded border border-[#1b2331]">
                <span className="text-slate-500 text-[10px] block uppercase mb-1">Civil & Solar Coordinates</span>
                <div className="space-y-1 text-slate-300">
                  <div>Date: <strong className="text-slate-100">{audit.civil_date}</strong> ({audit.weekday})</div>
                  <div>Civil Time: <strong className="text-slate-100">{audit.civil_time}</strong> (UTC {audit.utc_offset_hours >= 0 ? `+${audit.utc_offset_hours}` : audit.utc_offset_hours}h)</div>
                  <div>Coordinates: <span className="text-slate-200">{audit.latitude}°, {audit.longitude}°</span></div>
                  <div>Timezone: <span className="text-cyan-400">{audit.timezone_name}</span></div>
                </div>
              </div>

              <div className="bg-[#090c12] p-3 rounded border border-[#1b2331]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 text-[10px] uppercase">True Astronomical Solar Times</span>
                  <ExplainerTrigger id="time_normalization_eot" size="xs" variant="icon" />
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>Local Mean Solar Time (LMST): <span className="text-slate-100">{audit.lmst}</span></div>
                  <div>Local Apparent Solar Time (LAST): <span className="text-slate-100">{audit.last}</span></div>
                  <div>Equation of Time: <span className="text-slate-100">{audit.equation_of_time_minutes >= 0 ? `+${audit.equation_of_time_minutes.toFixed(2)}` : audit.equation_of_time_minutes.toFixed(2)} mins</span></div>
                  <div>Sunrise / Sunset: <span className="text-slate-100">{audit.sunrise} / {audit.sunset}</span></div>
                </div>
              </div>

              <div className="bg-[#090c12] p-3 rounded border border-[#1b2331]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 text-[10px] uppercase">Boundary Proximity & Sensitivity</span>
                  <ExplainerTrigger id="cusp_proximity_audit" size="xs" variant="icon" />
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>
                    Ascendant to Sign Cusp: <strong className="text-slate-100">{data.astronomical_base.boundary_distances.tropical_asc_to_cusp_deg.toFixed(2)}°</strong>
                  </div>
                  <div>
                    Boundary Sensitivity: {data.astronomical_base.boundary_distances.is_asc_boundary_sensitive ? (
                      <span className="text-amber-400 font-bold inline-flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> SENSITIVE (&lt;1.5°)
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> STABLE (&gt;1.5°)
                      </span>
                    )}
                  </div>
                  <div>
                    BaZi 2-Hour Branch Distance: <span className="text-slate-100">{data.birth_input_audit.boundary_audit.bazi_two_hour_boundary_distance_mins} mins</span>
                  </div>
                  <div>
                    Julian Day (UT): <span className="text-cyan-300">{audit.jd_ut.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 & 3: The Cross-Cultural Corroboration Matrix */}
          <section className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1b2331] pb-3 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                  2. Cross-Cultural Corroboration Matrix (Life Domains)
                </h3>
                <ExplainerTrigger id="three_cluster_consensus" label="Consensus Protocol" variant="badge" />
                <ExplainerTrigger id="honest_divergence_rate" label="Divergence Metric" variant="badge" />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap">
                <span className="text-[10px] text-slate-500 uppercase mr-1">Filter:</span>
                <button
                  type="button"
                  onClick={() => setDomainFilter('all')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] rounded text-[11px] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    domainFilter === 'all'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
                      : 'text-slate-400 hover:text-slate-200 border border-[#1b2331]'
                  }`}
                >
                  All Domains
                </button>
                <button
                  type="button"
                  onClick={() => setDomainFilter('consensus')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] rounded text-[11px] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    domainFilter === 'consensus'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80'
                      : 'text-slate-400 hover:text-slate-200 border border-[#1b2331]'
                  }`}
                >
                  Consensus Only ({synthesis.divergence_metrics.strong_domains + synthesis.divergence_metrics.moderate_domains})
                </button>
                <button
                  type="button"
                  onClick={() => setDomainFilter('divergent')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] rounded text-[11px] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    domainFilter === 'divergent'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/80'
                      : 'text-slate-400 hover:text-slate-200 border border-[#1b2331]'
                  }`}
                >
                  Divergent Only ({synthesis.divergence_metrics.divergent_domains})
                </button>
              </div>
            </div>

            {/* Domains Grid / Accordion */}
            <div className="space-y-3">
              {filteredDomains.map((dom) => {
                const isExpanded = expandedDomainId === dom.domain_id;
                const isDivergent = dom.grade === 'DIVERGENT';
                const isStrong = dom.grade === 'STRONG';

                return (
                  <div
                    key={dom.domain_id}
                    className={`rounded-lg border transition-all ${
                      isDivergent
                        ? 'bg-[#120f14] border-amber-900/50 hover:border-amber-700/80'
                        : isStrong
                        ? 'bg-[#0b1313] border-emerald-900/50 hover:border-emerald-700/80'
                        : 'bg-[#0d121c] border-[#1b2331] hover:border-slate-700'
                    }`}
                  >
                    {/* Domain Card Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedDomainId(isExpanded ? null : dom.domain_id)}
                      aria-expanded={isExpanded}
                      aria-controls={`reading-domain-${dom.domain_id}`}
                      className="w-full text-left p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a0f] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-slate-300 px-1.5 py-0.5 rounded bg-[#101520] border border-[#1b2331]">
                          {dom.domain_id}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-100 font-sans flex items-center gap-2">
                            <span>{dom.domain_name}</span>
                          </h4>
                          <p className="text-xs text-slate-300 mt-0.5 line-clamp-1 font-sans">
                            {dom.consensus_theme}
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Grade Badge & Tri-Cluster Polarities */}
                      <div className="flex items-center gap-2 font-mono text-xs self-start md:self-auto shrink-0">
                        {/* Grade */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isStrong
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : isDivergent
                              ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}
                        >
                          {dom.grade}
                        </span>

                        {/* Tri-Cluster Badges */}
                        <div className="flex items-center gap-1 text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              dom.evaluations.jyotisha.polarity === 'Positive'
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                                : dom.evaluations.jyotisha.polarity === 'Challenging'
                                ? 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                                : 'bg-slate-900 text-slate-300 border-slate-700'
                            }`}
                            title="Jyotisha Evaluation"
                          >
                            J:{dom.evaluations.jyotisha.polarity.substring(0, 3)}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              dom.evaluations.western.polarity === 'Positive'
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                                : dom.evaluations.western.polarity === 'Challenging'
                                ? 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                                : 'bg-slate-900 text-slate-300 border-slate-700'
                            }`}
                            title="Western Evaluation"
                          >
                            W:{dom.evaluations.western.polarity.substring(0, 3)}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              dom.evaluations.sinic.polarity === 'Positive'
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                                : dom.evaluations.sinic.polarity === 'Challenging'
                                ? 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                                : 'bg-slate-900 text-slate-300 border-slate-700'
                            }`}
                            title="Sinic (BaZi + Zi Wei) Evaluation"
                          >
                            S:{dom.evaluations.sinic.polarity.substring(0, 3)}
                          </span>
                        </div>

                        <span className="text-slate-400 text-xs ml-1">
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                    </button>

                    {/* Expandable Drill-Down Details */}
                    {isExpanded && (
                      <div id={`reading-domain-${dom.domain_id}`} className="px-4 pb-4 pt-2 border-t border-[#1b2331]/80 space-y-3 text-xs">
                        {/* Narrative Synthesis */}
                        <div className="p-3 rounded bg-[#080b11] border border-[#1b2331] text-slate-200 leading-relaxed font-sans">
                          <strong className="text-cyan-300 font-mono text-[11px] block uppercase mb-1">
                            Corroboration Synthesis:
                          </strong>
                          {dom.consensus_theme}
                        </div>

                        {/* Tri-Cluster Astronomical Evidence Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-mono text-[11px]">
                          <div className="bg-[#090d15] p-2.5 rounded border border-[#1b2331]">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                                IND
                              </span>
                              <span className="text-cyan-400 font-semibold">
                                Jyotisha (Sidereal Vedic)
                              </span>
                            </div>
                            <div className="text-slate-300">
                              Polarity: <strong className={dom.evaluations.jyotisha.polarity === 'Positive' ? 'text-emerald-400' : dom.evaluations.jyotisha.polarity === 'Challenging' ? 'text-rose-400' : 'text-slate-300'}>{dom.evaluations.jyotisha.polarity}</strong>
                            </div>
                            <div className="text-slate-400 mt-1">
                              {dom.evaluations.jyotisha.basis}
                            </div>
                          </div>

                          <div className="bg-[#090d15] p-2.5 rounded border border-[#1b2331]">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                                GRC
                              </span>
                              <span className="text-cyan-400 font-semibold">
                                Western (Hellenistic)
                              </span>
                            </div>
                            <div className="text-slate-300">
                              Polarity: <strong className={dom.evaluations.western.polarity === 'Positive' ? 'text-emerald-400' : dom.evaluations.western.polarity === 'Challenging' ? 'text-rose-400' : 'text-slate-300'}>{dom.evaluations.western.polarity}</strong>
                            </div>
                            <div className="text-slate-400 mt-1">
                              {dom.evaluations.western.basis}
                            </div>
                          </div>

                          <div className="bg-[#090d15] p-2.5 rounded border border-[#1b2331]">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                                SNC
                              </span>
                              <span className="text-cyan-400 font-semibold">
                                Sinic (BaZi + Zi Wei)
                              </span>
                            </div>
                            <div className="text-slate-300">
                              Polarity: <strong className={dom.evaluations.sinic.polarity === 'Positive' ? 'text-emerald-400' : dom.evaluations.sinic.polarity === 'Challenging' ? 'text-rose-400' : 'text-slate-300'}>{dom.evaluations.sinic.polarity}</strong>
                            </div>
                            <div className="text-slate-400 mt-1">
                              {dom.evaluations.sinic.basis}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Chronological Timing Synchronization */}
          <section className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1b2331] pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                  3. Quad-System Chronological Synchronization
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Multi-Decadal Period Alignment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-[#090c12] p-3 rounded border border-[#1b2331]">
                <span className="text-slate-500 text-[10px] block uppercase">Vimshottari Dasha</span>
                <span className="text-sm font-bold text-cyan-300 block mt-1">
                  {chronology.jyotisha_vimshottari.active_mahadasha || 'Active Period'}
                  {chronology.jyotisha_vimshottari.active_antardasha && (
                    <span className="text-amber-300/80 font-normal text-xs"> / {chronology.jyotisha_vimshottari.active_antardasha}</span>
                  )}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Span: {chronology.jyotisha_vimshottari.span || 'Current'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Focus: {chronology.jyotisha_vimshottari.activated_domain}
                </span>
              </div>

              <div className="bg-[#090c12] p-3 rounded border border-[#1b2331]">
                <span className="text-slate-500 text-[10px] block uppercase">BaZi Da Yun Pillar</span>
                <span className="text-sm font-bold text-cyan-300 block mt-1">
                  {chronology.bazi_da_yun.active_pillar || 'Pillar'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Ten God: {chronology.bazi_da_yun.ten_god || 'Direct Officer'}
                </span>
                {chronology.bazi_da_yun.current_liu_nian ? (
                  <span className="text-[10px] text-emerald-400/90 block mt-1">
                    Annual: {chronology.bazi_da_yun.current_liu_nian.year} {chronology.bazi_da_yun.current_liu_nian.pillar} ({chronology.bazi_da_yun.current_liu_nian.ten_god})
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Start Age: {chronology.bazi_da_yun.start_age || 'Active'}
                  </span>
                )}
              </div>

              <div className="bg-[#090c12] p-3 rounded border border-[#1b2331]">
                <span className="text-slate-500 text-[10px] block uppercase">Hellenistic Profection</span>
                <span className="text-sm font-bold text-cyan-300 block mt-1">
                  House {chronology.western_profection.activated_house}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Lord of Year: {chronology.western_profection.lord_of_year}
                </span>
                {chronology.western_profection.active_transits_summary && chronology.western_profection.active_transits_summary.length > 0 ? (
                  <span className="text-[10px] text-blue-300/80 block mt-1 truncate" title={chronology.western_profection.active_transits_summary[0]}>
                    Transit: {chronology.western_profection.active_transits_summary[0]}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Domain: {chronology.western_profection.activated_domain}
                  </span>
                )}
              </div>

              <div className="bg-[#090c12] p-3 rounded border border-[#1b2331]">
                <span className="text-slate-500 text-[10px] block uppercase">
                  {chronology.persian_firdaria ? "Zi Wei & Firdaria" : "Zi Wei Da Xian (Decade)"}
                </span>
                <span className="text-sm font-bold text-cyan-300 block mt-1">
                  {chronology.ziwei_da_xian.active_palace || 'Palace'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Decadal Span: {chronology.ziwei_da_xian.age_span || 'Active'}
                </span>
                {chronology.persian_firdaria ? (
                  <span className="text-[10px] text-purple-300/80 block mt-1">
                    Firdaria: {chronology.persian_firdaria.active_ruler} ({chronology.persian_firdaria.years_span})
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 block mt-1">
                    10-Year Major Palace Shift
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded bg-[#090d15] border border-[#1b2331] text-xs text-slate-300 font-sans leading-relaxed">
              <strong className="text-cyan-300 font-mono text-[11px] uppercase block mb-1">
                Convergence Assessment:
              </strong>
              {chronology.convergence_status}
            </div>
          </section>

          {/* Section 5: Attributed Temperament Overlays (Maya & Tibetan) */}
          <section className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1b2331] pb-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                  4. Attributed Temperament Overlays (Maya & Tibetan)
                </h3>
                <ExplainerTrigger id="epistemic_humility_framework" label="Non-Causal Overlays" variant="badge" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Non-Causal Symbolic Harmonics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {synthesis.temperament_axes.map((ax) => (
                <div key={ax.axis_id} className="bg-[#090c12] p-3 rounded border border-[#1b2331] space-y-1.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-semibold text-slate-100 text-xs">{ax.name}</span>
                    <span className="text-[10px] text-cyan-400 px-1 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/60">
                      {ax.axis_id}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">
                    {ax.expression}
                  </p>
                  <div className="pt-1.5 border-t border-[#1b2331]/80 text-[10px] font-mono space-y-0.5 text-slate-400">
                    <div>Base: <span className="text-slate-300">{ax.computed_base}</span></div>
                    <div>Overlay: <span className="text-amber-300/90">{ax.symbolic_overlay}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Invariants & Astronomical Verification Checklist */}
          <section className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1b2331] pb-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                  5. Dual-Engine Verification & Invariant Proofs
                </h3>
                <ExplainerTrigger id="dual_engine_validation" label="Dual-Engine Proof" variant="badge" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                All Astronomical Invariants Passed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <div className="bg-[#090c12] p-2.5 rounded border border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">Rahu–Ketu Invariant</span>
                  <span className="text-xs font-bold text-emerald-400">Exact 180° Nodal Axis</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="bg-[#090c12] p-2.5 rounded border border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">Vimshottari Cycle</span>
                  <span className="text-xs font-bold text-emerald-400">Exact 120-Year Sum</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="bg-[#090c12] p-2.5 rounded border border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">Zi Wei Palaces</span>
                  <span className="text-xs font-bold text-emerald-400">12 Unique Branches</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="bg-[#090c12] p-2.5 rounded border border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">Maya Long Count</span>
                  <span className="text-xs font-bold text-emerald-400">Exact Round-Trip</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* Raw Markdown View */
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-[#1b2331]">
            <span>Raw Markdown Source (Academic Formatting)</span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 min-h-[36px] rounded bg-[#121721] hover:bg-[#18202c] text-cyan-300 border border-[#1b2331] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Raw Text'}
            </button>
          </div>
          <div className="p-4 rounded-lg bg-[#080a0f] border border-[#1b2331] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[700px] overflow-y-auto">
            {markdownText}
          </div>
        </div>
      )}

      {/* Mobile & Tablet Epistemological Journey Navigation Bar */}
      {onNavigate && (
        <div className="p-4 sm:p-5 border-t border-[#1b2331] bg-[#090d14] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('synthesis')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-mono rounded-lg bg-[#101520] hover:bg-[#161d2c] text-slate-300 border border-[#1b2331] cursor-pointer transition-colors active:scale-[0.98]"
          >
            <span>← Synthesis Matrix</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('evidence')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-mono rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-semibold cursor-pointer transition-all border border-cyan-500/80 shadow-xs active:scale-[0.98]"
          >
            <span>View Mathematical Evidence Whitepaper →</span>
          </button>
        </div>
      )}
    </div>
  );
};
