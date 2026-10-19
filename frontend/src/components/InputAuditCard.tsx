import React from 'react';
import type { ChartResponse } from '../types';

interface Props {
  data: ChartResponse;
}

export const InputAuditCard: React.FC<Props> = ({ data }) => {
  const norm = data.birth_input_audit.normalized;
  const boundary = data.birth_input_audit.boundary_audit;
  const uncertClass = data.uncertainty_classification;

  return (
    <div className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-[#1b2331] gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
            02 / Time Normalization & Boundary Proximity Audit
          </span>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">
            Astronomical & Civil Time Coordinates
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-mono rounded bg-[#121721] text-slate-300 border border-[#1b2331]">
            IANA: {norm.timezone_name} ({norm.utc_offset_hours >= 0 ? `+${norm.utc_offset_hours}` : norm.utc_offset_hours}h)
          </span>
          <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${
            norm.is_dst ? 'bg-amber-950/70 text-amber-300 border-amber-800/80' : 'bg-[#121721] text-slate-400 border-[#1b2331]'
          }`}>
            DST: {norm.is_dst ? 'ACTIVE' : 'STANDARD'}
          </span>
        </div>
      </div>

      {/* Grid of Key Normalizations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3.5">
        {/* UTC Instant */}
        <div className="bg-[#080a0f] p-3 rounded-md border border-[#1b2331]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
            UTC Instant
          </span>
          <p className="text-xs font-mono font-semibold text-cyan-300 mt-1 truncate">
            {norm.utc_iso.replace('T', ' ').slice(0, 19)}Z
          </p>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
            JD: {norm.jd_ut.toFixed(4)}
          </span>
        </div>

        {/* Local Solar Times */}
        <div className="bg-[#080a0f] p-3 rounded-md border border-[#1b2331]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
            Solar Time & EoT
          </span>
          <p className="text-xs font-mono font-semibold text-amber-300 mt-1">
            LAST: {norm.last}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
            LMST: {norm.lmst} ({norm.equation_of_time_minutes > 0 ? `+${norm.equation_of_time_minutes}` : norm.equation_of_time_minutes}m)
          </span>
        </div>

        {/* Sunrise & Sunset */}
        <div className="bg-[#080a0f] p-3 rounded-md border border-[#1b2331]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
            Horizon & Sect
          </span>
          <p className="text-xs font-mono font-semibold text-emerald-300 mt-1">
            Rise: {norm.sunrise || 'N/A'}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
            Set: {norm.sunset || 'N/A'}
          </span>
        </div>

        {/* Boundary Audit */}
        <div className="bg-[#080a0f] p-3 rounded-md border border-[#1b2331]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
            Boundary Distances
          </span>
          <p className="text-xs font-mono font-semibold text-purple-300 mt-1">
            Asc Cusp: {data.astronomical_base.boundary_distances.tropical_asc_to_cusp_deg}°
          </p>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
            BaZi Shift: {boundary.bazi_two_hour_boundary_distance_mins}m
          </span>
        </div>
      </div>

      {/* Time-Uncertainty Ensemble Box */}
      <div className="mt-4 p-3.5 rounded-md bg-[#080a0f] border border-[#1b2331]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#1b2331] gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-200">
              Time-Uncertainty Ensemble (T− / T / T+)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[11px] font-mono rounded border ${
              uncertClass.tropical_ascendant === 'STABLE'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800/80'
                : 'bg-amber-950 text-amber-300 border-amber-800/80'
            }`}>
              Tropical Asc: {uncertClass.tropical_ascendant}
            </span>
            <span className={`px-2 py-0.5 text-[11px] font-mono rounded border ${
              uncertClass.sidereal_ascendant === 'STABLE'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800/80'
                : 'bg-amber-950 text-amber-300 border-amber-800/80'
            }`}>
              Lahiri Asc: {uncertClass.sidereal_ascendant}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2.5">
          {uncertClass.ensemble_alternatives.map((alt) => (
            <div
              key={alt.label}
              className={`p-2.5 rounded border text-xs ${
                alt.label === 'T'
                  ? 'bg-[#121721] border-cyan-800/60 text-slate-200'
                  : 'bg-[#0b0e14] border-[#1b2331] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-mono font-semibold text-xs text-slate-200">
                <span>{alt.label} ({alt.offset_minutes >= 0 ? `+${alt.offset_minutes}` : alt.offset_minutes} min)</span>
                <span className="text-[10px] font-normal text-slate-500">
                  {alt.label === 'T' ? 'Reported Instant' : 'Interval Boundary'}
                </span>
              </div>
              <div className="mt-1.5 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tropical Asc:</span>
                  <span className="text-slate-200 font-medium">{alt.tropical_asc_sign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lahiri Asc:</span>
                  <span className="text-slate-200 font-medium">{alt.sidereal_asc_sign}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
