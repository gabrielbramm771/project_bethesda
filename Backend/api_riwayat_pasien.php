<?php
// ============ BACKEND ============
// Endpoint: GET /Backend/api_riwayat_pasien.php
// Balasan (JSON): { success: true, data: [ {no_registrasi, tgl_periksa, keluhan_utama, no_rm, nama_pasien, tgl_lahir, resep_obat}, ... ] }
// Menampilkan SEMUA pasien yang sudah selesai diperiksa oleh dokter yang login, semua tanggal.

require 'helper_sesi.php';
wajib_login();
require 'koneksi.php';

$id_dokter = $_SESSION['id_dokter'];

$stmt = $koneksi->prepare(
    "SELECT p.no_registrasi, p.tgl_periksa, p.keluhan_utama,
            ps.no_rm, ps.nama_pasien, ps.tgl_lahir,
            rm.resep_obat
     FROM pendaftaran p
     JOIN pasien ps ON ps.no_rm = p.no_rm
     LEFT JOIN rekam_medis rm ON rm.no_registrasi = p.no_registrasi
     WHERE p.id_dokter = ? AND p.status = 'Selesai'
     ORDER BY p.tgl_periksa DESC, p.no_urut DESC"
);
$stmt->bind_param('s', $id_dokter);
$stmt->execute();
$hasil = $stmt->get_result();

$daftar = [];
while ($row = $hasil->fetch_assoc()) {
    $daftar[] = $row;
}

echo json_encode(['success' => true, 'data' => $daftar]);
