import React, { useState, useEffect } from 'react';
import { BirthInput, ChartResponse, Preset } from './types';
import { BirthDataForm } from './components/BirthDataForm';
import { InputAuditCard } from './components/InputAuditCard';
import { VerificationCard } from './components/VerificationCard';
import { TraditionCharts } from './components/TraditionCharts';
import { SynthesisMatrix } from './components/SynthesisMatrix';
import { ReadingView } from './components/ReadingView';
import { Compass, ShieldCheck, Cpu, GitCompare, Layers, Sparkles, FileText } from 'lucide-react';

const FALLBACK_PRESETS: Preset[] = [
  {
    id: 'sample-1',
    name: 'Steve Jobs',
    birth_date: '1955-02-24',
    birth_time: '19:15',
    time_certainty: 'exact',
    latitude: 37.7749,
    longitude: -122.4194,
    city_name: 'San Francisco',
    country_name: 'USA',
    gender: 'male',
    note: 'Birth certificate recorded time'
  },
  {
    id: 'sample-2',
    name: 'Albert Einstein',
    birth_date: '1879-03-14',
    birth_time: '11:30',
    time_certainty: 'rounded_15',
    latitude: 48.4011,
    longitude: 9.9876,
    city_name: 'Ulm',
    country_name: 'Germany',
    gender: 'male',
    note: 'Historical birth registry ±15m'
  },
  {
    id: 'sample-3',
    name: 'Carl Jung',
    birth_date: '1875-07-26',
    birth_time: '19:32',
    time_certainty: 'exact',
    latitude: 47.6083,
    longitude: 9.3241,
    city_name: 'Kesswil',
    country_name: 'Switzerland',
    gender: 'male',
    note: 'Father diary record'
  }
];

export function App() {
  const [chartData, setChartData] = useState<ChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState<Preset[]>(FALLBACK_PRESETS);
  const [activeSection, setActiveSection] = useState<string>('all');

  const fetchPresets = async () => {
    try {
      const res = await fetch('/api/sample-charts');
      if (res.ok) {
        const data = await res.json();
        setPresets(data);
      }
    } catch {
      // Use fallback presets
    }
  };

  const handleCompute = async (input: BirthInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/compute-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'Chart calculation failed');
      }

      const data: ChartResponse = await res.json();
      setChartData(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during calculation');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
    // Run initial computation for Steve Jobs preset
    handleCompute({
      birth_date: '1955-02-24',
      birth_time: '19:15',
      time_certainty: 'exact',
      latitude: 37.7749,
      longitude: -122.4194,
      city_name: 'San Francisco',
      country_name: 'USA',
      gender: 'male',
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  SIX-CULTURE VERIFIED CHART & READING
                </h1>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Jyotisha • BaZi • Western • Zi Wei • Maya • Tibetan
              </p>
            </div>
          </div>

          {/* Engine Status Indicators */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              SwissEph + JPL DE421
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero Rectification
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Step 1: Input Form */}
        <section id="step-1">
          <BirthDataForm
            onCompute={handleCompute}
            isLoading={isLoading}
            samplePresets={presets}
          />
        </section>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-sm">
            <strong>Calculation Error:</strong> {error}
          </div>
        )}

        {/* Calculated Results */}
        {chartData && (
          <>
            {/* Quick Filter Navigation Bar */}
            <div className="sticky top-20 z-40 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
              <div className="flex items-center gap-1">
                {[
                  { id: 'all', label: 'Complete View', icon: Layers },
                  { id: 'audit', label: 'Step 2: Audit & Ensemble', icon: Cpu },
                  { id: 'verification', label: 'Step 5: JPL Verification', icon: ShieldCheck },
                  { id: 'traditions', label: 'Step 4: 6 Cultures', icon: Sparkles },
                  { id: 'synthesis', label: 'Step 7: 9-Domain Synthesis', icon: GitCompare },
                  { id: 'reading', label: 'Step 8: Final Reading', icon: FileText },
                ].map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSection(sec.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sec.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 px-3">
                Divergence: <span className="text-rose-400 font-bold">{chartData.synthesis.divergence_metrics.divergence_rate_percent}%</span>
              </div>
            </div>

            {/* Step 2: Input Normalization & Boundary Audit Card */}
            {(activeSection === 'all' || activeSection === 'audit') && (
              <section id="step-2">
                <InputAuditCard data={chartData} />
              </section>
            )}

            {/* Step 5: Verification & Invariants Card */}
            {(activeSection === 'all' || activeSection === 'verification') && (
              <section id="step-5">
                <VerificationCard report={chartData.verification_report} />
              </section>
            )}

            {/* Step 4: 6 Cultural Traditions Charts */}
            {(activeSection === 'all' || activeSection === 'traditions') && (
              <section id="step-4">
                <TraditionCharts data={chartData} />
              </section>
            )}

            {/* Step 7: 9-Domain Synthesis Matrix & Divergence */}
            {(activeSection === 'all' || activeSection === 'synthesis') && (
              <section id="step-7">
                <SynthesisMatrix synthesis={chartData.synthesis} />
              </section>
            )}

            {/* Step 8: Academic Synthesized Reading & Export */}
            {(activeSection === 'all' || activeSection === 'reading') && (
              <section id="step-8">
                <ReadingView data={chartData} />
              </section>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-semibold text-slate-400">Six-Culture Verified Chart & Reading v2</span>
            <p className="mt-0.5">
              Deterministic astronomical calculation, honest uncertainty testing, and cross-cultural corroboration.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Swiss Ephemeris 2.10</span>
            <span>•</span>
            <span>Skyfield JPL DE421</span>
            <span>•</span>
            <span>IANA Time Zone Database</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
