-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 20, 2024 lúc 10:52 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

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
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Công nghệ'),
(2, 'Máy tính'),
(3, 'Ngôn ngữ lập trình'),
(5, 'Thủ thuật'),
(4, 'Tiện ích');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content_path` varchar(255) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `author_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `status` enum('public','hidden') DEFAULT 'public'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `title`, `content_path`, `image_path`, `created_at`, `updated_at`, `author_id`, `category_id`, `status`) VALUES
(1, 'Hello world 1 ', 'posts/6708e8b6527e7.md', 'thumbnails/6708e8b652957.jpg', '2024-10-11 08:58:30', '2024-10-11 08:58:30', 1, NULL, 'public'),
(3, 'Hung test #3', 'posts/6708eb6d3dec9.md', 'thumbnails/image_32.png', '2024-10-11 09:10:05', '2024-10-11 09:10:05', 1, NULL, 'public'),
(4, 'Hung test #3', 'posts/6708ebf69252b.md', 'thumbnails/6708ebf69252b.jpg', '2024-10-11 09:12:22', '2024-10-11 09:12:22', 1, NULL, 'public'),
(5, 'Hung le test #4', 'posts/6708ec2d624a8.md', 'thumbnails/6708ec2d624a8.jpg', '2024-10-11 09:13:17', '2024-10-11 09:13:17', 1, NULL, 'public'),
(6, 'hungle test #5', 'posts/6708ec5f078f4.md', 'thumbnails/6708ec5f078f4.jpg', '2024-10-11 09:14:07', '2024-10-11 09:14:07', 1, NULL, 'public'),
(7, 'thẻ nhớ như cc', 'posts/6708eca34b99f.md', 'thumbnails/6708eca34b99f.jpg', '2024-10-11 09:15:15', '2024-10-11 09:15:15', 1, NULL, 'public'),
(8, 'Hung le test #6', 'posts/6708f40a8d8da.md', 'thumbnails/6708f40a8d8da.jpg', '2024-10-11 09:46:50', '2024-10-11 09:46:50', 1, NULL, 'public'),
(9, 'Hung le test 8', 'posts/6708f4b6bfe46.md', 'thumbnails/6708f4b6bfe46.jpg', '2024-10-11 09:49:42', '2024-10-11 09:49:42', 1, NULL, 'public'),
(10, 'Hung le test #6', 'posts/6708f54eafeb1.md', 'thumbnails/6708f54eafeb1.jpg', '2024-10-11 09:52:14', '2024-10-11 09:52:14', 1, NULL, 'public'),
(11, 'Hungge', 'posts/6708f565c9848.md', 'thumbnails/6708f565c9848.jpg', '2024-10-11 09:52:37', '2024-10-11 09:52:37', 1, NULL, 'public'),
(12, 'The rock', 'posts/6708f68b9307a.md', 'thumbnails/6708f68b9307a.jpg', '2024-10-11 09:57:31', '2024-10-11 09:57:31', 1, NULL, 'public'),
(13, 'Hung le test 9 ', 'posts/6708fec565bab.md', 'thumbnails/6708fec565bab.jpg', '2024-10-11 10:32:37', '2024-10-11 10:32:37', 1, NULL, 'public'),
(14, 'Hung le test #10', 'posts/670902b1b18e8.md', 'thumbnails/670902b1b18e8.jpg', '2024-10-11 10:49:21', '2024-10-11 10:49:21', 1, NULL, 'public'),
(15, 'Canon', 'posts/670d59deb3831.md', 'thumbnails/670d59deb3831.jpg', '2024-10-14 17:50:22', '2024-10-14 17:50:22', 5, NULL, 'public'),
(16, 'Test cdn', 'null', 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', '2024-10-17 03:47:22', '2024-10-17 03:47:22', 1, 1, 'public');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post_statistics`
--

CREATE TABLE `post_statistics` (
  `post_id` int(11) NOT NULL,
  `like_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post_tags`
--

CREATE TABLE `post_tags` (
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'huggawasa', 'admin@example.com', 'elfneverlie', 'admin', '2024-10-11 08:35:01'),
(2, 'lucdeptraia', 'test@gmail.com', 'admin', 'admin', '2024-10-14 03:10:08'),
(3, 'teesst', '', 'hahaha', 'user', '2024-10-14 05:50:13'),
(5, 'gawasana', 'admin@test.com', '$2y$10$peoqV4WNIgJSbgR9fwGJ3eakxOINzHuGsuguFltLA3ZGHiBe8ERG6', 'admin', '2024-10-14 10:48:00');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `idx_post_title` (`title`),
  ADD KEY `idx_post_category` (`category_id`);

--
-- Chỉ mục cho bảng `post_statistics`
--
ALTER TABLE `post_statistics`
  ADD PRIMARY KEY (`post_id`);

--
-- Chỉ mục cho bảng `post_tags`
--
ALTER TABLE `post_tags`
  ADD PRIMARY KEY (`post_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Chỉ mục cho bảng `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `post_statistics`
--
ALTER TABLE `post_statistics`
  ADD CONSTRAINT `post_statistics_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `post_tags`
--
ALTER TABLE `post_tags`
  ADD CONSTRAINT `post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
