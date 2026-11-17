# ZYRO CHECKPOINT

- Project: autonomus (`C:\project\autonomus`)
- Task: M1 — fondasi data dan scaffold
- Updated: 2026-11-15
- Overall status: IN PROGRESS

## Objective
Membangun fondasi aplikasi runbook local-first: model data, validasi, penyimpanan, dan shell UI.

## Completed
- Membaca 7 dokumen ZYRO inti.
- Mengisi `PRODUCT_BRIEF.md` v0.1 (konsep Autonomus, milestone M1–M5).
- Scaffold Vite + React + TypeScript; skrip `dev`, `build`, `test`.
- Model data: `Routine`, `RoutineStep`, `Run`, `Cadence`, `AppState`.
- Validasi state ketat: schemaVersion, cadence, tanggal, id unik, urutan waktu run.
- Storage `localStorage` key `autonomus.v1`; backup data rusak ke `autonomus.v1.corrupt`.
- Shell UI menampilkan status data, jumlah rutinitas/langkah/run, dan reset data.
- Tes: 2 file, 23 tes lulus. Build produksi lulus.

## Current work
Tidak ada yang berjalan. M1 selesai; M2 belum dimulai.

## Decisions
- Konsep: runbook local-first untuk operator solo; bukan eksekusi otomasi.
- Stack: Vite 8 + React 19 + TypeScript, Vitest 5 + jsdom, tanpa backend.
- State invalid tidak menimpa data asli saat load; backup best-effort dibuat.
- Schema version tunggal (v1); versi tak dikenal → state kosong + backup.
- M2 melanjutkan tanpa menunggu B-002 karena pemilik mendelegasikan arah produk.
- Tidak ada `git init`, repo, deploy, atau layanan eksternal yang disentuh.

## Assumptions
- Satu pengguna per browser cukup untuk MVP.
- Bahasa UI Indonesia; kode Bahasa Inggris.
- Owner tidak akan mengganti konsep secara fundamental.

## Pending tasks
1. M2-1: form CRUD rutinitas + validasi.
2. M2-2: editor langkah.
3. M3: due engine, dashboard, run log.
4. M4: export/import, responsif, a11y.
5. M5: README final, secret scan, Git, repo private.
6. B-002: tinjau brief (opsional).

## Dependencies
- M2 tidak bergantung pada layanan eksternal.
- M5 membutuhkan otentikasi GitHub (belum diperiksa).

## Risks / blockers
- Brief belum ditinjau pemilik. Revisi konsep berat membatalkan sebagian UI M2–M3, tetapi fondasi data tetap berguna.
- Data hanya di `localStorage`; export/import belum ada sampai M4.
- UI belum diuji di browser nyata; smoke test jsdom bukan bukti visual.

## Relevant files and sources
- `src/domain/types.ts`, `src/domain/state.ts`, `src/domain/storage.ts`
- `src/domain/storage.test.ts`, `src/App.test.tsx`
- `src/App.tsx`, `src/index.css`, `src/main.tsx`
- `PRODUCT_BRIEF.md`, `BACKLOG.md`, `README.md`
- Panduan: `C:\Users\mrafi\Downloads\ZYRO_v1.0_ChatGPT_Project_Package\ZYRO_v1.0\`

## Next action
M2-1: implementasikan form CRUD rutinitas dengan penyimpanan otomatis dan tes; jalankan `npm run test` + `npm run build`.

## Resume instructions
1. Baca checkpoint ini, brief, backlog, dan `src/domain/*`.
2. Mulai dari item `NOT STARTED` teratas (M2-1). Jangan kerjakan item `BLOCKED`.
3. Selesaikan satu milestone per run; perbarui brief/backlog/checkpoint.
4. Laporkan tes yang dijalankan dan yang belum. Jangan klaim verifikasi visual tanpa browser.
5. Jangan deploy, jangan ubah layanan eksternal, jangan buat repo publik.
