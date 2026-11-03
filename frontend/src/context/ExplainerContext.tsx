import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { FEATURE_EXPLAINERS, type FeatureExplainer } from '../data/featureExplainers';

export interface ExplainerContextType {
  activeExplainer: FeatureExplainer | null;
  isGlossaryOpen: boolean;
  openExplainer: (id: string) => void;
  openGlossary: () => void;
  closeExplainer: () => void;
}

export const ExplainerContext = createContext<ExplainerContextType | undefined>(undefined);

export function useExplainer(): ExplainerContextType {
  const context = useContext(ExplainerContext);
  if (!context) {
    throw new Error('useExplainer must be used within an ExplainerProvider');
  }
  return context;
}

export const ExplainerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeExplainer, setActiveExplainer] = useState<FeatureExplainer | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const openExplainer = useCallback((id: string) => {
    const item = FEATURE_EXPLAINERS[id];
    if (item) {
      setActiveExplainer(item);
      setIsGlossaryOpen(false);
    }
  }, []);

  const openGlossary = useCallback(() => {
    setActiveExplainer(null);
    setIsGlossaryOpen(true);
  }, []);

  const closeExplainer = useCallback(() => {
    setActiveExplainer(null);
    setIsGlossaryOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      activeExplainer,
      isGlossaryOpen,
      openExplainer,
      openGlossary,
      closeExplainer,
    }),
    [activeExplainer, isGlossaryOpen, openExplainer, openGlossary, closeExplainer]
  );

  return <ExplainerContext.Provider value={value}>{children}</ExplainerContext.Provider>;
};
