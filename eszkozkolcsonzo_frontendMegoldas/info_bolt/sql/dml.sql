IF DB_ID('TermekBoltDb') IS NULL
BEGIN
    CREATE DATABASE TermekBoltDb;
END
GO

USE TermekBoltDb;
GO

IF OBJECT_ID('RendelesTetel', 'U') IS NOT NULL DROP TABLE RendelesTetel;
IF OBJECT_ID('Rendeles', 'U') IS NOT NULL DROP TABLE Rendeles;
IF OBJECT_ID('Termek', 'U') IS NOT NULL DROP TABLE Termek;
IF OBJECT_ID('Diak', 'U') IS NOT NULL DROP TABLE Diak;
GO

CREATE TABLE Diak (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Azonosito NVARCHAR(50),
    Nev NVARCHAR(100),
    Email NVARCHAR(100),
    Telefon NVARCHAR(50)
);
GO

CREATE TABLE Termek (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nev NVARCHAR(100),
    Leiras NVARCHAR(500),
    Egysegar INT,
    Keszlet INT,
    Elerheto BIT,
    KepFajlnev NVARCHAR(100)
);
GO

CREATE TABLE Rendeles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    VasarloAzonosito NVARCHAR(50),
    VasarloNev NVARCHAR(100),
    Telefon NVARCHAR(50),
    Email NVARCHAR(100),
    KedvezmenySzazalek INT,
    Osszeg INT,
    KedvezmenyOsszeg INT,
    FizetendoOsszeg INT
);
GO

CREATE TABLE RendelesTetel (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RendelesId INT,
    TermekId INT,
    Mennyiseg INT,
    Egysegar INT,
    TetelOsszeg INT
);
GO