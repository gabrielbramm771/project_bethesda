<?php
// ============ BACKEND ============
// Endpoint: GET /Backend/api_daftar_pasien.php
// Balasan (JSON): { success: true, data: [ {no_registrasi, no_urut, keluhan_utama, status, no_rm, nama_pasien, tgl_lahir}, ... ] }

require 'helper_sesi.php';
wajib_login();
require 'koneksi.php';

$id_dokter    = $_SESSION['id_dokter'];
$tgl_hari_ini = date('Y-m-d');

$stmt = $koneksi->prepare(
    "SELECT p.no_registrasi, p.no_urut, p.status, p.keluhan_utama,
            ps.no_rm, ps.nama_pasien, ps.tgl_lahir
     FROM pendaftaran p
     JOIN pasien ps ON ps.no_rm = p.no_rm
     WHERE p.id_dokter = ? AND p.tgl_periksa = ? AND p.status NOT IN ('Ditolak', 'Selesai')
     ORDER BY p.no_urut ASC"
);
$stmt->bind_param('ss', $id_dokter, $tgl_hari_ini);
$stmt->execute();
$hasil = $stmt->get_result();

$daftar = [];
while ($row = $hasil->fetch_assoc()) {
    $daftar[] = $row;
}

echo json_encode(['success' => true, 'data' => $daftar]);
