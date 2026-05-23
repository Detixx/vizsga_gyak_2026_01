USE TermekBoltDb;
GO

INSERT INTO Diak (Azonosito, Nev, Email, Telefon) VALUES
('DIAK001', 'Kovács Anna', 'kovacs.anna@iskola.hu', '+36301234567'),
('DIAK002', 'Nagy Bence', 'nagy.bence@iskola.hu', '+36304561234'),
('DIAK003', 'Tóth Eszter', 'toth.eszter@iskola.hu', '+36701234567'),
('DIAK004', 'Szabó Dániel', 'szabo.daniel@iskola.hu', '+36701234598'),
('DIAK005', 'Varga Laura', 'varga.laura@iskola.hu', '+36305556677');
GO

INSERT INTO Termek (Nev, Leiras, Egysegar, Keszlet, Elerheto, KepFajlnev) VALUES
('Laptop', 'Hordozható számítógép tanuláshoz, beadandók készítéséhez és otthoni munkához.', 185000, 9, 1, 'laptop.jpg'),

('Tablet', 'Érintőképernyős eszköz jegyzeteléshez, olvasáshoz és online tananyagok használatához.', 95000, 14, 1, 'tablet.jpg'),

('Pendrive', '64 GB-os adathordozó fájlok, beadandók és tananyagok tárolásához.', 4500, 30, 1, 'pendrive.jpg'),

('Webkamera', 'Online órákhoz, videóhívásokhoz és digitális megbeszélésekhez használható kamera.', 18000, 10, 1, 'webkamera.jpg'),

('Fejhallgató', 'Mikrofonnal ellátott fejhallgató online tanuláshoz, nyelvórákhoz és videóhívásokhoz.', 12000, 22, 1, 'fejhallgato.jpg'),

('Billentyűzet', 'Kényelmes billentyűzet hosszabb gépelési feladatokhoz és programozáshoz.', 8500, 18, 1, 'billentyuzet.jpg'),

('Vezeték nélküli egér', 'Könnyen használható vezeték nélküli egér laptophoz és otthoni számítógéphez.', 6500, 20, 1, 'eger.jpg'),

('Egérpad', 'Csúszásmentes egérpad tanuláshoz, irodai munkához és otthoni számítógép-használathoz.', 2500, 25, 1, 'egerpad.jpg'),

('Laptop táska', 'Párnázott laptop táska hordozható számítógépek biztonságos szállításához.', 12000, 10, 1, 'laptop-taska.jpg'),

('USB-C töltő', 'Univerzális USB-C töltő laptopokhoz, tabletekhez és telefonokhoz.', 9500, 12, 1, 'usb-c-tolto.jpg'),

('HDMI kábel', 'HDMI kábel monitorok és kijelzők csatlakoztatásához.', 3000, 20, 1, 'hdmi-kabel.jpg'),

('USB elosztó', 'Több USB-eszköz egyidejű csatlakoztatására alkalmas praktikus elosztó.', 7000, 15, 1, 'usb-eloszto.jpg'),

('Külső merevlemez', '1 TB-os külső háttértár nagyobb fájlok, projektek és biztonsági mentések tárolásához.', 28000, 8, 1, 'kulso-merevlemez.jpg'),

('Monitor', 'Külső monitor kényelmesebb tanuláshoz, programozáshoz és dokumentumszerkesztéshez.', 72000, 6, 1, 'monitor.jpg'),

('Laptop állvány', 'Állítható laptop állvány kényelmesebb testtartáshoz és otthoni tanuláshoz.', 8500, 16, 1, 'laptop-allvany.jpg');
GO