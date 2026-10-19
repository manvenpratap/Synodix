import React, { useState } from 'react';
import { BirthInput, Preset } from '../types';
import { Calendar, Clock, MapPin, User, Compass, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold tracking-wider text-cyan-400 bg-cyan-950/70 border border-cyan-800 rounded-full uppercase">
              Step 1 • Birth Data
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Isolated Calculation Standard
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Birth Record & Uncertainty Input</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Preserves temporal uncertainty across Jyotisha, BaZi, Western, Zi Wei, Maya, and Tibetan systems.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 whitespace-nowrap font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {samplePresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetSelect(p)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-150 whitespace-nowrap ${
                selectedPresetId === p.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedPresetId('custom')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-150 whitespace-nowrap ${
              selectedPresetId === 'custom'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Date of Birth (Civil)
            </label>
            <input
              type="date"
              required
              value={formData.birth_date}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, birth_date: e.target.value });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Time of Birth */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time (24-Hour Local)
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
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            />
          </div>

          {/* Time Certainty */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Time Certainty / Record
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
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            >
              <option value="exact">Exact (Certificate / Hospital record, ±2m)</option>
              <option value="rounded_15">Rounded to 15m (Family memory, ±15m)</option>
              <option value="approx_30">Approximate (Part of day, ±30m)</option>
              <option value="unknown">Unknown Time (Date-stable charts only)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> City
            </label>
            <input
              type="text"
              required
              value={formData.city_name}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, city_name: e.target.value });
              }}
              placeholder="e.g. San Francisco"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
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
              placeholder="e.g. USA"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Latitude & Longitude */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" /> Latitude / Longitude
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
                placeholder="Lat"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
                placeholder="Lon"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Gender (BaZi & Tibetan)
            </label>
            <select
              value={formData.gender}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, gender: e.target.value as BirthInput['gender'] });
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            >
              <option value="male">Male (Da Yun forward/backward rule)</option>
              <option value="female">Female (Da Yun forward/backward rule)</option>
              <option value="neutral">Neutral / Unspecified</option>
            </select>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Independent JPL DE421 validator ready • Zero rectification assumption
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-600/30 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Calculating Across 6 Cultures & JPL Validator...</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-cyan-200" />
                <span>Compute, Verify & Synthesize Six-Culture Chart</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
