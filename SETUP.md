# Kantun — upute za pokretanje

Ove upute pretpostavljaju da imaš instaliran **Node.js** (v18 ili noviji) i
**HeidiSQL** već spojen na svoju MySQL/MariaDB bazu podataka (fakultetski
server, XAMPP, WAMP — što god već koristiš). Projekt namjerno nema puno
pokretnih dijelova: baza (obične tablice), backend (Node/Express) i frontend
(Quasar/Vue).

---

## 1. Baza podataka (HeidiSQL)

Ove naredbe **ne stvaraju novu bazu** — pretpostavljaju da već imaš svoju
bazu u HeidiSQL-u i da si u nju spojena/spojen.

1. Otvori HeidiSQL i spoji se na svoj MySQL/MariaDB server.
2. U lijevom stupcu klikni na svoju bazu da postane aktivna (podebljano ime).
3. **Uvezi tablice:** File → Load SQL file... → odaberi `database/schema.sql`.
   Otvorit će se tab s upitom — pritisni **F9** (Execute SQL) da ga izvršiš.
   Ovo kreira 5 tablica: `korisnici`, `kategorije`, `dogadanja`, `favoriti`,
   `rezervacije`.
4. **Uvezi početne podatke:** ponovi isti postupak s `database/seed.sql`.
   Ovo puni bazu s 6 kategorija, **18 stvarnih, trenutno najavljenih
   događanja** (koncerti, stand-up, festivali u Rijeci/Opatiji/Krku,
   provjereno preko Entrio.hr) i dva korisnička računa:
   - **Admin:** `admin@kantun.hr` / lozinka `Kantun2026!`
   - **Korisnik:** `iva.horvat@example.com` / lozinka `Korisnik123`
5. Provjeri da su hrvatska slova (č, ć, š, ž, đ) ispravno prikazana u tablici
   `dogadanja` (kolona `naziv`, npr. "Izložba", "Riječki..."). Ako vidiš
   čudne znakove, u HeidiSQL-u otvori **Settings → General → Default new
   connection settings** i postavi enkodiranje na **UTF-8**, pa ponovno
   pokreni `seed.sql` (obje datoteke već imaju `SET NAMES utf8mb4;` na vrhu,
   pa je ovo isključivo pitanje enkodiranja klijenta).
6. Zapamti svoje **korisničko ime i lozinku** za tu MySQL konekciju —
   trebat će ti odmah u sljedećem koraku (backend `.env`).

---

## 2. Backend (Node.js + Express API)

`backend/.env` je već pripremljen s podacima za spajanje na fakultetsku bazu
(`student.veleri.hr`) — nema potrebe da ga ponovno stvaraš. Ako ikad zatreba
podesiti drugačije (npr. druga baza, drugo računalo), otvori `backend/.env`
i uredi:

```
DB_HOST=student.veleri.hr
DB_PORT=3306
DB_NAME=mmatkovic
DB_USER=mmatkovic
DB_PASSWORD=11
```

**Provjeri `DB_NAME`:** postavljeno je na `mmatkovic` (isti obrazac kao kod
kolega s faksa — baza se zove isto kao korisničko ime), ali ako se u
HeidiSQL-u tvoja baza u koju si uvezla `schema.sql`/`seed.sql` zove
drugačije, promijeni tu vrijednost da točno odgovara.

Ako projekt otvaraš na drugom računalu ili želiš koristiti neku drugu bazu
(npr. lokalni XAMPP/WAMP), samo prepiši gornje vrijednosti svojima — nije
potrebno ništa u kodu mijenjati, sve se čita iz ovog `.env` filea. Predložak
`backend/.env.example` i dalje postoji ako ikad zatreba krenuti ispočetka.

U terminalu:

```bash
cd backend
npm install
```

Zatim pokreni:

```bash
npm install
npm run dev
```

Backend kreće na `http://localhost:4000`. Provjeri da radi tako da u
pregledniku otvoriš `http://localhost:4000/api/health` — trebao bi vratiti
`{"status":"ok", ...}`.

**Ako se ne uspije spojiti na bazu:** provjeri je li MySQL/MariaDB server
pokrenut, i da `DB_USER`/`DB_PASSWORD`/`DB_NAME` u `.env` točno odgovaraju
onome što koristiš u HeidiSQL-u.

---

## 3. Frontend (Quasar/Vue)

U **novom** terminalu (backend neka i dalje radi u prvom):

```bash
cd frontend
cp .env.example .env
npm install
npx quasar dev
```

Aplikacija se otvara na `http://localhost:9000`. `.env` datoteka sadrži
`VITE_API_URL=http://localhost:4000/api` — ako backend pokrećeš na drugoj
adresi ili portu, promijeni to ovdje.

---

## 4. Korištenje aplikacije

- Početna stranica: `http://localhost:9000/#/`
- Popis događanja s pretragom/filterima: `.../#/dogadanja`
- Kalendar: `.../#/kalendar`
- Prijava: `.../#/prijava` (ili se registriraj kao novi korisnik)
- Admin panel: `.../#/admin` (prijavi se prvo s `admin@kantun.hr` /
  `Kantun2026!`)

Iz admin panela možeš dodavati/uređivati/brisati događanja i kategorije, te
pregledavati i mijenjati status korisničkih rezervacija.

---

## 5. Automatski uvoz događanja (Admin → Pregled → "Uvezi evente s Entrio.hr")

Aplikacija dolazi sa 18 stvarnih događanja (korak 1), ali admin panel ima i
gumb koji pokušava dohvatiti **trenutno** najavljena događanja s Entrio.hr
(hrvatska platforma za ulaznice) za Rijeku, Opatiju, Krk i Crikvenicu, te ih
dodati u bazu ako ih tamo još nema (ne stvara duplikate).

**Bitno da razumiješ prije obrane:** ovaj uvoz čita HTML stranicu Entrio.hr
i traži poveznice čiji obližnji tekst sadrži datum — **nije** korišten
službeni API (Entrio.hr ga ne nudi javno), pa je ovo klasičan "web
scraping". To znači:

- Ako Entrio.hr promijeni izgled stranice, uvoz može vratiti 0 novih
  događanja. Ovo je **potpuno bezopasno** — aplikacija dalje normalno radi
  sa svim postojećim događanjima, ništa se ne ruši.
- Nisam mogla testirati ovaj kod protiv prave Entrio.hr stranice iz ovog
  razvojnog okruženja (nema izlaznog pristupa internetu prema toj domeni),
  pa postoji realna mogućnost da kod prvog pokretanja na tvom računalu
  vrati 0 rezultata čak i ako je stranica ista. Ako se to dogodi, aplikacija
  je i dalje **potpuno funkcionalna** — samo ćeš dodavati nova događanja
  ručno kroz "Uredi događanja", baš kao i do sad.
- Uvezena događanja nemaju cijenu popunjenu (Entrio.hr ne prikazuje cijenu
  na popisu, samo na stranici pojedinog eventa) — u aplikaciji se za takva
  događanja prikazuje "Provjeri cijenu" umjesto "Besplatno", a korisnik
  klikom na "Više informacija" ide na Entrio.hr gdje vidi pravu cijenu i
  može kupiti ulaznicu.
- Uvezena događanja nemaju postavljenu kategoriju (uvoz ne pogađa je li
  nešto koncert ili kazališna predstava) — admin ih po potrebi naknadno
  kategorizira kroz "Uredi događanja".

Kod je u `backend/entrio.js` — dobro komentiran, ako ikad zatreba prilagodba
(npr. Entrio.hr promijeni izgled stranice), tamo je objašnjeno kako radi.

---

## 6. Struktura projekta (ukratko)

```
Kantun/
├── database/
│   ├── schema.sql     obične CREATE TABLE naredbe (5 tablica)
│   └── seed.sql        18 stvarnih događanja + demo korisnici
├── backend/
│   ├── api.js           cijeli Express API u jednoj datoteci (rute, spajanje
│   │                    na bazu, JWT provjere) - isti pristup kao kod kolega
│   ├── entrio.js         logika automatskog uvoza s Entrio.hr (korak 5)
│   └── hash.js          mala skripta za generiranje bcrypt hasha lozinke
│                        (korisno ako admin dodaje korisnika ručno u HeidiSQL-u)
└── frontend/            Quasar/Vue aplikacija (korisničko sučelje + admin panel)
```

Backend ne koristi ORM (npr. Sequelize) — samo obični SQL upiti preko
`mysql2` paketa, zato što je to jednostavnije za objasniti i pratiti u
kodu. Sve rute su u jednoj datoteci (`backend/api.js`), bez posebnih mapa za
rute/middleware — isti pristup kao u projektima kolega s faksa.

**Napomena o koloni `cijena`:** u bazi `NULL` znači "cijena nije poznata"
(npr. uvezeno automatski), a `0` znači "potvrđeno besplatan ulaz". Frontend
ih prikazuje različito ("Provjeri cijenu" naspram "Besplatno") — pazi na tu
razliku ako ručno mijenjaš podatke izravno u HeidiSQL-u.

---

## 7. Slanje na GitHub

Repozitorij: `https://github.com/matteamatkovic/Kantun`

```bash
git add .
git commit -m "Pojednostavljen backend, baza i frontend"
git push
```

**Napomena:** `.env` datoteke (s lozinkama/tajnama) su namjerno izostavljene
iz ovog paketa — postoje samo `.env.example` predlošci. `.gitignore` u obje
mape (`backend/`, `frontend/`) već isključuje `.env`, pa se neće slučajno
pushati na GitHub.

---

## 8. Ako nešto zapne

- **"Access denied" u HeidiSQL-u kod izvršavanja schema.sql** — provjeri da
  si prije pokretanja skripte kliknula na svoju bazu u lijevom stupcu (baza
  mora biti aktivna). Skripta ne pokušava stvoriti novu bazu, samo tablice
  unutar one na koju si spojena/spojen.
- **Backend javlja grešku o spajanju na bazu** — provjeri `backend/.env`
  (naziv baze, korisničko ime, lozinka, host/port).
- **Frontend se ne može spojiti na backend (mrežne greške u konzoli)** —
  provjeri da backend radi (`http://localhost:4000/api/health`) i da
  `frontend/.env` pokazuje na točan URL.
- **"Uvezi evente" javlja "dodano novo: 0"** — vidi korak 5 gore, ovo je
  očekivano moguće ponašanje, aplikacija radi normalno i bez toga.
- **Hrvatska slova se čudno prikazuju u bazi** — vidi korak 1, točku 5, gore
  (enkodiranje HeidiSQL konekcije mora biti UTF-8).
