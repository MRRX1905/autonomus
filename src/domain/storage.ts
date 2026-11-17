import { createEmptyState, isAppState } from './state';
import type { AppState } from './types';

export const STORAGE_KEY = 'autonomus.v1';
export const CORRUPT_BACKUP_KEY = 'autonomus.v1.corrupt';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type LoadStatus = 'empty' | 'ok' | 'recovered';

export interface LoadResult {
  state: AppState;
  status: LoadStatus;
}

function resolveStorage(storage?: StorageLike): StorageLike | null {
  if (storage) return storage;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadState(storage?: StorageLike): LoadResult {
  const target = resolveStorage(storage);
  if (!target) {
    return { state: createEmptyState(), status: 'recovered' };
  }

  let raw: string | null;
  try {
    raw = target.getItem(STORAGE_KEY);
  } catch {
    return { state: createEmptyState(), status: 'recovered' };
  }

  if (raw === null) {
    return { state: createEmptyState(), status: 'empty' };
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isAppState(parsed)) {
      return { state: parsed, status: 'ok' };
    }
  } catch {
    // jatuh ke pemulihan di bawah
  }

  try {
    target.setItem(CORRUPT_BACKUP_KEY, raw);
  } catch {
    // backup bersifat best-effort; data asli tidak dihapus di sini
  }
  return { state: createEmptyState(), status: 'recovered' };
}

export function saveState(state: AppState, storage?: StorageLike): void {
  if (!isAppState(state)) {
    throw new Error('State tidak valid; penyimpanan dibatalkan.');
  }
  const target = resolveStorage(storage);
  if (!target) {
    throw new Error('localStorage tidak tersedia.');
  }
  target.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(storage?: StorageLike): void {
  const target = resolveStorage(storage);
  if (!target) return;
  target.removeItem(STORAGE_KEY);
  target.removeItem(CORRUPT_BACKUP_KEY);
}
