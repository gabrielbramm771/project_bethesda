<?php
// ============ BACKEND ============
// Endpoint: GET /backend/api_semua_pasien.php
// Mengambil SEMUA data pasien dari tabel `pasien` (bukan hanya yang sudah daftar hari ini)
// Balasan (JSON): { success: true, data: [ {no_rm, nama_pasien, no_ktp, tgl_lahir, no_telp, alamat}, ... ] }

require 'helper_sesi.php';
wajib_login();
require 'koneksi.php';

$hasil = $koneksi->query(
    "SELECT no_rm, nama_pasien, no_ktp, tgl_lahir, no_telp, alamat
     FROM pasien
     ORDER BY nama_pasien ASC"
);

$daftar = [];
while ($row = $hasil->fetch_assoc()) {
    $daftar[] = $row;
}

echo json_encode(['success' => true, 'data' => $daftar]);
