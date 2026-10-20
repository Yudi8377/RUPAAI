# RUPAAI — gerbang kesiapan komersial

Dokumen ini adalah daftar gerbang rilis yang harus ditutup dengan bukti. Status hijau pada CI hanya membuktikan langkah otomatis yang dijalankan, bukan bahwa seluruh produk siap dijual.

## Status produk saat ini

**Status: prototipe/preview terbatas — belum layak dipasarkan sebagai simulator potongan rambut fotorealistis.**

Yang sudah ada:
- Kamera baru diminta setelah tindakan pengguna.
- Segmentasi dan recoloring warna rambut berjalan di browser dengan MediaPipe.
- Ekspor frame PNG lokal.
- UI responsif, PWA dasar, serta workflow quality dan browser smoke tests.
- Build APK Android untuk QA internal; APK debug belum ditandatangani untuk distribusi.
- Kebijakan privasi dan ketentuan awal.

Batasan yang wajib terlihat pada pemasaran:
- Kartu potongan rambut saat ini adalah referensi; bentuk rambut pengguna belum diganti secara fotorealistis.
- Model AI dan runtime perlu diunduh dari CDN pada penggunaan pertama.
- Belum ada akun pelanggan, profil salon persisten, billing, langganan, panel admin, maupun alur dukungan operasional.
- Deployment produksi yang berstatus READY tidak otomatis membuktikan deployment itu berasal dari commit main terbaru.

## Gerbang rilis — jangan menandai selesai tanpa bukti

### A. Fitur inti
- [ ] Integrasikan provider hairstyle transfer fotorealistis atau model yang hak komersialnya telah diverifikasi.
- [ ] Backend server-side untuk memanggil provider; jangan pernah mengirim API key ke bundle browser.
- [ ] Batasi ukuran/jenis gambar, waktu proses, concurrency, biaya per pengguna, dan abuse/rate limits.
- [ ] Jelaskan secara terpisah kapan gambar tetap lokal dan kapan gambar dikirim ke provider eksternal.
- [ ] Sediakan fallback yang jelas saat model/provider gagal, tanpa menyatakan potongan telah diterapkan.

### B. Privasi dan keamanan
- [ ] Persetujuan eksplisit sebelum mengunggah foto ke pemroses eksternal.
- [ ] Kebijakan retensi/penghapusan foto dan log yang selaras dengan perilaku implementasi sebenarnya.
- [ ] Hindari menyimpan foto wajah secara default; jangan memasukkan foto ke analitik/error logs.
- [ ] Tambahkan autentikasi, otorisasi per salon/tenant, validasi input, rate limiting, dan proteksi endpoint sebelum menyimpan data pelanggan.
- [ ] Audit dependency, secret exposure, CSP/security headers, serta aksesibilitas.
- [ ] Tinjauan hukum untuk privasi, syarat layanan, hak foto/model, lisensi aset, dan kontak pengendali data/support.

### C. Produk berbayar
- [ ] Tentukan paket, batas pemakaian, pajak/biaya, kebijakan refund, invoice, dan mekanisme pembatalan.
- [ ] Integrasikan payment provider di backend dengan verifikasi signature webhook dan idempotency.
- [ ] Jangan mengaktifkan fitur premium berdasarkan parameter dari browser saja; hak akses harus diverifikasi server-side.
- [ ] Buat onboarding salon, pengelolaan staf/role, status langganan, dan alur penghapusan akun/data.

### D. Reliabilitas dan operasi
- [ ] Browser test meliputi mulai/berhenti kamera berulang, izin ditolak, model gagal dimuat, ekspor, dan mobile layout.
- [ ] Uji perangkat fisik Android/iOS, berbagai warna/tekstur rambut, pencahayaan, kacamata, dan sudut kepala.
- [ ] Ukur latensi, penggunaan memori, dan performa perangkat kelas bawah.
- [ ] Siapkan monitoring tanpa mengumpulkan frame kamera, alert, backup/restore jika backend persisten ditambahkan, dan prosedur insiden.
- [ ] Uji deployment commit terbaru melalui HTTPS, smoke test URL produksi, serta rollback yang dapat dijalankan.
- [ ] Android release ditandatangani; iOS signing/TestFlight/App Store dikerjakan di macOS/Xcode dengan akun developer yang valid.

## Deployment Vercel melalui GitHub Actions

Workflow .github/workflows/deploy-production.yml menyiapkan deployment otomatis setelah kredensial disediakan. Di GitHub repository settings, atur:

- **Repository variable** VERCEL_ORG_ID: ID scope/team Vercel yang benar dan memiliki akses ke project.
- **Repository variable** VERCEL_PROJECT_ID: ID project RUPAAI yang benar.
- **Repository secret** VERCEL_TOKEN: token Vercel yang memiliki izin untuk scope/project tersebut.

Jangan menyimpan token di file, commit, .env.example, atau variabel VITE_*. Bila token masih tidak berwenang pada scope project, perbaiki otorisasi Vercel; jangan membuat project baru dengan nama sama sebagai jalan pintas. Workflow hanya akan berjalan otomatis ketika dua repository variables tersedia.

## Keputusan rilis

RUPAAI boleh dipakai sebagai **preview terbatas untuk menguji recoloring rambut** setelah URL produksi diverifikasi terhadap commit terbaru. Jangan menjualnya sebagai pemotong rambut fotorealistis, SaaS salon lengkap, atau aplikasi mobile release sampai gerbang terkait di atas memiliki bukti uji dan operasional yang nyata.
