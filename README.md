# Kantun

Aplikacija za pregled, pretragu i rezervaciju događanja u Rijeci, Kvarneru i
Primorsko-goranskoj županiji. Izrađeno kao završni rad (Informatika, 3.
godina).

**Stack:** Vue 3 + Quasar (frontend) · Node.js + Express (backend API, obični
SQL upiti bez ORM-a) · MySQL/MariaDB (baza, upravlja se preko HeidiSQL).

## Struktura repozitorija

```
Kantun/
├── frontend/          Quasar/Vue aplikacija (korisničko sučelje + admin panel)
├── backend/            Node.js/Express REST API
├── database/           SQL naredbe (schema.sql, seed.sql) za HeidiSQL
└── SETUP.md            Detaljne upute za pokretanje (počni odavde)
```

## Brzi početak

Za potpune korak-po-korak upute pogledaj **[SETUP.md](./SETUP.md)**. Ukratko:

1. U HeidiSQL-u (spojen/a na svoju bazu) pokreni `database/schema.sql`, pa
   `database/seed.sql`.
2. `cd backend && npm install && npm run dev` (`.env` je već pripremljen sa
   spajanjem na `student.veleri.hr` — provjeri samo `DB_NAME` ako treba)
3. `cd frontend && cp .env.example .env && npm install && npx quasar dev`
4. Otvori aplikaciju na `http://localhost:9000`, prijavi se kao admin
   (`admin@kantun.hr` / `Kantun2026!`) na `/admin`.

## Glavne značajke

**Za korisnike:**
- Pregled, pretraga i filtriranje događanja (kategorija, grad, samo besplatno)
- Detalji događanja: opis, cijena, lokacija (poveznica na Google kartu),
  poveznica na više informacija
- Spremanje u favorite, rezervacija mjesta, pregled vlastitih rezervacija
- Kalendar s prikazom događanja po danima

**Za administratore (`/admin`):**
- Upravljanje događanjima (dodavanje/uređivanje/brisanje) i kategorijama
- Pregled i promjena statusa korisničkih rezervacija
- Ručni uvoz stvarnih događanja s Entrio.hr (gumb "Uvezi evente s Entrio.hr")

Baza dolazi sa 18 stvarnih, trenutno najavljenih događanja (provjereno preko
Entrio.hr), a admin panel ima i gumb za osvježavanje popisa novim/izmijenjenim
događanjima s te stranice — vidi SETUP.md, korak 5, za detalje i ograničenja
tog uvoza.

## Licenca / korištenje

Izrađeno u sklopu završnog rada. Slobodno prilagodi i proširi prema potrebama rada.
