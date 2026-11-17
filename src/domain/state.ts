import { SCHEMA_VERSION } from './types';
import type { AppState, Cadence, Routine, RoutineStep, Run, RunStepState } from './types';

export function createEmptyState(): AppState {
  return { schemaVersion: SCHEMA_VERSION, routines: [], runs: [] };
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isDateString(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

export function isCadence(value: unknown): value is Cadence {
  if (!isRecord(value)) return false;
  switch (value.type) {
    case 'daily':
      return true;
    case 'weekly':
      return isIntegerInRange(value.weekday, 1, 7);
    case 'monthly':
      return isIntegerInRange(value.day, 1, 28);
    case 'interval':
      return isIntegerInRange(value.days, 1, 365);
    default:
      return false;
  }
}

function isStep(value: unknown): value is RoutineStep {
  return isRecord(value) && isNonEmptyString(value.id) && isNonEmptyString(value.title);
}

function isRunStepState(value: unknown): value is RunStepState {
  return isRecord(value) && isNonEmptyString(value.stepId) && typeof value.done === 'boolean';
}

export function isRoutine(value: unknown): value is Routine {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.name)) return false;
  if (typeof value.description !== 'string') return false;
  if (!isCadence(value.cadence)) return false;
  if (!isDateString(value.createdAt)) return false;
  if (typeof value.archived !== 'boolean') return false;
  if (!Array.isArray(value.steps) || value.steps.length === 0) return false;
  if (!value.steps.every(isStep)) return false;
  const stepIds = new Set(value.steps.map((step) => step.id));
  return stepIds.size === value.steps.length;
}

export function isRun(value: unknown): value is Run {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.id) || !isNonEmptyString(value.routineId)) return false;
  if (!isDateString(value.startedAt)) return false;
  if (value.completedAt !== null) {
    if (!isDateString(value.completedAt)) return false;
    if (Date.parse(value.completedAt) < Date.parse(value.startedAt)) return false;
  }
  if (typeof value.note !== 'string') return false;
  if (!Array.isArray(value.stepStates) || !value.stepStates.every(isRunStepState)) return false;
  const stepIds = new Set(value.stepStates.map((step) => step.stepId));
  return stepIds.size === value.stepStates.length;
}

export function isAppState(value: unknown): value is AppState {
  if (!isRecord(value)) return false;
  if (value.schemaVersion !== SCHEMA_VERSION) return false;
  if (!Array.isArray(value.routines) || !value.routines.every(isRoutine)) return false;
  if (!Array.isArray(value.runs) || !value.runs.every(isRun)) return false;
  const routineIds = new Set(value.routines.map((routine) => routine.id));
  if (routineIds.size !== value.routines.length) return false;
  const runIds = new Set(value.runs.map((run) => run.id));
  return runIds.size === value.runs.length;
}
