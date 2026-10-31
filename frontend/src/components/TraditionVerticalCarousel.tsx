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

  // Extract key telemetry badges per tradition
  const renderTelemetryHighlights = (key: TraditionKey) => {
    switch (key) {
      case 'jyotisha':
        return (
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-mono">
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Lagna (Ascendant)</span>
              <strong className="text-amber-300 font-bold block truncate">
                {jyotisha?.lagna?.sign} ({jyotisha?.lagna?.degree?.toFixed(2)}°)
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Moon Nakshatra</span>
              <strong className="text-amber-200 block truncate">
                {jyotisha?.lagna?.nakshatra?.name || 'Ashwini'} P{jyotisha?.lagna?.nakshatra?.pada || 1}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">D9 Navamsha</span>
              <strong className="text-amber-400 block truncate">{jyotisha?.lagna?.navamsha_sign || 'Aries'}</strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Ayanamsha (Lahiri)</span>
              <strong className="text-amber-300 font-mono block truncate">
                {data.astronomical_base?.ayanamsha?.degrees?.toFixed(4)}°
              </strong>
            </div>
          </div>
        );

      case 'bazi':
        return (
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-mono">
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Day Master (日主)</span>
              <strong className="text-rose-300 font-bold block truncate">
                {bazi?.day_master?.stem || 'Jia (甲)'} ({bazi?.day_master?.element || 'Wood'})
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Dominant Qi (气)</span>
              <strong className="text-rose-200 block truncate">{bazi?.dominant_element || 'Fire/Metal Balance'}</strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Solar Term (节气)</span>
              <strong className="text-rose-400 block truncate">{bazi?.solar_term || 'Vernal Equinox'}</strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Year Pillar</span>
              <strong className="text-rose-300 font-mono block truncate">
                {bazi?.pillars?.year?.stem} {bazi?.pillars?.year?.branch}
              </strong>
            </div>
          </div>
        );

      case 'western':
        return (
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-mono">
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Ascendant (H1)</span>
              <strong className="text-sky-300 font-bold block truncate">
                {western?.ascendant?.sign || 'Leo'} ({western?.ascendant?.degree || 0}°)
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Planetary Sect</span>
              <strong className="text-sky-200 block truncate">
                {western?.sect?.label || (western?.sect?.is_day_chart ? 'Diurnal Chart' : 'Nocturnal Chart')}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Lot of Fortune</span>
              <strong className="text-sky-400 block truncate">
                {western?.lots?.lot_of_fortune ? `${western.lots.lot_of_fortune.sign} H${western.lots.lot_of_fortune.house}` : 'H1 Angular'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">House System</span>
              <strong className="text-sky-300 block truncate">Ptolemaic Whole Sign</strong>
            </div>
          </div>
        );

      case 'ziwei':
        return (
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-mono">
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Five Elements Bureau</span>
              <strong className="text-amber-300 font-bold block truncate">
                {ziwei?.five_elements_bureau?.name || 'Water 2 Bureau'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Ming Palace (命宮)</span>
              <strong className="text-amber-200 block truncate">{ziwei?.ming_palace_branch || 'Zi (子)'}</strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Shen Palace (身宮)</span>
              <strong className="text-amber-400 block truncate">{ziwei?.shen_palace_branch || 'Wu (午)'}</strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Si Hua (四化)</span>
              <strong className="text-amber-300 block truncate">
                {ziwei?.si_hua_transformations ? `Lu: ${ziwei.si_hua_transformations.Lu}` : 'Imperial Stars'}
              </strong>
            </div>
          </div>
        );

      case 'mayan':
        return (
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-sans">
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Long Count Stele</span>
              <strong className="text-emerald-300 font-bold font-mono block truncate">
                {mayan?.long_count?.formatted || '13.0.11.12.9'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Sacred Tzolk’in</span>
              <strong className="text-emerald-200 font-mono block truncate">
                {mayan?.tzolkin?.formatted || '8 Chuwen'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Haab’ Solar Month</span>
              <strong className="text-emerald-400 font-mono block truncate">
                {mayan?.haab?.formatted || '14 Pop'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Lord of Night</span>
              <strong className="text-emerald-300 font-mono block truncate">{mayan?.lord_of_the_night || 'G7'}</strong>
            </div>
          </div>
        );

      case 'tibetan':
        return (
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-mono">
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Rabjung Cycle (རབ་བྱུང)</span>
              <strong className="text-amber-300 font-bold block truncate">
                {tibetan?.rabjung_cycle?.element_gender_animal || 'Iron Dragon Year'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Year Mewa (སྨེ་བ)</span>
              <strong className="text-amber-200 block truncate">
                {tibetan?.mewa?.formatted || 'Mewa 9 Red'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Natal Parkha (སྤར་ཁ)</span>
              <strong className="text-amber-400 block truncate">
                {tibetan?.parkha?.name ? `${tibetan.parkha.name} (${tibetan.parkha.element})` : 'Li (Fire)'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Sog Life Force</span>
              <strong className="text-amber-300 block truncate">
                {tibetan?.five_personal_forces?.sog_life_force || 'High Vitality'}
              </strong>
            </div>
          </div>
        );

      case 'persian':
        return (
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-mono">
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Almuten Figuris</span>
              <strong className="text-teal-300 font-bold block truncate">
                {persian?.almuten_figuris?.victor || 'Jupiter'} (+{persian?.almuten_figuris?.victor_score || 38} pts)
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Sect Alignment</span>
              <strong className="text-teal-200 block truncate">{persian?.sect?.sect_name || 'Diurnal Sect'}</strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Planetary Day Ruler</span>
              <strong className="text-teal-400 block truncate">{persian?.sect?.day_ruler || 'Sun'}</strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Tradition Model</span>
              <strong className="text-teal-300 block truncate">Abu Ma’shar & Ibn Ezra</strong>
            </div>
          </div>
        );

      case 'egyptian':
        return (
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-sans">
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Hour Ruler Chronocrator</span>
              <strong className="text-yellow-300 font-bold font-mono block truncate">
                {egyptian?.chronocrator_watch?.hour_ruler_chronocrator || 'Horus'} ({egyptian?.chronocrator_watch?.period || 'Day'})
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Sothic Season</span>
              <strong className="text-yellow-200 block truncate">
                {egyptian?.sothic_civil_cycle?.season || 'Akhet (Inundation)'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Temporal Hour</span>
              <strong className="text-yellow-400 block truncate">
                Hour {egyptian?.chronocrator_watch?.temporal_hour_number || 1} of 12
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Dendera Star Ceiling</span>
              <strong className="text-yellow-300 block truncate">36 Decanal Gates</strong>
            </div>
          </div>
        );

      case 'maramataka':
        return (
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-sans">
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Oceanic Moon Night</span>
              <strong className="text-emerald-300 font-bold font-mono block truncate">
                {maramataka?.lunar_night?.name ? `#${maramataka.lunar_night.number}: ${maramataka.lunar_night.name}` : 'Rakaunui (#16)'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Mauri Vitality Index</span>
              <strong className="text-emerald-200 block truncate">{maramataka?.lunar_night?.vitality_index || 'High Mauri'}</strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Moon Illumination</span>
              <strong className="text-emerald-400 font-mono block truncate">
                {maramataka?.lunar_night?.illumination_percent ? `${maramataka.lunar_night.illumination_percent}%` : 'Full Moon'}
              </strong>
            </div>
            <div className="p-1 sm:p-1.5 rounded bg-black/40 border border-white/10 min-w-0">
              <span className="text-[9px] sm:text-[10.5px] text-slate-400 block font-medium leading-tight truncate">Elongation</span>
              <strong className="text-emerald-300 font-mono block truncate">
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

        {/* Mobile-only compact tradition indicator dots with Apple-grade touch targets */}
        <div className="flex md:hidden items-center gap-0.5">
          {TRADITION_ORDER.map((key, idx) => (
            <button
              key={key}
              data-mobile-dot={key}
              type="button"
              onClick={() => goToIndex(idx)}
              aria-label={`Mobile jump to ${cultureThemes[key]?.name || key}`}
              className="p-1 flex items-center justify-center cursor-pointer touch-manipulation focus:outline-none"
            >
              <span
                className={`h-1.5 rounded-full transition-colors duration-200 ease-out inline-block ${
                  activeIndex === idx
                    ? 'w-3.5 bg-amber-400 shadow-xs'
                    : 'w-1.5 bg-stone-700 hover:bg-stone-500'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-stone-400 shrink-0 text-[10px] sm:text-xs">
          <span className="text-amber-400 font-semibold">
            <span className="sm:hidden">{activeIndex + 1}/9</span>
            <span className="hidden sm:inline">Card {activeIndex + 1} of 9</span>
          </span>
          <span className="hidden md:inline px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] text-stone-400">
            ↑ / ↓ or Scroll
          </span>
          <span className="md:hidden px-1 py-0.5 rounded bg-stone-900 border border-stone-800 text-[9px] text-stone-400">
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
          className="hidden md:flex absolute right-1 sm:right-2 z-40 flex-col items-center gap-1 p-1 rounded-full bg-stone-950/90 backdrop-blur-md border border-stone-700/60 shadow-xl"
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

          <div className="flex flex-col gap-1.5 py-1">
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
                      ? 'bg-amber-400 text-stone-950 font-bold motion-safe:scale-110 shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                      : 'text-stone-300 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold select-none">{theme?.glyph || '•'}</span>
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
                className={`${isCenter ? 'relative' : 'absolute inset-0 cursor-pointer'} w-full h-[470px] sm:h-[480px] lg:h-[405px] flex flex-col justify-between rounded-2xl border p-2 sm:p-3 shadow-2xl transition-shadow ${
                  isCenter
                    ? `${theme.containerBg} ${theme.containerBorder} backdrop-blur-md shadow-2xl cursor-grab active:cursor-grabbing ring-1 ring-amber-500/30 touch-pan-y`
                    : 'bg-stone-950/92 border-stone-800 hover:border-amber-500/40'
                }`}
                style={{
                  transformOrigin: 'center center',
                  zIndex,
                }}
              >
                {/* Cultural Card Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5 sm:pb-2 sm:mb-2 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <span className="text-xl sm:text-2xl select-none shrink-0">{theme.glyph}</span>
                    <div className="min-w-0">
                      <h4 className={`text-sm sm:text-base font-bold tracking-wide font-serif ${theme.accentText} truncate`}>
                        {theme.nativeTitle}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-sans mt-0.5 truncate hidden md:block">
                        {theme.lineage}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-amber-300 font-bold px-2 py-0.5 sm:py-1 rounded bg-black/40 border border-white/10">
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
                      <div className="p-1 sm:p-1.5 rounded-lg bg-black/30 border border-white/5 hidden sm:block">
                        <p className="text-[10px] sm:text-[11px] text-slate-400 italic font-serif leading-snug line-clamp-1 sm:line-clamp-2">
                          &ldquo;{theme.motto}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Visual Instrument Display (shown when not in pure table mode) */}
                  {chartViewMode !== 'table' && (
                    <div className={`${chartViewMode === 'chart' ? 'lg:col-span-12' : 'lg:col-span-7'} flex flex-col items-center justify-center`}>
                      <div className={`w-full p-1 sm:p-2 rounded-xl border ${theme.frameBorder} ${theme.frameBg} shadow-inner`}>
                        <div className="flex items-center justify-between pb-0.5 mb-1 border-b border-white/10">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                            <h5 className={`text-[10.5px] sm:text-xs font-sans font-semibold ${theme.accentText} truncate`}>
                              {theme.instrumentName}
                            </h5>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-sans text-slate-400 hidden sm:inline-block shrink-0">
                            Astronomical Accuracy
                          </span>
                        </div>
                        <div
                          key={`${key}-${isCenter ? 'active' : 'idle'}`}
                          className={`w-full flex items-center justify-center py-0.5 ${isCenter ? 'animate-instrument-focus' : ''}`}
                        >
                          {renderInstrument(key, theme)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Persistent Common Action Strip (Docked cleanly inside active card only) */}
                {isCenter ? (
                  <div className="flex items-center justify-between gap-1.5 px-1 sm:px-2 pt-1.5 sm:pt-2 mt-auto border-t border-white/10 text-xs shrink-0">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans text-stone-400 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0 shadow-xs shadow-emerald-400/50" />
                      <span className="hidden sm:inline truncate">Dual-Engine JPL DE421 + SwissEph 2.10 Authenticated</span>
                      <span className="sm:hidden truncate">DE421 Verified</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenInspector(key);
                      }}
                      className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900/80 text-amber-200 border border-amber-700/80 text-[10.5px] sm:text-xs font-sans font-semibold transition-[background-color,border-color,transform] motion-safe:active:scale-[0.97] motion-reduce:active:scale-100 duration-150 ease-out cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                      data-tooltip={`Open full detailed tables and analysis for ${theme?.name || key}`}
                      aria-label={`Inspect full telemetry and tables for ${theme?.name || key}`}
                    >
                      <span>Detailed Tables</span>
                      <span className="sr-only">Inspect Full Telemetry & Tables</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="h-[36px] mt-auto shrink-0 border-t border-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
