<?php
// Menghitung No. RM berikutnya berdasarkan data di tabel pasien.
// Format: RM- + 5 digit (RM-00127 -> RM-00128). Nomor diambil dari angka terbesar yang ada,
// jadi tetap berurutan meskipun ada nomor yang terhapus di tengah.
//
// $kunci = true  -> dipakai di dalam transaksi penyimpanan (FOR UPDATE) agar dua pendaftar
//                   yang menyimpan bersamaan tidak mendapat nomor yang sama.
// $kunci = false -> hanya untuk menampilkan nomor perkiraan di form.

function nomor_rm_berikutnya(mysqli $koneksi, bool $kunci = false): string {
    $sql = "SELECT MAX(CAST(SUBSTRING(no_rm, 4) AS UNSIGNED)) AS terakhir
            FROM pasien WHERE no_rm LIKE 'RM-%'" . ($kunci ? ' FOR UPDATE' : '');
    $baris = $koneksi->query($sql)->fetch_assoc();
    return 'RM-' . str_pad(((int)$baris['terakhir']) + 1, 5, '0', STR_PAD_LEFT);
}