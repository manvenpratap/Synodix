import { useContext } from 'react';
import { ExplainerContext, type ExplainerContextType } from './explainerContextDef';

export function useExplainer(): ExplainerContextType {
  const context = useContext(ExplainerContext);
  if (!context) {
    throw new Error('useExplainer must be used within an ExplainerProvider');
  }
  return context;
}
