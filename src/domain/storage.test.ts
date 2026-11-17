import { describe, expect, it } from 'vitest';
import { createEmptyState, isAppState, isCadence } from './state';
import {
  CORRUPT_BACKUP_KEY,
  STORAGE_KEY,
  clearState,
  loadState,
  saveState,
  type StorageLike,
} from './storage';
import type { AppState, Routine, Run } from './types';

class MemoryStorage implements StorageLike {
  private readonly data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }
}

function makeRoutine(overrides: Partial<Routine> = {}): Routine {
  return {
    id: 'routine-1',
    name: 'Rilis mingguan',
    description: 'Checklist rilis hari Jumat.',
    cadence: { type: 'weekly', weekday: 5 },
    steps: [
      { id: 'step-1', title: 'Jalankan tes' },
      { id: 'step-2', title: 'Perbarui changelog' },
    ],
    createdAt: '2026-11-01T08:00:00.000Z',
    archived: false,
    ...overrides,
  };
}

function makeRun(overrides: Partial<Run> = {}): Run {
  return {
    id: 'run-1',
    routineId: 'routine-1',
    startedAt: '2026-11-06T09:00:00.000Z',
    completedAt: '2026-11-06T09:20:00.000Z',
    stepStates: [
      { stepId: 'step-1', done: true },
      { stepId: 'step-2', done: true },
    ],
    note: 'Rilis 0.1.0',
    ...overrides,
  };
}

function makeState(): AppState {
  return {
    schemaVersion: 1,
    routines: [makeRoutine()],
    runs: [makeRun()],
  };
}

describe('loadState', () => {
  it('mengembalikan state kosong saat storage belum berisi data', () => {
    const result = loadState(new MemoryStorage());

    expect(result.status).toBe('empty');
    expect(result.state).toEqual(createEmptyState());
  });

  it('memuat state yang disimpan (round-trip)', () => {
    const storage = new MemoryStorage();
    const state = makeState();

    saveState(state, storage);
    const result = loadState(storage);

    expect(result.status).toBe('ok');
    expect(result.state).toEqual(state);
  });

  it('memulihkan state kosong saat JSON rusak dan menyimpan backup', () => {
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEY, '{bukan json');

    const result = loadState(storage);

    expect(result.status).toBe('recovered');
    expect(result.state).toEqual(createEmptyState());
    expect(storage.getItem(CORRUPT_BACKUP_KEY)).toBe('{bukan json');
    expect(storage.getItem(STORAGE_KEY)).toBe('{bukan json');
  });

  it('menolak schemaVersion yang tidak didukung', () => {
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...makeState(), schemaVersion: 99 }));

    const result = loadState(storage);

    expect(result.status).toBe('recovered');
    expect(result.state).toEqual(createEmptyState());
  });

  it('menolak data dengan cadence tidak valid', () => {
    const storage = new MemoryStorage();
    const state = makeState();
    state.routines[0] = makeRoutine({ cadence: { type: 'weekly', weekday: 9 } as never });
    storage.setItem(STORAGE_KEY, JSON.stringify(state));

    const result = loadState(storage);

    expect(result.status).toBe('recovered');
  });

  it('tidak crash saat storage melempar error', () => {
    const storage: StorageLike = {
      getItem: () => {
        throw new Error('diblokir');
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    };

    const result = loadState(storage);

    expect(result.status).toBe('recovered');
    expect(result.state).toEqual(createEmptyState());
  });
});

describe('saveState', () => {
  it('menolak state tidak valid tanpa menulis apa pun', () => {
    const storage = new MemoryStorage();
    const invalid = { ...makeState(), routines: [{ id: 'x' }] } as unknown as AppState;

    expect(() => saveState(invalid, storage)).toThrow(/tidak valid/i);
    expect(storage.has(STORAGE_KEY)).toBe(false);
  });
});

describe('clearState', () => {
  it('menghapus data utama dan backup', () => {
    const storage = new MemoryStorage();
    saveState(makeState(), storage);
    storage.setItem(CORRUPT_BACKUP_KEY, 'backup');

    clearState(storage);

    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(storage.getItem(CORRUPT_BACKUP_KEY)).toBeNull();
  });
});

describe('isAppState', () => {
  it('menerima state valid', () => {
    expect(isAppState(makeState())).toBe(true);
  });

  it('menolak rutinitas tanpa langkah', () => {
    const state = makeState();
    state.routines[0] = makeRoutine({ steps: [] });

    expect(isAppState(state)).toBe(false);
  });

  it('menolak id langkah duplikat', () => {
    const state = makeState();
    state.routines[0] = makeRoutine({
      steps: [
        { id: 'sama', title: 'Satu' },
        { id: 'sama', title: 'Dua' },
      ],
    });

    expect(isAppState(state)).toBe(false);
  });

  it('menolak run selesai sebelum dimulai', () => {
    const state = makeState();
    state.runs[0] = makeRun({
      startedAt: '2026-11-06T10:00:00.000Z',
      completedAt: '2026-11-06T09:00:00.000Z',
    });

    expect(isAppState(state)).toBe(false);
  });
});

describe('isCadence', () => {
  it.each([
    { type: 'daily' },
    { type: 'weekly', weekday: 1 },
    { type: 'monthly', day: 28 },
    { type: 'interval', days: 14 },
  ])('menerima $type', (cadence) => {
    expect(isCadence(cadence)).toBe(true);
  });

  it.each([
    { type: 'daily ' },
    { type: 'weekly', weekday: 0 },
    { type: 'monthly', day: 29 },
    { type: 'interval', days: 0 },
    null,
  ])('menolak %o', (cadence) => {
    expect(isCadence(cadence)).toBe(false);
  });
});
