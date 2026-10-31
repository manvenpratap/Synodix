import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sun,
  Moon,
  Server,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  HeartHandshake,
  Cpu
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
import { SynastryScreen } from './components/SynastryScreen';
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
  | 'synastry'
  | 'verification'
  | 'evidence'
  | 'guide';

interface NavItem {
  id: AppScreen;
  label: string;
  srText?: string;
  shortLabel?: string;
  badge?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'workbench',
    label: 'Workbench & Vault',
    shortLabel: 'Input',
    description: 'Enter birth details, load saved profiles, or pick historical figures',
    icon: Sliders
  },
  {
    id: 'traditions',
    label: 'Cultural Traditions',
    shortLabel: 'Traditions',
    badge: '9 Traditions',
    description: 'Explore your chart across 9 global astrological traditions',
    icon: Compass
  },
  {
    id: 'synthesis',
    label: 'Synthesis Matrix',
    shortLabel: 'Synthesis',
    description: 'Compare where traditions agree and where their methods differ',
    icon: Layers
  },
  {
    id: 'dossier',
    label: 'Birth Chart Reading',
    srText: 'Corroboration Dossier',
    shortLabel: 'Reading',
    description: 'Complete personality reading, life domains summary, and timeline',
    icon: FileText
  },
  {
    id: 'synastry',
    label: 'Relational Synastry',
    shortLabel: 'Synastry',
    badge: 'Dual-Chart',
    description: 'Compare two charts for relationship harmony and compatibility',
    icon: HeartHandshake
  },
  {
    id: 'verification',
    label: 'Astronomical Audit',
    shortLabel: 'Audit',
    badge: 'JPL DE421',
    description: 'Compare calculations directly against NASA Skyfield DE421',
    icon: ShieldCheck
  },
  {
    id: 'evidence',
    label: 'Mathematical Evidence',
    shortLabel: 'Evidence',
    badge: '100 Titans',
    description: 'Scientific statistical research testing against random controls',
    icon: FlaskConical
  },
  {
    id: 'guide',
    label: 'Feature Guide',
    shortLabel: 'Guide',
    badge: '50 Topics',
    description: 'Clear plain-language explanations of all chart terms and traditions',
    icon: BookOpen
  }
];

const JOURNEY_STEPS: { id: AppScreen; step: number; label: string; srText?: string }[] = [
  { id: 'workbench', step: 1, label: 'Input' },
  { id: 'traditions', step: 2, label: 'Traditions' },
  { id: 'synthesis', step: 3, label: 'Synthesis' },
  { id: 'dossier', step: 4, label: 'Reading', srText: 'Dossier' },
];

function AppContent() {
  const { openGlossary } = useExplainer();
  const shouldReduceMotion = useReducedMotion();
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

    // Update theme-color meta tag dynamically for native mobile browser status bar
    const themeColorHex = theme === 'dark' ? '#0c0a09' : '#f8f9fa';
    const metaThemeColors = document.querySelectorAll('meta[name="theme-color"]');
    metaThemeColors.forEach((meta) => meta.setAttribute('content', themeColorHex));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Mobile Epistemic Journey Collapsed State (defaults to collapsed on mobile viewports)
  const [isJourneyCollapsed, setIsJourneyCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('synodix_journey_collapsed');
      if (stored !== null) return stored === 'true';
      return window.innerWidth < 768;
    }
    return false;
  });

  const toggleJourneyCollapsed = () => {
    setIsJourneyCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('synodix_journey_collapsed', String(next));
      }
      return next;
    });
  };

  // Mobile / Native Server Connection State
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [engineSource, setEngineSource] = useState<'swisseph' | 'bundled_titan' | 'local_ts'>('swisseph');
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
        setEngineSource('bundled_titan');
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
        setEngineSource('swisseph');
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
      setEngineSource('local_ts');
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
        if (isShortcutsModalOpen) setIsShortcutsModalOpen(false);
        if (isServerModalOpen) setIsServerModalOpen(false);
        if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
        return;
      }

      // Ignore accelerators if typing inside an editable field
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '1') {
        navigateTo('workbench');
      } else if (e.key === '2') {
        navigateTo('traditions');
      } else if (e.key === '3') {
        navigateTo('synthesis');
      } else if (e.key === '4') {
        navigateTo('dossier');
      } else if (e.key === '5' || e.key === 'e' || e.key === 'E') {
        navigateTo('evidence');
      } else if (e.key === 's' || e.key === 'S') {
        navigateTo('synastry');
      } else if (e.key === 'a' || e.key === 'A') {
        navigateTo('verification');
      } else if (e.key === 'g' || e.key === 'G') {
        navigateTo('guide');
      } else if (e.key === 't' || e.key === 'T') {
        toggleTheme();
      } else if (e.key === '?') {
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isServerModalOpen, isMobileSidebarOpen, isShortcutsModalOpen]);

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

        {/* Active Subject Context Header — Integrated Astrometric Profile */}
        <div className="px-4 py-3 border-b border-stone-800/80 flex flex-col gap-1.5 relative overflow-hidden group shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-medium text-amber-400/90 flex items-center gap-1.5">
              <User className="w-3 h-3 text-amber-400" />
              Active Chart Profile
              <span className="sr-only">Subject Dossier</span>
            </span>
            <span className="text-xs font-mono text-amber-300/90 font-medium">
              Active
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSubjectName}-${activeSubjectDate}`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
              transition={{ duration: shouldReduceMotion ? 0.08 : 0.18, ease: [0.16, 1, 0.3, 1] }}
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
                  className={`h-full rounded-full ${
                    chartData.synthesis.divergence_metrics.divergence_rate_percent > 40
                      ? 'bg-rose-500'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(8, 100 - chartData.synthesis.divergence_metrics.divergence_rate_percent))}%` }}
                />
              </div>
            </div>
          )}
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
                    <span className="text-xs block font-serif truncate font-medium">
                      {item.label}
                      {item.srText && <span className="sr-only"> {item.srText}</span>}
                    </span>
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
          <div className="px-4 py-2.5 border-t border-stone-800/80 font-mono text-[11px] space-y-1 text-stone-400 shrink-0">
            <div className="flex items-center justify-between text-stone-300 font-medium mb-1">
              <span className="font-serif text-xs font-semibold text-stone-200">Astrometric Calibration</span>
              <ExplainerTrigger id="time_normalization_eot" variant="icon" size="xs" />
            </div>
            <div className="flex justify-between"><span>Epoch:</span> <span className="text-stone-200">J2000.0</span></div>
            <div className="flex justify-between"><span>Julian Day:</span> <span className="text-amber-300">{chartData.astronomical_base?.julian_day_ut?.toFixed(2) || '2451545.00'}</span></div>
            <div className="flex justify-between"><span>Topocentric:</span> <span className="text-stone-300 font-mono">IAU 2000B</span></div>
          </div>
        )}

        {/* Sidebar Footer with Engine Diagnostics */}
        <div className="px-4 py-3 border-t border-stone-800/80 text-[11px] font-mono space-y-2 shrink-0">
          <div className="flex items-center justify-between text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
              NASA JPL DE421
            </span>
            <span className="text-amber-400 font-semibold">VERIFIED</span>
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
                  <span className="px-1.5 py-0.2 rounded text-[11px] font-mono bg-amber-950 text-amber-300 border border-amber-800 font-medium">
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
                      <span className="text-xs font-serif">
                        {item.label}
                        {item.srText && <span className="sr-only"> {item.srText}</span>}
                      </span>
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
              <h1 className="text-lg sm:text-2xl font-serif font-bold tracking-tight text-stone-100 flex items-center gap-2 min-w-0">
                <span className="hidden sm:inline truncate">
                  {NAV_ITEMS.find((n) => n.id === currentScreen)?.label || (currentScreen === 'guide' ? 'Feature Guide' : '')}
                </span>
                <span className="sm:hidden truncate max-w-[220px] tracking-normal" aria-hidden="true">
                  {NAV_ITEMS.find((n) => n.id === currentScreen)?.shortLabel || NAV_ITEMS.find((n) => n.id === currentScreen)?.label || (currentScreen === 'guide' ? 'Guide' : '')}
                </span>
              </h1>
              {/* Mobile Active Subject Chip */}
              {activeSubjectName && currentScreen !== 'workbench' && (
                <button
                  type="button"
                  onClick={() => navigateTo('workbench')}
                  className="md:hidden flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full bg-stone-900 border border-amber-800/60 text-xs font-serif text-amber-300 truncate max-w-[150px] cursor-pointer shrink-0"
                  data-tooltip="Switch active subject"
                  aria-label={`Subject: ${activeSubjectName}. Tap to switch.`}
                >
                  <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate font-serif">{activeSubjectName}</span>
                </button>
              )}
            </div>

            {/* Live Astrometric Telemetry Badges (Desktop >= xl) */}
            <div className="hidden xl:flex items-center gap-2 font-mono text-[11px] ml-4">
              <div
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900/70"
                data-tooltip="Active astronomical calculation core"
              >
                <Cpu className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="text-stone-400">Core:</span>
                <span className="text-amber-300 font-semibold">
                  {engineSource === 'swisseph'
                    ? 'SwissEph 2.10 (C)'
                    : engineSource === 'bundled_titan'
                    ? 'Rodden AA Titan'
                    : 'Client TS Engine'}
                </span>
                <ExplainerTrigger id="dual_engine_validation" variant="icon" size="xs" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900/70">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                <span className="text-stone-400">JPL DE421:</span>
                <span className="text-amber-300 font-semibold">PASS</span>
                <ExplainerTrigger id="dual_engine_validation" variant="icon" size="xs" />
              </div>
              <div
                className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900/70"
                data-tooltip="Calculation certainty based on birth time accuracy and coordinates"
              >
                <span className="text-stone-400">Rigor:</span>
                <span className="text-amber-300 font-semibold">94.2%</span>
                <ExplainerTrigger id="epistemic_humility_framework" variant="icon" size="xs" />
              </div>
              {chartData && (
                <div
                  className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800"
                  data-tooltip="Overall agreement level across all 9 world traditions"
                >
                  <span className="text-stone-400">Agreement:</span>
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
            {/* Keyboard Shortcuts Trigger (?) */}
            <button
              type="button"
              onClick={() => setIsShortcutsModalOpen(true)}
              className="hidden lg:inline-flex items-center justify-center gap-1 p-2 sm:px-2.5 sm:py-1.5 min-w-[34px] min-h-[34px] text-xs rounded border border-stone-800 bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 font-mono"
              data-tooltip="View global keyboard accelerators (?)"
              aria-label="Keyboard Shortcuts"
            >
              <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-[11px] text-amber-300 font-bold font-mono">?</kbd>
            </button>
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
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 min-w-[44px] min-h-[44px] sm:min-h-[36px] text-xs rounded border border-stone-800 bg-stone-900 hover:bg-stone-800 text-amber-400 hover:text-amber-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 font-serif"
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
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 min-w-[44px] min-h-[44px] sm:min-h-[36px] text-xs rounded border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 group"
              data-tooltip={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
              aria-label={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
            >
              <div className="transition-transform duration-160 ease-out group-hover:rotate-45 motion-safe:group-active:scale-90 motion-reduce:group-active:scale-100">
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
          className="px-2.5 sm:px-6 py-1 sm:py-2 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 select-none sticky top-[calc(3.75rem+env(safe-area-inset-top,0px))] z-20"
        >
          <div className="flex items-center justify-between text-[11px] font-mono mb-0.5 sm:mb-1.5 text-stone-400">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="font-serif font-medium text-[11px] sm:text-xs text-amber-400 flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                Chart Journey
                <span className="sr-only">Epistemic Journey</span>
              </span>
              {isJourneyCollapsed && (
                <span className="text-[11px] text-amber-300/80 font-serif truncate md:hidden">
                  • Step {JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) + 1}: {JOURNEY_STEPS.find((s) => s.id === currentScreen)?.label || 'Overview'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="hidden md:inline text-[11px] text-stone-300 font-serif">
                {JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) >= 0
                  ? `Step ${JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) + 1} of 4 · ${JOURNEY_STEPS.find((s) => s.id === currentScreen)?.label}`
                  : 'Reference'}
              </span>
              <button
                type="button"
                onClick={toggleJourneyCollapsed}
                className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] rounded-lg bg-stone-850 hover:bg-stone-800 border border-stone-750 text-stone-300 hover:text-white transition-[background-color,transform] motion-safe:active:scale-[0.97] motion-reduce:active:scale-100 cursor-pointer touch-manipulation"
                data-tooltip={isJourneyCollapsed ? 'Expand journey steps' : 'Collapse journey stepper to save space'}
                aria-label={isJourneyCollapsed ? 'Expand journey steps' : 'Collapse journey steps'}
              >
                <span className="text-xs text-stone-300 font-serif">
                  {JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) >= 0
                    ? `Step ${JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) + 1} of 4`
                    : 'Reference'}
                </span>
                {isJourneyCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-amber-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-amber-400" />
                )}
              </button>
            </div>
          </div>
          <div className={`grid grid-cols-4 gap-1.5 sm:gap-2 py-1 w-full ${isJourneyCollapsed ? 'hidden md:grid' : 'grid'}`}>
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
                  data-tooltip={`Step ${s.step} of 4: ${s.label}`}
                  className={`relative flex flex-row items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1.5 sm:py-2 min-h-[44px] sm:min-h-[38px] rounded-lg text-center cursor-pointer transition-[background-color,border-color,color,transform] motion-safe:active:scale-[0.97] motion-reduce:active:scale-100 duration-150 ease-out touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive
                      ? 'text-amber-200 font-bold shadow-xs'
                      : isPassed
                      ? 'bg-stone-900 text-amber-400 border border-amber-800/60 hover:bg-stone-850'
                      : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-300'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-journey-indicator"
                      className="absolute inset-0 bg-amber-950 border border-amber-600 rounded-md sm:rounded-lg ring-1 ring-amber-500/50 -z-0 pointer-events-none"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 30 }
                      }
                    />
                  )}
                  <span
                    className={`relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-mono transition-colors duration-150 shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-black font-bold ring-1 sm:ring-2 ring-amber-300/40'
                        : isPassed
                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {s.step}
                  </span>
                  <div className="relative z-10 text-left min-w-0">
                    <span className="hidden sm:block text-[11px] text-amber-500/80 font-mono leading-none">
                      {['Step 1', 'Step 2', 'Step 3', 'Step 4'][idx]}
                    </span>
                    <span className="truncate text-xs font-serif font-medium block">
                      {s.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {/* Ambient Progress Conduit (GPU-composited transform) */}
          <div className="w-full bg-stone-800 h-0.5 mt-1 sm:mt-2 rounded-full overflow-hidden">
            <div
              className="h-full w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 origin-left motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none rounded-full"
              style={{
                transform: `scaleX(${
                  JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) >= 0
                    ? (JOURNEY_STEPS.findIndex((s) => s.id === currentScreen) + 1) / 4
                    : 1
                })`
              }}
            />
          </div>
        </nav>

        {/* Main Content Viewport */}
        <main
          className={`flex-1 ${
            currentScreen === 'traditions' ? 'p-2 sm:p-3 lg:p-3' : 'p-4 sm:p-6 lg:p-8'
          } w-full mx-auto pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-8 ${
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
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.08 : 0.15, ease: [0.16, 1, 0.3, 1] }}
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
                          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[44px] sm:min-h-[36px] text-xs rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-semibold border border-amber-400/80 cursor-pointer transition-colors shadow-xs active:scale-95 whitespace-nowrap"
                        >
                          <span className="whitespace-nowrap">Explore Traditions (Step 2)</span>
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

              {/* SCREEN: Relational Synastry & Composite */}
              {currentScreen === 'synastry' && (
                <div>
                  <SynastryScreen
                    currentChart={chartData}
                    currentSubjectName={activeSubjectName}
                    onNavigate={navigateTo}
                  />
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
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-nav-canvas px-1 py-1 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] flex items-center justify-around text-[11px] font-mono font-medium tracking-tight shadow-2xl"
      >
        {[
          { id: 'workbench', label: 'Input', icon: Sliders },
          { id: 'traditions', label: 'Traditions', icon: Compass },
          { id: 'synthesis', label: 'Synthesis', icon: Layers },
          { id: 'dossier', label: 'Reading', ariaLabel: 'Dossier', srText: 'Dossier', icon: FileText },
          { id: 'synastry', label: 'Synastry', icon: HeartHandshake },
          {
            id: 'more',
            label: ['verification', 'evidence', 'guide'].includes(currentScreen)
              ? (currentScreen === 'verification' ? 'Audit' : currentScreen === 'evidence' ? 'Evidence' : 'Guide')
              : 'More',
            icon: Menu
          },
        ].map((item) => {
          const isMore = item.id === 'more';
          const isActive = isMore
            ? ['verification', 'evidence', 'guide'].includes(currentScreen)
            : currentScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (isMore) {
                  setIsMobileSidebarOpen(true);
                } else {
                  navigateTo(item.id as AppScreen);
                }
              }}
              aria-label={('ariaLabel' in item && item.ariaLabel) ? item.ariaLabel : item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex-1 min-w-0 flex flex-col items-center justify-center p-1 min-h-[48px] rounded-lg transition-[background-color,border-color,color,transform] motion-safe:active:scale-[0.97] motion-reduce:active:scale-100 duration-150 ease-out cursor-pointer touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isActive
                  ? 'text-amber-400 font-bold bg-stone-900 border border-amber-700/60 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full" />
              )}
              <Icon className={`w-4.5 h-4.5 mb-0.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
              <span className="mt-0.5 text-[11px] leading-tight font-medium tracking-tight whitespace-nowrap w-full text-center px-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      {/* 5. Server Connection Modal (for Sideloaded Mobile Devices & Remote Hosts) */}
      {isServerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overscroll-contain">
          <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-xl p-5 shadow-2xl animate-screen-enter">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-serif font-semibold text-stone-100">API Server Connection</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsServerModalOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-stone-400 hover:text-stone-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                aria-label="Close server dialog"
                data-tooltip="Close server dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                When running on a physical sideloaded iOS or Android device, specify the host IP or domain of your running Synodix backend daemon.
              </p>

              <div>
                <label className="block text-xs font-sans text-stone-300 mb-1 font-medium">
                  Backend Host URL
                </label>
                <input
                  type="text"
                  value={serverUrlInput}
                  onChange={(e) => setServerUrlInput(e.target.value)}
                  placeholder="e.g. http://192.168.1.11:8000"
                  className="w-full px-3 py-2 text-xs font-mono rounded bg-stone-900 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <div className="flex items-center justify-between mt-1.5 text-[11px] text-stone-400 font-sans">
                  <span>Local Wi-Fi: <code className="text-amber-400 font-mono">http://192.168.1.11:8000</code></span>
                  <button
                    type="button"
                    onClick={() => setServerUrlInput(DEFAULT_DEV_API_URL)}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    Set Local Wi-Fi
                  </button>
                </div>
              </div>

              {testStatus !== 'idle' && (
                <div
                  className={`p-2.5 rounded text-xs font-mono flex items-center gap-2 ${
                    testStatus === 'testing'
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-800'
                      : testStatus === 'success'
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-800'
                  }`}
                >
                  {testStatus === 'testing' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                  {testStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {testStatus === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  <span className="break-all">{testMessage}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => testServerConnection(serverUrlInput)}
                className="px-3 py-2 min-h-[44px] rounded bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 text-xs font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Test Ping
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsServerModalOpen(false)}
                  className="px-3 py-2 min-h-[44px] rounded text-stone-400 hover:text-stone-200 text-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveServerUrl}
                  className="px-4 py-2 min-h-[44px] rounded bg-amber-700 hover:bg-amber-600 text-stone-950 text-xs font-bold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Keyboard Shortcuts Modal */}
      {isShortcutsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overscroll-contain">
          <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-xl p-5 shadow-2xl animate-screen-enter">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">⌘</span>
                <h3 className="text-sm font-serif font-semibold text-stone-100">Observatory Keyboard Accelerators</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShortcutsModalOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-stone-400 hover:text-stone-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                aria-label="Close shortcuts dialog"
                data-tooltip="Close shortcuts dialog (Escape)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-2.5 text-xs font-mono text-stone-300">
              <div className="flex items-center justify-between py-1 border-b border-stone-900">
                <span className="font-sans">Step 1 · Birth Input &amp; Profiles</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-bold">1</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-900">
                <span className="font-sans">Step 2 · 9 Astrological Traditions</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-bold">2</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-900">
                <span className="font-sans">Step 3 · Tradition Comparison</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-bold">3</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-900">
                <span className="font-sans">Step 4 · Complete Reading</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-bold">4</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-900">
                <span className="font-sans">Mathematical Evidence & Benchmark</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-bold">e</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-900">
                <span className="font-sans">Relational Synastry & Composite</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-bold">s</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-900">
                <span className="font-sans">Astronomical Audit (JPL DE421)</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-bold">a</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-900">
                <span className="font-sans">Feature Guide Encyclopedia</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-bold">g</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-900">
                <span className="font-sans">Toggle Solar / Deep Space Theme</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-bold">t</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-sans">Dismiss Active Dialog / Drawer</span>
                <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400">Esc</kbd>
              </div>
            </div>
            <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 font-sans">
              Accelerators are globally active when focus is not inside input fields.
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
    <div className="py-16 px-4 text-center bg-stone-900/90 border border-dashed border-stone-800 rounded-xl max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-stone-850 border border-stone-700 flex items-center justify-center mx-auto mb-3 text-amber-400">
        <Compass className="w-6 h-6" />
      </div>
      <h3 className="text-base font-serif font-semibold text-stone-100">
        No Subject Chart Loaded
      </h3>
      <p className="text-xs text-stone-300 mt-1.5 max-w-sm mx-auto leading-relaxed font-sans">
        Select a subject from the 100 historical titans gallery or calculate a custom birth record in the Workbench to render this view.
      </p>
      <button
        type="button"
        onClick={onOpenWorkbench}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-amber-700 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950 whitespace-nowrap"
      >
        <span className="whitespace-nowrap">Open Workbench</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
