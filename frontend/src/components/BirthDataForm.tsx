import React, { useState } from 'react';
import type { BirthInput, Preset } from '../types';

interface Props {
  onCompute: (input: BirthInput) => void;
  isLoading: boolean;
  samplePresets: Preset[];
}

export const BirthDataForm: React.FC<Props> = ({ onCompute, isLoading, samplePresets }) => {
  const [formData, setFormData] = useState<BirthInput>({
    birth_date: '1955-02-24',
    birth_time: '19:15',
    time_certainty: 'exact',
    custom_uncertainty_mins: null,
    latitude: 37.7749,
    longitude: -122.4194,
    city_name: 'San Francisco',
    country_name: 'USA',
    gender: 'male',
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string>('sample-1');

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPresetId(preset.id);
    setFormData({
      birth_date: preset.birth_date,
      birth_time: preset.birth_time,
      time_certainty: preset.time_certainty,
      custom_uncertainty_mins: null,
      latitude: preset.latitude,
      longitude: preset.longitude,
      city_name: preset.city_name,
      country_name: preset.country_name,
      gender: preset.gender,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompute(formData);
  };

  return (
    <div className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-5">
      {/* Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1b2331] gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              01 / Birth Record & Temporal Bounds
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[10px] text-slate-400 font-mono">
              Zero Rectification Standard
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-slate-100 mt-1">
            Astronomical Coordinate & Uncertainty Input
          </h2>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider mr-1">
            Reference Records:
          </span>
          {samplePresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetSelect(p)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedPresetId === p.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
                  : 'bg-[#121721] hover:bg-[#18202c] text-slate-300 border border-[#1b2331]'
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedPresetId('custom')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedPresetId === 'custom'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80'
                : 'bg-[#121721] hover:bg-[#18202c] text-slate-300 border border-[#1b2331]'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Date of Birth */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
              Date of Birth (Gregorian Civil)
            </label>
            <input
              type="date"
              required
              value={formData.birth_date}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, birth_date: e.target.value });
              }}
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Time of Birth */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
              Time (24-Hour Local Civil)
            </label>
            <input
              type="time"
              step="60"
              value={formData.birth_time}
              disabled={formData.time_certainty === 'unknown'}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, birth_time: e.target.value });
              }}
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          {/* Time Certainty */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
              Time Certainty / Record Quality
            </label>
            <select
              value={formData.time_certainty}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({
                  ...formData,
                  time_certainty: e.target.value as BirthInput['time_certainty'],
                });
              }}
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
            >
              <option value="exact">Exact (Certificate / Hospital record, ±2m)</option>
              <option value="rounded_15">Rounded to 15m (Family memory / registry, ±15m)</option>
              <option value="approx_30">Approximate (Time of day, ±30m)</option>
              <option value="unknown">Unknown Time (Date-stable methods only)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* City */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
              City
            </label>
            <input
              type="text"
              required
              value={formData.city_name}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, city_name: e.target.value });
              }}
              placeholder="City name"
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
              Country
            </label>
            <input
              type="text"
              required
              value={formData.country_name}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, country_name: e.target.value });
              }}
              placeholder="Country"
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Coordinates */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
              Decimal Lat / Lon
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.0001"
                required
                value={formData.latitude}
                onChange={(e) => {
                  setSelectedPresetId('custom');
                  setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 });
                }}
                className="w-full bg-[#080a0f] border border-[#1b2331] rounded px-2 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <input
                type="number"
                step="0.0001"
                required
                value={formData.longitude}
                onChange={(e) => {
                  setSelectedPresetId('custom');
                  setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 });
                }}
                className="w-full bg-[#080a0f] border border-[#1b2331] rounded px-2 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
              Gender (BaZi / Tibetan Cycle)
            </label>
            <select
              value={formData.gender}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, gender: e.target.value as BirthInput['gender'] });
              }}
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
            >
              <option value="male">Male (Da Yun forward/backward rule)</option>
              <option value="female">Female (Da Yun forward/backward rule)</option>
              <option value="neutral">Neutral / Unspecified</option>
            </select>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1b2331]/80">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            NASA JPL DE421 independent validator active • 6-culture deterministic pipeline
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2 bg-cyan-700 hover:bg-cyan-600 text-white font-medium text-xs rounded border border-cyan-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Evaluating Dual Engines & Uncertainty Ensemble...</span>
              </>
            ) : (
              <span>Compute, Verify & Synthesize Chart</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
