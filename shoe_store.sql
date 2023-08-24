-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 24, 2023 lúc 03:27 PM
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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_account_status`
--

CREATE TABLE `shoe_account_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_category`
--

CREATE TABLE `shoe_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_color`
--

CREATE TABLE `shoe_color` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `id_account` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_decentralization`
--

CREATE TABLE `shoe_decentralization` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_image_customer`
--

CREATE TABLE `shoe_image_customer` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_image_product`
--

CREATE TABLE `shoe_image_product` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_order`
--

CREATE TABLE `shoe_order` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `order_date` datetime NOT NULL,
  `total_price` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `total_quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Cấu trúc bảng cho bảng `shoe_product`
--

CREATE TABLE `shoe_product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `manufacturer_id` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_product_colors`
--

CREATE TABLE `shoe_product_colors` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_product_size`
--

CREATE TABLE `shoe_product_size` (
  `product_size_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `size_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shoe_size`
--

CREATE TABLE `shoe_size` (
  `id` int(11) NOT NULL,
  `size_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Chỉ mục cho bảng `shoe_image_customer`
--
ALTER TABLE `shoe_image_customer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_customer_id` (`customer_id`);

--
-- Chỉ mục cho bảng `shoe_image_product`
--
ALTER TABLE `shoe_image_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `image_product` (`product_id`),
  ADD KEY `image_color` (`color_id`);

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
  ADD KEY `order_items_ibfk_1` (`order_id`),
  ADD KEY `order_items_ibfk_2` (`product_id`),
  ADD KEY `order_items_ibfk_3` (`color_id`),
  ADD KEY `order_items_ibfk_4` (`size_id`);

--
-- Chỉ mục cho bảng `shoe_product`
--
ALTER TABLE `shoe_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `manufacturer_id` (`manufacturer_id`);

--
-- Chỉ mục cho bảng `shoe_product_colors`
--
ALTER TABLE `shoe_product_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_colors_ibfk_1` (`product_id`),
  ADD KEY `product_colors_ibfk_2` (`color_id`);

--
-- Chỉ mục cho bảng `shoe_product_size`
--
ALTER TABLE `shoe_product_size`
  ADD PRIMARY KEY (`product_size_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `size_id` (`size_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_account_status`
--
ALTER TABLE `shoe_account_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_category`
--
ALTER TABLE `shoe_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_color`
--
ALTER TABLE `shoe_color`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_customer`
--
ALTER TABLE `shoe_customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_decentralization`
--
ALTER TABLE `shoe_decentralization`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_image_customer`
--
ALTER TABLE `shoe_image_customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_image_product`
--
ALTER TABLE `shoe_image_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_manufacturer`
--
ALTER TABLE `shoe_manufacturer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_product_colors`
--
ALTER TABLE `shoe_product_colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shoe_size`
--
ALTER TABLE `shoe_size`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
-- Các ràng buộc cho bảng `shoe_customer`
--
ALTER TABLE `shoe_customer`
  ADD CONSTRAINT `shoe_customer_ibfk_1` FOREIGN KEY (`id_account`) REFERENCES `shoe_account` (`id`);

--
-- Các ràng buộc cho bảng `shoe_image_customer`
--
ALTER TABLE `shoe_image_customer`
  ADD CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `shoe_customer` (`id`);

--
-- Các ràng buộc cho bảng `shoe_image_product`
--
ALTER TABLE `shoe_image_product`
  ADD CONSTRAINT `image_color` FOREIGN KEY (`color_id`) REFERENCES `shoe_color` (`id`),
  ADD CONSTRAINT `image_product` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`);

--
-- Các ràng buộc cho bảng `shoe_order`
--
ALTER TABLE `shoe_order`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `shoe_account` (`id`);

--
-- Các ràng buộc cho bảng `shoe_order_detail`
--
ALTER TABLE `shoe_order_detail`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `shoe_order` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `shoe_color` (`id`),
  ADD CONSTRAINT `order_items_ibfk_4` FOREIGN KEY (`size_id`) REFERENCES `shoe_size` (`id`);

--
-- Các ràng buộc cho bảng `shoe_product`
--
ALTER TABLE `shoe_product`
  ADD CONSTRAINT `shoe_product_ibfk_1` FOREIGN KEY (`manufacturer_id`) REFERENCES `shoe_manufacturer` (`id`);

--
-- Các ràng buộc cho bảng `shoe_product_colors`
--
ALTER TABLE `shoe_product_colors`
  ADD CONSTRAINT `product_colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`),
  ADD CONSTRAINT `product_colors_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `shoe_color` (`id`);

--
-- Các ràng buộc cho bảng `shoe_product_size`
--
ALTER TABLE `shoe_product_size`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `shoe_product` (`id`),
  ADD CONSTRAINT `product_sizes_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `shoe_size` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
