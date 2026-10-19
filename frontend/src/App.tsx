import React, { useState, useEffect } from 'react';
import type { BirthInput, ChartResponse, Preset } from './types';
import { BirthDataForm } from './components/BirthDataForm';
import { InputAuditCard } from './components/InputAuditCard';
import { VerificationCard } from './components/VerificationCard';
import { TraditionCharts } from './components/TraditionCharts';
import { SynthesisMatrix } from './components/SynthesisMatrix';
import { ReadingView } from './components/ReadingView';

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
    <div className="min-h-screen bg-[#080a0f] text-slate-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#1b2331] bg-[#0b0e14]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-cyan-800 bg-[#121721] flex items-center justify-center font-mono text-cyan-300 font-bold text-xs">
              6C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-slate-100 tracking-tight">
                  SIX-CULTURE VERIFIED CHART & READING
                </h1>
                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-[#121721] text-cyan-400 border border-[#1b2331]">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
                Jyotisha • BaZi • Western • Zi Wei • Maya • Tibetan
              </p>
            </div>
          </div>

          {/* Engine Status Indicators */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] rounded bg-[#121721] border border-[#1b2331] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              SwissEph + NASA JPL DE421
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded bg-[#121721] border border-[#1b2331] text-cyan-300">
              Zero Rectification
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
          <div className="p-3.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
            <strong>Calculation Error:</strong> {error}
          </div>
        )}

        {/* Calculated Results */}
        {chartData && (
          <>
            {/* Clean Section Navigation Bar */}
            <div className="sticky top-16 z-40 bg-[#0d1118] p-1.5 rounded-md border border-[#1b2331] flex items-center justify-between overflow-x-auto gap-2">
              <div className="flex items-center gap-1 font-mono text-xs">
                {[
                  { id: 'all', label: 'Complete View' },
                  { id: 'audit', label: '02 / Time Audit' },
                  { id: 'verification', label: '03 / JPL Verification' },
                  { id: 'traditions', label: '04 / 6 Cultures' },
                  { id: 'synthesis', label: '05 / 9 Domains' },
                  { id: 'reading', label: '06 / Reading' },
                ].map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSection(sec.id)}
                      className={`px-3 py-1 text-xs rounded transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#182232] text-cyan-300 border border-cyan-800'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#121721] border border-transparent'
                      }`}
                    >
                      {sec.label}
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 px-3">
                Divergence: <span className="text-rose-400 font-bold tabular-nums">{chartData.synthesis.divergence_metrics.divergence_rate_percent}%</span>
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
      <footer className="mt-12 border-t border-[#1b2331] bg-[#0b0e14] py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <span className="text-slate-400 font-semibold">Six-Culture Verified Chart & Reading v2</span>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Deterministic astronomical calculation, honest uncertainty testing, and cross-cultural corroboration.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Swiss Ephemeris 2.10</span>
            <span>•</span>
            <span>Skyfield JPL DE421</span>
            <span>•</span>
            <span>IANA Timezone</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
