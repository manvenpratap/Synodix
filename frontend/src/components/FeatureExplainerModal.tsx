import React, { useState, useEffect, useMemo } from 'react';
import { useExplainer } from '../context/useExplainer';
import {
  FEATURE_EXPLAINERS,
  EXPLAINER_CATEGORIES,
} from '../data/featureExplainers';
import {
  X,
  BookOpen,
  Calculator,
  Compass,
  Lightbulb,
  History,
  Search,
  ChevronRight,
  Layers,
} from 'lucide-react';

export const FeatureExplainerModal: React.FC = () => {
  const { activeExplainer, isGlossaryOpen, closeExplainer, openExplainer, openGlossary } =
    useExplainer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (activeExplainer || isGlossaryOpen)) {
        closeExplainer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeExplainer, isGlossaryOpen, closeExplainer]);

  // Filter explainers for glossary search
  const filteredExplainers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return Object.values(FEATURE_EXPLAINERS).filter((item) => {
      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.culturalTradition && item.culturalTradition.toLowerCase().includes(q)) ||
        item.shortSummary.toLowerCase().includes(q) ||
        item.whyItMatters.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  if (!activeExplainer && !isGlossaryOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="explainer-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 overscroll-contain pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
      onClick={closeExplainer}
    >
      <div
        className="bg-stone-950 border border-stone-800 text-stone-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative motion-safe:animate-screen-enter motion-reduce:animate-none shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-300 shrink-0">
              {activeExplainer ? <BookOpen className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            </div>
            <div>
              <h2
                id="explainer-modal-title"
                className="text-base font-serif font-semibold text-stone-100 flex items-center gap-2"
              >
                {activeExplainer ? activeExplainer.title : 'Comprehensive Astrometric Glossary'}
              </h2>
              <p className="text-xs text-stone-400 mt-0.5 font-sans">
                Synodix astronomical & cultural knowledge guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeExplainer && (
              <button
                type="button"
                onClick={openGlossary}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif font-medium rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 transition-colors cursor-pointer"
                title="Browse All 50 Astrometric Explainers"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>All Topics</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeExplainer}
              aria-label="Close explainer modal"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-stone-850 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin overscroll-contain">
          {activeExplainer ? (
            /* --- DETAILED SINGLE EXPLAINER VIEW --- */
            <div className="space-y-5">
              {/* Badges & Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-sans font-medium bg-amber-950/80 text-amber-200 border border-amber-800/80">
                  {activeExplainer.category}
                </span>
                {activeExplainer.culturalTradition && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-sans font-medium bg-stone-900 text-stone-300 border border-stone-700">
                    {activeExplainer.culturalTradition}
                  </span>
                )}
                {activeExplainer.subtitle && (
                  <span className="text-xs text-stone-400 font-sans italic">
                    {activeExplainer.subtitle}
                  </span>
                )}
              </div>

              {/* Quick Summary Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-amber-900/60 shadow-inner">
                <div className="flex items-start gap-3">
                  <Compass className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-serif font-semibold text-amber-300 mb-1">
                      Concept Overview
                    </h3>
                    <p className="text-sm text-stone-200 leading-relaxed font-sans">
                      {activeExplainer.shortSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-serif font-semibold text-stone-200">
                    How It Works in Celestial Mechanics
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {activeExplainer.howItWorks.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-300 leading-relaxed font-sans">
                      <span className="w-5 h-5 rounded-full bg-stone-800 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-stone-700 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mathematical / Astronomical Formula Box */}
              {activeExplainer.astronomicalFormula && (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-serif font-semibold text-emerald-400">
                        Astronomical Formula & Algorithm
                      </h3>
                    </div>
                    <span className="text-xs font-sans text-stone-400">Deterministic JPL / Ephemeris Code</span>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 font-mono text-xs text-amber-200 overflow-x-auto selection:bg-amber-900 selection:text-white">
                    <code>{activeExplainer.astronomicalFormula}</code>
                  </div>
                </div>
              )}

              {/* Why It Matters */}
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-serif font-semibold text-stone-200">
                    Why It Matters in Your Astrometric Dossier
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  {activeExplainer.whyItMatters}
                </p>
              </div>

              {/* Historical Lineage & Texts */}
              <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-stone-400 block font-sans">
                      Historical Skywatcher Lineage & Foundational Texts
                    </span>
                    <span className="text-xs font-medium text-stone-200 font-serif mt-0.5 block">
                      {activeExplainer.historicalLineage}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openGlossary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif font-medium text-amber-300 hover:text-white bg-stone-900 hover:bg-stone-850 border border-amber-800/80 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Explore Other Features</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* --- GLOSSARY / EXPLORER DIRECTORY VIEW --- */
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search explainers (e.g., Ayanamsha, Day Master, Sect, Decans, Mewa, Consensus)..."
                    enterKeyHint="search"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-200 font-sans placeholder:text-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-stone-400 hover:text-white text-xs font-sans cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                      aria-label="Clear explainer search"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 font-sans focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
                >
                  <option value="all">All Categories ({Object.keys(FEATURE_EXPLAINERS).length})</option>
                  {EXPLAINER_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Explainer Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {filteredExplainers.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openExplainer(item.id)}
                    className="p-3.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-700/80 text-left transition-colors duration-150 group flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-sans font-medium px-2 py-0.5 rounded bg-stone-850 text-amber-300 border border-stone-750">
                          {item.category}
                        </span>
                        {item.culturalTradition && (
                          <span className="text-xs font-sans text-stone-300">
                            {item.culturalTradition}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-serif font-semibold text-stone-100 group-hover:text-amber-200 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-400 line-clamp-2 mt-1 font-sans">
                        {item.shortSummary}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-sans text-stone-400 group-hover:text-amber-300">
                      <span className="whitespace-nowrap">Inspect explanation</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  </button>
                ))}
              </div>

              {filteredExplainers.length === 0 && (
                <div className="text-center py-10 bg-stone-900 rounded-xl border border-stone-800">
                  <p className="text-xs text-stone-400 font-sans">
                    No explainers found matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-2 text-xs font-sans text-amber-400 hover:text-amber-300 underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-2 py-1"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
