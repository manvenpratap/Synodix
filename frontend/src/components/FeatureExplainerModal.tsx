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
  Sparkles,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={closeExplainer}
    >
      <div
        className="bg-[#0b0f17] border border-[#1e293b] text-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1b2331] bg-[#0d121c]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-300 shrink-0">
              {activeExplainer ? <BookOpen className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                Synodix Astronomical & Cultural Knowledge Guide
              </span>
              <h2
                id="explainer-modal-title"
                className="text-base font-semibold text-slate-100 flex items-center gap-2 mt-0.5"
              >
                {activeExplainer ? activeExplainer.title : 'Comprehensive Astrometric Glossary'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeExplainer && (
              <button
                type="button"
                onClick={openGlossary}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-[#121824] hover:bg-[#1a2334] text-slate-300 hover:text-white border border-[#232e42] transition-colors cursor-pointer"
                title="Browse All 50 Astrometric Explainers"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>All Topics</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeExplainer}
              aria-label="Close explainer modal"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin">
          {activeExplainer ? (
            /* --- DETAILED SINGLE EXPLAINER VIEW --- */
            <div className="space-y-5">
              {/* Badges & Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950/80 text-cyan-200 border border-cyan-800/80">
                  {activeExplainer.category}
                </span>
                {activeExplainer.culturalTradition && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-950/80 text-amber-200 border border-amber-800/80">
                    {activeExplainer.culturalTradition}
                  </span>
                )}
                {activeExplainer.subtitle && (
                  <span className="text-xs text-slate-400 font-sans italic">
                    {activeExplainer.subtitle}
                  </span>
                )}
              </div>

              {/* Quick Summary Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d1624] via-[#09101c] to-[#070b14] border border-cyan-900/60 shadow-inner">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                      Concept Overview
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">
                      {activeExplainer.shortSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="p-4 rounded-xl bg-[#080d16] border border-[#1b2537]">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
                    How It Works in Celestial Mechanics
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {activeExplainer.howItWorks.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                      <span className="w-5 h-5 rounded-full bg-[#131c2d] text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-[#223049] mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mathematical / Astronomical Formula Box */}
              {activeExplainer.astronomicalFormula && (
                <div className="p-4 rounded-xl bg-[#06080e] border border-[#192334]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                        Astronomical Formula & Algorithm
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Deterministic JPL / Ephemeris Code</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0a0f19] border border-[#1f2c42] font-mono text-xs text-cyan-200 overflow-x-auto selection:bg-cyan-900 selection:text-white">
                    <code>{activeExplainer.astronomicalFormula}</code>
                  </div>
                </div>
              )}

              {/* Why It Matters */}
              <div className="p-4 rounded-xl bg-[#080d16] border border-[#1b2537]">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
                    Why It Matters in Your Astrometric Dossier
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeExplainer.whyItMatters}
                </p>
              </div>

              {/* Historical Lineage & Texts */}
              <div className="p-3.5 rounded-xl bg-[#090e18] border border-[#172132] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Historical Skywatcher Lineage & Foundational Texts
                    </span>
                    <span className="text-xs font-medium text-slate-200 font-sans mt-0.5 block">
                      {activeExplainer.historicalLineage}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openGlossary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-cyan-300 hover:text-white bg-[#111928] hover:bg-[#182338] border border-cyan-800/80 rounded-lg transition-colors cursor-pointer"
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
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search explainers (e.g., Ayanamsha, Day Master, Sect, Decans, Mewa, Consensus)..."
                    className="w-full bg-[#080d16] border border-[#1b2537] rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-slate-400 hover:text-white text-xs font-mono cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
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
                  className="bg-[#080d16] border border-[#1b2537] rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
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
                    className="p-3.5 rounded-xl bg-[#080d16] hover:bg-[#0f1725] border border-[#1b2537] hover:border-cyan-700/80 text-left transition-all group flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101827] text-cyan-300 border border-[#1f2b40]">
                          {item.category}
                        </span>
                        {item.culturalTradition && (
                          <span className="text-[10px] font-mono text-amber-300">
                            {item.culturalTradition}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-sans">
                        {item.shortSummary}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
                      <span>Click for deep explanation</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>

              {filteredExplainers.length === 0 && (
                <div className="text-center py-10 bg-[#080d16] rounded-xl border border-[#1b2537]">
                  <p className="text-xs text-slate-400 font-mono">
                    No explainers found matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2 py-1"
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
