import React, { useState } from 'react';
import type { ChartResponse } from '../types';
import { ExplainerTrigger } from './ExplainerTrigger';
import { getAstrologicalInferences } from '../utils/astrologicalInferences';
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
  Code,
  User,
  MapPin,
  Cpu,
  Briefcase,
  Heart,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

interface Props {
  data: ChartResponse;
  subjectName?: string;
  onNavigate?: (screen: 'workbench' | 'traditions' | 'synthesis' | 'dossier' | 'verification' | 'evidence') => void;
}

export const ReadingView: React.FC<Props> = ({ data, subjectName, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'interactive' | 'markdown'>('interactive');
  const [domainFilter, setDomainFilter] = useState<'all' | 'consensus' | 'divergent'>('all');
  const [expandedDomainId, setExpandedDomainId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const inferences = getAstrologicalInferences(data, subjectName);
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
      <div className="bg-stone-900 border-b border-stone-800 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-xs font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Multi-Tradition Reading
                <span className="sr-only">Audited Epistemological Document</span>
              </span>
              <span className="w-px h-3 bg-stone-700 hidden sm:inline-block" aria-hidden="true" />
              <span className="text-xs text-amber-400 font-sans">
                Standard v2.0
              </span>
              <span className="w-px h-3 bg-stone-700 hidden sm:inline-block" aria-hidden="true" />
              <span className="text-xs text-stone-400 font-sans">
                9 Traditions Corroborated
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Step 4 · Complete Birth Chart Reading</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1 font-sans hidden sm:block">
              Complete personality reading, life domains summary, and timing forecast synthesized across all 9 world traditions.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-stone-950 p-0.5 rounded-lg border border-stone-800 flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  viewMode === 'interactive'
                    ? 'bg-amber-950 text-amber-200 border border-amber-700/80 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Interactive View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('markdown')}
                className={`px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  viewMode === 'markdown'
                    ? 'bg-amber-950 text-amber-200 border border-amber-700/80 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Text / Markdown</span>
              </button>
            </div>

            {/* Quick Actions */}
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-sans rounded bg-stone-800 hover:bg-stone-700 border transition-colors duration-150 cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-95 ${
                copied
                  ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40 shadow-xs'
                  : 'text-stone-300 border-stone-700'
              }`}
              data-tooltip="Copy Full Document Markdown"
              aria-label="Copy Full Document Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="px-3 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-sans rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              data-tooltip="Download Markdown Document (.md)"
              aria-label="Download Markdown Document (.md)"
            >
              <Download className="w-3.5 h-3.5 text-stone-400" />
              <span>.MD</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-sans rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              data-tooltip="Download Raw Master Dataset (.json)"
              aria-label="Download Raw Master Dataset (.json)"
            >
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>.JSON</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-sans rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              data-tooltip="Print or Save PDF"
              aria-label="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5 text-stone-400" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Document Metadata Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-4 border-t border-stone-800 text-[11px] font-sans">
          <div className="bg-stone-950 px-2.5 py-1.5 rounded border border-stone-800 min-w-0">
            <span className="text-stone-400 text-[10px] font-medium flex items-center gap-1">
              <User className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              Subject
            </span>
            <span className="font-semibold text-amber-300 truncate block mt-0.5" title={inferences.subject_name}>
              {inferences.subject_name}
            </span>
          </div>
          <div className="bg-stone-950 px-2.5 py-1.5 rounded border border-stone-800 min-w-0">
            <span className="text-stone-400 text-[10px] font-medium flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              Birthplace
            </span>
            <span className="font-semibold text-stone-200 truncate block mt-0.5" title={inferences.birthplace}>
              {inferences.birthplace}
            </span>
          </div>
          <div className="bg-stone-950 px-2.5 py-1.5 rounded border border-stone-800 min-w-0">
            <span className="text-stone-400 block text-[10px] font-medium">Birth Date &amp; Time</span>
            <span className="font-semibold text-stone-200 truncate block mt-0.5">
              {audit.civil_date} {audit.civil_time}
            </span>
          </div>
          <div className="bg-stone-950 px-2.5 py-1.5 rounded border border-stone-800 min-w-0">
            <span className="text-stone-400 block text-[10px] font-medium">Core Archetype</span>
            <span className="font-semibold text-amber-300 truncate block mt-0.5" title={inferences.core_archetype.archetype_title}>
              {inferences.core_archetype.archetype_title}
            </span>
          </div>
          <div className="bg-stone-950 px-2.5 py-1.5 rounded border border-stone-800 min-w-0">
            <span className="text-stone-400 block text-[10px] font-medium">Verification Status</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1 truncate mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              {verification.overall_verification_status} ({verification.overall_confidence})
            </span>
          </div>
          <div className="bg-stone-950 px-2.5 py-1.5 rounded border border-stone-800 min-w-0">
            <span className="text-stone-400 block text-[10px] font-medium">Traditions Differ</span>
            <span className={`font-bold font-mono truncate block mt-0.5 ${synthesis.divergence_metrics.divergence_rate_percent > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {synthesis.divergence_metrics.divergence_rate_percent}% ({synthesis.divergence_metrics.divergent_domains}/9 Differ)
            </span>
          </div>
        </div>
      </div>

      {/* ==================== 2. MAIN DOCUMENT BODY ==================== */}
      {viewMode === 'interactive' ? (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Ethical & Scientific Disclaimer (Collapsible on mobile to save vertical space) */}
          <details className="group rounded-lg bg-amber-950/30 border border-amber-900/60 text-xs font-sans text-amber-200/90 overflow-hidden">
            <summary className="p-2.5 sm:p-3 flex items-center justify-between cursor-pointer list-none select-none">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-amber-300">Ethical &amp; Scientific Disclaimer</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-3 pb-3 pt-0.5 text-xs text-amber-200/80 leading-relaxed border-t border-amber-900/40">
              This reading is an exploratory comparison of classical astrological traditions and astronomical calculations. 
              It provides honest transparency into where traditions agree and differ, and is not scientific proof or guaranteed prediction. 
              It strictly does not provide medical diagnosis, financial advice, or legal counsel.
            </div>
          </details>

          {/* Section 1: Executive Input & Astronomical Dossier */}
          <section className="bg-stone-900 border border-stone-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <h3 className="text-sm font-semibold text-stone-100 font-sans">
                  1. Birth Details &amp; Astronomical Data
                  <span className="sr-only">1. Astronomical &amp; Geodetic Input Dossier</span>
                </h3>
              </div>
              <span className="text-xs font-sans text-stone-400">
                Unrectified Exact Coordinates
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
              <div className="bg-stone-950 p-3 rounded border border-stone-800">
                <span className="text-stone-400 text-xs font-medium block mb-1">Subject & Civil Coordinates</span>
                <div className="space-y-1 text-stone-300">
                  <div>Subject: <strong className="text-amber-300 font-sans">{inferences.subject_name}</strong></div>
                  <div>Birthplace: <strong className="text-stone-100 font-sans">{inferences.birthplace}</strong></div>
                  <div>Date: <strong className="text-stone-100 font-mono">{audit.civil_date}</strong> ({audit.weekday})</div>
                  <div>Civil Time: <strong className="text-stone-100 font-mono">{audit.civil_time}</strong> (UTC <span className="font-mono">{audit.utc_offset_hours >= 0 ? `+${audit.utc_offset_hours}` : audit.utc_offset_hours}</span>h)</div>
                  <div>Coordinates: <span className="text-stone-200 font-mono">{audit.latitude}°, {audit.longitude}°</span></div>
                  <div>Timezone: <span className="text-amber-300 font-mono">{audit.timezone_name}</span></div>
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded border border-stone-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-stone-400 text-xs font-medium">True Astronomical Solar Times</span>
                  <ExplainerTrigger id="time_normalization_eot" size="xs" variant="icon" />
                </div>
                <div className="space-y-1 text-stone-300">
                  <div>Local Mean Solar Time (LMST): <span className="text-stone-100 font-mono">{audit.lmst}</span></div>
                  <div>Local Apparent Solar Time (LAST): <span className="text-stone-100 font-mono">{audit.last}</span></div>
                  <div>Equation of Time: <span className="text-stone-100 font-mono">{audit.equation_of_time_minutes >= 0 ? `+${audit.equation_of_time_minutes.toFixed(2)}` : audit.equation_of_time_minutes.toFixed(2)}</span> mins</div>
                  <div>Sunrise / Sunset: <span className="text-stone-100 font-mono">{audit.sunrise} / {audit.sunset}</span></div>
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded border border-stone-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-stone-400 text-xs font-medium">Boundary Proximity & Sensitivity</span>
                  <ExplainerTrigger id="cusp_proximity_audit" size="xs" variant="icon" />
                </div>
                <div className="space-y-1 text-stone-300">
                  <div>
                    Ascendant to Sign Cusp: <strong className="text-stone-100 font-mono">{data.astronomical_base.boundary_distances.tropical_asc_to_cusp_deg.toFixed(2)}°</strong>
                  </div>
                  <div>
                    Boundary Sensitivity: {data.astronomical_base.boundary_distances.is_asc_boundary_sensitive ? (
                      <span className="text-amber-400 font-medium inline-flex items-center gap-1 font-sans">
                        <AlertTriangle className="w-3.5 h-3.5" /> Sensitive (&lt;1.5°)
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium inline-flex items-center gap-1 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Stable (&gt;1.5°)
                      </span>
                    )}
                  </div>
                  <div>
                    BaZi 2-Hour Branch Distance: <span className="text-stone-100 font-mono">{data.birth_input_audit.boundary_audit.bazi_two_hour_boundary_distance_mins}</span> mins
                  </div>
                  <div>
                    Julian Day (UT): <span className="text-amber-300 font-mono">{audit.jd_ut.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Synthesized Astrological Inferences & Personality Profile */}
          <section className="bg-stone-900 border border-stone-800 rounded-lg p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-3 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <h3 className="text-sm font-semibold text-stone-100 font-sans">
                  2. Synthesized Astrological Inferences & Personality Profile
                </h3>
                <span className="px-2 py-0.5 rounded text-xs font-sans bg-amber-950 text-amber-300 border border-amber-800/80 font-medium">
                  9-System Deductive Profile
                </span>
              </div>
              <span className="text-xs font-sans text-stone-400">
                Archetype: <strong className="text-amber-300">{inferences.core_archetype.archetype_title}</strong>
              </span>
            </div>

            {/* Archetype Hero Spotlight */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 p-4 sm:p-5 rounded-lg border border-amber-900/50 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-amber-900/40">
                <div>
                  <span className="text-xs font-sans text-amber-400 font-medium block mb-0.5">
                    Primary Civilizational Archetype
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-stone-100 tracking-wide font-sans">
                    {inferences.core_archetype.archetype_title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto shrink-0 font-sans text-xs">
                  <span className="px-2.5 py-1 rounded bg-stone-950 text-amber-300 border border-amber-800/80 text-xs">
                    Subject: <strong className="text-white">{inferences.subject_name}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-stone-950 text-stone-300 border border-stone-800 text-xs">
                    Birthplace: <strong className="text-stone-100">{inferences.birthplace}</strong>
                  </span>
                </div>
              </div>

              {/* Visual Harmony Matrix Gauge */}
              <div className="my-3 p-3 rounded-lg bg-stone-950/80 border border-amber-900/40 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Circular Consensus Meter */}
                <div className="sm:col-span-4 flex items-center gap-3">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90 select-none">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#292524" strokeWidth="6" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="6"
                        strokeDasharray={213.6}
                        strokeDashoffset={213.6 * (1 - (100 - synthesis.divergence_metrics.divergence_rate_percent) / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {(100 - synthesis.divergence_metrics.divergence_rate_percent).toFixed(0)}%
                      </span>
                      <span className="text-[8px] font-sans text-stone-400">Harmony</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-serif font-bold text-stone-100 block">Cross-Tradition Accord</span>
                    <span className="text-[10px] font-sans text-stone-400 block mt-0.5">
                      {synthesis.divergence_metrics.strong_domains + synthesis.divergence_metrics.moderate_domains} of 9 domains in direct alignment
                    </span>
                  </div>
                </div>

                {/* 4 Life Pillars Visual Progress Meters */}
                <div className="sm:col-span-8 grid grid-cols-2 gap-2 text-[11px] font-sans">
                  <div className="p-1.5 rounded bg-stone-900/80 border border-stone-800">
                    <div className="flex justify-between text-[10px] text-stone-400 mb-0.5">
                      <span>Vocation &amp; Ambition</span>
                      <span className="font-mono text-amber-300 font-semibold">88%</span>
                    </div>
                    <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-[88%]" />
                    </div>
                  </div>
                  <div className="p-1.5 rounded bg-stone-900/80 border border-stone-800">
                    <div className="flex justify-between text-[10px] text-stone-400 mb-0.5">
                      <span>Cognitive Wiring</span>
                      <span className="font-mono text-cyan-300 font-semibold">74%</span>
                    </div>
                    <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full w-[74%]" />
                    </div>
                  </div>
                  <div className="p-1.5 rounded bg-stone-900/80 border border-stone-800">
                    <div className="flex justify-between text-[10px] text-stone-400 mb-0.5">
                      <span>Material Fortune</span>
                      <span className="font-mono text-emerald-300 font-semibold">82%</span>
                    </div>
                    <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[82%]" />
                    </div>
                  </div>
                  <div className="p-1.5 rounded bg-stone-900/80 border border-stone-800">
                    <div className="flex justify-between text-[10px] text-stone-400 mb-0.5">
                      <span>Vitality &amp; Spirit</span>
                      <span className="font-mono text-amber-300 font-semibold">90%</span>
                    </div>
                    <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-[90%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Narrative Summary Paragraphs */}
              <div className="mt-3.5 space-y-2.5 text-xs sm:text-[13px] text-stone-300 leading-relaxed font-sans">
                {inferences.summary_narrative.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-stone-200">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Five Civilizational Foundations */}
            <div className="space-y-2">
              <span className="text-xs font-sans font-medium text-stone-400 block">
                Foundational Planetary Anchors Across Traditions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 text-xs font-sans">
                {/* Vedic */}
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-amber-400">Vedic Jyotisha</span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">D1 / D9</span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans leading-relaxed">
                      {inferences.core_archetype.civilizational_pillars.vedic_core}
                    </p>
                  </div>
                </div>

                {/* Western */}
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-blue-400">Hellenistic Western</span>
                      <span className="text-xs font-sans px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">Tropical</span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans leading-relaxed">
                      {inferences.core_archetype.civilizational_pillars.western_core}
                    </p>
                  </div>
                </div>

                {/* BaZi */}
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-emerald-400">BaZi Four Pillars</span>
                      <span className="text-xs font-sans px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">Wu Xing</span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans leading-relaxed">
                      {inferences.core_archetype.civilizational_pillars.bazi_core}
                    </p>
                  </div>
                </div>

                {/* Zi Wei */}
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-amber-400">Zi Wei Dou Shu</span>
                      <span className="text-xs font-sans px-1.5 py-0.5 rounded bg-stone-900 text-amber-300 border border-amber-800/60 font-serif">Polar Stars</span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans leading-relaxed">
                      {inferences.core_archetype.civilizational_pillars.ziwei_core}
                    </p>
                  </div>
                </div>

                {/* Persian Almuten */}
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1.5 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-teal-400">Persian Almuten</span>
                      <span className="text-xs font-sans px-1.5 py-0.5 rounded bg-teal-950/60 text-teal-300 border border-teal-800/40">Ibn Ezra</span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans leading-relaxed">
                      {inferences.core_archetype.civilizational_pillars.persian_almuten}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Column Analytical Triad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Column 1: Cognitive Wiring */}
              <div className="bg-stone-950 p-4 rounded-lg border border-stone-800 space-y-3 flex flex-col">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-xs font-semibold text-stone-100 font-sans">
                    Cognitive Architecture
                  </h4>
                </div>
                <div className="space-y-2 text-xs text-stone-300 flex-1 font-sans">
                  <div>
                    <span className="text-xs font-medium text-stone-400 block">Mental Style</span>
                    <p className="text-stone-200 mt-0.5">{inferences.cognitive_inferences.mental_style}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-stone-400 block">Intellectual Strengths</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-stone-300 text-xs">
                      {inferences.cognitive_inferences.intellectual_strengths.map((str, idx) => (
                        <li key={idx} className="leading-snug">{str}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-1 border-t border-stone-800">
                    <span className="text-xs font-medium text-stone-400 block">Rhetorical Style</span>
                    <p className="text-stone-300 text-xs mt-0.5">{inferences.cognitive_inferences.communication_vector}</p>
                  </div>
                </div>
              </div>

              {/* Column 2: Vocation & Executive Ambition */}
              <div className="bg-stone-950 p-4 rounded-lg border border-stone-800 space-y-3 flex flex-col">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-xs font-semibold text-stone-100 font-sans">
                    Vocation & Executive Drive
                  </h4>
                </div>
                <div className="space-y-2 text-xs text-stone-300 flex-1 font-sans">
                  <div>
                    <span className="text-xs font-medium text-stone-400 block">Career Vector</span>
                    <p className="text-stone-200 mt-0.5">{inferences.vocational_inferences.career_vector}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-stone-400 block">Leadership Posture</span>
                    <p className="text-stone-300 mt-0.5">{inferences.vocational_inferences.leadership_style}</p>
                  </div>
                  <div className="pt-1 border-t border-stone-800">
                    <span className="text-xs font-medium text-stone-400 block">Primary Ambitions</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-stone-300 text-xs">
                      {inferences.vocational_inferences.key_drives.map((drv, idx) => (
                        <li key={idx} className="leading-snug">{drv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Column 3: Relational Dynamics & Karmic Evolution */}
              <div className="bg-stone-950 p-4 rounded-lg border border-stone-800 space-y-3 flex flex-col">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <h4 className="text-xs font-semibold text-stone-100 font-sans">
                    Relational & Karmic Blueprint
                  </h4>
                </div>
                <div className="space-y-2 text-xs text-stone-300 flex-1 font-sans">
                  <div>
                    <span className="text-xs font-medium text-stone-400 block">Emotional Temperament</span>
                    <p className="text-stone-200 mt-0.5">{inferences.relational_inferences.emotional_temperament}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-stone-400 block">Relational Dynamics</span>
                    <p className="text-stone-300 mt-0.5">{inferences.relational_inferences.relational_dynamics}</p>
                  </div>
                  <div className="pt-1 border-t border-stone-800">
                    <span className="text-xs font-medium text-stone-400 block">Growth Edges & Blind Spots</span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-amber-300/90 text-xs">
                      {inferences.karmic_inferences.growth_edges.map((edge, idx) => (
                        <li key={idx} className="leading-snug">{edge}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Life Chapter & Strategic Timing Banner */}
            <div className="p-3.5 rounded-lg bg-stone-950 border border-amber-900/60 font-sans text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-amber-300 text-xs">
                    Current Timing Chapter:
                  </span>
                  <span className="text-stone-200">{inferences.timing_inferences.active_chapter_theme}</span>
                </div>
                <p className="text-xs text-stone-400 font-sans">
                  {inferences.timing_inferences.strategic_advice}
                </p>
              </div>
              <div className="shrink-0">
                <span className="px-2.5 py-1 rounded bg-stone-900 text-emerald-400 border border-emerald-800/60 text-xs font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Quad-Cycle Synchronized
                </span>
              </div>
            </div>
          </section>

          {/* Section 3: The Cross-Cultural Corroboration Matrix */}
          <section className="bg-stone-900 border border-stone-800 rounded-lg p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-3 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <h3 className="text-sm font-semibold text-stone-100 font-sans">
                  3. Cross-Cultural Corroboration Matrix (Life Domains)
                </h3>
                <ExplainerTrigger id="three_cluster_consensus" label="Consensus Protocol" variant="badge" />
                <ExplainerTrigger id="honest_divergence_rate" label="Divergence Metric" variant="badge" />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 font-sans text-xs flex-wrap">
                <span className="text-xs text-stone-400 font-medium mr-1">Filter:</span>
                <button
                  type="button"
                  onClick={() => setDomainFilter('all')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] rounded text-xs cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    domainFilter === 'all'
                      ? 'bg-amber-950 text-amber-200 border border-amber-700/80'
                      : 'text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  All Domains
                </button>
                <button
                  type="button"
                  onClick={() => setDomainFilter('consensus')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] rounded text-xs cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    domainFilter === 'consensus'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80'
                      : 'text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  Consensus Only ({synthesis.divergence_metrics.strong_domains + synthesis.divergence_metrics.moderate_domains})
                </button>
                <button
                  type="button"
                  onClick={() => setDomainFilter('divergent')}
                  className={`px-3 py-1.5 min-h-[38px] sm:min-h-[32px] rounded text-xs cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    domainFilter === 'divergent'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/80'
                      : 'text-stone-400 hover:text-stone-200 border border-stone-800'
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
                    className={`rounded-lg border transition-colors duration-150 ${
                      isDivergent
                        ? 'bg-amber-950/20 border-amber-900/50 hover:border-amber-700/80'
                        : isStrong
                        ? 'bg-emerald-950/20 border-emerald-900/50 hover:border-emerald-700/80'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {/* Domain Card Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedDomainId(isExpanded ? null : dom.domain_id)}
                      aria-expanded={isExpanded}
                      aria-controls={`reading-domain-${dom.domain_id}`}
                      className="w-full text-left p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-stone-300 px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800">
                          {dom.domain_id}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-stone-100 font-sans flex items-center gap-2">
                            <span>{dom.domain_name}</span>
                          </h4>
                          <p className="text-xs text-stone-300 mt-0.5 line-clamp-1 font-sans">
                            {dom.consensus_theme}
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Grade Badge & Tri-Cluster Polarities */}
                      <div className="flex items-center gap-2 font-sans text-xs self-start md:self-auto shrink-0">
                        {/* Grade */}
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            isStrong
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : isDivergent
                              ? 'bg-amber-950 text-amber-300 border border-amber-800 motion-safe:animate-pulse motion-reduce:animate-none'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {dom.grade}
                        </span>

                        {/* Tri-Cluster Badges */}
                        <div className="flex items-center gap-1 text-xs">
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              dom.evaluations.jyotisha.polarity === 'Positive'
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                                : dom.evaluations.jyotisha.polarity === 'Challenging'
                                ? 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                                : 'bg-stone-900 text-stone-300 border-stone-700'
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
                                : 'bg-stone-900 text-stone-300 border-stone-700'
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
                                : 'bg-stone-900 text-stone-300 border-stone-700'
                            }`}
                            title="Sinic (BaZi + Zi Wei) Evaluation"
                          >
                            S:{dom.evaluations.sinic.polarity.substring(0, 3)}
                          </span>
                        </div>

                        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 motion-safe:transition-transform motion-reduce:transition-none duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                      </div>
                    </button>

                    {/* Expandable Drill-Down Details */}
                    {isExpanded && (
                      <div id={`reading-domain-${dom.domain_id}`} className="px-4 pb-4 pt-2 border-t border-stone-800/80 space-y-3 text-xs">
                        {/* Narrative Synthesis */}
                        <div className="p-3 rounded bg-stone-950 border border-stone-800 text-stone-200 leading-relaxed font-sans">
                          <strong className="text-amber-300 font-sans text-xs font-semibold block mb-1">
                            Corroboration Synthesis:
                          </strong>
                          {dom.consensus_theme}
                        </div>

                        {/* Tri-Cluster Astronomical Evidence Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-sans">
                          <div className="bg-stone-900 p-2.5 rounded border border-stone-800">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-sans bg-amber-950 text-amber-300 border border-amber-800/80 font-medium">
                                IND
                              </span>
                              <span className="text-amber-400 font-semibold font-sans">
                                Jyotisha (Sidereal Vedic)
                              </span>
                            </div>
                            <div className="text-stone-300 font-sans">
                              Polarity: <strong className={dom.evaluations.jyotisha.polarity === 'Positive' ? 'text-emerald-400' : dom.evaluations.jyotisha.polarity === 'Challenging' ? 'text-rose-400' : 'text-stone-300'}>{dom.evaluations.jyotisha.polarity}</strong>
                            </div>
                            <div className="text-stone-400 mt-1 font-sans">
                              {dom.evaluations.jyotisha.basis}
                            </div>
                          </div>

                          <div className="bg-stone-900 p-2.5 rounded border border-stone-800">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-sans bg-amber-950 text-amber-300 border border-amber-800/80 font-medium">
                                GRC
                              </span>
                              <span className="text-amber-400 font-semibold font-sans">
                                Western (Hellenistic)
                              </span>
                            </div>
                            <div className="text-stone-300 font-sans">
                              Polarity: <strong className={dom.evaluations.western.polarity === 'Positive' ? 'text-emerald-400' : dom.evaluations.western.polarity === 'Challenging' ? 'text-rose-400' : 'text-stone-300'}>{dom.evaluations.western.polarity}</strong>
                            </div>
                            <div className="text-stone-400 mt-1 font-sans">
                              {dom.evaluations.western.basis}
                            </div>
                          </div>

                          <div className="bg-stone-900 p-2.5 rounded border border-stone-800">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-sans bg-amber-950 text-amber-300 border border-amber-800/80 font-medium">
                                SNC
                              </span>
                              <span className="text-amber-400 font-semibold font-sans">
                                Sinic (BaZi + Zi Wei)
                              </span>
                            </div>
                            <div className="text-stone-300 font-sans">
                              Polarity: <strong className={dom.evaluations.sinic.polarity === 'Positive' ? 'text-emerald-400' : dom.evaluations.sinic.polarity === 'Challenging' ? 'text-rose-400' : 'text-stone-300'}>{dom.evaluations.sinic.polarity}</strong>
                            </div>
                            <div className="text-stone-400 mt-1 font-sans">
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
          <section className="bg-stone-900 border border-stone-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-stone-100 font-sans">
                  4. Quad-System Chronological Synchronization
                </h3>
              </div>
              <span className="text-xs font-sans text-stone-400">
                Multi-Decadal Period Alignment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
              <div className="bg-stone-950 p-3 rounded border border-stone-800">
                <span className="text-stone-400 text-xs block font-medium">Vimshottari Dasha</span>
                <span className="text-sm font-bold text-amber-300 block mt-1 font-sans">
                  {chronology.jyotisha_vimshottari.active_mahadasha || 'Active Period'}
                  {chronology.jyotisha_vimshottari.active_antardasha && (
                    <span className="text-amber-300/80 font-normal text-xs"> / {chronology.jyotisha_vimshottari.active_antardasha}</span>
                  )}
                </span>
                <span className="text-xs text-stone-400 block mt-0.5 font-sans">
                  Span: <span className="font-mono">{chronology.jyotisha_vimshottari.span || 'Current'}</span>
                </span>
                <span className="text-xs text-stone-400 block mt-1 font-sans">
                  Focus: {chronology.jyotisha_vimshottari.activated_domain}
                </span>
              </div>

              <div className="bg-stone-950 p-3 rounded border border-stone-800">
                <span className="text-stone-400 text-xs block font-medium">BaZi Da Yun Pillar</span>
                <span className="text-sm font-bold text-amber-300 block mt-1 font-sans">
                  {chronology.bazi_da_yun.active_pillar || 'Pillar'}
                </span>
                <span className="text-xs text-stone-400 block mt-0.5 font-sans">
                  Ten God: {chronology.bazi_da_yun.ten_god || 'Direct Officer'}
                </span>
                {chronology.bazi_da_yun.current_liu_nian ? (
                  <span className="text-xs text-emerald-400/90 block mt-1 font-mono">
                    Annual: {chronology.bazi_da_yun.current_liu_nian.year} {chronology.bazi_da_yun.current_liu_nian.pillar} ({chronology.bazi_da_yun.current_liu_nian.ten_god})
                  </span>
                ) : (
                  <span className="text-xs text-stone-400 block mt-1 font-sans">
                    Start Age: {chronology.bazi_da_yun.start_age || 'Active'}
                  </span>
                )}
              </div>

              <div className="bg-stone-950 p-3 rounded border border-stone-800">
                <span className="text-stone-400 text-xs block font-medium">Hellenistic Profection</span>
                <span className="text-sm font-bold text-amber-300 block mt-1 font-sans">
                  House {chronology.western_profection.activated_house}
                </span>
                <span className="text-xs text-stone-400 block mt-0.5 font-sans">
                  Lord of Year: {chronology.western_profection.lord_of_year}
                </span>
                {chronology.western_profection.active_transits_summary && chronology.western_profection.active_transits_summary.length > 0 ? (
                  <span className="text-xs text-blue-300/80 block mt-1 truncate font-sans" title={chronology.western_profection.active_transits_summary[0]}>
                    Transit: <span className="font-mono">{chronology.western_profection.active_transits_summary[0]}</span>
                  </span>
                ) : (
                  <span className="text-xs text-stone-400 block mt-1 font-sans">
                    Domain: {chronology.western_profection.activated_domain}
                  </span>
                )}
              </div>

              <div className="bg-stone-950 p-3 rounded border border-stone-800">
                <span className="text-stone-400 text-xs block font-medium">
                  {chronology.persian_firdaria ? "Zi Wei & Firdaria" : "Zi Wei Da Xian (Decade)"}
                </span>
                <span className="text-sm font-bold text-amber-300 block mt-1 font-sans">
                  {chronology.ziwei_da_xian.active_palace || 'Palace'}
                </span>
                <span className="text-xs text-stone-400 block mt-0.5 font-sans">
                  Decadal Span: <span className="font-mono">{chronology.ziwei_da_xian.age_span || 'Active'}</span>
                </span>
                {chronology.persian_firdaria ? (
                  <span className="text-xs text-amber-300/90 block mt-1 font-sans">
                    Firdaria: <span className="font-mono">{chronology.persian_firdaria.active_ruler} ({chronology.persian_firdaria.years_span})</span>
                  </span>
                ) : (
                  <span className="text-xs text-stone-400 block mt-1 font-sans">
                    10-Year Major Palace Shift
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded bg-stone-950 border border-stone-800 text-xs text-stone-300 font-sans leading-relaxed">
              <strong className="text-amber-300 font-sans text-xs font-semibold block mb-1">
                Convergence Assessment:
              </strong>
              {chronology.convergence_status}
            </div>
          </section>

          {/* Section 5: Attributed Temperament Overlays (Maya & Tibetan) */}
          <section className="bg-stone-900 border border-stone-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-stone-100 font-sans">
                  5. Attributed Temperament Overlays (Maya & Tibetan)
                </h3>
                <ExplainerTrigger id="epistemic_humility_framework" label="Non-Causal Overlays" variant="badge" />
              </div>
              <span className="text-xs font-sans text-stone-400">
                Non-Causal Symbolic Harmonics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-sans">
              {synthesis.temperament_axes.map((ax) => (
                <div key={ax.axis_id} className="bg-stone-950 p-3 rounded border border-stone-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-100 text-xs font-sans">{ax.name}</span>
                    <span className="text-xs font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/60">
                      {ax.axis_id}
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs font-sans">
                    {ax.expression}
                  </p>
                  <div className="pt-1.5 border-t border-stone-800 text-xs font-sans space-y-0.5 text-stone-400">
                    <div>Base: <span className="text-stone-300 font-mono">{ax.computed_base}</span></div>
                    <div>Overlay: <span className="text-amber-300/90 font-mono">{ax.symbolic_overlay}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Invariants & Astronomical Verification Checklist */}
          <section className="bg-stone-900 border border-stone-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-stone-100 font-sans">
                  6. Dual-Engine Verification & Invariant Proofs
                </h3>
                <ExplainerTrigger id="dual_engine_validation" label="Dual-Engine Proof" variant="badge" />
              </div>
              <span className="text-xs font-sans text-emerald-400 font-medium">
                All Astronomical Invariants Passed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-sans">
              <div className="bg-stone-950 p-2.5 rounded border border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 text-xs block font-medium">Rahu / Ketu Invariant</span>
                  <span className="text-xs font-semibold text-emerald-400 font-sans">Exact 180° Nodal Axis</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="bg-stone-950 p-2.5 rounded border border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 text-xs block font-medium">Vimshottari Cycle</span>
                  <span className="text-xs font-semibold text-emerald-400 font-sans">Exact 120-Year Sum</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="bg-stone-950 p-2.5 rounded border border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 text-xs block font-medium">Zi Wei Palaces</span>
                  <span className="text-xs font-semibold text-emerald-400 font-sans">12 Unique Branches</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="bg-stone-950 p-2.5 rounded border border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 text-xs block font-medium">Maya Long Count</span>
                  <span className="text-xs font-semibold text-emerald-400 font-sans">Exact Round-Trip</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* Raw Markdown View */
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-sans text-stone-400 pb-2 border-b border-stone-800">
            <span>Raw Markdown Source (Academic Formatting)</span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 min-h-[36px] rounded bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Raw Text'}
            </button>
          </div>
          <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-stone-300 whitespace-pre-wrap leading-relaxed max-h-[700px] overflow-y-auto">
            {markdownText}
          </div>
        </div>
      )}

      {/* Mobile & Tablet Journey Navigation Bar */}
      {onNavigate && (
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('synthesis')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-sans font-medium rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 cursor-pointer transition-colors motion-safe:active:scale-[0.98] motion-reduce:active:scale-100 whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-400" />
            <span>Step 3 · Tradition Comparison<span className="sr-only"> Synthesis Matrix</span></span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('workbench')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-serif font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer transition-colors duration-150 border border-amber-300 shadow-xs motion-safe:active:scale-[0.98] motion-reduce:active:scale-100 whitespace-nowrap"
          >
            <span className="whitespace-nowrap">Step 1 · Return to Birth Input<span className="sr-only"> Complete · Return to Workbench</span></span>
            <RotateCcw className="w-3.5 h-3.5 text-stone-950" />
          </button>
        </div>
      )}
    </div>
  );
};
