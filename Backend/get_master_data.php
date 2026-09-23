<?php
header('Content-Type: application/json');
include 'koneksi.php';

$query_klinik = mysqli_query($koneksi, "SELECT * FROM klinik");
$klinik = mysqli_fetch_all($query_klinik, MYSQLI_ASSOC);

$query_dokter = mysqli_query($koneksi, "SELECT id_dokter, nama_dokter, kode_klinik FROM dokter");
$dokter = mysqli_fetch_all($query_dokter, MYSQLI_ASSOC);

echo json_encode([
    'status' => 'success',
    'klinik' => $klinik,
    'dokter' => $dokter
]);
?>