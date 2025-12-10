-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2025 at 11:56 AM
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
-- Database: `database_uas_3c_kel6`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_anggota`
--

CREATE TABLE `tbl_anggota` (
  `Id_Anggota` varchar(10) NOT NULL,
  `Nama` varchar(30) NOT NULL,
  `Alamat` varchar(40) NOT NULL,
  `No_hp` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_buku`
--

CREATE TABLE `tbl_buku` (
  `Id_Buku` varchar(10) NOT NULL,
  `Judul_Buku` varchar(100) NOT NULL,
  `ISBN` int(15) NOT NULL,
  `Penulis` varchar(30) NOT NULL,
  `Penerbit` varchar(20) NOT NULL,
  `Tahun_terbit` date NOT NULL,
  `Kategori` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_guru`
--

CREATE TABLE `tbl_guru` (
  `NIP` varchar(30) NOT NULL,
  `Id_Anggota` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_letak_buku`
--

CREATE TABLE `tbl_letak_buku` (
  `Id_Letak` varchar(10) NOT NULL,
  `Rak` varchar(30) NOT NULL,
  `Id_Buku` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_peminjaman`
--

CREATE TABLE `tbl_peminjaman` (
  `Id_Peminjaman` varchar(15) NOT NULL,
  `Id_Anggota` varchar(10) NOT NULL,
  `Id_Buku` varchar(10) NOT NULL,
  `Tgl_pinjam` date NOT NULL,
  `Tgl_kembali` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_siswa`
--

CREATE TABLE `tbl_siswa` (
  `NISN` varchar(20) NOT NULL,
  `Id_Anggota` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_staf_tu`
--

CREATE TABLE `tbl_staf_tu` (
  `NIP_Staf` varchar(25) NOT NULL,
  `Id_Anggota` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_anggota`
--
ALTER TABLE `tbl_anggota`
  ADD PRIMARY KEY (`Id_Anggota`);

--
-- Indexes for table `tbl_buku`
--
ALTER TABLE `tbl_buku`
  ADD PRIMARY KEY (`Id_Buku`);

--
-- Indexes for table `tbl_guru`
--
ALTER TABLE `tbl_guru`
  ADD PRIMARY KEY (`NIP`),
  ADD KEY `Id_Anggota` (`Id_Anggota`);

--
-- Indexes for table `tbl_letak_buku`
--
ALTER TABLE `tbl_letak_buku`
  ADD PRIMARY KEY (`Id_Letak`),
  ADD KEY `Id_Buku` (`Id_Buku`);

--
-- Indexes for table `tbl_peminjaman`
--
ALTER TABLE `tbl_peminjaman`
  ADD PRIMARY KEY (`Id_Peminjaman`),
  ADD KEY `Id_anggota` (`Id_Anggota`),
  ADD KEY `Id_Buku` (`Id_Buku`);

--
-- Indexes for table `tbl_siswa`
--
ALTER TABLE `tbl_siswa`
  ADD PRIMARY KEY (`NISN`),
  ADD KEY `Id_Anggota` (`Id_Anggota`);

--
-- Indexes for table `tbl_staf_tu`
--
ALTER TABLE `tbl_staf_tu`
  ADD PRIMARY KEY (`NIP_Staf`),
  ADD KEY `Id_Anggota` (`Id_Anggota`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
