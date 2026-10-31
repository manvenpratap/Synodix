import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  HeartHandshake,
  Orbit,
  ArrowRightLeft,
  Compass,
  Layers,
  FileText,
  ShieldCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Scale
} from 'lucide-react';
import type { ChartResponse, BirthInput, Preset } from '../types';
import TITANS_100_DATA from '../data/personalities_100.json';
import { getBundledTitanChart } from '../data/bundledTitans';
import { calculateChartLocally } from '../engine';
import { generateSynastryReport } from '../engine/synastry';
import { ExplainerTrigger } from './ExplainerTrigger';

interface Props {
  currentChart: ChartResponse | null;
  currentSubjectName: string;
  onNavigate?: (screen: any) => void;
}

const ALL_PRESETS: Preset[] = TITANS_100_DATA as unknown as Preset[];

export const SynastryScreen: React.FC<Props> = ({
  currentChart,
  currentSubjectName,
  onNavigate
}) => {
  // Dual subject state
  const [partnerAMode, setPartnerAMode] = useState<'active' | 'preset' | 'custom'>('active');
  const [partnerAPresetId, setPartnerAPresetId] = useState<string>('steve-jobs');
  const [partnerAChart, setPartnerAChart] = useState<ChartResponse | null>(currentChart);
  const [partnerAName, setPartnerAName] = useState<string>(currentSubjectName || 'Steve Jobs');

  const [partnerBMode, setPartnerBMode] = useState<'preset' | 'custom'>('preset');
  const [partnerBPresetId, setPartnerBPresetId] = useState<string>('marie-curie');
  const [partnerBChart, setPartnerBChart] = useState<ChartResponse | null>(null);
  const [partnerBName, setPartnerBName] = useState<string>('Marie Curie');

  // Custom input states for Partner A and B
  const [customA, setCustomA] = useState<BirthInput>({
    name: 'Partner A',
    birth_date: '1985-06-15',
    birth_time: '14:30',
    time_certainty: 'exact',
    latitude: 40.7128,
    longitude: -74.006,
    city_name: 'New York',
    country_name: 'United States',
    gender: 'female'
  });

  const [customB, setCustomB] = useState<BirthInput>({
    name: 'Partner B',
    birth_date: '1983-11-24',
    birth_time: '09:15',
    time_certainty: 'exact',
    latitude: 51.5074,
    longitude: -0.1278,
    city_name: 'London',
    country_name: 'United Kingdom',
    gender: 'male'
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'traditions' | 'aspects' | 'composite' | 'ashtakoota' | 'dossier'>('traditions');
  const [aspectFilter, setAspectFilter] = useState<'all' | 'harmonic' | 'magnetic' | 'challenging' | 'stabilizing'>('all');

  // Load Partner A chart when mode or preset changes
  useEffect(() => {
    let isMounted = true;
    async function loadPartnerA() {
      if (partnerAMode === 'active' && currentChart) {
        setPartnerAChart(currentChart);
        setPartnerAName(currentSubjectName || 'Active Subject');
        return;
      }
      if (partnerAMode === 'preset') {
        setIsLoading(true);
        try {
          const bundled = await getBundledTitanChart(partnerAPresetId);
          const presetObj = ALL_PRESETS.find(p => p.id === partnerAPresetId);
          const name = presetObj?.name || partnerAPresetId;
          if (bundled && isMounted) {
            setPartnerAChart(bundled);
            setPartnerAName(name);
          } else if (presetObj) {
            const chart = await calculateChartLocally({
              name: presetObj.name,
              birth_date: presetObj.birth_date,
              birth_time: presetObj.birth_time,
              time_certainty: presetObj.time_certainty || 'exact',
              latitude: presetObj.latitude,
              longitude: presetObj.longitude,
              city_name: presetObj.city_name || 'Preset City',
              country_name: presetObj.country_name || 'Global',
              gender: presetObj.gender || 'neutral'
            });
            if (isMounted) {
              setPartnerAChart(chart);
              setPartnerAName(name);
            }
          }
        } catch (err) {
          console.error('Error loading Partner A:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else if (partnerAMode === 'custom') {
        setIsLoading(true);
        try {
          const chart = await calculateChartLocally(customA);
          if (isMounted) {
            setPartnerAChart(chart);
            setPartnerAName(customA.name || 'Custom Subject A');
          }
        } catch (err) {
          console.error('Error calculating custom Partner A:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }
    }
    loadPartnerA();
    return () => { isMounted = false; };
  }, [partnerAMode, partnerAPresetId, currentChart, currentSubjectName]);

  // Load Partner B chart when mode or preset changes
  useEffect(() => {
    let isMounted = true;
    async function loadPartnerB() {
      if (partnerBMode === 'preset') {
        setIsLoading(true);
        try {
          const bundled = await getBundledTitanChart(partnerBPresetId);
          const presetObj = ALL_PRESETS.find(p => p.id === partnerBPresetId);
          const name = presetObj?.name || partnerBPresetId;
          if (bundled && isMounted) {
            setPartnerBChart(bundled);
            setPartnerBName(name);
          } else if (presetObj) {
            const chart = await calculateChartLocally({
              name: presetObj.name,
              birth_date: presetObj.birth_date,
              birth_time: presetObj.birth_time,
              time_certainty: presetObj.time_certainty || 'exact',
              latitude: presetObj.latitude,
              longitude: presetObj.longitude,
              city_name: presetObj.city_name || 'Preset City',
              country_name: presetObj.country_name || 'Global',
              gender: presetObj.gender || 'neutral'
            });
            if (isMounted) {
              setPartnerBChart(chart);
              setPartnerBName(name);
            }
          }
        } catch (err) {
          console.error('Error loading Partner B:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else if (partnerBMode === 'custom') {
        setIsLoading(true);
        try {
          const chart = await calculateChartLocally(customB);
          if (isMounted) {
            setPartnerBChart(chart);
            setPartnerBName(customB.name || 'Custom Subject B');
          }
        } catch (err) {
          console.error('Error calculating custom Partner B:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }
    }
    loadPartnerB();
    return () => { isMounted = false; };
  }, [partnerBMode, partnerBPresetId]);

  // Swap Partners A & B
  const handleSwapPartners = () => {
    const tempChart = partnerAChart;
    const tempName = partnerAName;
    const tempMode = partnerAMode;
    const tempPreset = partnerAPresetId;
    const tempCustom = customA;

    setPartnerAChart(partnerBChart);
    setPartnerAName(partnerBName);
    setPartnerAMode(partnerBMode === 'preset' ? 'preset' : 'custom');
    setPartnerAPresetId(partnerBPresetId);
    setCustomA(customB);

    setPartnerBChart(tempChart);
    setPartnerBName(tempName);
    setPartnerBMode(tempMode === 'active' || tempMode === 'preset' ? 'preset' : 'custom');
    setPartnerBPresetId(tempPreset);
    setCustomB(tempCustom);
  };

  // Generate full cross-cultural synastry report
  const synastryReport = useMemo(() => {
    if (!partnerAChart || !partnerBChart) return null;
    return generateSynastryReport(partnerAChart, partnerBChart, partnerAName, partnerBName);
  }, [partnerAChart, partnerBChart, partnerAName, partnerBName]);

  // Filtered synastry aspects
  const filteredAspects = useMemo(() => {
    if (!synastryReport) return [];
    if (aspectFilter === 'all') return synastryReport.synastryAspects;
    return synastryReport.synastryAspects.filter(a => a.nature === aspectFilter);
  }, [synastryReport, aspectFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Header Enclosure */}
      <div className="machined-bezel p-4 sm:p-6 rounded-2xl shadow-xl relative">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-800 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              <span className="text-xs text-amber-400 font-serif font-medium tracking-wide">
                Astrometric Conjunction · Inter-Chart Resonance Engine
              </span>
              <ExplainerTrigger id="synastry_conjunctions" variant="badge" />
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 flex items-center gap-2.5">
              <HeartHandshake className="w-6 h-6 text-amber-400 shrink-0" />
              <span>Synastry & Composite Charts across 9 Traditions</span>
            </h1>
            <p className="text-xs text-stone-400 mt-1 max-w-3xl leading-relaxed">
              Compare two birth charts across all 9 civilizational systems: astronomical inter-aspects, circular midpoint composite entity, authentic 36-point Vedic Ashtakoota Milan, BaZi Wu Xing balances, and esoteric decanic/lunar affinities.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSwapPartners}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-amber-900/40 text-stone-300 hover:text-amber-300 text-xs font-serif font-medium cursor-pointer transition-colors shadow-xs"
              data-tooltip="Swap Partner A and Partner B positions"
              aria-label="Swap Partner A and Partner B"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Swap Roles</span>
            </button>
          </div>
        </div>

        {/* 2. Dual Subject Calibration Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 pt-4 items-center">
          {/* Partner A Selector */}
          <div className="lg:col-span-5 bg-stone-950/80 rounded-xl p-4 border border-stone-800 shadow-inner space-y-3">
            <div className="flex items-center justify-between border-b border-stone-850 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold">
                  A
                </span>
                <h2 className="text-sm font-serif font-semibold text-stone-200">
                  Partner A · Primary Subject
                </h2>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                {currentChart && (
                  <button
                    type="button"
                    onClick={() => setPartnerAMode('active')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      partnerAMode === 'active'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700/60 font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                    data-tooltip="Use current active subject from Workbench"
                  >
                    Active
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPartnerAMode('preset')}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    partnerAMode === 'preset'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/60 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  data-tooltip="Choose from 100 historical titan benchmarks"
                >
                  Titan Presets
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerAMode('custom')}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    partnerAMode === 'custom'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/60 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  data-tooltip="Enter manual birth coordinates"
                >
                  Custom
                </button>
              </div>
            </div>

            {partnerAMode === 'active' && (
              <div className="p-2.5 rounded bg-stone-900 border border-stone-800 text-xs">
                <div className="flex items-center justify-between font-serif">
                  <span className="text-stone-200 font-semibold text-sm">{partnerAName}</span>
                  <span className="text-amber-400 font-mono text-[11px]">Workbench Profile</span>
                </div>
                {partnerAChart && (
                  <div className="grid grid-cols-3 gap-1.5 mt-2 text-[11px] font-mono text-stone-400">
                    <div>Sun: <span className="text-stone-300">{partnerAChart.astronomical_base?.planets_tropical?.['Sun']?.sign}</span></div>
                    <div>Moon: <span className="text-stone-300">{partnerAChart.astronomical_base?.planets_tropical?.['Moon']?.sign}</span></div>
                    <div>Asc: <span className="text-stone-300">{partnerAChart.astronomical_base?.angles?.tropical?.ascendant_sign}</span></div>
                  </div>
                )}
              </div>
            )}

            {partnerAMode === 'preset' && (
              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-stone-400">
                  Select Benchmark Personality (100 Titans):
                </label>
                <select
                  value={partnerAPresetId}
                  onChange={(e) => setPartnerAPresetId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-serif rounded bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  data-tooltip="Select Partner A preset"
                >
                  {ALL_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.birth_date}) — {p.tag || p.category}
                    </option>
                  ))}
                </select>
                {partnerAChart && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] font-mono text-stone-400">
                    <div>Sun: <span className="text-stone-300">{partnerAChart.astronomical_base?.planets_tropical?.['Sun']?.sign}</span></div>
                    <div>Moon: <span className="text-stone-300">{partnerAChart.astronomical_base?.planets_tropical?.['Moon']?.sign}</span></div>
                    <div>Asc: <span className="text-stone-300">{partnerAChart.astronomical_base?.angles?.tropical?.ascendant_sign}</span></div>
                  </div>
                )}
              </div>
            )}

            {partnerAMode === 'custom' && (
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <input
                    type="text"
                    value={customA.name}
                    onChange={(e) => setCustomA({ ...customA, name: e.target.value })}
                    placeholder="Partner A Full Name"
                    className="w-full px-2.5 py-1.5 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={customA.birth_date}
                    onChange={(e) => setCustomA({ ...customA, birth_date: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                  <input
                    type="time"
                    value={customA.birth_time}
                    onChange={(e) => setCustomA({ ...customA, birth_time: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={customA.latitude}
                    onChange={(e) => setCustomA({ ...customA, latitude: Number(e.target.value) })}
                    placeholder="Lat (e.g. 40.7128)"
                    className="w-full px-2 py-1 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={customA.longitude}
                    onChange={(e) => setCustomA({ ...customA, longitude: Number(e.target.value) })}
                    placeholder="Lon (e.g. -74.0060)"
                    className="w-full px-2 py-1 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    const c = await calculateChartLocally(customA);
                    setPartnerAChart(c);
                    setPartnerAName(customA.name || 'Custom Subject A');
                    setIsLoading(false);
                  }}
                  className="w-full py-1.5 rounded bg-amber-700 hover:bg-amber-600 text-stone-950 font-serif font-semibold text-xs cursor-pointer"
                >
                  Recalculate Partner A
                </button>
              </div>
            )}
          </div>

          {/* Central Conjunction Resonator */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
            <div className="w-12 h-12 rounded-full bg-stone-900 border border-amber-700/60 flex items-center justify-center shadow-lg relative group">
              <Orbit className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
              <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-mono text-amber-300/80">
                {synastryReport?.overallConcordanceScore ?? 0}%
              </div>
            </div>
          </div>

          {/* Partner B Selector */}
          <div className="lg:col-span-5 bg-stone-950/80 rounded-xl p-4 border border-stone-800 shadow-inner space-y-3">
            <div className="flex items-center justify-between border-b border-stone-850 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold">
                  B
                </span>
                <h2 className="text-sm font-serif font-semibold text-stone-200">
                  Partner B · Comparative Subject
                </h2>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setPartnerBMode('preset')}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    partnerBMode === 'preset'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/60 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  data-tooltip="Choose from 100 historical titan benchmarks"
                >
                  Titan Presets
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerBMode('custom')}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    partnerBMode === 'custom'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/60 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  data-tooltip="Enter manual birth coordinates"
                >
                  Custom
                </button>
              </div>
            </div>

            {partnerBMode === 'preset' && (
              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-stone-400">
                  Select Benchmark Personality (100 Titans):
                </label>
                <select
                  value={partnerBPresetId}
                  onChange={(e) => setPartnerBPresetId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-serif rounded bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  data-tooltip="Select Partner B preset"
                >
                  {ALL_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.birth_date}) — {p.tag || p.category}
                    </option>
                  ))}
                </select>
                {partnerBChart && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] font-mono text-stone-400">
                    <div>Sun: <span className="text-stone-300">{partnerBChart.astronomical_base?.planets_tropical?.['Sun']?.sign}</span></div>
                    <div>Moon: <span className="text-stone-300">{partnerBChart.astronomical_base?.planets_tropical?.['Moon']?.sign}</span></div>
                    <div>Asc: <span className="text-stone-300">{partnerBChart.astronomical_base?.angles?.tropical?.ascendant_sign}</span></div>
                  </div>
                )}
              </div>
            )}

            {partnerBMode === 'custom' && (
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <input
                    type="text"
                    value={customB.name}
                    onChange={(e) => setCustomB({ ...customB, name: e.target.value })}
                    placeholder="Partner B Full Name"
                    className="w-full px-2.5 py-1.5 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={customB.birth_date}
                    onChange={(e) => setCustomB({ ...customB, birth_date: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                  <input
                    type="time"
                    value={customB.birth_time}
                    onChange={(e) => setCustomB({ ...customB, birth_time: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={customB.latitude}
                    onChange={(e) => setCustomB({ ...customB, latitude: Number(e.target.value) })}
                    placeholder="Lat (e.g. 51.5074)"
                    className="w-full px-2 py-1 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={customB.longitude}
                    onChange={(e) => setCustomB({ ...customB, longitude: Number(e.target.value) })}
                    placeholder="Lon (e.g. -0.1278)"
                    className="w-full px-2 py-1 text-xs rounded bg-stone-900 border border-stone-800 text-stone-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    const c = await calculateChartLocally(customB);
                    setPartnerBChart(c);
                    setPartnerBName(customB.name || 'Custom Subject B');
                    setIsLoading(false);
                  }}
                  className="w-full py-1.5 rounded bg-cyan-700 hover:bg-cyan-600 text-stone-950 font-serif font-semibold text-xs cursor-pointer"
                >
                  Recalculate Partner B
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Concordance Synthesis Telemetry Banner */}
        {synastryReport && (
          <div className="mt-5 p-4 rounded-xl bg-stone-900/90 border border-amber-900/50 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 tracking-wide">
                  Archetypal Concordance Synthesis
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
                  <span>{synastryReport.concordanceVerdict}</span>
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  Calculated between <strong className="text-amber-300 font-serif">{synastryReport.partnerAName}</strong> and <strong className="text-cyan-300 font-serif">{synastryReport.partnerBName}</strong> across 9 traditions.
                </p>
              </div>

              {/* Score Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-stone-950 border border-amber-800/60 min-w-[100px]">
                  <span className="text-[10px] font-sans text-stone-400 font-medium">Concordance</span>
                  <span className="text-xl sm:text-2xl font-serif font-bold text-amber-400">
                    {synastryReport.overallConcordanceScore}%
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-stone-950 border border-emerald-800/60 min-w-[100px]">
                  <span className="text-[10px] font-sans text-stone-400 font-medium">Vedic Gunas</span>
                  <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-400">
                    {synastryReport.ashtakoota.totalScore}/36
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-stone-950 border border-stone-800 min-w-[100px]">
                  <span className="text-[10px] font-sans text-stone-400 font-medium">Aspects</span>
                  <span className="text-xl sm:text-2xl font-serif font-bold text-cyan-400">
                    {synastryReport.synastryAspects.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-800 select-none">
        {[
          { id: 'traditions', label: '9 Traditions Bento', icon: Compass, badge: '9 Systems' },
          { id: 'aspects', label: 'Inter-Chart Aspects', icon: Orbit, badge: `${synastryReport?.synastryAspects.length || 0} Aspects` },
          { id: 'composite', label: 'Midpoint Composite Chart', icon: Layers, badge: 'Unified Entity' },
          { id: 'ashtakoota', label: 'Vedic Ashtakoota Milan', icon: Scale, badge: `${synastryReport?.ashtakoota.totalScore || 0}/36 Pts` },
          { id: 'dossier', label: 'Relational Dossier', icon: FileText, badge: 'Narrative' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 min-h-[42px] rounded-lg text-xs font-serif transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-950 text-amber-200 border border-amber-600 font-bold shadow-xs'
                  : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200 hover:bg-stone-850'
              }`}
              data-tooltip={`View ${tab.label}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-800 text-stone-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5. Tab Content Views */}
      {synastryReport && (
        <div>
          {/* TAB 1: 9 TRADITIONS BENTO GRID */}
          {activeTab === 'traditions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>Civilizational Relationship Matrices:</span>
                <span>All 9 traditions computed independently</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(synastryReport.traditionAnalyses).map((trad) => (
                  <div
                    key={trad.traditionId}
                    className="bg-stone-900/90 rounded-xl p-4 border border-stone-800 hover:border-amber-900/60 transition-colors shadow-md flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <div>
                          <span className="text-[10px] font-sans text-amber-400/90 font-medium tracking-wide">
                            {trad.culture}
                          </span>
                          <h3 className="text-sm font-serif font-bold text-stone-200">
                            {trad.traditionName}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {trad.affinityScore}%
                          </span>
                          <span className="text-[10px] text-stone-400 font-serif">
                            {trad.affinityGrade}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <h4 className="text-xs font-serif font-semibold text-stone-100">
                          {trad.headline}
                        </h4>
                        <p className="text-[11px] text-stone-400 font-serif mt-1 leading-relaxed">
                          {trad.coreDynamic}
                        </p>
                      </div>

                      {/* Tradition Specific Metrics */}
                      <div className="mt-3 grid grid-cols-2 gap-1.5 bg-stone-950/60 p-2 rounded border border-stone-850">
                        {trad.metrics.map((m, idx) => (
                          <div key={idx} className="text-[11px] font-mono">
                            <span className="text-stone-400 text-[10px] block">{m.label}</span>
                            <span className="text-stone-200 font-medium">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-800/60 text-[11px] font-serif text-stone-400 flex items-start gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong className="text-stone-300">Evolutionary Vector:</strong> {trad.karmicGrowthEdge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: INTER-CHART SYNASTRY ASPECTS */}
          {activeTab === 'aspects' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono text-stone-400">
                  Planetary Contacts between <strong className="text-amber-300">{synastryReport.partnerAName}</strong> &amp; <strong className="text-cyan-300">{synastryReport.partnerBName}</strong>:
                </span>
                {/* Filter Pills */}
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {(['all', 'harmonic', 'magnetic', 'challenging', 'stabilizing'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setAspectFilter(filter)}
                      className={`px-2.5 py-1 rounded cursor-pointer capitalize transition-colors ${
                        aspectFilter === filter
                          ? 'bg-amber-950 text-amber-300 border border-amber-700/60 font-semibold'
                          : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
                      }`}
                      data-tooltip={`Filter ${filter} aspects`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAspects.length === 0 ? (
                <div className="p-8 text-center bg-stone-900/60 rounded-xl border border-dashed border-stone-800 text-stone-400 text-xs font-mono">
                  No aspects found matching filter "{aspectFilter}".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredAspects.map((asp, idx) => {
                    const natureBadgeClass =
                      asp.nature === 'harmonic'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800/80'
                        : asp.nature === 'magnetic'
                        ? 'bg-amber-950 text-amber-300 border-amber-800/80'
                        : asp.nature === 'challenging'
                        ? 'bg-rose-950 text-rose-300 border-rose-800/80'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-800/80';

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-900/50 transition-colors shadow-sm space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                          <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                            <span className="text-amber-400">{synastryReport.partnerAName}’s {asp.planetA}</span>
                            <span className="text-stone-300 font-bold px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800">
                              {asp.symbol} {asp.aspect}
                            </span>
                            <span className="text-cyan-400">{synastryReport.partnerBName}’s {asp.planetB}</span>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize ${natureBadgeClass}`}>
                            {asp.nature}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                          <span>Exact Orb: <strong className="text-stone-300">{asp.orb}°</strong></span>
                          <span>Actual Separation: <strong className="text-stone-300">{asp.actualAngle}°</strong></span>
                        </div>

                        <p className="text-xs text-stone-300 font-serif leading-relaxed pt-1">
                          {asp.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MIDPOINT COMPOSITE CHART */}
          {activeTab === 'composite' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-serif font-bold text-stone-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>The Relationship as a Third Independent Entity</span>
                  </h3>
                  <ExplainerTrigger id="composite_midpoint_chart" variant="icon" size="sm" />
                </div>
                <p className="text-xs text-stone-400 font-serif leading-relaxed">
                  The Midpoint Composite Chart calculates the exact circular short-arc midpoints between corresponding planetary positions and angles of both individuals. It does not represent how you see each other, but the birth chart of the relationship itself as an autonomous energetic entity.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <div className="p-2.5 rounded bg-stone-950 border border-stone-800 text-xs font-mono">
                    <span className="text-stone-400 block text-[10px]">Composite Ascendant</span>
                    <span className="text-amber-400 font-bold text-sm">
                      {synastryReport.compositeChart.angles.ascendant_sign} ({synastryReport.compositeChart.angles.ascendant.toFixed(2)}°)
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-stone-950 border border-stone-800 text-xs font-mono">
                    <span className="text-stone-400 block text-[10px]">Composite Midheaven</span>
                    <span className="text-cyan-400 font-bold text-sm">
                      {synastryReport.compositeChart.angles.midheaven_sign} ({synastryReport.compositeChart.angles.midheaven.toFixed(2)}°)
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-stone-950 border border-stone-800 text-xs font-mono">
                    <span className="text-stone-400 block text-[10px]">Composite Sun Sign</span>
                    <span className="text-amber-300 font-bold text-sm">
                      {synastryReport.compositeChart.planets['Sun']?.sign} ({synastryReport.compositeChart.planets['Sun']?.sign_degree}°)
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-stone-950 border border-stone-800 text-xs font-mono">
                    <span className="text-stone-400 block text-[10px]">Composite Moon Sign</span>
                    <span className="text-emerald-300 font-bold text-sm">
                      {synastryReport.compositeChart.planets['Moon']?.sign} ({synastryReport.compositeChart.planets['Moon']?.sign_degree}°)
                    </span>
                  </div>
                </div>
              </div>

              {/* Composite Planetary Placements Table */}
              <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/90 shadow-md">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Body</th>
                      <th className="py-2.5 px-3 font-semibold">Zodiac Sign</th>
                      <th className="py-2.5 px-3 font-semibold">Degree in Sign</th>
                      <th className="py-2.5 px-3 font-semibold">Composite House</th>
                      <th className="py-2.5 px-3 font-semibold">Absolute Longitude</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-stone-300">
                    {Object.values(synastryReport.compositeChart.planets).map((p) => (
                      <tr key={p.name} className="hover:bg-stone-800/40 transition-colors">
                        <td className="py-2 px-3 font-serif font-bold text-stone-100">{p.name}</td>
                        <td className="py-2 px-3 text-amber-400 font-semibold">{p.sign}</td>
                        <td className="py-2 px-3">{p.sign_degree}°</td>
                        <td className="py-2 px-3 text-cyan-400">House {p.house}</td>
                        <td className="py-2 px-3 text-stone-400">{p.longitude}°</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Composite Internal Aspects */}
              <div className="space-y-2">
                <h4 className="text-xs font-sans font-medium text-stone-400">
                  Composite Chart Internal Aspects:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {synastryReport.compositeChart.aspects.map((asp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-stone-200">{asp.planet1}</span>
                        <span className="text-amber-400 font-bold">{asp.symbol}</span>
                        <span className="font-semibold text-stone-200">{asp.planet2}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">orb {asp.orb}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VEDIC ASHTAKOOTA MILAN & KUJA DOSHA */}
          {activeTab === 'ashtakoota' && (
            <div className="space-y-5">
              {/* Ashtakoota Summary Card */}
              <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-sans font-medium text-amber-400">
                        Parashari Vedic Astrology · 36-Point Guna Milan
                      </span>
                      <ExplainerTrigger id="ashtakoota_compatibility" variant="icon" size="xs" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-100">
                      Ashtakoota Score: {synastryReport.ashtakoota.totalScore} / 36 Points ({synastryReport.ashtakoota.percentage}%)
                    </h3>
                    <p className="text-xs text-stone-400 font-serif mt-0.5">
                      Classical threshold: $\ge 18$ points denotes favorable compatibility; $\ge 28$ points is considered Utkrisht (exceptional).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-serif font-bold bg-amber-950 text-amber-300 border border-amber-700/60 shadow-xs">
                      {synastryReport.ashtakoota.status}
                    </span>
                  </div>
                </div>

                {/* Kuja Dosha (Manglik) Deep Dive */}
                <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-semibold text-stone-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Kuja Dosha (Manglik Analysis)</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      synastryReport.ashtakoota.kujaDosha.isCancelled
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-stone-900 text-stone-300'
                    }`}>
                      {synastryReport.ashtakoota.kujaDosha.isCancelled ? 'Dosha Cancelled / Harmonized' : 'Standard Alignment'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-serif leading-relaxed">
                    {synastryReport.ashtakoota.kujaDosha.analysis}
                  </p>
                </div>
              </div>

              {/* Ashtakoota 8 Kutas Breakdown Table */}
              <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/90 shadow-md">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 text-[11px] font-mono">
                    <tr>
                      <th className="py-2.5 px-3">Koota</th>
                      <th className="py-2.5 px-3">Domain</th>
                      <th className="py-2.5 px-3">{synastryReport.partnerAName}</th>
                      <th className="py-2.5 px-3">{synastryReport.partnerBName}</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Verdict</th>
                      <th className="py-2.5 px-3">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 font-serif text-stone-300">
                    {synastryReport.ashtakoota.kutas.map((k) => (
                      <tr key={k.name} className="hover:bg-stone-800/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <strong className="text-stone-100">{k.name}</strong>
                          <span className="text-[10px] font-mono text-stone-400 block">{k.sanskrit}</span>
                        </td>
                        <td className="py-2.5 px-3 text-stone-400 text-[11px]">{k.category}</td>
                        <td className="py-2.5 px-3 font-mono text-amber-400 text-[11px]">{k.partnerAAttribute}</td>
                        <td className="py-2.5 px-3 font-mono text-cyan-400 text-[11px]">{k.partnerBAttribute}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-100">
                          {k.obtainedScore} / {k.maxScore}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            k.obtainedScore === k.maxScore
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : k.obtainedScore > 0
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {k.verdict}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-stone-400 leading-relaxed max-w-xs">
                          {k.interpretation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: IN-DEPTH RELATIONSHIP DOSSIER */}
          {activeTab === 'dossier' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4 shadow-xl">
                <div className="border-b border-stone-800 pb-3">
                  <span className="text-xs text-amber-400 font-serif font-medium block">
                    Detailed Relationship Analysis
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-100 mt-0.5">
                    Complete Compatibility Reading
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    Synthesized across Hellenistic, Vedic, BaZi, Zi Wei Dou Shu, Mayan, Tibetan, Persian, Egyptian, and Māori traditions.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm font-serif leading-relaxed text-stone-300">
                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-amber-900/40 space-y-1.5">
                    <h4 className="text-xs font-sans text-amber-400 font-semibold">
                      I. Overall Connection &amp; Core Dynamic
                    </h4>
                    <p className="text-stone-300 leading-relaxed">
                      {synastryReport.dossier.executiveSummary}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                    <h4 className="text-xs font-sans text-cyan-400 font-semibold">
                      II. Emotional Bond &amp; Psychological Instincts
                    </h4>
                    <p className="text-stone-300 leading-relaxed">
                      {synastryReport.dossier.emotionalPsychologicalBond}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                    <h4 className="text-xs font-sans text-emerald-400 font-semibold">
                      III. Intellectual Alignment &amp; Communication Style
                    </h4>
                    <p className="text-stone-300 leading-relaxed">
                      {synastryReport.dossier.intellectualCommunicationAlignment}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                    <h4 className="text-xs font-sans text-rose-400 font-semibold">
                      IV. Physical Vitality, Attraction &amp; Chemistry
                    </h4>
                    <p className="text-stone-300 leading-relaxed">
                      {synastryReport.dossier.sexualVitalityChemistry}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                    <h4 className="text-xs font-sans text-amber-400 font-semibold">
                      V. Shared Growth &amp; Long-Term Lessons
                    </h4>
                    <p className="text-stone-300 leading-relaxed">
                      {synastryReport.dossier.karmicEvolutionaryPurpose}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1.5">
                    <h4 className="text-xs font-sans text-stone-400 font-semibold">
                      VI. Pragmatic Longevity &amp; Family Stewardship
                    </h4>
                    <p className="text-stone-300 leading-relaxed">
                      {synastryReport.dossier.pragmaticLongevityFactors}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
