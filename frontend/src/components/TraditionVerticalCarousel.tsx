import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  Compass,
  ArrowRight,
  Layers,
  Info
} from 'lucide-react';
import { ChartResponse } from '../types';
import {
  NorthIndianChart,
  WesternCircularWheel,
  BaZiElementPentagram,
  ZiWeiPalaceGrid,
  AlmutenDignityBarChart,
  MaramatakaLunarDial,
  TibetanMewaGrid,
  EgyptianDecanStarClock,
  MayaCalendarCompass,
} from './ChartWheelVisualizer';
import { ExplainerTrigger } from './ExplainerTrigger';

export type TraditionKey =
  | 'jyotisha'
  | 'bazi'
  | 'western'
  | 'ziwei'
  | 'mayan'
  | 'tibetan'
  | 'persian'
  | 'egyptian'
  | 'maramataka';

export const TRADITION_ORDER: TraditionKey[] = [
  'jyotisha',
  'bazi',
  'western',
  'ziwei',
  'mayan',
  'tibetan',
  'persian',
  'egyptian',
  'maramataka',
];

interface Props {
  data: ChartResponse;
  activeTab: TraditionKey;
  chartViewMode?: 'both' | 'chart' | 'table';
  onSelectTradition: (tradition: TraditionKey) => void;
  onOpenInspector: (tradition: TraditionKey) => void;
  cultureThemes: Record<string, any>;
  primaryExplainers: Record<string, { id: string; label: string }>;
}

export const TraditionVerticalCarousel: React.FC<Props> = ({
  data,
  activeTab,
  chartViewMode = 'both',
  onSelectTradition,
  onOpenInspector,
  cultureThemes,
  primaryExplainers,
}) => {
  const activeIndex = TRADITION_ORDER.indexOf(activeTab);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);

  const goToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(TRADITION_ORDER.length - 1, index));
      onSelectTradition(TRADITION_ORDER[clamped]);
    },
    [onSelectTradition]
  );

  const goNext = useCallback(() => {
    if (activeIndex < TRADITION_ORDER.length - 1) {
      goToIndex(activeIndex + 1);
    }
  }, [activeIndex, goToIndex]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) {
      goToIndex(activeIndex - 1);
    }
  }, [activeIndex, goToIndex]);

  // Keyboard navigation when container is in view/focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToIndex(TRADITION_ORDER.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, goToIndex]);

  // Wheel listener with throttle
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 260) return;

    if (Math.abs(e.deltaY) > 28) {
      lastScrollTime.current = now;
      if (e.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  const { jyotisha, bazi, western, ziwei, mayan, tibetan, persian, egyptian, maramataka } =
    data.traditions;

  // Render cultural instrument component
  const renderInstrument = (key: TraditionKey, _theme: any) => {
    const isCompact = chartViewMode !== 'chart';
    switch (key) {
      case 'jyotisha':
        return jyotisha ? <NorthIndianChart jyotisha={jyotisha} compact={isCompact} /> : null;
      case 'bazi':
        return bazi ? <BaZiElementPentagram bazi={bazi} compact={isCompact} /> : null;
      case 'western':
        return western ? <WesternCircularWheel western={western} compact={isCompact} /> : null;
      case 'ziwei':
        return ziwei ? <ZiWeiPalaceGrid ziwei={ziwei} compact={isCompact} /> : null;
      case 'mayan':
        return mayan ? <MayaCalendarCompass mayan={mayan} compact={isCompact} /> : null;
      case 'tibetan':
        return tibetan ? <TibetanMewaGrid tibetan={tibetan} compact={isCompact} /> : null;
      case 'persian':
        return persian ? <AlmutenDignityBarChart persian={persian} compact={isCompact} /> : null;
      case 'egyptian':
        return egyptian ? <EgyptianDecanStarClock egyptian={egyptian} compact={isCompact} /> : null;
      case 'maramataka':
        return maramataka ? <MaramatakaLunarDial maramataka={maramataka} compact={isCompact} /> : null;
      default:
        return null;
    }
  };

  // Extract key telemetry badges per tradition
  const renderTelemetryHighlights = (key: TraditionKey) => {
    switch (key) {
      case 'jyotisha':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Lagna (Ascendant)</span>
              <strong className="text-amber-300 font-bold">
                {jyotisha?.lagna?.sign} ({jyotisha?.lagna?.degree?.toFixed(2)}°)
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Moon Nakshatra</span>
              <strong className="text-amber-200">
                {jyotisha?.lagna?.nakshatra?.name || 'Ashwini'} P{jyotisha?.lagna?.nakshatra?.pada || 1}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">D9 Navamsha</span>
              <strong className="text-amber-400">{jyotisha?.lagna?.navamsha_sign || 'Aries'}</strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Ayanamsha (Lahiri)</span>
              <strong className="text-amber-300 font-mono">
                {data.astronomical_base?.ayanamsha?.degrees?.toFixed(4)}°
              </strong>
            </div>
          </div>
        );

      case 'bazi':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Day Master (日主)</span>
              <strong className="text-rose-300 font-bold">
                {bazi?.day_master?.stem || 'Jia (甲)'} ({bazi?.day_master?.element || 'Wood'})
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Dominant Qi (气)</span>
              <strong className="text-rose-200">{bazi?.dominant_element || 'Fire/Metal Balance'}</strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Solar Term (节气)</span>
              <strong className="text-rose-400">{bazi?.solar_term || 'Vernal Equinox'}</strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Year Pillar</span>
              <strong className="text-rose-300 font-mono">
                {bazi?.pillars?.year?.stem} {bazi?.pillars?.year?.branch}
              </strong>
            </div>
          </div>
        );

      case 'western':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Ascendant (H1)</span>
              <strong className="text-sky-300 font-bold">
                {western?.ascendant?.sign || 'Leo'} ({western?.ascendant?.degree || 0}°)
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Planetary Sect</span>
              <strong className="text-sky-200">
                {western?.sect?.label || (western?.sect?.is_day_chart ? 'Diurnal Chart' : 'Nocturnal Chart')}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Lot of Fortune</span>
              <strong className="text-sky-400">
                {western?.lots?.lot_of_fortune ? `${western.lots.lot_of_fortune.sign} H${western.lots.lot_of_fortune.house}` : 'H1 Angular'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">House System</span>
              <strong className="text-sky-300">Ptolemaic Whole Sign</strong>
            </div>
          </div>
        );

      case 'ziwei':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Five Elements Bureau</span>
              <strong className="text-purple-300 font-bold">
                {ziwei?.five_elements_bureau?.name || 'Water 2 Bureau'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Ming Palace (命宮)</span>
              <strong className="text-purple-200">{ziwei?.ming_palace_branch || 'Zi (子)'}</strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Shen Palace (身宮)</span>
              <strong className="text-purple-400">{ziwei?.shen_palace_branch || 'Wu (午)'}</strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Si Hua (四化)</span>
              <strong className="text-purple-300">
                {ziwei?.si_hua_transformations ? `Lu: ${ziwei.si_hua_transformations.Lu}` : 'Imperial Stars'}
              </strong>
            </div>
          </div>
        );

      case 'mayan':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Long Count Stele</span>
              <strong className="text-emerald-300 font-bold font-mono">
                {mayan?.long_count?.formatted || '13.0.11.12.9'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Sacred Tzolk’in</span>
              <strong className="text-emerald-200 font-mono">
                {mayan?.tzolkin?.formatted || '8 Chuwen'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Haab’ Solar Month</span>
              <strong className="text-emerald-400 font-mono">
                {mayan?.haab?.formatted || '14 Pop'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Lord of Night</span>
              <strong className="text-emerald-300 font-mono">{mayan?.lord_of_the_night || 'G7'}</strong>
            </div>
          </div>
        );

      case 'tibetan':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Rabjung Cycle (རབ་བྱུང)</span>
              <strong className="text-amber-300 font-bold">
                {tibetan?.rabjung_cycle?.element_gender_animal || 'Iron Dragon Year'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Year Mewa (སྨེ་བ)</span>
              <strong className="text-amber-200">
                {tibetan?.mewa?.formatted || 'Mewa 9 Red'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Natal Parkha (སྤར་ཁ)</span>
              <strong className="text-amber-400">
                {tibetan?.parkha?.name ? `${tibetan.parkha.name} (${tibetan.parkha.element})` : 'Li (Fire)'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Sog Life Force</span>
              <strong className="text-amber-300">
                {tibetan?.five_personal_forces?.sog_life_force || 'High Vitality'}
              </strong>
            </div>
          </div>
        );

      case 'persian':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Almuten Figuris</span>
              <strong className="text-teal-300 font-bold">
                {persian?.almuten_figuris?.victor || 'Jupiter'} (+{persian?.almuten_figuris?.victor_score || 38} pts)
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Sect Alignment</span>
              <strong className="text-teal-200">{persian?.sect?.sect_name || 'Diurnal Sect'}</strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Planetary Day Ruler</span>
              <strong className="text-teal-400">{persian?.sect?.day_ruler || 'Sun'}</strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Tradition Model</span>
              <strong className="text-teal-300">Abu Ma’shar & Ibn Ezra</strong>
            </div>
          </div>
        );

      case 'egyptian':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Hour Ruler Chronocrator</span>
              <strong className="text-yellow-300 font-bold font-mono">
                {egyptian?.chronocrator_watch?.hour_ruler_chronocrator || 'Horus'} ({egyptian?.chronocrator_watch?.period || 'Day'})
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Sothic Season</span>
              <strong className="text-yellow-200">
                {egyptian?.sothic_civil_cycle?.season || 'Akhet (Inundation)'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Temporal Hour</span>
              <strong className="text-yellow-400">
                Hour {egyptian?.chronocrator_watch?.temporal_hour_number || 1} of 12
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Dendera Star Ceiling</span>
              <strong className="text-yellow-300">36 Decanal Gates</strong>
            </div>
          </div>
        );

      case 'maramataka':
        return (
          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Oceanic Moon Night</span>
              <strong className="text-emerald-300 font-bold font-mono">
                {maramataka?.lunar_night?.name ? `#${maramataka.lunar_night.number}: ${maramataka.lunar_night.name}` : 'Rakaunui (#16)'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Mauri Vitality Index</span>
              <strong className="text-emerald-200">{maramataka?.lunar_night?.vitality_index || 'High Mauri'}</strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Moon Illumination</span>
              <strong className="text-emerald-400 font-mono">
                {maramataka?.lunar_night?.illumination_percent ? `${maramataka.lunar_night.illumination_percent}%` : 'Full Moon'}
              </strong>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Elongation</span>
              <strong className="text-emerald-300 font-mono">
                {maramataka?.lunar_night?.elongation_degrees ? `${maramataka.lunar_night.elongation_degrees}°` : '180°'}
              </strong>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      tabIndex={0}
      role="region"
      aria-label="Tradition Cards Vertical Carousel Deck"
      className="relative w-full rounded-2xl overflow-hidden py-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      {/* Top Deck Telemetry Bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 pb-3 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          <span className="text-cyan-300 font-medium">
            Vertical Carousel Deck
          </span>
          <span className="text-slate-400 hidden sm:inline">• 9 Civilizational Lenses</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>Card {activeIndex + 1} of 9</span>
          <span className="hidden md:inline px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
            ↑ / ↓ to Browse
          </span>
        </div>
      </div>

      {/* Main 3D Stage */}
      <div className="relative min-h-[620px] sm:min-h-[660px] lg:min-h-[680px] flex items-center justify-center p-2 sm:p-4 overflow-hidden [perspective:1400px]">
        {/* Floating Vertical Navigation Rail */}
        <div className="absolute right-2 sm:right-4 z-40 flex flex-col items-center gap-1.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-xl">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex === 0}
            data-tooltip="Previous tradition card [↑]"
            aria-label="Previous tradition card"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <div className="flex flex-col gap-1 py-1">
            {TRADITION_ORDER.map((key, idx) => {
              const theme = cultureThemes[key];
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  data-tooltip={`${theme?.name || key} (${idx + 1}/9)`}
                  aria-label={`Jump to ${theme?.name || key}`}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors motion-safe:transition-transform motion-reduce:transition-none duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 font-bold scale-110'
                      : 'text-slate-300 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <span className="text-[10px] select-none">{theme?.glyph || '•'}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex === TRADITION_ORDER.length - 1}
            data-tooltip="Next tradition card [↓]"
            aria-label="Next tradition card"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Stacked Vertical Carousel Cards */}
        <div className="relative w-full max-w-4xl min-h-[540px] sm:min-h-[580px] flex items-center justify-center">
          {TRADITION_ORDER.map((key, index) => {
            const diff = index - activeIndex;
            const theme = cultureThemes[key] || cultureThemes.jyotisha;
            const isCenter = diff === 0;

            // Only render cards within distance <= 2 for optimal GPU performance
            if (Math.abs(diff) > 2) return null;

            // Compute vertical 3D transform metrics
            const yOffset = diff * 95;
            const scale = 1 - Math.abs(diff) * 0.08;
            const opacity = isCenter ? 1 : Math.max(0.2, 0.6 - Math.abs(diff) * 0.25);
            const zIndex = 30 - Math.abs(diff) * 10;
            const rotateX = diff * -5;

            return (
              <motion.div
                key={key}
                onClick={() => {
                  if (!isCenter) goToIndex(index);
                }}
                animate={{
                  y: yOffset,
                  scale,
                  opacity,
                  rotateX,
                  zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 32,
                  mass: 0.85,
                }}
                className={`absolute w-full rounded-2xl border p-4 sm:p-5 shadow-2xl backdrop-blur-xl transition-shadow ${
                  isCenter
                    ? `${theme.containerBg} ${theme.containerBorder} shadow-2xl cursor-default ring-1 ring-amber-500/30`
                    : 'bg-stone-950/85 border-stone-800 cursor-pointer hover:border-amber-500/40'
                }`}
                style={{
                  transformOrigin: 'center center',
                }}
              >
                {/* Cultural Card Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl select-none">{theme.glyph}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-base font-bold tracking-wide font-serif ${theme.accentText}`}>
                          {theme.nativeTitle}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans border font-medium ${theme.accentBadge}`}>
                          {theme.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans mt-0.5 hidden sm:block">
                        {theme.lineage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-1 rounded bg-black/40 border border-white/10">
                      {String(index + 1).padStart(2, '0')} / 09
                    </span>
                  </div>
                </div>

                {/* Card Main Body: Split between Telemetry and Visual Instrument */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
                  {/* Telemetry Placements (shown when not in pure chart mode) */}
                  {chartViewMode !== 'chart' && (
                    <div className={`${chartViewMode === 'table' ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-3`}>
                      <div className="text-xs font-medium text-slate-300 flex items-center justify-between">
                        <span>Calculated Astrometric Placements</span>
                        {primaryExplainers[key] && (
                          <ExplainerTrigger
                            id={primaryExplainers[key].id}
                            label={primaryExplainers[key].label}
                            variant="badge"
                          />
                        )}
                      </div>

                      {renderTelemetryHighlights(key)}

                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                        <p className="text-xs text-slate-400 italic font-serif leading-relaxed">
                          &ldquo;{theme.motto}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Visual Instrument Display (shown when not in pure table mode) */}
                  {chartViewMode !== 'table' && (
                    <div className={`${chartViewMode === 'chart' ? 'lg:col-span-12' : 'lg:col-span-7'} flex flex-col items-center justify-center`}>
                      <div className={`w-full p-2.5 sm:p-3 rounded-xl border ${theme.frameBorder} ${theme.frameBg} shadow-inner`}>
                        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
                          <div className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-cyan-400" />
                            <h5 className={`text-xs font-sans font-semibold ${theme.accentText}`}>
                              {theme.instrumentName}
                            </h5>
                          </div>
                          <span className="text-[10px] font-sans text-slate-400">
                            Deterministic Engine
                          </span>
                        </div>
                        <div className="w-full flex items-center justify-center py-1">
                          {renderInstrument(key, theme)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Action Button */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] font-sans text-slate-400">
                    Dual-Engine JPL DE421 + SwissEph 2.10 Authenticated
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenInspector(key);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900/80 disabled:opacity-50 disabled:cursor-not-allowed text-cyan-200 border border-cyan-700/80 text-xs font-sans font-semibold transition-colors active:scale-[0.98] duration-150 cursor-pointer shadow-sm whitespace-nowrap"
                  >
                    <span className="whitespace-nowrap">Inspect Full Telemetry & Tables</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
