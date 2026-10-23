import React, { useState } from 'react';
import type { ChartResponse } from '../types';
import { ExplainerTrigger } from './ExplainerTrigger';

interface Props {
  data: ChartResponse;
}

export const InputAuditCard: React.FC<Props> = ({ data }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const norm = data.birth_input_audit.normalized;
  const boundary = data.birth_input_audit.boundary_audit;
  const uncertClass = data.uncertainty_classification;

  return (
    <div className="machined-bezel p-4 sm:p-5 rounded-2xl relative shadow-xl">
      <div className="reticle-corner-tl" />
      <div className="reticle-corner-tr" />
      <div className="reticle-corner-bl" />
      <div className="reticle-corner-br" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-[#1b2331] gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
              02 / Time Normalization & Boundary Proximity Audit
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <h3 className="text-base font-semibold text-slate-100">
                Astronomical & Civil Time Coordinates
              </h3>
              <ExplainerTrigger id="time_normalization_eot" label="Solar Time Mechanics" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2">
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-[#121721] text-slate-300 border border-[#1b2331]">
              IANA: {norm.timezone_name} ({norm.utc_offset_hours >= 0 ? `+${norm.utc_offset_hours}` : norm.utc_offset_hours}h)
            </span>
            <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${
              norm.is_dst ? 'bg-amber-950/70 text-amber-300 border-amber-800/80' : 'bg-[#121721] text-slate-400 border-[#1b2331]'
            }`}>
              DST: {norm.is_dst ? 'ACTIVE' : 'STANDARD'}
            </span>
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-expanded={isMobileOpen}
              aria-controls="input-audit-collapsible-content"
              aria-label={isMobileOpen ? 'Hide Input Audit Invariants' : 'Expand Input Audit Invariants'}
              className="md:hidden text-xs font-mono text-cyan-300 hover:text-cyan-200 font-medium cursor-pointer py-1.5 px-3 rounded-lg bg-[#121824] border border-cyan-800/80 min-h-[44px] flex items-center justify-center active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {isMobileOpen ? 'Hide Full Audit ▲' : 'Audit Invariants (4) ▼'}
            </button>
          </div>
        </div>

        {/* Collapsible Content Area (Always visible on Desktop, togglable on Mobile) */}
        <div
          id="input-audit-collapsible-content"
          className={`mt-3.5 space-y-4 ${isMobileOpen ? 'block' : 'hidden md:block'}`}
        >
          {/* Grid of Key Normalizations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* UTC Instant */}
            <div className="p-3 border-l-2 border-l-cyan-500/70 border-y border-r border-[#1b2331]/80 bg-[#080a0f]/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono block">
                  UTC Instant
                </span>
                <ExplainerTrigger id="utc_instant_julian_day" variant="icon" size="xs" />
              </div>
              <p className="text-xs font-mono font-semibold text-cyan-300 mt-1 truncate">
                {norm.utc_iso.replace('T', ' ').slice(0, 19)}Z
              </p>
              <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                JD: {norm.jd_ut.toFixed(4)}
              </span>
            </div>

            {/* Local Solar Times */}
            <div className="p-3 border-l-2 border-l-amber-500/70 border-y border-r border-[#1b2331]/80 bg-[#080a0f]/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono block">
                  Solar Time & EoT
                </span>
                <ExplainerTrigger id="time_normalization_eot" variant="icon" size="xs" />
              </div>
              <p className="text-xs font-mono font-semibold text-amber-300 mt-1">
                LAST: {norm.last}
              </p>
              <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                LMST: {norm.lmst} ({norm.equation_of_time_minutes > 0 ? `+${norm.equation_of_time_minutes}` : norm.equation_of_time_minutes}m)
              </span>
            </div>

            {/* Sunrise & Sunset */}
            <div className="p-3 border-l-2 border-l-emerald-500/70 border-y border-r border-[#1b2331]/80 bg-[#080a0f]/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono block">
                  Horizon & Sect
                </span>
                <ExplainerTrigger id="western_sect" variant="icon" size="xs" />
              </div>
              <p className="text-xs font-mono font-semibold text-emerald-300 mt-1">
                Rise: {norm.sunrise || 'N/A'}
              </p>
              <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                Set: {norm.sunset || 'N/A'}
              </span>
            </div>

            {/* Boundary Audit */}
            <div className="p-3 border-l-2 border-l-purple-500/70 border-y border-r border-[#1b2331]/80 bg-[#080a0f]/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono block">
                  Boundary Distances
                </span>
                <ExplainerTrigger id="cusp_proximity_audit" variant="icon" size="xs" />
              </div>
              <p className="text-xs font-mono font-semibold text-purple-300 mt-1">
                Asc Cusp: {data.astronomical_base.boundary_distances.tropical_asc_to_cusp_deg}°
              </p>
              <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                BaZi Shift: {boundary.bazi_two_hour_boundary_distance_mins}m
              </span>
            </div>
          </div>

          {/* Time-Uncertainty Ensemble Box */}
          <div className="mt-4 pt-3.5 border-t border-[#1b2331]/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#1b2331]/80 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-slate-200">
                  Time-Uncertainty Ensemble (T− / T / T+)
                </span>
                <ExplainerTrigger id="cusp_proximity_audit" label="Why T-/T+ Exists" />
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
                  className={`p-2.5 border text-xs ${
                    alt.label === 'T'
                      ? 'bg-[#121721]/80 border-cyan-800/80 text-slate-200'
                      : 'bg-[#0b0e14]/60 border-[#1b2331] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-semibold text-xs text-slate-200">
                    <span>{alt.label} ({alt.offset_minutes >= 0 ? `+${alt.offset_minutes}` : alt.offset_minutes} min)</span>
                    <span className="text-[11px] font-normal text-slate-500">
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
    </div>
  );
};
