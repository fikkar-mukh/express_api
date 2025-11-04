-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 04 Nov 2025 pada 16.44
-- Versi server: 8.0.30
-- Versi PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_nutech`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `banners`
--

CREATE TABLE `banners` (
  `id` int NOT NULL,
  `banner_name` varchar(255) NOT NULL,
  `banner_image` varchar(255) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `banners`
--

INSERT INTO `banners` (`id`, `banner_name`, `banner_image`, `description`) VALUES
(1, 'Banner 1', 'https://nutech-integrasi.app/dummy1.jpg', 'Lorem Ipsum Dolor sit amet'),
(2, 'Banner 2', 'https://nutech-integrasi.app/dummy2.jpg', 'Lorem Ipsum Dolor sit amet'),
(3, 'Banner 3', 'https://nutech-integrasi.app/dummy3.jpg', 'Lorem Ipsum Dolor sit amet'),
(4, 'Banner 4', 'https://nutech-integrasi.app/dummy4.jpg', 'Lorem Ipsum Dolor sit amet'),
(5, 'Banner 5', 'https://nutech-integrasi.app/dummy5.jpg', 'Lorem Ipsum Dolor sit amet'),
(6, 'Banner 6', 'https://nutech-integrasi.app/dummy6.jpg', 'Lorem Ipsum Dolor sit amet');

-- --------------------------------------------------------

--
-- Struktur dari tabel `services`
--

CREATE TABLE `services` (
  `id` int NOT NULL,
  `service_code` varchar(50) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `service_icon` varchar(255) DEFAULT NULL,
  `service_tarif` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `services`
--

INSERT INTO `services` (`id`, `service_code`, `service_name`, `service_icon`, `service_tarif`) VALUES
(1, 'PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
(2, 'PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
(3, 'PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
(4, 'PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
(5, 'PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
(6, 'MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
(7, 'TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
(8, 'PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
(9, 'VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
(10, 'VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
(11, 'QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
(12, 'ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `transaction_type` enum('TOPUP','PAYMENT') NOT NULL,
  `service_code` varchar(100) DEFAULT NULL,
  `invoice_number` varchar(100) DEFAULT NULL,
  `amount` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id`, `email`, `transaction_type`, `service_code`, `invoice_number`, `amount`, `created_at`) VALUES
(1, 'user@nutech-integrasi.com', 'TOPUP', NULL, NULL, 1500000, '2025-11-04 14:13:19'),
(2, 'user@nutech-integrasi.com', 'PAYMENT', 'PULSA', 'INV-1762266565777', 40000, '2025-11-04 14:29:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `profile_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `balance` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `profile_image`, `password`, `created_at`, `balance`) VALUES
(1, 'user@nutech-integrasi.com', 'OHYAAA', 'edit last name', 'http://localhost:3000/uploads/profile/user_nutech-integrasi_com-1762261414774-602206684.jpeg', '$2b$10$PHR1UF3cwW0.a4sE9MxVG.sDir6UoqnOHPKVvPi/pS3DOz0Yp7fQC', '2025-11-03 16:38:34', 2460000),
(2, 'fikk@gmail.com', 'User', 'Nutech', NULL, '$2b$10$EeAqXytLjOws4JtdiObvfO/qdnTJGlytodYhk0eFzsSEN3GSPakSe', '2025-11-03 16:40:57', 1000000),
(3, 'gogon@gmail.com', 'User', 'Nutech', NULL, '$2b$10$u9xWRhdCnbv8dD0hs6iSsePLY/APr4vowsVwX5K9BYZjF90bOaon.', '2025-11-04 07:22:33', 1000000);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_code` (`service_code`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `services`
--
ALTER TABLE `services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
