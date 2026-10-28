import React from 'react';
import type { VerificationReport } from '../types';
import { ExplainerTrigger } from './ExplainerTrigger';

interface Props {
  report: VerificationReport;
}

export const VerificationCard: React.FC<Props> = ({ report }) => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-lg p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-stone-800 gap-3">
        <div>
          <span className="text-xs text-emerald-400 font-medium block">
            Section 3 · Dual-Engine Astronomical Verification & Invariants
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <h3 className="text-base font-semibold text-stone-100">
              Swiss Ephemeris (pyswisseph) vs NASA/JPL DE421 (Skyfield)
            </h3>
            <ExplainerTrigger id="dual_engine_validation" label="Dual Engine Math" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-xs font-sans font-semibold rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
            <span className="font-mono">{report.overall_verification_status}</span>: PASS
          </span>
          <span className="px-2.5 py-0.5 text-xs font-sans font-medium rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
            Confidence: <span className="font-mono">{report.overall_confidence}</span>
          </span>
        </div>
      </div>

      {/* Invariants Checklist Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3.5">
        {report.invariants.map((inv, idx) => (
          <div
            key={idx}
            className="bg-stone-950 p-3 rounded-md border border-stone-800 flex flex-col justify-between hover:border-amber-700/80 hover:-translate-y-0.5 transition-colors motion-safe:transition-transform motion-reduce:transition-none duration-150 cursor-pointer shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-400 font-medium font-sans">
                  {inv.system}
                </span>
                <span className={`px-2 py-0.5 text-[11px] font-sans font-semibold rounded ${
                  inv.status === 'PASS'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                    : 'bg-amber-950 text-amber-300 border border-amber-800/80'
                }`}>
                  {inv.status}
                </span>
              </div>
              <p className="text-xs text-stone-300 font-normal mt-1 line-clamp-2">
                {inv.description}
              </p>
            </div>
            <div className="mt-2 text-[11px] font-sans text-stone-400 pt-1.5 border-t border-stone-800 flex justify-between">
              <span>Actual:</span>
              <span className="text-emerald-300 font-semibold font-mono">{inv.actual}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dual Engine Diff Table */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-stone-300">
              Planetary Longitude Verification (Threshold: 0.0100°)
            </span>
            <ExplainerTrigger id="dual_engine_validation" variant="icon" size="xs" />
          </div>
          <span className="text-[11px] text-stone-400 font-sans">
            Max Observed Delta: <strong className="text-emerald-400 font-mono tabular-nums">{report.max_planetary_difference_deg}°</strong>
          </span>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-label="Dual-Engine Ephemeris Cross-Validation Table"
          className="overflow-x-auto rounded border border-stone-800 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
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
            <tbody className="divide-y divide-stone-800 bg-stone-900 font-sans text-[11px]">
              {report.dual_engine_diffs.map((diff) => (
                <tr key={diff.body} className="hover:bg-stone-800 transition-colors">
                  <td className="py-2 px-3 font-sans font-medium text-stone-200 sticky left-0 bg-stone-900 z-10 border-r border-stone-800 whitespace-nowrap">
                    {diff.body}
                  </td>
                  <td className="py-2 px-3 text-stone-400 font-mono tabular-nums">
                    {diff.primary_value_deg?.toFixed(4)}°
                  </td>
                  <td className="py-2 px-3 text-stone-400 font-mono tabular-nums">
                    {diff.validator_value_deg?.toFixed(4)}°
                  </td>
                  <td className="py-2 px-3 text-emerald-400 font-medium font-mono tabular-nums">
                    {diff.difference_deg?.toFixed(6)}°
                  </td>
                  <td className="py-2 px-3 text-emerald-300 font-medium font-mono tabular-nums">
                    {diff.difference_arcsec?.toFixed(2)}″
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
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
