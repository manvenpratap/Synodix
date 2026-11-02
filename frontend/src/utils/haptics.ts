/**
 * Universal Mobile Haptic Feedback Engine
 * Adheres to touch-psychology.md (Fitts' Law & sensory confirmation).
 * Supports navigator.vibrate with safe fallbacks and zero desktop overhead.
 */

export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' = 'light'): void => {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'light':
      case 'selection':
        // 8ms subtle physical tick for tabs, pills, and toggles
        navigator.vibrate(8);
        break;
      case 'medium':
        // 20ms affirmative tap for primary actions (Calculate, Swap, Jump)
        navigator.vibrate(20);
        break;
      case 'heavy':
        // 35ms substantial impact
        navigator.vibrate(35);
        break;
      case 'success':
        // Dual pulse pattern for successful chart calculation or vault save
        navigator.vibrate([12, 35, 18]);
        break;
      case 'warning':
      case 'error':
        // Triple pulse for validation or boundary alerts
        navigator.vibrate([25, 40, 25, 40, 25]);
        break;
    }
  } catch {
    // Graceful fallback on restricted webviews or low-power mode
  }
};
