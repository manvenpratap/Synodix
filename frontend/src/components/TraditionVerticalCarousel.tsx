import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
  const currentTheme = cultureThemes[activeTab] || cultureThemes.jyotisha;
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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

      if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowRight') {
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

  // Fluid swipe gestures for mobile (supports both horizontal & vertical touch gestures)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect dominant swipe orientation
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 35) {
        if (deltaX < 0) {
          goNext(); // Swipe left -> Next card
        } else {
          goPrev(); // Swipe right -> Previous card
        }
      }
    } else {
      if (Math.abs(deltaY) > 35) {
        if (deltaY < 0) {
          goNext(); // Swipe up -> Next card
        } else {
          goPrev(); // Swipe down -> Previous card
        }
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
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

  // Clean high-density telemetry cell without nested card border tells
  const renderTile = (label: string, value: React.ReactNode, colorClass = 'text-amber-300') => (
    <div className="min-w-0 py-0.5">
      <span className="text-[11px] text-stone-400 block font-medium leading-tight truncate">{label}</span>
      <strong className={`${colorClass} font-bold block truncate text-xs font-mono`}>{value}</strong>
    </div>
  );

  // Extract key telemetry badges per tradition
  const renderTelemetryHighlights = (key: TraditionKey) => {
    switch (key) {
      case 'jyotisha':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-0.5 text-xs font-mono">
            {renderTile('Lagna (Ascendant)', `${jyotisha?.lagna?.sign} (${jyotisha?.lagna?.degree?.toFixed(2)}°)`, 'text-amber-300')}
            {renderTile('Moon Nakshatra', `${jyotisha?.lagna?.nakshatra?.name || 'Ashwini'} P${jyotisha?.lagna?.nakshatra?.pada || 1}`, 'text-amber-200')}
            {renderTile('D9 Navamsha', jyotisha?.lagna?.navamsha_sign || 'Aries', 'text-amber-400')}
            {renderTile('Ayanamsha (Lahiri)', `${data.astronomical_base?.ayanamsha?.degrees?.toFixed(4)}°`, 'text-amber-300')}
          </div>
        );

      case 'bazi':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-0.5 text-xs font-mono">
            {renderTile('Day Master (日主)', `${bazi?.day_master?.stem || 'Jia (甲)'} (${bazi?.day_master?.element || 'Wood'})`, 'text-amber-300')}
            {renderTile('Dominant Qi (气)', bazi?.dominant_element || 'Fire/Metal Balance', 'text-amber-200')}
            {renderTile('Solar Term (节气)', bazi?.solar_term || 'Vernal Equinox', 'text-amber-400')}
            {renderTile('Year Pillar', `${bazi?.pillars?.year?.stem} ${bazi?.pillars?.year?.branch}`, 'text-amber-300')}
          </div>
        );

      case 'western':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-0.5 text-xs font-mono">
            {renderTile('Ascendant (H1)', `${western?.ascendant?.sign || 'Leo'} (${western?.ascendant?.degree || 0}°)`, 'text-amber-300')}
            {renderTile('Planetary Sect', western?.sect?.label || (western?.sect?.is_day_chart ? 'Diurnal Chart' : 'Nocturnal Chart'), 'text-amber-200')}
            {renderTile('Lot of Fortune', western?.lots?.lot_of_fortune ? `${western.lots.lot_of_fortune.sign} H${western.lots.lot_of_fortune.house}` : 'H1 Angular', 'text-amber-400')}
            {renderTile('House System', 'Ptolemaic Whole Sign', 'text-amber-300')}
          </div>
        );

      case 'ziwei':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-0.5 text-xs font-mono">
            {renderTile('Five Elements Bureau', ziwei?.five_elements_bureau?.name || 'Water 2 Bureau', 'text-amber-300')}
            {renderTile('Ming Palace (命宮)', ziwei?.ming_palace_branch || 'Zi (子)', 'text-amber-200')}
            {renderTile('Shen Palace (身宮)', ziwei?.shen_palace_branch || 'Wu (午)', 'text-amber-400')}
            {renderTile('Si Hua (四化)', ziwei?.si_hua_transformations ? `Lu: ${ziwei.si_hua_transformations.Lu}` : 'Imperial Stars', 'text-amber-300')}
          </div>
        );

      case 'mayan':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-0.5 text-xs font-sans">
            {renderTile('Long Count Stele', mayan?.long_count?.formatted || '13.0.11.12.9', 'text-amber-300 font-mono')}
            {renderTile('Sacred Tzolk’in', mayan?.tzolkin?.formatted || '8 Chuwen', 'text-amber-200 font-mono')}
            {renderTile('Haab’ Solar Month', mayan?.haab?.formatted || '14 Pop', 'text-amber-400 font-mono')}
            {renderTile('Lord of Night', mayan?.lord_of_the_night || 'G7', 'text-amber-300 font-mono')}
          </div>
        );

      case 'tibetan':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-0.5 text-xs font-mono">
            {renderTile('Rabjung Cycle (རབ་བྱུང)', tibetan?.rabjung_cycle?.element_gender_animal || 'Iron Dragon Year', 'text-amber-300')}
            {renderTile('Year Mewa (སྨེ་བ)', tibetan?.mewa?.formatted || 'Mewa 9 Red', 'text-amber-200')}
            {renderTile('Natal Parkha (སྤར་ཁ)', tibetan?.parkha?.name ? `${tibetan.parkha.name} (${tibetan.parkha.element})` : 'Li (Fire)', 'text-amber-400')}
            {renderTile('Sog Life Force', tibetan?.five_personal_forces?.sog_life_force || 'High Vitality', 'text-amber-300')}
          </div>
        );

      case 'persian':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-0.5 text-xs font-mono">
            {renderTile('Almuten Figuris', `${persian?.almuten_figuris?.victor || 'Jupiter'} (+${persian?.almuten_figuris?.victor_score || 38} pts)`, 'text-amber-300')}
            {renderTile('Sect Alignment', persian?.sect?.sect_name || 'Diurnal Sect', 'text-amber-200')}
            {renderTile('Planetary Day Ruler', persian?.sect?.day_ruler || 'Sun', 'text-amber-400')}
            {renderTile('Tradition Model', 'Abu Ma’shar & Ibn Ezra', 'text-amber-300')}
          </div>
        );

      case 'egyptian':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-0.5 text-xs font-sans">
            {renderTile('Hour Ruler Chronocrator', `${egyptian?.chronocrator_watch?.hour_ruler_chronocrator || 'Horus'} (${egyptian?.chronocrator_watch?.period || 'Day'})`, 'text-amber-300 font-mono')}
            {renderTile('Sothic Season', egyptian?.sothic_civil_cycle?.season || 'Akhet (Inundation)', 'text-amber-200')}
            {renderTile('Temporal Hour', `Hour ${egyptian?.chronocrator_watch?.temporal_hour_number || 1} of 12`, 'text-amber-400')}
            {renderTile('Dendera Star Ceiling', '36 Decanal Gates', 'text-amber-300')}
          </div>
        );

      case 'maramataka':
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-0.5 text-xs font-sans">
            {renderTile('Oceanic Moon Night', maramataka?.lunar_night?.name ? `#${maramataka.lunar_night.number}: ${maramataka.lunar_night.name}` : 'Rakaunui (#16)', 'text-amber-300 font-mono')}
            {renderTile('Mauri Vitality Index', maramataka?.lunar_night?.vitality_index || 'High Mauri', 'text-amber-200')}
            {renderTile('Moon Illumination', maramataka?.lunar_night?.illumination_percent ? `${maramataka.lunar_night.illumination_percent}%` : 'Full Moon', 'text-amber-400 font-mono')}
            {renderTile('Elongation', maramataka?.lunar_night?.elongation_degrees ? `${maramataka.lunar_night.elongation_degrees}°` : '180°', 'text-amber-300 font-mono')}
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-label="Tradition Cards Vertical Carousel Deck"
      className="relative w-full rounded-2xl overflow-x-clip overflow-y-visible pt-0 pb-1.5 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      {/* Top Deck Telemetry Bar */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-1.5 border-b border-white/10 text-[11px] font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0 shadow-xs" />
          <span className="text-amber-300 font-serif font-medium text-xs truncate">
            <span className="sm:hidden">Traditions</span>
            <span className="hidden sm:inline">Tradition Cards Deck</span>
          </span>
          <span className="text-stone-400 hidden sm:inline">• 9 Traditions</span>
        </div>

        {/* Mobile-only thumb-friendly tradition selector pill strip */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto py-1 px-1 no-scrollbar touch-manipulation max-w-[250px]">
          {TRADITION_ORDER.map((key, idx) => {
            const theme = cultureThemes[key];
            const isSelected = activeIndex === idx;
            return (
              <button
                key={key}
                data-mobile-dot={key}
                type="button"
                onClick={() => goToIndex(idx)}
                aria-label={`Jump to ${theme?.name || key}`}
                className={`px-2.5 py-1 min-h-[36px] rounded-full text-xs font-serif font-medium whitespace-nowrap transition-colors cursor-pointer touch-manipulation shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-900 text-stone-300 border border-stone-800 hover:text-white'
                }`}
              >
                <span>{theme?.shortName || theme?.name?.split(' ')[0] || key}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-stone-400 shrink-0 text-xs">
          <span className="text-amber-400 font-semibold">
            <span className="sm:hidden">{activeIndex + 1}/9</span>
            <span className="hidden sm:inline">Card {activeIndex + 1} of 9</span>
          </span>
          <span className="hidden md:inline px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
            ↑ / ↓ or Scroll
          </span>
          <span className="md:hidden px-1 py-0.5 rounded bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
            Swipe
          </span>
        </div>
      </div>

      {/* Main 3D Stage */}
      <div className="relative flex items-start justify-center pt-1 sm:pt-2 pb-3 sm:pb-4 p-1 sm:p-2 md:pr-14 md:min-h-[420px] overflow-x-clip [perspective:1400px] touch-pan-y">
        {/* Floating Vertical Navigation Rail (Desktop & Tablet only: hidden on mobile) */}
        <div
          role="tablist"
          aria-label="Astrological tradition cards"
          className="hidden md:flex absolute right-1 sm:right-2 top-2 z-40 flex-col items-center gap-0.5 p-1 rounded-full bg-stone-950/90 backdrop-blur-md border border-stone-700/60 shadow-xl"
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex === 0}
            data-tooltip="Previous tradition card [↑]"
            aria-label="Previous tradition card"
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 hover:text-amber-300 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <div className="flex flex-col gap-1 py-0.5">
            {TRADITION_ORDER.map((key, idx) => {
              const theme = cultureThemes[key];
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={key}
                  id={`tradition-tab-${key}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`tradition-card-${key}`}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  data-tooltip={`${theme?.name || key} (${idx + 1}/9)`}
                  aria-label={`Jump to ${theme?.name || key}`}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-[background-color,color,transform] duration-150 ease-out cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 font-bold motion-safe:scale-110 ring-2 ring-amber-300'
                      : 'text-stone-300 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <span className="text-[11px] font-mono font-bold select-none">{theme?.glyph || '•'}</span>
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
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 hover:text-amber-300 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Stacked Vertical Carousel Cards */}
        <div className="relative w-full max-w-4xl flex items-start justify-center">
          {TRADITION_ORDER.map((key, index) => {
            const diff = index - activeIndex;
            const theme = cultureThemes[key] || cultureThemes.jyotisha;
            const isCenter = diff === 0;

            // Only render cards within distance <= 2 for optimal GPU performance
            if (Math.abs(diff) > 2) return null;

            // Compute vertical 3D transform metrics with compact headroom
            const yOffset = diff < 0 ? diff * 6 : diff * 8;
            const scale = 1 - Math.abs(diff) * 0.035;
            const opacity = isCenter ? 1 : Math.max(0.15, 0.45 - Math.abs(diff) * 0.2);
            const zIndex = 30 - Math.abs(diff) * 10;
            const rotateX = diff * -2;

            return (
              <motion.div
                key={key}
                id={`tradition-card-${key}`}
                data-tradition={key}
                data-tradition-card={isCenter ? 'active' : 'stacked'}
                role="tabpanel"
                aria-labelledby={`tradition-tab-${key}`}
                tabIndex={isCenter ? 0 : -1}
                onClick={() => {
                  if (!isCenter) goToIndex(index);
                }}
                drag={isCenter ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_e, info) => {
                  if (!isCenter) return;
                  const threshold = 35;
                  const velocityThreshold = 260;
                  if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
                    goNext();
                  } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
                    goPrev();
                  }
                }}
                animate={{
                  y: shouldReduceMotion ? 0 : yOffset,
                  scale: shouldReduceMotion ? (isCenter ? 1 : 0.96) : scale,
                  opacity,
                  rotateX: shouldReduceMotion ? 0 : rotateX,
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.1 }
                    : {
                        type: 'spring',
                        stiffness: 380,
                        damping: 32,
                        mass: 0.85,
                      }
                }
                className={`${isCenter ? 'relative' : 'absolute inset-0 cursor-pointer'} w-full h-[470px] sm:h-[480px] lg:h-[405px] flex flex-col justify-between rounded-2xl border p-2 sm:p-3 transition-colors ${
                  isCenter
                    ? `${theme.containerBg} ${theme.containerBorder} backdrop-blur-md cursor-grab active:cursor-grabbing ring-1 ring-amber-500/30 touch-pan-y`
                    : 'bg-stone-950/95 border-stone-800 hover:border-amber-500/40'
                }`}
                style={{
                  transformOrigin: 'center center',
                  zIndex,
                }}
              >
                {!isCenter ? (
                  <div className="w-full h-full pointer-events-none" aria-hidden="true" />
                ) : (
                  <>
                    {/* Cultural Card Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5 sm:pb-2 sm:mb-2 shrink-0">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <span className="text-xl sm:text-2xl select-none shrink-0">{theme.glyph}</span>
                        <div className="min-w-0">
                          <h3 className={`text-sm sm:text-base font-bold tracking-wide font-serif ${theme.accentText} truncate`}>
                            {theme.nativeTitle}
                          </h3>
                          <p className="text-xs text-stone-300 font-sans mt-0.5 truncate hidden md:block">
                            {theme.lineage}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono text-amber-300 font-bold px-2 py-0.5">
                          {String(index + 1).padStart(2, '0')} / 09
                        </span>
                      </div>
                    </div>

                    {/* Card Main Body: Split between Telemetry and Visual Instrument */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 sm:gap-2 lg:gap-3 items-center flex-1 my-auto">
                      {/* Telemetry Placements (shown when not in pure chart mode) */}
                      {chartViewMode !== 'chart' && (
                        <div className={`${chartViewMode === 'table' ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-1 sm:space-y-1.5`}>
                          <div className="text-xs font-medium text-slate-300 flex items-center justify-between pb-0.5">
                            <span className="hidden sm:inline">Key Placements</span>
                            {primaryExplainers[key] && (
                              <ExplainerTrigger
                                id={primaryExplainers[key].id}
                                label={primaryExplainers[key].label}
                                variant="badge"
                              />
                            )}
                          </div>

                          {renderTelemetryHighlights(key)}

                          {/* Motto Quote Box (Desktop/Tablet only to reserve vertical space for chart on mobile) */}
                          <div className="pt-1.5 border-t border-white/10 hidden sm:block">
                            <p className="text-xs text-stone-400 italic font-serif leading-snug line-clamp-1 sm:line-clamp-2">
                              &ldquo;{theme.motto}&rdquo;
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Visual Instrument Display (shown when not in pure table mode) */}
                      {chartViewMode !== 'table' && (
                        <div className={`${chartViewMode === 'chart' ? 'lg:col-span-12' : 'lg:col-span-7'} flex flex-col items-center justify-center`}>
                          <div className="w-full flex flex-col items-center">
                            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 w-full">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <h4 className={`text-xs font-sans font-semibold ${theme.accentText} truncate`}>
                                  {theme.instrumentName}
                                </h4>
                              </div>
                              <span className="text-xs font-sans text-stone-400 hidden sm:inline-block shrink-0">
                                Astronomical Accuracy
                              </span>
                            </div>
                            <div
                              key={`${key}-active`}
                              className="w-full flex items-center justify-center py-0.5 animate-instrument-focus"
                            >
                              {renderInstrument(key, theme)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Persistent Common Action Strip (Docked cleanly inside active card only) */}
                    <div className="flex items-center justify-between gap-1.5 px-1 sm:px-2 pt-1.5 sm:pt-2 mt-auto border-t border-white/10 text-xs shrink-0">
                      <div className="flex items-center gap-1.5 text-xs font-sans text-stone-400 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0" />
                        <span className="hidden sm:inline truncate">Dual-Engine JPL DE421 + SwissEph 2.10 Authenticated</span>
                        <span className="sm:hidden truncate">DE421 Verified</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenInspector(key);
                        }}
                        className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900/80 text-amber-200 border border-amber-700/80 text-xs font-sans font-semibold transition-[background-color,border-color,transform] motion-safe:active:scale-[0.97] motion-reduce:active:scale-100 duration-150 ease-out cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                        data-tooltip={`Open full detailed tables and analysis for ${theme?.name || key}`}
                        aria-label={`Inspect full telemetry and tables for ${theme?.name || key}`}
                      >
                        <span>Detailed Tables</span>
                        <span className="sr-only">Inspect Full Telemetry & Tables</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
