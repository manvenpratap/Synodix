import React from 'react';
import { useExplainer } from '../context/useExplainer';
import { HelpCircle, Info } from 'lucide-react';

interface Props {
  id: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'icon' | 'badge' | 'button';
  className?: string;
}

export const ExplainerTrigger: React.FC<Props> = ({
  id,
  label,
  size = 'sm',
  variant = 'badge',
  className = '',
}) => {
  const { openExplainer } = useExplainer();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openExplainer(id);
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        data-tooltip="Learn how this feature works"
        aria-label={`Explain feature: ${id}`}
        className={`inline-flex items-center justify-center rounded-full text-stone-400 hover:text-amber-300 hover:bg-amber-950/40 transition-colors min-w-[32px] min-h-[32px] sm:min-w-0 sm:min-h-0 p-1.5 sm:p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer ${className}`}
      >
        <HelpCircle className={size === 'xs' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        data-tooltip="Open detailed feature explainer"
        aria-label={`Explain feature: ${label || id}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[36px] sm:min-h-[32px] text-xs font-serif font-medium rounded-lg bg-stone-900 hover:bg-stone-850 text-amber-300 hover:text-amber-200 border border-amber-800/60 transition-colors duration-150 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${className}`}
      >
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>{label || 'Explain'}</span>
      </button>
    );
  }

  // Default 'badge' variant
  return (
    <button
      type="button"
      onClick={handleClick}
      data-tooltip="Click to inspect feature explainer & mathematics"
      aria-label={`Explain feature: ${label || id}`}
      className={`inline-flex items-center gap-1 px-2 py-1 sm:py-0.5 min-h-[32px] sm:min-h-0 rounded text-xs font-serif font-medium bg-stone-900 hover:bg-stone-850 text-amber-300 hover:text-amber-100 border border-amber-800/60 hover:border-amber-600 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${className}`}
    >
      <HelpCircle className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {label && <span>{label}</span>}
    </button>
  );
};
