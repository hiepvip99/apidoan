-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 22, 2023 lúc 02:28 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `shoe_store`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_account`
--

CREATE TABLE `shoe_account` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `decentralization_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_account`
--

INSERT INTO `shoe_account` (`id`, `username`, `password`, `decentralization_id`, `status_id`) VALUES
(2, 'admin', 'admin1234', 1, 1),
(3, 'user', 'user4321', 2, 1),
(4, 'abcdef', 'aaaaaaaa', 2, 2),
(8, 'testlancuoi', '12345678', 2, 1),
(16, 'taikhoantest', '12345678', 2, 1),
(17, 'test2test2', 'test2test2', 1, 2),
(18, '2test2test2', '2test2test2', 2, 2),
(19, 'test2test2test2', 'test2test2test2', 1, 2),
(20, 'dangtest1', 'dangtest1', 2, 2),
(21, 'dangtest1dangtest1', 'dangtest1dangtest1', 1, 2),
(22, 'taikhoanvip', 'taikhoanvip', 1, 1),
(23, 'userz', '12345678', 2, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_account_status`
--

CREATE TABLE `shoe_account_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_account_status`
--

INSERT INTO `shoe_account_status` (`id`, `name`) VALUES
(1, 'Active'),
(2, 'Locked');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_cart`
--

CREATE TABLE `shoe_cart` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  `size_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_cart`
--

INSERT INTO `shoe_cart` (`id`, `account_id`, `product_id`, `color_id`, `size_id`, `quantity`) VALUES
(1, 3, 1, 2, 6, 1),
(2, 3, 1, 1, 3, 1),
(13, 23, 2, 5, 4, 12),
(18, 23, 12, 2, 1, 3),
(20, 23, 1, 1, 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_category`
--

CREATE TABLE `shoe_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_category`
--

INSERT INTO `shoe_category` (`id`, `name`) VALUES
(1, 'Giầy thể thao'),
(5, 'Giầy khiêu vũ'),
(7, 'Giầy cao gót'),
(8, 'Giầy lười'),
(9, 'Giầy tây'),
(10, 'Dép nam'),
(11, 'Giầy sapo'),
(12, 'Giày boot'),
(13, 'Giầy trẻ em'),
(14, 'Giày điều dưỡng'),
(15, 'Giày đi mưa'),
(16, 'Dép nữ'),
(17, 'Giày đá bóng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_color`
--

CREATE TABLE `shoe_color` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color_code` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_color`
--

INSERT INTO `shoe_color` (`id`, `name`, `color_code`) VALUES
(1, 'Trắng', 'FFFFFF'),
(2, 'Đen', '000000'),
(3, 'Xám', '808080'),
(5, 'Nâu', '993300'),
(7, 'Xanh lá', '008000'),
(8, 'Xanh dương', '0000FF'),
(9, 'Cam đậm', 'FF8C00'),
(10, 'Cam', 'FFA500'),
(11, 'Xanh lá mạ', 'B1E232'),
(12, 'Xanh, Xám và Trắng', '00398F'),
(13, 'Đỏ, Xám và Trắng', '7A0100'),
(14, 'Xanh than', '4990AD'),
(15, 'Đỏ và Trắng', 'B93649'),
(16, 'Xanh và Trắng', '4C99C8'),
(17, 'Xanh than đậm', '161723'),
(18, 'Xanh lá mạ đậm', '4E5E39'),
(19, 'Hồng', 'FF00FF'),
(20, 'Đỏ', 'D87E81');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_customer`
--

CREATE TABLE `shoe_customer` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `date_of_birth` date NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `id_account` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `notification_token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_customer`
--

INSERT INTO `shoe_customer` (`id`, `name`, `phone_number`, `date_of_birth`, `email`, `id_account`, `image`, `address`, `notification_token`) VALUES
(1, 'Le chi hiep', '0328888445', '2001-08-23', 'fidevang6@gmail.com', 23, 'api/image/1700880677067-221238440.png', '[\"Triều khúc, Thanh  xuân, Hà nội\"]', 'dE1cYOCLTW6Aw2ixMmpmDj:APA91bFh_T0D8b-fSVJdqUVrDCtjAY-uDjL-4-4HgP1jNGTSpz4ww2pYZ0xLl6GEg8CDlf32O_TRRG3CcVV6Jc3t3syE5p7DhJ4nU6LmHgdvLEDEx48lkWKcoBENwUzSlwXVsrog6UgW');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_decentralization`
--

CREATE TABLE `shoe_decentralization` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_decentralization`
--

INSERT INTO `shoe_decentralization` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'User');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_discount`
--

CREATE TABLE `shoe_discount` (
  `code` varchar(255) NOT NULL,
  `discount` int(11) NOT NULL,
  `expiration_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_discount`
--

INSERT INTO `shoe_discount` (`code`, `discount`, `expiration_date`) VALUES
('GIAM150K', 150000, '2023-10-28 22:05:00'),
('GIAM50K', 50000, '2024-01-01 15:39:01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_discount_customer`
--

CREATE TABLE `shoe_discount_customer` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `discount_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_favorite`
--

CREATE TABLE `shoe_favorite` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_favorite`
--

INSERT INTO `shoe_favorite` (`id`, `account_id`, `product_id`) VALUES
(1, 3, 1),
(2, 3, 5),
(3, 23, 16);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_manufacturer`
--

CREATE TABLE `shoe_manufacturer` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_manufacturer`
--

INSERT INTO `shoe_manufacturer` (`id`, `name`) VALUES
(1, 'Nike'),
(2, 'Adidas'),
(3, 'Puma'),
(4, 'New Balance'),
(8, 'Converse'),
(9, 'Reebok'),
(10, 'Skechers'),
(11, 'Asic'),
(12, 'Supreme'),
(13, 'Valentino'),
(14, 'Balenciaga'),
(15, 'Vans');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_notification`
--

CREATE TABLE `shoe_notification` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_notification`
--

INSERT INTO `shoe_notification` (`id`, `account_id`, `title`, `content`, `timestamp`) VALUES
(1, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 2 đã có cập nhật mới', '2023-11-24 15:06:00'),
(2, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 3 đã có cập nhật mới', '2023-11-25 02:31:58'),
(3, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 1 đã có cập nhật mới', '2023-11-25 03:21:50'),
(4, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 4 đã có cập nhật mới', '2023-11-29 10:17:48'),
(5, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 4 đã có cập nhật mới', '2023-11-29 10:18:00'),
(6, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 2 đã có cập nhật mới', '2023-12-02 03:12:58'),
(7, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 2 đã có cập nhật mới', '2023-12-02 03:13:06'),
(8, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 3 đã có cập nhật mới', '2023-12-03 09:11:09'),
(9, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 12 đã có cập nhật mới', '2023-12-03 09:35:23'),
(10, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 7 đã có cập nhật mới', '2023-12-03 09:35:30'),
(11, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 11 đã có cập nhật mới', '2023-12-03 09:35:43'),
(12, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 8 đã có cập nhật mới', '2023-12-03 09:36:27'),
(13, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 9 đã có cập nhật mới', '2023-12-03 09:40:35'),
(14, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 10 đã có cập nhật mới', '2023-12-03 09:41:35'),
(15, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 6 đã có cập nhật mới', '2023-12-03 09:43:11'),
(16, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 5 đã có cập nhật mới', '2023-12-03 09:45:04'),
(17, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 13 đã có cập nhật mới', '2023-12-03 09:46:57'),
(18, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 14 đã có cập nhật mới', '2023-12-10 09:13:05'),
(19, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 15 đã có cập nhật mới', '2023-12-10 09:13:12'),
(20, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 16 đã có cập nhật mới', '2023-12-10 09:13:21'),
(21, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 17 đã có cập nhật mới', '2023-12-10 09:13:26'),
(22, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 4 đã có cập nhật mới', '2023-12-14 02:05:20'),
(23, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 18 đã có cập nhật mới', '2023-12-14 02:05:29'),
(24, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 18 đã có cập nhật mới', '2023-12-14 02:05:33'),
(25, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 18 đã có cập nhật mới', '2023-12-14 02:05:37'),
(26, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 21 đã có cập nhật mới', '2023-12-14 02:05:52'),
(27, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 21 đã có cập nhật mới', '2023-12-14 02:05:55'),
(28, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 21 đã có cập nhật mới', '2023-12-14 02:06:00'),
(29, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 22 đã có cập nhật mới', '2023-12-14 04:00:05'),
(30, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 22 đã có cập nhật mới', '2023-12-14 04:00:26'),
(31, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 23 đã có cập nhật mới', '2023-12-18 08:12:48'),
(32, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 23 đã có cập nhật mới', '2023-12-18 08:12:56'),
(33, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 23 đã có cập nhật mới', '2023-12-18 08:13:01'),
(34, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 20 đã có cập nhật mới', '2023-12-18 08:14:02'),
(35, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 20 đã có cập nhật mới', '2023-12-18 08:14:14'),
(36, 23, 'Đơn hàng của bạn đã có cập nhật', 'Đơn hàng có mã là: 20 đã có cập nhật mới', '2023-12-18 08:14:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_order`
--

CREATE TABLE `shoe_order` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `order_date` datetime NOT NULL,
  `total_price` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `total_quantity` int(11) NOT NULL,
  `payment_methods` varchar(255) DEFAULT NULL,
  `delivery_address` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_order`
--

INSERT INTO `shoe_order` (`id`, `account_id`, `order_date`, `total_price`, `status_id`, `total_quantity`, `payment_methods`, `delivery_address`, `note`) VALUES
(1, 23, '2023-11-24 21:19:55', 4258000, 4, 2, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(2, 23, '2023-11-24 22:05:04', 10477947, 8, 3, 'Thanh toán khi nhận hàng', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(3, 23, '2023-11-25 09:27:46', 2929000, 6, 1, 'Thanh toán khi nhận hàng', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(4, 23, '2023-11-29 17:17:29', 1909000, 4, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(5, 23, '2023-12-02 10:33:53', 2929000, 5, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(6, 23, '2023-12-02 10:34:59', 2929000, 5, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(7, 23, '2023-12-02 10:41:02', 5858000, 5, 2, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(8, 23, '2023-12-03 16:22:32', 3369000, 5, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(9, 23, '2023-12-03 16:24:20', 3369000, 5, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(10, 23, '2023-12-03 16:25:24', 2929000, 5, 1, 'Thanh toán khi nhận hàng', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(11, 23, '2023-12-03 16:26:30', 3369000, 5, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(12, 23, '2023-12-03 16:27:04', 3369000, 5, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(13, 23, '2023-12-03 16:46:49', 3519000, 5, 1, 'Thanh toán khi nhận hàng', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(14, 23, '2023-12-10 16:00:02', 1909000, 5, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(15, 23, '2023-12-10 16:04:34', 1909000, 5, 1, 'Thanh toán khi nhận hàng', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(16, 23, '2023-12-10 16:04:41', 1909000, 5, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(17, 23, '2023-12-10 16:11:10', 1909000, 5, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(18, 23, '2023-12-10 16:13:42', 2929000, 4, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(19, 23, '2023-12-10 16:14:14', 2929000, 1, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(20, 23, '2023-12-10 16:15:35', 2929000, 4, 1, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(21, 23, '2023-12-14 08:38:42', 3239000, 4, 1, 'Thanh toán khi nhận hàng', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(22, 23, '2023-12-14 10:59:14', 14869043, 7, 7, 'Thanh toán qua Qr', 'Triều khúc, Thanh  xuân, Hà nội', NULL),
(23, 23, '2023-12-18 15:12:16', 3519000, 4, 1, 'Thanh toán khi nhận hàng', 'Triều khúc, Thanh  xuân, Hà nội', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_order_detail`
--

CREATE TABLE `shoe_order_detail` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  `size_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_order_detail`
--

INSERT INTO `shoe_order_detail` (`id`, `order_id`, `product_id`, `color_id`, `size_id`, `quantity`) VALUES
(1, 1, 1, 1, 3, 1),
(2, 1, 5, 2, 3, 1),
(3, 2, 4, 13, 4, 3),
(4, 3, 1, 2, 5, 1),
(5, 4, 13, 2, 3, 1),
(6, 5, 1, 1, 3, 1),
(7, 6, 1, 1, 3, 1),
(8, 7, 1, 1, 6, 2),
(9, 8, 2, 5, 4, 1),
(10, 9, 2, 5, 4, 1),
(11, 10, 1, 1, 3, 1),
(12, 11, 2, 5, 4, 1),
(13, 12, 2, 5, 4, 1),
(14, 13, 3, 1, 3, 1),
(15, 14, 13, 2, 1, 1),
(16, 15, 13, 2, 1, 1),
(17, 16, 13, 2, 1, 1),
(18, 17, 13, 2, 1, 1),
(19, 18, 1, 1, 3, 1),
(20, 19, 1, 1, 3, 1),
(21, 20, 1, 1, 3, 1),
(22, 21, 14, 10, 1, 1),
(23, 22, 12, 11, 1, 7),
(24, 23, 3, 1, 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_order_history_status`
--

CREATE TABLE `shoe_order_history_status` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `changed_time` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_order_status`
--

CREATE TABLE `shoe_order_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_order_status`
--

INSERT INTO `shoe_order_status` (`id`, `name`) VALUES
(1, 'Chờ xác nhận'),
(2, 'Chờ vận chuyển'),
(3, 'Đang giao'),
(4, 'Đã giao'),
(5, 'Đã hủy'),
(6, 'Trả hàng'),
(7, 'Yêu cầu hoàn tiền'),
(8, 'Đã hoàn tiền');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_product`
--

CREATE TABLE `shoe_product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `manufacturer_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_product`
--

INSERT INTO `shoe_product` (`id`, `name`, `manufacturer_id`, `category_id`, `gender`, `description`) VALUES
(1, 'Nike Air Force', 1, 1, 'Nam', 'Sự rạng rỡ vẫn tồn tại trong Nike Air Force 1 \"07, phiên bản bóng rổ nguyên bản mang đến sự thay đổi mới mẻ về những gì bạn biết rõ nhất: lớp phủ được khâu bền, lớp hoàn thiện gọn gàng và lượng đèn flash hoàn hảo giúp bạn tỏa sáng.'),
(2, 'Air Jordan 1 Low SE', 1, 1, 'Nam', ''),
(3, 'Nike Air Max 90', 1, 1, 'Nam', ''),
(4, 'Jordan Stadium 90', 1, 1, 'Nam', ''),
(5, 'Jordan Play', 1, 10, 'Nam', ''),
(6, 'Nike Tanjun EasyOn', 1, 1, 'Nam', ''),
(12, 'Jordan Sophia', 1, 16, 'Nữ', 'Thoải mái sang trọng là điều bắt buộc đối với tủ quần áo mùa đông của bạn và giày dép cũng không ngoại lệ. Những slide luxe này có dây đai gối, chéo chéo được lót bằng vải, cảm thấy mềm mại trên da của bạn. Đệm không khí và một nền tảng nhỏ cung cấp cho b'),
(13, 'Nike Tanjun', 1, 1, 'Nữ', 'Quên sự cường điệu. Nike Tanjun mang đến cho bạn sự đơn giản nhất. Được làm từ ít nhất 20% nội dung tái chế và với dây polyester tái chế 100%, không có chi tiết nào bị bỏ qua trên cái này. Nhẹ. Thoáng đãng. Thoải mái. Đây chỉ là những từ. Giày này là tất '),
(14, 'Nike Dunk Low Twist', 1, 1, 'Nữ', 'Biểu tượng B-bóng thập niên 80 trở lại với các chi tiết cổ điển và sự trở lại của sự khó khăn. Kênh phong cách cổ điển trở lại đường phố, cổ áo đệm và hình bóng cực kỳ khó chịu cho phép bạn chơi trò chơi của mình bất cứ nơi nào thoải mái.'),
(15, 'Nike Go FlyEase', 1, 1, 'Nữ', 'Bỏ dây buộc và ra ngoài. Những cú đá này có công nghệ Flyease mang tính cách mạng của Nike, khiến cho việc trở nên dễ dàng. Với một gót chân mở ra cho một mục hoàn toàn rảnh rỗi, họ rất tuyệt vời cho những người có khả năng di chuyển hạn chế hoặc bất cứ a'),
(16, 'Nike Air Max 1 x Serena Williams Design Crew', 1, 1, 'Nữ', 'Các thành phần hữu cơ đáp ứng các điểm nhấn tương lai trong một thiết kế tôn vinh sự kết hợp của cảnh quan vật lý và kỹ thuật số. Màu sắc đậm và kết cấu hoạt động với sự thoải mái có thể nhìn thấy cho cái nhìn trong tương lai mà bạn đang chờ đợi. Peek bên'),
(17, 'Air Jordan 1 Elevate Low', 1, 1, 'Nữ', 'Tăng đến dịp trong phong cách bay lên. Chiếc giày này làm lại phép thuật ban đầu của một biểu tượng với hình nền duy nhất và hình bóng cắt thấp. Đệm không khí giúp bạn nâng lên, và da bóng mượt với màu sắc tương phản làm tăng thêm sự quan tâm thị giác.'),
(18, 'PREDATOR ACCURACY.1 TURF BOOTS', 2, 17, 'Nam', 'Sản phẩm này được loại trừ khỏi tất cả các khoản giảm giá và ưu đãi quảng cáo.'),
(19, 'RUNFALCON 3.0 SHOES', 2, 1, 'Nữ', 'Giày chạy bộ đệm được làm một phần với vật liệu tái chế.\r\nLace lên để chạy qua công viên hoặc đi bộ đến quán cà phê trong những đôi giày chạy bộ adidas đa năng này. Họ cảm thấy tốt ngay từ khi bạn bước vào, nhờ vào midsole Cushy Cloudfoam. Dệt trên cảm th');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_product_colors`
--

CREATE TABLE `shoe_product_colors` (
  `product_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_product_colors`
--

INSERT INTO `shoe_product_colors` (`product_id`, `color_id`, `price`, `images`) VALUES
(1, 1, 2929000, '[\"api/image/1700489843932-458979452.png\",\"api/image/1700489843937-574882809.png\",\"api/image/1700489843939-360000697.png\",\"api/image/1700489843946-193284868.png\"]'),
(1, 2, 2929000, '[\"api/image/1700490004485-54018423.png\",\"api/image/1700490004493-712811058.png\",\"api/image/1700490004497-725433351.png\",\"api/image/1700490004508-477487977.png\"]'),
(2, 5, 3369000, '[\"api/image/1700490664586-736728966.png\",\"api/image/1700490664595-958488012.png\",\"api/image/1700490664606-311456445.png\",\"api/image/1700490664619-41842781.png\"]'),
(3, 1, 3519000, '[\"api/image/1700576529157-2427230.png\",\"api/image/1700576529159-185254938.png\",\"api/image/1700576529163-348494704.png\",\"api/image/1700576529165-225964583.png\"]'),
(3, 2, 3519000, '[\"api/image/1700576547723-174867904.png\",\"api/image/1700576547729-740717609.png\",\"api/image/1700576547732-356186127.png\",\"api/image/1700576547737-958694944.png\"]'),
(4, 12, 4109000, '[\"api/image/1700577327946-151058261.png\",\"api/image/1700577327952-218042480.png\",\"api/image/1700577327957-296609563.png\",\"api/image/1700577327963-518947240.png\"]'),
(4, 13, 3492649, '[\"api/image/1700577411124-811794401.png\",\"api/image/1700577411185-549237106.png\",\"api/image/1700577411186-58713948.png\",\"api/image/1700577411194-70491501.png\"]'),
(5, 2, 1329000, '[\"api/image/1700581072166-351844475.png\",\"api/image/1700581072178-345134533.png\",\"api/image/1700581072180-274970682.png\",\"api/image/1700581072203-208573958.png\"]'),
(5, 14, 1129649, '[\"api/image/1700581270893-310151987.png\",\"api/image/1700581270908-780186716.png\",\"api/image/1700581270911-218166440.png\",\"api/image/1700581270921-613423875.png\"]'),
(5, 15, 1329000, '[\"api/image/1700581147832-281799344.png\",\"api/image/1700581147833-294167186.png\",\"api/image/1700581147847-182319782.png\",\"api/image/1700581147864-56430748.png\"]'),
(5, 16, 1129649, '[\"api/image/1700579122803-990590399.png\",\"api/image/1700579122806-130623893.png\",\"api/image/1700579122812-468049725.png\",\"api/image/1700579123041-298739088.png\"]'),
(6, 1, 2069000, '[\"api/image/1700711698162-343427669.png\",\"api/image/1700711698167-123885049.png\",\"api/image/1700711698169-97024359.png\",\"api/image/1700711698170-203328037.png\"]'),
(6, 2, 2069000, '[\"api/image/1700711720407-588493792.png\",\"api/image/1700711720421-937588492.png\",\"api/image/1700711720435-921843714.png\",\"api/image/1700711720436-527115657.png\"]'),
(6, 17, 1758649, '[\"api/image/1700711737972-379436260.png\",\"api/image/1700711737988-864527372.png\",\"api/image/1700711737990-262183785.png\",\"api/image/1700711738000-347399089.png\"]'),
(6, 18, 2069000, '[\"api/image/1700711758126-479760811.png\",\"api/image/1700711758135-259525106.png\",\"api/image/1700711758140-432841580.png\",\"api/image/1700711758151-334993300.png\"]'),
(12, 2, 2124149, '[\"api/image/1701096337759-273760961.png\",\"api/image/1701096337765-10845851.png\",\"api/image/1701096337771-995280352.png\",\"api/image/1701096337817-561624462.png\"]'),
(12, 11, 2124149, '[\"api/image/1701096355314-963954512.png\",\"api/image/1701096355320-602375852.png\",\"api/image/1701096355359-299540892.png\",\"api/image/1701096355366-976647517.png\"]'),
(13, 2, 1909000, '[\"api/image/1701096946396-11151100.png\",\"api/image/1701096946401-493980892.png\",\"api/image/1701096946429-469977024.png\",\"api/image/1701096946441-696177924.png\"]'),
(14, 10, 3239000, '[\"api/image/1701098295102-501304065.png\",\"api/image/1701098295111-161530746.png\"]'),
(15, 2, 3829000, '[\"api/image/1701098642192-118816223.png\",\"api/image/1701098642210-626546096.png\"]'),
(16, 9, 4409000, '[\"api/image/1701098902090-607367175.png\",\"api/image/1701098902098-370420503.png\",\"api/image/1701098902101-373933506.png\",\"api/image/1701098902103-193662189.png\"]'),
(17, 8, 3829000, '[\"api/image/1701179102420-895052695.png\",\"api/image/1701179102434-219490790.png\",\"api/image/1701179102444-217591276.png\"]'),
(17, 20, 3829000, '[\"api/image/1701179114548-168554919.png\",\"api/image/1701179114550-108074072.png\",\"api/image/1701179114566-828359710.png\",\"api/image/1701179114571-851003896.png\"]'),
(18, 8, 3500000, '[\"api/image/1701179448540-12150771.png\",\"api/image/1701179448546-652061997.png\",\"api/image/1701179448553-876494678.png\",\"api/image/1701179448556-664791933.png\"]'),
(19, 1, 1800000, '[\"api/image/1701179739740-443921952.png\",\"api/image/1701179739743-569716011.png\",\"api/image/1701179739760-330844010.png\",\"api/image/1701179739762-428318698.png\"]');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_product_size`
--

CREATE TABLE `shoe_product_size` (
  `product_id` int(11) NOT NULL,
  `size_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_product_size`
--

INSERT INTO `shoe_product_size` (`product_id`, `size_id`, `color_id`, `quantity`) VALUES
(1, 3, 1, 6),
(1, 4, 1, 30),
(1, 5, 1, 50),
(1, 6, 1, 70),
(1, 3, 2, 20),
(1, 4, 2, 40),
(1, 5, 2, 60),
(1, 6, 2, 808),
(2, 4, 5, 120),
(2, 5, 5, 105),
(2, 6, 5, 165),
(3, 3, 1, 32),
(3, 4, 1, 55),
(3, 5, 1, 77),
(3, 6, 1, 99),
(3, 3, 2, 22),
(3, 4, 2, 44),
(3, 5, 2, 66),
(3, 6, 2, 88),
(4, 1, 12, 66),
(4, 2, 12, 68),
(4, 3, 12, 70),
(4, 4, 12, 72),
(4, 5, 12, 74),
(4, 6, 12, 76),
(4, 1, 13, 65),
(4, 2, 13, 67),
(4, 3, 13, 69),
(4, 4, 13, 71),
(4, 5, 13, 73),
(4, 6, 13, 75),
(5, 3, 2, 9),
(5, 4, 2, 14),
(5, 5, 2, 55),
(5, 6, 2, 55),
(5, 3, 14, 7),
(5, 4, 14, 11),
(5, 5, 14, 55),
(5, 6, 14, 55),
(5, 3, 15, 9),
(5, 4, 15, 13),
(5, 5, 15, 55),
(5, 6, 15, 55),
(5, 3, 16, 8),
(5, 4, 16, 12),
(5, 5, 16, 55),
(5, 6, 16, 55),
(6, 5, 1, 12),
(6, 6, 1, 54),
(6, 7, 1, 42),
(6, 12, 1, 42),
(6, 13, 1, 34),
(6, 5, 2, 23),
(6, 6, 2, 98),
(6, 7, 2, 10),
(6, 12, 2, 33),
(6, 13, 2, 46),
(6, 5, 17, 44),
(6, 6, 17, 97),
(6, 7, 17, 114),
(6, 12, 17, 34),
(6, 13, 17, 70),
(6, 5, 18, 33),
(6, 6, 18, 99),
(6, 7, 18, 122),
(6, 12, 18, 32),
(6, 13, 18, 67),
(12, 1, 2, 6),
(12, 3, 2, 33),
(12, 5, 2, 10),
(12, 1, 11, 7),
(12, 3, 11, 12),
(12, 5, 11, 54),
(13, 1, 2, 46),
(13, 2, 2, 64),
(13, 3, 2, 65),
(13, 8, 2, 65),
(14, 1, 10, 54),
(14, 2, 10, 8),
(14, 3, 10, 6),
(14, 8, 10, 4),
(15, 1, 2, 33),
(15, 2, 2, 53),
(15, 3, 2, 32),
(15, 4, 2, 22),
(16, 1, 9, 45),
(16, 2, 9, 45),
(16, 3, 9, 45),
(16, 4, 9, 45),
(16, 8, 9, 45),
(16, 9, 9, 45),
(17, 1, 8, 23),
(17, 2, 8, 35),
(17, 3, 8, 55),
(17, 4, 8, 53),
(18, 3, 8, 13),
(18, 4, 8, 13),
(18, 5, 8, 12),
(18, 6, 8, 12),
(19, 3, 1, 133),
(19, 4, 1, 222),
(19, 5, 1, 33),
(19, 6, 1, 44);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_review`
--

CREATE TABLE `shoe_review` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_detail_id` int(11) NOT NULL,
  `rating` float NOT NULL,
  `review_text` text NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_review`
--

INSERT INTO `shoe_review` (`id`, `product_id`, `customer_id`, `order_detail_id`, `rating`, `review_text`, `created_at`) VALUES
(1, 1, 1, 4, 5, 'Sản phẩm tốt màu sắc phù hợp', '2023-11-25 10:16:02'),
(2, 1, 1, 1, 5, 'sp tot', '2023-11-29 17:20:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_size`
--

CREATE TABLE `shoe_size` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_size`
--

INSERT INTO `shoe_size` (`id`, `name`) VALUES
(1, '38'),
(2, '39'),
(3, '40'),
(4, '41'),
(5, '42'),
(6, '43'),
(7, '44'),
(8, '37'),
(9, '36'),
(10, '35'),
(11, '34'),
(12, '45'),
(13, '46'),
(14, '47'),
(15, '48');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `shoe_account`
--
ALTER TABLE `shoe_account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_account_decentralization` (`decentralization_id`),
  ADD KEY `fk_account_status` (`status_id`);

--
-- Chỉ mục cho bảng `shoe_account_status`
--
ALTER TABLE `shoe_account_status`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_cart`
--
ALTER TABLE `shoe_cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `shoe_category`
--
ALTER TABLE `shoe_category`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_color`
--
ALTER TABLE `shoe_color`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_customer`
--
ALTER TABLE `shoe_customer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_email` (`email`),
  ADD KEY `id_account` (`id_account`);

--
-- Chỉ mục cho bảng `shoe_decentralization`
--
ALTER TABLE `shoe_decentralization`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_discount`
--
ALTER TABLE `shoe_discount`
  ADD PRIMARY KEY (`code`);

--
-- Chỉ mục cho bảng `shoe_discount_customer`
--
ALTER TABLE `shoe_discount_customer`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_favorite`
--
ALTER TABLE `shoe_favorite`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_manufacturer`
--
ALTER TABLE `shoe_manufacturer`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_notification`
--
ALTER TABLE `shoe_notification`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_order`
--
ALTER TABLE `shoe_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_ibfk_1` (`account_id`);

--
-- Chỉ mục cho bảng `shoe_order_detail`
--
ALTER TABLE `shoe_order_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_ibfk_3` (`color_id`),
  ADD KEY `order_items_ibfk_4` (`size_id`),
  ADD KEY `fk_order_id` (`order_id`),
  ADD KEY `fk_product_id_order_detail` (`product_id`);

--
-- Chỉ mục cho bảng `shoe_order_history_status`
--
ALTER TABLE `shoe_order_history_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Chỉ mục cho bảng `shoe_order_status`
--
ALTER TABLE `shoe_order_status`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_product`
--
ALTER TABLE `shoe_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `manufacturer_id` (`manufacturer_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `shoe_product_colors`
--
ALTER TABLE `shoe_product_colors`
  ADD UNIQUE KEY `unique_product_color` (`product_id`,`color_id`),
  ADD KEY `product_colors_ibfk_2` (`color_id`);

--
-- Chỉ mục cho bảng `shoe_product_size`
--
ALTER TABLE `shoe_product_size`
  ADD UNIQUE KEY `unique_product_color_size` (`product_id`,`color_id`,`size_id`),
  ADD KEY `size_id` (`size_id`),
  ADD KEY `color_id` (`color_id`);

--
-- Chỉ mục cho bảng `shoe_review`
--
ALTER TABLE `shoe_review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Chỉ mục cho bảng `shoe_size`
--
ALTER TABLE `shoe_size`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `shoe_account`
--
ALTER TABLE `shoe_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `shoe_account_status`
--
ALTER TABLE `shoe_account_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `shoe_cart`
--
ALTER TABLE `shoe_cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `shoe_category`
--
ALTER TABLE `shoe_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `shoe_color`
--
ALTER TABLE `shoe_color`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `shoe_customer`
--
ALTER TABLE `shoe_customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `shoe_decentralization`
--
ALTER TABLE `shoe_decentralization`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `shoe_discount_customer`
--
ALTER TABLE `shoe_discount_customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_favorite`
--
ALTER TABLE `shoe_favorite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `shoe_manufacturer`
--
ALTER TABLE `shoe_manufacturer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `shoe_notification`
--
ALTER TABLE `shoe_notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `shoe_order`
--
ALTER TABLE `shoe_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `shoe_order_detail`
--
ALTER TABLE `shoe_order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `shoe_order_history_status`
--
ALTER TABLE `shoe_order_history_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_order_status`
--
ALTER TABLE `shoe_order_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `shoe_product`
--
ALTER TABLE `shoe_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `shoe_review`
--
ALTER TABLE `shoe_review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `shoe_size`
--
ALTER TABLE `shoe_size`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `shoe_account`
--
ALTER TABLE `shoe_account`
  ADD CONSTRAINT `fk_account_decentralization` FOREIGN KEY (`decentralization_id`) REFERENCES `shoe_decentralization` (`id`),
  ADD CONSTRAINT `fk_account_status` FOREIGN KEY (`status_id`) REFERENCES `shoe_account_status` (`id`);

--
-- Các ràng buộc cho bảng `shoe_cart`
--
ALTER TABLE `shoe_cart`
  ADD CONSTRAINT `shoe_cart_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `shoe_account` (`id`),
  ADD CONSTRAINT `shoe_cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`);

--
-- Các ràng buộc cho bảng `shoe_customer`
--
ALTER TABLE `shoe_customer`
  ADD CONSTRAINT `shoe_customer_ibfk_1` FOREIGN KEY (`id_account`) REFERENCES `shoe_account` (`id`);

--
-- Các ràng buộc cho bảng `shoe_order`
--
ALTER TABLE `shoe_order`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `shoe_account` (`id`);

--
-- Các ràng buộc cho bảng `shoe_order_detail`
--
ALTER TABLE `shoe_order_detail`
  ADD CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `shoe_order` (`id`),
  ADD CONSTRAINT `fk_product_id_order_detail` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `shoe_color` (`id`),
  ADD CONSTRAINT `order_items_ibfk_4` FOREIGN KEY (`size_id`) REFERENCES `shoe_size` (`id`);

--
-- Các ràng buộc cho bảng `shoe_order_history_status`
--
ALTER TABLE `shoe_order_history_status`
  ADD CONSTRAINT `shoe_order_history_status_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `shoe_order` (`id`);

--
-- Các ràng buộc cho bảng `shoe_product`
--
ALTER TABLE `shoe_product`
  ADD CONSTRAINT `shoe_product_ibfk_1` FOREIGN KEY (`manufacturer_id`) REFERENCES `shoe_manufacturer` (`id`),
  ADD CONSTRAINT `shoe_product_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `shoe_category` (`id`);

--
-- Các ràng buộc cho bảng `shoe_product_colors`
--
ALTER TABLE `shoe_product_colors`
  ADD CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`),
  ADD CONSTRAINT `product_colors_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `shoe_color` (`id`);

--
-- Các ràng buộc cho bảng `shoe_product_size`
--
ALTER TABLE `shoe_product_size`
  ADD CONSTRAINT `fk_product_id_size` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`),
  ADD CONSTRAINT `product_sizes_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `shoe_size` (`id`),
  ADD CONSTRAINT `shoe_product_size_ibfk_1` FOREIGN KEY (`color_id`) REFERENCES `shoe_color` (`id`);

--
-- Các ràng buộc cho bảng `shoe_review`
--
ALTER TABLE `shoe_review`
  ADD CONSTRAINT `shoe_review_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`),
  ADD CONSTRAINT `shoe_review_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `shoe_customer` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
