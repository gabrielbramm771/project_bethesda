-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2026 at 03:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pendaftaran_rs_2`
--

-- --------------------------------------------------------

--
-- Table structure for table `dokter`
--

CREATE TABLE `dokter` (
  `id_dokter` varchar(10) NOT NULL,
  `nama_dokter` varchar(100) NOT NULL,
  `kode_klinik` varchar(10) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dokter`
--

INSERT INTO `dokter` (`id_dokter`, `nama_dokter`, `kode_klinik`, `username`, `password`) VALUES
('0101', 'dr. Budi Santoso, Sp.PD', '0100', 'dr_budi', 'dokter123'),
('0201', 'drg. Siti Aminah', '0200', 'drg_siti', 'dokter123'),
('0301', 'dr. Ani Wijaya, Sp.A', '0300', 'dr_ani', 'dokter123'),
('0401', 'dr. Hendra Kusuma, Sp.M', '0400', 'dr_hendra', 'dokter123'),
('0501', 'dr. Lina Marlina, Sp.THT', '0500', 'dr_lina', 'dokter123');

-- --------------------------------------------------------

--
-- Table structure for table `klinik`
--

CREATE TABLE `klinik` (
  `kode_klinik` varchar(10) NOT NULL,
  `nama_klinik` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `klinik`
--

INSERT INTO `klinik` (`kode_klinik`, `nama_klinik`) VALUES
('0100', 'Poli Penyakit Dalam'),
('0200', 'Poli Gigi'),
('0300', 'Poli Anak'),
('0400', 'Poli Mata'),
('0500', 'Poli THT');

-- --------------------------------------------------------

--
-- Table structure for table `pasien`
--

CREATE TABLE `pasien` (
  `no_rm` varchar(20) NOT NULL,
  `nama_pasien` varchar(100) NOT NULL,
  `no_ktp` varchar(20) NOT NULL,
  `tgl_lahir` date NOT NULL,
  `no_telp` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pasien`
--

INSERT INTO `pasien` (`no_rm`, `nama_pasien`, `no_ktp`, `tgl_lahir`, `no_telp`, `alamat`) VALUES
('RM-00123', 'Ahmad Rizki', '3171012304950001', '1995-04-23', '081234567890', 'Jl. Merdeka No. 12'),
('RM-00124', 'Dewi Lestari', '3171015608980002', '1998-08-16', '089876543210', 'Jl. Mawar No. 45'),
('RM-00125', 'Nama Pasien', '3171012345670001', '2000-01-15', '081234567890', 'Jl. Contoh No. 1'),
('RM-00126', 'Siti Aisyah', '3171015501990003', '1999-05-01', '081298765432', 'Jl. Kenanga No. 8'),
('RM-00127', 'Rudi Hartono', '3171017812880004', '1988-12-07', '085611223344', 'Jl. Anggrek No. 20');

-- --------------------------------------------------------

--
-- Table structure for table `pendaftaran`
--

CREATE TABLE `pendaftaran` (
  `no_registrasi` varchar(50) NOT NULL,
  `no_rm` varchar(20) NOT NULL,
  `kode_klinik` varchar(10) NOT NULL,
  `id_dokter` varchar(10) NOT NULL,
  `no_urut` int(11) NOT NULL,
  `tgl_periksa` date NOT NULL,
  `keluhan_utama` text DEFAULT NULL,
  `status` enum('Pending','ACC','Ditolak','Selesai') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pendaftaran`
--

INSERT INTO `pendaftaran` (`no_registrasi`, `no_rm`, `kode_klinik`, `id_dokter`, `no_urut`, `tgl_periksa`, `keluhan_utama`, `status`, `created_at`) VALUES
('REG-20260915-0101-001', 'RM-00123', '0100', '0101', 1, '2026-09-15', NULL, 'Pending', '2026-09-15 07:24:49'),
('26091701000101001', 'RM-00123', '0100', '0101', 1, '2026-09-17', 'sakit perut', 'Pending', '2026-09-17 15:02:04'),
('26091801000101001', 'RM-00123', '0100', '0101', 1, '2026-09-18', 'Sakit perut ', 'Pending', '2026-09-18 01:08:25'),
('26092001000101001', 'RM-00123', '0100', '0101', 1, '2026-09-20', 'sakit ginjal\r\n', 'Selesai', '2026-09-20 09:29:30'),
('26092001000101002', 'RM-00124', '0100', '0101', 2, '2026-09-20', 'jantung berdebar debar\r\n\r\n', 'Pending', '2026-09-20 09:46:28'),
('26092201000101001', 'RM-00123', '0100', '0101', 1, '2026-09-22', 'asam lambung', 'Pending', '2026-09-22 15:28:53'),
('26092301000101001', 'RM-00124', '0100', '0101', 1, '2026-09-23', 'Asam lambung', 'Pending', '2026-09-22 23:44:03');

-- --------------------------------------------------------

--
-- Table structure for table `rekam_medis`
--

CREATE TABLE `rekam_medis` (
  `no_registrasi` varchar(50) NOT NULL,
  `keluhan_utama` text DEFAULT NULL,
  `rps` text NOT NULL,
  `resep_obat` text DEFAULT NULL,
  `dibuat_pada` timestamp NOT NULL DEFAULT current_timestamp(),
  `diperbarui_pada` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rpd_tidak_ada` tinyint(1) NOT NULL DEFAULT 0,
  `rpd_hipertensi` tinyint(1) NOT NULL DEFAULT 0,
  `rpd_asma` tinyint(1) NOT NULL DEFAULT 0,
  `rpd_tbc` tinyint(1) NOT NULL DEFAULT 0,
  `rpd_dm` tinyint(1) NOT NULL DEFAULT 0,
  `rpd_ginjal` tinyint(1) NOT NULL DEFAULT 0,
  `rpd_jantung` tinyint(1) NOT NULL DEFAULT 0,
  `riwayat_operasi_ada` enum('Ya','Tidak') NOT NULL DEFAULT 'Tidak',
  `riwayat_operasi_ket` varchar(255) DEFAULT NULL,
  `riwayat_alergi_ada` enum('Ya','Tidak') NOT NULL DEFAULT 'Tidak',
  `riwayat_alergi_ket` varchar(255) DEFAULT NULL,
  `riwayat_keluarga_ada` enum('Ya','Tidak') NOT NULL DEFAULT 'Tidak',
  `riwayat_keluarga_ket` varchar(255) DEFAULT NULL,
  `assesment` text DEFAULT NULL,
  `planning_dokter` text DEFAULT NULL,
  `diet` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rekam_medis`
--

INSERT INTO `rekam_medis` (`no_registrasi`, `keluhan_utama`, `rps`, `resep_obat`, `dibuat_pada`, `diperbarui_pada`, `rpd_tidak_ada`, `rpd_hipertensi`, `rpd_asma`, `rpd_tbc`, `rpd_dm`, `rpd_ginjal`, `rpd_jantung`, `riwayat_operasi_ada`, `riwayat_operasi_ket`, `riwayat_alergi_ada`, `riwayat_alergi_ket`, `riwayat_keluarga_ada`, `riwayat_keluarga_ket`, `assesment`, `planning_dokter`, `diet`) VALUES
('26092001000101001', 'Bengkak pada kedua kaki sejak 1 minggu terakhir, disertai mudah lelah dan frekuensi buang air kecil berkurang.', 'Pasien mengeluhkan kedua kaki membengkak sejak ±1 minggu sebelum datang ke rumah sakit. Bengkak dirasakan semakin jelas pada sore hari dan disertai mudah lelah. Pasien juga mengeluhkan frekuensi buang air kecil berkurang dibandingkan biasanya. Tidak terdapat demam. Pasien memiliki riwayat tekanan darah tinggi dan mengaku kurang teratur mengonsumsi obat.', NULL, '2026-09-20 09:45:43', '2026-09-20 09:45:43', 1, 0, 0, 0, 0, 0, 0, 'Tidak', '', 'Tidak', '', 'Tidak', '', 'Penyakit Ginjal Kronis (PGK) dengan edema perifer.', 'pemeriksaan tekanan darah dan tanda vital.\nPemeriksaan laboratorium: ureum, kreatinin, eGFR, elektrolit (Na/K), urinalisis, dan protein urine.\nPemeriksaan darah lengkap.\nUSG ginjal bila diperlukan.\nMemantau jumlah urine dan keseimbangan cairan.\nKontrol tekanan darah secara berkala.\nKonsultasi penyakit dalam/nephrologi sesuai kondisi.\nEdukasi untuk menghindari obat yang berpotensi memperburuk fungsi ginjal, terutama penggunaan NSAID tanpa pengawasan dokter.', 'Batasi garam/makanan tinggi natrium.\nHindari makanan ultra-proses, makanan instan, dan makanan sangat asin.\nAsupan protein disesuaikan dengan stadium PGK dan kondisi pasien.\nJumlah cairan disesuaikan dengan produksi urine dan adanya edema.');

-- --------------------------------------------------------

--
-- Table structure for table `rekam_medis_diagnosis`
--

CREATE TABLE `rekam_medis_diagnosis` (
  `id` int(11) NOT NULL,
  `no_registrasi` varchar(50) NOT NULL,
  `kode_icd` varchar(20) NOT NULL,
  `nama_diagnosis` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pendaftaran`
--
ALTER TABLE `pendaftaran`
  ADD KEY `no_registrasi` (`no_registrasi`);

--
-- Indexes for table `rekam_medis`
--
ALTER TABLE `rekam_medis`
  ADD PRIMARY KEY (`no_registrasi`);

--
-- Indexes for table `rekam_medis_diagnosis`
--
ALTER TABLE `rekam_medis_diagnosis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_diagnosis_pendaftaran` (`no_registrasi`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rekam_medis_diagnosis`
--
ALTER TABLE `rekam_medis_diagnosis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rekam_medis`
--
ALTER TABLE `rekam_medis`
  ADD CONSTRAINT `fk_rekam_medis_pendaftaran` FOREIGN KEY (`no_registrasi`) REFERENCES `pendaftaran` (`no_registrasi`) ON DELETE CASCADE;

--
-- Constraints for table `rekam_medis_diagnosis`
--
ALTER TABLE `rekam_medis_diagnosis`
  ADD CONSTRAINT `fk_diagnosis_pendaftaran` FOREIGN KEY (`no_registrasi`) REFERENCES `pendaftaran` (`no_registrasi`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
