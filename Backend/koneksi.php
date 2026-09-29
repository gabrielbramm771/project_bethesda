<?php
// ============ BACKEND ============
// Koneksi ke database MySQL (sesuaikan dengan konfigurasi phpMyAdmin/XAMPP kamu)

$host = 'localhost';
$user = 'root';
$pass = '';
$nama_db = 'pendaftaran_rs_2';

$koneksi = new mysqli($host, $user, $pass, $nama_db);

if ($koneksi->connect_error) {
    die('Koneksi database gagal: ' . $koneksi->connect_error);
}

$koneksi->set_charset('utf8mb4');