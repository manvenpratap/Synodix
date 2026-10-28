import React, { useState } from 'react';
import type { ChartResponse } from '../types';
import { ExplainerTrigger } from './ExplainerTrigger';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  data: ChartResponse;
}

export const InputAuditCard: React.FC<Props> = ({ data }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const norm = data.birth_input_audit.normalized;
  const boundary = data.birth_input_audit.boundary_audit;
  const uncertClass = data.uncertainty_classification;

  return (
    <div className="machined-bezel p-4 sm:p-5 rounded-2xl relative">
      <div className="reticle-corner-tl" />
      <div className="reticle-corner-tr" />
      <div className="reticle-corner-bl" />
      <div className="reticle-corner-br" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
        <div>
          <span className="text-xs text-amber-400 font-medium block">
            Section 2 · Time Normalization & Boundary Proximity Audit
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <h3 className="text-base font-semibold text-slate-100">
              Astronomical & Civil Time Coordinates
            </h3>
            <ExplainerTrigger id="time_normalization_eot" label="Solar Time Mechanics" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2">
          <span className="px-2 py-1 text-xs font-sans rounded bg-slate-900 text-slate-300 border border-slate-800">
            IANA: <span className="font-mono tabular-nums">{norm.timezone_name} ({norm.utc_offset_hours >= 0 ? `+${norm.utc_offset_hours}` : norm.utc_offset_hours}h)</span>
          </span>
          <span className={`px-2 py-1 text-xs font-sans font-medium rounded border ${
            norm.is_dst ? 'bg-amber-950/70 text-amber-300 border-amber-800/80' : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}>
            DST: {norm.is_dst ? 'ACTIVE' : 'STANDARD'}
          </span>
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-controls="input-audit-collapsible-content"
            aria-label={isMobileOpen ? 'Hide Input Audit Invariants' : 'Expand Input Audit Invariants'}
            className="md:hidden text-xs font-sans text-cyan-300 hover:text-cyan-200 font-medium cursor-pointer py-1.5 px-3 rounded-lg bg-slate-900 border border-cyan-800/80 min-h-[44px] inline-flex items-center justify-center gap-1.5 active:scale-95 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>{isMobileOpen ? 'Hide Full Audit' : 'Audit Invariants (4)'}</span>
            {isMobileOpen ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
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
          <div className="p-3 bg-slate-900/50 border-t border-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-sans font-medium block">
                UTC Instant
              </span>
              <ExplainerTrigger id="utc_instant_julian_day" variant="icon" size="xs" />
            </div>
            <p className="text-xs font-sans font-semibold text-cyan-300 mt-1 truncate">
              <span className="font-mono tabular-nums">{norm.utc_iso.replace('T', ' ').slice(0, 19)}</span>Z
            </p>
            <span className="text-xs text-slate-500 font-sans block mt-0.5">
              JD: <span className="font-mono tabular-nums">{norm.jd_ut.toFixed(4)}</span>
            </span>
          </div>

          {/* Local Solar Times */}
          <div className="p-3 bg-slate-900/50 border-t border-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-sans font-medium block">
                Solar Time & EoT
              </span>
              <ExplainerTrigger id="time_normalization_eot" variant="icon" size="xs" />
            </div>
            <p className="text-xs font-sans font-semibold text-amber-300 mt-1">
              LAST: <span className="font-mono tabular-nums">{norm.last}</span>
            </p>
            <span className="text-xs text-slate-500 font-sans block mt-0.5">
              LMST: <span className="font-mono tabular-nums">{norm.lmst}</span> (<span className="font-mono tabular-nums">{norm.equation_of_time_minutes > 0 ? `+${norm.equation_of_time_minutes}` : norm.equation_of_time_minutes}</span>m)
            </span>
          </div>

          {/* Sunrise & Sunset */}
          <div className="p-3 bg-slate-900/50 border-t border-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-sans font-medium block">
                Horizon & Sect
              </span>
              <ExplainerTrigger id="western_sect" variant="icon" size="xs" />
            </div>
            <p className="text-xs font-sans font-semibold text-emerald-300 mt-1">
              Rise: <span className="font-mono tabular-nums">{norm.sunrise || 'N/A'}</span>
            </p>
            <span className="text-xs text-slate-500 font-sans block mt-0.5">
              Set: <span className="font-mono tabular-nums">{norm.sunset || 'N/A'}</span>
            </span>
          </div>

          {/* Boundary Audit */}
          <div className="p-3 bg-slate-900/50 border-t border-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-sans font-medium block">
                Boundary Distances
              </span>
              <ExplainerTrigger id="cusp_proximity_audit" variant="icon" size="xs" />
            </div>
            <p className="text-xs font-sans font-semibold text-amber-300 mt-1">
              Asc Cusp: <span className="font-mono tabular-nums">{data.astronomical_base.boundary_distances.tropical_asc_to_cusp_deg}°</span>
            </p>
            <span className="text-xs text-slate-500 font-sans block mt-0.5">
              BaZi Shift: <span className="font-mono tabular-nums">{boundary.bazi_two_hour_boundary_distance_mins}</span>m
            </span>
          </div>
        </div>

        {/* Time-Uncertainty Ensemble Box */}
        <div className="mt-4 pt-3.5 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans font-semibold text-slate-200">
                Time-Uncertainty Ensemble (T− / T / T+)
              </span>
              <ExplainerTrigger id="cusp_proximity_audit" label="Why T-/T+ Exists" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-sans rounded border ${
                uncertClass.tropical_ascendant === 'STABLE'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800/80'
                  : 'bg-amber-950 text-amber-300 border-amber-800/80'
              }`}>
                Tropical Asc: {uncertClass.tropical_ascendant}
              </span>
              <span className={`px-2 py-1 text-xs font-sans rounded border ${
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
                className={`p-2.5 rounded-lg border text-xs font-sans ${
                  alt.label === 'T'
                    ? 'bg-slate-900/80 border-cyan-800/80 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-medium text-xs text-slate-200">
                  <span>{alt.label} <span className="font-mono tabular-nums">({alt.offset_minutes >= 0 ? `+${alt.offset_minutes}` : alt.offset_minutes} min)</span></span>
                  <span className="text-xs font-normal text-slate-500">
                    {alt.label === 'T' ? 'Reported Instant' : 'Interval Boundary'}
                  </span>
                </div>
                <div className="mt-1.5 space-y-1 text-xs font-sans">
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
