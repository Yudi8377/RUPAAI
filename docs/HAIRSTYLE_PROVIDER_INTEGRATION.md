# Integrasi provider hairstyle transfer

RUPAAI belum memiliki provider hairstyle transfer yang terhubung. Kartu potongan saat ini hanya referensi, jadi jangan menggambarkannya sebagai hasil generatif.

## Kontrak implementasi yang disarankan

1. Browser meminta persetujuan yang jelas untuk pemrosesan eksternal.
2. Browser mengirim foto ke endpoint server RUPAAI melalui HTTPS; endpoint memvalidasi tipe dan ukuran file, autentikasi, batas penggunaan, dan rate limit.
3. Backend menyimpan API key provider hanya di environment server, memanggil provider, dan tidak mengirim key kembali ke browser.
4. Jika provider bekerja asinkron, backend menyimpan job ID milik provider dan memeriksa status melalui endpoint server RUPAAI.
5. Hasil dikembalikan hanya kepada pemilik sesi yang sah. Hapus file sementara dan batasi retensi log.
6. Tampilkan kegagalan, biaya/kuota, dan status pemrosesan dengan jujur. Jangan log foto, base64, token, atau data wajah.

## Gerbang sebelum mengaktifkan provider

- [ ] Pilih provider berdasarkan uji kualitas, SLA, harga per generasi, kebijakan retensi, wilayah pemrosesan, dan hak penggunaan komersial.
- [ ] Dapatkan akun dan API key resmi; tidak ada key provider yang tersedia di repository saat ini.
- [ ] Verifikasi persyaratan lisensi untuk hasil dan aset referensi.
- [ ] Implementasikan endpoint server dengan schema validation, authentication, rate limiting, request timeout, dan batas biaya.
- [ ] Tambahkan tes unit/integrasi dengan respons provider yang disamarkan; jangan menggunakan foto pelanggan asli di CI.
- [ ] Jalankan evaluasi foto uji berizin untuk variasi rambut, kulit, pose, pencahayaan, dan kacamata.
- [ ] Publikasikan penjelasan pemrosesan foto dan penghapusan data sebelum fitur tersedia bagi pelanggan.

## Mengapa belum mengaktifkan generasi sekarang?

Belum ada API key, akun provider, atau endpoint server yang siap. Mengirim foto pengguna ke layanan eksternal tanpa alur persetujuan dan kebijakan retensi yang jelas tidak boleh dilakukan. Jangan pernah memasukkan key ke variabel VITE_*, karena nilai tersebut dapat ikut terkirim ke browser.
