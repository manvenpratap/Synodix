import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Compass,
  Calculator,
  Lightbulb,
  History,
  Search,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Layers,
  FlaskConical,
  ExternalLink,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  FEATURE_EXPLAINERS,
  EXPLAINER_CATEGORIES,
  FeatureExplainer
} from '../data/featureExplainers';
import { useExplainer } from '../context/useExplainer';
import { MathematicalEvidenceCard } from './MathematicalEvidenceCard';
import type { AppScreen } from '../App';

interface Props {
  onNavigate: (screen: AppScreen) => void;
  initialExplainerId?: string;
  initialTab?: 'topics' | 'evidence';
}

interface CivilizationFilter {
  id: string;
  code: string;
  label: string;
  tooltip: string;
  traditionNavId: string;
  colorClass: string;
  activeBorder: string;
  keywords: string[];
}

const CIVILIZATIONS: CivilizationFilter[] = [
  {
    id: 'jyotisha',
    code: 'JYOT',
    label: 'Jyotisha (Vedic)',
    tooltip: 'Jyotisha (Vedic)',
    traditionNavId: 'jyotisha',
    colorClass: 'text-amber-300',
    activeBorder: 'border-amber-500 bg-amber-950/40',
    keywords: ['vedic', 'jyotisha', 'nakshatra', 'd9', 'navamsha', 'lahiri', 'dasha', 'yoga', 'ayanamsha']
  },
  {
    id: 'western',
    code: 'HELL',
    label: 'Western (Hellenistic)',
    tooltip: 'Western (Hellenistic)',
    traditionNavId: 'western',
    colorClass: 'text-cyan-300',
    activeBorder: 'border-cyan-500 bg-cyan-950/40',
    keywords: ['western', 'hellenistic', 'ptolemy', 'sect', 'dignity', 'firdaria', 'aspect', 'profection']
  },
  {
    id: 'bazi',
    code: 'BAZI',
    label: 'BaZi (Four Pillars)',
    tooltip: 'BaZi (Four Pillars)',
    traditionNavId: 'bazi',
    colorClass: 'text-rose-300',
    activeBorder: 'border-rose-500 bg-rose-950/40',
    keywords: ['bazi', 'four pillars', 'wu xing', 'day master', 'jie qi', 'stems', 'branches', 'ten gods']
  },
  {
    id: 'ziwei',
    code: 'ZIWEI',
    label: 'Zi Wei Dou Shu',
    tooltip: 'Zi Wei Dou Shu',
    traditionNavId: 'ziwei',
    colorClass: 'text-purple-300',
    activeBorder: 'border-purple-500 bg-purple-950/40',
    keywords: ['zi wei', 'purple star', 'palace', 'emperor', 'tian fu', 'si hua', 'lunar calendar']
  },
  {
    id: 'mayan',
    code: 'MAYA',
    label: 'Maya (Tzolk’in)',
    tooltip: 'Maya (Tzolk’in)',
    traditionNavId: 'mayan',
    colorClass: 'text-emerald-300',
    activeBorder: 'border-emerald-500 bg-emerald-950/40',
    keywords: ['maya', 'tzolk', 'haab', 'kiche', 'nawal', 'calendar round', 'trecena']
  },
  {
    id: 'tibetan',
    code: 'TIBET',
    label: 'Tibetan (Phugpa)',
    tooltip: 'Tibetan (Phugpa)',
    traditionNavId: 'tibetan',
    colorClass: 'text-amber-400',
    activeBorder: 'border-amber-500 bg-amber-950/40',
    keywords: ['tibetan', 'phugpa', 'mewa', 'parkha', 'lo shu', 'element-animal', 'rabjung']
  },
  {
    id: 'persian',
    code: 'PERS',
    label: 'Persian (Almuten)',
    tooltip: 'Persian (Almuten)',
    traditionNavId: 'persian',
    colorClass: 'text-teal-300',
    activeBorder: 'border-teal-500 bg-teal-950/40',
    keywords: ['persian', 'almuten', 'ilm al-nujum', 'abu ma', 'dignity', 'firdaria', 'house of wisdom']
  },
  {
    id: 'egyptian',
    code: 'EGYPT',
    label: 'Egyptian (Decans)',
    tooltip: 'Egyptian (Decans)',
    traditionNavId: 'egyptian',
    colorClass: 'text-yellow-300',
    activeBorder: 'border-yellow-500 bg-yellow-950/40',
    keywords: ['egyptian', 'decan', 'sothic', 'sirius', 'dendera', 'star clock', '360']
  },
  {
    id: 'maramataka',
    code: 'MARA',
    label: 'Māori (Maramataka)',
    tooltip: 'Māori (Maramataka)',
    traditionNavId: 'maramataka',
    colorClass: 'text-emerald-400',
    activeBorder: 'border-emerald-500 bg-emerald-950/40',
    keywords: ['māori', 'maori', 'maramataka', 'lunar night', 'moon phase', 'oceanic', 'tangaroa', 'mutuwhenua']
  }
];

export const FeatureGuideScreen: React.FC<Props> = ({ onNavigate, initialExplainerId, initialTab = 'topics' }) => {
  const { activeExplainer } = useExplainer();
  const allExplainers = useMemo(() => Object.values(FEATURE_EXPLAINERS), []);

  const [activeSection, setActiveSection] = useState<'topics' | 'evidence'>(initialTab);

  const [selectedExplainerId, setSelectedExplainerId] = useState<string>(() => {
    return initialExplainerId || activeExplainer?.id || allExplainers[0]?.id || 'time_normalization_eot';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCivilization, setActiveCivilization] = useState<string | null>(null);

  // Synchronize when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveSection(initialTab);
    }
  }, [initialTab]);

  // Synchronize when external explainer changes
  useEffect(() => {
    if (activeExplainer?.id) {
      setSelectedExplainerId(activeExplainer.id);
      setActiveSection('topics');
    }
  }, [activeExplainer]);

  // Filter explainers based on search, category, and civilization
  const filteredExplainers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allExplainers.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 2. Civilizational Array Filter
      if (activeCivilization) {
        const civ = CIVILIZATIONS.find((c) => c.id === activeCivilization);
        if (civ) {
          const itemText = `${item.title} ${item.subtitle || ''} ${item.culturalTradition || ''} ${item.shortSummary} ${item.historicalLineage}`.toLowerCase();
          const matchesCiv = civ.keywords.some((kw) => itemText.includes(kw));
          if (!matchesCiv) return false;
        }
      }

      // 3. Search Query
      if (q) {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSub = item.subtitle?.toLowerCase().includes(q) || false;
        const matchTrad = item.culturalTradition?.toLowerCase().includes(q) || false;
        const matchSum = item.shortSummary.toLowerCase().includes(q);
        const matchWhy = item.whyItMatters.toLowerCase().includes(q);
        const matchForm = item.astronomicalFormula.toLowerCase().includes(q);
        return matchTitle || matchSub || matchTrad || matchSum || matchWhy || matchForm;
      }

      return true;
    });
  }, [allExplainers, selectedCategory, activeCivilization, searchQuery]);

  // Active Explainer Resolution
  const currentExplainer: FeatureExplainer = useMemo(() => {
    const found = FEATURE_EXPLAINERS[selectedExplainerId];
    if (found) return found;
    return filteredExplainers[0] || allExplainers[0];
  }, [selectedExplainerId, filteredExplainers, allExplainers]);

  // Chapter navigation index
  const currentIndex = filteredExplainers.findIndex((e) => e.id === currentExplainer.id);
  const prevExplainer = currentIndex > 0 ? filteredExplainers[currentIndex - 1] : null;
  const nextExplainer = currentIndex < filteredExplainers.length - 1 ? filteredExplainers[currentIndex + 1] : null;

  const handleCivilizationClick = (civId: string) => {
    if (activeCivilization === civId) {
      setActiveCivilization(null);
    } else {
      setActiveCivilization(civId);
    }
  };

  const activeCivObj = CIVILIZATIONS.find((c) => c.id === activeCivilization);

  return (
    <div className="w-full max-w-full space-y-6 motion-safe:animate-screen-enter motion-reduce:animate-none">
      {/* Top Banner & Knowledge Base Headline */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-amber-900/60 shadow-md gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-950/90 border border-amber-800 flex items-center justify-center text-amber-300 shrink-0 shadow-xs">
            {activeSection === 'evidence' ? (
              <FlaskConical className="w-5 h-5 text-amber-400" />
            ) : (
              <BookOpen className="w-5 h-5 text-amber-300" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-serif font-medium px-2 py-0.5 rounded border ${
                  activeSection === 'evidence'
                    ? 'text-amber-300 bg-amber-950/60 border-amber-800/60'
                    : 'text-amber-300 bg-amber-950/60 border-amber-800/60'
                }`}
              >
                {activeSection === 'evidence' ? 'Empirical Statistical Validation' : 'Astrometric Knowledge Base'}
              </span>
              <span className="text-xs text-stone-400 font-sans hidden sm:inline">
                {activeSection === 'evidence' ? '100 Titans Monte Carlo Benchmark' : '50 Authoritative Topics'}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-stone-100 tracking-tight mt-1">
              {activeSection === 'evidence'
                ? 'Empirical Mathematical Evidence & Statistical Validation'
                : 'Multi-Tradition Astrometric & Cultural Feature Guide'}
            </h1>
            <p className="text-xs text-stone-300 font-sans mt-0.5 leading-relaxed">
              {activeSection === 'evidence'
                ? 'Peer-reviewed style statistical whitepaper, double-blind permutation null controls, and rigorous p-value benchmarks.'
                : 'Exhaustive documentation of celestial mechanics, ancient calibration lineages, mathematical formulas, and triangulation invariants.'}
            </p>
          </div>
        </div>

        {/* Section Switcher & Global Action Anchors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Dual-Section Switcher Pill */}
          <div
            role="tablist"
            aria-label="Feature Guide Sections"
            className="flex items-center p-1 rounded-xl bg-stone-950 border border-stone-800 shadow-inner"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeSection === 'topics'}
              onClick={() => setActiveSection('topics')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-colors duration-150 cursor-pointer min-h-[34px] ${
                activeSection === 'topics'
                  ? 'bg-stone-900 text-amber-300 border border-amber-700/80 font-semibold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>50 Knowledge Topics</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSection === 'evidence'}
              onClick={() => setActiveSection('evidence')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-colors duration-150 cursor-pointer min-h-[34px] ${
                activeSection === 'evidence'
                  ? 'bg-stone-900 text-amber-300 border border-amber-700/80 font-semibold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
              <span>Mathematical Evidence</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('traditions')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-serif font-medium rounded-lg bg-stone-900 hover:bg-stone-850 text-amber-300 hover:text-amber-200 border border-amber-800/60 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Traditions</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('workbench')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-serif font-medium rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Workbench</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Viewport: Mathematical Evidence OR 50 Knowledge Topics */}
      {activeSection === 'evidence' ? (
        <div className="w-full max-w-full">
          <MathematicalEvidenceCard onNavigate={onNavigate} />
        </div>
      ) : (
        /* Main Full-Width Split Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full">
          {/* ========================================================================= */}
          {/* LEFT SUB-NAVIGATION SIDEBAR: Functional Civilizations, Search & Topics    */}
          {/* ========================================================================= */}
          <aside
            aria-label="Feature Guide Navigation"
            className="lg:col-span-4 xl:col-span-3 space-y-4"
          >
          {/* 1. Functional Civilizational Array (9) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
              <span className="text-xs font-serif font-semibold text-stone-300">
                Civilizational Traditions (9)
              </span>
              <div className="flex items-center gap-1.5">
                {activeCivilization ? (
                  <button
                    type="button"
                    onClick={() => setActiveCivilization(null)}
                    className="text-xs font-sans text-amber-400 hover:text-amber-200 underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                ) : (
                  <span className="text-xs font-sans text-amber-400 font-medium">9 of 9 Active</span>
                )}
              </div>
            </div>

            {/* 3x3 Grid of Interactive Civilizational Buttons */}
            <div className="grid grid-cols-3 gap-1.5 text-xs text-center">
              {CIVILIZATIONS.map((civ) => {
                const isSelected = activeCivilization === civ.id;
                return (
                  <button
                    key={civ.id}
                    type="button"
                    onClick={() => handleCivilizationClick(civ.id)}
                    data-tooltip={civ.tooltip}
                    aria-label={`Filter by ${civ.label}`}
                    aria-pressed={isSelected}
                    className={`px-1.5 py-1.5 rounded-lg border text-xs font-medium flex items-center justify-center transition-colors duration-150 cursor-pointer min-w-0 ${
                      isSelected
                        ? `${civ.activeBorder} ${civ.colorClass} shadow-sm ring-1 ring-amber-400`
                        : `bg-stone-900 border-stone-800 ${civ.colorClass} hover:border-amber-500/50 hover:bg-stone-850`
                    }`}
                  >
                    <span className="truncate font-mono">{civ.code}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Civilization Jump Link */}
            {activeCivObj && (
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-sans">
                <span className="text-stone-300 truncate">
                  Filtered: <strong className={activeCivObj.colorClass}>{activeCivObj.label}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('traditions')}
                  className="text-amber-400 hover:text-amber-200 inline-flex items-center gap-1 hover:underline shrink-0 font-medium"
                >
                  <span>Visualizer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* 2. Search & Category Filters */}
          <div className="p-3.5 rounded-xl bg-stone-950/90 border border-stone-800 space-y-3 shadow-xs">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulas, concepts..."
                className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-8 pr-8 py-2 text-xs font-sans text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-1">
              <span className="text-xs font-serif font-semibold text-stone-300 block mb-1">
                Knowledge Domains
              </span>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-sans transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-amber-950/80 text-amber-300 font-semibold border border-amber-800/80'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <span>All Knowledge Domains</span>
                  <span className="text-xs font-mono text-stone-400">50</span>
                </button>

                {EXPLAINER_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  const count = allExplainers.filter((e) => e.category === cat.name).length;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-sans transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950/80 text-amber-300 font-semibold border border-amber-800/80'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] font-mono text-stone-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Filtered Topic Explorer List */}
          <div className="p-3.5 rounded-xl bg-stone-950/90 border border-stone-800 space-y-2 shadow-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
              <span className="text-xs font-serif font-semibold text-stone-300">
                Topics ({filteredExplainers.length})
              </span>
              <span className="text-xs text-stone-400 font-sans">Select to inspect</span>
            </div>

            <div className="max-h-[380px] overflow-y-auto space-y-1 pr-1 overscroll-contain">
              {filteredExplainers.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-400 font-sans">
                  No matching topics found for active filters.
                </div>
              ) : (
                filteredExplainers.map((item) => {
                  const isSelected = item.id === currentExplainer.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedExplainerId(item.id)}
                      className={`w-full text-left p-2 rounded-lg transition-colors duration-150 cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-stone-900 border border-amber-500/70 text-amber-200 shadow-sm'
                          : 'hover:bg-stone-900 text-stone-300 border border-transparent'
                      }`}
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-serif font-semibold text-stone-100 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-sans text-stone-400 truncate">
                            {item.culturalTradition || item.category}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT MASTER READING CANVAS: Detailed Explainer Master Document           */}
        {/* ========================================================================= */}
        <section
          aria-label="Explainer Content"
          className="lg:col-span-8 xl:col-span-9 space-y-5"
        >
          {/* Header Card with Meta Badges */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 shadow-sm space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-stone-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-sans font-medium bg-amber-950/80 text-amber-300 border border-amber-800">
                  {currentExplainer.category}
                </span>
                {currentExplainer.culturalTradition && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-sans font-medium bg-stone-900 text-stone-300 border border-stone-700">
                    {currentExplainer.culturalTradition}
                  </span>
                )}
                <span className="text-xs font-sans text-stone-400 hidden sm:inline">
                  Topic ID: <span className="font-mono">{currentExplainer.id}</span>
                </span>
              </div>

              {/* Direct Workbench / Visualizer Jump CTA */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('traditions')}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-serif font-medium text-amber-300 hover:text-amber-100 bg-stone-900 hover:bg-stone-850 border border-amber-700/60 rounded-md transition-colors cursor-pointer"
                >
                  <span>Open in Traditions</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-stone-100">
                {currentExplainer.title}
              </h2>
              {currentExplainer.subtitle && (
                <p className="text-xs sm:text-sm text-amber-400 font-serif italic mt-1">
                  {currentExplainer.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Master Content Bento Grid */}
          <div className="space-y-4">
            {/* 1. Concept Overview Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-400">
                <Compass className="w-4 h-4" />
                <h3 className="text-xs font-serif font-semibold text-amber-300">
                  Concept Overview & Astrometric Phenomenon
                </h3>
              </div>
              <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans">
                {currentExplainer.shortSummary}
              </p>
            </div>

            {/* 2. Mathematical Formulation & Algorithmic Steps */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-amber-400">
                <Calculator className="w-4 h-4" />
                <h3 className="text-xs font-serif font-semibold text-amber-300">
                  Astronomical & Mathematical Algorithm
                </h3>
              </div>

              {/* Formula Display Box */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-stone-900 border border-amber-900/40 text-xs sm:text-sm text-amber-200/95 overflow-x-auto select-all shadow-inner">
                <span className="text-xs text-stone-400 block mb-1 font-serif font-medium">
                  Governing Formula / Mathematical Invariant
                </span>
                <code className="font-mono block">{currentExplainer.astronomicalFormula}</code>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-serif font-semibold text-stone-300">
                  Algorithmic Execution Pipeline:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {currentExplainer.howItWorks.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-stone-900 border border-stone-800 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 text-amber-400 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Why It Matters for Multi-Tradition Triangulation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <Lightbulb className="w-4 h-4" />
                <h3 className="text-xs font-serif font-semibold text-emerald-300">
                  Role in Epistemic Triangulation & Consensus
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                {currentExplainer.whyItMatters}
              </p>
            </div>

            {/* 4. Epistemological & Historical Lineage */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-400">
                <History className="w-4 h-4" />
                <h3 className="text-xs font-serif font-semibold text-amber-300">
                  Historical Lineage & Original Treatises
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 italic font-serif leading-relaxed">
                {currentExplainer.historicalLineage}
              </p>
            </div>
          </div>

          {/* Chapter Navigation Footer */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            {prevExplainer ? (
              <button
                type="button"
                onClick={() => setSelectedExplainerId(prevExplainer.id)}
                className="w-full sm:w-auto inline-flex items-center gap-2 px-3.5 py-2 text-xs font-serif font-medium text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-amber-400" />
                <span className="truncate max-w-[200px]">Prev: {prevExplainer.title}</span>
              </button>
            ) : (
              <div />
            )}

            <span className="text-xs font-sans text-stone-400">
              Topic <span className="font-mono">{currentIndex + 1}</span> of <span className="font-mono">{filteredExplainers.length}</span>
            </span>

            {nextExplainer ? (
              <button
                type="button"
                onClick={() => setSelectedExplainerId(nextExplainer.id)}
                className="w-full sm:w-auto inline-flex items-center justify-end gap-2 px-3.5 py-2 text-xs font-serif font-medium text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-lg transition-colors cursor-pointer text-right"
              >
                <span className="truncate max-w-[200px]">Next: {nextExplainer.title}</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </section>
      </div>
      )}
    </div>
  );
};
