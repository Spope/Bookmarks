-- phpMyAdmin SQL Dump
-- version 3.5.8.1deb1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Mar 20 Août 2013 à 20:07
-- Version du serveur: 5.5.32-0ubuntu0.12.04.1
-- Version de PHP: 5.4.9-4ubuntu2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `bookmarksv2`
--

-- --------------------------------------------------------

--
-- Structure de la table `bookmark`
--

CREATE TABLE IF NOT EXISTS `bookmark` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `url` varchar(300) NOT NULL,
  `position` int(11) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `bookmark_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bookmark_user` (`user_id`),
  KEY `fk_bookmark_category1` (`category_id`),
  KEY `fk_bookmark_bookmark_type1` (`bookmark_type_id`),
  KEY `fk_bookmark_bookmark1` (`parent`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `bookmark`
--

INSERT INTO `bookmark` (`id`, `name`, `url`, `position`, `parent`, `user_id`, `category_id`, `bookmark_type_id`) VALUES
(1, 'Book dans perso', 'www.cool.com', 1, NULL, 1, 1, 1),
(2, 'Autre book', 'www.coolcoolcool.com', 2, NULL, 1, 1, 1),
(3, 'Autre book 2', 'www.test.com', 0, NULL, 1, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `bookmark_type`
--

CREATE TABLE IF NOT EXISTS `bookmark_type` (
  `id` int(11) NOT NULL,
  `label` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `bookmark_type`
--

INSERT INTO `bookmark_type` (`id`, `label`) VALUES
(1, 'book'),
(2, 'folder');

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `parent` int(11) NOT NULL,
  `root` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_category_user1` (`user_id`),
  KEY `fk_category_parent1` (`parent`),
  KEY `fk_category_root1` (`root`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `category`
--

INSERT INTO `category` (`id`, `name`, `parent`, `root`, `user_id`) VALUES
(1, 'Perso', 1, 1, 1),
(2, 'Cool cool cool', 2, 2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `search_engine`
--

CREATE TABLE IF NOT EXISTS `search_engine` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `url` varchar(45) NOT NULL,
  `logo` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(45) NOT NULL,
  `roles` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `roles`) VALUES
(1, 'Spope', '4Cu69UxllQa21865268e327e71a083ba85ca241ed4', 'pinaudt@gmail.com', 'ROLE_USER');

-- --------------------------------------------------------

--
-- Structure de la table `user_search_engine`
--

CREATE TABLE IF NOT EXISTS `user_search_engine` (
  `user_id` int(11) NOT NULL,
  `search_engine_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`search_engine_id`),
  KEY `fk_user_has_search_engine_search_engine1` (`search_engine_id`),
  KEY `fk_user_has_search_engine_user1` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `bookmark`
--
ALTER TABLE `bookmark`
  ADD CONSTRAINT `fk_bookmark_bookmark1` FOREIGN KEY (`parent`) REFERENCES `bookmark` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_bookmark_bookmark_type1` FOREIGN KEY (`bookmark_type_id`) REFERENCES `bookmark_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_bookmark_category1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_bookmark_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `fk_category_root` FOREIGN KEY (`root`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_category_root1` FOREIGN KEY (`parent`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_category_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `user_search_engine`
--
ALTER TABLE `user_search_engine`
  ADD CONSTRAINT `fk_user_has_search_engine_search_engine1` FOREIGN KEY (`search_engine_id`) REFERENCES `search_engine` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_has_search_engine_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
