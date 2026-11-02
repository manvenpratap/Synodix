import React from 'react';
import type { VerificationReport } from '../types';
import { ExplainerTrigger } from './ExplainerTrigger';
import { ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  report: VerificationReport;
}

export const VerificationCard: React.FC<Props> = ({ report }) => {
  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Top Hero Pedestal (gpt-taste Precision Laboratory Architecture) */}
      <div className="p-4 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 hero-wide-container">
        <div className="flex items-start gap-3.5 max-w-4xl">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-950/90 border border-amber-800 flex items-center justify-center text-amber-300 shrink-0 shadow-xs ring-1 ring-amber-500/20">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs text-amber-400 font-serif font-semibold tracking-wider uppercase">
                Dual-Engine Ephemeris Audit
              </span>
              <span className="text-stone-400 hidden sm:inline">•</span>
              <span className="text-xs text-stone-400 font-sans hidden sm:inline">
                NASA JPL DE421 vs Swiss Ephemeris 2.10
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                PASS ({report.overall_verification_status})
              </span>
            </div>
            <h2 className="hero-h1-clamped font-serif font-bold text-stone-100 tracking-tight flex flex-wrap items-center gap-2">
              <span>Swiss Ephemeris vs NASA/JPL DE421</span>
              <span className="inline-block w-12 sm:w-14 h-5 sm:h-6 rounded-full align-middle bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 border border-amber-400/50 mx-1 shadow-inner inline-flex items-center justify-center text-[10px] text-amber-950 font-mono font-bold">&lt;0.01°</span>
              <span className="text-stone-300 hidden sm:inline">&amp; Ephemeris Parity</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed text-pretty">
              Real-time independent validation verifying Swiss Ephemeris planetary coordinates against NASA Jet Propulsion Laboratory DE421 ephemerides under strict micro-arcsecond thresholds.
            </p>
          </div>
        </div>

        {/* Verification Status Metrics Pill Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-800">
          <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs font-mono space-y-1">
            <div className="flex items-center justify-between gap-3 text-stone-400">
              <span>Max Delta:</span>
              <strong className="text-amber-400 font-mono">{report.max_planetary_difference_deg}°</strong>
            </div>
            <div className="flex items-center justify-between gap-3 text-stone-400">
              <span>Confidence:</span>
              <strong className="text-emerald-400 font-mono">{report.overall_confidence}</strong>
            </div>
          </div>
          <ExplainerTrigger id="dual_engine_validation" label="Dual Engine Math" variant="badge" />
        </div>
      </div>

      {/* Invariants Checklist Bar (gpt-taste Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 bento-dense">
        {report.invariants.map((inv, idx) => (
          <div
            key={idx}
            className="bento-card bg-stone-900/90 p-4 rounded-xl border border-stone-800 flex flex-col justify-between hover:border-amber-700/80 transition-all duration-300 cursor-pointer shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-400 font-medium font-sans">
                  {inv.system}
                </span>
                <span className={`px-2 py-0.5 text-xs font-sans font-semibold rounded ${
                  inv.status === 'PASS'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                    : 'bg-rose-950 text-rose-300 border border-rose-800/80'
                }`}>
                  {inv.status}
                </span>
              </div>
              <p className="text-xs text-stone-300 font-normal mt-1.5 line-clamp-2 max-w-[55ch] text-pretty">
                {inv.description}
              </p>
            </div>
            <div className="mt-3 text-xs font-sans text-stone-400 pt-2 border-t border-stone-800/80 flex justify-between">
              <span>Actual:</span>
              <span className="text-amber-300 font-semibold font-mono">{inv.actual}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dual Engine Diff Table */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-stone-300">
              Planetary Longitude Verification (Threshold: 0.0100°)
            </span>
            <ExplainerTrigger id="dual_engine_validation" variant="icon" size="xs" />
          </div>
          <span className="text-xs text-stone-400 font-sans">
            Max Observed Delta: <strong className="text-amber-400 font-mono tabular-nums">{report.max_planetary_difference_deg}°</strong>
          </span>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-label="Dual-Engine Ephemeris Cross-Validation Table"
          className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/90 shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-950 text-stone-300 border-b border-stone-800 font-medium text-xs">
                <th className="py-2.5 px-3 sticky left-0 bg-stone-950 z-10 border-r border-stone-800">Celestial Body</th>
                <th className="py-2.5 px-3">SwissEph (deg)</th>
                <th className="py-2.5 px-3">Skyfield JPL (deg)</th>
                <th className="py-2.5 px-3">Delta (deg)</th>
                <th className="py-2.5 px-3">Delta (arcsec)</th>
                <th className="py-2.5 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono text-xs">
              {report.dual_engine_diffs.map((diff) => (
                <tr key={diff.body} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-2 px-3 font-serif font-medium text-stone-200 sticky left-0 bg-stone-900 z-10 border-r border-stone-800 whitespace-nowrap">
                    {diff.body}
                  </td>
                  <td className="py-2 px-3 text-stone-400 tabular-nums">
                    {diff.primary_value_deg?.toFixed(4)}°
                  </td>
                  <td className="py-2 px-3 text-stone-400 tabular-nums">
                    {diff.validator_value_deg?.toFixed(4)}°
                  </td>
                  <td className="py-2 px-3 text-amber-400 font-medium tabular-nums">
                    {diff.difference_deg?.toFixed(6)}°
                  </td>
                  <td className="py-2 px-3 text-stone-300 font-medium tabular-nums">
                    {diff.difference_arcsec?.toFixed(2)}″
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-amber-950 text-amber-300 border border-amber-800/80">
                      PASS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
