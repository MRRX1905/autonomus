# BACKLOG

Diurutkan dari atas. Kerjakan satu item teratas yang jelas, belum selesai, dan tidak terblokir.

Status: `NOT STARTED` · `IN PROGRESS` · `WAITING FOR USER` · `BLOCKED` · `QA` · `DONE` · `DONE WITH LIMITATIONS`

| ID | Milestone | Item | Prioritas | Status | Kriteria penerimaan | Catatan |
|---|---|---|---|---|---|---|
| B-001 | M0 | Isi `PRODUCT_BRIEF.md` | P0 | DONE | Brief terisi lengkap | Atas delegasi pemilik; konsep runbook local-first |
| B-002 | M0 | Tinjau brief (opsional, dapat direvisi) | P2 | WAITING FOR USER | Pemilik mengoreksi bagian 14 bila perlu | Tidak memblokir M2; revisi berat dapat membatalkan fondasi |
| M1-1 | M1 | Scaffold Vite + React + TS, skrip test/build | P0 | DONE | `npm run build` dan `npm run test` berjalan | Vite 8.3.8, React 19, Vitest 5.1.0 |
| M1-2 | M1 | Model data + validasi + storage `localStorage` berversi + tes | P0 | DONE | Round-trip lulus; JSON rusak → state kosong tanpa crash | 23 tes lulus; backup `autonomus.v1.corrupt` |
| M2-1 | M2 | Form CRUD rutinitas + validasi | P0 | NOT STARTED | Buat/edit/hapus bertahan setelah reload; nama kosong ditolak | Berikutnya |
| M2-2 | M2 | Editor langkah (tambah, ubah, hapus, urutkan) | P0 | NOT STARTED | Urutan tersimpan; minimal 1 langkah | Diblokir M2-1 |
| M3-1 | M3 | Due engine (harian, mingguan, bulanan, interval) + tes | P0 | NOT STARTED | Tes lulus untuk keempat cadence dan edge tengah malam | Diblokir M2-2 |
| M3-2 | M3 | Dashboard Hari ini / Akan datang | P0 | NOT STARTED | Rutinitas jatuh tempo tampil benar; empty state ada | Diblokir M3-1 |
| M3-3 | M3 | Alur run + log + riwayat 30 hari | P0 | NOT STARTED | Run selesai tercatat timestamp; progres sesuai langkah | Diblokir M3-2 |
| M4-1 | M4 | Export/import JSON | P1 | NOT STARTED | Export lalu import memulihkan state identik; file invalid ditolak dengan pesan | Diblokir M3-3 |
| M4-2 | M4 | Responsif 360px + a11y + empty state | P1 | NOT STARTED | Tanpa overflow; alur utama selesai via keyboard | Diblokir M4-1 |
| M5-1 | M5 | README, secret scan, Git init, repo GitHub private, push | P0 | BLOCKED | Tidak ada rahasia; remote dan commit terverifikasi | Butuh M1–M4 selesai + otentikasi GitHub |

## Bukti M1 (2026-11-15)
- `npm run test`: 2 file, 23 tes lulus.
- `npm run build`: `tsc --noEmit` + Vite build lulus; JS 224.25 kB (gzip 70.17 kB).
- Belum diverifikasi: tampilan visual di browser nyata, keyboard, dan responsif — dijadwalkan M4.
- Belum ada `git init`, repo, deploy, atau panggilan jaringan runtime.

## Aturan
- Jangan menambah item produk tanpa dasar di brief.
- Satu item selesai harus punya bukti review terhadap kriteria penerimaan.
- Tes hanya dijalankan bila brief/tugas meminta verifikasi; laporkan yang belum diverifikasi.
- Item `WAITING FOR USER`/`BLOCKED` dilewati, bukan dikerjakan dengan asumsi.
