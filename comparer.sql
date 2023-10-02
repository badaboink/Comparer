-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 02, 2023 at 02:17 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `comparer`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) COLLATE utf8_lithuanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_lithuanian_ci NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add category', 7, 'add_category'),
(26, 'Can change category', 7, 'change_category'),
(27, 'Can delete category', 7, 'delete_category'),
(28, 'Can view category', 7, 'view_category'),
(29, 'Can add playlist', 8, 'add_playlist'),
(30, 'Can change playlist', 8, 'change_playlist'),
(31, 'Can delete playlist', 8, 'delete_playlist'),
(32, 'Can view playlist', 8, 'view_playlist'),
(33, 'Can add song', 9, 'add_song'),
(34, 'Can change song', 9, 'change_song'),
(35, 'Can delete song', 9, 'delete_song'),
(36, 'Can view song', 9, 'view_song');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) COLLATE utf8_lithuanian_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8_lithuanian_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8_lithuanian_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8_lithuanian_ci NOT NULL,
  `email` varchar(254) COLLATE utf8_lithuanian_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comparer_category`
--

CREATE TABLE `comparer_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `description` longtext COLLATE utf8_lithuanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Dumping data for table `comparer_category`
--

INSERT INTO `comparer_category` (`id`, `name`, `description`) VALUES
(1, 'Rock \'n\' Roll Revival', 'Take a nostalgic trip through the decades with the greatest rock hits that ever rolled.'),
(2, 'Chill Vibes Only', 'Unwind and relax with a selection of soothing tunes that\'ll make stress vanish like a wisp of smoke.'),
(3, 'Movie Soundtracks', 'Feel like a hero in your everyday life while listening to the epic music that scores your favorite films.'),
(4, 'Dancefloor Bangers', 'Get ready to bust out your best moves as these energetic beats keep you grooving all night long.'),
(5, 'Acoustic Bliss', 'Stripped-down melodies and heartfelt lyrics for when you just want to feel the music\'s soul.'),
(6, 'Road Trip Anthems', 'Hit the open road with a playlist that turns every mile into a memorable adventure.'),
(7, 'Dreampop Nostalgia', 'Embrace the neon-soaked retro-future with electrifying synthwave tracks.'),
(8, 'Jazz & Coffee', 'Sip your favorite brew and let the smooth sounds of jazz be the soundtrack to your cozy mornings.'),
(9, 'Indie Folk Storytellers', 'Dive into the stories told by indie folk artists that paint pictures with their words and melodies.'),
(10, 'Latin Fiesta', 'Shake your hips and celebrate life with the vibrant rhythms and passionate lyrics of Latin music.'),
(11, 'Indie Innovations', 'Explore the diverse and ever-evolving world of indie music, where creativity knows no bounds.'),
(12, 'Shoegaze Soundscapes', 'Get lost in the dreamy, hazy atmospheres of shoegaze, where the music envelops you like a warm embrace.'),
(13, 'Riot Girl Revolution', 'Join the punk-rock rebellion with fearless and empowering anthems from riot girl pioneers and modern icons.'),
(14, 'Cloud rap', 'Dive into the experimental and genre-blurring sounds of cloud rap, where art and music collide in unpredictable ways.');

-- --------------------------------------------------------

--
-- Table structure for table `comparer_playlist`
--

CREATE TABLE `comparer_playlist` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `description` longtext COLLATE utf8_lithuanian_ci NOT NULL,
  `image` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `category_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Dumping data for table `comparer_playlist`
--

INSERT INTO `comparer_playlist` (`id`, `name`, `description`, `image`, `category_id`) VALUES
(1, 'Indie Dreams Unplugged', 'Acoustic renditions of indie favorites for a mellow and introspective listening experience.', 'playlists/tumblr_1c0c66dc35267ccc83b59b414e94a5d0_713ff0ff_2048.jpg', 11),
(2, 'Shoegaze Galaxy Jams', 'Immerse yourself in the ethereal and otherworldly sounds of shoegaze, like floating through a sonic nebula.', 'playlists/tumblr_1c9079ed7665cddb79a8e8dbcf4201b5_25ed1d6f_2048.jpg', 12),
(3, 'Riot Girl Power Hour', 'A high-energy playlist filled with fierce and unapologetic riot girl anthems that demand your attention.', 'playlists/tumblr_02b5a93cbd2f455fb22b91d04caa82be_d071dd76_2048.jpg', 13),
(4, 'Drain Gang Eclectic Vibes', 'Uncover the diverse musical universe of Drain Gang with this playlist that defies genre boundaries.', 'playlists/tumblr_2f520a011b464d87a6728e64e9c25202_65acf33c_2048.jpg', 14),
(5, 'Indie Folk Serenity', 'Find solace in the soothing melodies and heartfelt storytelling of indie folk\'s finest troubadours.', 'playlists/tumblr_3e920c7c8762887d66565a04aa9b073f_8568fd94_2048.jpg', 9),
(6, 'Shoegaze Reverie Escapes', 'Let the lush and reverberating soundscapes of shoegaze transport you to a world of pure imagination.', 'playlists/tumblr_7d4e281817462e668379773f9973dcca_621e8cfe_2048.jpg', 12),
(7, 'Riot Girl Revolutionaries', 'Celebrate the fearless women of the riot girl movement who challenged the status quo and left an indelible mark on music.', 'playlists/tumblr_9ce86817a43c2365a262e960f69a1671_0102be7b_2048.jpg', 13),
(8, 'L-hyperpop Hypnotica', 'Dive deep into the hypnotic beats and experimental sounds that define the upcoming lithuanian hyperpop.', 'playlists/tumblr_19b530209bca26b17432bc44fd03b50b_f8041c2d_2048.jpg', 14),
(9, 'Indie Pop Sunshine', 'Catch a ray of musical sunshine with catchy indie pop tunes that\'ll brighten your day.', 'playlists/tumblr_439b1c50fced9783a5a93314ed58b4be_896a6673_2048.jpg', 11),
(10, 'Shoegaze Twilight Drift', 'As day turns to night, let the moody and introspective melodies of shoegaze guide you through the twilight hours.', 'playlists/tumblr_adf7f7257da6ddfc5ac95a24f0e14a67_9897efc8_2048.jpg', 11);

-- --------------------------------------------------------

--
-- Table structure for table `comparer_song`
--

CREATE TABLE `comparer_song` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `artist` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `year` int(11) DEFAULT NULL,
  `genre` varchar(50) COLLATE utf8_lithuanian_ci NOT NULL,
  `artwork` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `song_file` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Dumping data for table `comparer_song`
--

INSERT INTO `comparer_song` (`id`, `name`, `artist`, `year`, `genre`, `artwork`, `song_file`) VALUES
(1, 'Sometimes', 'Alex g', 2019, 'Indie', 'artworks/tumblr_c06a5c9c8a917bbacbfbeed4b37e714f_18090c03_2048.jpg', 'songs/Alex_G__-_Sometimes.mp3');

-- --------------------------------------------------------

--
-- Table structure for table `comparer_song_playlist`
--

CREATE TABLE `comparer_song_playlist` (
  `id` bigint(20) NOT NULL,
  `song_id` bigint(20) NOT NULL,
  `playlist_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Dumping data for table `comparer_song_playlist`
--

INSERT INTO `comparer_song_playlist` (`id`, `song_id`, `playlist_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 9);

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `object_repr` varchar(200) COLLATE utf8_lithuanian_ci NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext COLLATE utf8_lithuanian_ci NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `model` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(7, 'comparer', 'category'),
(8, 'comparer', 'playlist'),
(9, 'comparer', 'song'),
(5, 'contenttypes', 'contenttype'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) COLLATE utf8_lithuanian_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_lithuanian_ci NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2023-07-31 11:57:45.376688'),
(2, 'auth', '0001_initial', '2023-07-31 11:57:46.293490'),
(3, 'admin', '0001_initial', '2023-07-31 11:57:46.475379'),
(4, 'admin', '0002_logentry_remove_auto_add', '2023-07-31 11:57:46.483278'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2023-07-31 11:57:46.489864'),
(6, 'contenttypes', '0002_remove_content_type_name', '2023-07-31 11:57:46.565570'),
(7, 'auth', '0002_alter_permission_name_max_length', '2023-07-31 11:57:46.643732'),
(8, 'auth', '0003_alter_user_email_max_length', '2023-07-31 11:57:46.755688'),
(9, 'auth', '0004_alter_user_username_opts', '2023-07-31 11:57:46.762695'),
(10, 'auth', '0005_alter_user_last_login_null', '2023-07-31 11:57:46.833036'),
(11, 'auth', '0006_require_contenttypes_0002', '2023-07-31 11:57:46.837053'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2023-07-31 11:57:46.844009'),
(13, 'auth', '0008_alter_user_username_max_length', '2023-07-31 11:57:46.862772'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2023-07-31 11:57:46.881794'),
(15, 'auth', '0010_alter_group_name_max_length', '2023-07-31 11:57:46.960558'),
(16, 'auth', '0011_update_proxy_permissions', '2023-07-31 11:57:46.967599'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2023-07-31 11:57:46.987509'),
(18, 'sessions', '0001_initial', '2023-07-31 11:57:47.039833'),
(20, 'comparer', '0001_initial', '2023-09-28 11:48:09.011373');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8_lithuanian_ci NOT NULL,
  `session_data` longtext COLLATE utf8_lithuanian_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('gb6huw21dq6ueob3mlrar6jdm2pso0el', 'eyJ2ZXJpZmllciI6IkFIeFNwY21oZ0QzdHV4WU0wd2h4a1ppUkFrYmV1R2tyM1FmNkxycUtOaWpsTlF2cUN1NHlkTUszMlZ1S2wzMklzaDVHZDlnYmo5RTE0V1RkbThtenFjZE5FRjBObGJJM3JUZzdKSzRNOWE3dGlvVHd5M0NQTHByNjhnWXNhaGFmIn0:1qTOWw:rqaTIV4Zqp9Zqboh8rIc8xAi7uvZo8dS_wxgYhu6RkQ', '2023-08-22 15:21:54.890326');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `comparer_category`
--
ALTER TABLE `comparer_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comparer_playlist`
--
ALTER TABLE `comparer_playlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comparer_playlist_category_id_1a081880_fk_comparer_category_id` (`category_id`);

--
-- Indexes for table `comparer_song`
--
ALTER TABLE `comparer_song`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comparer_song_playlist`
--
ALTER TABLE `comparer_song_playlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `comparer_song_playlist_song_id_playlist_id_2b39b089_uniq` (`song_id`,`playlist_id`),
  ADD KEY `comparer_song_playli_playlist_id_6bb6c532_fk_comparer_` (`playlist_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comparer_category`
--
ALTER TABLE `comparer_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `comparer_playlist`
--
ALTER TABLE `comparer_playlist`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `comparer_song`
--
ALTER TABLE `comparer_song`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `comparer_song_playlist`
--
ALTER TABLE `comparer_song_playlist`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `comparer_playlist`
--
ALTER TABLE `comparer_playlist`
  ADD CONSTRAINT `comparer_playlist_category_id_1a081880_fk_comparer_category_id` FOREIGN KEY (`category_id`) REFERENCES `comparer_category` (`id`);

--
-- Constraints for table `comparer_song_playlist`
--
ALTER TABLE `comparer_song_playlist`
  ADD CONSTRAINT `comparer_song_playli_playlist_id_6bb6c532_fk_comparer_` FOREIGN KEY (`playlist_id`) REFERENCES `comparer_playlist` (`id`),
  ADD CONSTRAINT `comparer_song_playlist_song_id_7983d5a7_fk_comparer_song_id` FOREIGN KEY (`song_id`) REFERENCES `comparer_song` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
