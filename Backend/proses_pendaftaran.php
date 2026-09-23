<?php
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $no_rm         = $_POST['no_rm'] ?? '';
    $kode_klinik   = $_POST['kode_klinik'] ?? '';
    $id_dokter     = $_POST['id_dokter'] ?? '';
    $keluhan_utama = $_POST['keluhan_utama'] ?? '';
    $tgl_periksa   = date('Y-m-d');

    // Validasi data kosong (Redirect dengan parameter error jika ada yang kosong)
    if (empty($no_rm) || empty($kode_klinik) || empty($id_dokter)|| empty($keluhan_utama)) {
        header("Location: ../frontend/pendaftaran.html?error=empty");
        exit;
    }

    // 1. Hitung No. Urut terbaru
    $stmt_urut = $koneksi->prepare("SELECT MAX(no_urut) as max_urut FROM pendaftaran WHERE kode_klinik = ? AND tgl_periksa = ?");
    $stmt_urut->bind_param("ss", $kode_klinik, $tgl_periksa);
    $stmt_urut->execute();
    $res_urut  = $stmt_urut->get_result()->fetch_assoc();
    $no_urut   = ($res_urut['max_urut']) ? $res_urut['max_urut'] + 1 : 1;

    // 2. Format No. Registrasi: YYMMDD + KodeKlinik + IdDokter + NoUrut (3 digit)
    $tgl_format    = date('ymd'); 
    $no_urut_pad   = str_pad($no_urut, 3, '0', STR_PAD_LEFT);
    $no_registrasi = $tgl_format . $kode_klinik . $id_dokter . $no_urut_pad;

    // 3. Simpan ke database dengan status default 'Pending'
    $status = 'Pending';
    $stmt_insert = $koneksi->prepare("INSERT INTO pendaftaran (no_registrasi, no_rm, kode_klinik, id_dokter, no_urut, tgl_periksa, keluhan_utama, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt_insert->bind_param("ssssisss", $no_registrasi, $no_rm, $kode_klinik, $id_dokter, $no_urut, $tgl_periksa, $keluhan_utama, $status);

    if ($stmt_insert->execute()) {
        // DIRECT REDIRECT: Mengarahkan langsung ke halaman bukti tanpa alert()
        header("Location: ../frontend/bukti_pendaftaran.php?no_reg=" . $no_registrasi);
        exit;
    } else {
        echo "Gagal menyimpan pendaftaran: " . $koneksi->error;
    }
}
?>