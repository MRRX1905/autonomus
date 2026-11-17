# Autonomus

Runbook local-first untuk operator solo: susun rutinitas berulang, lihat yang jatuh tempo, dan catat penyelesaiannya.

Status: **M1 — fondasi data**. UI builder dan dashboard belum tersedia.

## Menjalankan

```powershell
npm install
npm run dev
```

Buka URL yang ditampilkan Vite (default `http://localhost:5173`).

## Verifikasi

```powershell
npm run test
npm run build
```

## Struktur

- `src/domain/types.ts` — tipe `Routine`, `Run`, `Cadence`, `AppState`.
- `src/domain/state.ts` — validasi state dan factory.
- `src/domain/storage.ts` — load/save/clear `localStorage`, key `autonomus.v1`.
- `src/App.tsx` — shell UI sementara.

## Batasan saat ini

- Belum ada CRUD rutinitas, dashboard, atau export/import.
- Data hanya di `localStorage` browser; tidak ada sinkronisasi.
- JSON rusak atau schema tidak dikenal diabaikan dan disalin ke key `autonomus.v1.corrupt`.
- Tanpa backend, autentikasi, dan network request saat runtime.

Brief lengkap: `PRODUCT_BRIEF.md`. Pekerjaan berikutnya: `BACKLOG.md`.
