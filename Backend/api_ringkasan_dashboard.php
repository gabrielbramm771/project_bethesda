<?php
// ============ BACKEND ============
// Endpoint: GET /Backend/api_ringkasan_dashboard.php
// Balasan (JSON): { success, total_hari_ini, menunggu, selesai }

require 'helper_sesi.php';
wajib_login();
require 'koneksi.php';

$id_dokter    = $_SESSION['id_dokter'];
$tgl_hari_ini = date('Y-m-d');

$stmt = $koneksi->prepare(
    "SELECT status, COUNT(*) AS jumlah
     FROM pendaftaran
     WHERE id_dokter = ? AND tgl_periksa = ?
     GROUP BY status"
);
$stmt->bind_param('ss', $id_dokter, $tgl_hari_ini);
$stmt->execute();
$hasil = $stmt->get_result();

$ringkasan = ['Pending' => 0, 'ACC' => 0, 'Selesai' => 0, 'Ditolak' => 0];
while ($row = $hasil->fetch_assoc()) {
    $ringkasan[$row['status']] = (int) $row['jumlah'];
}

echo json_encode([
    'success'        => true,
    'total_hari_ini' => $ringkasan['Pending'] + $ringkasan['ACC'] + $ringkasan['Selesai'],
    'menunggu'       => $ringkasan['Pending'] + $ringkasan['ACC'],
    'selesai'        => $ringkasan['Selesai'],
]);
