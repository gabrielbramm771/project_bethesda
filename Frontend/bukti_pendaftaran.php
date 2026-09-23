<?php
// Koneksi ke database
include '../Backend/koneksi.php'; // sesuaikan path koneksi kamu

$no_reg = $_GET['no_reg'] ?? '';

// Ambil data pendaftaran gabungan dengan pasien, klinik, & dokter
$query = mysqli_query($koneksi, "
    SELECT p.*, pas.nama_pasien, k.nama_klinik, d.nama_dokter 
    FROM pendaftaran p
    JOIN pasien pas ON p.no_rm = pas.no_rm
    JOIN klinik k ON p.kode_klinik = k.kode_klinik
    JOIN dokter d ON p.id_dokter = d.id_dokter
    WHERE p.no_registrasi = '$no_reg'
");

$data = mysqli_fetch_assoc($query);

// Jika data tidak ditemukan
if (!$data) {
    echo "Data pendaftaran tidak ditemukan.";
    exit();
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bukti Pendaftaran - Klinik</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center p-4">

    <!-- Card Bukti Pendaftaran (Tiket) -->
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <!-- Header Tiket -->
        <div class="bg-blue-600 p-6 text-white text-center relative">
            <div class="inline-flex p-3 bg-white/10 rounded-2xl mb-2 backdrop-blur-sm">
                <i data-lucide="check-circle-2" class="w-8 h-8 text-green-300"></i>
            </div>
            <h1 class="text-xl font-bold">Pendaftaran Berhasil!</h1>
            <p class="text-xs text-blue-100 mt-0.5">Simpan atau tunjukkan tiket ini kepada petugas</p>
        </div>

        <!-- Nomor Antrean Besar -->
        <div class="bg-blue-50 py-6 text-center border-b border-dashed border-blue-200 relative">
            <span class="text-xs font-bold uppercase tracking-widest text-blue-500 block mb-1">Nomor Antrean Anda</span>
            <span class="text-5xl font-black text-blue-700"><?= sprintf("%03d", $data['no_urut']); ?></span>
            
            <!-- Hiasan Setengah Lingkaran ala Tiket -->
            <div class="w-5 h-5 bg-slate-100 rounded-full absolute -left-2.5 -bottom-2.5"></div>
            <div class="w-5 h-5 bg-slate-100 rounded-full absolute -right-2.5 -bottom-2.5"></div>
        </div>

        <!-- Rincian Informasi -->
        <div class="p-6 space-y-4 text-sm">
            
            <div class="flex justify-between items-center pb-2 border-b border-gray-100">
                <span class="text-gray-400">No. Registrasi</span>
                <span class="font-mono font-bold text-gray-700"><?= $data['no_registrasi']; ?></span>
            </div>

            <div class="flex justify-between items-center pb-2 border-b border-gray-100">
                <span class="text-gray-400">Nama Pasien</span>
                <span class="font-semibold text-gray-800"><?= $data['nama_pasien']; ?> (<?= $data['no_rm']; ?>)</span>
            </div>

            <div class="flex justify-between items-center pb-2 border-b border-gray-100">
                <span class="text-gray-400">Klinik Tujuan</span>
                <span class="font-semibold text-gray-800"><?= $data['nama_klinik']; ?></span>
            </div>

            <div class="flex justify-between items-center pb-2 border-b border-gray-100">
                <span class="text-gray-400">Dokter Spesialis</span>
                <span class="font-semibold text-gray-800"><?= $data['nama_dokter']; ?></span>
            </div>

            <!-- Tombol Aksi -->
            <div class="pt-4 space-y-2">
                <button onclick="window.print()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2">
                    <i data-lucide="printer" class="w-4 h-4"></i>
                    <span>Cetak Tiket</span>
                </button>
                <a href="pendaftaran.html" class="block text-center w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition">
                    Kembali ke Beranda
                </a>
            </div>

        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>