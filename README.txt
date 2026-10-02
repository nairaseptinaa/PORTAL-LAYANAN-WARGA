WEBSITE KECAMATAN LUMAJANG V2
==============================

CARA MENJALANKAN
1. Extract ZIP.
2. Buka folder hasil extract di VS Code.
3. Pastikan workspace sudah Trusted.
4. Klik kanan index.html > Open with Live Server, atau klik Go Live.

HALAMAN
- index.html  : frontend warga
- login.html  : login admin
- admin.html  : dashboard admin

LOGIN DEMO
Username : admin
Password : Lumajang123!

FITUR WARGA
- Desain modern responsif
- Pencarian layanan
- Detail persyaratan via modal
- Checklist dokumen
- Pusat formulir demo
- Berita + pencarian + filter
- Form laporan insiden
- Nomor tiket otomatis
- Cek status laporan
- FAQ
- Kontak cepat
- Tombol popup panah "Ke atas" yang muncul saat scroll

FITUR ADMIN
- Login sebelum dashboard
- Proteksi halaman admin berbasis sessionStorage
- Logout
- Statistik laporan
- Pencarian dan filter laporan
- Detail laporan
- Perubahan status: Baru, Diproses, Selesai
- Tambah dan hapus berita

PENTING
Login pada versi HTML ini hanya simulasi frontend. Username/password dapat dilihat
dari source code. Untuk website produksi, gunakan backend (misalnya PHP/Laravel,
Node.js, atau framework lain), database, password hashing, session server-side,
CSRF protection, HTTPS, dan kontrol akses.

Nomor telepon, alamat, email, SOP, jam layanan, dan persyaratan pada template wajib
diganti dengan data resmi Kecamatan Lumajang sebelum dipublikasikan.


FITUR BARU V3
- Tema warna lebih ceria: coral, kuning, cyan, ungu, hijau
- Admin dapat mengedit berita
- Konfirmasi sebelum edit
- Konfirmasi sebelum hapus
- Konfirmasi sebelum menyimpan perubahan edit
- Upload gambar berita
- Upload dokumen PDF/DOC/DOCX
- Preview gambar/dokumen
- Lampiran dapat ditampilkan di frontend
- Gambar berita tampil pada kartu berita
- Batas file demo 1,5 MB per file untuk mengurangi risiko localStorage penuh

Catatan:
localStorage memiliki kapasitas terbatas. Untuk produksi, upload file sebaiknya
menggunakan backend + database + object storage/server.


FITUR BARU V4
- Palet warna disederhanakan: hijau-teal, biru pegunungan, krem, dan aksen jingga vulkanik
- Hero anti-mainstream dengan ilustrasi SVG Gunung Semeru dan air terjun
- Data dummy laporan otomatis untuk mencoba tracking
- Contoh tiket tracking:
  LMG-2026-10421
  LMG-2026-20518
  LMG-2026-31840
  LMG-2026-42167
  LMG-2026-53792
  LMG-2026-64215
- Bagian Jelajah Lumajang: wisata, kuliner, dan transportasi
- Footer diubah menjadi "© 2026 Kecamatan Lumajang." tanpa "Template demo"

INFORMASI JELAJAH YANG DIGUNAKAN
Wisata:
- Air Terjun Tumpak Sewu
- Puncak B29 Argosari
- Desa Wisata Ranupani
- Air Terjun Kapas Biru
- Ranu Regulo

Kuliner:
- Sego Kelor
- Krecek Rebung
- Sambal Bawang Khas Tengger

Transportasi:
- Terminal Minak Koncar
- Stasiun Klakah
- Sub Terminal Klakah, Pasirian, dan Pronojiwo

Data destinasi/transportasi tetap perlu diverifikasi kembali oleh pengelola saat akan
dipublikasikan sebagai situs resmi, terutama jika jam operasional, rute, atau status
layanan berubah.


FITUR BARU V5
- Perbaikan tombol Cek Status Laporan agar menggunakan referensi DOM eksplisit
- Enter pada kolom tiket juga dapat menjalankan pengecekan
- Tombol Salin Kode
- Tombol Simpan ke WhatsApp menggunakan WhatsApp share
- Riwayat "Laporan Saya" menyimpan maksimal 5 tiket terakhir di browser
- Klik tiket pada "Laporan Saya" untuk langsung mengecek status
- Tiket baru otomatis masuk ke riwayat setelah laporan dikirim

CATATAN WHATSAPP
Tombol "Simpan ke WhatsApp" membuka WhatsApp dengan pesan tiket yang sudah terisi.
Pengguna dapat memilih chat "Message yourself"/pesan ke diri sendiri atau kontak lain.
Versi HTML statis tidak dapat mengirim WhatsApp secara otomatis tanpa WhatsApp Business API/backend.


FITUR BARU V6 - EKSPOR LAPORAN INSTANSI
- Download Excel (.xls) yang kompatibel dengan Microsoft Excel/LibreOffice
- Download CSV untuk pertukaran data dan impor ke sistem lain
- Cetak / Save as PDF melalui dialog print browser
- Tombol Bagikan: menggunakan Web Share API jika tersedia, atau menyalin ringkasan ke clipboard
- Seluruh ekspor mengikuti pencarian dan filter status yang sedang aktif
- File Excel menyertakan judul, waktu ekspor, filter, pencarian, KPI Total/Baru/Diproses/Selesai, dan detail laporan
- Nama file otomatis menyertakan status dan tanggal ekspor

CATATAN
Format Excel menggunakan SpreadsheetML yang dapat dibuka dengan Microsoft Excel tanpa library eksternal, sehingga website tetap ringan dan dapat digunakan melalui Live Server.


FITUR BARU V7
- Warna status admin dibuat lebih kontras:
  Baru = oranye
  Diproses = biru
  Selesai = hijau
- Ukuran teks tabel, label, tombol, statistik, dan status diperbesar
- Pagination pada Dashboard
- Pagination pada Laporan Warga
- Pilihan jumlah data: 5, 10, 20, Semua
- Tombol halaman sebelumnya dan berikutnya
- Informasi posisi data, contoh: 1–5 dari 24 data
- Filter/pencarian otomatis kembali ke halaman pertama
- Ekspor tetap mengikuti seluruh hasil filter, bukan hanya halaman yang sedang terlihat


FITUR BARU V8
- Fokus aksesibilitas tipografi di halaman user
- Ukuran font navigasi, layanan, berita, FAQ, kontak, formulir, dan teks sekunder diperbesar
- Teks kecil yang sebelumnya 8–11 px dinaikkan agar lebih mudah dibaca lintas usia
- Hasil Cek Status Laporan diperbesar menjadi panel khusus
- Nomor/status pada hasil tracking diberi ukuran lebih besar dan kontras lebih tinggi
- Tombol Salin Kode dan Simpan ke WhatsApp juga diperbesar
- Daftar "Laporan Saya" diperbesar agar lebih mudah disentuh dan dibaca di ponsel


FITUR BARU V9 - AKUN WARGA (halaman user)
- ALUR: buka index.html -> jika belum login otomatis diarahkan ke masuk.html -> setelah
  login/daftar baru masuk ke portal. Jalankan dari index.html atau masuk.html lewat Live Server.
- masuk.html: halaman penuh Masuk / Daftar / Lupa password (di luar dashboard)
- Daftar: validasi nama, email, WhatsApp, password (min. 8 karakter, huruf + angka), email unik
- Masuk: opsi "Ingat saya", batas 5x gagal lalu dikunci 60 detik
- Lupa password: kode verifikasi 6 digit (berlaku 10 menit, maks. 5 percobaan)
  Mode demo menampilkan kode di layar. Produksi: kirim lewat email.
- Password disimpan sebagai hash SHA-256 + salt (bukan teks biasa)
- Navbar portal menampilkan nama pengguna -> menu Akun Saya (ada tombol Keluar)
- Tautan silang: masuk.html <-> login.html (admin)

FITUR TAMBAHAN V9
- Akun Saya: edit profil dan ganti password
- Form laporan terisi otomatis (nama + WhatsApp)
- Laporan baru tertaut ke akun; "Laporan Saya" menampilkan tiket milik akun
- Antrean kunjungan online: layanan, tanggal (14 hari ke depan, Senin-Jumat),
  jam (kuota 5 orang/jam), kode ANT-YYYYMMDD-NNN, bisa dibatalkan
- Simpan berita: tombol "Simpan" di kartu berita + daftar di Akun Saya

CATATAN KEAMANAN
Semua data akun tersimpan di localStorage browser (simulasi), dan gerbang login ini hanya
pengalihan di sisi browser (bisa dilewati lewat DevTools). Untuk produksi diperlukan backend,
database, hashing server-side (bcrypt/argon2), sesi server, email resmi, rate limiting,
CSRF protection, dan HTTPS.
