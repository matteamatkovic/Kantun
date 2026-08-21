# Kantun

Web aplikacija za pregled, pretragu i rezervaciju kulturnih, glazbenih,
sportskih i gastronomskih događanja na Kvarneru (Rijeka, Opatija, Krk,
Crikvenica, Cres, Lošinj, Rab). Završni rad, Informatika.

**Tehnologije:** Vue 3 + Quasar (frontend) · Node.js + Express (backend) · MySQL (baza)

## Pokretanje

**1. Baza podataka**

U HeidiSQL-u (spojen/a na svoju bazu) pokreni redom, preko File → Load SQL
file → F9:
- `database/schema.sql`
- `database/seed.sql`

**2. Backend**

```bash
cd backend
cp .env.example .env    # upiši svoje podatke za spajanje na bazu
npm install
npm run dev
```

Radi na `http://localhost:4000`.

**3. Frontend**

```bash
cd frontend
cp .env.example .env
npm install
npx quasar dev
```

Otvara se na `http://localhost:9000`.

## Admin panel

Admin račun (`admin@kantun.hr`) je u `database/seed.sql`. Za novu lozinku
pokreni `backend/hash.js` i upiši generirani hash u bazu.

## Struktura

```
Kantun/
├── frontend/     Vue/Quasar aplikacija (korisničko sučelje + admin panel)
├── backend/      Express REST API
└── database/     schema.sql i seed.sql
```

## Uvoz događanja s Entrio.hr

Admin panel ima gumb za automatski uvoz aktualnih događanja s Entrio.hr.
Kako Entrio ne nudi javni API, uvoz čita HTML stranicu i traži poveznice s
datumom u blizini - ako Entrio promijeni izgled stranice, uvoz jednostavno
ne pronađe ništa novo, a aplikacija dalje normalno radi s postojećim
događanjima.
