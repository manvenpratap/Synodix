import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BirthInput, Preset } from '../types';
import {
  Star,
  FlaskConical,
  Landmark,
  Palette,
  BookOpen,
  Trophy,
  Clapperboard,
  Users,
  PenTool,
  Search,
  X,
  Bookmark,
  Trash2,
  Check,
  MapPin,
  Compass,
  CheckCircle2,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { getSavedProfiles, saveProfile, deleteProfile, UserProfile } from '../utils/vault';
import { searchCitySuggestions, determineCoordinates, requestDeviceLocation, GeocodeResult } from '../utils/geocoding';

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
  { id: 'philosophy_spirituality', label: 'Philosophy', count: 14, icon: BookOpen },
  { id: 'sports_athletics', label: 'Sports & Martial', count: 16, icon: Trophy },
  { id: 'cinema_business', label: 'Cinema & Media', count: 14, icon: Clapperboard },
  { id: 'all', label: 'All 100 Records', count: 100, icon: Users },
];

export const BirthDataForm: React.FC<Props> = ({ onCompute, isLoading, samplePresets }) => {
  // Mode switcher: 'custom' for clean independent manual calibration, 'archive' for 100 benchmark titans
  const [activeMode, setActiveMode] = useState<'custom' | 'archive'>('custom');

  // Custom Chart Form State
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
  const [customSubjectName, setCustomSubjectName] = useState<string>('Custom Subject');

  // Titan Archive State
  const [selectedTitanId, setSelectedTitanId] = useState<string>('steve-jobs');
  const selectedTitan = samplePresets.find((p) => p.id === selectedTitanId) || samplePresets[0] || null;
  const [selectedCategory, setSelectedCategory] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Personal Vault State
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>(() => getSavedProfiles());
  const [profileSaveName, setProfileSaveName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // City & Geocoding Intelligence States
  const [citySuggestions, setCitySuggestions] = useState<GeocodeResult[]>([]);
  const [isCitySuggestionsOpen, setIsCitySuggestionsOpen] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
  const [coordStatus, setCoordStatus] = useState<'preset' | 'auto_resolved' | 'gps' | 'manual'>('preset');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const cityContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityContainerRef.current && !cityContainerRef.current.contains(e.target as Node)) {
        setIsCitySuggestionsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCitySuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleCityChange = async (val: string) => {
    setFormData((prev) => ({ ...prev, city_name: val }));

    if (val.trim().length >= 2) {
      const suggestions = await searchCitySuggestions(val);
      setCitySuggestions(suggestions);
      setIsCitySuggestionsOpen(suggestions.length > 0);
      setActiveSuggestionIndex(-1);
    } else {
      setCitySuggestions([]);
      setIsCitySuggestionsOpen(false);
    }
  };

  const handleSelectCity = (res: GeocodeResult) => {
    setFormData((prev) => ({
      ...prev,
      city_name: res.city,
      country_name: res.country,
      latitude: res.latitude,
      longitude: res.longitude,
    }));
    setCoordStatus('auto_resolved');
    setIsCitySuggestionsOpen(false);
    setCitySuggestions([]);
  };

  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isCitySuggestionsOpen || citySuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev < citySuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : citySuggestions.length - 1));
    } else if (e.key === 'Enter') {
      const targetIndex = activeSuggestionIndex >= 0 ? activeSuggestionIndex : 0;
      if (targetIndex < citySuggestions.length) {
        e.preventDefault();
        e.stopPropagation();
        handleSelectCity(citySuggestions[targetIndex]);
      }
    }
  };

  const handleCityBlur = async () => {
    setTimeout(async () => {
      if (formData.city_name.trim() && coordStatus === 'manual') {
        const match = await determineCoordinates(formData.city_name, formData.country_name);
        if (match) {
          setFormData((prev) => ({
            ...prev,
            latitude: match.latitude,
            longitude: match.longitude,
            country_name: prev.country_name || match.country,
          }));
          setCoordStatus('auto_resolved');
        }
      }
    }, 200);
  };

  const handleDetectLocation = async () => {
    setIsLocating(true);
    try {
      const coords = await requestDeviceLocation();
      setFormData((prev) => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
      setCoordStatus('gps');
    } catch (err: any) {
      alert(err.message || 'Unable to detect device location.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSaveToVault = () => {
    const name = profileSaveName.trim() || customSubjectName.trim() || formData.city_name || 'My Chart';
    saveProfile({
      name,
      category: 'personal',
      ...formData,
    });
    const updated = getSavedProfiles();
    setSavedProfiles(updated);
    setIsSaving(false);
    setProfileSaveName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDeleteSavedProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteProfile(id);
    setSavedProfiles(updated);
  };

  const handleLoadVaultProfile = (sp: UserProfile) => {
    setFormData({
      birth_date: sp.birth_date,
      birth_time: sp.birth_time,
      time_certainty: sp.time_certainty,
      custom_uncertainty_mins: sp.custom_uncertainty_mins,
      latitude: sp.latitude,
      longitude: sp.longitude,
      city_name: sp.city_name,
      country_name: sp.country_name,
      gender: sp.gender,
    });
    setCustomSubjectName(sp.name);
    setCoordStatus('preset');
  };

  const handleResetForm = () => {
    setFormData({
      birth_date: '2000-01-01',
      birth_time: '12:00',
      time_certainty: 'exact',
      custom_uncertainty_mins: null,
      latitude: 0,
      longitude: 0,
      city_name: '',
      country_name: '',
      gender: 'neutral',
    });
    setCustomSubjectName('New Subject');
    setCoordStatus('manual');
  };

  // Titan Selection Handlers
  const handleSelectTitan = (titan: Preset, andCompute = false) => {
    setSelectedTitanId(titan.id);
    const newForm: BirthInput = {
      birth_date: titan.birth_date,
      birth_time: titan.birth_time,
      time_certainty: titan.time_certainty,
      custom_uncertainty_mins: null,
      latitude: titan.latitude,
      longitude: titan.longitude,
      city_name: titan.city_name,
      country_name: titan.country_name,
      gender: titan.gender,
    };
    setFormData(newForm);
    setCustomSubjectName(titan.name);
    setCoordStatus('preset');
    if (andCompute) {
      onCompute(newForm, titan.name);
    }
  };

  const handleCustomizeTitan = (titan: Preset) => {
    handleSelectTitan(titan, false);
    setActiveMode('custom');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompute(formData, customSubjectName.trim() || 'Custom Subject');
  };

  // Filter Titans for Archive Mode
  const displayedTitans = samplePresets.filter((p) => {
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

  return (
    <div className="machined-bezel p-4 sm:p-6 rounded-2xl relative shadow-xl">
      <div className="reticle-corner-tl" />
      <div className="reticle-corner-tr" />
      <div className="reticle-corner-bl" />
      <div className="reticle-corner-br" />

        {/* Top Header & Independent Experience Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1b2331] gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              01 / Astrometric Calibration & Input
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 font-mono">
              {activeMode === 'custom' ? 'Clean Independent Workspace' : '100 Verified Historical Records'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-100 mt-1">
            {activeMode === 'custom' ? 'Custom Birth Chart Calibration' : 'Historical Titan Benchmark Library'}
          </h2>
        </div>

        {/* Clean Segmented Mode Switcher */}
        <div
          role="tablist"
          aria-label="Input Experience Switcher"
          className="relative flex items-center bg-[#070a0f] p-1 rounded-lg border border-[#1b2331] w-full sm:w-auto"
        >
          <button
            type="button"
            role="tab"
            id="tab-custom-mode"
            aria-selected={activeMode === 'custom'}
            aria-controls="panel-custom-mode"
            onClick={() => setActiveMode('custom')}
            className={`relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[38px] text-xs rounded-md font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              activeMode === 'custom'
                ? 'text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeMode === 'custom' && (
              <motion.div
                layoutId="active-experience-pill"
                className="absolute inset-0 bg-cyan-950/90 border border-cyan-700/80 rounded-md shadow-xs pointer-events-none"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <PenTool className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Custom Manual Input</span>
              <span className="sm:hidden">Custom Input</span>
            </span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-archive-mode"
            aria-selected={activeMode === 'archive'}
            aria-controls="panel-archive-mode"
            onClick={() => setActiveMode('archive')}
            className={`relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[38px] text-xs rounded-md font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              activeMode === 'archive'
                ? 'text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeMode === 'archive' && (
              <motion.div
                layoutId="active-experience-pill"
                className="absolute inset-0 bg-cyan-950/90 border border-cyan-700/80 rounded-md shadow-xs pointer-events-none"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Historical Titans (100)</span>
              <span className="sm:hidden">Titans (100)</span>
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPERIENCE 1: CLEAN & INDEPENDENT CUSTOM MANUAL CALIBRATION               */}
      {/* ========================================================================= */}
      {activeMode === 'custom' ? (
        <div
          id="panel-custom-mode"
          role="tabpanel"
          aria-labelledby="tab-custom-mode"
          tabIndex={0}
          className="pt-3 space-y-4 focus:outline-none"
        >
          {/* Vault Quick Access & Workspace Sub-header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1b2331]/70 gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <span className="text-xs font-mono text-slate-300 font-medium">
                Distraction-Free Telemetry Studio
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                WGS-84 Standards & Dual-Engine Verification
              </span>
            </div>

            {/* My Vault Quick Load Bar */}
            {savedProfiles.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-cyan-400" />
                  Vault ({savedProfiles.length}):
                </span>
                <div className="flex items-center gap-1 overflow-x-auto max-w-[340px] sm:max-w-none scrollbar-thin">
                  {savedProfiles.map((sp) => (
                    <div
                      key={sp.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#10151f] hover:bg-[#161f2e] border border-[#1b2331] text-slate-300 transition-colors shrink-0"
                    >
                      <button
                        type="button"
                        onClick={() => handleLoadVaultProfile(sp)}
                        className="hover:text-cyan-300 cursor-pointer"
                        title={`Load ${sp.name} (${sp.city_name})`}
                      >
                        {sp.name}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSavedProfile(e, sp.id)}
                        className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer ml-0.5"
                        aria-label={`Delete ${sp.name} from vault`}
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Dossier Name & Reset */}
            <div className="pb-3 border-b border-[#1b2331]/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label
                  htmlFor="subject_name"
                  className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1"
                >
                  Subject / Profile Dossier Name
                </label>
                <input
                  id="subject_name"
                  type="text"
                  value={customSubjectName}
                  onChange={(e) => setCustomSubjectName(e.target.value)}
                  placeholder="e.g. My Personal Chart, Client Natal Audit, Custom Subject..."
                  className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto pt-1 sm:pt-4">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] sm:min-h-[36px] text-[11px] font-mono text-slate-400 hover:text-slate-200 border border-[#1b2331] hover:border-slate-700 bg-[#0d121c] rounded-md cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Form</span>
                </button>
              </div>
            </div>

            {/* Row 1: Temporal Calibration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="birth_date"
                  className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1"
                >
                  Date of Birth (Gregorian Civil)
                </label>
                <input
                  id="birth_date"
                  type="date"
                  required
                  autoComplete="bday"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
                />
              </div>

              {/* Time of Birth */}
              <div>
                <label
                  htmlFor="birth_time"
                  className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1"
                >
                  Time (24-Hour Local Civil)
                </label>
                <input
                  id="birth_time"
                  type="time"
                  step="60"
                  value={formData.birth_time}
                  disabled={formData.time_certainty === 'unknown'}
                  onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                  className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              {/* Time Certainty */}
              <div>
                <label
                  htmlFor="time_certainty"
                  className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1"
                >
                  Time Certainty / Record Quality
                </label>
                <select
                  id="time_certainty"
                  value={formData.time_certainty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time_certainty: e.target.value as BirthInput['time_certainty'],
                    })
                  }
                  className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors cursor-pointer"
                >
                  <option value="exact">Exact (Certificate / Hospital record, ±2m)</option>
                  <option value="rounded_15">Rounded to 15m (Family memory / registry, ±15m)</option>
                  <option value="approx_30">Approximate (Time of day, ±30m)</option>
                  <option value="unknown">Unknown Time (Date-stable methods only)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Location & Coordinates Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
              {/* City with Auto-suggest & Geocoding Intelligence */}
              <div ref={cityContainerRef} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="city_name"
                    className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider"
                  >
                    City of Birth
                  </label>
                  {coordStatus === 'auto_resolved' && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Auto-Geocoded
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="city_name"
                    ref={cityInputRef}
                    type="text"
                    required
                    autoComplete="off"
                    value={formData.city_name}
                    onChange={(e) => handleCityChange(e.target.value)}
                    onFocus={() => {
                      if (formData.city_name.trim().length >= 2 && citySuggestions.length > 0) {
                        setIsCitySuggestionsOpen(true);
                      }
                    }}
                    onKeyDown={handleCityKeyDown}
                    onBlur={handleCityBlur}
                    placeholder="Type city (e.g. London, Tokyo)"
                    className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md pl-8 pr-11 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
                  />
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {formData.city_name && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, city_name: '' }));
                        setCitySuggestions([]);
                        setIsCitySuggestionsOpen(false);
                        cityInputRef.current?.focus();
                      }}
                      className="absolute right-0 top-0 bottom-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                      aria-label="Clear city input"
                      data-tooltip="Clear city"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* City Auto-Suggestions Dropdown */}
                {isCitySuggestionsOpen && citySuggestions.length > 0 && (
                  <div
                    role="listbox"
                    aria-label="City suggestions"
                    className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0a0e17] border border-cyan-800/80 rounded-lg shadow-2xl overflow-hidden max-h-64 overflow-y-auto divide-y divide-[#1b2331] font-sans overscroll-contain"
                  >
                    <div className="px-2.5 py-1.5 bg-[#06090e] border-b border-[#1b2331] flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>SUGGESTED CITIES & COORDINATES</span>
                      <span className="text-cyan-400">↑↓ to navigate • Enter to select</span>
                    </div>
                    {citySuggestions.map((s, idx) => {
                      const isSelected = idx === activeSuggestionIndex;
                      return (
                        <div
                          key={`${s.city}-${s.country}-${idx}`}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelectCity(s)}
                          onMouseEnter={() => setActiveSuggestionIndex(idx)}
                          className={`px-3 py-2 text-xs cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-cyan-950/70 text-cyan-200 border-l-2 border-cyan-400'
                              : 'text-slate-200 hover:bg-[#121824]'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-medium text-slate-100 flex items-center gap-1.5 truncate">
                              <span>{s.city}</span>
                              {s.adminCode && (
                                <span className="text-[11px] text-slate-400">({s.adminCode})</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              {s.country}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-mono text-cyan-300/90 block">
                              {Math.abs(s.latitude).toFixed(2)}°{s.latitude >= 0 ? 'N' : 'S'}, {Math.abs(s.longitude).toFixed(2)}°{s.longitude >= 0 ? 'E' : 'W'}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {s.source === 'offline_gazetteer' ? 'Offline Verified' : 'Online Geocode'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country_name"
                  className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1"
                >
                  Country
                </label>
                <input
                  id="country_name"
                  type="text"
                  required
                  autoComplete="country-name"
                  value={formData.country_name}
                  onChange={(e) => setFormData({ ...formData, country_name: e.target.value })}
                  onBlur={handleCityBlur}
                  placeholder="Country"
                  className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
                />
              </div>

              {/* Decimal Coordinates */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="latitude"
                    className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider"
                  >
                    Decimal Lat / Lon
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="relative inline-flex items-center gap-1.5 min-h-[36px] sm:min-h-[28px] px-2.5 py-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-200 bg-[#0d121c] border border-cyan-800/60 rounded transition-all cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 overflow-hidden shadow-xs hover:border-cyan-500"
                    data-tooltip="Detect current device GPS coordinates"
                    aria-label="Detect GPS coordinates"
                  >
                    {isLocating && (
                      <span className="absolute inset-0 rounded border-2 border-cyan-400 animate-radar-pulse pointer-events-none" />
                    )}
                    <Compass className={`w-3.5 h-3.5 text-cyan-400 ${isLocating ? 'animate-spin' : 'transition-transform duration-300 hover:rotate-45'}`} />
                    <span>{isLocating ? 'Pinging GPS...' : 'Detect GPS'}</span>
                  </button>
                </div>
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
                      setCoordStatus('manual');
                      setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 });
                    }}
                    className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-2.5 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
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
                      setCoordStatus('manual');
                      setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 });
                    }}
                    className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-2.5 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors"
                  />
                </div>
                <div className="mt-1 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                  <span>
                    {formData.latitude >= 0 ? `${formData.latitude.toFixed(2)}°N` : `${Math.abs(formData.latitude).toFixed(2)}°S`},{' '}
                    {formData.longitude >= 0 ? `${formData.longitude.toFixed(2)}°E` : `${Math.abs(formData.longitude).toFixed(2)}°W`}
                  </span>
                  <span
                    className={
                      coordStatus === 'auto_resolved'
                        ? 'text-emerald-400'
                        : coordStatus === 'gps'
                        ? 'text-cyan-400'
                        : 'text-slate-400'
                    }
                  >
                    {coordStatus === 'auto_resolved'
                      ? '✓ Auto-matched'
                      : coordStatus === 'gps'
                      ? 'GPS Active'
                      : coordStatus === 'preset'
                      ? 'Rodden Standard'
                      : 'Manual'}
                  </span>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider mb-1"
                >
                  Gender (BaZi / Tibetan Cycle)
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as BirthInput['gender'] })
                  }
                  className="w-full bg-[#080a0f] border border-[#1b2331] rounded-md px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] transition-colors cursor-pointer"
                >
                  <option value="male">Male (Da Yun forward/backward rule)</option>
                  <option value="female">Female (Da Yun forward/backward rule)</option>
                  <option value="neutral">Neutral / Unspecified</option>
                </select>
              </div>
            </div>

            {/* Actions Bar */}
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
                      className="px-2.5 py-1 text-xs bg-cyan-700 hover:bg-cyan-600 text-white rounded font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSaving(false)}
                      className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                      aria-label="Cancel save"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileSaveName(customSubjectName);
                      setIsSaving(true);
                    }}
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
                <span className="text-xs font-mono text-slate-400 hidden lg:inline">
                  NASA JPL DE421 Ephemeris active
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative overflow-hidden w-full sm:w-auto px-5 py-2.5 min-h-[44px] bg-cyan-700 hover:bg-cyan-600 active:scale-[0.98] text-white font-medium text-xs rounded border border-cyan-500/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] shadow-sm"
              >
                {isLoading && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-laser-scan" />
                  </div>
                )}
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="relative z-10 font-mono tracking-wide">Evaluating Dual Engines & Uncertainty Ensemble...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Compute, Verify & Synthesize Chart</span>
                  </>
                )}
              </button>
            </div>

            {/* Subtle Independent Gateway to Benchmark Archive */}
            <div className="pt-3 border-t border-[#1b2331]/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
              <span className="text-xs">
                Want to cross-examine against historical geniuses and certified records?
              </span>
              <button
                type="button"
                onClick={() => setActiveMode('archive')}
                className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[36px] text-cyan-400 hover:text-cyan-300 font-mono text-[11px] cursor-pointer hover:underline self-start sm:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2"
              >
                <span>Browse 100 Verified Historical Titans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ========================================================================= */
        /* EXPERIENCE 2: DEDICATED HISTORICAL TITAN BENCHMARK ARCHIVE                */
        /* ========================================================================= */
        <div
          id="panel-archive-mode"
          role="tabpanel"
          aria-labelledby="tab-archive-mode"
          tabIndex={0}
          className="pt-3 space-y-3.5 focus:outline-none"
        >
          {/* Controls: Categories & Search */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {CATEGORIES.map((cat) => {
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
                    <span className="text-[11px] opacity-75 font-mono">({cat.count})</span>
                  </button>
                );
              })}
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
                  enterKeyHint="search"
                  className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-sans py-1"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search input"
                    className="text-slate-400 hover:text-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                Showing {displayedTitans.length} verified figures
              </span>
            </div>
          </div>

          {/* Titans Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {displayedTitans.length === 0 ? (
              <div className="col-span-full py-8 text-center bg-[#090c12] rounded border border-dashed border-[#1b2331] text-xs text-slate-400">
                <p>No matching figures found for &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              displayedTitans.map((p) => {
                const isSelected = selectedTitan?.id === p.id;
                return (
                  <motion.div
                    layout
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => handleSelectTitan(p, false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectTitan(p, false);
                      }
                    }}
                    className={`flex flex-col text-left p-2.5 rounded-lg border transition-all cursor-pointer relative group min-h-[58px] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-500/80 shadow-sm shadow-cyan-950 text-slate-100 ring-1 ring-cyan-500/40'
                        : 'bg-[#10151f] hover:bg-[#151c2a] border-[#1b2331] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="text-xs font-semibold truncate text-slate-100">
                        {p.name}
                      </span>
                      <span
                        className={`text-[11px] font-mono px-1 py-0.2 rounded font-semibold shrink-0 ${
                          p.rodden_rating === 'AA'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                        }`}
                      >
                        {p.rodden_rating || 'AA'}
                      </span>
                    </div>
                    {p.tag && (
                      <span className="text-[11px] text-cyan-400/80 truncate mt-0.5 font-sans">
                        {p.tag}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                      {p.birth_date} • {p.city_name}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Selected Titan Dossier & Direct Actions */}
          {selectedTitan && (
            <motion.div
              key={selectedTitan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="p-3.5 rounded-lg bg-[#0a0e16] border border-cyan-900/60 shadow-lg mt-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1b2331]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-300 font-bold text-sm shrink-0">
                    {selectedTitan.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-100">{selectedTitan.name}</h4>
                      <span
                        className={`text-[11px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                          selectedTitan.rodden_rating === 'AA'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                        }`}
                      >
                        Rodden {selectedTitan.rodden_rating || 'AA'} Certified
                      </span>
                    </div>
                    <p className="text-xs text-cyan-400/90 font-sans mt-0.5">{selectedTitan.tag}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCustomizeTitan(selectedTitan)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded border border-[#1b2331] hover:border-cyan-700/80 bg-[#10151f] hover:bg-[#161f2e] text-slate-200 hover:text-cyan-300 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    title="Load this titan's birth details into the Custom Calibration Workbench"
                  >
                    <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Customize in Manual Input</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTitan(selectedTitan, true)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded bg-cyan-700 hover:bg-cyan-600 text-white font-medium cursor-pointer transition-colors shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span>Calculate Titan Chart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 text-[11px] font-mono">
                <div className="bg-[#080a0f] p-2 rounded border border-[#1b2331]/60">
                  <span className="text-slate-500 block text-[11px] uppercase">Birth Date</span>
                  <span className="text-slate-200">{selectedTitan.birth_date}</span>
                </div>
                <div className="bg-[#080a0f] p-2 rounded border border-[#1b2331]/60">
                  <span className="text-slate-500 block text-[11px] uppercase">Local Time</span>
                  <span className="text-slate-200">{selectedTitan.birth_time} (Civil)</span>
                </div>
                <div className="bg-[#080a0f] p-2 rounded border border-[#1b2331]/60">
                  <span className="text-slate-500 block text-[11px] uppercase">Birthplace</span>
                  <span className="text-slate-200 truncate block">
                    {selectedTitan.city_name}, {selectedTitan.country_name}
                  </span>
                </div>
                <div className="bg-[#080a0f] p-2 rounded border border-[#1b2331]/60">
                  <span className="text-slate-500 block text-[11px] uppercase">WGS-84 Coordinates</span>
                  <span className="text-cyan-300 truncate block">
                    {Math.abs(selectedTitan.latitude).toFixed(2)}°{selectedTitan.latitude >= 0 ? 'N' : 'S'},{' '}
                    {Math.abs(selectedTitan.longitude).toFixed(2)}°{selectedTitan.longitude >= 0 ? 'E' : 'W'}
                  </span>
                </div>
              </div>

              {selectedTitan.note && (
                <div className="mt-2 text-xs text-slate-400 font-sans italic bg-[#080a0f]/50 p-2 rounded border border-[#1b2331]/40">
                  &quot;{selectedTitan.note}&quot;
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
