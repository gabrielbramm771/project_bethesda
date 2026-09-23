<?php
session_start();
header('Content-Type: application/json');

require_once 'koneksi.php'; // koneksi.php ada di folder yang sama (Backend/)

$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Username dan password wajib diisi']);
    exit;
}

$stmt = $koneksi->prepare("SELECT id_dokter, nama_dokter, kode_klinik, username FROM dokter WHERE username = ? AND password = ?");
$stmt->bind_param('ss', $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $dokter = $result->fetch_assoc();

    // Simpan data dokter ke session supaya dikenali di halaman lain
    $_SESSION['id_dokter']   = $dokter['id_dokter'];
    $_SESSION['nama_dokter'] = $dokter['nama_dokter'];
    $_SESSION['kode_klinik'] = $dokter['kode_klinik'];
    $_SESSION['username']   = $dokter['username'];

    echo json_encode(['success' => true, 'data' => $dokter]);
} else {
    echo json_encode(['success' => false, 'message' => 'Username atau password salah']);
}

$stmt->close();
$koneksi->close();
