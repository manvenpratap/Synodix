import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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

const AstrometricCelestialCompass: React.FC<{
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  cityName: string;
  countryName: string;
}> = ({ birthDate, birthTime, latitude, longitude, cityName, countryName }) => {
  const [year, month, day] = (birthDate || '1955-02-24').split('-').map(Number);
  const [hour, min] = (birthTime || '12:00').split(':').map(Number);
  const date = new Date(Date.UTC(year || 2000, (month || 1) - 1, day || 1, hour || 12, min || 0));
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  // Vernal equinox ~ March 21 (day 80) = 0° Aries
  const sunDeg = ((dayOfYear - 79.25) * (360 / 365.2422) + (hour + min / 60) * (360 / (365.25 * 24))) % 360;
  const normalizedSun = (sunDeg + 360) % 360;

  const ZODIAC = [
    { sign: 'Aries', glyph: '♈' },
    { sign: 'Taurus', glyph: '♉' },
    { sign: 'Gemini', glyph: '♊' },
    { sign: 'Cancer', glyph: '♋' },
    { sign: 'Leo', glyph: '♌' },
    { sign: 'Virgo', glyph: '♍' },
    { sign: 'Libra', glyph: '♎' },
    { sign: 'Scorpio', glyph: '♏' },
    { sign: 'Sagittarius', glyph: '♐' },
    { sign: 'Capricorn', glyph: '♑' },
    { sign: 'Aquarius', glyph: '♒' },
    { sign: 'Pisces', glyph: '♓' },
  ];
  const signIndex = Math.floor(normalizedSun / 30);
  const degInSign = (normalizedSun % 30).toFixed(1);
  const currentZodiac = ZODIAC[signIndex] || ZODIAC[0];

  const daysSinceEpoch = (date.getTime() - new Date(Date.UTC(2000, 0, 6, 18, 14)).getTime()) / (1000 * 60 * 60 * 24);
  const moonPhaseAngle = ((daysSinceEpoch % 29.53058867) / 29.53058867) * 360;
  const moonDeg = (normalizedSun + moonPhaseAngle) % 360;

  const sunRad = ((normalizedSun - 90) * Math.PI) / 180;
  const sunX = 55 + 40 * Math.cos(sunRad);
  const sunY = 55 + 40 * Math.sin(sunRad);

  const moonRad = ((moonDeg - 90) * Math.PI) / 180;
  const moonX = 55 + 40 * Math.cos(moonRad);
  const moonY = 55 + 40 * Math.sin(moonRad);

  const latStr = `${Math.abs(latitude).toFixed(2)}°${latitude >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(longitude).toFixed(2)}°${longitude >= 0 ? 'E' : 'W'}`;

  return (
    <div className="p-2.5 sm:p-3 rounded-xl bg-stone-900/90 dark:bg-stone-950 border border-amber-800/60 shadow-inner flex items-center justify-between gap-3 overflow-hidden">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 110 110" className="w-full h-full select-none" aria-hidden="true">
            {/* Outer brass ring */}
            <circle cx="55" cy="55" r="52" fill="#0c0a09" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="55" cy="55" r="48" fill="none" stroke="#d97706" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />

            {/* Cardinal crosshairs */}
            <line x1="55" y1="7" x2="55" y2="103" stroke="#44403c" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="7" y1="55" x2="103" y2="55" stroke="#44403c" strokeWidth="0.8" strokeDasharray="3 3" />

            {/* Inner coordinate orbit */}
            <circle cx="55" cy="55" r="30" fill="none" stroke="#292524" strokeWidth="1" />
            <circle cx="55" cy="55" r="16" fill="#1c1917" stroke="#78350f" strokeWidth="1" />

            {/* Cardinal marks */}
            <text x="55" y="14" textAnchor="middle" fill="#d97706" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold">N</text>
            <text x="98" y="57" textAnchor="middle" fill="#78716c" fontSize="6" fontFamily="sans-serif">E</text>
            <text x="55" y="100" textAnchor="middle" fill="#78716c" fontSize="6" fontFamily="sans-serif">S</text>
            <text x="12" y="57" textAnchor="middle" fill="#78716c" fontSize="6" fontFamily="sans-serif">W</text>

            {/* Solar Ray Pointer */}
            <line x1="55" y1="55" x2={sunX} y2={sunY} stroke="#f59e0b" strokeWidth="1.5" opacity="0.85" />
            <circle cx={sunX} cy={sunY} r="4" fill="#f59e0b" stroke="#fef3c7" strokeWidth="1" />
            <text x={sunX} y={sunY + 2} textAnchor="middle" fill="#451a03" fontSize="5.5" fontWeight="bold">☉</text>

            {/* Lunar Pointer */}
            <line x1="55" y1="55" x2={moonX} y2={moonY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" opacity="0.75" />
            <circle cx={moonX} cy={moonY} r="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
            <text x={moonX} y={moonY + 1.8} textAnchor="middle" fill="#0f172a" fontSize="4.5" fontWeight="bold">☽</text>

            {/* Center Reticle Core */}
            <circle cx="55" cy="55" r="2.5" fill="#f59e0b" />
          </svg>
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/80">
              {currentZodiac.glyph} Sun in {currentZodiac.sign} {degInSign}°
            </span>
          </div>
          <div className="text-xs font-serif font-semibold text-amber-200 dark:text-amber-100 truncate">
            {cityName ? `${cityName}, ${countryName}` : 'Custom Coordinates'}
          </div>
          <div className="text-[10px] font-mono text-stone-400 truncate">
            {latStr}, {lonStr} • {birthDate} {birthTime}
          </div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end shrink-0 text-right pr-1">
        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
          Live Sky Astrolabe
        </span>
        <span className="text-[10px] font-sans text-stone-400">
          SwissEph &amp; JPL DE421
        </span>
      </div>
    </div>
  );
};

export const BirthDataForm: React.FC<Props> = ({ onCompute, isLoading, samplePresets }) => {
  const shouldReduceMotion = useReducedMotion();
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
  const isCityManualEditRef = useRef<boolean>(false);
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
    isCityManualEditRef.current = true;
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
    isCityManualEditRef.current = false;
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
      if (isCityManualEditRef.current && formDataRef.current.city_name.trim()) {
        isCityManualEditRef.current = false;
        const match = await determineCoordinates(formDataRef.current.city_name, formDataRef.current.country_name);
        if (match) {
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
    }, 60);
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
    <div className="machined-bezel p-3 sm:p-6 rounded-xl sm:rounded-2xl relative shadow-xl">
      <div className="hidden sm:block reticle-corner-tl" />
      <div className="hidden sm:block reticle-corner-tr" />
      <div className="hidden sm:block reticle-corner-bl" />
      <div className="hidden sm:block reticle-corner-br" />

      {/* Top Header & Independent Experience Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 sm:pb-4 border-b border-stone-800 gap-2 sm:gap-3">
        <div className="hidden sm:block">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-xs text-amber-400 font-serif font-medium">
              Step 1 · Enter Birth Details
            </span>
            <span className="text-stone-400 hidden sm:inline">•</span>
            <span className="text-xs text-stone-400 font-sans">
              {activeMode === 'custom' ? 'Custom Input Workspace' : '100 Verified Historical Records'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-serif font-semibold text-stone-100 mt-2.5 sm:mt-3">
            {activeMode === 'custom' ? 'Your Birth Chart Details' : 'Historical Figures & Benchmark Library'}
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
            className={`relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[38px] text-xs rounded-md font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${activeMode === 'custom'
              ? 'text-amber-200 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
              }`}
          >
            {activeMode === 'custom' && (
              <motion.div
                layoutId="active-experience-pill"
                className="absolute inset-0 bg-amber-950/80 border border-amber-700/80 rounded-md shadow-xs pointer-events-none"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 500, damping: 35 }
                }
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
            className={`relative flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[38px] text-xs rounded-md font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${activeMode === 'archive'
              ? 'text-amber-200 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
              }`}
          >
            {activeMode === 'archive' && (
              <motion.div
                layoutId="active-experience-pill"
                className="absolute inset-0 bg-amber-950/80 border border-amber-700/80 rounded-md shadow-xs pointer-events-none"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 500, damping: 35 }
                }
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
          className="pt-2 space-y-3.5 focus:outline-none"
        >
          {/* Live Astrometric Astrolabe Instrument (Visual centerpiece on mobile & desktop) */}
          <AstrometricCelestialCompass
            birthDate={formData.birth_date}
            birthTime={formData.birth_time}
            latitude={formData.latitude}
            longitude={formData.longitude}
            cityName={formData.city_name}
            countryName={formData.country_name}
          />

          {/* Saved Profiles Quick Bar */}
          {savedProfiles.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 flex-wrap">
              <span className="text-xs font-medium text-stone-300 flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-amber-400" />
                Saved ({savedProfiles.length}):
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {savedProfiles.map((sp) => (
                  <div
                    key={sp.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[28px] rounded text-[11px] font-sans bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 transition-colors shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => handleLoadVaultProfile(sp)}
                      className="hover:text-amber-300 cursor-pointer"
                      title={`Load ${sp.name} (${sp.city_name})`}
                    >
                      {sp.name}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSavedProfile(e, sp.id)}
                      className="text-stone-500 hover:text-rose-400 p-0.5 cursor-pointer ml-0.5"
                      aria-label={`Delete ${sp.name} from vault`}
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* ========================================================================= */}
            {/* MODULE 1: SUBJECT DOSSIER & NATAL PARAMETERS                              */}
            {/* ========================================================================= */}
            <div className="rounded-xl bg-stone-900 border border-stone-800 p-3.5 sm:p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-100">
                    <span className="hidden sm:inline">Section 1 · </span>Name &amp; Gender Cycle
                  </h3>
                </div>

                {/* Draft Restore & Form Reset Controls */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {hasSavedDraft && (
                    <button
                      type="button"
                      onClick={handleRestoreDraft}
                      className="inline-flex items-center gap-1.5 px-2 py-1 min-h-[30px] sm:min-h-[34px] text-[11px] font-sans text-amber-300 hover:text-amber-200 border border-amber-800/60 hover:border-amber-600 bg-amber-950/30 rounded-md cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      data-tooltip="Restore unsaved manual calibration draft"
                      aria-label="Restore Custom Draft"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      <span>Restore Draft</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-1.5 px-2 py-1 min-h-[30px] sm:min-h-[34px] text-[11px] font-sans text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700 bg-stone-900 rounded-md cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    data-tooltip="Reset all calibration fields to default"
                    aria-label="Reset Form"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                {/* Profile / Dossier Name */}
                <div className="md:col-span-7">
                  <label
                    htmlFor="subject_name"
                    className="block text-xs font-sans font-medium text-stone-300 mb-1"
                  >
                    <span className="hidden sm:inline">Person's Name or Chart Label</span>
                    <span className="sm:hidden">Person's Name</span>
                  </label>
                  <input
                    id="subject_name"
                    type="text"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    placeholder="e.g. Jane Doe, My Personal Chart..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-medium text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 transition-colors"
                  />
                </div>

                {/* Gender / Natal Cycle Polarity */}
                <div className="md:col-span-5">
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="gender"
                      className="block text-xs font-sans font-medium text-stone-300"
                    >
                      Gender / Cycle Direction
                    </label>
                    <span className="hidden sm:inline text-[11px] font-sans text-amber-400/80">
                      BaZi &amp; Tibetan Cycles
                    </span>
                  </div>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as BirthInput['gender'] })
                    }
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs text-stone-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 transition-colors cursor-pointer"
                  >
                    <option value="male">Male (Standard forward/backward luck cycles)</option>
                    <option value="female">Female (Standard forward/backward luck cycles)</option>
                    <option value="neutral">Neutral / Unspecified</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* MODULE 2: TEMPORAL COORDINATES & EPHEMERIS EPOCH                          */}
            {/* ========================================================================= */}
            <div className="rounded-xl bg-stone-900 border border-stone-800 p-3.5 sm:p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-100">
                    <span className="hidden sm:inline">Section 2 · </span>Date &amp; Time of Birth
                  </h3>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-sans text-amber-300 bg-amber-950/60 border border-amber-800/70 px-2 py-0.5 rounded">
                  Universal Time (UTC) Standard
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Date of Birth */}
                <div>
                  <label
                    htmlFor="birth_date"
                    className="block text-xs font-sans font-medium text-stone-300 mb-1"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="birth_date"
                    type="date"
                    required
                    autoComplete="bday"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 transition-colors"
                  />
                </div>

                {/* Time of Birth */}
                <div>
                  <label
                    htmlFor="birth_time"
                    className="block text-xs font-sans font-medium text-stone-300 mb-1"
                  >
                    <span className="hidden sm:inline">Time of Birth (24-Hour Local Time)</span>
                    <span className="sm:hidden">Time of Birth</span>
                  </label>
                  <input
                    id="birth_time"
                    type="time"
                    step="60"
                    value={formData.birth_time}
                    disabled={formData.time_certainty === 'unknown'}
                    onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Time Certainty / Record Quality */}
                <div>
                  <label
                    htmlFor="time_certainty"
                    className="block text-xs font-sans font-medium text-stone-300 mb-1"
                  >
                    Birth Time Accuracy
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
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs text-stone-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 transition-colors cursor-pointer"
                  >
                    <option value="exact">Exact (Certificate / Hospital record, ±2m)</option>
                    <option value="rounded_15">Approximate (Family memory, within ±15m)</option>
                    <option value="approx_30">Rough Estimate (Time of day, within ±30m)</option>
                    <option value="unknown">Unknown Time (Date-only calculations)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* MODULE 3: GEOGRAPHIC ORIGIN & SPATIAL OBSERVER                            */}
            {/* ========================================================================= */}
            <div className="rounded-xl bg-stone-900 border border-stone-800 p-3.5 sm:p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-100">
                    <span className="hidden sm:inline">Section 3 · </span>Birthplace &amp; Location
                  </h3>
                </div>

                {/* GPS Satellite Lock Button */}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="relative shrink-0 inline-flex items-center gap-1.5 min-h-[30px] sm:min-h-[32px] px-2.5 py-1 text-[11px] font-sans text-amber-300 hover:text-amber-100 bg-stone-900 border border-amber-800/70 rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 overflow-hidden shadow-xs hover:border-amber-500 self-start sm:self-auto whitespace-nowrap"
                  data-tooltip="Detect current device GPS coordinates"
                  aria-label="Detect GPS coordinates"
                >
                  {isLocating && (
                    <span className="absolute inset-0 rounded-lg border-2 border-amber-400 motion-safe:animate-radar-pulse motion-reduce:hidden pointer-events-none" />
                  )}
                  <Compass className={`w-3.5 h-3.5 text-amber-400 ${isLocating ? 'motion-safe:animate-spin' : 'motion-safe:transition-transform motion-reduce:transition-none duration-300 hover:rotate-45'}`} />
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
                      className="block text-xs font-sans font-medium text-stone-300"
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
                      autoCapitalize="words"
                      enterKeyHint="search"
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
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-8 pr-11 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs text-stone-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 transition-colors"
                    />
                    <MapPin className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    {formData.city_name && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, city_name: '' }));
                          setCitySuggestions([]);
                          setIsCitySuggestionsOpen(false);
                          cityInputRef.current?.focus();
                        }}
                        className="absolute right-0 top-0 bottom-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-500 hover:text-stone-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                        aria-label="Clear city input"
                        data-tooltip="Clear city"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* City Auto-Suggestions Dropdown */}
                  <AnimatePresence>
                    {isCitySuggestionsOpen && citySuggestions.length > 0 && (
                      <motion.div
                        role="listbox"
                        aria-label="City suggestions"
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -4, scale: shouldReduceMotion ? 1 : 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4, scale: shouldReduceMotion ? 1 : 0.98 }}
                        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-stone-900 border border-stone-800 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto divide-y divide-stone-800 font-sans overscroll-contain origin-top"
                      >
                        <div className="px-2.5 py-1.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-[11px] font-sans text-stone-400">
                          <span>Suggested Cities & Coordinates</span>
                          <span className="text-amber-400">↑↓ to navigate • Enter to select</span>
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
                              className={`px-3 py-2 text-xs cursor-pointer transition-colors flex items-center justify-between gap-2 rounded ${isSelected
                                ? 'bg-amber-950/60 text-amber-200 border border-amber-500/50 ring-1 ring-amber-500/20'
                                : 'text-stone-200 hover:bg-stone-800 border border-transparent'
                                }`}
                            >
                              <div className="min-w-0">
                                <div className="font-medium text-stone-100 flex items-center gap-1.5 truncate">
                                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0" />}
                                  <span>{s.city}</span>
                                  {s.adminCode && (
                                    <span className="text-[11px] text-stone-400">({s.adminCode})</span>
                                  )}
                                </div>
                                <div className="text-[11px] text-stone-400 font-sans truncate">
                                  {s.country}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[11px] font-mono text-amber-300/90 block">
                                  {Math.abs(s.latitude).toFixed(2)}°{s.latitude >= 0 ? 'N' : 'S'}, {Math.abs(s.longitude).toFixed(2)}°{s.longitude >= 0 ? 'E' : 'W'}
                                </span>
                                <span className="text-[11px] font-sans text-stone-400">
                                  {s.source === 'offline_gazetteer' ? 'Offline Verified' : 'Online Geocode'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-[11px] text-stone-400 font-sans mt-1">
                    Auto-resolves coordinates from offline world gazetteer
                  </p>
                </div>

                {/* Country */}
                <div>
                  <label
                    htmlFor="country_name"
                    className="block text-xs font-sans font-medium text-stone-300 mb-1"
                  >
                    Country / Sovereign Territory
                  </label>
                  <input
                    id="country_name"
                    type="text"
                    required
                    autoComplete="country-name"
                    autoCapitalize="words"
                    enterKeyHint="done"
                    value={formData.country_name}
                    onChange={(e) => setFormData({ ...formData, country_name: e.target.value })}
                    onBlur={handleCityBlur}
                    placeholder="Country"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs text-stone-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 transition-colors"
                  />
                  <p className="text-[11px] text-stone-400 font-sans mt-1">
                    Used for regional historical daylight saving time tables
                  </p>
                </div>
              </div>

              {/* Dedicated High-Precision WGS-84 Coordinates Panel */}
              <div className="p-3.5 rounded-lg bg-stone-900 border border-stone-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-sans font-semibold text-stone-200">
                      WGS-84 Decimal Coordinates (Latitude & Longitude)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-stone-400">
                      {formData.latitude >= 0 ? `${formData.latitude.toFixed(4)}°N` : `${Math.abs(formData.latitude).toFixed(4)}°S`},{' '}
                      {formData.longitude >= 0 ? `${formData.longitude.toFixed(4)}°E` : `${Math.abs(formData.longitude).toFixed(4)}°W`}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${coordStatus === 'auto_resolved'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                        : coordStatus === 'gps'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                          : coordStatus === 'preset'
                            ? 'bg-blue-950/80 text-blue-300 border-blue-700/60'
                            : 'bg-stone-900 text-stone-300 border-stone-700'
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
                        className="block text-xs font-sans font-medium text-stone-300"
                      >
                        Decimal Latitude (-90° to +90°)
                      </label>
                      <span className="text-[11px] font-sans text-stone-400">
                        {formData.latitude >= 0 ? 'Northern Hemisphere' : 'Southern Hemisphere'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="latitude"
                        type="number"
                        inputMode="decimal"
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
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-3 pr-11 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoordStatus('manual');
                          setFormData((prev) => ({ ...prev, latitude: -prev.latitude }));
                        }}
                        title={`Toggle hemisphere: ${formData.latitude >= 0 ? 'North (°N)' : 'South (°S)'}. Click to invert.`}
                        aria-label={`Toggle latitude hemisphere. Current: ${formData.latitude >= 0 ? 'North' : 'South'}`}
                        className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-mono font-bold rounded-md bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
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
                        className="block text-xs font-sans font-medium text-stone-300"
                      >
                        Decimal Longitude (-180° to +180°)
                      </label>
                      <span className="text-[11px] font-sans text-stone-400">
                        {formData.longitude >= 0 ? 'Eastern Hemisphere' : 'Western Hemisphere'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="longitude"
                        type="number"
                        inputMode="decimal"
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
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-3 pr-11 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoordStatus('manual');
                          setFormData((prev) => ({ ...prev, longitude: -prev.longitude }));
                        }}
                        title={`Toggle hemisphere: ${formData.longitude >= 0 ? 'East (°E)' : 'West (°W)'}. Click to invert.`}
                        aria-label={`Toggle longitude hemisphere. Current: ${formData.longitude >= 0 ? 'East' : 'West'}`}
                        className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-mono font-bold rounded-md bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                      >
                        {formData.longitude >= 0 ? '°E' : '°W'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-stone-800">
              <div className="flex flex-wrap items-center gap-2">
                {isSaving ? (
                  <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-lg border border-amber-800">
                    <input
                      type="text"
                      placeholder="Profile Name (e.g. My Chart)"
                      value={profileSaveName}
                      onChange={(e) => setProfileSaveName(e.target.value)}
                      className="bg-transparent text-xs text-stone-100 px-2 py-1 focus:outline-none w-40 font-sans"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveToVault}
                      className="px-2.5 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded-md font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSaving(false)}
                      className="p-1 text-stone-400 hover:text-stone-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
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
                    className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs rounded-lg border transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${saveSuccess
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border-stone-800'
                      }`}
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="whitespace-nowrap">Saved to Vault!</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                        <span className="whitespace-nowrap">Save to My Vault</span>
                      </>
                    )}
                  </button>
                )}
                <span className="text-[11px] font-sans text-stone-400 hidden xl:inline">
                  NASA JPL DE421 Ephemeris • Swiss Ephemeris 2.10 Active
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto relative overflow-hidden px-6 py-3 min-h-[48px] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 transition-[background-color,border-color,transform] motion-safe:active:scale-[0.98] motion-reduce:active:scale-100 duration-150 ease-out text-stone-950 font-serif font-bold text-xs sm:text-xs rounded-xl border border-amber-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 shadow-md shadow-amber-950/40 whitespace-nowrap"
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
                    <span className="relative z-10 font-serif tracking-wide whitespace-nowrap">
                      Calculating Planetary Positions &amp; Charts…
                      <span className="sr-only">Evaluating Dual Engines & Uncertainty Ensemble…</span>
                    </span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-stone-950" />
                    <span className="relative z-10 font-serif font-bold tracking-wide whitespace-nowrap">
                      Calculate All 9 Traditions
                      <span className="sr-only">Compute, Verify & Synthesize Chart</span>
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Subtle Independent Gateway to Benchmark Archive */}
            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-400 gap-2">
              <span className="text-xs">
                Want to test with a famous historical figure or certified record?
              </span>
              <button
                type="button"
                onClick={() => setActiveMode('archive')}
                className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[36px] text-amber-400 hover:text-amber-300 font-sans font-medium text-[11px] cursor-pointer hover:underline self-start sm:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-2 whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Explore 100 Famous Historical Figures (Titans)</span>
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
                    className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 ${isSelected
                      ? 'bg-amber-950 text-amber-200 border border-amber-700/80 shadow-xs'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border border-stone-800'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`} />
                    <span>{cat.label}</span>
                    <span className="text-[11px] opacity-75 font-mono">({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center justify-between gap-3 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800 focus-within:border-amber-500/80 transition-colors">
              <div className="flex items-center gap-2 flex-1">
                <label htmlFor="personality_search" className="sr-only">
                  Search historical figures
                </label>
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  id="personality_search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, discovery, or city (e.g. Einstein, Jordan, Kahlo, Curie, London)..."
                  aria-label="Search 100 historical figures by name, field, or city"
                  enterKeyHint="search"
                  className="w-full bg-transparent text-xs text-stone-200 placeholder-stone-500 focus:outline-none font-sans py-1"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search input"
                    className="text-stone-400 hover:text-stone-200 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-[11px] font-sans text-stone-400 whitespace-nowrap">
                Showing {displayedTitans.length} verified figures
              </span>
            </div>
          </div>

          {/* Titans Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {displayedTitans.length === 0 ? (
              <div className="col-span-full py-8 text-center bg-stone-950 rounded border border-dashed border-stone-800 text-xs text-stone-400">
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
                    className={`btn-press flex flex-col text-left p-2.5 rounded-lg border transition-colors duration-150 cursor-pointer relative group min-h-[58px] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 ${isSelected
                      ? 'bg-amber-950/70 border-amber-500/80 shadow-sm shadow-amber-950 text-stone-100 ring-1 ring-amber-500/40'
                      : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="text-xs font-semibold truncate text-stone-100">
                        {p.name}
                      </span>
                      <span
                        className={`text-[11px] font-mono px-1 py-0.2 rounded font-semibold shrink-0 ${p.rodden_rating === 'AA'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                          }`}
                      >
                        {p.rodden_rating || 'AA'}
                      </span>
                    </div>
                    {p.tag && (
                      <span className="text-[11px] text-amber-400/80 truncate mt-0.5 font-sans">
                        {p.tag}
                      </span>
                    )}
                    <span className="text-[11px] text-stone-400 font-mono mt-0.5 truncate">
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
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.08 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="p-3.5 rounded-lg bg-stone-900 border border-amber-900/60 shadow-lg mt-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0">
                    {selectedTitan.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-stone-100">{selectedTitan.name}</h4>
                      <span
                        className={`text-[11px] font-sans px-1.5 py-0.5 rounded font-semibold ${selectedTitan.rodden_rating === 'AA'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                          }`}
                      >
                        Rodden {selectedTitan.rodden_rating || 'AA'} Certified
                      </span>
                    </div>
                    <p className="text-xs text-amber-400/90 font-sans mt-0.5">{selectedTitan.tag}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleCustomizeTitan(selectedTitan)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] text-xs rounded-lg border border-stone-800 hover:border-amber-700/80 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-amber-300 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 whitespace-nowrap"
                    title="Load this figure's birth details into the Custom Calibration Workbench"
                  >
                    <PenTool className="w-3.5 h-3.5 text-amber-400" />
                    <span className="whitespace-nowrap">Customize Birth Details<span className="sr-only">Customize in Manual Input</span></span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTitan(selectedTitan, true)}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold border border-amber-300 cursor-pointer transition-colors shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 whitespace-nowrap"
                  >
                    <span className="whitespace-nowrap">Calculate This Chart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 text-[11px] font-mono">
                <div className="bg-stone-950 p-2 rounded border border-stone-800">
                  <span className="text-stone-400 block text-[11px]">Birth Date</span>
                  <span className="text-stone-200">{selectedTitan.birth_date}</span>
                </div>
                <div className="bg-stone-950 p-2 rounded border border-stone-800">
                  <span className="text-stone-400 block text-[11px]">Local Time</span>
                  <span className="text-stone-200">{selectedTitan.birth_time} (Civil)</span>
                </div>
                <div className="bg-stone-950 p-2 rounded border border-stone-800">
                  <span className="text-stone-400 block text-[11px]">Birthplace</span>
                  <span className="text-stone-200 truncate block">
                    {selectedTitan.city_name}, {selectedTitan.country_name}
                  </span>
                </div>
                <div className="bg-stone-950 p-2 rounded border border-stone-800">
                  <span className="text-stone-400 block text-[11px]">WGS-84 Coordinates</span>
                  <span className="text-amber-300 truncate block">
                    {Math.abs(selectedTitan.latitude).toFixed(2)}°{selectedTitan.latitude >= 0 ? 'N' : 'S'},{' '}
                    {Math.abs(selectedTitan.longitude).toFixed(2)}°{selectedTitan.longitude >= 0 ? 'E' : 'W'}
                  </span>
                </div>
              </div>

              {selectedTitan.note && (
                <div className="mt-2 text-xs text-stone-400 font-sans italic bg-stone-950/50 p-2 rounded border border-stone-800">
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
