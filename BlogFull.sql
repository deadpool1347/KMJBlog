-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Янв 18 2019 г., 21:03
-- Версия сервера: 5.6.38
-- Версия PHP: 5.5.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `Blog`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Article`
--

CREATE TABLE `Article` (
  `idArticle` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idUser` int(11) NOT NULL,
  `idTheme` int(11) NOT NULL,
  `img` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Article`
--

INSERT INTO `Article` (`idArticle`, `name`, `content`, `date`, `idUser`, `idTheme`, `img`) VALUES
(1, 'Статья 1', 'Содержание..................................................................................................................................................................................................................................................................................................................................................................................................................................................', '2018-12-31 21:00:00', 5, 1, ''),
(2, 'Статья 1', 'Содержание..................................................................................................................................................................................................................................................................................................................................................................................................................................................', '2018-12-31 21:00:00', 5, 2, '');

-- --------------------------------------------------------

--
-- Структура таблицы `Comment`
--

CREATE TABLE `Comment` (
  `idComment` int(11) NOT NULL,
  `content` varchar(200) NOT NULL,
  `date` datetime NOT NULL,
  `likes` int(11) NOT NULL,
  `dislikes` int(11) NOT NULL,
  `idArticle` int(11) NOT NULL,
  `idUser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Comment`
--

INSERT INTO `Comment` (`idComment`, `content`, `date`, `likes`, `dislikes`, `idArticle`, `idUser`) VALUES
(1, 'Коментарии………...', '2019-01-01 00:00:00', 5, 2, 2, 5),
(3, 'КОментарий2', '2019-01-01 00:00:00', 10, 0, 1, 6);

-- --------------------------------------------------------

--
-- Структура таблицы `Status`
--

CREATE TABLE `Status` (
  `idStatus` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Status`
--

INSERT INTO `Status` (`idStatus`, `name`) VALUES
(1, 'inactiveUser'),
(2, 'user'),
(3, 'author'),
(4, 'admin');

-- --------------------------------------------------------

--
-- Структура таблицы `Subject`
--

CREATE TABLE `Subject` (
  `idSubject` int(11) NOT NULL,
  `name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Subject`
--

INSERT INTO `Subject` (`idSubject`, `name`) VALUES
(1, 'предмет1'),
(2, 'предмет2');

-- --------------------------------------------------------

--
-- Структура таблицы `Tag`
--

CREATE TABLE `Tag` (
  `idTag` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Tag`
--

INSERT INTO `Tag` (`idTag`, `name`) VALUES
(1, 'Таг1'),
(2, 'Таг2');

-- --------------------------------------------------------

--
-- Структура таблицы `TagArticle`
--

CREATE TABLE `TagArticle` (
  `idTagArticle` int(11) NOT NULL,
  `idTag` int(11) NOT NULL,
  `idArticle` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `TagArticle`
--

INSERT INTO `TagArticle` (`idTagArticle`, `idTag`, `idArticle`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 2, 5),
(4, 1, 15),
(5, 1, 16),
(6, 1, 17),
(7, 2, 17);

-- --------------------------------------------------------

--
-- Структура таблицы `Theme`
--

CREATE TABLE `Theme` (
  `idTheme` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `idSubject` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Theme`
--

INSERT INTO `Theme` (`idTheme`, `name`, `idSubject`) VALUES
(1, 'Тема1', 1),
(2, 'Тема1', 2),
(4, 'Тема2', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `Training`
--

CREATE TABLE `Training` (
  `idTtraining` int(11) NOT NULL,
  `idArticle` int(11) NOT NULL,
  `url` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Training`
--

INSERT INTO `Training` (`idTtraining`, `idArticle`, `url`) VALUES
(1, 2, 'ссылка1'),
(2, 2, 'ссылка2'),
(3, 1, 'ссылка1'),
(4, 2, 'ссылка2');

-- --------------------------------------------------------

--
-- Структура таблицы `User`
--

CREATE TABLE `User` (
  `idUser` int(11) NOT NULL,
  `login` varchar(60) NOT NULL,
  `password` varchar(25) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idStatus` int(11) NOT NULL,
  `keyCode` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `User`
--

INSERT INTO `User` (`idUser`, `login`, `password`, `date`, `idStatus`, `keyCode`) VALUES
(5, 'nkh@bdje.ru', 'ycgew', '2018-12-09 21:00:00', 1, 0),
(6, 'urhfe@eyru.ru', 'gfyeh', '2018-12-29 21:00:00', 2, 0),
(9, 'name', 'pswd', '0000-00-00 00:00:00', 2, 567833),
(11, 'p_m.a.vashkevich@mpt.ru', '1', '2019-01-10 12:03:37', 1, 543878568),
(20, 'fuurria@yandex.ru', '2', '2019-01-14 10:38:24', 3, 396681638);

-- --------------------------------------------------------

--
-- Структура таблицы `UserInfo`
--

CREATE TABLE `UserInfo` (
  `idUser` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `vk` varchar(50) NOT NULL,
  `facebook` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `UserInfo`
--

INSERT INTO `UserInfo` (`idUser`, `name`, `vk`, `facebook`) VALUES
(5, 'ник1', 'url vk1', 'url facebook1'),
(6, 'ник2', 'url vk 2', 'url facebook 2');

-- --------------------------------------------------------

--
-- Структура таблицы `Video`
--

CREATE TABLE `Video` (
  `idVideo` int(11) NOT NULL,
  `idArticle` int(11) NOT NULL,
  `url` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `Video`
--

INSERT INTO `Video` (`idVideo`, `idArticle`, `url`) VALUES
(1, 2, 'url1'),
(2, 1, 'url1'),
(3, 2, 'url2'),
(4, 1, 'url2');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Article`
--
ALTER TABLE `Article`
  ADD PRIMARY KEY (`idArticle`),
  ADD KEY `idUser` (`idUser`),
  ADD KEY `idTheme` (`idTheme`);

--
-- Индексы таблицы `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`idComment`),
  ADD KEY `idUser` (`idUser`),
  ADD KEY `idArticle` (`idArticle`);

--
-- Индексы таблицы `Status`
--
ALTER TABLE `Status`
  ADD PRIMARY KEY (`idStatus`);

--
-- Индексы таблицы `Subject`
--
ALTER TABLE `Subject`
  ADD PRIMARY KEY (`idSubject`);

--
-- Индексы таблицы `Tag`
--
ALTER TABLE `Tag`
  ADD PRIMARY KEY (`idTag`);

--
-- Индексы таблицы `TagArticle`
--
ALTER TABLE `TagArticle`
  ADD PRIMARY KEY (`idTagArticle`),
  ADD KEY `idTag` (`idTag`) USING BTREE,
  ADD KEY `idArticle` (`idArticle`);

--
-- Индексы таблицы `Theme`
--
ALTER TABLE `Theme`
  ADD PRIMARY KEY (`idTheme`),
  ADD KEY `idSubject` (`idSubject`) USING BTREE;

--
-- Индексы таблицы `Training`
--
ALTER TABLE `Training`
  ADD PRIMARY KEY (`idTtraining`),
  ADD KEY `idArticle` (`idArticle`);

--
-- Индексы таблицы `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`idUser`),
  ADD KEY `idStatus` (`idStatus`) USING BTREE;

--
-- Индексы таблицы `UserInfo`
--
ALTER TABLE `UserInfo`
  ADD KEY `idUser` (`idUser`);

--
-- Индексы таблицы `Video`
--
ALTER TABLE `Video`
  ADD PRIMARY KEY (`idVideo`),
  ADD KEY `idArticle` (`idArticle`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Article`
--
ALTER TABLE `Article`
  MODIFY `idArticle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT для таблицы `Comment`
--
ALTER TABLE `Comment`
  MODIFY `idComment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `Status`
--
ALTER TABLE `Status`
  MODIFY `idStatus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `Subject`
--
ALTER TABLE `Subject`
  MODIFY `idSubject` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `Tag`
--
ALTER TABLE `Tag`
  MODIFY `idTag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `TagArticle`
--
ALTER TABLE `TagArticle`
  MODIFY `idTagArticle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `Theme`
--
ALTER TABLE `Theme`
  MODIFY `idTheme` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `Training`
--
ALTER TABLE `Training`
  MODIFY `idTtraining` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `User`
--
ALTER TABLE `User`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `Video`
--
ALTER TABLE `Video`
  MODIFY `idVideo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Article`
--
ALTER TABLE `Article`
  ADD CONSTRAINT `article_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `User` (`idUser`);

--
-- Ограничения внешнего ключа таблицы `Comment`
--
ALTER TABLE `Comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`idArticle`) REFERENCES `Article` (`idArticle`),
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `User` (`idUser`);

--
-- Ограничения внешнего ключа таблицы `TagArticle`
--
ALTER TABLE `TagArticle`
  ADD CONSTRAINT `tagarticle_ibfk_1` FOREIGN KEY (`idTag`) REFERENCES `Tag` (`idTag`);

--
-- Ограничения внешнего ключа таблицы `Theme`
--
ALTER TABLE `Theme`
  ADD CONSTRAINT `theme_ibfk_1` FOREIGN KEY (`idSubject`) REFERENCES `Subject` (`idSubject`);

--
-- Ограничения внешнего ключа таблицы `Training`
--
ALTER TABLE `Training`
  ADD CONSTRAINT `training_ibfk_1` FOREIGN KEY (`idArticle`) REFERENCES `Article` (`idArticle`);

--
-- Ограничения внешнего ключа таблицы `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);

--
-- Ограничения внешнего ключа таблицы `UserInfo`
--
ALTER TABLE `UserInfo`
  ADD CONSTRAINT `userinfo_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `User` (`idUser`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Video`
--
ALTER TABLE `Video`
  ADD CONSTRAINT `video_ibfk_1` FOREIGN KEY (`idArticle`) REFERENCES `Article` (`idArticle`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
