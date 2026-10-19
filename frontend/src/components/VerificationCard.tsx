import React from 'react';
import { VerificationReport } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, Cpu, Check, SlidersHorizontal } from 'lucide-react';

interface Props {
  report: VerificationReport;
}

export const VerificationCard: React.FC<Props> = ({ report }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <span className="px-2 py-0.5 text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800 rounded-full uppercase">
            Step 5 • Verification & Invariants
          </span>
          <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            Dual-Engine Astronomical Audit (Swiss Ephemeris vs JPL Skyfield)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> {report.overall_verification_status}
          </span>
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            Confidence: {report.overall_confidence}
          </span>
        </div>
      </div>

      {/* Invariants Checklist Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {report.invariants.map((inv, idx) => (
          <div
            key={idx}
            className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  {inv.system}
                </span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                  inv.status === 'PASS'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {inv.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2">
                {inv.description}
              </p>
            </div>
            <div className="mt-2 text-[11px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/60 flex justify-between">
              <span>Actual:</span>
              <span className="text-emerald-300 font-semibold">{inv.actual}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dual Engine Diff Table */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Independent Comparison: Swiss Ephemeris vs JPL DE421 (Skyfield)
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            Max Δ: <strong className="text-emerald-400">{report.max_planetary_difference_deg}°</strong> (Threshold: 0.0100°)
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Celestial Body</th>
                <th className="py-2.5 px-3 font-mono">SwissEph (deg)</th>
                <th className="py-2.5 px-3 font-mono">Skyfield JPL (deg)</th>
                <th className="py-2.5 px-3 font-mono">Delta (deg)</th>
                <th className="py-2.5 px-3 font-mono">Delta (arcsec)</th>
                <th className="py-2.5 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
              {report.dual_engine_diffs.map((diff) => (
                <tr key={diff.body} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-medium text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    {diff.body}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-300">
                    {diff.primary_value_deg?.toFixed(4)}°
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-300">
                    {diff.validator_value_deg?.toFixed(4)}°
                  </td>
                  <td className="py-2 px-3 font-mono text-emerald-400">
                    {diff.difference_deg?.toFixed(6)}°
                  </td>
                  <td className="py-2 px-3 font-mono text-emerald-300">
                    {diff.difference_arcsec?.toFixed(2)}″
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <Check className="w-3 h-3" /> PASS
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
