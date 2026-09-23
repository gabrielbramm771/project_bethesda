<?php
// ============ BACKEND (alat bantu, dipakai sekali saja) ============
// Jalankan file ini lewat browser: http://localhost/dokter-login-php/backend/buat_hash.php?password=dokter123
// Copy hasilnya, lalu tempel ke kolom "password" di tabel dokter lewat phpMyAdmin.
// Setelah dipakai, sebaiknya file ini dihapus dari server produksi.

$password = $_GET['password'] ?? 'dokter123';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password asli : " . htmlspecialchars($password) . "<br>";
echo "Hash (simpan ini ke kolom password): <br><b>" . $hash . "</b>";
