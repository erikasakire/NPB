-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2017 m. Grd 15 d. 20:18
-- Server version: 10.1.21-MariaDB
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `asmuo`
--

CREATE TABLE `asmuo` (
  `AsmensKodas` varchar(11) NOT NULL,
  `Vardas` varchar(45) NOT NULL,
  `Pavarde` varchar(50) NOT NULL,
  `Telefono_nr` varchar(45) NOT NULL,
  `Epastas` varchar(50) NOT NULL,
  `Gyvenamoji_vieta` varchar(100) NOT NULL,
  `Gimimo_data` date NOT NULL,
  `Issilavinimas` varchar(200) DEFAULT NULL,
  `Sveikatos_draudimas` tinyint(1) NOT NULL,
  PRIMARY KEY (`AsmensKodas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `asmuo`
--

INSERT INTO `asmuo` (`AsmensKodas`, `Vardas`, `Pavarde`, `Telefono_nr`, `Epastas`, `Gyvenamoji_vieta`, `Gimimo_data`, `Issilavinimas`, `Sveikatos_draudimas`) VALUES
  ('14753593442', 'Shari', 'Watmough', '209-825-6246', 'swatmoughq@squarespace.com', '3 Dunning Alley', '1994-09-19', 'Buhalteris', 1),
  ('19698857524', 'Gherardo', 'Finnan', '806-304-1041', 'gfinnanl@google.com.au', '3 Ryan Parkway', '1996-11-25', 'Buhalteris', 1),
  ('32319779885', 'Estele', 'Scutchings', '332-845-0796', 'escutchingss@t-online.de', '6 Graedel Court', '1993-03-28', 'Buhalteris', 1),
  ('36312437027', 'Ardine', 'Duny', '210-520-8341', 'adunyo@bigcartel.com', '81 Meadow Valley Street', '1990-10-28', 'Sekretorius', 1),
  ('43092680617', 'Devora', 'Fendt', '672-102-1382', 'dfendte@nyu.edu', '3 Prentice Road', '1983-02-03', 'Sekretorius', 1),
  ('48706186323', 'Darnell', 'Eplate', '143-830-8511', 'deplatep@army.mil', '5 West Junction', '1975-09-18', 'Sekretorius', 1),
  ('48963435531', 'Freeland', 'Cooke', '538-113-8783', 'fcookeg@webnode.com', '030 Mcguire Place', '1977-10-25', 'Sekretorius', 1),
  ('51611665094', 'Fifi', 'Overland', '727-119-6230', 'foverland9@about.com', '772 Carpenter Road', '1979-03-01', 'Ekonomistas', 1),
  ('53623042388', 'Rafaelia', 'Nolin', '638-446-5243', 'rnolinh@jugem.jp', '0447 Eagle Crest Hill', '1980-05-23', 'Ekonomistas', 1),
  ('58133144492', 'Gaelan', 'Birdwistle', '503-499-5030', 'gbirdwistlem@fema.gov', '1591 Burning Wood Park', '1992-08-04', 'Ekonomistas', 1),
  ('58501837000', 'Berkly', 'Culshaw', '172-312-9373', 'bculshawk@abc.net.au', '97624 Forest Run Road', '1995-07-15', 'Finansų analitikas', 1),
  ('60148924591', 'Lazar', 'Currom', '624-651-5349', 'lcurrom3@furl.net', '03 Ridgeway Street', '1975-12-01', 'Finansų analitikas', 1),
  ('65965031909', 'Cynde', 'Gunny', '939-482-5618', 'cgunnyd@aboutads.info', '8275 Arrowood Park', '1972-08-28', 'Vadybininkas', 1),
  ('66437551197', 'Rebeka', 'Dainter', '105-275-2431', 'rdainterf@ow.ly', '0124 Macpherson Place', '1982-03-17', 'Vadybininkas', 1),
  ('67176590775', 'Shannon', 'Savine', '364-482-2564', 'ssavinej@time.com', '1730 Northwestern Parkway', '1981-11-14', 'Vadybininkas', 1),
  ('72511100612', 'Abby', 'Sarah', '951-363-7828', 'asarahi@netlog.com', '87 Bonner Pass', '1993-02-09', 'Vadybininkas', 1),
  ('72947907869', 'Cybill', 'Lincoln', '813-115-4820', 'clincolnb@free.fr', '11113 Shoshone Trail', '1997-10-21', 'Vadybininkas', 1),
  ('73488230471', 'Chucho', 'Arro', '649-836-5118', 'carro5@so-net.ne.jp', '17 Ronald Regan Drive', '1970-05-04', 'Pardavimų vadovas', 1),
  ('73763518877', 'Eddie', 'Orrum', '144-602-4107', 'eorrum7@weebly.com', '83968 Jenifer Lane', '1971-06-29', 'Pardavimų vadovas', 1),
  ('74368140949', 'Bartlett', 'Cattrall', '213-398-7848', 'bcattralla@nasa.gov', '8013 Atwood Circle', '1974-03-07', 'Informatikas', 1),
  ('74454021823', 'Lemmy', 'Barth', '413-467-0916', 'lbarth1@shop-pro.jp', '11 Bartillon Road', '1967-03-24', 'Informatikas', 1),
  ('78122506029', 'Ted', 'Clayal', '853-538-7899', 'tclayalc@delicious.com', '0 Washington Crossing', '1995-08-02', 'Informatikas', 1),
  ('79450140990', 'Gardener', 'McCosker', '438-612-9013', 'gmccosker6@bigcartel.com', '73769 Bultman Center', '1985-10-01', 'Informatikas', 1),
  ('79517073470', 'Madonna', 'Frotton', '827-382-8602', 'mfrotton4@woothemes.com', '51736 East Pass', '1970-05-27', 'Informatikas', 1),
  ('83650112977', 'Tate', 'Pennell', '975-985-8870', 'tpennellr@shutterfly.com', '6175 Moland Road', '1993-04-25', 'Vairuotojas', 1),
  ('86077105670', 'Shandee', 'Kittow', '290-811-3922', 'skittow2@state.tx.us', '41 Sycamore Circle', '1997-01-28', 'Vairuotojas', 1),
  ('89461397757', 'Brandon', 'Bollum', '668-171-7197', 'bbollum0@ask.com', '1 Beilfuss Parkway', '1978-01-29', 'Vairuotojas', 1),
  ('93553050615', 'Denna', 'Pittle', '120-935-1869', 'dpittlet@washingtonpost.com', '5 Hintze Drive', '1991-01-13', 'Vairuotojas', 1),
  ('94324857165', 'Justina', 'Georgeot', '110-322-1516', 'jgeorgeotn@simplemachines.org', '6481 Logan Trail', '1989-11-17', 'Vairuotojas', 1),
  ('97796482293', 'Mace', 'Poetz', '748-901-0894', 'mpoetz8@simplemachines.org', '4 Scoville Plaza', '1996-05-18', 'Vairuotojas', 1);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `busena`
--

CREATE TABLE `busena` (
  `Busenos_id` int(11) NOT NULL AUTO_INCREMENT,
  `Busenos_pavadinimas` varchar(45) NOT NULL,
  `Busenos_pavEN` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Busenos_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `busena`
--

INSERT INTO `busena` (`Busenos_id`, `Busenos_pavadinimas`, `Busenos_pavEN`) VALUES
  (1, 'Įvesta', 'Pending'),
  (2, 'Vykdoma', 'Executing'),
  (3, 'Įvykdyta', 'Fulfilled'),
  (4, 'Atšaukta', 'Canceled');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `darbuotojas`
--

CREATE TABLE `darbuotojas` (
  `Tabelio_nr` int(11) NOT NULL,
  `Dirba_nuo` date NOT NULL,
  `Alyginimas` double NOT NULL,
  `Etatas` double NOT NULL,
  `Stazas` double DEFAULT NULL,
  `Rangas_id` int(11) NOT NULL,
  `Asmuo_AsmensKodas` varchar(11) NOT NULL,
  `Registracija_Prisijungimo_vardas` varchar(100) NOT NULL,
  PRIMARY KEY (`Tabelio_nr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `darbuotojas`
--

INSERT INTO `darbuotojas` (`Tabelio_nr`, `Dirba_nuo`, `Alyginimas`, `Etatas`, `Stazas`, `Rangas_id`, `Asmuo_AsmensKodas`, `Registracija_Prisijungimo_vardas`) VALUES
  (2353, '2015-05-25', 1970, 1, 2, 3, '36312437027', 'dodam5'),
  (2355, '2017-07-12', 1490, 0.5, 0, 3, '72511100612', 'mjudkinss'),
  (3062, '2016-04-14', 2671, 1, 6, 3, '72947907869', 'nclaypolei'),
  (3258, '2014-05-19', 2889, 1, 6, 3, '43092680617', 'eolehanec'),
  (3974, '2017-09-20', 2743, 1, 6, 3, '51611665094', 'ichetwind8'),
  (4133, '2013-01-10', 2504, 1, 10, 1, '79517073470', 'traulin7'),
  (4135, '2017-10-23', 2883, 1, 4, 3, '73488230471', 'pfilesl'),
  (4762, '2016-01-07', 2372, 1, 9, 2, '74454021823', 'sromanellia'),
  (4901, '2017-06-10', 1778, 0.7, 2, 3, '53623042388', 'jmarcq'),
  (5046, '2015-03-17', 1653.5, 0.5, 1, 3, '14753593442', 'bstreten'),
  (5162, '2015-10-11', 2303, 1, 3, 3, '32319779885', 'dbeazeyp'),
  (5181, '2017-01-23', 2760.5, 0.5, 2, 3, '58133144492', 'jparkman1'),
  (5541, '2017-11-05', 2640.5, 1, 3, 3, '74368140949', 'rsilvestono'),
  (5898, '2017-08-09', 2036, 0.7, 2, 3, '67176590775', 'medlinb'),
  (5970, '2014-10-06', 2020, 1, 6, 3, '73763518877', 'pjuraszh'),
  (6000, '2016-10-31', 2336, 1, 8, 3, '65965031909', 'mbowrar'),
  (6245, '2015-07-09', 2689.5, 1, 9, 3, '48706186323', 'eyackiminied'),
  (6732, '2017-01-01', 1851, 1, 7, 3, '60148924591', 'labberley0'),
  (6812, '2016-06-14', 1242, 1, 6, 3, '78122506029', 'sskoateg'),
  (8457, '2013-01-16', 2393, 1, 9, 3, '58501837000', 'kmarlork'),
  (8586, '2014-12-01', 1620.5, 1, 6, 3, '79450140990', 'tmilvertone'),
  (8904, '2014-12-01', 1746, 1, 8, 2, '19698857524', 'codempsey6'),
  (8940, '2014-03-20', 1126, 0.5, 3, 3, '48963435531', 'iallkins4'),
  (9944, '2014-12-30', 1200.5, 0.5, 3, 3, '66437551197', 'mconnar3');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `dirbapadalinyje`
--

CREATE TABLE `dirbapadalinyje` (
  `Padalinys_Inventorinis_numeris` int(11) NOT NULL,
  `Darbuotojas_Tabelio_nr` int(11) NOT NULL,
  PRIMARY KEY (`Padalinys_Inventorinis_numeris`,`Darbuotojas_Tabelio_nr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `dirbapadalinyje`
--

INSERT INTO `dirbapadalinyje` (`Padalinys_Inventorinis_numeris`, `Darbuotojas_Tabelio_nr`) VALUES
  (906, 2355),
  (906, 4762),
  (906, 5046),
  (906, 8457),
  (929, 2353),
  (929, 3062),
  (929, 3974),
  (929, 6732),
  (929, 6812),
  (933, 3258),
  (933, 4135),
  (933, 6000),
  (933, 8586),
  (933, 8904),
  (937, 4133),
  (937, 4901),
  (937, 5162),
  (937, 5970),
  (937, 6245),
  (937, 9944),
  (966, 5181),
  (966, 5541),
  (966, 5898),
  (966, 8940);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `kategorija`
--

CREATE TABLE `kategorija` (
  `Kategorija_id` int(11) NOT NULL AUTO_INCREMENT,
  `Kategorijos_pavadinimas` varchar(50) NOT NULL,
  `KategorijaEN` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Kategorija_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `kategorija`
--

INSERT INTO `kategorija` (`Kategorija_id`, `Kategorijos_pavadinimas`, `KategorijaEN`) VALUES
  (1, 'Puslaidininkiai', 'Semiconductiors'),
  (2, 'Pasyviniai komponentai', 'Passive components'),
  (3, 'Automatikos komponentai', 'Automation components'),
  (4, 'Jungtys', 'Connectors'),
  (5, 'Jungikliai', 'Switches'),
  (6, 'Garso ir vaizdo technikos serviso - remonto detalė', 'TV, VIDEO, AUDIO equipments parts'),
  (7, 'Distancinio valdymo pultai', 'Remote controls'),
  (8, 'Buities technikos serviso dalys', 'Household equipment parts'),
  (9, 'Robotika, atvirojo kodo elektronika', 'Robotics and open source electronics'),
  (10, 'Apšvietimo technika', 'Light equipment and components'),
  (11, 'Apsaugos sistemos', 'Security systems'),
  (12, 'Matavimo prietaisai, programatoriai', 'Measurement devices, programmers'),
  (13, 'Kabeliai, laidai, instaliacijos priedai', 'Cabels, wires, instalation devices'),
  (14, 'Medžiagos', 'Materials'),
  (15, 'Akumuliatoriai', 'Recharchable batteries'),
  (16, 'Baterijos', 'Batteries'),
  (17, 'Maitinimo šaltiniai', 'Chargers'),
  (18, 'Transformatoriai', 'Transformers'),
  (19, 'Saulės ir vėjo energijos šaltiniai', 'Solar and wind power supplies');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `padalinio_produktas`
--

CREATE TABLE `padalinio_produktas` (
  `Kiekis` double NOT NULL,
  `Produktas_Barkodas` int(11) NOT NULL,
  `Padalinys_Inventorinis_numeris` int(11) NOT NULL,
  PRIMARY KEY (`Produktas_Barkodas`,`Padalinys_Inventorinis_numeris`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `padalinio_produktas`
--

INSERT INTO `padalinio_produktas` (`Kiekis`, `Produktas_Barkodas`, `Padalinys_Inventorinis_numeris`) VALUES
  (100, 11483, 933),
  (9, 11993, 906),
  (2, 12363, 906),
  (11, 12833, 933),
  (16, 12883, 929),
  (80, 14083, 966),
  (5, 14173, 966),
  (69, 14923, 933),
  (15, 15203, 906),
  (18, 16053, 937),
  (78, 16113, 906),
  (100, 16223, 906),
  (70, 16603, 933),
  (30, 16753, 906),
  (15, 16933, 929),
  (60, 17783, 937),
  (14, 18333, 929),
  (6, 18433, 929),
  (90, 18593, 966),
  (210, 18873, 966),
  (121, 18993, 906),
  (52, 20093, 937),
  (111, 21323, 906),
  (6, 22803, 906),
  (8, 22883, 929),
  (22, 23123, 906),
  (50, 23133, 966),
  (81, 23753, 966),
  (20, 23773, 933),
  (28, 24143, 906),
  (10, 24653, 933),
  (85, 26343, 966),
  (33, 27193, 933),
  (2, 27393, 906),
  (96, 27433, 929),
  (12, 27773, 937),
  (56, 27993, 937),
  (150, 28863, 929),
  (56, 29403, 929),
  (110, 29503, 906);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `padalinys`
--

CREATE TABLE `padalinys` (
  `Inventorinis_numeris` int(11) NOT NULL,
  `Salis` varchar(100) NOT NULL,
  `Miestas` varchar(45) NOT NULL,
  `Regionas` varchar(45) DEFAULT NULL,
  `Rajonas` varchar(50) DEFAULT NULL,
  `Gatve` varchar(100) NOT NULL,
  `padalinio_pavadinimas` varchar(100) NOT NULL,
  `SalisEN` varchar(100) DEFAULT NULL,
  `Pasto_kodas` int(11) NOT NULL,
  `Ilguma` double NOT NULL,
  `Platuma` double NOT NULL,
  `Redaktorius` int(11) NOT NULL,
  PRIMARY KEY (`Inventorinis_numeris`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `padalinys`
--

INSERT INTO `padalinys` (`Inventorinis_numeris`, `Salis`, `Miestas`, `Regionas`, `Rajonas`, `Gatve`, `padalinio_pavadinimas`, `SalisEN`, `Pasto_kodas`, `Ilguma`, `Platuma`, `Redaktorius`) VALUES
  (906, 'Lietuva', 'Elektrėnai', 'Aukštaitija', 'Vilnius', '0545 Magdeline Hill', 'Realpoint', 'Lithuania', 394080, 34.5, 27.7, 3062),
  (929, 'Vokietija', 'Presfeldas', 'Berlynas', 'Berlynas', '2 Bunting Point', 'Thoughtsphere', 'Germany', 77602, 37.56, 19.131, 9944),
  (933, 'Prancūzija', 'Esonas', 'II de Fransas', 'Paryžiaus', '64 Warrior Road', 'Skimia', 'France', 50404, 26.385, 28.53, 2355),
  (937, 'Latvija', 'karsava', 'Vidžemė', 'Rygos', '3972 Mallard Trail', 'Jabbersphere', 'Latvia', 452719, 49.25, 33.42, 5898),
  (966, 'Lenkija', 'Zamoscė', 'Mazovija', 'Varšuvos', '56877 Cascade Avenue', 'Jaxbean', 'Poland', 456209, 36.15, 27.15, 6000);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `produktas`
--

CREATE TABLE `produktas` (
  `Barkodas` int(11) NOT NULL,
  `Pavadinimas` varchar(50) NOT NULL,
  `Vieneto_kaina` decimal(10,0) NOT NULL,
  `Aprasymas` varchar(200) DEFAULT NULL,
  `Matavimo_vnt` varchar(45) DEFAULT NULL,
  `Gamintojas` varchar(45) NOT NULL,
  `PavadinimasEN` varchar(50) DEFAULT NULL,
  `AprasymasEN` varchar(45) DEFAULT NULL,
  `Pagaminimo_data` datetime NOT NULL,
  `Galioja_iki` datetime NOT NULL,
  `Tiekiama` tinyint(1) NOT NULL,
  `Kategorija_Kategorija_id` int(11) NOT NULL,
  PRIMARY KEY (`Barkodas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `produktas`
--

INSERT INTO `produktas` (`Barkodas`, `Pavadinimas`, `Vieneto_kaina`, `Aprasymas`, `Matavimo_vnt`, `Gamintojas`, `PavadinimasEN`, `AprasymasEN`, `Pagaminimo_data`, `Galioja_iki`, `Tiekiama`, `Kategorija_Kategorija_id`) VALUES
  (11483, 'Transformatorius', '620', '230V/24V su kontaktinėmis kaladėlėmis INDEL.', '', 'Eire', '', '', '2016-05-30 00:00:00', '2022-01-02 00:00:00', 1, 18),
  (11993, 'Unversalus DV pultas su LCD', '236', '', '', 'Livefish', '', '', '2017-05-30 00:00:00', '2023-08-27 00:00:00', 0, 7),
  (12363, 'Multimetras', '251', 'Su dažnio, talpos matavimu, nuolatinės grandinės, diodų tiktinumu UNI-T.', '', 'Quatz', '', '', '0000-00-00 00:00:00', '2024-12-25 00:00:00', 1, 12),
  (12833, 'Kabelis FTP', '55', 'CAT6e LAN su jungtimis, raudonas.', 'm', 'Twimbo', '', '', '2017-05-30 00:00:00', '2026-07-12 00:00:00', 1, 13),
  (12883, 'Elektronikos komponentų rinkinys 1', '646', 'Darbui su Rasberry pi, 24 rūšys.', '', 'Realbuzz', '', '', '2017-05-30 00:00:00', '2027-07-23 00:00:00', 1, 9),
  (14083, 'Universalus DV pultas', '976', '', '', 'Eare', '', '', '2017-01-30 00:00:00', '2025-03-29 00:00:00', 0, 7),
  (14173, 'Judesio jutiklis išmanus ZigBee', '91', '2.4GHz CVMORE', '', 'Youopia', '', '', '2017-05-30 00:00:00', '2024-06-02 00:00:00', 1, 11),
  (14923, 'Baterija R20', '177', '', 'Cilindrinė baterija 1.5V', 'Oyonder', '', '', '2017-05-30 00:00:00', '2021-02-09 00:00:00', 0, 16),
  (15203, 'Kabelis S/FTP', '130', 'CAT6 LAN su jungtimi', 'm', 'Skyba', '', '', '2017-05-30 00:00:00', '2025-11-06 00:00:00', 1, 13),
  (16053, 'HDMI jungtis', '752', '', '', 'Tagcat', '', '', '2017-05-30 00:00:00', '2026-01-27 00:00:00', 1, 4),
  (16113, 'Ličio baterija', '495', 'Diskinė baterija CR1220 3V', '', 'Lajo', '', '', '2017-05-30 00:00:00', '2027-06-29 00:00:00', 1, 16),
  (16223, 'Rezistorius', '993', '', '', 'Mymm', '', '', '2017-05-30 00:00:00', '2022-03-26 00:00:00', 1, 2),
  (16603, 'Lazerinė galvutė SFHD850', '390', '', '', 'Blognation', '', '', '2017-05-30 00:00:00', '2022-10-21 00:00:00', 1, 6),
  (16753, 'Jungtis LED juostai 4 kontaktų', '476', 'Su laidais.', '', 'Kwimbee', '', '', '2017-05-30 00:00:00', '2019-04-02 00:00:00', 0, 10),
  (16933, 'XLR jungtis', '169', '', '', 'Feedspan', '', '', '2017-05-30 00:00:00', '2021-01-07 00:00:00', 0, 4),
  (17783, 'Lanksti jungtis 16pin 17x65mm', '449', '', 'mm', 'Fanoodle', '', '', '2017-05-30 00:00:00', '2024-06-10 00:00:00', 1, 6),
  (18333, 'Minidroselis', '894', '', '', 'Roomm', '', '', '0000-00-00 00:00:00', '2026-02-02 00:00:00', 1, 18),
  (18433, 'Šliaužiklinis jungiklis', '60', '', '', 'Zoomcast', '', '', '2017-05-30 00:00:00', '2027-02-01 00:00:00', 1, 5),
  (18593, 'Skalbyklės amortizatorius', '846', 'Su kaisčiais', '', 'Jamia', '', '', '2017-05-30 00:00:00', '2025-05-14 00:00:00', 0, 8),
  (18873, 'Krovimo valdiklis', '35', 'Saulės baterijoms.', '', 'Photolist', '', '', '2016-05-30 00:00:00', '2023-09-13 00:00:00', 1, 19),
  (18993, 'Tranzistorius', '897', '', '', 'Devcast', '', '', '2017-05-30 00:00:00', '2024-04-03 00:00:00', 1, 1),
  (20093, 'Elektronikos komponentų rinkinys 2', '118', 'Darbui su Rasberry pi, 18 rūšių.', '', 'Skipstorm', '', '', '2017-05-30 00:00:00', '2019-06-11 00:00:00', 1, 9),
  (21323, 'Saulės baterijos polikristalinis modulis', '412', '20W 17.5V 1.14A', '', 'Minyx', '', '', '2016-05-30 00:00:00', '2023-07-07 00:00:00', 1, 19),
  (22803, 'Izoliacinė juosta', '24', 'Juoda.', 'm', 'Meedoo', '', '', '2017-05-30 00:00:00', '2024-10-23 00:00:00', 1, 14),
  (22883, 'Silikoninis valiklis', '410', 'Danga tepimui ir apsaugai.', '', 'Yodo', '', '', '2017-05-30 00:00:00', '2021-03-08 00:00:00', 1, 14),
  (23123, 'Klavišinis jungiklis', '758', '', '', 'Agivu', '', '', '2017-05-30 00:00:00', '2021-07-29 00:00:00', 0, 5),
  (23133, 'Relė', '944', '', '', 'Babblestorm', '', '', '2017-05-30 00:00:00', '2020-08-27 00:00:00', 1, 3),
  (23753, 'Nepertraukiamo maitinimo šaltinis', '589', '700W 12V/230Vac sinusas.', '', 'Aivee', '', '', '2017-05-30 00:00:00', '2021-12-24 00:00:00', 1, 17),
  (23773, 'Transformatorius', '628', '', '', 'Skidoo', '', '', '2017-05-30 00:00:00', '2026-01-19 00:00:00', 1, 3),
  (24143, 'Signalizacijos laidas', '736', 'YTDY 14x0.5mm', 'mm', 'Zoovu', '', '', '2017-05-30 00:00:00', '2023-03-21 00:00:00', 1, 11),
  (24653, 'Mikroschema', '163', '', '', 'Myworks', '', '', '2017-01-30 00:00:00', '2027-05-30 00:00:00', 1, 1),
  (26343, 'Skalbyklės kaitinimo elementas 1850W', '890', 'Plastikiniam bakui.', '', 'Livetube', '', '', '2017-05-30 00:00:00', '2024-09-10 00:00:00', 1, 8),
  (27193, 'LAD modulis 12V', '914', '0.72W, 3xSMD5050 RGB IP67', '', 'Yodo', '', '', '2017-05-30 00:00:00', '2023-03-15 00:00:00', 1, 10),
  (27393, 'Akumuliatorius', '492', '12V 460W Pb CSB reserviniam matinimui.', '', 'Ntags', '', '', '2017-05-30 00:00:00', '2026-09-30 00:00:00', 1, 15),
  (27433, 'Akumuliatorius 2', '522', '12V 150Ah Pb CSB ryšių ir energetikos sistemoms', '', 'Twitterwire', '', '', '2015-05-30 00:00:00', '2020-05-18 00:00:00', 1, 15),
  (27773, 'Toriodinis transformatorius', '762', '', '', 'Zoozzy', '', '', '2016-05-30 00:00:00', '2020-02-01 00:00:00', 1, 18),
  (27993, 'Termometras su ilgu davikliu', '185', 'Metalinis korpusas.', '', 'Omba', '', '', '2017-05-30 00:00:00', '2020-06-05 00:00:00', 1, 12),
  (28863, 'Saulės baterijos elementas', '826', '5V 100mA 0.5W', '', 'Livetube', '', '', '2016-05-30 00:00:00', '2023-11-20 00:00:00', 1, 19),
  (29403, 'Impulsinis maitinimo šaltinis', '539', 'Medicininis maitinimo šaltinis. 5V 11A atviras Mean Well.', '', 'Voonder', '', '', '2016-05-30 00:00:00', '2020-11-04 00:00:00', 1, 17),
  (29503, 'Jungtis - perėjimas', '799', '1Xlizdas - 2xkištukai (minusinis)', '', 'Vinder', '', '', '2016-05-30 00:00:00', '2019-09-10 00:00:00', 1, 19);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `rangas`
--

CREATE TABLE `rangas` (
  `rangai` varchar(45) NOT NULL,
  `RangaiEN` varchar(45) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `rangas`
--

INSERT INTO `rangas` (`rangai`, `RangaiEN`, `id`) VALUES
  ('Administratorius', 'Administrator', 1),
  ('Redaktorius', 'Editor', 2),
  ('Darbuotojas', 'Worker', 3);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `registracija`
--

CREATE TABLE `registracija` (
  `Prisijungimo_vardas` varchar(100) NOT NULL,
  `Slaptazodis` varchar(200) NOT NULL,
  `Prisijungimo_klausimas` varchar(100) NOT NULL,
  `Prisijungimo_atsakymas` varchar(50) NOT NULL,
  PRIMARY KEY (`Prisijungimo_vardas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `registracija`
--

INSERT INTO `registracija` (`Prisijungimo_vardas`, `Slaptazodis`, `Prisijungimo_klausimas`, `Prisijungimo_atsakymas`) VALUES
  ('aannablet', 'Rzddpyh6Pp', 'Koks mano tėčio vardas?', 'Vilija'),
  ('amarling2', 'TBoxO0VS', 'Koks mano mamos vardas?', 'Marija'),
  ('amarrisonj', 'Dw1OvHpVY', 'Koks mano antros eilės puseserės vardas?', 'Sibelija'),
  ('amurrowf', 'GRxokiAJCH', 'Kokia mano mamos mergautinė pavardė?', 'Cimblerytė'),
  ('bdavidsohn9', 'xVlBLY0gt', 'Koks mano brolio vardas?', 'Petras'),
  ('bfitzerm', 's90URqznAYIj', 'Koks mano senelio vardas?', 'Kristupas'),
  ('bstreten', '4AJaf2gwIaL7', 'Koks mano senelio vardas?', 'Darius'),
  ('codempsey6', 'uuAThkjDDH6', 'Koks mano mamos vardas?', 'Liuka'),
  ('dbeazeyp', 'TwL7vuUn', 'Koks mano senelės vardas?', 'Julijona'),
  ('dodam5', 'fFKJJbqiW', 'Koks mano mamos vardas?', 'Luka'),
  ('eolehanec', '722csrJcR', 'Kokia mano mamos mergautinė pavardė?', 'Deksterytė'),
  ('eyackiminied', 'GKNjYP', 'Kokia mano mamos mergautinė pavardė?', 'Derblytė'),
  ('iallkins4', 'kGMDoaU', 'Koks mano mamos vardas?', 'Felicija'),
  ('ichetwind8', 'VLiwp5rluf', 'Koks mano brolio vardas?', 'Jonas'),
  ('jmarcq', '2mWKVxYD', 'Koks mano senelės vardas?', 'Julija'),
  ('jparkman1', 'BrZnYRz8CcPi', 'Koks mano mamos vardas?', 'Sigita'),
  ('kmarlork', 'Lctb2R1qpt', 'Koks mano antros eilės puseserės vardas?', 'Inga'),
  ('labberley0', '7QzR7o', 'Koks mano mamos vardas?', 'Alina'),
  ('mbowrar', 'eDzdaT', 'Koks mano tėčio vardas?', 'Vilma'),
  ('mconnar3', 'PSQjoON', 'Koks mano mamos vardas?', 'Jovita'),
  ('medlinb', '0CX7Dk5R46', 'Koks mano brolio vardas?', 'Deividas'),
  ('mjudkinss', 'hPmQHXBk', 'Koks mano tėčio vardas?', 'Vilija'),
  ('nclaypolei', 'NMGiZfq2Syb', 'Koks mano antros eilės puseserės vardas?', 'Gintarė'),
  ('pfilesl', 'Q6FU7ZXtc2O', 'Koks mano senelio vardas?', 'Kristupas'),
  ('pjuraszh', '1K0lKQI', 'Koks mano antros eilės puseserės vardas?', 'Aušra'),
  ('rsilvestono', 'arKDzHqs2LJ', 'Koks mano senelės vardas?', 'Genia'),
  ('sromanellia', 'p5UPWFCO', 'Koks mano brolio vardas?', 'Lukas'),
  ('sskoateg', 'McLi4DpU', 'Kokia mano mamos mergautinė pavardė?', 'Ragenytė'),
  ('tmilvertone', 'CrUUKttN3lBd', 'Kokia mano mamos mergautinė pavardė?', 'Apkepaitė'),
  ('traulin7', 'adminas1', 'Koks mano brolio vardas?', 'Tadas');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `transporto_busena`
--

CREATE TABLE `transporto_busena` (
  `Busenos_id` int(11) NOT NULL AUTO_INCREMENT,
  `Busena` varchar(45) NOT NULL,
  `BusenaEN` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Busenos_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `transporto_busena`
--

INSERT INTO `transporto_busena` (`Busenos_id`, `Busena`, `BusenaEN`) VALUES
  (1, 'Užimta', 'Occupied'),
  (2, 'Laisva', 'Free'),
  (3, 'Remonte', 'Under repair');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `transporto_priemone`
--

CREATE TABLE `transporto_priemone` (
  `Valstybinis_nr` varchar(100) NOT NULL,
  `Plotis` double NOT NULL,
  `Aukstis` double NOT NULL,
  `Modelis` varchar(50) NOT NULL,
  `Marke` varchar(45) DEFAULT NULL,
  `Galia` double NOT NULL,
  `Rida` int(11) NOT NULL,
  `Draudimas_galioja_nuo` date NOT NULL,
  `Draudimas_galioja_iki` date NOT NULL,
  `Apziura_galioja_nuo` date NOT NULL,
  `Apziura_galioja_iki` date NOT NULL,
  `Pagaminimo_metai` year(4) NOT NULL,
  `Kuro_tipas` varchar(45) NOT NULL,
  `Svoris` double NOT NULL,
  `Sedimu_vt_sk` int(11) DEFAULT NULL,
  `Variklio_darbinis_turis` double DEFAULT NULL,
  `Didziausias_leidz_svoris` double NOT NULL,
  `Spalva` varchar(45) DEFAULT NULL,
  `Transporto_busena_Busenos_id` int(11) NOT NULL,
  `Vairavimo_kategorija_Kategorijos_id` int(11) NOT NULL,
  PRIMARY KEY (`Valstybinis_nr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `transporto_priemone`
--

INSERT INTO `transporto_priemone` (`Valstybinis_nr`, `Plotis`, `Aukstis`, `Modelis`, `Marke`, `Galia`, `Rida`, `Draudimas_galioja_nuo`, `Draudimas_galioja_iki`, `Apziura_galioja_nuo`, `Apziura_galioja_iki`, `Pagaminimo_metai`, `Kuro_tipas`, `Svoris`, `Sedimu_vt_sk`, `Variklio_darbinis_turis`, `Didziausias_leidz_svoris`, `Spalva`, `Transporto_busena_Busenos_id`, `Vairavimo_kategorija_Kategorijos_id`) VALUES
  ('AAA-512', 2.42, 2.56, 'Civic', 'Honda', 476, 3878, '2017-07-07', '2018-12-15', '2016-04-22', '2018-03-21', 1999, 'Dyzelinis', 77, 3, 377, 21, 'Fuscia', 1, 15),
  ('BMI-168', 2, 2.56, 'Sienna', 'Toyota', 647, 9898, '2017-08-31', '2018-11-11', '2016-09-29', '2018-08-11', 2012, 'Dyzelinis', 52, 5, 388, 22, 'Orange', 1, 20),
  ('CBS-752', 2, 2.42, 'New Beetle', 'Volkswagen', 692, 6515, '2017-12-21', '2018-09-21', '2016-08-07', '2018-06-07', 2004, 'Dyzelinis', 91, 3, 399, 21, 'Fuscia', 1, 20),
  ('CXW-110', 2, 2.56, 'Laser', 'Ford', 623, 6228, '2017-11-22', '2018-12-22', '2016-02-07', '2018-12-30', 1984, 'Dyzelinis', 68, 3, 359, 21, 'Purple', 2, 9),
  ('DGE-168', 3, 2.56, 'TL', 'Acura', 700, 3401, '2017-06-01', '2018-06-08', '2016-11-28', '2018-07-19', 1995, 'Dyzelinis', 92, 4, 376, 24, 'Goldenrod', 1, 12),
  ('EEI-457', 2, 2.42, 'Rio', 'Kia', 517, 7411, '2017-10-20', '2018-04-12', '2016-11-07', '2018-07-03', 2011, 'Dyzelinis', 43, 5, 374, 21, 'Turquoise', 1, 15),
  ('EGH-369', 2, 2, 'CL-Class', 'Mercedes-Benz', 642, 2881, '2017-04-23', '2018-02-04', '2016-03-23', '2018-11-29', 2000, 'Dyzelinis', 30, 2, 379, 23, 'Mauv', 1, 12),
  ('EMF-001', 3.14, 2.14, 'Pacifica', 'Chrysler', 593, 7896, '2017-12-01', '2018-12-16', '2016-02-18', '2018-04-03', 2006, 'Dyzelinis', 80, 3, 385, 22, 'Crimson', 2, 12),
  ('EMK-568', 2, 2.41, 'Forte', 'Kia', 578, 5856, '2017-08-25', '2018-02-11', '2016-07-08', '2018-11-07', 2011, 'Dyzelinis', 39, 5, 354, 22, 'Goldenrod', 1, 15),
  ('EVF-854', 3, 2.42, 'Esprit', 'Lotus', 536, 2863, '2017-06-10', '2018-02-08', '2016-07-30', '2018-01-07', 1993, 'Dyzelinis', 38, 5, 397, 21, 'Fuscia', 2, 12),
  ('FNT-987', 3, 2.42, 'Wrangler', 'Jeep', 668, 8554, '2017-08-31', '2018-11-16', '2016-05-27', '2018-08-24', 2007, 'Dyzelinis', 29, 3, 376, 20, 'Maroon', 2, 12),
  ('FSA-264', 3, 2.14, 'Sequoia', 'Toyota', 491, 8083, '2017-02-05', '2018-04-02', '2016-06-25', '2018-08-11', 2006, 'Dyzelinis', 88, 3, 354, 21, 'Indigo', 1, 20),
  ('HLF-347', 2, 2.14, 'CL-Class', 'Mercedes-Benz', 569, 4838, '2017-02-12', '2018-10-26', '2016-08-24', '2018-08-30', 2009, 'Dyzelinis', 7, 4, 380, 20, 'Khaki', 2, 20),
  ('HLM-558', 3, 2, 'Explorer Sport Trac', 'Ford', 676, 4780, '2017-11-19', '2018-02-17', '2016-05-11', '2018-04-20', 2005, 'Dyzelinis', 73, 4, 379, 22, 'Indigo', 1, 8),
  ('IFN-673', 3, 2.14, 'J', 'Infiniti', 656, 6740, '2017-11-10', '2018-06-25', '2016-10-21', '2018-02-15', 1995, 'Dyzelinis', 53, 2, 386, 24, 'Goldenrod', 2, 12),
  ('IMM-741', 3, 2.56, '164', 'Alfa Romeo', 573, 4668, '2017-08-17', '2018-05-06', '2016-03-25', '2018-04-28', 1993, 'Dyzelinis', 47, 3, 389, 22, 'Orange', 1, 15),
  ('LTM-254', 3, 2, 'Impreza', 'Subaru', 514, 8331, '2017-07-07', '2018-12-14', '2016-11-11', '2018-10-09', 1995, 'Dyzelinis', 34, 2, 369, 21, 'Crimson', 2, 11),
  ('MHO-268', 3, 2.41, 'Tercel', 'Toyota', 453, 9296, '2017-10-21', '2018-08-02', '2016-11-22', '2018-05-02', 1996, 'Dyzelinis', 39, 4, 373, 22, 'Puce', 3, 11),
  ('MNS-134', 2, 2.41, 'Outlander', 'Mitsubishi', 466, 8020, '2017-05-16', '2018-10-13', '2016-01-14', '2018-03-23', 2003, 'Dyzelinis', 57, 2, 393, 22, 'Teal', 3, 15),
  ('PBC-458', 3, 2.14, 'B-Series Plus', 'Mazda', 591, 7956, '2017-03-03', '2018-09-04', '2016-07-06', '2018-12-29', 1997, 'Dyzelinis', 24, 2, 390, 20, 'Yellow', 2, 8),
  ('REA-222', 2, 2, 'Ram Van 2500', 'Dodge', 678, 9962, '2017-07-08', '2018-01-27', '2016-09-19', '2018-11-14', 2001, 'Dyzelinis', 98, 5, 388, 22, 'Indigo', 2, 9),
  ('SAN-077', 3, 2.14, 'Pathfinder', 'Nissan', 470, 5332, '2017-12-17', '2018-10-19', '2016-11-30', '2018-10-19', 1993, 'Dyzelinis', 8, 2, 369, 21, 'Violet', 1, 20),
  ('SPI-875', 2, 2.42, 'Cherokee', 'Jeep', 543, 5417, '2017-01-06', '2018-01-02', '2016-02-20', '2018-09-22', 2000, 'Dyzelinis', 46, 5, 377, 22, 'Fuscia', 2, 11),
  ('STP-456', 2, 2, 'Legacy', 'Subaru', 689, 8026, '2017-09-03', '2018-03-25', '2016-09-10', '2018-06-20', 1999, 'Dyzelinis', 30, 3, 376, 21, 'Violet', 2, 11),
  ('STR-582', 2, 2.56, 'Neon', 'Dodge', 535, 5845, '2017-11-19', '2018-10-25', '2016-09-12', '2018-09-19', 1995, 'Dyzelinis', 54, 2, 395, 20, 'Orange', 1, 11),
  ('SUN-247', 3, 2, 'F250', 'Ford', 592, 5567, '2017-04-15', '2018-10-17', '2016-07-22', '2018-02-03', 1984, 'Dyzelinis', 9, 2, 400, 22, 'Pink', 2, 15),
  ('SVG-458', 3, 2.42, 'Yukon XL 1500', 'GMC', 524, 8957, '2017-02-08', '2018-04-23', '2016-12-02', '2018-10-21', 2012, 'Dyzelinis', 72, 5, 371, 24, 'Aquamarine', 3, 20),
  ('TEI-225', 2, 2.42, '928', 'Porsche', 669, 1701, '2017-06-26', '2018-08-26', '2016-03-06', '2018-05-22', 1995, 'Dyzelinis', 13, 2, 375, 23, 'Orange', 1, 15),
  ('TYF-445', 3, 2, 'Sable', 'Mercury', 643, 5746, '2017-11-06', '2018-09-10', '2016-10-12', '2018-02-09', 2002, 'Dyzelinis', 64, 5, 396, 21, 'Yellow', 1, 15),
  ('ZSA-587', 3, 2.56, '3500', 'Ram', 653, 1323, '2017-03-15', '2018-05-05', '2016-01-26', '2018-07-02', 2012, 'Dyzelinis', 61, 5, 355, 23, 'Red', 2, 9);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `uzsakymas`
--

CREATE TABLE `uzsakymas` (
  `Numeris` int(11) NOT NULL AUTO_INCREMENT,
  `Uzsakymo_data` datetime NOT NULL,
  `Atlikimo_data` datetime DEFAULT NULL,
  `Prioritetas` int(11) NOT NULL DEFAULT '0',
  `Busena` int(11) NOT NULL,
  `Suformavo` int(11) NOT NULL,
  `Vairuotojas` int(11) DEFAULT NULL,
  `TransportoPriemone` varchar(100) DEFAULT NULL,
  `IsPadalinio` int(11) NOT NULL,
  `IPadalini` int(11) NOT NULL,
  PRIMARY KEY (`Numeris`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `uzsakymas`
--

INSERT INTO `uzsakymas` (`Numeris`, `Uzsakymo_data`, `Atlikimo_data`, `Prioritetas`, `Busena`, `Suformavo`, `Vairuotojas`, `TransportoPriemone`, `IsPadalinio`, `IPadalini`) VALUES
  (1, '2017-03-27 00:00:00', '2018-06-01 00:00:00', 0, 3, 5046, 79, 'AAA-512', 906, 933),
  (2, '2017-04-22 00:00:00', '2018-02-16 00:00:00', 0, 3, 8904, 68, 'CXW-110', 933, 906),
  (3, '2017-12-11 00:00:00', NULL, 0, 1, 5046, NULL, NULL, 906, 966),
  (4, '2017-01-27 00:00:00', NULL, 0, 4, 5162, NULL, NULL, 937, 966),
  (5, '2017-04-06 00:00:00', NULL, 0, 2, 5046, NULL, NULL, 906, 966),
  (6, '2017-07-14 00:00:00', NULL, 0, 1, 5162, NULL, NULL, 933, 906),
  (7, '2017-07-03 00:00:00', '2018-10-18 00:00:00', 0, 3, 2353, 65, 'BMI-168', 906, 937),
  (8, '2017-09-15 00:00:00', '2018-02-18 00:00:00', 0, 3, 5046, 65, 'CBS-752', 906, 933),
  (9, '2017-10-08 00:00:00', NULL, 0, 4, 2353, NULL, NULL, 966, 937),
  (10, '2017-11-15 00:00:00', NULL, 0, 4, 8904, NULL, NULL, 906, 966);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `uzsakymo_produktas`
--

CREATE TABLE `uzsakymo_produktas` (
  `Kiekis` int(11) NOT NULL,
  `Produktas_Barkodas` int(11) NOT NULL,
  `Uzsakymas_Numeris` int(11) NOT NULL,
  PRIMARY KEY (`Produktas_Barkodas`,`Uzsakymas_Numeris`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `uzsakymo_produktas`
--

INSERT INTO `uzsakymo_produktas` (`Kiekis`, `Produktas_Barkodas`, `Uzsakymas_Numeris`) VALUES
  (10, 11483, 2),
  (6, 11993, 3),
  (2, 12363, 1),
  (2, 12833, 6),
  (1, 14173, 9),
  (5, 15203, 5),
  (3, 16053, 4),
  (12, 16113, 7),
  (39, 16223, 8),
  (10, 16753, 10);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `vairavimo_kategorija`
--

CREATE TABLE `vairavimo_kategorija` (
  `Kategorijos_id` int(11) NOT NULL,
  `kategorija` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Kategorijos_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `vairavimo_kategorija`
--

INSERT INTO `vairavimo_kategorija` (`Kategorijos_id`, `kategorija`) VALUES
  (5, 'C1'),
  (7, 'BE'),
  (8, 'B1'),
  (9, 'DE'),
  (11, 'D1'),
  (12, 'D1E'),
  (13, 'B'),
  (15, 'C'),
  (20, 'D'),
  (21, 'T'),
  (22, 'C1E'),
  (24, 'CE');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `vairuotojas`
--

CREATE TABLE `vairuotojas` (
  `Tabelio_nr` int(11) NOT NULL,
  `Vairavimo_stazas` double DEFAULT NULL,
  `Prasizengimu_sk` int(11) DEFAULT NULL,
  `Profesine_kvalifikacija` varchar(100) DEFAULT NULL,
  `Technografo_kortele` tinyint(1) NOT NULL,
  `Registracija_Prisijungimo_vardas` varchar(100) NOT NULL,
  `Asmuo_AsmensKodas` varchar(11) NOT NULL,
  `Vairuotoju_teises_Numeris` int(11) NOT NULL,
  PRIMARY KEY (`Tabelio_nr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `vairuotojas`
--

INSERT INTO `vairuotojas` (`Tabelio_nr`, `Vairavimo_stazas`, `Prasizengimu_sk`, `Profesine_kvalifikacija`, `Technografo_kortele`, `Registracija_Prisijungimo_vardas`, `Asmuo_AsmensKodas`, `Vairuotoju_teises_Numeris`) VALUES
  (51, 2, NULL, 'Pradinė', 0, 'amarling2', '86077105670', 804),
  (52, 1, NULL, 'Pradinė', 0, 'bfitzerm', '97796482293', 868),
  (62, 1, 1, 'Pradinė', 1, 'aannablet', '83650112977', 802),
  (65, 10, 1, 'Periodinė', 1, 'bdavidsohn9', '94324857165', 855),
  (68, 0.5, NULL, 'Pradinė', 1, 'amarrisonj', '89461397757', 807),
  (79, 1.5, NULL, 'Pradinė', 1, 'amurrowf', '93553050615', 848);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `vairuotojo_kategorijos`
--

CREATE TABLE `vairuotojo_kategorijos` (
  `Vairuotoju_teises_Numeris` int(11) NOT NULL,
  `Vairavimo_kategorija_Kategorijos_id` int(11) NOT NULL,
  PRIMARY KEY (`Vairuotoju_teises_Numeris`,`Vairavimo_kategorija_Kategorijos_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `vairuotojo_kategorijos`
--

INSERT INTO `vairuotojo_kategorijos` (`Vairuotoju_teises_Numeris`, `Vairavimo_kategorija_Kategorijos_id`) VALUES
  (802, 5),
  (804, 7),
  (804, 8),
  (807, 9),
  (807, 11),
  (848, 12),
  (848, 13),
  (848, 15),
  (855, 20),
  (855, 21),
  (855, 22),
  (855, 24),
  (868, 7),
  (868, 8),
  (868, 9);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `vairuotoju_teises`
--

CREATE TABLE `vairuotoju_teises` (
  `Numeris` int(11) NOT NULL,
  `Galioja_nuo` date NOT NULL,
  `Galioja_iki` date NOT NULL,
  PRIMARY KEY (`Numeris`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Sukurta duomenų kopija lentelei `vairuotoju_teises`
--

INSERT INTO `vairuotoju_teises` (`Numeris`, `Galioja_nuo`, `Galioja_iki`) VALUES
  (802, '2007-10-15', '2017-10-15'),
  (804, '2007-06-01', '2017-06-01'),
  (807, '2007-09-17', '2017-09-17'),
  (848, '2007-10-25', '2017-10-25'),
  (855, '2006-08-02', '2016-08-02'),
  (868, '2007-05-04', '2017-05-04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `darbuotojas`
--
ALTER TABLE `darbuotojas`
  ADD KEY `fk_Darbuotojas_Rangas1_idx` (`Rangas_id`),
  ADD KEY `fk_Darbuotojas_Asmuo1_idx` (`Asmuo_AsmensKodas`),
  ADD KEY `fk_Darbuotojas_Registracija1_idx` (`Registracija_Prisijungimo_vardas`);

--
-- Indexes for table `dirbapadalinyje`
--
ALTER TABLE `dirbapadalinyje`
  ADD KEY `fk_Padalinys_has_Darbuotojas_Darbuotojas1_idx` (`Darbuotojas_Tabelio_nr`),
  ADD KEY `fk_Padalinys_has_Darbuotojas_Padalinys1_idx` (`Padalinys_Inventorinis_numeris`);

--
-- Indexes for table `padalinio_produktas`
--
ALTER TABLE `padalinio_produktas`
  ADD KEY `fk_Padalinio_produktas_Padalinys1_idx` (`Padalinys_Inventorinis_numeris`);

--
-- Indexes for table `padalinys`
--
ALTER TABLE `padalinys`
  ADD KEY `fk_Padalinys_Darbuotojas_idx` (`Redaktorius`);

--
-- Indexes for table `produktas`
--
ALTER TABLE `produktas`
  ADD KEY `fk_Produktas_Kategorija1_idx` (`Kategorija_Kategorija_id`);

--
-- Indexes for table `transporto_priemone`
--
ALTER TABLE `transporto_priemone`
  ADD KEY `fk_Transporto_priemone_Transporto_busena1_idx` (`Transporto_busena_Busenos_id`),
  ADD KEY `fk_Transporto_priemone_Vairavimo_kategorija1_idx` (`Vairavimo_kategorija_Kategorijos_id`);

--
-- Indexes for table `uzsakymas`
--
ALTER TABLE `uzsakymas`
  ADD KEY `fk_Uzsakymas_Busena1_idx` (`Busena`),
  ADD KEY `fk_Uzsakymas_Darbuotojas1_idx` (`Suformavo`),
  ADD KEY `fk_Uzsakymas_Vairuotojas1_idx` (`Vairuotojas`),
  ADD KEY `fk_Uzsakymas_Transporto_priemone1_idx` (`TransportoPriemone`),
  ADD KEY `fk_Uzsakymas_Padalinys1_idx` (`IsPadalinio`),
  ADD KEY `fk_Uzsakymas_Padalinys2_idx` (`IPadalini`);

--
-- Indexes for table `uzsakymo_produktas`
--
ALTER TABLE `uzsakymo_produktas`
  ADD KEY `fk_Uzsakymo_produktas_Uzsakymas1_idx` (`Uzsakymas_Numeris`);


--
-- Indexes for table `vairuotojas`
--
ALTER TABLE `vairuotojas`
  ADD KEY `fk_Vairuotojas_Registracija1_idx` (`Registracija_Prisijungimo_vardas`),
  ADD KEY `fk_Vairuotojas_Asmuo1_idx` (`Asmuo_AsmensKodas`),
  ADD KEY `fk_Vairuotojas_Vairuotoju_teises1_idx` (`Vairuotoju_teises_Numeris`);

--
-- Indexes for table `vairuotojo_kategorijos`
--
ALTER TABLE `vairuotojo_kategorijos`
  ADD KEY `fk_Vairuotoju_teises_has_Vairavimo_kategorija_Vairavimo_kat_idx` (`Vairavimo_kategorija_Kategorijos_id`),
  ADD KEY `fk_Vairuotoju_teises_has_Vairavimo_kategorija_Vairuotoju_te_idx` (`Vairuotoju_teises_Numeris`);

--
-- Apribojimai eksportuotom lentelėm
--

--
-- Apribojimai lentelei `darbuotojas`
--
ALTER TABLE `darbuotojas`
  ADD CONSTRAINT `fk_Darbuotojas_Asmuo1` FOREIGN KEY (`Asmuo_AsmensKodas`) REFERENCES `asmuo` (`AsmensKodas`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Darbuotojas_Rangas1` FOREIGN KEY (`Rangas_id`) REFERENCES `rangas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Darbuotojas_Registracija1` FOREIGN KEY (`Registracija_Prisijungimo_vardas`) REFERENCES `registracija` (`Prisijungimo_vardas`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Apribojimai lentelei `dirbapadalinyje`
--
ALTER TABLE `dirbapadalinyje`
  ADD CONSTRAINT `fk_Padalinys_has_Darbuotojas_Darbuotojas1` FOREIGN KEY (`Darbuotojas_Tabelio_nr`) REFERENCES `darbuotojas` (`Tabelio_nr`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Padalinys_has_Darbuotojas_Padalinys1` FOREIGN KEY (`Padalinys_Inventorinis_numeris`) REFERENCES `padalinys` (`Inventorinis_numeris`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Apribojimai lentelei `padalinio_produktas`
--
ALTER TABLE `padalinio_produktas`
  ADD CONSTRAINT `fk_Padalinio_produktas_Padalinys1` FOREIGN KEY (`Padalinys_Inventorinis_numeris`) REFERENCES `padalinys` (`Inventorinis_numeris`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Padalinio_produktas_Produktas1` FOREIGN KEY (`Produktas_Barkodas`) REFERENCES `produktas` (`Barkodas`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Apribojimai lentelei `padalinys`
--
ALTER TABLE `padalinys`
  ADD CONSTRAINT `fk_Padalinys_Darbuotojas` FOREIGN KEY (`Redaktorius`) REFERENCES `darbuotojas` (`Tabelio_nr`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Apribojimai lentelei `produktas`
--
ALTER TABLE `produktas`
  ADD CONSTRAINT `fk_Produktas_Kategorija1` FOREIGN KEY (`Kategorija_Kategorija_id`) REFERENCES `kategorija` (`Kategorija_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Apribojimai lentelei `transporto_priemone`
--
ALTER TABLE `transporto_priemone`
  ADD CONSTRAINT `fk_Transporto_priemone_Transporto_busena1` FOREIGN KEY (`Transporto_busena_Busenos_id`) REFERENCES `transporto_busena` (`Busenos_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Transporto_priemone_Vairavimo_kategorija1` FOREIGN KEY (`Vairavimo_kategorija_Kategorijos_id`) REFERENCES `vairavimo_kategorija` (`Kategorijos_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Apribojimai lentelei `uzsakymas`
--
ALTER TABLE `uzsakymas`
  ADD CONSTRAINT `fk_Uzsakymas_Busena1` FOREIGN KEY (`Busena`) REFERENCES `busena` (`Busenos_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Uzsakymas_Darbuotojas1` FOREIGN KEY (`Suformavo`) REFERENCES `darbuotojas` (`Tabelio_nr`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Uzsakymas_Padalinys1` FOREIGN KEY (`IsPadalinio`) REFERENCES `padalinys` (`Inventorinis_numeris`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Uzsakymas_Padalinys2` FOREIGN KEY (`IPadalini`) REFERENCES `padalinys` (`Inventorinis_numeris`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Uzsakymas_Transporto_priemone1` FOREIGN KEY (`TransportoPriemone`) REFERENCES `transporto_priemone` (`Valstybinis_nr`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Uzsakymas_Vairuotojas1` FOREIGN KEY (`Vairuotojas`) REFERENCES `vairuotojas` (`Tabelio_nr`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Apribojimai lentelei `uzsakymo_produktas`
--
ALTER TABLE `uzsakymo_produktas`
  ADD CONSTRAINT `fk_Uzsakymo_produktas_Produktas1` FOREIGN KEY (`Produktas_Barkodas`) REFERENCES `produktas` (`Barkodas`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Uzsakymo_produktas_Uzsakymas1` FOREIGN KEY (`Uzsakymas_Numeris`) REFERENCES `uzsakymas` (`Numeris`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Apribojimai lentelei `vairuotojas`
--
ALTER TABLE `vairuotojas`
  ADD CONSTRAINT `fk_Vairuotojas_Asmuo1` FOREIGN KEY (`Asmuo_AsmensKodas`) REFERENCES `asmuo` (`AsmensKodas`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Vairuotojas_Registracija1` FOREIGN KEY (`Registracija_Prisijungimo_vardas`) REFERENCES `registracija` (`Prisijungimo_vardas`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Vairuotojas_Vairuotoju_teises1` FOREIGN KEY (`Vairuotoju_teises_Numeris`) REFERENCES `vairuotoju_teises` (`Numeris`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Apribojimai lentelei `vairuotojo_kategorijos`
--
ALTER TABLE `vairuotojo_kategorijos`
  ADD CONSTRAINT `fk_Vairuotoju_teises_has_Vairavimo_kategorija_Vairavimo_kateg1` FOREIGN KEY (`Vairavimo_kategorija_Kategorijos_id`) REFERENCES `vairavimo_kategorija` (`Kategorijos_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Vairuotoju_teises_has_Vairavimo_kategorija_Vairuotoju_teis1` FOREIGN KEY (`Vairuotoju_teises_Numeris`) REFERENCES `vairuotoju_teises` (`Numeris`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
