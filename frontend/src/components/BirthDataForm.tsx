import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  RotateCcw,
  User,
  Clock
} from 'lucide-react';
import { getSavedProfiles, saveProfile, deleteProfile, UserProfile } from '../utils/vault';
import { searchCitySuggestions, determineCoordinates, requestDeviceLocation, reverseGeocode, GeocodeResult } from '../utils/geocoding';
import { getMatchingCities } from '../data/worldCities';

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

  // Custom Draft Natal Preservation (prevents loss on switching to Titan benchmarks)
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(() => {
    try {
      return !!sessionStorage.getItem('synodix_draft_natal');
    } catch {
      return false;
    }
  });

  // Automatically preserve custom calibrations in sessionStorage whenever modified in custom mode
  useEffect(() => {
    if (activeMode === 'custom' && coordStatus !== 'preset') {
      try {
        sessionStorage.setItem(
          'synodix_draft_natal',
          JSON.stringify({
            formData,
            customSubjectName,
            coordStatus,
          })
        );
        setHasSavedDraft(true);
      } catch {
        // Safe fallback if sessionStorage is restricted
      }
    }
  }, [formData, customSubjectName, coordStatus, activeMode]);

  const handleRestoreDraft = () => {
    try {
      const saved = sessionStorage.getItem('synodix_draft_natal');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.customSubjectName) setCustomSubjectName(parsed.customSubjectName);
        if (parsed.coordStatus) setCoordStatus(parsed.coordStatus);
      }
    } catch (e) {
      console.warn('Failed to restore custom draft:', e);
    }
  };

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

  const latestCityQueryRef = useRef<string>('');
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formDataRef = useRef(formData);
  formDataRef.current = formData;
  const coordStatusRef = useRef(coordStatus);
  coordStatusRef.current = coordStatus;

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleCityChange = (val: string) => {
    setFormData((prev) => ({ ...prev, city_name: val }));
    setCoordStatus('manual');
    latestCityQueryRef.current = val;

    const trimmed = val.trim();
    if (trimmed.length < 2) {
      setCitySuggestions([]);
      setIsCitySuggestionsOpen(false);
      return;
    }

    // 1. Instant synchronous offline matching (0ms latency)
    const localMatches: GeocodeResult[] = getMatchingCities(trimmed, 10).map((c) => ({
      city: c.city,
      country: c.country,
      adminCode: c.adminCode,
      latitude: c.latitude,
      longitude: c.longitude,
      source: 'offline_gazetteer',
    }));

    if (localMatches.length > 0) {
      setCitySuggestions(localMatches);
      setIsCitySuggestionsOpen(true);
      setActiveSuggestionIndex(-1);
    }

    // 2. Async search & enrichment with race-condition guard
    if (localMatches.length < 8) {
      searchCitySuggestions(trimmed, 10).then((results) => {
        if (latestCityQueryRef.current.trim() === trimmed && results.length > 0) {
          setCitySuggestions(results);
          setIsCitySuggestionsOpen(true);
          setActiveSuggestionIndex(-1);
        }
      });
    }
  };

  const handleSelectCity = (res: GeocodeResult) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
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
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (isCitySuggestionsOpen && citySuggestions.length > 0) {
        const targetIndex = activeSuggestionIndex >= 0 ? activeSuggestionIndex : 0;
        if (targetIndex < citySuggestions.length) {
          handleSelectCity(citySuggestions[targetIndex]);
        }
      }
      return;
    }

    if (!isCitySuggestionsOpen || citySuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev < citySuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : citySuggestions.length - 1));
    }
  };

  const handleCityBlur = async () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = setTimeout(async () => {
      blurTimeoutRef.current = null;
      if (formDataRef.current.city_name.trim() && coordStatusRef.current === 'manual') {
        const match = await determineCoordinates(formDataRef.current.city_name, formDataRef.current.country_name);
        if (match && coordStatusRef.current === 'manual') {
          setFormData((prev) => ({
            ...prev,
            latitude: match.latitude,
            longitude: match.longitude,
            city_name: match.city,
            country_name: match.country,
          }));
          setCoordStatus('auto_resolved');
        }
      }
    }, 150);
  };

  const handleDetectLocation = async () => {
    setIsLocating(true);
    try {
      const coords = await requestDeviceLocation();
      let detectedCity = coords.city;
      let detectedCountry = coords.country;

      if (!detectedCity || !detectedCountry) {
        const fallback = await reverseGeocode(coords.latitude, coords.longitude);
        detectedCity = fallback.city;
        detectedCountry = fallback.country;
      }

      setFormData((prev) => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
        city_name: detectedCity || 'Detected Location',
        country_name: detectedCountry || '',
      }));
      setCoordStatus('gps');
      setIsCitySuggestionsOpen(false);
      setCitySuggestions([]);
    } catch (err: any) {
      console.warn('GPS detection failed:', err);
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
    // If user currently had custom edits, snapshot into draft before loading Titan
    if (coordStatus !== 'preset') {
      try {
        sessionStorage.setItem(
          'synodix_draft_natal',
          JSON.stringify({
            formData,
            customSubjectName,
            coordStatus,
          })
        );
        setHasSavedDraft(true);
      } catch {
        // Safe fallback
      }
    }

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
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-800 gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-xs text-amber-400 font-serif font-medium">
              Tractate I · Astrometric Calibration & Input
            </span>
            <span className="text-stone-400 hidden sm:inline">•</span>
            <span className="text-xs text-stone-400 font-sans">
              {activeMode === 'custom' ? 'Clean Independent Workspace' : '100 Verified Historical Records'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-serif font-semibold text-stone-100 mt-2.5 sm:mt-3">
            {activeMode === 'custom' ? 'Custom Birth Chart Calibration' : 'Historical Titan Benchmark Library'}
          </h2>
        </div>

        {/* Clean Segmented Mode Switcher */}
        <div
          role="tablist"
          aria-label="Input Experience Switcher"
          className="relative flex items-center bg-stone-900 p-1 rounded-lg border border-stone-800 w-full sm:w-auto"
        >
          <button
            type="button"
            role="tab"
            id="tab-custom-mode"
            aria-selected={activeMode === 'custom'}
            aria-controls="panel-custom-mode"
            onClick={() => setActiveMode('custom')}
            className={`relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[38px] text-xs rounded-md font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeMode === 'custom'
                ? 'text-amber-200 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {activeMode === 'custom' && (
              <motion.div
                layoutId="active-experience-pill"
                className="absolute inset-0 bg-amber-950/80 border border-amber-700/80 rounded-md shadow-xs pointer-events-none"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <PenTool className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Custom Manual Input</span>
              <span className="sm:hidden whitespace-nowrap">Custom Input</span>
            </span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-archive-mode"
            aria-selected={activeMode === 'archive'}
            aria-controls="panel-archive-mode"
            onClick={() => setActiveMode('archive')}
            className={`relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[38px] text-xs rounded-md font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeMode === 'archive'
                ? 'text-amber-200 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {activeMode === 'archive' && (
              <motion.div
                layoutId="active-experience-pill"
                className="absolute inset-0 bg-amber-950/80 border border-amber-700/80 rounded-md shadow-xs pointer-events-none"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Historical Titans (100)</span>
              <span className="sm:hidden whitespace-nowrap">Titans (100)</span>
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
          className="pt-2 space-y-4 focus:outline-none"
        >
          {/* Workspace Telemetry Sub-header & Vault Quick-Load Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-xs" />
              <span className="text-xs font-sans font-medium text-slate-200">
                Astrometric Telemetry Studio
              </span>
              <span className="text-slate-400 hidden md:inline">•</span>
              <span className="text-xs font-sans text-slate-400 hidden md:inline">
                WGS-84 Standards & Dual-Engine Verification
              </span>
            </div>

            {/* My Vault Quick Load Bar */}
            {savedProfiles.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-cyan-400" />
                  Vault ({savedProfiles.length}):
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {savedProfiles.map((sp) => (
                    <div
                      key={sp.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[28px] rounded text-[11px] font-sans bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors shrink-0"
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
            {/* ========================================================================= */}
            {/* MODULE 1: SUBJECT DOSSIER & NATAL PARAMETERS                              */}
            {/* ========================================================================= */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60">
                        Module 1
                      </span>
                      <h3 className="text-xs sm:text-sm font-medium text-slate-100">
                        Subject Identity & Natal Cycle
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Dossier label, biological cycle polarity, and local draft persistence
                    </p>
                  </div>
                </div>

                {/* Draft Restore & Form Reset Controls */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {hasSavedDraft && (
                    <button
                      type="button"
                      onClick={handleRestoreDraft}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[34px] text-[11px] font-sans text-cyan-400 hover:text-cyan-300 border border-cyan-800/60 hover:border-cyan-600 bg-cyan-950/30 rounded-md cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      data-tooltip="Restore unsaved manual calibration draft"
                      aria-label="Restore Custom Draft"
                    >
                      <RotateCcw className="w-3 h-3 text-cyan-400" />
                      <span>Restore Draft</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[34px] text-[11px] font-sans text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-md cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    data-tooltip="Reset all calibration fields to default"
                    aria-label="Reset Form"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
                {/* Profile / Dossier Name */}
                <div className="md:col-span-7">
                  <label
                    htmlFor="subject_name"
                    className="block text-xs font-sans font-medium text-slate-300 mb-1"
                  >
                    Subject / Profile Dossier Name
                  </label>
                  <input
                    id="subject_name"
                    type="text"
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    placeholder="e.g. My Personal Chart, Client Natal Audit, Custom Subject..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    Label assigned to this custom astrometric session
                  </p>
                </div>

                {/* Gender / Natal Cycle Polarity */}
                <div className="md:col-span-5">
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="gender"
                      className="block text-xs font-sans font-medium text-slate-300"
                    >
                      Gender (Cycle Polarity)
                    </label>
                    <span className="text-[11px] font-sans text-cyan-400">
                      BaZi / Tibetan Cycle
                    </span>
                  </div>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as BirthInput['gender'] })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 transition-colors cursor-pointer"
                  >
                    <option value="male">Male (Da Yun forward/backward rule)</option>
                    <option value="female">Female (Da Yun forward/backward rule)</option>
                    <option value="neutral">Neutral / Unspecified</option>
                  </select>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    Directs 10-year luck pillar trajectory & elemental stem polarity
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* MODULE 2: TEMPORAL COORDINATES & EPHEMERIS EPOCH                          */}
            {/* ========================================================================= */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                        Module 2
                      </span>
                      <h3 className="text-xs sm:text-sm font-medium text-slate-100">
                        Temporal Coordinates & Ephemeris Epoch
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Civil calendar date, local 24-hour time, and Rodden record rating
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-sans text-amber-300 bg-amber-950/60 border border-amber-800/70 px-2 py-0.5 rounded self-start sm:self-auto">
                  Julian Day (UT) Calibrated
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Date of Birth */}
                <div>
                  <label
                    htmlFor="birth_date"
                    className="block text-xs font-sans font-medium text-slate-300 mb-1"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    Gregorian civil calendar date
                  </p>
                </div>

                {/* Time of Birth */}
                <div>
                  <label
                    htmlFor="birth_time"
                    className="block text-xs font-sans font-medium text-slate-300 mb-1"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    {formData.time_certainty === 'unknown' ? 'Disabled in unknown time mode' : 'Local standard / daylight saving time'}
                  </p>
                </div>

                {/* Time Certainty / Record Quality */}
                <div>
                  <label
                    htmlFor="time_certainty"
                    className="block text-xs font-sans font-medium text-slate-300 mb-1"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 transition-colors cursor-pointer"
                  >
                    <option value="exact">Exact (Certificate / Hospital record, ±2m)</option>
                    <option value="rounded_15">Rounded to 15m (Family memory / registry, ±15m)</option>
                    <option value="approx_30">Approximate (Time of day, ±30m)</option>
                    <option value="unknown">Unknown Time (Date-stable methods only)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    Calibrates T-, T, T+ uncertainty ensemble
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* MODULE 3: GEOGRAPHIC ORIGIN & SPATIAL OBSERVER                            */}
            {/* ========================================================================= */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                        Module 3
                      </span>
                      <h3 className="text-xs sm:text-sm font-medium text-slate-100">
                        Geographic Origin & Spatial Observer
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Birth city, country gazetteer, and high-precision WGS-84 decimal coordinates
                    </p>
                  </div>
                </div>

                {/* GPS Satellite Lock Button */}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="relative shrink-0 inline-flex items-center gap-1.5 min-h-[36px] sm:min-h-[32px] px-3 py-1.5 text-[11px] font-sans text-cyan-400 hover:text-cyan-200 bg-slate-900 border border-cyan-800/60 rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 overflow-hidden shadow-xs hover:border-cyan-500 self-start sm:self-auto whitespace-nowrap"
                  data-tooltip="Detect current device GPS coordinates"
                  aria-label="Detect GPS coordinates"
                >
                  {isLocating && (
                    <span className="absolute inset-0 rounded-lg border-2 border-cyan-400 motion-safe:animate-radar-pulse motion-reduce:hidden pointer-events-none" />
                  )}
                  <Compass className={`w-3.5 h-3.5 text-cyan-400 ${isLocating ? 'motion-safe:animate-spin' : 'motion-safe:transition-transform motion-reduce:transition-none duration-300 hover:rotate-45'}`} />
                  <span>{isLocating ? 'Pinging GPS…' : 'Detect GPS'}</span>
                </button>
              </div>

              {/* City and Country Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* City with Auto-suggest & Geocoding Intelligence */}
                <div ref={cityContainerRef} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="city_name"
                      className="block text-xs font-sans font-medium text-slate-300"
                    >
                      City of Birth
                    </label>
                    {coordStatus === 'auto_resolved' && (
                      <span className="text-[11px] font-sans text-emerald-400 flex items-center gap-1">
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
                        if (citySuggestions.length > 0) {
                          setIsCitySuggestionsOpen(true);
                        }
                      }}
                      onKeyDown={handleCityKeyDown}
                      onBlur={handleCityBlur}
                      placeholder="Type city (e.g. London, Tokyo)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-11 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 transition-colors"
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
                      className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-stone-900 border border-stone-800 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto divide-y divide-stone-800 font-sans overscroll-contain"
                    >
                      <div className="px-2.5 py-1.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-[11px] font-sans text-slate-400">
                        <span>Suggested Cities & Coordinates</span>
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
                            className={`px-3 py-2 text-xs cursor-pointer transition-colors flex items-center justify-between gap-2 rounded ${
                              isSelected
                                ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-500/50 ring-1 ring-cyan-500/20'
                                : 'text-slate-200 hover:bg-slate-800 border border-transparent'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="font-medium text-slate-100 flex items-center gap-1.5 truncate">
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block shrink-0" />}
                                <span>{s.city}</span>
                                {s.adminCode && (
                                   <span className="text-[11px] text-slate-400">({s.adminCode})</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-sans truncate">
                                {s.country}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[11px] font-mono text-cyan-300/90 block">
                                {Math.abs(s.latitude).toFixed(2)}°{s.latitude >= 0 ? 'N' : 'S'}, {Math.abs(s.longitude).toFixed(2)}°{s.longitude >= 0 ? 'E' : 'W'}
                              </span>
                              <span className="text-[11px] font-sans text-slate-400">
                                {s.source === 'offline_gazetteer' ? 'Offline Verified' : 'Online Geocode'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    Auto-resolves coordinates from offline world gazetteer
                  </p>
                </div>

                {/* Country */}
                <div>
                  <label
                    htmlFor="country_name"
                    className="block text-xs font-sans font-medium text-slate-300 mb-1"
                  >
                    Country / Sovereign Territory
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 font-sans mt-1">
                    Used for regional historical daylight saving time tables
                  </p>
                </div>
              </div>

              {/* Dedicated High-Precision WGS-84 Coordinates Panel */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-sans font-semibold text-slate-200">
                      WGS-84 Decimal Coordinates (Latitude & Longitude)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-400">
                      {formData.latitude >= 0 ? `${formData.latitude.toFixed(4)}°N` : `${Math.abs(formData.latitude).toFixed(4)}°S`},{' '}
                      {formData.longitude >= 0 ? `${formData.longitude.toFixed(4)}°E` : `${Math.abs(formData.longitude).toFixed(4)}°W`}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                        coordStatus === 'auto_resolved'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                          : coordStatus === 'gps'
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60'
                          : coordStatus === 'preset'
                          ? 'bg-blue-950/80 text-blue-300 border-blue-700/60'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Decimal Latitude */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="latitude"
                        className="block text-xs font-sans font-medium text-slate-300"
                      >
                        Decimal Latitude (-90° to +90°)
                      </label>
                      <span className="text-[11px] font-sans text-slate-400">
                        {formData.latitude >= 0 ? 'Northern Hemisphere' : 'Southern Hemisphere'}
                      </span>
                    </div>
                    <div className="relative">
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-11 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoordStatus('manual');
                          setFormData((prev) => ({ ...prev, latitude: -prev.latitude }));
                        }}
                        title={`Toggle hemisphere: ${formData.latitude >= 0 ? 'North (°N)' : 'South (°S)'}. Click to invert.`}
                        aria-label={`Toggle latitude hemisphere. Current: ${formData.latitude >= 0 ? 'North' : 'South'}`}
                        className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-mono font-bold rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                      >
                        {formData.latitude >= 0 ? '°N' : '°S'}
                      </button>
                    </div>
                  </div>

                  {/* Decimal Longitude */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="longitude"
                        className="block text-xs font-sans font-medium text-slate-300"
                      >
                        Decimal Longitude (-180° to +180°)
                      </label>
                      <span className="text-[11px] font-sans text-slate-400">
                        {formData.longitude >= 0 ? 'Eastern Hemisphere' : 'Western Hemisphere'}
                      </span>
                    </div>
                    <div className="relative">
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-11 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoordStatus('manual');
                          setFormData((prev) => ({ ...prev, longitude: -prev.longitude }));
                        }}
                        title={`Toggle hemisphere: ${formData.longitude >= 0 ? 'East (°E)' : 'West (°W)'}. Click to invert.`}
                        aria-label={`Toggle longitude hemisphere. Current: ${formData.longitude >= 0 ? 'East' : 'West'}`}
                        className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-mono font-bold rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                      >
                        {formData.longitude >= 0 ? '°E' : '°W'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                {isSaving ? (
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-cyan-800">
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
                      className="px-2.5 py-1 text-xs bg-cyan-700 hover:bg-cyan-600 text-white rounded-md font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
                    className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs rounded-lg border transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      saveSuccess
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border-slate-800'
                    }`}
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="whitespace-nowrap">Saved to Vault!</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="whitespace-nowrap">Save to My Vault</span>
                      </>
                    )}
                  </button>
                )}
                <span className="text-[11px] font-sans text-slate-400 hidden xl:inline">
                  NASA JPL DE421 Ephemeris • Swiss Ephemeris 2.10 Active
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative overflow-hidden px-6 py-2.5 min-h-[44px] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 active:scale-[0.98] text-stone-950 font-serif font-semibold text-xs rounded-lg border border-amber-300 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 shadow-md shadow-amber-950/40 whitespace-nowrap"
              >
                {isLoading && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent motion-safe:animate-laser-scan motion-reduce:hidden" />
                  </div>
                )}
                {isLoading ? (
                  <>
                    <svg className="motion-safe:animate-spin h-3.5 w-3.5 text-stone-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="relative z-10 font-serif tracking-wide whitespace-nowrap">Evaluating Dual Engines & Uncertainty Ensemble…</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-stone-950" />
                    <span className="font-serif font-bold tracking-wide whitespace-nowrap">Compute, Verify & Synthesize Chart</span>
                  </>
                )}
              </button>
            </div>

            {/* Subtle Independent Gateway to Benchmark Archive */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
              <span className="text-xs">
                Want to cross-examine against historical geniuses and certified records?
              </span>
              <button
                type="button"
                onClick={() => setActiveMode('archive')}
                className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[36px] text-cyan-400 hover:text-cyan-300 font-sans font-medium text-[11px] cursor-pointer hover:underline self-start sm:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2 whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Browse 100 Verified Historical Titans</span>
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
            <div className="flex items-center gap-1.5 flex-wrap pb-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800'
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
            <div className="flex items-center justify-between gap-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 focus-within:border-cyan-500/80 transition-colors">
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
              <span className="text-[11px] font-sans text-slate-400 whitespace-nowrap">
                Showing {displayedTitans.length} verified figures
              </span>
            </div>
          </div>

          {/* Titans Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {displayedTitans.length === 0 ? (
              <div className="col-span-full py-8 text-center bg-slate-950 rounded border border-dashed border-slate-800 text-xs text-slate-400">
                <p>No matching figures found for &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              displayedTitans.map((p) => {
                const isSelected = selectedTitan?.id === p.id;
                return (
                  <div
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
                    className={`btn-press flex flex-col text-left p-2.5 rounded-lg border transition-colors duration-150 cursor-pointer relative group min-h-[58px] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-500/80 shadow-sm shadow-cyan-950 text-slate-100 ring-1 ring-cyan-500/40'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:border-slate-700'
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
                  </div>
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
              className="p-3.5 rounded-lg bg-slate-900 border border-cyan-900/60 shadow-lg mt-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-300 font-bold text-sm shrink-0">
                    {selectedTitan.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-100">{selectedTitan.name}</h4>
                      <span
                        className={`text-[11px] font-sans px-1.5 py-0.5 rounded font-semibold ${
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
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded border border-slate-800 hover:border-cyan-700/80 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap"
                    title="Load this titan's birth details into the Custom Calibration Workbench"
                  >
                    <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="whitespace-nowrap">Customize in Manual Input</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTitan(selectedTitan, true)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded bg-cyan-700 hover:bg-cyan-600 text-white font-medium cursor-pointer transition-colors shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap"
                  >
                    <span className="whitespace-nowrap">Calculate Titan Chart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 text-[11px] font-mono">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Birth Date</span>
                  <span className="text-slate-200">{selectedTitan.birth_date}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Local Time</span>
                  <span className="text-slate-200">{selectedTitan.birth_time} (Civil)</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Birthplace</span>
                  <span className="text-slate-200 truncate block">
                    {selectedTitan.city_name}, {selectedTitan.country_name}
                  </span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">WGS-84 Coordinates</span>
                  <span className="text-cyan-300 truncate block">
                    {Math.abs(selectedTitan.latitude).toFixed(2)}°{selectedTitan.latitude >= 0 ? 'N' : 'S'},{' '}
                    {Math.abs(selectedTitan.longitude).toFixed(2)}°{selectedTitan.longitude >= 0 ? 'E' : 'W'}
                  </span>
                </div>
              </div>

              {selectedTitan.note && (
                <div className="mt-2 text-xs text-slate-400 font-sans italic bg-slate-950/50 p-2 rounded border border-slate-800">
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
