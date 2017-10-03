-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- 主機: 127.0.0.1
-- 產生時間： 2017-10-03 10:05:20
-- 伺服器版本: 10.1.26-MariaDB
-- PHP 版本： 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `tc_storage`
--
CREATE DATABASE IF NOT EXISTS `tc_storage` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci;
USE `tc_storage`;

-- --------------------------------------------------------

--
-- 資料表結構 `files`
--

CREATE TABLE `files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `path_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` longtext COLLATE utf8_general_mysql500_ci NOT NULL,
  `mime` tinytext COLLATE utf8_general_mysql500_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- 資料表的匯出資料 `files`
--

INSERT INTO `files` (`id`, `path_id`, `name`, `mime`) VALUES
(1, 1, '算什麼男人.mp4', ''),
(2, 5, 'test.js', ''),
(3, 5, 'test.php', ''),
(4, 5, 'test.py', ''),
(5, 5, 'test.R', ''),
(6, 5, 'test.rb', ''),
(7, 5, 'test.sh', ''),
(8, 5, 'test.bat', ''),
(9, 5, 'test.c', ''),
(10, 5, 'test.class', ''),
(11, 5, 'test.exe', ''),
(12, 5, 'test.go', ''),
(13, 5, 'test.html', ''),
(14, 5, 'test.java', ''),
(15, 6, 'test.json', ''),
(16, 6, 'test.txt', ''),
(17, 3, 'lena.jpg', ''),
(18, 2, '君がくれたもの.mp3', ''),
(19, 2, '김보경 - Suddenly.txt', ''),
(20, 2, 'The Script - Hall of Fame ft. will.i.am.mp3', ''),
(21, 2, '張懸-寶貝.mp3', ''),
(22, 6, 'resume.pdf', ''),
(23, 3, 'IMAG0123.jpg', ''),
(24, 1, '喜歡你.3gp', ''),
(25, 1, '残酷な天使のテーゼ.webm', ''),
(26, 1, 'small.flv', ''),
(27, 1, 'Examplevideo.ogv', ''),
(28, 4, 'Lang.7z', ''),
(29, 4, 'Lang.zip', ''),
(30, 4, 'Test.zip', ''),
(32, 10, '空白檔案(1).txt', ''),
(33, 7, '空白檔案.txt', ''),
(34, 11, '4(1)', ''),
(35, 11, '4', ''),
(36, NULL, '空白檔案', ''),
(37, NULL, '4.txt', ''),
(38, NULL, '4(2)', ''),
(39, 7, '空白檔案(5)', ''),
(40, 2, '張懸-寶貝.lrc', ''),
(41, 2, 'The Script - Hall of Fame ft. will.i.am.lrc', ''),
(43, 2, '김보경 - Suddenly.lrc', ''),
(44, 2, '君がくれたもの.lrc', ''),
(45, NULL, '空白檔案(1)', ''),
(46, 7, '空白檔案(2)', ''),
(47, 7, '空白檔案(3)', ''),
(48, 7, '空白檔案(4)', ''),
(49, 7, '空白檔案(6)', ''),
(50, 7, '空白檔案(7)', ''),
(51, 7, '空白檔案(8)', ''),
(52, 7, '空白檔案(9)', ''),
(53, NULL, '空白檔案(10)', ''),
(54, 7, '空白檔案(11)', ''),
(55, 7, '空白檔案(12)', ''),
(56, 7, '空白檔案(13)', ''),
(57, 7, '空白檔案(14)', ''),
(58, 7, '空白檔案(15)', ''),
(59, 7, '空白檔案(16)', ''),
(60, 7, '空白檔案(17)', ''),
(61, 7, '空白檔案(18)', ''),
(62, 7, '空白檔案(19)', ''),
(63, 7, '空白檔案(20)', ''),
(64, 7, '空白檔案(21)', ''),
(65, 7, '空白檔案(22)', ''),
(66, 7, '空白檔案(23)', ''),
(67, 7, '空白檔案(24)', ''),
(68, 7, '空白檔案(25)', ''),
(69, 7, '空白檔案(26)', ''),
(70, 7, '空白檔案(27)', ''),
(71, 7, '空白檔案(28)', ''),
(72, 7, '空白檔案(29)', ''),
(73, 7, '空白檔案(30)', ''),
(74, 7, '空白檔案(31)', ''),
(75, 7, '空白檔案(32)', ''),
(76, 7, '空白檔案(33)', ''),
(77, 7, '空白檔案(34)', ''),
(78, 7, '空白檔案(35)', ''),
(79, 7, '空白檔案(36)', ''),
(80, 7, '空白檔案(37)', ''),
(81, 7, '空白檔案(38)', ''),
(82, 7, '空白檔案(39)', ''),
(83, 7, '空白檔案(40)', ''),
(84, 7, '空白檔案(41)', ''),
(85, 7, '空白檔案(42)', ''),
(86, 7, '空白檔案(43)', ''),
(88, 12, 'fireworks.swf', ''),
(89, 12, '星塔爭霸.swf', ''),
(90, 12, '楓之谷MapleStory.swf', ''),
(91, 12, '新英文字母鍵盤測驗模組不分大小寫V2_4.swf', ''),
(92, 12, '火柴人格鬥.swf', ''),
(93, 7, '空白檔案(45)', ''),
(95, 8, '這是測試', ''),
(100, 7, '空白檔案(44)', '');

-- --------------------------------------------------------

--
-- 資料表結構 `folders`
--

CREATE TABLE `folders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `path_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` longtext COLLATE utf8_general_mysql500_ci NOT NULL,
  `descendant` tinyint(1) NOT NULL DEFAULT '0' COMMENT '資料夾底下是否有檔案',
  `size` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- 資料表的匯出資料 `folders`
--

INSERT INTO `folders` (`id`, `path_id`, `name`, `descendant`, `size`, `ctime`, `atime`, `mtime`) VALUES
(1, 13, '影片', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(2, 13, '音樂', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(3, 13, '圖片', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(4, NULL, '壓縮檔', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(5, NULL, '程式', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(6, NULL, '資料', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(7, NULL, '其他', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(8, 7, '新資料夾', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(9, 7, '新資料夾(1)', 0, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(10, 7, '新資料夾(2)', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(11, 10, '新資料夾(3)', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(12, 13, '動畫', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12'),
(13, NULL, '多媒體', 1, 0, '2017-10-03 10:14:12', '2017-10-03 10:14:12', '2017-10-03 10:14:12');

-- --------------------------------------------------------

--
-- 資料表結構 `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `file_id` bigint(20) UNSIGNED DEFAULT NULL,
  `folder_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rwx` tinyint(3) UNSIGNED NOT NULL DEFAULT '7' COMMENT 'r: 4, w: 2, x: 1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `account` varchar(20) COLLATE utf8_general_mysql500_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8_general_mysql500_ci NOT NULL COMMENT 'PASSWORD("pass")',
  `name` tinytext COLLATE utf8_general_mysql500_ci NOT NULL,
  `email` text COLLATE utf8_general_mysql500_ci,
  `root` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- 資料表的匯出資料 `users`
--

INSERT INTO `users` (`id`, `account`, `password_hash`, `name`, `email`, `root`) VALUES
(1, 'TCC', '*3270E9ED7A6DE28E42E6CEFB110013DC76336B0A', '陳泰澄', 'john987john987@gmail.com', 0);

--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`) USING HASH,
  ADD KEY `path_id` (`path_id`) USING BTREE;

--
-- 資料表索引 `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `path_id` (`path_id`) USING BTREE;

--
-- 資料表索引 `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `file_id` (`file_id`),
  ADD KEY `folder_id` (`folder_id`),
  ADD KEY `user_id` (`user_id`);

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`account`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `files`
--
ALTER TABLE `files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;
--
-- 使用資料表 AUTO_INCREMENT `folders`
--
ALTER TABLE `folders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- 使用資料表 AUTO_INCREMENT `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- 已匯出資料表的限制(Constraint)
--

--
-- 資料表的 Constraints `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`path_id`) REFERENCES `folders` (`id`) ON UPDATE CASCADE;

--
-- 資料表的 Constraints `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`path_id`) REFERENCES `folders` (`id`) ON UPDATE CASCADE;

--
-- 資料表的 Constraints `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_2` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `permissions_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
