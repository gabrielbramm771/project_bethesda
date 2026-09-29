<?php
// Endpoint: GET /Backend/api_dokter_per_klinik.php?kode_klinik=0100
// Balasan: { status, nama_klinik, kode_klinik, dokter: [ {id_dokter, nama_dokter, jadwal:[{hari,jam_mulai,jam_selesai}]} ] }

header('Content-Type: application/json');
include 'koneksi.php';

$kode_klinik = $_GET['kode_klinik'] ?? '';

if ($kode_klinik === '') {
    echo json_encode(['status' => 'error', 'message' => 'Kode klinik kosong']);
    exit;
}

$stmtKlinik = $koneksi->prepare("SELECT nama_klinik FROM klinik WHERE kode_klinik = ?");
$stmtKlinik->bind_param('s', $kode_klinik);
$stmtKlinik->execute();
$klinik = $stmtKlinik->get_result()->fetch_assoc();

$stmt = $koneksi->prepare(
    "SELECT d.id_dokter, d.nama_dokter, jd.hari, jd.jam_mulai, jd.jam_selesai
     FROM dokter d
     LEFT JOIN jadwal_dokter jd ON jd.id_dokter = d.id_dokter
     WHERE d.kode_klinik = ?
     ORDER BY d.nama_dokter ASC,
              FIELD(jd.hari, 'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'),
              jd.jam_mulai ASC"
);
$stmt->bind_param('s', $kode_klinik);
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Kelompokkan baris per dokter (1 dokter bisa punya beberapa jadwal hari)
$dokterMap = [];
foreach ($rows as $r) {
    $id = $r['id_dokter'];
    if (!isset($dokterMap[$id])) {
        $dokterMap[$id] = [
            'id_dokter'   => $id,
            'nama_dokter' => $r['nama_dokter'],
            'jadwal'      => [],
        ];
    }
    if ($r['hari']) {
        $dokterMap[$id]['jadwal'][] = [
            'hari'        => $r['hari'],
            'jam_mulai'   => $r['jam_mulai'],
            'jam_selesai' => $r['jam_selesai'],
        ];
    }
}

echo json_encode([
    'status'      => 'success',
    'kode_klinik' => $kode_klinik,
    'nama_klinik' => $klinik['nama_klinik'] ?? $kode_klinik,
    'dokter'      => array_values($dokterMap),
]);
