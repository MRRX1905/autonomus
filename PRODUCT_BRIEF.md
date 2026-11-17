# PRODUCT BRIEF

- Product name: Autonomus
- Owner: Pemilik project
- Created: 2026-11-15
- Updated: 2026-11-15
- Status: AKTIF v0.1 — ditetapkan Manager atas delegasi pemilik ("isi aja"); dapat direvisi
- Disusun oleh: ZYRO Manager (peran Strategist + Builder)

> Keputusan produk di bawah diambil Manager karena pemilik menyerahkan pengisian brief.
> Revisi arah produk oleh pemilik tetap diprioritaskan; fondasi teknis M1 tidak mengikat konsep.
> Tidak ada fitur yang boleh ditambah tanpa memperbarui brief ini.

## 1. Ringkasan satu kalimat
Autonomus adalah aplikasi web local-first untuk operator solo yang menyusun rutinitas operasional berulang menjadi runbook berlangkah, lalu melihat apa yang harus dijalankan hari ini dan mencatat penyelesaiannya.

## 2. Masalah / peluang
Operator solo (freelancer, indie hacker, pemilik usaha kecil) menjalankan proses berulang — cek mingguan, onboarding klien, rilis produk — yang tersebar di catatan, kalender, dan ingatan.
Gejala:
- langkah terlewat karena tidak ada checklist tunggal;
- tidak jelas rutinitas mana yang jatuh tempo hari ini;
- tidak ada riwayat kapan terakhir dijalankan.

Peluang: alat kecil, tanpa integrasi, yang membuat rutinitas terlihat dan terselesaikan. Bukan platform otomasi penuh.

## 3. Pengguna target
- Primer: satu operator yang mengelola pekerjaannya sendiri, nyaman dengan browser, tidak ingin setup server.
- Sekunder: tim kecil 2–5 orang yang berbagi satu perangkat/browser (belum multi-user).
- Kemampuan teknis: rendah–menengah. Tidak boleh butuh CLI untuk memakai aplikasi.

## 4. Tujuan dan metrik keberhasilan
Tujuan MVP: pengguna dapat mendefinisikan rutinitas, melihat yang jatuh tempo, dan menyelesaikan run tanpa berpindah alat.
Metrik:
- 3 rutinitas dapat dibuat dan satu run diselesaikan dalam < 2 menit.
- Data bertahan setelah reload.
- Tidak ada error di console pada alur utama.
- Seluruh unit test dan build lulus.

## 5. Ruang lingkup
### In scope (MVP)
1. CRUD rutinitas: nama, deskripsi opsional, cadence, daftar langkah berurutan.
2. Cadence: harian, mingguan (pilih hari), bulanan (pilih tanggal 1–28), atau setiap N hari.
3. Dashboard "Hari ini": rutinitas jatuh tempo, status selesai/belum, progres langkah.
4. Run: buka rutinitas, centang langkah, selesaikan run, catatan opsional.
5. Riwayat 30 hari terakhir per rutinitas.
6. Persistensi `localStorage` dengan skema berversi.
7. Export/import JSON untuk backup dan pindah perangkat.
8. Empty state, validasi input, layout responsif 360px ke atas.

### Out of scope
- Autentikasi, multi-user, sinkronisasi server, database.
- Eksekusi otomatis, webhook, integrasi pihak ketiga.
- Notifikasi email/push, pembayaran, billing.
- Deploy, domain, analitik, telemetri.
- Mobile app native.

## 6. Fitur inti (berurutan prioritas)
1. **Routine builder** — alasan: tanpa definisi rutinitas, tidak ada produk.
2. **Due engine + dashboard Hari ini** — alasan: inti nilai; menentukan apa yang dikerjakan.
3. **Run & log** — alasan: menutup loop, menghasilkan riwayat.
4. **Export/import** — alasan: mitigasi kehilangan data `localStorage`.
5. **Polish aksesibilitas & responsif** — alasan: usability dasar.

## 7. Alur pengguna utama
1. Buka aplikasi → dashboard kosong menampilkan CTA "Buat rutinitas".
2. Buat rutinitas "Rilis mingguan", cadence mingguan hari Jumat, 4 langkah.
3. Dashboard menampilkan rutinitas jika jatuh tempo; jika belum, tampil di bagian "Akan datang".
4. Klik "Jalankan" → checklist langkah → centang semua → "Selesaikan run" + catatan.
5. Run tercatat; rutinitas hilang dari daftar jatuh tempo sampai periode berikutnya.
6. Riwayat menampilkan run terakhir dengan waktu dan catatan.

## 8. Batasan teknis
- Stack: Vite + React + TypeScript, CSS modul/vanilla, Zustand atau React state (tanpa backend).
- Persistensi: `localStorage`, key `autonomus.v1`, skema dengan `schemaVersion`.
- Tes: Vitest + Testing Library untuk logika domain dan komponen kunci.
- Build: `npm run build`, output statis.
- Tanpa network request saat runtime; tanpa dependency berat.
- Lingkungan: Node 24.21.0, npm 11.19.0 (terverifikasi tersedia).

## 9. Non-fungsional
- Keamanan/data: klasifikasi INTERNAL. Aplikasi tidak meminta kredensial, tidak mengirim data keluar, tidak memuat skrip pihak ketiga. Data pengguna hanya di browser.
- Kinerja: interaksi < 100 ms untuk < 200 rutinitas; bundle awal wajar (< 300 KB gzip, target, bukan blocker).
- Aksesibilitas: label form, navigasi keyboard, kontras WCAG AA, focus visible.
- Bahasa: UI Bahasa Indonesia; kode dan komentar Bahasa Inggris.
- Zona waktu: tanggal dihitung dari waktu lokal perangkat; DST mengikuti `Date` lokal.

## 10. Milestone dan kriteria penerimaan
| # | Milestone | Deliverable | Kriteria penerimaan | Status |
|---|---|---|---|---|
| M1 | Fondasi | Scaffold Vite+React+TS, model data, storage berversi, unit test | `npm run build` lulus; tes round-trip storage lulus; data tidak rusak saat JSON invalid (fallback ke state kosong) | DONE (2026-11-15) |
| M2 | Routine builder | Form CRUD, editor langkah, validasi | Buat/edit/hapus bertahan setelah reload; nama kosong ditolak; urutan langkah dapat diubah | NOT STARTED |
| M3 | Due engine + dashboard | Fungsi due, dashboard Hari ini/Akan datang, run + log, riwayat | Tes due lulus untuk harian/mingguan/bulanan/interval; run selesai tercatat dengan timestamp; progres = langkah tercentang/total; run lewat tengah malam tidak dihitung dobel | NOT STARTED |
| M4 | Backup + polish | Export/import JSON, empty state, responsif, a11y | Export lalu import memulihkan state identik; layout 360px tanpa overflow; alur utama dapat diselesaikan dengan keyboard | NOT STARTED |
| M5 | Rilis | README, secret scan, Git init, repo GitHub private | Tidak ada rahasia/.env/data pribadi; remote terverifikasi; push hanya setelah pemeriksaan lolos | BLOCKED (menunggu M1–M4) |

## 11. Definition of Done
Default ZYRO + tambahan:
- Setiap milestone punya tes otomatis untuk logika yang dapat diuji.
- `npm run build` dan `npm run test` lulus sebelum milestone ditandai DONE.
- README berisi cara menjalankan dan batasan.
- Tidak ada klaim "teruji" untuk yang belum dijalankan.

## 12. Verifikasi yang diminta
- `npm run test` — unit test domain + komponen kunci.
- `npm run build` — build produksi.
- Manual: alur bagian 7 di browser, termasuk reload dan import/export.
- Verifikasi dijalankan pada akhir setiap milestone; hasilnya dilaporkan apa adanya.

## 13. Persetujuan dan risiko
- Tindakan HIGH yang direncanakan: pembuatan repo GitHub private + push (M5). Butuh pemeriksaan rahasia dan otentikasi GitHub; jika gagal, berhenti dan lapor.
- Dilarang tanpa izin baru: deploy, publikasi repo, perubahan layanan eksternal, penghapusan file di luar project.
- Risiko:
  - Kehilangan data `localStorage` → mitigasi export/import dan peringatan di UI.
  - Scope creep ke otomasi/integrasi → ditolak oleh bagian 5.
  - Perhitungan due lintas DST → tes dengan tanggal tetap; dokumentasikan batasan.
  - Nama "Autonomus" terkesan menjanjikan otomasi penuh → tagline dan UI harus menyebut "runbook", bukan eksekusi otomatis.

## 14. Pertanyaan terbuka
1. Konfirmasi nama produk "Autonomus" atau ganti.
2. Konfirmasi konsep runbook local-first, atau arahkan ke konsep lain.
3. Konfirmasi stack Vite+React+TS (tanpa backend).
