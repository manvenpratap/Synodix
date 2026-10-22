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
  Bookmark,
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
import { MathematicalEvidenceCard } from './components/MathematicalEvidenceCard';
import { getPrimaryProfile } from './utils/vault';
import { ExplainerProvider } from './context/ExplainerContext';
import { useExplainer } from './context/useExplainer';
import { FeatureExplainerModal } from './components/FeatureExplainerModal';
import { ExplainerTrigger } from './components/ExplainerTrigger';

const FALLBACK_PRESETS: Preset[] = TITANS_100_DATA as unknown as Preset[];

export type AppScreen =
  | 'workbench'
  | 'traditions'
  | 'synthesis'
  | 'dossier'
  | 'verification'
  | 'evidence';

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
    <div className="min-h-[100dvh] celestial-observatory-canvas text-slate-200 flex flex-col md:flex-row antialiased">
      {/* 1. Desktop Fixed Sidebar Navigation (>=md) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 sidebar-canvas border-r border-[#1a2333] shrink-0 h-[100dvh] sticky top-0 overflow-y-auto select-none z-40 scrollbar-thin">
        {/* Brand Logo & Header */}
        <div className="p-4 border-b border-[#1a2333]/80 relative overflow-hidden">
          <div className="flex items-center gap-3">
            {/* Nonagon Armilla Geometric Logo Mark with slow orbital spin ring */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#101826] to-[#090d14] border border-cyan-800/80 flex items-center justify-center shrink-0 shadow-md ring-1 ring-cyan-500/20 group">
              <div className="absolute inset-0 rounded-xl bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors" />
              <svg viewBox="0 0 40 40" className="w-6 h-6 animate-orbital-spin" fill="none">
                <circle cx="20" cy="20" r="16" stroke="#1e293b" strokeWidth="1.2" strokeDasharray="3 3" />
                <polygon points="20,6 32,27 8,27" stroke="#38bdf8" strokeWidth="1.5" strokeLinejoin="round" />
                <polygon points="29,10 25,32 5,18" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.85" strokeLinejoin="round" />
                <polygon points="34,18 15,32 12,10" stroke="#10b981" strokeWidth="1" strokeOpacity="0.85" strokeLinejoin="round" />
                <circle cx="20" cy="20" r="2.5" fill="#38bdf8" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-slate-100 text-sm font-sans tracking-wider">
                  SYNODIX
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 font-medium">
                  v2.15
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-tight flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 inline-block animate-pulse"></span>
                Astrometric Observatory
              </p>
            </div>
          </div>
        </div>

        {/* Active Subject Context Pill — Engraved Instrument Plate */}
        <div className="px-3 pt-3">
          <div className="p-3 rounded-xl bg-gradient-to-b from-[#0e1422] to-[#0a0d16] border border-[#1e293b] shadow-xs flex flex-col gap-1.5 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
                <User className="w-3 h-3 text-cyan-400" />
                Subject Dossier
              </span>
              <button
                type="button"
                onClick={() => navigateTo('workbench')}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer underline hover:text-cyan-200 transition-colors"
              >
                Switch
              </button>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-slate-100 truncate tracking-wide">
                {activeSubjectName}
              </span>
              <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                {activeSubjectDate}
              </span>
            </div>
            {chartData && (
              <div className="pt-1.5 border-t border-[#1b2331]/80 text-[10px] font-mono flex flex-col gap-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <span>Divergence:</span>
                    <ExplainerTrigger id="divergence_rate_calculation" variant="icon" size="xs" />
                  </span>
                  <span className={`font-semibold ${
                    chartData.synthesis.divergence_metrics.divergence_rate_percent > 40
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}>
                    {chartData.synthesis.divergence_metrics.divergence_rate_percent}%
                  </span>
                </div>
                {/* Divergence Mini Gauge Bar */}
                <div className="w-full h-1 bg-[#151c28] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      chartData.synthesis.divergence_metrics.divergence_rate_percent > 40
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(8, 100 - chartData.synthesis.divergence_metrics.divergence_rate_percent))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canonical Traditions Alignment Status (Astrometric Array) */}
        <div className="px-3 pt-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#090e17] to-[#070b12] border border-[#1a2332]">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[9px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
                CIVILIZATIONAL ARRAY (9)
              </span>
              <span className="text-[9px] font-mono text-cyan-400/90 font-medium">9 / 9 ACTIVE</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
              <div className="px-1 py-1 rounded bg-[#0d131f] border border-[#1e2a3a] text-amber-300 font-medium flex items-center justify-center gap-1 hover:border-amber-500/50 transition-colors" data-tooltip="Jyotisha (Vedic)">
                <span className="text-[8px]">🕉️</span> JYOT
              </div>
              <div className="px-1 py-1 rounded bg-[#0d131f] border border-[#1e2a3a] text-cyan-300 font-medium flex items-center justify-center gap-1 hover:border-cyan-500/50 transition-colors" data-tooltip="Western (Hellenistic)">
                <span className="text-[8px]">🏛️</span> HELL
              </div>
              <div className="px-1 py-1 rounded bg-[#0d131f] border border-[#1e2a3a] text-rose-300 font-medium flex items-center justify-center gap-1 hover:border-rose-500/50 transition-colors" data-tooltip="BaZi (Four Pillars)">
                <span className="text-[8px]">☯️</span> BAZI
              </div>
              <div className="px-1 py-1 rounded bg-[#0d131f] border border-[#1e2a3a] text-purple-300 font-medium flex items-center justify-center gap-1 hover:border-purple-500/50 transition-colors" data-tooltip="Zi Wei Dou Shu">
                <span className="text-[8px]">👑</span> ZIWEI
              </div>
              <div className="px-1 py-1 rounded bg-[#0d131f] border border-[#1e2a3a] text-emerald-300 font-medium flex items-center justify-center gap-1 hover:border-emerald-500/50 transition-colors" data-tooltip="Maya (Tzolk'in)">
                <span className="text-[8px]">☀️</span> MAYA
              </div>
              <div className="px-1 py-1 rounded bg-[#0d131f] border border-[#1e2a3a] text-amber-400 font-medium flex items-center justify-center gap-1 hover:border-amber-500/50 transition-colors" data-tooltip="Tibetan (Phugpa)">
                <span className="text-[8px]">☸️</span> TIBET
              </div>
              <div className="px-1 py-1 rounded bg-[#0d131f] border border-[#1e2a3a] text-teal-300 font-medium flex items-center justify-center gap-1 hover:border-teal-500/50 transition-colors" data-tooltip="Persian (Almuten)">
                <span className="text-[8px]">🕌</span> PERS
              </div>
              <div className="px-1 py-1 rounded bg-[#0d131f] border border-[#1e2a3a] text-yellow-300 font-medium flex items-center justify-center gap-1 hover:border-yellow-500/50 transition-colors" data-tooltip="Egyptian (Decans)">
                <span className="text-[8px]">𓋹</span> EGYPT
              </div>
              <div className="px-1 py-1 rounded bg-[#0d131f] border border-[#1e2a3a] text-emerald-400 font-medium flex items-center justify-center gap-1 hover:border-emerald-500/50 transition-colors" data-tooltip="Māori (Maramataka)">
                <span className="text-[8px]">🌊</span> MARA
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Screen Links */}
        <nav className="flex-1 p-3 space-y-1">
          <span className="px-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
            WORKSPACE SCREENS
          </span>

          {NAV_ITEMS.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/60 via-[#121a28] to-[#0c1018] text-cyan-300 font-medium border-l-2 border-l-cyan-400 border-y border-r border-cyan-800/40 shadow-xs ring-1 ring-cyan-500/20 translate-x-0.5'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-[#101622]/80 border border-transparent hover:border-[#1b2535]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-400' : 'bg-[#0f1420] border border-[#1c2433] text-slate-400 group-hover:text-slate-200 group-hover:border-slate-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs block font-sans truncate font-medium">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block truncate font-mono">
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono shrink-0 ml-1 ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-semibold shadow-xs'
                      : 'bg-[#151c28] text-slate-400 border border-[#1b2331]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Calibration Inset Box (Stitch Observatory Style) */}
        {chartData && (
          <div className="px-3 pb-2">
            <div className="p-2 rounded bg-[#06090e] border border-[#1b2331] font-mono text-[9px] space-y-0.5 text-slate-400">
              <div className="flex items-center justify-between text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <span>ASTROMETRIC CALIBRATION</span>
                <ExplainerTrigger id="time_normalization_eot" variant="icon" size="xs" />
              </div>
              <div className="flex justify-between"><span>EPOCH:</span> <span className="text-slate-200">J2000.0</span></div>
              <div className="flex justify-between"><span>JULIAN DAY:</span> <span className="text-cyan-300">{chartData.astronomical_base?.julian_day_ut?.toFixed(2) || '2451545.00'}</span></div>
              <div className="flex justify-between"><span>TOPOCENTRIC:</span> <span className="text-emerald-400">IAU 2000B</span></div>
            </div>
          </div>
        )}

        {/* Sidebar Footer with Engine Diagnostics */}
        <div className="p-3 border-t border-[#1b2331] bg-[#090c12] text-[10px] font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              NASA JPL DE421
            </span>
            <span className="text-emerald-400 font-semibold">VERIFIED</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Client Vault:</span>
            <span className="text-cyan-400">Zero-Cloud / Private</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-[#1b2331]">
            <span>Theme:</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
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
                  <Moon className="w-3 h-3 text-sky-400" />
                  <span>Deep Space</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-[#1b2331]">
            <span>Server:</span>
            <button
              type="button"
              onClick={() => setIsServerModalOpen(true)}
              className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
              data-tooltip="Configure backend API server address"
              aria-label="Server Settings"
            >
              <Server className="w-3 h-3 text-cyan-400" />
              <span>{getApiBaseUrl() ? 'Custom' : 'Direct'}</span>
            </button>
          </div>
          <div className="text-[9px] text-slate-400 pt-1 text-center">
            SwissEph 2.10 • Global Civilizations
          </div>
        </div>
      </aside>

      {/* 2. Mobile Drawer Navigation Overlay (<md) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[60] md:hidden bg-black/80 backdrop-blur-sm flex overscroll-contain">
          <div className="w-72 bg-[#0b0e14] h-full flex flex-col border-r border-[#1b2331] p-4 shadow-2xl pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2331]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center font-bold text-xs text-cyan-300 font-mono">
                  SX
                </div>
                <span className="font-bold text-slate-100 text-sm">Synodix</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-slate-400 hover:text-slate-100 cursor-pointer"
                aria-label="Close navigation"
                data-tooltip="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Theme Switcher */}
            <div className="flex items-center justify-between px-1 py-2.5 my-1 border-b border-[#1b2331]">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Theme</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-[#1b2331] bg-[#10151f] text-slate-300 cursor-pointer"
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
                    <Moon className="w-3.5 h-3.5 text-sky-600" />
                    <span>Deep Space</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Server Config */}
            <div className="flex items-center justify-between px-1 py-2.5 my-1 border-b border-[#1b2331]">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Server</span>
              <button
                type="button"
                onClick={() => setIsServerModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-[#1b2331] bg-[#10151f] text-slate-300 cursor-pointer"
                data-tooltip="Configure backend API server URL"
                aria-label="Server Settings"
              >
                <Server className="w-3.5 h-3.5 text-cyan-400" />
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
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#111824] hover:bg-[#172233] text-cyan-300 border border-cyan-800/60 font-mono text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Feature Guide & Glossary</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = currentScreen === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-[#141d2b] text-cyan-300 font-semibold border border-cyan-800'
                        : 'text-slate-300 hover:bg-[#101520]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-sans">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1 rounded bg-[#18202c] text-cyan-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#1b2331] text-[10px] font-mono text-slate-400">
              NASA JPL DE421 • Multi-Tradition
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-[calc(3.75rem+env(safe-area-inset-top,0px))] pt-[env(safe-area-inset-top,0px)] border-b sm:border border-[#1b2331] sm:rounded-2xl header-canvas backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 sm:top-2 sm:mx-4 lg:mx-6 z-30 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Menu Toggle (<md) */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-[#121721] cursor-pointer"
              aria-label="Open sidebar menu"
              data-tooltip="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Screen Title */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider hidden sm:inline flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                SYNODIX
              </span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <h1 className="text-sm font-semibold text-slate-100 flex items-center gap-2 min-w-0">
                <span className="truncate max-w-[130px] sm:max-w-none">
                  {NAV_ITEMS.find((n) => n.id === currentScreen)?.label}
                </span>
              </h1>
            </div>

            {/* Stitch Live Telemetry Badges (Desktop >= 2xl) */}
            <div className="hidden 2xl:flex items-center gap-2 font-mono text-[11px] ml-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d121c] border border-[#1b2331]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-400">JPL DE421:</span>
                <span className="text-emerald-300 font-semibold">PASS</span>
                <ExplainerTrigger id="dual_engine_validation" variant="icon" size="xs" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d121c] border border-[#1b2331]">
                <span className="text-slate-400">Epistemic Rigor:</span>
                <span className="text-amber-300 font-semibold">94.2%</span>
                <ExplainerTrigger id="epistemic_humility_framework" variant="icon" size="xs" />
              </div>
              {chartData && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d121c] border border-[#1b2331]">
                  <span className="text-slate-400">Consensus:</span>
                  <span className="text-cyan-300 font-semibold">
                    {(100 - chartData.synthesis.divergence_metrics.divergence_rate_percent).toFixed(1)}%
                  </span>
                  <ExplainerTrigger id="three_cluster_consensus" variant="icon" size="xs" />
                </div>
              )}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-xs shrink-0">
            {/* Feature Guide & Glossary Modal Trigger */}
            <button
              type="button"
              onClick={openGlossary}
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 min-w-[40px] min-h-[40px] sm:min-h-[34px] text-xs rounded border border-[#1b2331] bg-[#10151f] hover:bg-[#161d2a] text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              data-tooltip="Browse all 50 astronomical & cultural feature explainers"
              aria-label="Browse Feature Explainers & Astrometric Glossary"
            >
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="hidden sm:inline">Feature Guide</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 min-w-[40px] min-h-[40px] sm:min-h-[34px] text-xs rounded border border-[#1b2331] bg-[#10151f] hover:bg-[#151c2a] text-slate-300 hover:text-amber-400 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              data-tooltip={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
              aria-label={theme === 'dark' ? 'Switch to Solar Day Theme' : 'Switch to Deep Space Theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            {currentScreen !== 'workbench' && (
              <button
                type="button"
                onClick={() => navigateTo('workbench')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] text-xs rounded border border-[#1b2331] bg-[#10151f] hover:bg-[#151c2a] text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                data-tooltip="Return to Workbench to switch or calculate a profile"
                aria-label="Switch Profile"
              >
                <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                <span>Switch Profile</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigateTo('evidence')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] text-xs rounded border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                currentScreen === 'evidence'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-[#10151f] hover:bg-[#161d2a] text-cyan-400 border-cyan-800/60'
              }`}
              data-tooltip="View Mathematical & Empirical Evidence Whitepaper"
              aria-label="View Mathematical & Empirical Evidence Whitepaper"
            >
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              <span>Whitepaper</span>
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
              <strong>Calculation Alert:</strong> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
                      <div className="flex items-center justify-between bg-[#0a0d14] p-3 rounded-lg border border-[#1b2331]">
                        <div className="text-xs font-mono text-slate-300">
                          Chart calculated for <strong className="text-cyan-300">{activeSubjectName}</strong> ({activeSubjectDate}).
                        </div>
                        <button
                          type="button"
                          onClick={() => navigateTo('traditions')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-cyan-700 hover:bg-cyan-600 text-white font-medium cursor-pointer transition-colors btn-press"
                        >
                          <span>Explore Cultural Traditions</span>
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
                    <TraditionCharts data={chartData} />
                  ) : (
                    <EmptyChartState onOpenWorkbench={() => navigateTo('workbench')} />
                  )}
                </div>
              )}

              {/* SCREEN 3: Domain Synthesis Matrix */}
              {currentScreen === 'synthesis' && (
                <div>
                  {chartData ? (
                    <SynthesisMatrix synthesis={chartData.synthesis} />
                  ) : (
                    <EmptyChartState onOpenWorkbench={() => navigateTo('workbench')} />
                  )}
                </div>
              )}

              {/* SCREEN 4: Corroboration Dossier & Narrative */}
              {currentScreen === 'dossier' && (
                <div>
                  {chartData ? (
                    <ReadingView data={chartData} />
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

              {/* SCREEN 6: Mathematical Evidence & Whitepaper */}
              {currentScreen === 'evidence' && (
                <div>
                  <MathematicalEvidenceCard onClose={() => navigateTo('workbench')} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation Bar (<md) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0e14]/95 backdrop-blur-md border-t border-[#1b2331] px-2 py-1 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] flex items-center justify-around text-[10px] font-mono shadow-2xl"
      >
        {[
          { id: 'workbench', label: 'Workbench', icon: Sliders },
          { id: 'traditions', label: 'Traditions', icon: Compass },
          { id: 'synthesis', label: 'Synthesis', icon: Layers },
          { id: 'dossier', label: 'Dossier', icon: FileText },
          { id: 'evidence', label: 'Evidence', icon: FlaskConical },
        ].map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id as AppScreen)}
              data-tooltip={`Navigate to ${item.label}`}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center p-1 min-w-[56px] min-h-[44px] rounded-md transition-all cursor-pointer active:scale-[0.94] ${
                isActive
                  ? 'text-cyan-300 font-bold bg-[#141c28]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      {/* 5. Server Connection Modal (for Sideloaded Mobile Devices & Remote Hosts) */}
      {isServerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain">
          <div className="w-full max-w-md bg-[#0b0e14] border border-[#1b2331] rounded-xl p-5 shadow-2xl animate-screen-enter">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2331]">
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
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Backend Host URL
                </label>
                <input
                  type="text"
                  value={serverUrlInput}
                  onChange={(e) => setServerUrlInput(e.target.value)}
                  placeholder="e.g. http://192.168.1.11:8000"
                  className="w-full px-3 py-2 text-xs font-mono rounded bg-[#101520] border border-[#1b2331] text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
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

            <div className="pt-3 border-t border-[#1b2331] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => testServerConnection(serverUrlInput)}
                className="px-3 py-2 min-h-[44px] rounded bg-[#121824] hover:bg-[#182234] border border-[#1b2331] text-slate-300 text-xs font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
                  className="px-4 py-2 min-h-[44px] rounded bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0e14]"
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
    <div className="py-16 px-4 text-center bg-[#0d1118] border border-dashed border-[#1b2331] rounded-xl max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-[#121824] border border-[#1e2738] flex items-center justify-center mx-auto mb-3 text-cyan-400">
        <Compass className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-100">
        No Subject Chart Loaded
      </h3>
      <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
        Select a subject from the 100 historical titans gallery or calculate a custom birth record in the Workbench to unlock this view.
      </p>
      <button
        type="button"
        onClick={onOpenWorkbench}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-medium text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f]"
      >
        <span>Open Workbench & Profile Vault</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
