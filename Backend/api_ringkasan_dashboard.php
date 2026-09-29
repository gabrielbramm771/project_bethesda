<?php
// ============ BACKEND ============
// Endpoint: GET /Backend/api_ringkasan_dashboard.php
// Balasan (JSON): { success, total_hari_ini, menunggu, selesai }
//
// total_hari_ini & selesai: dihitung untuk tgl_periksa = HARI INI saja.
// menunggu: dihitung untuk SEMUA tanggal (termasuk pendaftaran untuk hari-hari mendatang),
//           supaya dokter tetap tahu total pasien yang masih menunggu meski belum
//           muncul di tabel "Daftar pasien hari ini".

require 'helper_sesi.php';
wajib_login();
require 'koneksi.php';

$id_dokter    = $_SESSION['id_dokter'];
$tgl_hari_ini = date('Y-m-d');

// Ringkasan status untuk HARI INI saja
$stmt = $koneksi->prepare(
    "SELECT status, COUNT(*) AS jumlah
     FROM pendaftaran
     WHERE id_dokter = ? AND tgl_periksa = ?
     GROUP BY status"
);
$stmt->bind_param('ss', $id_dokter, $tgl_hari_ini);
$stmt->execute();
$hasil = $stmt->get_result();

$ringkasanHariIni = ['Pending' => 0, 'ACC' => 0, 'Selesai' => 0, 'Ditolak' => 0];
while ($row = $hasil->fetch_assoc()) {
    $ringkasanHariIni[$row['status']] = (int) $row['jumlah'];
}

// Menunggu diperiksa: SEMUA tanggal (hari ini + jadwal ke depan), status Pending/ACC
$stmtMenunggu = $koneksi->prepare(
    "SELECT COUNT(*) AS jumlah
     FROM pendaftaran
     WHERE id_dokter = ? AND status IN ('Pending', 'ACC')"
);
$stmtMenunggu->bind_param('s', $id_dokter);
$stmtMenunggu->execute();
$totalMenunggu = (int) $stmtMenunggu->get_result()->fetch_assoc()['jumlah'];

echo json_encode([
    'success'        => true,
    'total_hari_ini' => $ringkasanHariIni['Pending'] + $ringkasanHariIni['ACC'] + $ringkasanHariIni['Selesai'],
    'menunggu'       => $totalMenunggu,
    'selesai'        => $ringkasanHariIni['Selesai'],
]);
