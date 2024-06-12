CREATE TABLE `authors` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255)
);

CREATE TABLE `quotes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `text` text,
  `author_id` int
);

CREATE TABLE `scores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `player_name` varchar(255),
  `score` int
);

ALTER TABLE `quotes` ADD FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`);
