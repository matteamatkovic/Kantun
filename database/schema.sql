-- ============================================================
-- Kantun - baza podataka
-- ============================================================
-- Ove naredbe NE stvaraju novu bazu (CREATE DATABASE) niti mijenjaju
-- aktivnu bazu (USE) - pokreni ih dok si u HeidiSQL-u već spojen/a na
-- svoju postojeću bazu (klikni na svoju bazu u lijevom stupcu prije
-- pokretanja skripte).
--
-- Kako pokrenuti u HeidiSQL-u:
--   1. Lijevi stupac: klikni na svoju bazu da postane aktivna (podebljana).
--   2. File -> Load SQL file... -> odaberi ovu datoteku (schema.sql).
--   3. Pritisni F9 (Execute SQL) da izvršiš cijelu skriptu.
--   4. Ponovi isto sa seed.sql da dobiješ početne (demo) podatke.
-- ============================================================

SET NAMES utf8mb4;

-- Brišemo tablice ako već postoje (npr. iz prijašnjeg pokušaja), redoslijed
-- je bitan zbog stranih ključeva (foreign key) - prvo tablice koje se
-- referenciraju na druge, pa tek onda glavne tablice.
DROP TABLE IF EXISTS rezervacije;
DROP TABLE IF EXISTS favoriti;
DROP TABLE IF EXISTS dogadanja;
DROP TABLE IF EXISTS kategorije;
DROP TABLE IF EXISTS korisnici;

-- ------------------------------------------------------------
-- Korisnici (obični korisnici i administratori)
-- ------------------------------------------------------------
CREATE TABLE korisnici (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  ime            VARCHAR(100) NOT NULL,
  prezime        VARCHAR(100) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  lozinka_hash   VARCHAR(255) NOT NULL,
  uloga          ENUM('korisnik', 'admin') NOT NULL DEFAULT 'korisnik',
  kreiran        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Kategorije događanja (npr. Glazba, Kazalište, Gastronomija...)
-- ------------------------------------------------------------
CREATE TABLE kategorije (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  naziv  VARCHAR(100) NOT NULL UNIQUE,
  boja   VARCHAR(7) NOT NULL DEFAULT '#2dd4bf',
  ikona  VARCHAR(50) NOT NULL DEFAULT 'event'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Događanja (eventi) - sve informacije o eventu u jednoj tablici,
-- uključujući mjesto/grad i poveznicu za više info / društvene mreže.
-- Napomena o koloni "cijena": NULL = cijena nije poznata (npr. uvezeno
-- automatski pa nije provjereno), 0 = potvrđeno besplatan ulaz.
-- ------------------------------------------------------------
CREATE TABLE dogadanja (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  naziv           VARCHAR(200) NOT NULL,
  opis            TEXT,
  kategorija_id   INT,
  lokacija        VARCHAR(200),
  grad            VARCHAR(100),
  adresa          VARCHAR(255),
  datum_pocetka   DATETIME NOT NULL,
  datum_zavrsetka DATETIME,
  cijena          DECIMAL(6,2) NULL,
  slika_url       VARCHAR(500),
  web_link        VARCHAR(500),
  kreirano        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dogadanja_kategorija
    FOREIGN KEY (kategorija_id) REFERENCES kategorije(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Favoriti (korisnik je spremio događanje)
-- ------------------------------------------------------------
CREATE TABLE favoriti (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  korisnik_id   INT NOT NULL,
  dogadanje_id  INT NOT NULL,
  kreiran       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favoriti_korisnik
    FOREIGN KEY (korisnik_id) REFERENCES korisnici(id) ON DELETE CASCADE,
  CONSTRAINT fk_favoriti_dogadanje
    FOREIGN KEY (dogadanje_id) REFERENCES dogadanja(id) ON DELETE CASCADE,
  UNIQUE KEY jedan_favorit_po_korisniku (korisnik_id, dogadanje_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Rezervacije (prijava interesa / rezervacija mjesta na događanju)
-- ------------------------------------------------------------
CREATE TABLE rezervacije (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  korisnik_id   INT NOT NULL,
  dogadanje_id  INT NOT NULL,
  broj_mjesta   INT NOT NULL DEFAULT 1,
  status        ENUM('na_cekanju', 'potvrdena', 'otkazana') NOT NULL DEFAULT 'na_cekanju',
  kreirana      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rezervacije_korisnik
    FOREIGN KEY (korisnik_id) REFERENCES korisnici(id) ON DELETE CASCADE,
  CONSTRAINT fk_rezervacije_dogadanje
    FOREIGN KEY (dogadanje_id) REFERENCES dogadanja(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
