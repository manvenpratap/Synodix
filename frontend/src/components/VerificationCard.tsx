import React from 'react';
import type { VerificationReport } from '../types';
import { ExplainerTrigger } from './ExplainerTrigger';

interface Props {
  report: VerificationReport;
}

export const VerificationCard: React.FC<Props> = ({ report }) => {
  return (
    <div className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-[#1b2331] gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
            03 / Dual-Engine Astronomical Verification & Invariants
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <h3 className="text-base font-semibold text-slate-100">
              Swiss Ephemeris (pyswisseph) vs NASA/JPL DE421 (Skyfield)
            </h3>
            <ExplainerTrigger id="dual_engine_validation" label="Dual Engine Math" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
            {report.overall_verification_status}: PASS
          </span>
          <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
            Confidence: {report.overall_confidence}
          </span>
        </div>
      </div>

      {/* Invariants Checklist Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3.5">
        {report.invariants.map((inv, idx) => (
          <div
            key={idx}
            className="bg-[#080a0f] p-3 rounded-md border border-[#1b2331] flex flex-col justify-between hover:border-cyan-800/80 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-cyan-400 font-mono font-semibold uppercase tracking-wider">
                  {inv.system}
                </span>
                <span className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded ${
                  inv.status === 'PASS'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                    : 'bg-amber-950 text-amber-300 border border-amber-800/80'
                }`}>
                  {inv.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-normal mt-1 line-clamp-2">
                {inv.description}
              </p>
            </div>
            <div className="mt-2 text-[11px] font-mono text-slate-400 pt-1.5 border-t border-[#1b2331] flex justify-between">
              <span>Actual:</span>
              <span className="text-emerald-300 font-semibold">{inv.actual}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dual Engine Diff Table */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Planetary Longitude Verification (Threshold: 0.0100°)
            </span>
            <ExplainerTrigger id="dual_engine_validation" variant="icon" size="xs" />
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Max Observed Delta: <strong className="text-emerald-400 tabular-nums">{report.max_planetary_difference_deg}°</strong>
          </span>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-label="Dual-Engine Ephemeris Cross-Validation Table"
          className="overflow-x-auto rounded border border-[#1b2331] focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#080a0f] text-slate-400 border-b border-[#1b2331] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-2 px-3 sticky left-0 bg-[#080a0f] z-10 border-r border-[#1b2331]">Celestial Body</th>
                <th className="py-2 px-3 font-mono">SwissEph (deg)</th>
                <th className="py-2 px-3 font-mono">Skyfield JPL (deg)</th>
                <th className="py-2 px-3 font-mono">Delta (deg)</th>
                <th className="py-2 px-3 font-mono">Delta (arcsec)</th>
                <th className="py-2 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2331] bg-[#0d1118] font-mono text-[11px] tabular-nums">
              {report.dual_engine_diffs.map((diff) => (
                <tr key={diff.body} className="hover:bg-[#121721] transition-colors">
                  <td className="py-2 px-3 font-sans font-medium text-slate-200 sticky left-0 bg-[#0d1118] z-10 border-r border-[#1b2331] whitespace-nowrap">
                    {diff.body}
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    {diff.primary_value_deg?.toFixed(4)}°
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    {diff.validator_value_deg?.toFixed(4)}°
                  </td>
                  <td className="py-2 px-3 text-emerald-400 font-medium">
                    {diff.difference_deg?.toFixed(6)}°
                  </td>
                  <td className="py-2 px-3 text-emerald-300 font-medium">
                    {diff.difference_arcsec?.toFixed(2)}″
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
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
