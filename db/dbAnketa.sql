CREATE DATABASE Anketa;

USE Anketa;

CREATE TABLE Korisnik (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ime VARCHAR(50),
    prezime VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    lozinka VARCHAR(50)
);