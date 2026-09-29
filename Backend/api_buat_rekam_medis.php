<?php
// ============ BACKEND ============
// Endpoint: POST /Backend/api_buat_rekam_medis.php
// Body (JSON): { "no_rm": "RM-00123" }
//
// Aturan:
// - Kalau pasien ini BELUM punya pendaftaran hari ini sama sekali -> buat baru untuk dokter yang login.
// - Kalau SUDAH ada pendaftaran hari ini milik dokter yang SAMA dan belum Selesai -> lanjutkan yang itu.
// - Kalau SUDAH ada pendaftaran hari ini milik dokter yang SAMA tapi statusnya Selesai -> tolak (sudah selesai).
// - Kalau SUDAH ada pendaftaran hari ini milik dokter LAIN -> tolak (sudah ditangani dokter lain).

require 'helper_sesi.php';
wajib_login();
require 'koneksi.php';

$input       = json_decode(file_get_contents('php://input'), true) ?? [];
$no_rm       = trim($input['no_rm'] ?? '');
$id_dokter   = $_SESSION['id_dokter'];
$kode_klinik = $_SESSION['kode_klinik'];
$tgl_periksa = date('Y-m-d');

if ($no_rm === '') {
    echo json_encode(['success' => false, 'message' => 'No. RM wajib diisi']);
    exit;
}

// Pastikan pasiennya memang ada
$cekPasien = $koneksi->prepare("SELECT no_rm FROM pasien WHERE no_rm = ?");
$cekPasien->bind_param('s', $no_rm);
$cekPasien->execute();
if (!$cekPasien->get_result()->fetch_assoc()) {
    echo json_encode(['success' => false, 'message' => 'Pasien tidak ditemukan']);
    exit;
}

// Cek pendaftaran pasien ini HARI INI, dengan DOKTER MANAPUN (bukan cuma dokter yang login)
$stmt = $koneksi->prepare(
    "SELECT no_registrasi, id_dokter, status FROM pendaftaran
     WHERE no_rm = ? AND tgl_periksa = ? AND status != 'Ditolak'
     LIMIT 1"
);
$stmt->bind_param('ss', $no_rm, $tgl_periksa);
$stmt->execute();
$existing = $stmt->get_result()->fetch_assoc();

if ($existing) {
    if ((string) $existing['id_dokter'] !== (string) $id_dokter) {
        // Sudah ditangani dokter lain hari ini
        echo json_encode(['success' => false, 'message' => 'Pasien ini sudah terdaftar dengan dokter lain hari ini']);
        exit;
    }
    if ($existing['status'] === 'Selesai') {
        // Sudah selesai diperiksa oleh dokter yang sama, jangan bikin baru
        echo json_encode(['success' => false, 'message' => 'Pasien ini sudah selesai diperiksa hari ini']);
        exit;
    }
    // Masih milik dokter yang sama & belum selesai -> lanjutkan yang sudah ada
    echo json_encode(['success' => true, 'no_registrasi' => $existing['no_registrasi']]);
    exit;
}

// Belum ada pendaftaran sama sekali hari ini -> buat baru
$stmt = $koneksi->prepare(
    "SELECT COALESCE(MAX(no_urut), 0) + 1 AS berikutnya
     FROM pendaftaran
     WHERE id_dokter = ? AND tgl_periksa = ?"
);
$stmt->bind_param('ss', $id_dokter, $tgl_periksa);
$stmt->execute();
$no_urut = (int) $stmt->get_result()->fetch_assoc()['berikutnya'];

// Buat no_registrasi baru, contoh: REG-20260913-0101-001
$no_registrasi = 'REG-' . date('Ymd') . '-' . $id_dokter . '-' . str_pad($no_urut, 3, '0', STR_PAD_LEFT);

$stmt = $koneksi->prepare(
    "INSERT INTO pendaftaran (no_registrasi, no_rm, kode_klinik, id_dokter, no_urut, tgl_periksa, status)
     VALUES (?, ?, ?, ?, ?, ?, 'Pending')"
);
$stmt->bind_param('ssssss', $no_registrasi, $no_rm, $kode_klinik, $id_dokter, $no_urut, $tgl_periksa);
$stmt->execute();

echo json_encode(['success' => true, 'no_registrasi' => $no_registrasi]);
