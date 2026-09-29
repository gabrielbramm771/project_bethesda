<?php
// Endpoint: GET /Backend/get_no_rm.php
// Balasan: { status: "success", no_rm: "RM-00128", terakhir: "RM-00127" }
// Nomor ini hanya PERKIRAAN untuk ditampilkan. Nomor final ditetapkan saat pendaftaran disimpan
// (proses_pendaftaran.php), sehingga aman meski ada pendaftar lain yang menyimpan lebih dulu.

header('Content-Type: application/json');
include 'koneksi.php';
include 'helper_no_rm.php';

$berikutnya = nomor_rm_berikutnya($koneksi);

// Nomor terakhir yang sudah terpakai (null bila tabel masih kosong)
$terakhir = $koneksi->query("SELECT no_rm FROM pasien WHERE no_rm LIKE 'RM-%'
                             ORDER BY CAST(SUBSTRING(no_rm, 4) AS UNSIGNED) DESC LIMIT 1")->fetch_assoc();

echo json_encode([
    'status'   => 'success',
    'no_rm'    => $berikutnya,
    'terakhir' => $terakhir['no_rm'] ?? null,
]);