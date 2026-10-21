/**
 * Zero-cloud client-first Profile Vault.
 * Ponytail rule: standard localStorage, zero dependencies, zero cloud liability.
 * Retains user profiles, primary profile state, and supports backup/restore.
 */
import type { BirthInput, ChartResponse } from '../types';

export interface UserProfile extends BirthInput {
  id: string;
  name: string;
  category: 'personal' | 'family' | 'research';
  created_at: string;
  updated_at?: string;
  is_primary?: boolean;
  notes?: string;
  cached_chart?: ChartResponse;
}

const VAULT_STORAGE_KEY = 'six_culture_profile_vault_v1';
const PRIMARY_PROFILE_KEY = 'six_culture_primary_profile_id_v1';

export function getSavedProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function getPrimaryProfile(): UserProfile | null {
  try {
    const primaryId = localStorage.getItem(PRIMARY_PROFILE_KEY);
    const profiles = getSavedProfiles();
    if (primaryId) {
      const found = profiles.find((p) => p.id === primaryId);
      if (found) return found;
    }
    const tagged = profiles.find((p) => p.is_primary);
    if (tagged) return tagged;
    return profiles.length > 0 ? profiles[0] : null;
  } catch {
    return null;
  }
}

export function setPrimaryProfile(id: string): void {
  try {
    localStorage.setItem(PRIMARY_PROFILE_KEY, id);
    const profiles = getSavedProfiles();
    const updated = profiles.map((p) => ({
      ...p,
      is_primary: p.id === id,
    }));
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not set primary profile', e);
  }
}

export function saveProfile(profile: Omit<UserProfile, 'id' | 'created_at'> & { id?: string }): UserProfile {
  const existing = getSavedProfiles();
  const id = profile.id || `profile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // If first profile created, automatically make it primary
  const isPrimary = profile.is_primary ?? (existing.length === 0);

  const newProfile: UserProfile = {
    ...profile,
    id,
    created_at: now,
    updated_at: now,
    is_primary: isPrimary,
  };

  const filtered = existing.filter((p) => p.id !== id);
  let updated = [newProfile, ...filtered];

  if (isPrimary) {
    updated = updated.map((p) => (p.id === id ? { ...p, is_primary: true } : { ...p, is_primary: false }));
    try {
      localStorage.setItem(PRIMARY_PROFILE_KEY, id);
    } catch {}
  }

  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Storage quota exceeded, caching without full chart data', e);
    // If full chart response exceeds localStorage, save without cached chart
    const lean = updated.map((p) => {
      const copy = { ...p };
      delete copy.cached_chart;
      return copy;
    });
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(lean));
  }

  return newProfile;
}

export function updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
  const existing = getSavedProfiles();
  const idx = existing.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const updatedProfile: UserProfile = {
    ...existing[idx],
    ...updates,
    id, // protect id
    updated_at: now,
  };

  existing[idx] = updatedProfile;

  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(existing));
    if (updates.is_primary) {
      setPrimaryProfile(id);
    }
  } catch (e) {
    console.warn('Failed to update profile', e);
  }

  return updatedProfile;
}

export function deleteProfile(id: string): UserProfile[] {
  const existing = getSavedProfiles();
  const updated = existing.filter((p) => p.id !== id);
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
    const currentPrimary = localStorage.getItem(PRIMARY_PROFILE_KEY);
    if (currentPrimary === id) {
      if (updated.length > 0) {
        setPrimaryProfile(updated[0].id);
      } else {
        localStorage.removeItem(PRIMARY_PROFILE_KEY);
      }
    }
  } catch {
    // Ignore storage errors
  }
  return updated;
}

export function exportVaultAsJSON(): string {
  const profiles = getSavedProfiles();
  const exportPayload = {
    app: 'Six-Culture Verified Astrology',
    export_version: '1.0',
    exported_at: new Date().toISOString(),
    total_profiles: profiles.length,
    profiles: profiles.map((p) => {
      const copy = { ...p };
      // Omit heavy transient cache from backup
      delete copy.cached_chart;
      return copy;
    }),
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importVaultFromJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const incoming: any[] = Array.isArray(parsed) ? parsed : parsed.profiles;
    if (!Array.isArray(incoming)) {
      return { success: false, count: 0, error: 'Invalid profile backup format.' };
    }

    const existing = getSavedProfiles();
    const existingIds = new Set(existing.map((p) => p.id));
    let importedCount = 0;

    for (const item of incoming) {
      if (!item.name || !item.birth_date || typeof item.latitude !== 'number') {
        continue;
      }
      const id = item.id && !existingIds.has(item.id) ? item.id : `imported-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      existingIds.add(id);

      existing.push({
        id,
        name: item.name,
        category: item.category || 'personal',
        birth_date: item.birth_date,
        birth_time: item.birth_time || '',
        time_certainty: item.time_certainty || 'exact',
        custom_uncertainty_mins: item.custom_uncertainty_mins,
        latitude: item.latitude,
        longitude: item.longitude,
        city_name: item.city_name || 'Unknown',
        country_name: item.country_name || '',
        gender: item.gender || 'neutral',
        notes: item.notes || '',
        created_at: item.created_at || new Date().toISOString(),
        is_primary: Boolean(item.is_primary),
      });
      importedCount++;
    }

    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(existing));
    return { success: true, count: importedCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Malformed JSON file' };
  }
}
