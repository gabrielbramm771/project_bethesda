<?php
// ============ BACKEND ============
// Dipakai di awal setiap api_*.php yang butuh dokter sudah login.
// File ini TIDAK PERNAH mengeluarkan HTML — hanya JSON.

session_start();
header('Content-Type: application/json');

function wajib_login() {
    if (!isset($_SESSION['id_dokter'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Belum login']);
        exit;
    }
}
