import { useState } from 'react';
import { CORRUPT_BACKUP_KEY, clearState, loadState, type LoadStatus } from './domain/storage';

const statusLabel: Record<LoadStatus, string> = {
  empty: 'Belum ada data',
  ok: 'Data dimuat',
  recovered: 'Data dipulihkan',
};

export default function App() {
  const [result, setResult] = useState(() => loadState());
  const { state, status } = result;

  const completedRuns = state.runs.filter((run) => run.completedAt !== null).length;
  const totalSteps = state.routines.reduce((sum, routine) => sum + routine.steps.length, 0);

  function handleReset() {
    const confirmed = window.confirm(
      'Hapus seluruh data Autonomus di browser ini? Tindakan ini tidak dapat dibatalkan.',
    );
    if (!confirmed) return;
    clearState();
    setResult(loadState());
  }

  return (
    <div className="shell">
      <header className="masthead">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <div>
            <h1>Autonomus</h1>
            <p>Runbook rutin untuk operator solo. Data tinggal di browser ini.</p>
          </div>
        </div>
        <span className={`pill pill-${status}`} aria-live="polite">
          {statusLabel[status]}
        </span>
      </header>

      <main>
        {status === 'recovered' && (
          <section className="notice" role="alert">
            <h2>Data lokal tidak dapat dibaca</h2>
            <p>
              Aplikasi memakai state kosong agar tidak crash. Salinan mentah disimpan di key{' '}
              <code>{CORRUPT_BACKUP_KEY}</code> dan tidak dihapus otomatis.
            </p>
          </section>
        )}

        <section className="card" aria-labelledby="foundation-title">
          <h2 id="foundation-title">Fondasi data</h2>
          <p className="muted">
            Milestone M1: model data, validasi, dan penyimpanan lokal. Builder rutinitas menyusul di
            M2.
          </p>
          <dl className="stats">
            <div>
              <dt>Rutinitas</dt>
              <dd>{state.routines.length}</dd>
            </div>
            <div>
              <dt>Langkah</dt>
              <dd>{totalSteps}</dd>
            </div>
            <div>
              <dt>Run tercatat</dt>
              <dd>{state.runs.length}</dd>
            </div>
            <div>
              <dt>Run selesai</dt>
              <dd>{completedRuns}</dd>
            </div>
          </dl>
        </section>

        <section className="card" aria-labelledby="storage-title">
          <h2 id="storage-title">Penyimpanan</h2>
          <ul className="facts">
            <li>
              Key: <code>autonomus.v1</code>
            </li>
            <li>Schema: v{state.schemaVersion}</li>
            <li>Tidak ada network request saat runtime.</li>
            <li>Export/import JSON tersedia di M4.</li>
          </ul>
          <button type="button" className="button" onClick={handleReset} disabled={status === 'empty'}>
            Hapus data lokal
          </button>
        </section>
      </main>

      <footer>
        <span>M1 — fondasi</span>
        <span>Data tidak dikirim keluar browser.</span>
      </footer>
    </div>
  );
}
