-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th9 17, 2023 lúc 03:59 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.0.28

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
(3, 'user', 'user1234', 2, 1),
(4, 'abc', 'aaaaaaaa', 2, 2),
(8, 'testlancuoi', '12345678', 2, 5);

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
(2, 'Inactive'),
(3, 'Locked'),
(4, 'Pending'),
(5, 'Closed');

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
(12, 'Giày boot');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_color`
--

CREATE TABLE `shoe_color` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_color`
--

INSERT INTO `shoe_color` (`id`, `name`) VALUES
(1, 'Trắng'),
(2, 'Đen');

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
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_customer`
--

INSERT INTO `shoe_customer` (`id`, `name`, `phone_number`, `date_of_birth`, `email`, `id_account`, `image`) VALUES
(1, 'Lê Minh Tú', '1234648979', '1996-10-11', 'leminh444@gmail.com', 3, 'https://api.flutter.dev/flutter/material/DropdownButton-class.html');

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
-- Cấu trúc bảng cho bảng `shoe_image`
--

CREATE TABLE `shoe_image` (
  `id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Cấu trúc bảng cho bảng `shoe_order`
--

CREATE TABLE `shoe_order` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `order_date` datetime NOT NULL,
  `total_price` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `total_quantity` int(11) NOT NULL,
  `payment_methods` varchar(255) NOT NULL DEFAULT 'Thanh toán khi nhận hàng'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_order`
--

INSERT INTO `shoe_order` (`id`, `account_id`, `order_date`, `total_price`, `status_id`, `total_quantity`, `payment_methods`) VALUES
(2, 2, '2023-09-17 20:31:36', 1700000, 1, 3, 'Thanh toán khi nhận hàng'),
(3, 2, '0000-00-00 00:00:00', 1700000, 1, 3, 'Thanh toán khi nhận hàng'),
(4, 2, '2023-09-17 20:31:36', 1700000, 1, 3, 'Thanh toán khi nhận hàng');

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
(1, 'Chưa thanh toán'),
(2, 'Đã thanh toán'),
(3, 'Chờ xác nhận'),
(4, 'Chờ vận chuyển'),
(5, 'Đang giao'),
(6, 'Đã giao'),
(7, 'Đã hủy'),
(8, 'Trả hàng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_product`
--

CREATE TABLE `shoe_product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `manufacturer_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `gender` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shoe_product`
--

INSERT INTO `shoe_product` (`id`, `name`, `manufacturer_id`, `category_id`, `gender`) VALUES
(1, 'Nike InfinityRN 4', 1, 1, 'Nam'),
(15, 'giày chạy bộ Nike_12LF', 1, 1, 'Nam'),
(18, 'Vans Shoe01', 15, 1, 'Nữ'),
(19, 'test them giay', 3, 5, 'Nam');

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
(1, 1, 500000, '[\"api/image/1694790277767-517884376.png\",\"api/image/1694790277779-139123565.png\"]'),
(1, 2, 600000, '[\"api/image/1694790277767-517884376.png\",\"api/image/1694790277779-139123565.png\"]'),
(15, 1, 600000, '[\"api/image/1694790277767-517884376.png\",\"api/image/1694790277779-139123565.png\"]'),
(15, 2, 650000, '[]'),
(18, 1, 99999, '[\"api/image/1694942674470-546520913.png\",\"api/image/1694942674472-181043581.png\",\"api/image/1694942674485-430836773.png\",\"api/image/1694942674498-316670545.png\",\"api/image/1694942674511-288640912.png\",\"api/image/1694942674515-331472194.png\"]'),
(18, 2, 99999, '[\"api/image/1694942847420-212597271.png\",\"api/image/1694942847421-587047810.png\"]'),
(19, 1, 500000, '[\"api/image/1694942649716-30142067.png\"]'),
(19, 2, 600000, NULL);

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
(1, 1, 1, 20),
(1, 2, 1, 66),
(1, 1, 2, 55),
(1, 2, 2, 30),
(15, 1, 1, 15),
(15, 2, 1, 40),
(15, 1, 2, 35),
(15, 2, 2, 20),
(18, 1, 1, 99),
(18, 1, 2, 60),
(19, 1, 1, 20),
(19, 1, 2, 22);

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
  ADD KEY `product_id` (`product_id`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `size_id` (`size_id`);

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
  ADD KEY `id_account` (`id_account`);

--
-- Chỉ mục cho bảng `shoe_decentralization`
--
ALTER TABLE `shoe_decentralization`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_image`
--
ALTER TABLE `shoe_image`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `shoe_manufacturer`
--
ALTER TABLE `shoe_manufacturer`
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
  ADD KEY `order_items_ibfk_2` (`product_id`),
  ADD KEY `order_items_ibfk_3` (`color_id`),
  ADD KEY `order_items_ibfk_4` (`size_id`),
  ADD KEY `fk_order_id` (`order_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `shoe_account_status`
--
ALTER TABLE `shoe_account_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `shoe_cart`
--
ALTER TABLE `shoe_cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_category`
--
ALTER TABLE `shoe_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `shoe_color`
--
ALTER TABLE `shoe_color`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- AUTO_INCREMENT cho bảng `shoe_image`
--
ALTER TABLE `shoe_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_manufacturer`
--
ALTER TABLE `shoe_manufacturer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `shoe_order`
--
ALTER TABLE `shoe_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `shoe_order_detail`
--
ALTER TABLE `shoe_order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_order_status`
--
ALTER TABLE `shoe_order_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `shoe_product`
--
ALTER TABLE `shoe_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `shoe_size`
--
ALTER TABLE `shoe_size`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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
  ADD CONSTRAINT `shoe_cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`),
  ADD CONSTRAINT `shoe_cart_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `shoe_product_colors` (`id`),
  ADD CONSTRAINT `shoe_cart_ibfk_4` FOREIGN KEY (`size_id`) REFERENCES `shoe_product_size` (`product_size_id`);

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
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `shoe_color` (`id`),
  ADD CONSTRAINT `order_items_ibfk_4` FOREIGN KEY (`size_id`) REFERENCES `shoe_size` (`id`);

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
