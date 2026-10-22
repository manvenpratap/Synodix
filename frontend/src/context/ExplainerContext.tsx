import React, { useState, useCallback, useMemo } from 'react';
import { FEATURE_EXPLAINERS, type FeatureExplainer } from '../data/featureExplainers';
import { ExplainerContext } from './explainerContextDef';

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
