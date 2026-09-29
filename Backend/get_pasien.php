<?php
header('Content-Type: application/json');
include 'koneksi.php';

$no_rm = $_GET['no_rm'] ?? '';

if (empty($no_rm)) {
    echo json_encode(['status' => 'error', 'message' => 'No. RM wajib diisi']);
    exit;
}

$stmt = $koneksi->prepare("SELECT * FROM pasien WHERE no_rm = ?");
$stmt->bind_param("s", $no_rm);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(['status' => 'success', 'data' => $row]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Pasien tidak ditemukan']);
}
?>