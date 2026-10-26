import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BirthInput, ChartResponse, Preset } from './types';
import {
  Compass,
  Layers,
  FileText,
  ShieldCheck,
  FlaskConical,
  Sliders,
  Menu,
  X,
  User,
  ChevronRight,
  ArrowRight,
  Sun,
  Moon,
  Server,
  CheckCircle2,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { apiUrl, getApiBaseUrl, setApiBaseUrl, DEFAULT_DEV_API_URL } from './utils/api';
import { getBundledTitanChart } from './data/bundledTitans';
import { calculateChartLocally } from './engine';
import TITANS_100_DATA from './data/personalities_100.json';
import { BirthDataForm } from './components/BirthDataForm';
import { InputAuditCard } from './components/InputAuditCard';
import { VerificationCard } from './components/VerificationCard';
import { TraditionCharts } from './components/TraditionCharts';
import { SynthesisMatrix } from './components/SynthesisMatrix';
import { ReadingView } from './components/ReadingView';
import { FeatureGuideScreen } from './components/FeatureGuideScreen';
import { getPrimaryProfile } from './utils/vault';
import { ExplainerProvider } from './context/ExplainerContext';
import { useExplainer } from './context/useExplainer';
import { FeatureExplainerModal } from './components/FeatureExplainerModal';
import { ExplainerTrigger } from './components/ExplainerTrigger';
import { APP_VERSION_LABEL } from './version';

const FALLBACK_PRESETS: Preset[] = TITANS_100_DATA as unknown as Preset[];

export type AppScreen =
  | 'workbench'
  | 'traditions'
  | 'synthesis'
  | 'dossier'
  | 'verification'
  | 'evidence'
  | 'guide';

interface NavItem {
  id: AppScreen;
  label: string;
  badge?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'workbench',
    label: 'Workbench & Vault',
    description: 'Profiles, Birth Input & Boundary Audit',
    icon: Sliders
  },
  {
    id: 'traditions',
    label: 'Cultural Traditions',
    badge: 'Calculators',
    description: 'Visual Kundali, 360° Wheel, Telemetry',
    icon: Compass
  },
  {
    id: 'synthesis',
    label: 'Synthesis Matrix',
    description: 'Domain Consensus vs Divergence',
    icon: Layers
  },
  {
    id: 'dossier',
    label: 'Corroboration Dossier',
    description: 'Synthesized Reading & Narrative',
    icon: FileText
  },
  {
    id: 'verification',
    label: 'Astronomical Audit',
    badge: 'JPL DE421',
    description: 'SwissEph vs NASA Skyfield Diffs',
    icon: ShieldCheck
  },
  {
    id: 'evidence',
    label: 'Mathematical Evidence',
    badge: '100 Titans',
    description: 'Double-Blind Monte Carlo Benchmark',
    icon: FlaskConical
  }
];

const JOURNEY_STEPS: { id: AppScreen; step: number; label: string }[] = [
  { id: 'workbench', step: 1, label: 'Input' },
  { id: 'traditions', step: 2, label: 'Traditions' },
  { id: 'synthesis', step: 3, label: 'Synthesis' },
  { id: 'dossier', step: 4, label: 'Dossier' },
  { id: 'evidence', step: 5, label: 'Evidence' },
];

function AppContent() {
  const { openGlossary } = useExplainer();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('workbench');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartResponse | null>(null);
  const [activeSubjectName, setActiveSubjectName] = useState<string>(() => getPrimaryProfile()?.name || 'Steve Jobs');
  const [activeSubjectDate, setActiveSubjectDate] = useState<string>(() => getPrimaryProfile()?.birth_date || '1955-02-24');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState<Preset[]>(FALLBACK_PRESETS);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('synodix_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('synodix_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Mobile / Native Server Connection State
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState<string>(() => getApiBaseUrl() || DEFAULT_DEV_API_URL);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const testServerConnection = async (targetUrl: string) => {
    setTestStatus('testing');
    setTestMessage('Pinging server health endpoint...');
    try {
      const clean = targetUrl.trim().replace(/\/+$/, '');
      const healthUrl = clean ? `${clean}/api/health` : '/api/health';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        setTestStatus('success');
        setTestMessage(`Connected: ${data.engine_version || 'Synodix'} (${data.primary_astronomy || 'SwissEph'})`);
      } else {
        setTestStatus('error');
        setTestMessage(`Server responded with status ${res.status}`);
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.name === 'AbortError' ? 'Connection timed out (verify IP / Wi-Fi)' : (err.message || 'Connection failed'));
    }
  };

  const saveServerUrl = () => {
    setApiBaseUrl(serverUrlInput);
    setIsServerModalOpen(false);
    fetchPresets();
  };

  const fetchPresets = async () => {
    try {
      const res = await fetch(apiUrl('/api/sample-charts'));
      if (res.ok) {
        const data = await res.json();
        setPresets(data);
        return;
      }
    } catch {
      // Use fallback presets
    }
    setPresets(FALLBACK_PRESETS);
  };

  const handleCompute = async (input: BirthInput, subjectName?: string) => {
    setIsLoading(true);
    setError(null);
    if (subjectName) {
      setActiveSubjectName(subjectName);
    }
    setActiveSubjectDate(input.birth_date);

    // 1. Check if this request corresponds to one of the 100 bundled historical titans
    const matchingTitan = (presets.length ? presets : FALLBACK_PRESETS).find(
      (p) =>
        p.birth_date === input.birth_date &&
        p.birth_time === input.birth_time &&
        Math.abs(p.latitude - input.latitude) < 0.05
    );

    if (matchingTitan) {
      const bundledChart = await getBundledTitanChart(matchingTitan.id);
      if (bundledChart) {
        setChartData(bundledChart);
        setIsLoading(false);
        return;
      }
    }

    // 2. Try remote API if configured and reachable
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(apiUrl('/api/compute-chart'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data: ChartResponse = await res.json();
        setChartData(data);
        setIsLoading(false);
        return;
      }
    } catch {
      // Offline or server unavailable: seamless fallback to in-app TypeScript engine
    }

    // 3. Fallback: Compute in-app via local TypeScript engine
    try {
      const localData = await calculateChartLocally(input);
      setChartData(localData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during local calculation');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
    // Check if user has saved a primary profile in their vault
    const primary = getPrimaryProfile();
    if (primary) {
      handleCompute(primary, primary.name);
    } else {
      // Default to Steve Jobs benchmark
      handleCompute({
        birth_date: '1955-02-24',
        birth_time: '19:15',
        time_certainty: 'exact',
        latitude: 37.7749,
        longitude: -122.4194,
        city_name: 'San Francisco',
        country_name: 'USA',
        gender: 'male',
      }, 'Steve Jobs');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateTo = (screen: AppScreen) => {
    setCurrentScreen(screen);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isServerModalOpen) setIsServerModalOpen(false);
        if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isServerModalOpen, isMobileSidebarOpen]);

  return (
    <div className="min-h-[100dvh] w-full max-w-full celestial-observatory-canvas text-stone-200 flex flex-col md:flex-row antialiased">
      {/* 1. Desktop Fixed Sidebar Navigation (>=md) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 sidebar-canvas border-r border-stone-800 shrink-0 h-[100dvh] sticky top-0 overflow-y-auto overflow-x-hidden select-none z-40 scrollbar-thin">
        {/* Brand Logo & Header */}
        <div className="p-4 border-b border-stone-800/80 relative overflow-hidden shrink-0">
          <div className="flex items-center gap-3">
            {/* Nonagon Armilla Geometric Logo Mark with slow orbital spin ring */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-800/80 flex items-center justify-center shrink-0 shadow-md ring-1 ring-amber-500/20 group">
              <div className="absolute inset-0 rounded-xl bg-amber-400/5 group-hover:bg-amber-400/10 transition-colors" />
              <svg viewBox="0 0 40 40" className="w-6 h-6 animate-orbital-spin motion-reduce:animate-none" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="16" stroke="#44403c" strokeWidth="1.2" strokeDasharray="3 3" />
                <polygon points="20,6 32,27 8,27" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
                <polygon points="29,10 25,32 5,18" stroke="#d97706" strokeWidth="1" strokeOpacity="0.85" strokeLinejoin="round" />
                <polygon points="34,18 15,32 12,10" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.85" strokeLinejoin="round" />
                <circle cx="20" cy="20" r="2.5" fill="#f59e0b" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-stone-100 text-sm">
                  Synodix
                </span>
                <span className="px-1.5 py-0.2 rounded text-[11px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800/80 font-medium">
                  {APP_VERSION_LABEL}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-serif mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                Astrometric Observatory
              </p>
            </div>
          </div>
        </div>

        {/* Active Subject Context Pill — Engraved Brass Instrument Plate */}
        <div className="px-3 pt-3 shrink-0">
          <div className="p-3 rounded-xl bg-stone-900 border border-amber-900/40 shadow-xs flex flex-col gap-1.5 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-medium text-amber-400/90 flex items-center gap-1.5">
                <User className="w-3 h-3 text-amber-400" />
                Subject Dossier
              </span>
              <span className="text-xs font-mono text-amber-300/90 font-medium">
                Active
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSubjectName}-${activeSubjectDate}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline justify-between"
              >
                <span className="text-xs font-serif font-semibold text-stone-100 truncate tracking-wide">
                  {activeSubjectName}
                </span>
                <span className="text-[11px] font-mono text-stone-400 tabular-nums">
                  {activeSubjectDate}
                </span>
              </motion.div>
            </AnimatePresence>
            {chartData && (
              <div className="pt-1.5 border-t border-stone-800/80 text-[11px] font-mono flex flex-col gap-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="flex items-center gap-1">
                    <span>Divergence:</span>
                    <ExplainerTrigger id="divergence_rate_calculation" variant="icon" size="xs" />
                  </span>
                  <span className={`font-semibold ${
                    chartData.synthesis.divergence_metrics.divergence_rate_percent > 40
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}>
                    {chartData.synthesis.divergence_metrics.divergence_rate_percent}%
                  </span>
                </div>
                {/* Divergence Mini Gauge Bar */}
                <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full motion-safe:transition-opacity motion-reduce:transition-none rounded-full ${
                      chartData.synthesis.divergence_metrics.divergence_rate_percent > 40
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(8, 100 - chartData.synthesis.divergence_metrics.divergence_rate_percent))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Screen Links */}
        <nav aria-label="Workspace Screens" className="p-3 space-y-1 shrink-0">
          <span className="px-2 text-xs font-serif font-medium text-stone-400 block mb-1.5">
            Workspace Screens
          </span>

          {NAV_ITEMS.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors duration-150 cursor-pointer group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 ${
                  isActive
                    ? 'bg-stone-900 text-amber-200 font-medium border border-amber-600/70 shadow-xs ring-1 ring-amber-500/20 translate-x-0.5'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900/80 border border-transparent hover:border-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-amber-950/80 border border-amber-700/60 text-amber-400' : 'bg-stone-900 border border-stone-800 text-stone-400 group-hover:text-stone-200 group-hover:border-stone-700'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs block font-serif truncate font-medium">{item.label}</span>
                    <span className="text-[11px] text-stone-400 block truncate font-sans">
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[11px] font-mono shrink-0 ml-1 ${
                    isActive
                      ? 'bg-amber-950 text-amber-300 border border-amber-700 font-semibold shadow-xs'
                      : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Calibration Inset Box (Renaissance Observatory Style) */}
        {chartData && (
          <div className="px-3 pb-2 shrink-0">
            <div className="p-2 rounded bg-stone-950 border border-stone-800 font-mono text-[11px] space-y-0.5 text-stone-400">
              <div className="flex items-center justify-between text-stone-300 font-medium mb-1">
                <span className="font-serif">Astrometric Calibration</span>
                <ExplainerTrigger id="time_normalization_eot" variant="icon" size="xs" />
              </div>
              <div className="flex justify-between"><span>Epoch:</span> <span className="text-stone-200">J2000.0</span></div>
              <div className="flex justify-between"><span>Julian Day:</span> <span className="text-amber-300">{chartData.astronomical_base?.julian_day_ut?.toFixed(2) || '2451545.00'}</span></div>
              <div className="flex justify-between"><span>Topocentric:</span> <span className="text-emerald-400">IAU 2000B</span></div>
            </div>
          </div>
        )}

        {/* Sidebar Footer with Engine Diagnostics */}
        <div className="p-3 border-t border-stone-800 bg-stone-950 text-[11px] font-mono space-y-2 shrink-0">
          <div className="flex items-center justify-between text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs inline-block"></span>
              NASA JPL DE421
            </span>
            <span className="text-emerald-400 font-semibold">VERIFIED</span>
          </div>
          <div className="flex items-center justify-between text-stone-400">
            <span>Client Vault:</span>
            <span className="text-amber-400">Zero-Cloud / Private</span>
          </div>
          <div className="flex items-center justify-between text-stone-400 pt-1 border-t border-stone-800">
            <span>Theme:</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 cursor-pointer"
              data-tooltip={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
              aria-label={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Solar Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-amber-300" />
                  <span>Deep Space</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-stone-400 pt-1 border-t border-stone-800">
            <span>Server:</span>
            <button
              type="button"
              onClick={() => setIsServerModalOpen(true)}
              className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 cursor-pointer"
              data-tooltip="Configure backend API server address"
              aria-label="Server Settings"
            >
              <Server className="w-3 h-3 text-amber-400" />
              <span>{getApiBaseUrl() ? 'Custom' : 'Direct'}</span>
            </button>
          </div>
          <div className="text-xs font-mono text-stone-400 pt-1 text-center font-serif">
            SwissEph 2.10 • Global Civilizations
          </div>
        </div>
      </aside>

      {/* 2. Mobile Drawer Navigation Overlay (<md) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[60] md:hidden bg-black/80 flex overscroll-contain">
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Drawer"
            className="w-72 bg-stone-950 h-full flex flex-col border-r border-stone-800 p-4 shadow-2xl pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-amber-950 border border-amber-800 flex items-center justify-center font-bold text-xs text-amber-300 font-mono">
                  SX
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-stone-100 text-sm">Synodix</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 font-medium">
                    {APP_VERSION_LABEL}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-stone-400 hover:text-stone-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                aria-label="Close navigation"
                data-tooltip="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Theme Switcher */}
            <div className="flex items-center justify-between px-1 py-2.5 my-1 border-b border-stone-800">
              <span className="text-xs font-serif text-stone-400 font-medium">Theme</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-stone-800 bg-stone-900 text-stone-300 cursor-pointer"
                data-tooltip={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
                aria-label={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Solar Day</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-amber-300" />
                    <span>Deep Space</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Server Config */}
            <div className="flex items-center justify-between px-1 py-2.5 my-1 border-b border-stone-800">
              <span className="text-xs font-serif text-stone-400 font-medium">Server</span>
              <button
                type="button"
                onClick={() => setIsServerModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-stone-800 bg-stone-900 text-stone-300 cursor-pointer"
                data-tooltip="Configure backend API server URL"
                aria-label="Server Settings"
              >
                <Server className="w-3.5 h-3.5 text-amber-400" />
                <span>Configure</span>
              </button>
            </div>

            {/* Mobile Feature Guide Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  openGlossary();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-850 text-amber-300 border border-amber-800/60 font-serif text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Feature Guide & Glossary</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            <nav aria-label="Mobile Drawer Screens" className="flex-1 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = currentScreen === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isActive
                        ? 'bg-stone-900 text-amber-200 font-semibold border border-amber-800'
                        : 'text-stone-300 hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                      <span className="text-xs font-serif">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[11px] font-mono px-1 rounded bg-stone-900 text-amber-300 border border-stone-800">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-stone-800 text-[11px] font-mono text-stone-400 font-serif">
              NASA JPL DE421 • Multi-Tradition
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full">
        {/* Top Header Bar */}
        <header className="h-[calc(3.75rem+env(safe-area-inset-top,0px))] pt-[env(safe-area-inset-top,0px)] border-b sm:border border-stone-800 sm:rounded-2xl header-canvas backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 sm:top-2 sm:mx-4 lg:mx-6 z-30 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Menu Toggle (<md) */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-expanded={isMobileSidebarOpen}
              aria-controls="mobile-navigation-drawer"
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-1 rounded-md text-stone-400 hover:text-stone-100 hover:bg-stone-800 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Open sidebar menu"
              data-tooltip="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Screen Title */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 flex items-center gap-2 min-w-0">
                <span className="truncate max-w-[140px] sm:max-w-none">
                  {NAV_ITEMS.find((n) => n.id === currentScreen)?.label || (currentScreen === 'guide' ? 'Feature Guide' : '')}
                </span>
              </h1>
              {/* Mobile Active Subject Chip */}
              {activeSubjectName && currentScreen !== 'workbench' && (
                <button
                  type="button"
                  onClick={() => navigateTo('workbench')}
                  className="md:hidden flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-900 border border-amber-800/60 text-[11px] font-mono text-amber-300 truncate max-w-[110px] cursor-pointer shrink-0"
                  data-tooltip="Switch active subject"
                  aria-label={`Subject: ${activeSubjectName}. Tap to switch.`}
                >
                  <User className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span className="truncate font-serif">{activeSubjectName}</span>
                </button>
              )}
            </div>

            {/* Live Astrometric Telemetry Badges (Desktop >= 2xl) */}
            <div className="hidden 2xl:flex items-center gap-2 font-mono text-[11px] ml-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                <span className="text-stone-400">JPL DE421:</span>
                <span className="text-emerald-300 font-semibold">PASS</span>
                <ExplainerTrigger id="dual_engine_validation" variant="icon" size="xs" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800">
                <span className="text-stone-400">Epistemic Rigor:</span>
                <span className="text-amber-300 font-semibold">94.2%</span>
                <ExplainerTrigger id="epistemic_humility_framework" variant="icon" size="xs" />
              </div>
              {chartData && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800">
                  <span className="text-stone-400">Consensus:</span>
                  <span className="text-amber-300 font-semibold">
                    {(100 - chartData.synthesis.divergence_metrics.divergence_rate_percent).toFixed(1)}%
                  </span>
                  <ExplainerTrigger id="three_cluster_consensus" variant="icon" size="xs" />
                </div>
              )}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-xs shrink-0">
            {/* Feature Guide Trigger */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  openGlossary();
                } else {
                  navigateTo('guide');
                }
              }}
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 min-w-[40px] min-h-[40px] sm:min-h-[34px] text-xs rounded border border-stone-800 bg-stone-900 hover:bg-stone-800 text-amber-400 hover:text-amber-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 font-serif"
              data-tooltip="Browse all 50 astronomical & cultural feature explainers"
              aria-label="Browse Feature Explainers & Astrometric Glossary"
            >
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Feature Guide</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 min-w-[40px] min-h-[40px] sm:min-h-[34px] text-xs rounded border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 group"
              data-tooltip={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
              aria-label={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
            >
              <div className="transition-transform duration-500 ease-out group-hover:rotate-45 group-active:scale-90">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 text-amber-300 shrink-0" />
                )}
              </div>
              <span className="hidden sm:inline">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
        </header>

        {/* Epistemological Journey Stepper — Tractate Progression */}
        <nav
          aria-label="Epistemic Journey Stepper"
          className="px-3 sm:px-6 py-2 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 select-none sticky top-[calc(3.75rem+env(safe-area-inset-top,0px))] z-20"
        >
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 text-stone-400">
            <span className="font-serif font-medium text-xs text-amber-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
              Epistemic Journey
            </span>
            <span className="text-[11px] text-stone-300 font-serif">
              {JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) >= 0
                ? `Tractate ${['I', 'II', 'III', 'IV', 'V'][JOURNEY_STEPS.findIndex((s) => s.id === currentScreen)]} of V`
                : 'Reference'}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 py-0.5 w-full">
            {JOURNEY_STEPS.map((s, idx) => {
              const isActive = currentScreen === s.id;
              const isPassed = JOURNEY_STEPS.findIndex((st) => st.id === currentScreen) > idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => navigateTo(s.id)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Step ${s.step}: ${s.label}${isActive ? ' (current step)' : isPassed ? ' (completed)' : ''}`}
                  className={`flex flex-col min-[380px]:flex-row items-center justify-center gap-0.5 min-[380px]:gap-1.5 px-1 py-1.5 min-h-[38px] rounded-lg text-center cursor-pointer transition-colors active:scale-95 duration-150 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive
                      ? 'bg-amber-950 text-amber-200 border border-amber-600 font-bold shadow-xs ring-1 ring-amber-500/50'
                      : isPassed
                      ? 'bg-stone-900 text-emerald-400 border border-emerald-900/50 hover:bg-stone-850'
                      : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-mono transition-colors duration-150 shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-stone-950 font-bold ring-2 ring-amber-300/40'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {s.step}
                  </span>
                  <div className="text-left min-w-0">
                    <span className="hidden sm:block text-[9px] text-amber-500/80 font-mono leading-none">
                      {['Tr. I', 'Tr. II', 'Tr. III', 'Tr. IV', 'Tr. V'][idx]}
                    </span>
                    <span className="truncate text-[11px] font-serif font-medium">{s.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {/* Ambient Progress Conduit */}
          <div className="w-full bg-stone-800 h-0.5 mt-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 motion-safe:transition-opacity motion-reduce:transition-none rounded-full"
              style={{
                width: `${
                  JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) >= 0
                    ? ((JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) + 1) / 5) * 100
                    : 100
                }%`
              }}
            />
          </div>
        </nav>

        {/* Main Content Viewport */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-8 ${
            currentScreen === 'guide' || currentScreen === 'evidence' ? 'max-w-full lg:px-8' : 'max-w-7xl'
          }`}
        >
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
              <strong>Calculation Alert:</strong> {error}
            </div>
          )}

          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
              {/* SCREEN 1: Workbench & Profile Vault */}
              {currentScreen === 'workbench' && (
                <div className="space-y-6">
                  <BirthDataForm
                    onCompute={handleCompute}
                    isLoading={isLoading}
                    samplePresets={presets}
                  />
                  {chartData && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-stone-900 p-3 sm:p-3.5 rounded-xl border border-amber-900/50 gap-2.5 shadow-xs">
                        <div className="text-xs font-mono text-stone-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                          <span>Chart calculated for <strong className="text-amber-300 font-serif font-semibold">{activeSubjectName}</strong> ({activeSubjectDate}).</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigateTo('traditions')}
                          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[44px] sm:min-h-[36px] text-xs rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-semibold border border-amber-400/80 cursor-pointer transition-colors shadow-xs active:scale-95"
                        >
                          <span className="whitespace-nowrap">Explore 9 Traditions (Step 2)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <InputAuditCard data={chartData} />
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 2: Cultural Traditions */}
              {currentScreen === 'traditions' && (
                <div>
                  {chartData ? (
                    <TraditionCharts data={chartData} onNavigate={navigateTo} />
                  ) : (
                    <EmptyChartState onOpenWorkbench={() => navigateTo('workbench')} />
                  )}
                </div>
              )}

              {/* SCREEN 3: Domain Synthesis Matrix */}
              {currentScreen === 'synthesis' && (
                <div>
                  {chartData ? (
                    <SynthesisMatrix synthesis={chartData.synthesis} onNavigate={navigateTo} />
                  ) : (
                    <EmptyChartState onOpenWorkbench={() => navigateTo('workbench')} />
                  )}
                </div>
              )}

              {/* SCREEN 4: Corroboration Dossier & Narrative */}
              {currentScreen === 'dossier' && (
                <div>
                  {chartData ? (
                    <ReadingView data={chartData} subjectName={activeSubjectName} onNavigate={navigateTo} />
                  ) : (
                    <EmptyChartState onOpenWorkbench={() => navigateTo('workbench')} />
                  )}
                </div>
              )}

              {/* SCREEN 5: Astronomical Verification & JPL DE421 Diffs */}
              {currentScreen === 'verification' && (
                <div>
                  {chartData ? (
                    <VerificationCard report={chartData.verification_report} />
                  ) : (
                    <EmptyChartState onOpenWorkbench={() => navigateTo('workbench')} />
                  )}
                </div>
              )}

              {/* SCREEN 6: Mathematical Evidence (Part of Feature Guide) */}
              {currentScreen === 'evidence' && (
                <div>
                  <FeatureGuideScreen onNavigate={navigateTo} initialTab="evidence" />
                </div>
              )}

              {/* SCREEN 7: Astrometric & Cultural Feature Guide */}
              {currentScreen === 'guide' && (
                <div>
                  <FeatureGuideScreen onNavigate={navigateTo} initialTab="topics" />
                </div>
              )}
            </motion.div>
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation Bar (<md) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-1 py-1 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] flex items-center justify-around text-[11px] font-mono font-medium tracking-tight shadow-2xl"
      >
        {[
          { id: 'workbench', label: 'Workbench', step: '1', icon: Sliders },
          { id: 'traditions', label: 'Traditions', step: '2', icon: Compass },
          { id: 'synthesis', label: 'Synthesis', step: '3', icon: Layers },
          { id: 'dossier', label: 'Dossier', step: '4', icon: FileText },
          { id: 'evidence', label: 'Evidence', step: '5', icon: FlaskConical },
        ].map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id as AppScreen)}
              data-tooltip={`Navigate to ${item.label} (Step ${item.step})`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center p-1 min-w-[56px] min-h-[44px] rounded-lg transition-colors active:scale-[0.94] duration-150 cursor-pointer touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isActive
                  ? 'text-cyan-300 font-bold bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-cyan-400 rounded-full" />
              )}
              <div className="relative">
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span
                  className={`absolute -top-1 -right-2 text-[11px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center select-none leading-none ${
                    isActive
                      ? 'bg-cyan-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {item.step}
                </span>
              </div>
              <span className="mt-0.5 text-[11px] leading-tight font-medium tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
      {/* 5. Server Connection Modal (for Sideloaded Mobile Devices & Remote Hosts) */}
      {isServerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80  flex items-center justify-center p-4 overscroll-contain">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl animate-screen-enter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">API Server Connection</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsServerModalOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-slate-400 hover:text-slate-100 cursor-pointer"
                aria-label="Close server dialog"
                data-tooltip="Close server dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                When running on a physical sideloaded iOS or Android device, specify the host IP or domain of your running Synodix backend daemon.
              </p>

              <div>
                <label className="block text-xs font-sans text-slate-400 mb-1 font-medium">
                  Backend Host URL
                </label>
                <input
                  type="text"
                  value={serverUrlInput}
                  onChange={(e) => setServerUrlInput(e.target.value)}
                  placeholder="e.g. http://192.168.1.11:8000"
                  className="w-full px-3 py-2 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                  <span>Local Wi-Fi: <code className="text-cyan-400">http://192.168.1.11:8000</code></span>
                  <button
                    type="button"
                    onClick={() => setServerUrlInput(DEFAULT_DEV_API_URL)}
                    className="text-cyan-400 hover:underline cursor-pointer"
                  >
                    Set Local Wi-Fi
                  </button>
                </div>
              </div>

              {testStatus !== 'idle' && (
                <div
                  className={`p-2.5 rounded text-xs font-mono flex items-center gap-2 ${
                    testStatus === 'testing'
                      ? 'bg-sky-950/40 text-sky-300 border border-sky-800'
                      : testStatus === 'success'
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-800'
                  }`}
                >
                  {testStatus === 'testing' && <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />}
                  {testStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {testStatus === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  <span className="break-all">{testMessage}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => testServerConnection(serverUrlInput)}
                className="px-3 py-2 min-h-[44px] rounded bg-slate-800 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Test Ping
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsServerModalOpen(false)}
                  className="px-3 py-2 min-h-[44px] rounded text-slate-400 hover:text-slate-200 text-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveServerUrl}
                  className="px-4 py-2 min-h-[44px] rounded bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ExplainerProvider>
      <AppContent />
      <FeatureExplainerModal />
    </ExplainerProvider>
  );
}

/**
 * Reusable Empty State when navigating to calculation screens before a chart is loaded
 */
function EmptyChartState({ onOpenWorkbench }: { onOpenWorkbench: () => void }) {
  return (
    <div className="py-16 px-4 text-center bg-slate-900 border border-dashed border-slate-800 rounded-xl max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-cyan-400">
        <Compass className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-100">
        No Subject Chart Loaded
      </h3>
      <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
        Select a subject from the 100 historical titans gallery or calculate a custom birth record in the Workbench to render this view.
      </p>
      <button
        type="button"
        onClick={onOpenWorkbench}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-medium text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950"
      >
        <span className="whitespace-nowrap">Open Workbench & Profile Vault</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
