import React from 'react';
import { ChartResponse } from '../types';
import { Sun, Moon, Clock, ShieldCheck, Compass, AlertTriangle, Layers } from 'lucide-react';

interface Props {
  data: ChartResponse;
}

export const InputAuditCard: React.FC<Props> = ({ data }) => {
  const norm = data.birth_input_audit.normalized;
  const raw = data.birth_input_audit.raw_input;
  const boundary = data.birth_input_audit.boundary_audit;
  const ensemble = data.birth_input_audit.uncertainty_ensemble;
  const uncertClass = data.uncertainty_classification;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <span className="px-2 py-0.5 text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/70 border border-amber-800 rounded-full uppercase">
            Step 2 • Input Normalization & Audit
          </span>
          <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            Astronomical & Civil Time Coordinates
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            IANA: {norm.timezone_name} ({norm.utc_offset_hours >= 0 ? `+${norm.utc_offset_hours}` : norm.utc_offset_hours}h)
          </span>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
            norm.is_dst ? 'bg-amber-950/70 text-amber-400 border-amber-800' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            DST: {norm.is_dst ? 'ACTIVE' : 'STANDARD'}
          </span>
        </div>
      </div>

      {/* Grid of Key Normalizations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {/* UTC Instant */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> UTC Instant
          </span>
          <p className="text-sm font-mono text-cyan-300 mt-1 truncate">
            {norm.utc_iso.replace('T', ' ').slice(0, 19)}Z
          </p>
          <span className="text-[10px] text-slate-500 font-mono">
            JD: {norm.jd_ut.toFixed(4)}
          </span>
        </div>

        {/* Local Solar Times */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-400" /> Solar Times (EoT)
          </span>
          <p className="text-sm font-mono text-amber-300 mt-1">
            LAST: {norm.last}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            LMST: {norm.lmst} ({norm.equation_of_time_minutes > 0 ? `+${norm.equation_of_time_minutes}` : norm.equation_of_time_minutes}m)
          </span>
        </div>

        {/* Sunrise & Sunset */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-400" /> Horizon Sect
          </span>
          <p className="text-sm font-mono text-emerald-300 mt-1">
            Sunrise {norm.sunrise || 'N/A'}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            Sunset {norm.sunset || 'N/A'}
          </span>
        </div>

        {/* Boundary Distances */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-400" /> Boundary Audit
          </span>
          <p className="text-sm font-mono text-purple-300 mt-1">
            Cusp Dist: {data.astronomical_base.boundary_distances.tropical_asc_to_cusp_deg}°
          </p>
          <span className="text-[10px] text-slate-400 font-mono">
            BaZi Shift: {boundary.bazi_two_hour_boundary_distance_mins}m to next pillar
          </span>
        </div>
      </div>

      {/* Time-Uncertainty Ensemble Box */}
      <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-white">
              Time-Uncertainty Ensemble (T− / T / T+)
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Classifications:</span>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
              uncertClass.tropical_ascendant === 'STABLE'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-amber-950 text-amber-300 border-amber-800'
            }`}>
              Tropical Asc: {uncertClass.tropical_ascendant}
            </span>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
              uncertClass.sidereal_ascendant === 'STABLE'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-amber-950 text-amber-300 border-amber-800'
            }`}>
              Lahiri Asc: {uncertClass.sidereal_ascendant}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          {uncertClass.ensemble_alternatives.map((alt, idx) => (
            <div
              key={alt.label}
              className={`p-3 rounded-lg border text-xs ${
                alt.label === 'T'
                  ? 'bg-cyan-950/30 border-cyan-800/70 text-cyan-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-mono font-bold text-sm">
                <span>{alt.label} ({alt.offset_minutes >= 0 ? `+${alt.offset_minutes}` : alt.offset_minutes} min)</span>
                <span className="text-xs font-normal text-slate-400">
                  {alt.label === 'T' ? 'Reported Instant' : 'Interval Boundary'}
                </span>
              </div>
              <div className="mt-2 space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tropical Asc:</span>
                  <span className="text-white font-medium">{alt.tropical_asc_sign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sidereal Asc:</span>
                  <span className="text-white font-medium">{alt.sidereal_asc_sign}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
