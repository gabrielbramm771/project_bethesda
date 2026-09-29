<?php
// ============ BACKEND ============
// Endpoint: GET /backend/api_cek_sesi.php
// Dipanggil frontend di awal dashboard.html & rekam_medis.html
// untuk mengecek apakah dokter sedang login.

session_start();
header('Content-Type: application/json');

if (isset($_SESSION['id_dokter'])) {
    echo json_encode([
        'logged_in'   => true,
        'id_dokter'   => $_SESSION['id_dokter'],
        'nama_dokter' => $_SESSION['nama_dokter'],
    ]);
} else {
    echo json_encode(['logged_in' => false]);
}
