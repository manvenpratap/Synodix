import React, { useState } from 'react';
import type { ChartResponse } from '../types';
import { ExplainerTrigger } from './ExplainerTrigger';
import {
  NorthIndianChart,
  WesternCircularWheel,
  BaZiElementPentagram,
  ZiWeiPalaceGrid,
  AlmutenDignityBarChart,
  MaramatakaLunarDial,
  TibetanMewaGrid,
  EgyptianDecanStarClock,
  MayaCalendarCompass
} from './ChartWheelVisualizer';

interface Props {
  data: ChartResponse;
}

const TRADITION_PRIMARY_EXPLAINER: Record<string, { id: string; label: string }> = {
  jyotisha: { id: 'lahiri_ayanamsha', label: 'Vedic Math & Ayanamsha' },
  bazi: { id: 'bazi_four_pillars', label: 'Four Pillars & Solar Qi' },
  western: { id: 'western_sect', label: 'Hellenistic Sect & Dignity' },
  persian: { id: 'almuten_figuris', label: 'Almuten Point System' },
  egyptian: { id: 'egyptian_decan_clock', label: '36 Decanic Gates' },
  ziwei: { id: 'ziwei_palaces_stars', label: '12 Palaces & Si Hua' },
  mayan: { id: 'maya_calendar_round', label: 'Sacred Calendar Round' },
  tibetan: { id: 'tibetan_mewa_parkha', label: 'Lo Shu Mewa & Khams Lnga' },
  maramataka: { id: 'maramataka_lunar_dial', label: '30 Oceanic Nights' },
};

const CULTURE_THEMES: Record<string, {
  id: string;
  name: string;
  nativeTitle: string;
  glyph: string;
  lineage: string;
  motto: string;
  badge: string;
  instrumentName: string;
  containerBg: string;
  containerBorder: string;
  headerBg: string;
  headerBorder: string;
  accentText: string;
  accentBadge: string;
  activeTabClass: string;
  presentationToggleActive: string;
  presentationToggleInactive: string;
  frameBg: string;
  frameBorder: string;
}> = {
  jyotisha: {
    id: 'jyotisha',
    name: 'Jyotisha (Vedic)',
    nativeTitle: 'ज्योतिष • Vedic Astrometry',
    glyph: '🕉️',
    lineage: 'Maharishi Parashara • Bṛhat Parāśara Horāśāstra & Lahiri Sidereal Ephemeris',
    motto: 'यथा पिण्डे तथा ब्रह्माण्डे — As is the microcosm within, so is the cosmic universe without',
    badge: 'Sacred Saffron & Vedic Brass',
    instrumentName: 'Parashari Diamond Kundali (D1 Lagna & D9 Navamsha)',
    containerBg: 'bg-gradient-to-b from-[#181105]/70 via-[#0d0a04] to-[#080703]',
    containerBorder: 'border-amber-700/60 shadow-lg shadow-amber-950/20',
    headerBg: 'bg-gradient-to-r from-[#241707] via-[#1a1105] to-[#100a03]',
    headerBorder: 'border-amber-600/60',
    accentText: 'text-amber-400',
    accentBadge: 'bg-amber-950/90 text-amber-200 border-amber-600/80',
    activeTabClass: 'bg-gradient-to-r from-amber-950 via-amber-900/80 to-amber-950 text-amber-200 border-amber-600 shadow-sm shadow-amber-950/60 font-semibold ring-1 ring-amber-500/40',
    presentationToggleActive: 'bg-gradient-to-r from-amber-900 to-amber-950 text-amber-200 font-bold border border-amber-600 shadow-xs',
    presentationToggleInactive: 'text-slate-400 hover:text-amber-200 hover:bg-amber-950/30',
    frameBg: 'bg-[#120d04]/90',
    frameBorder: 'border-amber-800/60',
  },
  bazi: {
    id: 'bazi',
    name: 'BaZi (Four Pillars)',
    nativeTitle: '八字命理 • Four Pillars of Destiny',
    glyph: '☯️',
    lineage: 'Master Xu Ziping • Wu Xing Five Elements Harmonization & Solar Jie Qi Terms',
    motto: '天地陰陽，五行生剋 — Heavenly Stems and Earthly Branches harmonizing the cosmic breath',
    badge: 'Imperial Cinnabar & Jade',
    instrumentName: 'Wu Xing Dynamic Elemental Pentagram (Generating & Overcoming Cycles)',
    containerBg: 'bg-gradient-to-b from-[#180808]/70 via-[#0e0505] to-[#080303]',
    containerBorder: 'border-red-800/60 shadow-lg shadow-red-950/20',
    headerBg: 'bg-gradient-to-r from-[#240b0b] via-[#1a0707] to-[#100404]',
    headerBorder: 'border-red-600/60',
    accentText: 'text-red-400',
    accentBadge: 'bg-red-950/90 text-red-200 border-red-600/80',
    activeTabClass: 'bg-gradient-to-r from-red-950 via-red-900/80 to-rose-950 text-red-200 border-red-600 shadow-sm shadow-red-950/60 font-semibold ring-1 ring-red-500/40',
    presentationToggleActive: 'bg-gradient-to-r from-red-900 to-red-950 text-red-200 font-bold border border-red-600 shadow-xs',
    presentationToggleInactive: 'text-slate-400 hover:text-red-200 hover:bg-red-950/30',
    frameBg: 'bg-[#120505]/90',
    frameBorder: 'border-red-800/60',
  },
  western: {
    id: 'western',
    name: 'Western (Hellenistic)',
    nativeTitle: 'Ἑλληνιστικὴ Ἀστρολογία • Hellenistic Astrologia',
    glyph: '🏛️',
    lineage: 'Claudius Ptolemy (Tetrabiblos) & Vettius Valens • Tropical Whole-Sign Houses',
    motto: 'Sicut superius, sic inferius — That which is below is like that which is above',
    badge: 'Aegean Lapis & Grecian Bronze',
    instrumentName: 'Ptolemaic 360° Circular Aspect Wheel & Essential Dignities',
    containerBg: 'bg-gradient-to-b from-[#09152b]/70 via-[#060e1d] to-[#040812]',
    containerBorder: 'border-blue-700/60 shadow-lg shadow-blue-950/20',
    headerBg: 'bg-gradient-to-r from-[#0d1d3d] via-[#09142a] to-[#050c1b]',
    headerBorder: 'border-blue-500/60',
    accentText: 'text-blue-300',
    accentBadge: 'bg-blue-950/90 text-blue-200 border-blue-500/80',
    activeTabClass: 'bg-gradient-to-r from-blue-950 via-blue-900/80 to-indigo-950 text-blue-200 border-blue-500 shadow-sm shadow-blue-950/60 font-semibold ring-1 ring-blue-400/40',
    presentationToggleActive: 'bg-gradient-to-r from-blue-900 to-blue-950 text-blue-200 font-bold border border-blue-500 shadow-xs',
    presentationToggleInactive: 'text-slate-400 hover:text-blue-200 hover:bg-blue-950/30',
    frameBg: 'bg-[#060f20]/90',
    frameBorder: 'border-blue-800/60',
  },
  persian: {
    id: 'persian',
    name: 'Persian (Almuten)',
    nativeTitle: 'علم النجوم • ‘Ilm al-Nujūm',
    glyph: '🕌',
    lineage: 'Abu Ma’shar al-Balkhi & Al-Qabisi • Baghdad House of Wisdom Tradition',
    motto: 'The Supreme Almuten guides the celestial soul through weighted accidental dignity',
    badge: 'Isfahan Turquoise & Damascened Gold',
    instrumentName: 'Almuten Figuris Comparative Dignity & 75-Year Firdaria Timeline',
    containerBg: 'bg-gradient-to-b from-[#051a24]/70 via-[#031118] to-[#020a0f]',
    containerBorder: 'border-cyan-700/60 shadow-lg shadow-cyan-950/20',
    headerBg: 'bg-gradient-to-r from-[#072535] via-[#051a25] to-[#031018]',
    headerBorder: 'border-cyan-500/60',
    accentText: 'text-cyan-300',
    accentBadge: 'bg-cyan-950/90 text-cyan-200 border-cyan-500/80',
    activeTabClass: 'bg-gradient-to-r from-cyan-950 via-cyan-900/80 to-teal-950 text-cyan-200 border-cyan-500 shadow-sm shadow-cyan-950/60 font-semibold ring-1 ring-cyan-400/40',
    presentationToggleActive: 'bg-gradient-to-r from-cyan-900 to-cyan-950 text-cyan-200 font-bold border border-cyan-500 shadow-xs',
    presentationToggleInactive: 'text-slate-400 hover:text-cyan-200 hover:bg-cyan-950/30',
    frameBg: 'bg-[#03131c]/90',
    frameBorder: 'border-cyan-800/60',
  },
  egyptian: {
    id: 'egyptian',
    name: 'Egyptian (Decans)',
    nativeTitle: '𓇹𓇳𓏤 • Seba’ut & Bakhtiu Star Watchers',
    glyph: '𓋹',
    lineage: 'Dendera Astronomical Zodiac & Senenmut Tomb Ceiling (c. 1473 BCE)',
    motto: 'Ra navigates the celestial Nile through the 36 hourly Decanic Star Gates of Heaven',
    badge: 'Pharaonic Sun Gold & Nile Basalt',
    instrumentName: '36-Decan Star Compass & Sothic Civil Calendar Clock',
    containerBg: 'bg-gradient-to-b from-[#1c1605]/70 via-[#110d03] to-[#090702]',
    containerBorder: 'border-yellow-700/60 shadow-lg shadow-yellow-950/20',
    headerBg: 'bg-gradient-to-r from-[#281f07] via-[#1a1404] to-[#100c02]',
    headerBorder: 'border-yellow-600/60',
    accentText: 'text-yellow-400',
    accentBadge: 'bg-yellow-950/90 text-yellow-200 border-yellow-600/80',
    activeTabClass: 'bg-gradient-to-r from-yellow-950 via-amber-900/80 to-yellow-950 text-yellow-200 border-yellow-500 shadow-sm shadow-yellow-950/60 font-semibold ring-1 ring-yellow-400/40',
    presentationToggleActive: 'bg-gradient-to-r from-yellow-900 to-yellow-950 text-yellow-200 font-bold border border-yellow-500 shadow-xs',
    presentationToggleInactive: 'text-slate-400 hover:text-yellow-200 hover:bg-yellow-950/30',
    frameBg: 'bg-[#120e03]/90',
    frameBorder: 'border-yellow-800/60',
  },
  ziwei: {
    id: 'ziwei',
    name: 'Zi Wei Dou Shu',
    nativeTitle: '紫微斗數 • Imperial Polar Constellations',
    glyph: '👑',
    lineage: 'Grandmaster Chen Tuan • Lao-tzu Hermitage on Mount Hua (c. 980 CE)',
    motto: '紫微至尊，儀錄百神 — The North Celestial Pole Emperor presides over the Twelve Palaces',
    badge: 'Forbidden City Imperial Purple',
    instrumentName: 'Authentic 4x4 Imperial Courtyard Palace Matrix (14 Major & Auxiliary Stars)',
    containerBg: 'bg-gradient-to-b from-[#1c0926]/70 via-[#110518] to-[#0a030f]',
    containerBorder: 'border-purple-800/60 shadow-lg shadow-purple-950/20',
    headerBg: 'bg-gradient-to-r from-[#2a0e3a] via-[#1c0827] to-[#12051a]',
    headerBorder: 'border-purple-600/60',
    accentText: 'text-purple-300',
    accentBadge: 'bg-purple-950/90 text-purple-200 border-purple-600/80',
    activeTabClass: 'bg-[#2a0e3c] text-purple-200 border-purple-500 shadow-sm shadow-[#1a0526]/60 font-semibold ring-1 ring-purple-400/40',
    presentationToggleActive: 'bg-[#341249] text-purple-200 font-bold border border-purple-500 shadow-xs',
    presentationToggleInactive: 'text-slate-400 hover:text-purple-200 hover:bg-purple-950/30',
    frameBg: 'bg-[#13061c]/90',
    frameBorder: 'border-purple-800/60',
  },
  mayan: {
    id: 'mayan',
    name: 'Maya Calendar',
    nativeTitle: 'Chol Q’ij & Haab’ • Maya Sacred Calendar',
    glyph: '☀️',
    lineage: 'Classic Maya Skywatchers of Copán & Palenque • GMT Correlation (584283)',
    motto: 'The sacred 260-day Tzolk’in and 365-day solar Haab’ mesh into the 52-year Calendar Round',
    badge: 'Mesoamerican Jadeite & Rainforest Obsidian',
    instrumentName: 'Tzolk’in & Haab’ Interlocking Stele Gear Compass',
    containerBg: 'bg-gradient-to-b from-[#071a11]/70 via-[#04110a] to-[#020a06]',
    containerBorder: 'border-emerald-700/60 shadow-lg shadow-emerald-950/20',
    headerBg: 'bg-gradient-to-r from-[#0a2719] via-[#061c12] to-[#03110a]',
    headerBorder: 'border-emerald-500/60',
    accentText: 'text-emerald-300',
    accentBadge: 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80',
    activeTabClass: 'bg-gradient-to-r from-emerald-950 via-emerald-900/80 to-teal-950 text-emerald-200 border-emerald-500 shadow-sm shadow-emerald-950/60 font-semibold ring-1 ring-emerald-400/40',
    presentationToggleActive: 'bg-gradient-to-r from-emerald-900 to-emerald-950 text-emerald-200 font-bold border border-emerald-500 shadow-xs',
    presentationToggleInactive: 'text-slate-400 hover:text-emerald-200 hover:bg-emerald-950/30',
    frameBg: 'bg-[#03130b]/90',
    frameBorder: 'border-emerald-800/60',
  },
  tibetan: {
    id: 'tibetan',
    name: 'Tibetan Elemental',
    nativeTitle: 'དཀར་རྩིས་ • Kar-tsi & Jung-tsi',
    glyph: '☸️',
    lineage: 'Phugpa Lhundrup Gyatso • Pema Karpo Five Personal Forces & Lo Shu Mewa',
    motto: 'Sog, Lu, Wang, Lungta, and La flowing through the 9 Magic Mewa and 8 Parkha Trigrams',
    badge: 'Himalayan Yak Maroon & Saffron Robe',
    instrumentName: '3x3 Lo Shu Mewa Magic Square & 8 Parkha Trigram Mandala',
    containerBg: 'bg-gradient-to-b from-[#1c0810]/70 via-[#120409] to-[#0a0205]',
    containerBorder: 'border-rose-800/60 shadow-lg shadow-rose-950/20',
    headerBg: 'bg-gradient-to-r from-[#2c0b18] via-[#1e0710] to-[#120309]',
    headerBorder: 'border-rose-600/60',
    accentText: 'text-rose-300',
    accentBadge: 'bg-rose-950/90 text-rose-200 border-rose-600/80',
    activeTabClass: 'bg-gradient-to-r from-rose-950 via-rose-900/80 to-orange-950 text-rose-200 border-rose-600 shadow-sm shadow-rose-950/60 font-semibold ring-1 ring-rose-400/40',
    presentationToggleActive: 'bg-gradient-to-r from-rose-900 to-rose-950 text-rose-200 font-bold border border-rose-600 shadow-xs',
    presentationToggleInactive: 'text-slate-400 hover:text-rose-200 hover:bg-rose-950/30',
    frameBg: 'bg-[#130309]/90',
    frameBorder: 'border-rose-800/60',
  },
  maramataka: {
    id: 'maramataka',
    name: 'Polynesian Maramataka',
    nativeTitle: 'Te Maramataka • Oceanic Lunar Wayfinding',
    glyph: '🌊',
    lineage: 'Tohunga Kōkōrangi of Aotearoa & Polynesian Voyaging Ancestors',
    motto: 'Nā te pō i hua mai te ao — Aligning with the 30 lunar nights and tidal Mauri currents',
    badge: 'Pacific Deep Indigo & Pounamu Green',
    instrumentName: '30-Phase Oceanic Lunar Dial & Vitality Energy Gauge',
    containerBg: 'bg-gradient-to-b from-[#051726]/70 via-[#030f19] to-[#02080d]',
    containerBorder: 'border-teal-700/60 shadow-lg shadow-teal-950/20',
    headerBg: 'bg-gradient-to-r from-[#07243c] via-[#04192b] to-[#020e19]',
    headerBorder: 'border-teal-500/60',
    accentText: 'text-teal-300',
    accentBadge: 'bg-teal-950/90 text-teal-200 border-teal-500/80',
    activeTabClass: 'bg-gradient-to-r from-teal-950 via-teal-900/80 to-cyan-950 text-teal-200 border-teal-500 shadow-sm shadow-teal-950/60 font-semibold ring-1 ring-teal-400/40',
    presentationToggleActive: 'bg-gradient-to-r from-teal-900 to-teal-950 text-teal-200 font-bold border border-teal-500 shadow-xs',
    presentationToggleInactive: 'text-slate-400 hover:text-teal-200 hover:bg-teal-950/30',
    frameBg: 'bg-[#03111d]/90',
    frameBorder: 'border-teal-800/60',
  },
};

export const TraditionCharts: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'jyotisha' | 'bazi' | 'western' | 'persian' | 'egyptian' | 'ziwei' | 'mayan' | 'tibetan' | 'maramataka'>('jyotisha');
  const [chartViewMode, setChartViewMode] = useState<'both' | 'chart' | 'table'>('both');

  const { jyotisha, bazi, western, ziwei, mayan, tibetan, persian, egyptian, maramataka } = data.traditions;
  const currentTheme = CULTURE_THEMES[activeTab] || CULTURE_THEMES.jyotisha;

  return (
    <div className={`rounded-xl p-5 border transition-all duration-300 ${currentTheme.containerBg} ${currentTheme.containerBorder}`}>
      {/* Tradition Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-white/10 gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
            Deterministic Tradition Calculators
          </span>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">
            Cultural Computation Datasets
          </h3>
        </div>

        {/* Clean Typographic Tabs with Cultural Glyphs & Theming */}
        <div role="tablist" aria-label="Astrological tradition charts" className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          {Object.values(CULTURE_THEMES).map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                id={`tradition-tab-${t.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tradition-panel-${t.id}`}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs font-mono font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080a0f] ${
                  isActive
                    ? t.activeTabClass
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121721] border border-transparent'
                }`}
              >
                <span className="text-sm select-none">{t.glyph}</span>
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Culturally Themed Display Presentation & Heritage Banner */}
      <div className={`mt-4 p-4 rounded-xl border ${currentTheme.headerBorder} ${currentTheme.headerBg} relative overflow-hidden transition-all duration-300 shadow-sm`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg select-none">{currentTheme.glyph}</span>
              <h4 className={`text-sm sm:text-base font-semibold tracking-wide font-sans ${currentTheme.accentText}`}>
                {currentTheme.nativeTitle}
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${currentTheme.accentBadge}`}>
                {currentTheme.badge}
              </span>
              {TRADITION_PRIMARY_EXPLAINER[activeTab] && (
                <ExplainerTrigger
                  id={TRADITION_PRIMARY_EXPLAINER[activeTab].id}
                  label={TRADITION_PRIMARY_EXPLAINER[activeTab].label}
                  variant="button"
                />
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              {currentTheme.lineage}
            </p>
            <p className="text-[11px] text-slate-400 italic mt-0.5 font-serif">
              &ldquo;{currentTheme.motto}&rdquo;
            </p>
          </div>

          {/* Culture-Themed Display Presentation Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 self-start lg:self-auto shrink-0">
            <span className="text-[11px] font-mono text-slate-400 font-medium">Display Presentation:</span>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#06080e]/90 border border-white/10 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => setChartViewMode('both')}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-mono rounded-md cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  chartViewMode === 'both'
                    ? currentTheme.presentationToggleActive
                    : currentTheme.presentationToggleInactive
                }`}
                aria-pressed={chartViewMode === 'both'}
              >
                Comprehensive
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('chart')}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-mono rounded-md cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  chartViewMode === 'chart'
                    ? currentTheme.presentationToggleActive
                    : currentTheme.presentationToggleInactive
                }`}
                aria-pressed={chartViewMode === 'chart'}
              >
                Visual Instrument
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('table')}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-mono rounded-md cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  chartViewMode === 'table'
                    ? currentTheme.presentationToggleActive
                    : currentTheme.presentationToggleInactive
                }`}
                aria-pressed={chartViewMode === 'table'}
              >
                Telemetry Tables
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: Jyotisha */}
      {activeTab === 'jyotisha' && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase tracking-wider">
                Sidereal Zodiac • Lahiri (Chitra Paksha) Ayanamsha
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Lagna (Ascendant): {jyotisha.lagna.sign} ({jyotisha.lagna.degree.toFixed(2)}°)
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Nakshatra: {jyotisha.lagna.nakshatra?.name} Pada {jyotisha.lagna.nakshatra?.pada} (Lord: {jyotisha.lagna.nakshatra?.lord}) | D9: {jyotisha.lagna.navamsha_sign} | D3: {jyotisha.lagna.drekkana_sign}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-amber-300 border border-amber-900/60">
                Ayanamsha: {data.astronomical_base.ayanamsha.degrees.toFixed(4)}°
              </span>
              <ExplainerTrigger id="lahiri_ayanamsha" label="Ayanamsha" variant="badge" />
            </div>
          </div>

          {/* Visual Kundali Instrument */}
          {chartViewMode !== 'table' && (
            <div className={`p-4 rounded-xl border ${currentTheme.frameBorder} ${currentTheme.frameBg} shadow-inner`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">{currentTheme.glyph}</span>
                  <h5 className={`text-xs font-mono font-semibold ${currentTheme.accentText}`}>
                    {currentTheme.instrumentName}
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Sidereal Astrometric Instrument
                </span>
              </div>
              <NorthIndianChart jyotisha={jyotisha} />
            </div>
          )}

          {chartViewMode !== 'chart' && (
            <>
              {/* Grahas Table with Complete Divisional Subdivisions */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Grahas & Divisional Harmonics (Vargas)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ExplainerTrigger id="lagna_divisional_subdivisions" label="Varga Harmonics" variant="badge" />
                    <ExplainerTrigger id="gandanta_zones" label="Gandanta Knots" variant="badge" />
                  </div>
                </div>
                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Jyotisha planetary positions and dignities"
                  className="overflow-x-auto rounded border border-[#1b2331] focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
                >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#080a0f] text-slate-400 border-b border-[#1b2331] font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3 sticky left-0 bg-[#080a0f] z-10 border-r border-[#1b2331]">Graha</th>
                  <th className="py-2 px-3">Sign</th>
                  <th className="py-2 px-3 font-mono">Degree</th>
                  <th className="py-2 px-3">House</th>
                  <th className="py-2 px-3">Dignity</th>
                  <th className="py-2 px-3">Nakshatra & Pada</th>
                  <th className="py-2 px-3">D9 Nav</th>
                  <th className="py-2 px-3">D10 Dash</th>
                  <th className="py-2 px-3">D3 Drek</th>
                  <th className="py-2 px-3">D7 Sapt</th>
                  <th className="py-2 px-3">D12 Dwad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2331] bg-[#0d1118] font-mono text-[11px] tabular-nums">
                {Object.entries(jyotisha.grahas).map(([name, g]: [string, any]) => (
                  <tr key={name} className="hover:bg-[#121721] transition-colors">
                    <td className="py-2 px-3 font-sans font-medium text-slate-100 flex items-center gap-1.5 whitespace-nowrap sticky left-0 bg-[#0d1118] z-10 border-r border-[#1b2331]">
                      {name}
                      {g.is_retrograde && <span className="text-[10px] text-amber-400 font-mono" title="Retrograde">(R)</span>}
                      {g.is_combust && <span className="text-[10px] text-rose-400 font-mono" title="Combust">(C)</span>}
                      {g.is_gandanta && (
                        <span className="text-[10px] text-rose-400 font-mono bg-rose-950/60 px-1 rounded border border-rose-900" title={g.gandanta_zone}>
                          GD
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-300">{g.sign}</td>
                    <td className="py-2 px-3 text-cyan-300">{g.degree_in_sign.toFixed(2)}°</td>
                    <td className="py-2 px-3 font-mono font-medium text-slate-200">H{g.house}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        g.dignity === 'Exalted' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        g.dignity === 'Debilitated' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        g.dignity === 'Own Sign' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        'text-slate-400'
                      }`}>
                        {g.dignity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300 whitespace-nowrap">
                      {g.nakshatra?.name} P{g.nakshatra?.pada} ({g.nakshatra?.lord})
                    </td>
                    <td className="py-2 px-3 text-amber-300">{g.navamsha_sign}</td>
                    <td className="py-2 px-3 text-purple-300">{g.dashamsha_sign}</td>
                    <td className="py-2 px-3 text-slate-300">{g.drekkana_sign || '-'}</td>
                    <td className="py-2 px-3 text-slate-400">{g.saptamsha_sign || '-'}</td>
                    <td className="py-2 px-3 text-slate-400">{g.dwadashamsha_sign || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

          {/* Planetary War Alert if Occurring */}
          {jyotisha.graha_yuddha && jyotisha.graha_yuddha.length > 0 && (
            <div className="bg-[#191013] p-3 rounded-md border border-rose-900/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-semibold text-rose-400 uppercase tracking-wider">
                  Graha Yuddha (Planetary War within 1.0° Longitude)
                </span>
                <ExplainerTrigger id="graha_yuddha" label="War Mechanics" variant="badge" />
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {jyotisha.graha_yuddha.map((war: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:justify-between text-slate-300">
                    <div>
                      <strong className="text-rose-300">{war.planet_1} vs {war.planet_2}</strong> (Separation: {war.separation_deg}°)
                    </div>
                    <span className="text-emerald-400">{war.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classical Yogas Whitelist */}
          {jyotisha.yogas && jyotisha.yogas.length > 0 && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Classical Yogas Whitelist ({jyotisha.yogas.length} Formed)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {jyotisha.yogas.map((y: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331] text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-amber-300 font-mono">{y.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {y.polarity}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-mono">{y.rule}</p>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">Involves: {y.involved_planets.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Graha Drishti (Aspects) Collapsible / Compact Grid */}
          {jyotisha.graha_drishti && jyotisha.graha_drishti.length > 0 && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Parashari Graha Drishti (Full-Strength Aspects)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
                {jyotisha.graha_drishti.slice(0, 12).map((asp: any, idx: number) => (
                  <div key={idx} className="p-2 rounded bg-[#0d1118] border border-[#1b2331]">
                    <span className="text-amber-400 font-medium block">{asp.graha} (H{asp.source_house})</span>
                    <span className="text-slate-300 text-[11px] block">→ H{asp.target_house} ({asp.target_sign.slice(0, 3)})</span>
                    <span className="text-[9px] text-slate-500 block truncate">{asp.aspect_type.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vimshottari Mahadasha Sequence */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Vimshottari Mahadashas (120-Year Full Cycle)
              </span>
              <ExplainerTrigger id="vimshottari_dasha" label="Dasha Formula" variant="badge" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-xs font-mono">
              {jyotisha.vimshottari_dashas.map((d: any, idx: number) => (
                <div key={idx} className="p-2 rounded bg-[#0d1118] border border-[#1b2331] text-center">
                  <span className="font-semibold text-amber-400 text-xs block">{d.lord}</span>
                  <span className="text-[10px] text-slate-400">{d.total_span_years}y</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">{d.start_date.slice(0, 4)}–{d.end_date.slice(0, 4)}</span>
                </div>
              ))}
            </div>
          </div>
          </>
          )}
        </div>
      )}

      {/* Tab 2: BaZi */}
      {activeTab === 'bazi' && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-red-400 font-mono font-semibold uppercase tracking-wider">
                Solar Term (Jie Qi) • Four Pillars of Destiny
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Day Master: <span className="text-amber-400 font-serif">{bazi.day_master.stem}</span> ({bazi.day_master.element} {bazi.day_master.polarity}) — {bazi.day_master.strength}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Year Na Yin: {bazi.year_nayin} | In Season: {bazi.day_master.in_season ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-red-300 border border-red-900/60">
                Pillars: {bazi.pillars.year?.stem}{bazi.pillars.year?.branch} • {bazi.pillars.month?.stem}{bazi.pillars.month?.branch} • {bazi.pillars.day?.stem}{bazi.pillars.day?.branch} • {bazi.pillars.hour?.stem}{bazi.pillars.hour?.branch}
              </span>
              <ExplainerTrigger id="bazi_four_pillars" label="Four Pillars" variant="badge" />
            </div>
          </div>

          {/* Wu Xing Element Pentagram Diagram */}
          {chartViewMode !== 'table' && (
            <div className={`p-4 rounded-xl border ${currentTheme.frameBorder} ${currentTheme.frameBg} shadow-inner`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">{currentTheme.glyph}</span>
                  <h5 className={`text-xs font-mono font-semibold ${currentTheme.accentText}`}>
                    {currentTheme.instrumentName}
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Wu Xing Dynamic Gauge
                </span>
              </div>
              <BaZiElementPentagram bazi={bazi} />
            </div>
          )}

          {chartViewMode !== 'chart' && (
            <>
              {/* Four Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            {['hour', 'day', 'month', 'year'].map((pKey) => {
              const p = bazi.pillars[pKey];
              if (!p || !p.available) return null;
              const isDay = pKey === 'day';
              return (
                <div
                  key={pKey}
                  className={`p-3.5 rounded-md border ${
                    isDay ? 'bg-[#0f1715] border-emerald-800/80' : 'bg-[#080a0f] border-[#1b2331]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    {p.name} {isDay ? '(Day Master)' : 'Pillar'}
                  </span>
                  <div className="text-2xl font-serif text-white my-1.5 flex justify-center gap-2">
                    <span className="text-amber-400">{p.stem}</span>
                    <span className="text-emerald-400">{p.branch}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300">
                    {p.stem_element} {p.stem_polarity} / {p.branch_element}
                  </div>
                  <div className="mt-1.5 text-[10px] text-cyan-300 font-mono py-0.5 px-1.5 rounded bg-[#121721] border border-[#1b2331]">
                    {p.ten_god_stem}
                  </div>
                  {bazi.all_nayin && bazi.all_nayin[pKey] && (
                    <div className="mt-1 text-[9px] text-slate-400 font-mono">
                      Na Yin: <span className="text-amber-300">{bazi.all_nayin[pKey]}</span>
                    </div>
                  )}
                  <div className="mt-2 text-[10px] text-slate-400 space-y-0.5 text-left font-mono">
                    <span className="text-slate-500 block">Hidden:</span>
                    {p.hidden_stems.map((hs: any, hIdx: number) => (
                      <div key={hIdx} className="flex justify-between">
                        <span>{hs.stem} ({hs.element})</span>
                        <span className="text-slate-500">{hs.ten_god}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day Master & Five Elements Balance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Day Master Assessment
                </span>
                <ExplainerTrigger id="bazi_day_master" label="Day Master" variant="badge" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-serif text-amber-400">
                    {bazi.day_master.stem} ({bazi.day_master.element} {bazi.day_master.polarity})
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Season: {bazi.day_master.in_season ? 'Born In Supportive Season' : 'Born Out of Season'}
                  </p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-mono font-medium rounded border ${
                  bazi.day_master.strength.includes('Strong')
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {bazi.day_master.strength}
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-400 font-mono space-y-1">
                <div>Rooting: {bazi.day_master.rooting.join(', ') || 'No direct root'}</div>
                <div>Support: {bazi.day_master.support_score} vs Drain: {bazi.day_master.drain_score}</div>
                <div>Year Na Yin: {bazi.year_nayin}</div>
              </div>
            </div>

            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Five Elements Distribution
                </span>
                <ExplainerTrigger id="wu_xing_pentagram" label="Wu Xing Cycles" variant="badge" />
              </div>
              <div className="space-y-1.5 mt-2">
                {Object.entries(bazi.five_elements_balance.percentages).map(([elem, pct]: [string, any]) => (
                  <div key={elem} className="space-y-0.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{elem}</span>
                      <span className="text-cyan-300 tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                      <div
                        className={`h-full ${
                          elem === 'Wood' ? 'bg-emerald-500' :
                          elem === 'Fire' ? 'bg-rose-500' :
                          elem === 'Earth' ? 'bg-amber-500' :
                          elem === 'Metal' ? 'bg-slate-300' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Branch & Stem Interactions (Combinations, Clashes, Harms, Punishments) */}
          {bazi.branch_interactions && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Pillar Interactions & Combinations (He / Chong / Xing / Hai)
                </span>
                <ExplainerTrigger id="bazi_branch_interactions" label="He / Chong Rules" variant="badge" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono">
                {/* Harmonies & Combinations */}
                <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-emerald-400 font-semibold block mb-1">Harmonies & Transformations:</span>
                  {bazi.branch_interactions.six_harmonies.length === 0 &&
                   bazi.branch_interactions.three_harmonies.length === 0 &&
                   bazi.branch_interactions.stem_combinations.length === 0 ? (
                    <span className="text-slate-500 text-[11px]">No direct major harmonies active</span>
                  ) : (
                    <div className="space-y-1">
                      {bazi.branch_interactions.stem_combinations.map((sc: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {sc.type} ({sc.pillars.join(' + ')})
                        </div>
                      ))}
                      {bazi.branch_interactions.six_harmonies.map((sh: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {sh.type} ({sh.pillars.join(' + ')})
                        </div>
                      ))}
                      {bazi.branch_interactions.three_harmonies.map((th: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {th.type} ({th.pillars.join(', ')})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clashes, Punishments & Harms */}
                <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-rose-400 font-semibold block mb-1">Clashes, Harms & Punishments:</span>
                  {bazi.branch_interactions.six_clashes.length === 0 &&
                   bazi.branch_interactions.punishments.length === 0 &&
                   bazi.branch_interactions.six_harms.length === 0 ? (
                    <span className="text-slate-500 text-[11px]">No structural clashes or punishments active</span>
                  ) : (
                    <div className="space-y-1">
                      {bazi.branch_interactions.six_clashes.map((c: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {c.type} ({c.pillars.join(' vs ')})
                        </div>
                      ))}
                      {bazi.branch_interactions.punishments.map((p: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {p.type} ({p.pillars.join(', ')})
                        </div>
                      ))}
                      {bazi.branch_interactions.six_harms.map((h: any, idx: number) => (
                        <div key={idx} className="text-slate-300 text-[11px]">
                          • {h.type} ({h.pillars.join(' vs ')})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shen Sha (Symbolic Stars) */}
          {bazi.shen_sha && bazi.shen_sha.length > 0 && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Shen Sha (Symbolic & Auxiliary Spirits)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
                {bazi.shen_sha.map((star: any, idx: number) => (
                  <div key={idx} className={`p-2.5 rounded border ${
                    star.present ? 'bg-[#0d1118] border-cyan-900/60' : 'bg-[#080a0f] border-[#1b2331] opacity-60'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-semibold ${star.present ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {star.name}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                        star.present ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-300 border border-[#1b2331]'
                      }`}>
                        {star.present ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    {star.present && (
                      <span className="text-[10px] text-amber-300 block mb-0.5">
                        Found in: {star.locations.join(', ')}
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">{star.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Da Yun Decades */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Da Yun (10-Year Luck Pillars Progression)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-mono">
              {bazi.da_yun_luck_pillars.map((dy: any) => (
                <div key={dy.step} className="p-2 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-[10px] text-slate-500 block">Age {dy.start_age}</span>
                  <span className="text-base font-serif text-white my-0.5 block">
                    {dy.stem}{dy.branch}
                  </span>
                  <span className="text-[10px] text-cyan-300 block">{dy.ten_god}</span>
                  <span className="text-[9px] text-slate-500 block">{dy.start_year}</span>
                </div>
              ))}
            </div>
          </div>
          </>
          )}
        </div>
      )}

      {/* Tab 3: Western */}
      {activeTab === 'western' && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-blue-400 font-mono font-semibold uppercase tracking-wider">
                Tropical Zodiac • Whole-Sign Houses
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Ascendant: {western.ascendant.sign} ({western.ascendant.degree}°)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Sect: <strong className="text-white font-mono">{western.sect.label}</strong> • Benefic: <span className="text-emerald-400 font-mono">{western.sect.sect_benefic}</span> • Malefic: <span className="text-rose-400 font-mono">{western.sect.sect_malefic}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ExplainerTrigger id="western_sect" label="Sect Framework" variant="badge" />
              {western.lots.lot_of_fortune && (
                <div className="text-xs font-mono text-slate-300 bg-[#121721] p-2.5 rounded border border-[#1b2331]">
                  <div>Lot of Fortune: {western.lots.lot_of_fortune.sign} {western.lots.lot_of_fortune.degree}° (H{western.lots.lot_of_fortune.house})</div>
                  <div>Lot of Spirit: {western.lots.lot_of_spirit.sign} {western.lots.lot_of_spirit.degree}° (H{western.lots.lot_of_spirit.house})</div>
                </div>
              )}
            </div>
          </div>

          {/* Visual Western Wheel */}
          {chartViewMode !== 'table' && (
            <div className={`p-4 rounded-xl border ${currentTheme.frameBorder} ${currentTheme.frameBg} shadow-inner`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">{currentTheme.glyph}</span>
                  <h5 className={`text-xs font-mono font-semibold ${currentTheme.accentText}`}>
                    {currentTheme.instrumentName}
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Hellenistic 360° Astrolabe
                </span>
              </div>
              <WesternCircularWheel western={western} />
            </div>
          )}

          {chartViewMode !== 'chart' && (
            <>
              {/* Planets & Essential Dignities Table */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Planetary Dignities & Angularity
                  </span>
                  <ExplainerTrigger id="essential_dignities_score" label="Dignity Matrix" variant="badge" />
                </div>
                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Jyotisha planetary positions and dignities"
                  className="overflow-x-auto rounded border border-[#1b2331] focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
                >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#080a0f] text-slate-400 border-b border-[#1b2331] font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3 sticky left-0 bg-[#080a0f] z-10 border-r border-[#1b2331]">Planet</th>
                  <th className="py-2 px-3">Sign</th>
                  <th className="py-2 px-3 font-mono">Degree</th>
                  <th className="py-2 px-3">House</th>
                  <th className="py-2 px-3">Angularity</th>
                  <th className="py-2 px-3 font-mono">Dignity Score</th>
                  <th className="py-2 px-3">Essential Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2331] bg-[#0d1118] font-mono text-[11px] tabular-nums">
                {Object.entries(western.planets).map(([name, p]: [string, any]) => (
                  <tr key={name} className="hover:bg-[#121721] transition-colors">
                    <td className="py-2 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5 sticky left-0 bg-[#0d1118] z-10 border-r border-[#1b2331] whitespace-nowrap">
                      {name}
                      {p.is_retrograde && <span className="text-[10px] text-amber-400 font-mono">(R)</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-300">{p.sign}</td>
                    <td className="py-2 px-3 text-cyan-300">{p.degree_in_sign?.toFixed(2)}°</td>
                    <td className="py-2 px-3 text-slate-200">H{p.house}</td>
                    <td className="py-2 px-3 text-slate-400">{p.angularity}</td>
                    <td className="py-2 px-3">
                      {p.is_traditional ? (
                        <span className={p.dignity_score > 0 ? 'text-emerald-400' : p.dignity_score < 0 ? 'text-rose-400' : 'text-slate-400'}>
                          {p.dignity_score > 0 ? `+${p.dignity_score}` : p.dignity_score}
                        </span>
                      ) : <span className="text-slate-400 font-normal">Modern</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-300 text-[11px]">
                      {p.dignity_breakdown?.join(', ') || 'Peregrine (0)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

          {/* Mutual Reception Banner if Present */}
          {western.mutual_receptions && western.mutual_receptions.length > 0 && (
            <div className="bg-[#0f1715] p-3 rounded-md border border-emerald-800/80">
              <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Mutual Reception by Domicile
              </span>
              <div className="space-y-1 text-xs font-mono text-slate-300">
                {western.mutual_receptions.map((mr: any, idx: number) => (
                  <div key={idx}>
                    • <strong className="text-emerald-300">{mr.planet_1}</strong> (in {mr.sign_1}) ↔ <strong className="text-emerald-300">{mr.planet_2}</strong> (in {mr.sign_2}) — mutual empowerment and shared agency
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Major Ptolemaic Aspects Grid */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Major Ptolemaic Aspects ({western.aspects.length} Active • Dynamic Motion)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
              {western.aspects.map((asp: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331] flex justify-between items-center">
                  <div>
                    <span className="text-slate-200">{asp.planet_1} {asp.aspect} {asp.planet_2}</span>
                    <span className={`text-[10px] block ${
                      asp.status === 'Applying' ? 'text-cyan-400' : 'text-slate-500'
                    }`}>{asp.status}</span>
                  </div>
                  <span className="text-cyan-400 font-medium tabular-nums">{asp.exact_orb_deg}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* Minor Aspects Grid */}
          {western.minor_aspects && western.minor_aspects.length > 0 && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Minor Harmonics & Keplarian Aspects (Quincunx, Semi-Sextile, Semi-Square, Sesquiquadrate)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
                {western.minor_aspects.map((asp: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331] flex justify-between items-center">
                    <div>
                      <span className="text-slate-300">{asp.planet_1} {asp.aspect} {asp.planet_2}</span>
                      <span className={`text-[10px] block ${
                        asp.status === 'Applying' ? 'text-amber-400' : 'text-slate-500'
                      }`}>{asp.status}</span>
                    </div>
                    <span className="text-amber-400 font-medium tabular-nums">{asp.exact_orb_deg}°</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Antiscia and Contra-Antiscia Reflections */}
          {((western.antiscia_pairs && western.antiscia_pairs.length > 0) ||
            (western.contra_antiscia_pairs && western.contra_antiscia_pairs.length > 0)) && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  Solstitial & Equinoctial Reflections (Antiscia & Contra-Antiscia)
                </span>
                <ExplainerTrigger id="antiscia_contra_antiscia" label="Solstice Mirrors" variant="badge" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {western.antiscia_pairs?.map((p: any, idx: number) => (
                  <div key={`ant-${idx}`} className="p-2 rounded bg-[#0d1118] border border-[#1b2331] flex justify-between items-center">
                    <span className="text-slate-200">{p.planet_1} ☌ {p.planet_2} (Antiscia)</span>
                    <span className="text-cyan-400 text-[11px] tabular-nums">{p.orb_deg}° orb</span>
                  </div>
                ))}
                {western.contra_antiscia_pairs?.map((p: any, idx: number) => (
                  <div key={`contra-${idx}`} className="p-2 rounded bg-[#0d1118] border border-[#1b2331] flex justify-between items-center">
                    <span className="text-slate-200">{p.planet_1} ☍ {p.planet_2} (Contra-Antiscia)</span>
                    <span className="text-amber-400 text-[11px] tabular-nums">{p.orb_deg}° orb</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          </>
          )}
        </div>
      )}

      {/* Tab 4: Zi Wei Dou Shu */}
      {activeTab === 'ziwei' && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-purple-400 font-mono font-semibold uppercase tracking-wider">
                Zi Wei Dou Shu • Twelve Palaces & 14 Major Stars
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Bureau: {ziwei.five_elements_bureau.name} | Ming: {ziwei.ming_palace_branch} | Shen: {ziwei.shen_palace_branch}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Lunar Date: {ziwei.lunar_date.year} Year, Month {ziwei.lunar_date.month}, Day {ziwei.lunar_date.day} ({ziwei.lunar_date.hour_branch} Hour)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-xs font-mono text-purple-300 bg-[#121721] p-2.5 rounded border border-[#1b2331]">
                <span className="font-semibold text-amber-400 block mb-0.5">Si Hua Transformations:</span>
                <div>Lu: {ziwei.si_hua_transformations.Lu} | Quan: {ziwei.si_hua_transformations.Quan}</div>
                <div>Ke: {ziwei.si_hua_transformations.Ke} | Ji: {ziwei.si_hua_transformations.Ji}</div>
              </div>
              <ExplainerTrigger id="ziwei_palaces_stars" label="12 Palaces & Si Hua" variant="badge" />
            </div>
          </div>

          {/* Ming Palace Star Quality Assessment */}
          {ziwei.ming_star_quality && (
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold block">
                  Ming Palace Star Dynamics
                </span>
                <span className="text-sm font-semibold text-slate-200 mt-0.5 block">
                  Configuration: {ziwei.ming_star_quality.assessment}
                </span>
                <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                  Major: {ziwei.ming_star_quality.major_auspicious_count} Auspicious / {ziwei.ming_star_quality.major_dynamic_count} Dynamic • Auxiliary: {ziwei.ming_star_quality.auxiliary_auspicious_count} Auspicious / {ziwei.ming_star_quality.auxiliary_malefic_count} Malefic
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-mono rounded border ${
                  ziwei.ming_star_quality.assessment.includes('Fortified')
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : ziwei.ming_star_quality.assessment.includes('Frictional')
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-purple-950 text-purple-300 border-purple-800'
                }`}>
                  {ziwei.ming_star_quality.assessment}
                </span>
              </div>
            </div>
          )}

          {/* Zi Wei Authentic 4x4 Courtyard Grid Visual Instrument */}
          {chartViewMode !== 'table' && (
            <div className={`p-4 rounded-xl border ${currentTheme.frameBorder} ${currentTheme.frameBg} shadow-inner`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">{currentTheme.glyph}</span>
                  <h5 className={`text-xs font-mono font-semibold ${currentTheme.accentText}`}>
                    {currentTheme.instrumentName}
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Imperial Polar Courtyard Matrix
                </span>
              </div>
              <ZiWeiPalaceGrid ziwei={ziwei} />
            </div>
          )}

          {chartViewMode !== 'chart' && (
            <>
              {/* 12 Palaces Detailed List with Auxiliary Stars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {ziwei.palaces.map((p: any) => (
              <div
                key={p.name}
                className={`p-3 rounded-md border ${
                  p.is_ming
                    ? 'bg-[#14121f] border-purple-800'
                    : p.is_shen
                    ? 'bg-[#0f171b] border-cyan-800'
                    : 'bg-[#080a0f] border-[#1b2331]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-semibold text-slate-200 text-xs">
                    {p.name} {p.is_ming && '★'}
                  </span>
                  <span className="text-xs font-serif text-slate-400">
                    {p.branch}
                  </span>
                </div>
                <div className="min-h-[44px] space-y-1">
                  {p.stars.length > 0 ? (
                    p.stars.map((s: string, sIdx: number) => {
                      const isAux = s.startsWith('[A]');
                      return (
                        <span
                          key={sIdx}
                          className={`inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded mr-1 mb-1 border ${
                            isAux
                              ? 'bg-[#0b1622] border-cyan-900/60 text-cyan-300'
                              : 'bg-[#121721] border-[#1b2331] text-amber-300'
                          }`}
                        >
                          {s}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-slate-400 text-[10px] font-mono italic">Borrowing Stars</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      )}
      {activeTab === 'mayan' && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] text-cyan-400 font-mono font-semibold uppercase tracking-wider">
              Classic Maya Long Count & Calendar Round • GMT Correlation (584283)
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-4">
              <div>
                <span className="text-xl font-mono font-bold text-cyan-300">
                  {mayan.long_count.formatted}
                </span>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Total Kin: <span className="text-slate-200">{mayan.long_count.total_kin}</span> • Lord of Night: <span className="text-amber-300">{mayan.lord_of_the_night}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-2.5 py-1 text-xs font-mono font-medium rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Round-Trip Verification: PASS
                </div>
                <ExplainerTrigger id="maya_calendar_round" label="Sacred Cycles" variant="badge" />
              </div>
            </div>
          </div>

          {/* Maya Sacred Calendar Round Dial Visual Instrument */}
          {chartViewMode !== 'table' && (
            <div className={`p-4 rounded-xl border ${currentTheme.frameBorder} ${currentTheme.frameBg} shadow-inner`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">{currentTheme.glyph}</span>
                  <h5 className={`text-xs font-mono font-semibold ${currentTheme.accentText}`}>
                    {currentTheme.instrumentName}
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Classic Maya Stele Dial
                </span>
              </div>
              <MayaCalendarCompass mayan={mayan} />
            </div>
          )}

          {chartViewMode !== 'chart' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Tzolk'in 260-Day Sacred Cycle</span>
              <h4 className="text-lg font-mono font-semibold text-slate-100 mt-1">
                {mayan.tzolkin.formatted}
              </h4>
              <p className="text-xs text-amber-300 font-mono mt-0.5">
                Glyph: {mayan.tzolkin.symbol}
              </p>
              <p className="text-xs text-slate-400 mt-1.5 font-mono">
                Archetype: {mayan.tzolkin.archetype_keywords}
              </p>
            </div>

            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Haab' 365-Day Solar Cycle</span>
              <h4 className="text-lg font-mono font-semibold text-slate-100 mt-1">
                {mayan.haab.formatted}
              </h4>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">
                Calendar Round: {mayan.calendar_round}
              </p>
              <p className="text-[11px] text-slate-500 mt-1.5 italic font-mono">
                *Attributed Symbolic Overlay: non-causal archetype resonance.
              </p>
            </div>
          </div>
          </>
          )}
        </div>
      )}

      {/* Tab 6: Tibetan Elemental */}
      {activeTab === 'tibetan' && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] text-rose-400 font-mono font-semibold uppercase tracking-wider">
              Tibetan Elemental Astrology (Jungtsi / འབྱུང་རྩིས)
            </span>
            <div className="mt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-slate-100">
                  {tibetan.rabjung_cycle.element_gender_animal}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Rabjung Cycle {tibetan.rabjung_cycle.rabjung_number}, Year {tibetan.rabjung_cycle.year_in_cycle} (Base 1027 CE)
                </p>
              </div>
              <div className="text-xs font-mono text-slate-300 bg-[#121721] p-2.5 rounded border border-[#1b2331]">
                <div>Year Mewa: <strong className="text-amber-400">{tibetan.mewa.formatted}</strong></div>
                <div>Natal Parkha: <strong className="text-cyan-400">{tibetan.parkha.name} ({tibetan.parkha.element})</strong></div>
              </div>
            </div>
          </div>

          {/* Tibetan Mewa Magic Square & Parkha Visual Instrument */}
          {chartViewMode !== 'table' && (
            <div className={`p-4 rounded-xl border ${currentTheme.frameBorder} ${currentTheme.frameBg} shadow-inner`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">{currentTheme.glyph}</span>
                  <h5 className={`text-xs font-mono font-semibold ${currentTheme.accentText}`}>
                    {currentTheme.instrumentName}
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Lo Shu 3x3 Magic Mandala
                </span>
              </div>
              <TibetanMewaGrid tibetan={tibetan} />
            </div>
          )}

          {chartViewMode !== 'chart' && (
            <>
              {/* Five Personal Forces */}
              <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    Five Personal Forces (Khams Lnga)
                  </span>
                  <ExplainerTrigger id="tibetan_mewa_parkha" label="Lo Shu & Forces" variant="badge" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">Sog (Life)</span>
                <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">{tibetan.five_personal_forces.sog_life_force}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">Lu (Body)</span>
                <span className="text-xs font-semibold text-blue-400 mt-0.5 block">{tibetan.five_personal_forces.lu_body_health}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">Wang (Power)</span>
                <span className="text-xs font-semibold text-amber-400 mt-0.5 block">{tibetan.five_personal_forces.wang_power_status}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">Lungta (Fortune)</span>
                <span className="text-xs font-semibold text-purple-400 mt-0.5 block">{tibetan.five_personal_forces.lungta_wind_horse_fortune}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                <span className="text-[10px] text-slate-500 uppercase block">La (Soul)</span>
                <span className="text-xs font-semibold text-cyan-400 mt-0.5 block">{tibetan.five_personal_forces.la_soul_vitality}</span>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      )}

      {/* Tab: Persian & Medieval Arabic (Ilm al-Nujūm) */}
      {activeTab === 'persian' && persian && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase tracking-wider">
                Persian & Medieval Arabic • Ilm al-Nujūm (علم النجوم)
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Almuten Figuris (Supreme Soul Guide): <span className="text-amber-400 font-bold">{persian.almuten_figuris.victor}</span> (Score: {persian.almuten_figuris.victor_score} pts)
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {persian.sect.sect_name} • Planetary Day Ruler: <strong className="text-cyan-300">{persian.sect.day_ruler}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-amber-300 border border-amber-900/60">
                Almuten: {persian.almuten_figuris.victor}
              </span>
            </div>
          </div>

          {/* Almuten Comparative Dignity Bar Visual Instrument */}
          {chartViewMode !== 'table' && (
            <div className={`p-4 rounded-xl border ${currentTheme.frameBorder} ${currentTheme.frameBg} shadow-inner`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">{currentTheme.glyph}</span>
                  <h5 className={`text-xs font-mono font-semibold ${currentTheme.accentText}`}>
                    {currentTheme.instrumentName}
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Abu Ma’shar Almuten Gauge
                </span>
              </div>
              <AlmutenDignityBarChart persian={persian} />
            </div>
          )}

          {chartViewMode !== 'chart' && (
            <>
              {/* Almuten Figuris Dignity Leaderboard */}
              <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    Weighted Dignity Leaderboard (Abu Ma'shar / Al-Qabisi Point System)
                  </span>
                  <ExplainerTrigger id="almuten_figuris" label="Almuten Math" variant="badge" />
                </div>
                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Jyotisha planetary positions and dignities"
                  className="overflow-x-auto rounded border border-[#1b2331] focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
                >
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-[#0d1118] text-slate-400 border-b border-[#1b2331] uppercase text-[10px]">
                    <th className="py-2 px-3 sticky left-0 bg-[#0d1118] z-10 border-r border-[#1b2331]">Rank & Planet</th>
                    <th className="py-2 px-3 text-right">Essential Pts</th>
                    <th className="py-2 px-3 text-right">Accidental Pts</th>
                    <th className="py-2 px-3 text-right">Total Score</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2331] text-[11px] tabular-nums">
                  {persian.almuten_figuris.leaderboard.map((item: any, idx: number) => (
                    <tr key={item.planet} className={idx === 0 ? 'bg-[#141d2b] font-bold text-amber-300' : 'hover:bg-[#121721]'}>
                      <td className="py-2 px-3 text-slate-200 sticky left-0 bg-[#0d1118] z-10 border-r border-[#1b2331] whitespace-nowrap">
                        #{idx + 1} {item.planet}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">+{item.essential_dignity}</td>
                      <td className="py-2 px-3 text-right text-slate-400">+{item.accidental_dignity}</td>
                      <td className="py-2 px-3 text-right font-bold text-cyan-300">{item.total_score}</td>
                      <td className="py-2 px-3">
                        {idx === 0 ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-950 text-amber-300 border border-amber-700">
                            ALMUTEN FIGURIS
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Candidate</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hermetic Arabic Parts (Lots) */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Hermetic Arabic Lots (Exact Mathematical Reflections)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-xs">
              {Object.entries(persian.hermetic_lots).map(([lotName, lot]: [string, any]) => (
                <div key={lotName} className="p-2.5 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-cyan-300 font-semibold block truncate text-[11px]">{lotName}</span>
                  <div className="text-slate-300 mt-1">
                    {lot.sign} {lot.degree.toFixed(2)}° <span className="text-slate-500">(H{lot.house})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Firdaria 75-Year Planetary Chronocrator Timeline */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Firdaria Lifespan Timeline (75-Year Planetary Era Cycle)
              </span>
              <ExplainerTrigger id="firdaria_periods" label="Firdaria Timeline" variant="badge" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-center text-xs font-mono">
              {persian.firdaria.timeline.map((f: any, idx: number) => (
                <div key={idx} className="p-2 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-[10px] text-slate-500 block">Ages {f.start_age}–{f.end_age}</span>
                  <span className="font-semibold text-amber-400 text-xs my-0.5 block">{f.planet}</span>
                  <span className="text-[9px] text-cyan-300 block">{f.duration_years} Years</span>
                  <span className="text-[9px] text-slate-500 block">{f.start_year}–{f.end_year}</span>
                </div>
              ))}
            </div>
          </div>
          </>
          )}
        </div>
      )}

      {/* Tab: Ancient Egyptian (Decanic & Chronocrators) */}
      {activeTab === 'egyptian' && egyptian && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-cyan-400 font-mono font-semibold uppercase tracking-wider">
                Ancient Egyptian Temple Horoscopy • Dendera & Senenmut Decans
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Hour Ruler Chronocrator: <span className="text-cyan-300 font-bold">{egyptian.chronocrator_watch.hour_ruler_chronocrator}</span> ({egyptian.chronocrator_watch.period})
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {egyptian.sothic_civil_cycle.season}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-cyan-300 border border-cyan-800">
                Hour {egyptian.chronocrator_watch.temporal_hour_number} of 12
              </span>
            </div>
          </div>

          {/* Ra's Cosmic Barque 36-Decan Star Clock Visual Instrument */}
          {chartViewMode !== 'table' && (
            <div className={`p-4 rounded-xl border ${currentTheme.frameBorder} ${currentTheme.frameBg} shadow-inner`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">{currentTheme.glyph}</span>
                  <h5 className={`text-xs font-mono font-semibold ${currentTheme.accentText}`}>
                    {currentTheme.instrumentName}
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Dendera Decanic Star Clock
                </span>
              </div>
              <EgyptianDecanStarClock egyptian={egyptian} />
            </div>
          )}

          {chartViewMode !== 'chart' && (
            <>
              {/* 36 Decan Guardians */}
              <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    Decanic Guardians of Ra's Cosmic Barque (10° Sky Segments)
                  </span>
                  <ExplainerTrigger id="egyptian_decan_clock" label="36 Decan Gates" variant="badge" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              {Object.entries(egyptian.decan_guardians).map(([pointKey, decan]: [string, any]) => (
                <div key={pointKey} className="p-3 rounded bg-[#0d1118] border border-[#1b2331]">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    {pointKey.replace('_', ' ')}
                  </span>
                  <h5 className="font-semibold text-amber-300 text-sm mt-0.5">
                    {decan.decan_name}
                  </h5>
                  <div className="text-[11px] text-slate-300 mt-1 font-sans">
                    Deity: <strong className="text-slate-100">{decan.presiding_deity}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 italic font-sans">
                    {decan.hieroglyph_symbolism}
                  </div>
                  <div className="mt-2 text-[9px] text-cyan-400 font-mono">
                    {decan.sign} • Decan #{decan.decan_in_sign} (Overall #{decan.overall_decan_number})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sothic Calendar & Epagomenal Day */}
          <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Sothic Year Civil Alignment
            </span>
            <p className="text-xs text-slate-300 font-mono mt-1">
              {egyptian.sothic_civil_cycle.solar_barque_alignment}
            </p>
            {egyptian.sothic_civil_cycle.epagomenal_birth_deity && (
              <div className="mt-2 p-2 rounded bg-amber-950/40 border border-amber-800 text-xs text-amber-300 font-mono">
                ★ Born during the Five Epagomenal Days (*Heru Renpet*): {egyptian.sothic_civil_cycle.epagomenal_birth_deity}
              </div>
            )}
          </div>
          </>
          )}
        </div>
      )}

      {/* Tab: Polynesian & Māori Maramataka */}
      {activeTab === 'maramataka' && maramataka && (
        <div className="mt-4 space-y-4 animate-tab-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331] gap-3">
            <div>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase tracking-wider">
                Polynesian & Māori Maramataka • Oceanic Lunar Phase Archetype
              </span>
              <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                Lunar Night #{maramataka.lunar_night.number}: <span className="text-emerald-400 font-bold">{maramataka.lunar_night.name}</span>
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Vitality Index: <strong className="text-cyan-300">{maramataka.lunar_night.vitality_index}</strong> • Moon Illumination: {maramataka.lunar_night.illumination_percent}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#121721] text-emerald-300 border border-emerald-800">
                Elongation: {maramataka.lunar_night.elongation_degrees}°
              </span>
            </div>
          </div>

          {/* Oceanic 30-Night Lunar Dial Visual Instrument */}
          {chartViewMode !== 'table' && (
            <div className={`p-4 rounded-xl border ${currentTheme.frameBorder} ${currentTheme.frameBg} shadow-inner`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">{currentTheme.glyph}</span>
                  <h5 className={`text-xs font-mono font-semibold ${currentTheme.accentText}`}>
                    {currentTheme.instrumentName}
                  </h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Polynesian Oceanic Dial
                </span>
              </div>
              <MaramatakaLunarDial maramataka={maramataka} />
            </div>
          )}

          {chartViewMode !== 'chart' && (
            <>
              {/* Behavioral & Vitality Profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Biological & Behavioral Rhythm Profile
                </span>
                <ExplainerTrigger id="maramataka_lunar_dial" label="30 Oceanic Nights" variant="badge" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {maramataka.lunar_night.behavioral_profile}
              </p>
            </div>

            <div className="bg-[#080a0f] p-3.5 rounded-md border border-[#1b2331]">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Oceanic Archetype & Action Guidance
              </span>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500">Elemental Mode:</span>{' '}
                  <span className="text-cyan-300">{maramataka.oceanic_archetype.elemental_mode}</span>
                </div>
                <div>
                  <span className="text-slate-500">Optimal Action:</span>{' '}
                  <span className="text-emerald-400 font-semibold">{maramataka.oceanic_archetype.optimal_action}</span>
                </div>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      )}
    </div>
  );
};
