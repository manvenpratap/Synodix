import { createContext } from 'react';
import type { FeatureExplainer } from '../data/featureExplainers';

export interface ExplainerContextType {
  activeExplainer: FeatureExplainer | null;
  isGlossaryOpen: boolean;
  openExplainer: (id: string) => void;
  openGlossary: () => void;
  closeExplainer: () => void;
}

export const ExplainerContext = createContext<ExplainerContextType | undefined>(undefined);
