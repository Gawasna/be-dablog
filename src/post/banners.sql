-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: db:3306
-- Thời gian đã tạo: Th10 08, 2024 lúc 01:03 PM
-- Phiên bản máy phục vụ: 10.4.34-MariaDB-1:10.4.34+maria~ubu2004
-- Phiên bản PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `dablog`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `new` varchar(255) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `banners`
--

INSERT INTO `banners` (`id`, `new`, `create_at`) VALUES
(1, 'https://youtu.be/EdKtOAj8-kU?si=O1RFGdWzzdhJWIIS', '2024-11-08 12:47:09'),
(3, 'https://youtu.be/_tX8DbGv188?si=s8ZtunnjjlYMVnE2', '2024-11-08 12:48:44'),
(4, 'https://i.ytimg.com/vi/lTqhlC0dvm0/maxresdefault.jpg', '2024-11-08 12:50:08'),
(5, 'https://tbib.org/samples/11242/sample_eb160ad69925b4dc20a5c1a0666a5c5ab7f83259.jpg?12611748', '2024-11-08 13:02:43'),
(6, 'https://avatars.mds.yandex.net/i?id=f240a03b7dd2afbc0c1d356b58c307df4f6c3eec37eeec1e-12475759-images-thumbs&n=13', '2024-11-08 13:03:05'),
(7, 'https://i.ytimg.com/vi/6hhQ7n4H310/maxresdefault.jpg', '2024-11-08 13:03:22');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
