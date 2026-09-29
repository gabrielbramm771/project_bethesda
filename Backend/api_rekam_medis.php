<?php
// ============ BACKEND ============
// Endpoint: GET  /Backend/api_rekam_medis.php?no_registrasi=REG0001
// Endpoint: POST /Backend/api_rekam_medis.php
//           Body (JSON): {
//             no_registrasi, keluhan_utama, rps,
//             rpd_tidak_ada, rpd_hipertensi, rpd_asma, rpd_tbc, rpd_dm, rpd_ginjal, rpd_jantung, (boolean)
//             riwayat_operasi_ada, riwayat_operasi_ket,
//             riwayat_alergi_ada, riwayat_alergi_ket,
//             riwayat_keluarga_ada, riwayat_keluarga_ket,
//             assesment, planning_dokter, diet,
//             diagnosis: [ { kode, nama }, ... ]
//           }

require 'helper_sesi.php';
wajib_login();
require 'koneksi.php';

$id_dokter = $_SESSION['id_dokter'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $no_registrasi = $_GET['no_registrasi'] ?? '';

    $stmt = $koneksi->prepare(
        "SELECT p.no_registrasi, p.tgl_periksa,
                p.keluhan_utama, rm.rps,
                rm.rpd_tidak_ada, rm.rpd_hipertensi, rm.rpd_asma, rm.rpd_tbc, rm.rpd_dm, rm.rpd_ginjal, rm.rpd_jantung,
                rm.riwayat_operasi_ada, rm.riwayat_operasi_ket,
                rm.riwayat_alergi_ada, rm.riwayat_alergi_ket,
                rm.riwayat_keluarga_ada, rm.riwayat_keluarga_ket,
                rm.assesment, rm.planning_dokter, rm.diet,
                ps.no_rm, ps.nama_pasien, ps.tgl_lahir
         FROM pendaftaran p
         JOIN pasien ps ON ps.no_rm = p.no_rm
         LEFT JOIN rekam_medis rm ON rm.no_registrasi = p.no_registrasi
         WHERE p.no_registrasi = ? AND p.id_dokter = ?"
    );
    $stmt->bind_param('ss', $no_registrasi, $id_dokter);
    $stmt->execute();
    $data = $stmt->get_result()->fetch_assoc();

    if (!$data) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Pendaftaran tidak ditemukan']);
        exit;
    }

    // Ambil daftar diagnosis (bisa lebih dari satu baris)
    $stmtDx = $koneksi->prepare("SELECT kode_icd AS kode, nama_diagnosis AS nama FROM rekam_medis_diagnosis WHERE no_registrasi = ?");
    $stmtDx->bind_param('s', $no_registrasi);
    $stmtDx->execute();
    $diagnosis = $stmtDx->get_result()->fetch_all(MYSQLI_ASSOC);

    $data['diagnosis'] = $diagnosis;
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input         = json_decode(file_get_contents('php://input'), true) ?? [];
    $no_registrasi = $input['no_registrasi'] ?? '';
    $keluhan_utama = trim($input['keluhan_utama'] ?? '');
    $rps           = trim($input['rps'] ?? '');

    $rpd_tidak_ada  = !empty($input['rpd_tidak_ada']) ? 1 : 0;
    $rpd_hipertensi = !empty($input['rpd_hipertensi']) ? 1 : 0;
    $rpd_asma       = !empty($input['rpd_asma']) ? 1 : 0;
    $rpd_tbc        = !empty($input['rpd_tbc']) ? 1 : 0;
    $rpd_dm         = !empty($input['rpd_dm']) ? 1 : 0;
    $rpd_ginjal     = !empty($input['rpd_ginjal']) ? 1 : 0;
    $rpd_jantung    = !empty($input['rpd_jantung']) ? 1 : 0;

    $riwayat_operasi_ada  = ($input['riwayat_operasi_ada'] ?? 'Tidak') === 'Ya' ? 'Ya' : 'Tidak';
    $riwayat_operasi_ket  = trim($input['riwayat_operasi_ket'] ?? '');
    $riwayat_alergi_ada   = ($input['riwayat_alergi_ada'] ?? 'Tidak') === 'Ya' ? 'Ya' : 'Tidak';
    $riwayat_alergi_ket   = trim($input['riwayat_alergi_ket'] ?? '');
    $riwayat_keluarga_ada = ($input['riwayat_keluarga_ada'] ?? 'Tidak') === 'Ya' ? 'Ya' : 'Tidak';
    $riwayat_keluarga_ket = trim($input['riwayat_keluarga_ket'] ?? '');

    $assesment       = trim($input['assesment'] ?? '');
    $planning_dokter = trim($input['planning_dokter'] ?? '');
    $diet            = trim($input['diet'] ?? '');

    $diagnosis = is_array($input['diagnosis'] ?? null) ? $input['diagnosis'] : [];

    if ($no_registrasi === '' || $rps === '') {
        echo json_encode(['success' => false, 'message' => 'RPS wajib diisi']);
        exit;
    }

    // Pastikan pendaftaran ini memang milik dokter yang sedang login
    $cek = $koneksi->prepare("SELECT no_registrasi FROM pendaftaran WHERE no_registrasi = ? AND id_dokter = ?");
    $cek->bind_param('ss', $no_registrasi, $id_dokter);
    $cek->execute();
    if (!$cek->get_result()->fetch_assoc()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Pendaftaran tidak ditemukan']);
        exit;
    }

    // Simpan/update data utama rekam medis
    $stmt = $koneksi->prepare(
        "INSERT INTO rekam_medis (
            no_registrasi, keluhan_utama, rps,
            rpd_tidak_ada, rpd_hipertensi, rpd_asma, rpd_tbc, rpd_dm, rpd_ginjal, rpd_jantung,
            riwayat_operasi_ada, riwayat_operasi_ket,
            riwayat_alergi_ada, riwayat_alergi_ket,
            riwayat_keluarga_ada, riwayat_keluarga_ket,
            assesment, planning_dokter, diet
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            keluhan_utama = VALUES(keluhan_utama),
            rps = VALUES(rps),
            rpd_tidak_ada = VALUES(rpd_tidak_ada),
            rpd_hipertensi = VALUES(rpd_hipertensi),
            rpd_asma = VALUES(rpd_asma),
            rpd_tbc = VALUES(rpd_tbc),
            rpd_dm = VALUES(rpd_dm),
            rpd_ginjal = VALUES(rpd_ginjal),
            rpd_jantung = VALUES(rpd_jantung),
            riwayat_operasi_ada = VALUES(riwayat_operasi_ada),
            riwayat_operasi_ket = VALUES(riwayat_operasi_ket),
            riwayat_alergi_ada = VALUES(riwayat_alergi_ada),
            riwayat_alergi_ket = VALUES(riwayat_alergi_ket),
            riwayat_keluarga_ada = VALUES(riwayat_keluarga_ada),
            riwayat_keluarga_ket = VALUES(riwayat_keluarga_ket),
            assesment = VALUES(assesment),
            planning_dokter = VALUES(planning_dokter),
            diet = VALUES(diet)"
    );
    $stmt->bind_param(
        'sssiiiiiiisssssssss',
        $no_registrasi, $keluhan_utama, $rps,
        $rpd_tidak_ada, $rpd_hipertensi, $rpd_asma, $rpd_tbc, $rpd_dm, $rpd_ginjal, $rpd_jantung,
        $riwayat_operasi_ada, $riwayat_operasi_ket,
        $riwayat_alergi_ada, $riwayat_alergi_ket,
        $riwayat_keluarga_ada, $riwayat_keluarga_ket,
        $assesment, $planning_dokter, $diet
    );
    $stmt->execute();

    // Ganti seluruh daftar diagnosis: hapus yang lama, masukkan yang baru
    $hapus = $koneksi->prepare("DELETE FROM rekam_medis_diagnosis WHERE no_registrasi = ?");
    $hapus->bind_param('s', $no_registrasi);
    $hapus->execute();

    $insertDx = $koneksi->prepare("INSERT INTO rekam_medis_diagnosis (no_registrasi, kode_icd, nama_diagnosis) VALUES (?, ?, ?)");
    foreach ($diagnosis as $dx) {
        $kode = trim($dx['kode'] ?? '');
        $nama = trim($dx['nama'] ?? '');
        if ($kode === '' && $nama === '') {
            continue; // lewati baris kosong
        }
        $insertDx->bind_param('sss', $no_registrasi, $kode, $nama);
        $insertDx->execute();
    }

    // Tandai pendaftarannya selesai
    $stmt = $koneksi->prepare("UPDATE pendaftaran SET status = 'Selesai' WHERE no_registrasi = ? AND id_dokter = ?");
    $stmt->bind_param('ss', $no_registrasi, $id_dokter);
    $stmt->execute();

    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Metode tidak didukung']);
