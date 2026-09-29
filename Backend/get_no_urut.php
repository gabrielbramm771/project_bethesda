<?php
header('Content-Type: application/json');
include 'koneksi.php';

$kode_klinik = $_GET['kode_klinik'] ?? '';
$id_dokter   = $_GET['id_dokter'] ?? '';
$tgl_periksa = $_GET['tgl_periksa'] ?? date('Y-m-d');

if (empty($kode_klinik)) {
    echo json_encode(['status' => 'error', 'message' => 'Kode klinik kosong']);
    exit;
}

// No. urut klinik: antrean per klinik pada tanggal periksa
$stmt = $koneksi->prepare("SELECT MAX(no_urut) AS max_urut FROM pendaftaran WHERE kode_klinik = ? AND tgl_periksa = ?");
$stmt->bind_param("ss", $kode_klinik, $tgl_periksa);
$stmt->execute();
$hasil = $stmt->get_result()->fetch_assoc();
$no_urut = ($hasil['max_urut']) ? $hasil['max_urut'] + 1 : 1;

// No. urut dokter: antrean per dokter pada tanggal periksa
$no_urut_dokter = 1;
if ($id_dokter !== '') {
    $stmtD = $koneksi->prepare("SELECT MAX(no_urut_dokter) AS max_urut FROM pendaftaran WHERE id_dokter = ? AND tgl_periksa = ?");
    $stmtD->bind_param("ss", $id_dokter, $tgl_periksa);
    $stmtD->execute();
    $hasilD = $stmtD->get_result()->fetch_assoc();
    $no_urut_dokter = ($hasilD['max_urut']) ? $hasilD['max_urut'] + 1 : 1;
}

echo json_encode([
    'status' => 'success',
    'no_urut' => $no_urut,
    'no_urut_dokter' => $no_urut_dokter
]);