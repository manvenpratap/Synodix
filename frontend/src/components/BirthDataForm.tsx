import React, { useState } from 'react';
import type { BirthInput, Preset } from '../types';
import {
  Star,
  FlaskConical,
  Landmark,
  Palette,
  Sparkles,
  Trophy,
  Clapperboard,
  Users,
  PenTool,
  Search,
  X,
  Bookmark,
  Trash2,
  Check
} from 'lucide-react';
import { getSavedProfiles, saveProfile, deleteProfile, UserProfile } from '../utils/vault';

interface Props {
  onCompute: (input: BirthInput, name?: string) => void;
  isLoading: boolean;
  samplePresets: Preset[];
}

const FEATURED_IDS = [
  'steve-jobs', 'albert-einstein', 'carl-jung', 'frida-kahlo', 'muhammad-ali',
  'queen-elizabeth-ii', 'winston-churchill', 'bruce-lee', 'barack-obama', 'bill-gates'
];

const CATEGORIES = [
  { id: 'featured', label: 'Featured', count: 10, icon: Star },
  { id: 'science_tech', label: 'Science & Tech', count: 18, icon: FlaskConical },
  { id: 'leaders_statesmen', label: 'Leaders', count: 18, icon: Landmark },
  { id: 'arts_music_lit', label: 'Arts & Music', count: 20, icon: Palette },
  { id: 'philosophy_spirituality', label: 'Philosophy', count: 14, icon: Sparkles },
  { id: 'sports_athletics', label: 'Sports & Martial', count: 16, icon: Trophy },
  { id: 'cinema_business', label: 'Cinema & Media', count: 14, icon: Clapperboard },
  { id: 'all', label: 'All 100 Records', count: 100, icon: Users },
];

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

  const [selectedPresetId, setSelectedPresetId] = useState<string>('steve-jobs');
  const [selectedCategory, setSelectedCategory] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>(() => getSavedProfiles());
  const [profileSaveName, setProfileSaveName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const categories = [
    ...(savedProfiles.length > 0 ? [{ id: 'vault', label: 'My Vault', count: savedProfiles.length, icon: Bookmark }] : []),
    ...CATEGORIES,
  ];

  const activePreset = samplePresets.find((p) => p.id === selectedPresetId);

  const displayedProfiles = selectedCategory === 'vault'
    ? savedProfiles.map((sp) => ({
        id: sp.id,
        name: sp.name,
        tag: `Saved • ${sp.city_name}`,
        rodden_rating: sp.time_certainty === 'exact' ? 'AA' : 'A',
        birth_date: sp.birth_date,
        birth_time: sp.birth_time,
        time_certainty: sp.time_certainty,
        latitude: sp.latitude,
        longitude: sp.longitude,
        city_name: sp.city_name,
        country_name: sp.country_name,
        gender: sp.gender,
        note: `Custom Profile (${sp.city_name}, ${sp.country_name})`
      })).filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return p.name.toLowerCase().includes(q) || p.city_name.toLowerCase().includes(q);
      })
    : samplePresets.filter((p) => {
        let matchesCategory = true;
        if (selectedCategory === 'featured') {
          matchesCategory = FEATURED_IDS.includes(p.id);
        } else if (selectedCategory !== 'all') {
          matchesCategory = p.category === selectedCategory;
        }

        if (!matchesCategory) return false;
        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q)) ||
          p.city_name.toLowerCase().includes(q) ||
          p.country_name.toLowerCase().includes(q)
        );
      });

  const handleSaveToVault = () => {
    const name = profileSaveName.trim() || formData.city_name || 'My Chart';
    const saved = saveProfile({
      name,
      category: 'personal',
      ...formData,
    });
    const updated = getSavedProfiles();
    setSavedProfiles(updated);
    setSelectedPresetId(saved.id);
    setSelectedCategory('vault');
    setIsSaving(false);
    setProfileSaveName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDeleteSavedProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteProfile(id);
    setSavedProfiles(updated);
    if (selectedPresetId === id) {
      setSelectedPresetId('steve-jobs');
    }
  };

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPresetId(preset.id);
    const newForm: BirthInput = {
      birth_date: preset.birth_date,
      birth_time: preset.birth_time,
      time_certainty: preset.time_certainty,
      custom_uncertainty_mins: null,
      latitude: preset.latitude,
      longitude: preset.longitude,
      city_name: preset.city_name,
      country_name: preset.country_name,
      gender: preset.gender,
    };
    setFormData(newForm);
    // Trigger immediate calculation on click
    onCompute(newForm, preset.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompute(formData, 'Custom Subject');
  };

  return (
    <div className="bg-[#0d1118] border border-[#1b2331] rounded-lg p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#1b2331] gap-3">
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

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 self-start md:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>100 Verified Historical Records (Rodden AA / A)</span>
        </div>
      </div>

      {/* 100-Personality One-Click Benchmark Gallery */}
      <div className="py-3 border-b border-[#1b2331]">
        {/* Controls: Categories & Search */}
        <div className="flex flex-col gap-2.5 mb-2.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-xs'
                        : 'bg-[#10151f] hover:bg-[#161d2b] text-slate-300 hover:text-slate-100 border border-[#1b2331]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`} />
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Manual Custom Button */}
            <button
              type="button"
              onClick={() => setSelectedPresetId('custom')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs rounded-md font-mono transition-colors cursor-pointer self-start lg:self-auto whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] ${
                selectedPresetId === 'custom'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-xs'
                  : 'text-slate-300 hover:text-slate-100 border border-[#1b2331] bg-[#0c1017] hover:bg-[#141b27]'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-cyan-400" />
              <span>Custom Manual Input</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="flex items-center justify-between gap-3 bg-[#0a0d14] px-3 py-1.5 rounded-lg border border-[#1b2331] focus-within:border-cyan-500/80 transition-colors">
            <div className="flex items-center gap-2 flex-1">
              <label htmlFor="personality_search" className="sr-only">
                Search historical figures
              </label>
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                id="personality_search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, discovery, or city (e.g. Einstein, Jordan, Kahlo, Curie, London)..."
                aria-label="Search 100 historical figures by name, field, or city"
                className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-sans py-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                  className="text-slate-400 hover:text-slate-200 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
              Showing {displayedProfiles.length} {selectedCategory === 'vault' ? 'saved profiles' : 'figures'}
            </span>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-[290px] overflow-y-auto pr-1">
          {displayedProfiles.length === 0 ? (
            <div className="col-span-full py-8 text-center bg-[#090c12] rounded border border-dashed border-[#1b2331] text-xs text-slate-400">
              {selectedCategory === 'vault' ? (
                <div>
                  <Bookmark className="w-6 h-6 mx-auto mb-2 text-slate-500 opacity-60" />
                  <p className="font-semibold text-slate-300">Your Local Vault is Empty</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enter birth details below and click &quot;Save to My Vault&quot; to store your private charts locally.
                  </p>
                </div>
              ) : (
                <p>No matching figures found for &quot;{searchQuery}&quot;</p>
              )}
            </div>
          ) : (
            displayedProfiles.map((p) => {
              const isSelected = selectedPresetId === p.id;
              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => handlePresetSelect(p as any)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePresetSelect(p as any);
                    }
                  }}
                  className={`flex flex-col text-left p-2.5 rounded-lg border transition-all cursor-pointer relative group min-h-[58px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500/80 shadow-sm shadow-cyan-950 text-slate-100 ring-1 ring-cyan-500/40'
                      : 'bg-[#10151f] hover:bg-[#151c2a] border-[#1b2331] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-xs font-semibold truncate text-slate-100">
                      {p.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold ${
                          p.rodden_rating === 'AA'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                        }`}
                      >
                        {p.rodden_rating || 'AA'}
                      </span>
                      {selectedCategory === 'vault' && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSavedProfile(e, p.id)}
                          className="text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer transition-colors"
                          title="Delete from Vault"
                          aria-label={`Delete ${p.name} from vault`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  {p.tag && (
                    <span className="text-[10px] text-cyan-400/80 truncate mt-0.5 font-sans">
                      {p.tag}
                    </span>
                  )}
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">
                    {p.birth_date} • {p.city_name}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Active Profile Info Banner */}
        {activePreset && selectedPresetId !== 'custom' && (
          <div className="mt-2.5 px-3 py-2 rounded bg-[#0a0e16] border border-[#1b2331] flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-300 gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-cyan-300 font-semibold">{activePreset.name}:</span>
              <span className="text-slate-400">{activePreset.note}</span>
            </div>
            <span className="text-slate-500 text-[10px]">
              Tweak fields below to test time uncertainty
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Date of Birth */}
          <div>
            <label htmlFor="birth_date" className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1">
              Date of Birth (Gregorian Civil)
            </label>
            <input
              id="birth_date"
              type="date"
              required
              value={formData.birth_date}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, birth_date: e.target.value });
              }}
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
            />
          </div>

          {/* Time of Birth */}
          <div>
            <label htmlFor="birth_time" className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1">
              Time (24-Hour Local Civil)
            </label>
            <input
              id="birth_time"
              type="time"
              step="60"
              value={formData.birth_time}
              disabled={formData.time_certainty === 'unknown'}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, birth_time: e.target.value });
              }}
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          {/* Time Certainty */}
          <div>
            <label htmlFor="time_certainty" className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1">
              Time Certainty / Record Quality
            </label>
            <select
              id="time_certainty"
              value={formData.time_certainty}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({
                  ...formData,
                  time_certainty: e.target.value as BirthInput['time_certainty'],
                });
              }}
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors cursor-pointer"
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
            <label htmlFor="city_name" className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1">
              City
            </label>
            <input
              id="city_name"
              type="text"
              required
              value={formData.city_name}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, city_name: e.target.value });
              }}
              placeholder="City name"
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country_name" className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1">
              Country
            </label>
            <input
              id="country_name"
              type="text"
              required
              value={formData.country_name}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, country_name: e.target.value });
              }}
              placeholder="Country"
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
            />
          </div>

          {/* Coordinates */}
          <div>
            <label htmlFor="latitude" className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1">
              Decimal Lat / Lon
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                id="latitude"
                type="number"
                step="0.0001"
                min="-90"
                max="90"
                required
                aria-label="Decimal Latitude (-90 to 90 degrees)"
                value={formData.latitude}
                onChange={(e) => {
                  setSelectedPresetId('custom');
                  setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 });
                }}
                className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-2 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
              />
              <input
                id="longitude"
                type="number"
                step="0.0001"
                min="-180"
                max="180"
                required
                aria-label="Decimal Longitude (-180 to 180 degrees)"
                value={formData.longitude}
                onChange={(e) => {
                  setSelectedPresetId('custom');
                  setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 });
                }}
                className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-2 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1">
              Gender (BaZi / Tibetan Cycle)
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => {
                setSelectedPresetId('custom');
                setFormData({ ...formData, gender: e.target.value as BirthInput['gender'] });
              }}
              className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors cursor-pointer"
            >
              <option value="male">Male (Da Yun forward/backward rule)</option>
              <option value="female">Female (Da Yun forward/backward rule)</option>
              <option value="neutral">Neutral / Unspecified</option>
            </select>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1b2331]/80">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {isSaving ? (
              <div className="flex items-center gap-1.5 bg-[#0a0d14] p-1 rounded-md border border-cyan-800">
                <input
                  type="text"
                  placeholder="Profile Name (e.g. My Chart)"
                  value={profileSaveName}
                  onChange={(e) => setProfileSaveName(e.target.value)}
                  className="bg-transparent text-xs text-slate-100 px-2 py-1 focus:outline-none w-40 font-sans"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveToVault}
                  className="px-2.5 py-1 text-xs bg-cyan-700 hover:bg-cyan-600 text-white rounded font-medium cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsSaving(false)}
                  className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                  aria-label="Cancel save"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSaving(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs rounded-md border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  saveSuccess
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-[#10151f] hover:bg-[#182233] text-slate-300 hover:text-cyan-300 border-[#1b2331]'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved to Vault!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Save to My Vault</span>
                  </>
                )}
              </button>
            )}
            <span className="text-[11px] font-mono text-slate-400 hidden lg:inline">
              NASA JPL DE421 active
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] bg-cyan-700 hover:bg-cyan-600 active:scale-[0.98] text-white font-medium text-xs rounded border border-cyan-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f]"
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
