<?php
include 'koneksi.php';
include 'helper_no_rm.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../Frontend/pendaftaran.html');
    exit;
}

function kembali($kode) {
    header('Location: ../Frontend/pendaftaran.html?error=' . $kode);
    exit;
}
function ambil($k) {
    $v = trim($_POST[$k] ?? '');
    return $v === '' ? null : $v;
}

$tipe          = ($_POST['tipe_pasien'] ?? '') === 'baru' ? 'baru' : 'lama';
$no_rm         = ambil('no_rm');
$kode_klinik   = ambil('kode_klinik');
$id_dokter     = ambil('id_dokter');
$tgl_periksa   = ambil('tgl_periksa');
$keluhan_utama = ambil('keluhan_utama');

// Kolom tabel pasien yang diisi dari form
$kolomPasien = ['nama_pasien', 'no_ktp', 'tgl_lahir', 'no_telp', 'alamat', 'tempat_lahir', 'jenis_kelamin',
    'no_bpjs', 'agama', 'kewarganegaraan', 'status_kawin', 'pendidikan', 'pekerjaan', 'bahasa',
    'perlu_penerjemah', 'provinsi', 'kota_kab', 'kecamatan', 'kelurahan', 'email', 'gol_darah',
    'pegawai_rs', 'nama_wali', 'hubungan_wali', 'nama_ortu', 'pekerjaan_wali', 'hambatan'];
$pasien = [];
foreach ($kolomPasien as $k) $pasien[$k] = ambil($k);

// Validasi data kunjungan (berlaku untuk pasien lama dan baru)
if (!$kode_klinik || !$id_dokter || !$keluhan_utama || !$tgl_periksa) kembali('empty');
if ($tgl_periksa < date('Y-m-d')) kembali('tanggal');

// Validasi data pasien: hanya pasien baru yang mengirim data lengkap.
// Pasien lama hanya mengirim No. RM (bagian data pasien tidak dikirim dan tidak diubah).
if ($tipe === 'lama') {
    if (!$no_rm) kembali('empty');
} else {
    if (!$pasien['nama_pasien'] || !$pasien['no_ktp'] || !$pasien['tgl_lahir'] || !$pasien['no_telp'] || !$pasien['alamat']) kembali('empty');
    if (!preg_match('/^\d{16}$/', $pasien['no_ktp'])) kembali('ktp');
    if ($pasien['email'] && !filter_var($pasien['email'], FILTER_VALIDATE_EMAIL)) kembali('email');
    if (!in_array($pasien['jenis_kelamin'], ['L', 'P', null], true)) kembali('empty');
}

$diagnosis_awal = ambil('diagnosis_awal');
$instansi       = ambil('instansi');
$sumber_pasien  = ambil('sumber_pasien');

try {
    $koneksi->begin_transaction();

    // 1. Pasien baru: buat No. RM dan simpan data lengkap. Pasien lama: cukup pastikan No. RM ada.
    if ($tipe === 'baru') {
        // Nomor final dihitung ulang di sini (terkunci), bukan memakai angka dari form,
        // karena pendaftar lain bisa saja menyimpan lebih dulu setelah form dibuka.
        $no_rm = nomor_rm_berikutnya($koneksi, true);

        $kol = implode(', ', array_merge(['no_rm'], $kolomPasien));
        $plc = implode(', ', array_fill(0, count($kolomPasien) + 1, '?'));
        $stmt = $koneksi->prepare("INSERT INTO pasien ($kol) VALUES ($plc)");
        $vals = array_merge([$no_rm], array_values($pasien));
        $stmt->bind_param(str_repeat('s', count($vals)), ...$vals);
        $stmt->execute();
    } else {
        $cek = $koneksi->prepare("SELECT no_rm FROM pasien WHERE no_rm = ? FOR UPDATE");
        $cek->bind_param('s', $no_rm);
        $cek->execute();
        if (!$cek->get_result()->fetch_assoc()) {
            $koneksi->rollback();
            kembali('rm');
        }
        // Sengaja tidak ada UPDATE pasien: data pasien lama hanya dibaca, agar kolom
        // yang tidak dikirim form (demografi, wali, dll.) tidak tertimpa NULL.
    }

    // 2. No. urut klinik & no. urut dokter pada tanggal periksa
    $q = $koneksi->prepare("SELECT MAX(no_urut) AS mk, MAX(CASE WHEN id_dokter = ? THEN no_urut_dokter END) AS md
                            FROM pendaftaran WHERE kode_klinik = ? AND tgl_periksa = ? FOR UPDATE");
    $q->bind_param('sss', $id_dokter, $kode_klinik, $tgl_periksa);
    $q->execute();
    $u = $q->get_result()->fetch_assoc();
    $no_urut        = ((int)$u['mk']) + 1;
    $no_urut_dokter = ((int)$u['md']) + 1;

    // 3. No. registrasi: YYMMDD + KodeKlinik + IdDokter + NoUrut (3 digit)
    $no_registrasi = date('ymd', strtotime($tgl_periksa)) . $kode_klinik . $id_dokter . str_pad($no_urut, 3, '0', STR_PAD_LEFT);

    // 4. Simpan pendaftaran (status default 'Pending')
    $status = 'Pending';
    $ins = $koneksi->prepare("INSERT INTO pendaftaran
        (no_registrasi, no_rm, kode_klinik, id_dokter, no_urut, no_urut_dokter, tgl_periksa, keluhan_utama, status, instansi, diagnosis_awal, sumber_pasien)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $ins->bind_param('ssssiissssss', $no_registrasi, $no_rm, $kode_klinik, $id_dokter, $no_urut, $no_urut_dokter,
        $tgl_periksa, $keluhan_utama, $status, $instansi, $diagnosis_awal, $sumber_pasien);
    $ins->execute();

    $koneksi->commit();
    header('Location: ../Frontend/bukti_pendaftaran.php?no_reg=' . urlencode($no_registrasi));
    exit;
} catch (Throwable $e) {
    $koneksi->rollback();
    error_log('Pendaftaran gagal: ' . $e->getMessage());
    kembali('server');
}