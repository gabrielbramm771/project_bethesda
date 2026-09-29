<?php
// Endpoint: GET /Backend/api_jadwal_semua.php
// Balasan: { status, data: [ {hari, jam_mulai, jam_selesai, nama_dokter, kode_klinik, nama_klinik} ] }
// Dipakai halaman publik jadwal.html untuk menampilkan jadwal praktek 1 minggu penuh.

header('Content-Type: application/json');
include 'koneksi.php';

$sql = "SELECT jd.hari, jd.jam_mulai, jd.jam_selesai,
               d.nama_dokter, d.kode_klinik, k.nama_klinik
        FROM jadwal_dokter jd
        JOIN dokter d ON d.id_dokter = jd.id_dokter
        JOIN klinik k ON k.kode_klinik = d.kode_klinik
        ORDER BY FIELD(jd.hari, 'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'), jd.jam_mulai ASC";

$hasil = $koneksi->query($sql)->fetch_all(MYSQLI_ASSOC);

echo json_encode(['status' => 'success', 'data' => $hasil]);
