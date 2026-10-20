# RUPAAI — perangkat dan distribusi

## Jalur distribusi

- **Desktop (Windows/macOS/Linux):** gunakan situs HTTPS di browser modern; kamera membutuhkan izin pengguna. PWA dapat dipasang dari browser yang mendukung instalasi.
- **Android:** PWA dapat ditambahkan dari Chrome melalui menu instalasi. Workflow GitHub Actions `RUPAAI Android APK` membangun APK debug dan mengunggahnya sebagai artifact. APK debug ditujukan untuk QA internal, bukan distribusi Play Store.
- **iPhone/iPad:** gunakan Safari melalui HTTPS dan pilih Share → Add to Home Screen bila tersedia. Untuk aplikasi native, buka proyek Capacitor iOS di Xcode pada macOS, konfigurasi signing dan izin kamera, lalu uji di perangkat nyata. App Store/TestFlight memerlukan akun developer Apple dan signing yang valid.
- **Tablet:** antarmuka web responsif; pengujian harus mencakup orientasi portrait/landscape dan area sentuh.

## Kapabilitas dan batasan saat ini

- Kamera menggunakan browser/WebView `getUserMedia`; akses memerlukan HTTPS (kecuali localhost), izin kamera, dan perangkat yang kompatibel.
- Segmentasi rambut dan pewarnaan berjalan lokal di browser setelah model MediaPipe diunduh. Pemakaian pertama membutuhkan jaringan untuk mengunduh runtime/model. Cache aplikasi tidak menjamin model AI tersedia offline.
- PWA menyediakan app shell cache dasar; pengalaman offline penuh belum dijanjikan.
- Pilihan potongan rambut tetap berupa kartu referensi. Paket lintas perangkat tidak mengubah fitur itu menjadi penggantian potongan fotorealistis.
- APK workflow menghasilkan **debug APK tanpa tanda tangan rilis**. Jangan mendistribusikannya ke pelanggan sebagai rilis komersial.
- iOS native archive, signing, TestFlight, dan App Store tidak dapat diselesaikan dari runner Linux dan membutuhkan Apple Developer account/Mac dengan Xcode.

## QA sebelum rilis publik

1. Jalankan quality checks dan Chromium smoke tests.
2. Uji kamera pada Android Chrome, iOS Safari, tablet, dan desktop fisik.
3. Uji izin diterima/ditolak, pergantian kamera depan/belakang, mulai/berhenti berulang, track terputus, rotasi layar, ekspor PNG, dan kondisi jaringan buruk.
4. Pastikan kamera tidak mengirim frame ke backend dan evaluasi beban CPU/memori pada perangkat kelas bawah.
5. Sebelum distribusi, buat signing Android, kebijakan privasi final dan kontak dukungan, serta proses update/rollback.
