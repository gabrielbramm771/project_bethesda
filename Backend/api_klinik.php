<?php
// Endpoint: GET /Backend/api_klinik.php
// Balasan: { status, data: [ {kode_klinik, nama_klinik}, ... ] }

header('Content-Type: application/json');
include 'koneksi.php';

$hasil = $koneksi->query("SELECT kode_klinik, nama_klinik FROM klinik ORDER BY nama_klinik ASC")->fetch_all(MYSQLI_ASSOC);

echo json_encode(['status' => 'success', 'data' => $hasil]);
