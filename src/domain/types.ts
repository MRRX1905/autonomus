export const SCHEMA_VERSION = 1;

/** 1 = Senin ... 7 = Minggu */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Cadence =
  | { type: 'daily' }
  | { type: 'weekly'; weekday: Weekday }
  | { type: 'monthly'; day: number }
  | { type: 'interval'; days: number };

export interface RoutineStep {
  id: string;
  title: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  cadence: Cadence;
  steps: RoutineStep[];
  createdAt: string;
  archived: boolean;
}

export interface RunStepState {
  stepId: string;
  done: boolean;
}

export interface Run {
  id: string;
  routineId: string;
  startedAt: string;
  completedAt: string | null;
  stepStates: RunStepState[];
  note: string;
}

export interface AppState {
  schemaVersion: number;
  routines: Routine[];
  runs: Run[];
}
