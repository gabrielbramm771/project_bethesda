<?php
header('Content-Type: application/json');
include 'koneksi.php';

$kode_klinik = $_GET['kode_klinik'] ?? '';
$tgl_today   = date('Y-m-d');

if (empty($kode_klinik)) {
    echo json_encode(['status' => 'error', 'message' => 'Kode klinik kosong']);
    exit;
}

$stmt = $koneksi->prepare("SELECT MAX(no_urut) as max_urut FROM pendaftaran WHERE kode_klinik = ? AND tgl_periksa = ?");
$stmt->bind_param("ss", $kode_klinik, $tgl_today);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

// Jika belum ada antrean hari ini, nomor urut mulai dari 1
$next_no_urut = ($result['max_urut']) ? $result['max_urut'] + 1 : 1;

echo json_encode([
    'status' => 'success',
    'no_urut' => $next_no_urut
]);
?>