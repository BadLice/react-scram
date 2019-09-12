-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 12, 2019 at 11:51 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scram_db`
--
CREATE DATABASE IF NOT EXISTS `scram_db` DEFAULT CHARACTER SET utf16 COLLATE utf16_bin;
USE `scram_db`;

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` varchar(100) COLLATE utf16_bin NOT NULL,
  `username` varchar(32) COLLATE utf16_bin NOT NULL,
  `password` varchar(100) COLLATE utf16_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `username`, `password`) VALUES
('0320f1d8-d535-11e9-af8c-e86a64b5622f', 'prova', '6258a5e0eb772911d4f92be5b5db0e14511edbe01d1d0ddd1d5a2cb9db9a56ba'),
('9748d931-d53c-11e9-af8c-e86a64b5622f', 'nuovo', '186195fc7c1388225bfb874f9b1f63c3ade4c35c54b289e3c5f803b688182609'),
('976a7a74-d535-11e9-af8c-e86a64b5622f', 'aaaaa', '6258a5e0eb772911d4f92be5b5db0e14511edbe01d1d0ddd1d5a2cb9db9a56ba'),
('aa05632f-d53b-11e9-af8c-e86a64b5622f', 'alexx', '624b12184814e076e63d3fbf981b30ca78947b24ee3c0cd967dcc84fa24d5bd9'),
('bd5b073a-d53c-11e9-af8c-e86a64b5622f', 'siage', 'a51de5b842568ab11b06a839d4eb47c00f79d678d1ba8e01bcd9f4ea3bd44931');

-- --------------------------------------------------------

--
-- Table structure for table `phase`
--

CREATE TABLE `phase` (
  `id` varchar(100) COLLATE utf16_bin NOT NULL,
  `name` varchar(100) COLLATE utf16_bin NOT NULL,
  `account_id` varchar(100) COLLATE utf16_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

--
-- Dumping data for table `phase`
--

INSERT INTO `phase` (`id`, `name`, `account_id`) VALUES
('00b1640c-ba8c-4eba-a190-f267b94bdf0d', '', '0320f1d8-d535-11e9-af8c-e86a64b5622f'),
('23247853-c424-45c4-9ea4-e02693a03908', 'Demo', 'bd5b073a-d53c-11e9-af8c-e86a64b5622f'),
('361d69f3-0c49-4212-b009-2d67c259edb0', 'Rilascio', 'bd5b073a-d53c-11e9-af8c-e86a64b5622f'),
('649af73c-c9bf-4243-95c5-1c06b4054149', '', '0320f1d8-d535-11e9-af8c-e86a64b5622f'),
('68c6313e-b08b-452d-b44f-3aa592e06236', '', 'aa05632f-d53b-11e9-af8c-e86a64b5622f'),
('908813c1-8005-4f8c-acdc-e1dd1e7beba3', 'Sviluppo', 'bd5b073a-d53c-11e9-af8c-e86a64b5622f'),
('d26a894a-4a84-4b08-ac45-84bac0e706d9', '', '9748d931-d53c-11e9-af8c-e86a64b5622f'),
('dea1f7ba-bdcf-4820-8840-35e87d21681b', 'Test', 'bd5b073a-d53c-11e9-af8c-e86a64b5622f'),
('e1467a7a-ef96-4d8c-97eb-b16aa82e0723', 'Requisitazione', 'bd5b073a-d53c-11e9-af8c-e86a64b5622f'),
('e9edd8a2-0631-4793-9a9c-5b235e338a9a', '', '0320f1d8-d535-11e9-af8c-e86a64b5622f');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` varchar(100) COLLATE utf16_bin NOT NULL,
  `name` varchar(100) COLLATE utf16_bin NOT NULL,
  `completed` tinyint(1) NOT NULL,
  `date` date NOT NULL,
  `state` tinyint(4) NOT NULL,
  `priority` tinyint(4) NOT NULL,
  `phase_id` varchar(100) COLLATE utf16_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `name`, `completed`, `date`, `state`, `priority`, `phase_id`) VALUES
('0a869e15-49f8-49d6-912c-4fb509a87a03', '', 0, '2019-09-12', 0, 0, '908813c1-8005-4f8c-acdc-e1dd1e7beba3'),
('0c8ca3b4-dddc-4851-967b-53b1e8f61723', '', 0, '2019-09-12', 0, 0, 'e1467a7a-ef96-4d8c-97eb-b16aa82e0723'),
('11e89e26-4b3e-4dec-973b-269553d3a5ae', '', 0, '2019-09-12', 0, 0, 'dea1f7ba-bdcf-4820-8840-35e87d21681b'),
('12ad136f-ecbc-4da8-a7aa-feef9319fa04', '', 0, '2019-09-12', 0, 0, 'e9edd8a2-0631-4793-9a9c-5b235e338a9a'),
('13036388-d39b-45b4-bf98-3ccc40ff55e8', '', 0, '2019-09-12', 0, 0, 'e1467a7a-ef96-4d8c-97eb-b16aa82e0723'),
('232a9581-f0fe-44d6-a0d7-eefc3e8679ab', '', 0, '2019-09-12', 0, 0, '361d69f3-0c49-4212-b009-2d67c259edb0'),
('351d687c-d5b2-48bd-8c11-93e8c78c210d', '', 0, '2019-09-12', 0, 0, '00b1640c-ba8c-4eba-a190-f267b94bdf0d'),
('429699a6-e763-4e16-8389-6d292ec4d259', '', 0, '2019-09-12', 0, 0, '908813c1-8005-4f8c-acdc-e1dd1e7beba3'),
('78557b9a-7409-4cbe-b25d-7a600ee6779d', '', 1, '2019-09-12', 0, 0, '908813c1-8005-4f8c-acdc-e1dd1e7beba3'),
('86494304-573c-4fd1-a62a-8ece9d7f6080', '', 0, '2019-09-12', 0, 0, 'e9edd8a2-0631-4793-9a9c-5b235e338a9a'),
('8d531b5b-c0c2-4bb0-8248-ae5896f454f8', '', 0, '2019-09-12', 0, 0, '361d69f3-0c49-4212-b009-2d67c259edb0'),
('8dfa7116-fce9-4992-ad51-f34ea01c7a05', '', 0, '2019-09-12', 0, 0, 'e9edd8a2-0631-4793-9a9c-5b235e338a9a'),
('9ef78ddc-bf2b-4f72-8f50-ef4cf857f5ee', '', 0, '2019-09-12', 0, 0, 'e9edd8a2-0631-4793-9a9c-5b235e338a9a'),
('9f66ee53-353d-45d7-96cf-cb7eacad7436', '', 0, '2019-09-12', 0, 0, 'd26a894a-4a84-4b08-ac45-84bac0e706d9'),
('a36492e2-b769-44ad-8da7-f9ed7586221c', '', 0, '2019-09-12', 0, 0, '908813c1-8005-4f8c-acdc-e1dd1e7beba3'),
('a40cf8ec-be2b-45de-b2a5-4526d632df45', '', 0, '2019-09-12', 0, 0, '68c6313e-b08b-452d-b44f-3aa592e06236'),
('b3f3ca98-29dc-4533-9767-d9468d427dfc', '', 0, '2019-09-12', 0, 0, 'd26a894a-4a84-4b08-ac45-84bac0e706d9'),
('b65b3bcf-a651-4dc9-8fa9-3c17225764da', '', 0, '2019-09-12', 0, 0, '68c6313e-b08b-452d-b44f-3aa592e06236'),
('bafcfc61-7dbf-4119-b192-7ec5376b9cc5', '', 0, '2019-09-12', 0, 0, '649af73c-c9bf-4243-95c5-1c06b4054149'),
('c3f0c3f0-2dc3-4d25-94e9-a027898dc345', '', 0, '2019-09-12', 0, 0, '23247853-c424-45c4-9ea4-e02693a03908'),
('c96bf8c2-a311-4378-8c79-99b8c1e6911a', '', 0, '2019-09-12', 0, 0, '649af73c-c9bf-4243-95c5-1c06b4054149'),
('cef48212-fb6c-4d57-b859-984cc6667357', '', 0, '2019-09-12', 0, 0, 'dea1f7ba-bdcf-4820-8840-35e87d21681b'),
('d085ca6a-9b7a-4f85-8084-186b4dceafea', '', 0, '2019-09-12', 0, 0, '361d69f3-0c49-4212-b009-2d67c259edb0'),
('d1732e95-6507-44d5-8dea-f70b1d0e1903', '', 0, '2019-09-12', 0, 0, '23247853-c424-45c4-9ea4-e02693a03908'),
('d5f2345c-1b3c-4c23-9122-b8c4ea81c93c', '', 0, '2019-09-12', 0, 0, '23247853-c424-45c4-9ea4-e02693a03908'),
('e54baf7f-f8b9-4c5b-a172-a0bd4785400d', '', 0, '2019-09-12', 0, 0, '361d69f3-0c49-4212-b009-2d67c259edb0'),
('f8b3c4b7-8794-4061-ba25-2431f2f22baf', '', 0, '2019-09-12', 0, 0, 'dea1f7ba-bdcf-4820-8840-35e87d21681b');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `phase`
--
ALTER TABLE `phase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_account_phase` (`account_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phase_id` (`phase_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `phase`
--
ALTER TABLE `phase`
  ADD CONSTRAINT `phase_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`phase_id`) REFERENCES `phase` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
