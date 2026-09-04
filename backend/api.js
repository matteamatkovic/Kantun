// Kantun - backend API (Node.js + Express + MySQL)
// Sve rute su u ovoj jednoj datoteci (bez posebnih mapa routes/middleware/...)

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { dohvatiSveEvente } = require('./entrio')

const JWT_SECRET = process.env.JWT_SECRET

const app = express()
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:9000' }))
app.use(express.json())

// pool umjesto jedne konekcije - fakultetski server (student.veleri.hr) zna
// povremeno prekinuti neaktivnu vezu, a pool onda samo otvori novu za
// sljedeći upit umjesto da cijeli backend ostane mrtav
// .promise() na kraju da mogu pisati await umjesto callbacka
const db = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true
  })
  .promise()

// pomoćne funkcije za JWT autentikaciju

// provjerava je li korisnik prijavljen (ima valjan token)
function provjeriPrijavu (req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ poruka: 'Niste prijavljeni.' })
  }

  try {
    req.korisnik = jwt.verify(token, JWT_SECRET) // { id, uloga }
    next()
  } catch (err) {
    return res.status(401).json({ poruka: 'Token nije valjan ili je istekao.' })
  }
}

// provjerava je li prijavljeni korisnik admin (mora ići poslije provjeriPrijavu)
function provjeriAdmina (req, res, next) {
  if (!req.korisnik || req.korisnik.uloga !== 'admin') {
    return res.status(403).json({ poruka: 'Nemate ovlasti za ovu akciju.' })
  }
  next()
}

function napraviToken (korisnik) {
  return jwt.sign(
    { id: korisnik.id, uloga: korisnik.uloga },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// zajednički SELECT za događanja, uz event odmah povuče i naziv/boju/ikonu
// kategorije (JOIN) da frontend ne mora zvati posebnu rutu za svaku od njih
const DOGADANJA_UPIT = `
  SELECT d.*, k.naziv AS kategorija_naziv, k.boja AS kategorija_boja, k.ikona AS kategorija_ikona
  FROM dogadanja d
  LEFT JOIN kategorije k ON k.id = d.kategorija_id
`

// samo da se vidi da server radi (koristim ovo i kod deploya da provjerim)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', vrijeme: new Date().toISOString() })
})

// --- autentikacija (registracija, prijava, podaci o meni) ---

// POST /api/auth/registracija - novi korisnički račun
app.post('/api/auth/registracija', async (req, res) => {
  try {
    const { ime, prezime, email, lozinka } = req.body

    if (!ime || !prezime || !email || !lozinka) {
      return res.status(400).json({ poruka: 'Sva polja su obavezna.' })
    }
    if (lozinka.length < 6) {
      return res.status(400).json({ poruka: 'Lozinka mora imati barem 6 znakova.' })
    }

    const [postojeci] = await db.query('SELECT id FROM korisnici WHERE email = ?', [email])
    if (postojeci.length > 0) {
      return res.status(400).json({ poruka: 'Korisnik s tim emailom već postoji.' })
    }

    const hash = await bcrypt.hash(lozinka, 10)
    const [rezultat] = await db.query(
      'INSERT INTO korisnici (ime, prezime, email, lozinka_hash) VALUES (?, ?, ?, ?)',
      [ime, prezime, email, hash]
    )

    const korisnik = { id: rezultat.insertId, ime, prezime, email, uloga: 'korisnik' }
    res.status(201).json({ korisnik, token: napraviToken(korisnik) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru prilikom registracije.' })
  }
})

// POST /api/auth/prijava - prijava postojećeg korisnika
app.post('/api/auth/prijava', async (req, res) => {
  try {
    const { email, lozinka } = req.body

    if (!email || !lozinka) {
      return res.status(400).json({ poruka: 'Email i lozinka su obavezni.' })
    }

    const [redovi] = await db.query('SELECT * FROM korisnici WHERE email = ?', [email])
    if (redovi.length === 0) {
      return res.status(401).json({ poruka: 'Pogrešan email ili lozinka.' })
    }

    const korisnikRed = redovi[0]
    const ispravnaLozinka = await bcrypt.compare(lozinka, korisnikRed.lozinka_hash)
    if (!ispravnaLozinka) {
      return res.status(401).json({ poruka: 'Pogrešan email ili lozinka.' })
    }

    const korisnik = {
      id: korisnikRed.id,
      ime: korisnikRed.ime,
      prezime: korisnikRed.prezime,
      email: korisnikRed.email,
      uloga: korisnikRed.uloga
    }
    res.json({ korisnik, token: napraviToken(korisnik) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru prilikom prijave.' })
  }
})

// GET /api/auth/ja - podaci o trenutno prijavljenom korisniku
app.get('/api/auth/ja', provjeriPrijavu, async (req, res) => {
  try {
    const [redovi] = await db.query(
      'SELECT id, ime, prezime, email, uloga FROM korisnici WHERE id = ?',
      [req.korisnik.id]
    )
    if (redovi.length === 0) {
      return res.status(404).json({ poruka: 'Korisnik ne postoji.' })
    }
    res.json({ korisnik: redovi[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// --- kategorije (čitanje za sve, uređivanje samo za admina) ---

// GET /api/kategorije - popis svih kategorija
app.get('/api/kategorije', async (req, res) => {
  try {
    const [redovi] = await db.query('SELECT * FROM kategorije ORDER BY naziv')
    res.json(redovi)
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// POST /api/kategorije - nova kategorija (samo admin)
app.post('/api/kategorije', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const { naziv, boja, ikona } = req.body
    if (!naziv) {
      return res.status(400).json({ poruka: 'Naziv kategorije je obavezan.' })
    }
    const [rezultat] = await db.query(
      'INSERT INTO kategorije (naziv, boja, ikona) VALUES (?, ?, ?)',
      [naziv, boja || '#2dd4bf', ikona || 'event']
    )
    res.status(201).json({ id: rezultat.insertId, naziv, boja, ikona })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// PUT /api/kategorije/:id - uređivanje kategorije (samo admin)
app.put('/api/kategorije/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const { naziv, boja, ikona } = req.body
    await db.query(
      'UPDATE kategorije SET naziv = ?, boja = ?, ikona = ? WHERE id = ?',
      [naziv, boja, ikona, req.params.id]
    )
    res.json({ poruka: 'Kategorija ažurirana.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// DELETE /api/kategorije/:id - brisanje kategorije (samo admin)
app.delete('/api/kategorije/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    await db.query('DELETE FROM kategorije WHERE id = ?', [req.params.id])
    res.json({ poruka: 'Kategorija obrisana.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// --- događanja (pregled, pretraga/filteri, CRUD za admina) ---

// GET /api/dogadanja - popis događanja, podržava query parametre:
// pretraga (traži u nazivu/opisu), kategorija_id, grad, besplatno=1,
// nadolazeca=1 (samo eventi koji tek dolaze)
app.get('/api/dogadanja', async (req, res) => {
  try {
    const { pretraga, kategorija_id, grad, besplatno, nadolazeca } = req.query
    const uvjeti = []
    const vrijednosti = []

    if (pretraga) {
      uvjeti.push('(d.naziv LIKE ? OR d.opis LIKE ?)')
      vrijednosti.push(`%${pretraga}%`, `%${pretraga}%`)
    }
    if (kategorija_id) {
      uvjeti.push('d.kategorija_id = ?')
      vrijednosti.push(kategorija_id)
    }
    if (grad) {
      uvjeti.push('d.grad = ?')
      vrijednosti.push(grad)
    }
    if (besplatno === '1') {
      uvjeti.push('d.cijena = 0')
    }
    if (nadolazeca === '1') {
      uvjeti.push('d.datum_pocetka >= CURDATE()')
    }

    let upit = DOGADANJA_UPIT
    if (uvjeti.length > 0) {
      upit += ' WHERE ' + uvjeti.join(' AND ')
    }
    upit += ' ORDER BY d.datum_pocetka ASC'

    const [redovi] = await db.query(upit, vrijednosti)
    res.json(redovi)
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// GET /api/dogadanja/gradovi - popis svih gradova koji se koriste (za filter)
app.get('/api/dogadanja/gradovi', async (req, res) => {
  try {
    const [redovi] = await db.query(
      'SELECT DISTINCT grad FROM dogadanja WHERE grad IS NOT NULL AND grad <> "" ORDER BY grad'
    )
    res.json(redovi.map(r => r.grad))
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// GET /api/dogadanja/:id - detalji jednog događanja
app.get('/api/dogadanja/:id', async (req, res) => {
  try {
    const [redovi] = await db.query(`${DOGADANJA_UPIT} WHERE d.id = ?`, [req.params.id])
    if (redovi.length === 0) {
      return res.status(404).json({ poruka: 'Događanje ne postoji.' })
    }
    res.json(redovi[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// POST /api/dogadanja - novo događanje (samo admin)
app.post('/api/dogadanja', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const {
      naziv, opis, kategorija_id, lokacija, grad, adresa,
      datum_pocetka, datum_zavrsetka, cijena, slika_url, web_link
    } = req.body

    if (!naziv || !datum_pocetka) {
      return res.status(400).json({ poruka: 'Naziv i datum početka su obavezni.' })
    }

    const [rezultat] = await db.query(
      `INSERT INTO dogadanja
        (naziv, opis, kategorija_id, lokacija, grad, adresa, datum_pocetka, datum_zavrsetka, cijena, slika_url, web_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        naziv, opis || null, kategorija_id || null, lokacija || null, grad || null, adresa || null,
        datum_pocetka, datum_zavrsetka || null,
        // prazno polje iz forme mora ići kao NULL a ne "0", inače bi event
        // ispao besplatan umjesto "cijena nepoznata"
        cijena === undefined || cijena === '' ? null : cijena,
        slika_url || null, web_link || null
      ]
    )
    res.status(201).json({ id: rezultat.insertId, poruka: 'Događanje kreirano.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// PUT /api/dogadanja/:id - uređivanje događanja (samo admin)
app.put('/api/dogadanja/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const {
      naziv, opis, kategorija_id, lokacija, grad, adresa,
      datum_pocetka, datum_zavrsetka, cijena, slika_url, web_link
    } = req.body

    await db.query(
      `UPDATE dogadanja SET
        naziv = ?, opis = ?, kategorija_id = ?, lokacija = ?, grad = ?, adresa = ?,
        datum_pocetka = ?, datum_zavrsetka = ?, cijena = ?, slika_url = ?, web_link = ?
       WHERE id = ?`,
      [
        naziv, opis || null, kategorija_id || null, lokacija || null, grad || null, adresa || null,
        datum_pocetka, datum_zavrsetka || null,
        cijena === undefined || cijena === '' ? null : cijena,
        slika_url || null, web_link || null,
        req.params.id
      ]
    )
    res.json({ poruka: 'Događanje ažurirano.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// DELETE /api/dogadanja/:id - brisanje događanja (samo admin)
app.delete('/api/dogadanja/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    await db.query('DELETE FROM dogadanja WHERE id = ?', [req.params.id])
    res.json({ poruka: 'Događanje obrisano.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// --- favoriti (svaki prijavljeni korisnik ima svoj popis) ---

// GET /api/favoriti - moji favoriti (s podacima o događanju)
app.get('/api/favoriti', provjeriPrijavu, async (req, res) => {
  try {
    const [redovi] = await db.query(
      `SELECT d.*, k.naziv AS kategorija_naziv, k.boja AS kategorija_boja, k.ikona AS kategorija_ikona
       FROM favoriti f
       JOIN dogadanja d ON d.id = f.dogadanje_id
       LEFT JOIN kategorije k ON k.id = d.kategorija_id
       WHERE f.korisnik_id = ?
       ORDER BY d.datum_pocetka ASC`,
      [req.korisnik.id]
    )
    res.json(redovi)
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// POST /api/favoriti/:dogadanjeId - dodaj u favorite
app.post('/api/favoriti/:dogadanjeId', provjeriPrijavu, async (req, res) => {
  try {
    // INSERT IGNORE jer ako korisnik već ima ovo u favoritima, unique
    // constraint u bazi bi bacio grešku - ovako se samo tiho preskoči
    await db.query(
      'INSERT IGNORE INTO favoriti (korisnik_id, dogadanje_id) VALUES (?, ?)',
      [req.korisnik.id, req.params.dogadanjeId]
    )
    res.status(201).json({ poruka: 'Dodano u favorite.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// DELETE /api/favoriti/:dogadanjeId - ukloni iz favorita
app.delete('/api/favoriti/:dogadanjeId', provjeriPrijavu, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM favoriti WHERE korisnik_id = ? AND dogadanje_id = ?',
      [req.korisnik.id, req.params.dogadanjeId]
    )
    res.json({ poruka: 'Uklonjeno iz favorita.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// --- rezervacije (korisnik rezervira mjesto, admin upravlja statusima) ---

// GET /api/rezervacije - moje rezervacije, ili sve ako je admin i pošalje ?sve=1
app.get('/api/rezervacije', provjeriPrijavu, async (req, res) => {
  try {
    if (req.query.sve === '1' && req.korisnik.uloga === 'admin') {
      const [redovi] = await db.query(
        `SELECT r.*, d.naziv AS dogadanje_naziv, d.datum_pocetka,
                k.ime, k.prezime, k.email
         FROM rezervacije r
         JOIN dogadanja d ON d.id = r.dogadanje_id
         JOIN korisnici k ON k.id = r.korisnik_id
         ORDER BY r.kreirana DESC`
      )
      return res.json(redovi)
    }

    const [redovi] = await db.query(
      `SELECT r.*, d.naziv AS dogadanje_naziv, d.datum_pocetka, d.lokacija, d.grad
       FROM rezervacije r
       JOIN dogadanja d ON d.id = r.dogadanje_id
       WHERE r.korisnik_id = ?
       ORDER BY r.kreirana DESC`,
      [req.korisnik.id]
    )
    res.json(redovi)
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// POST /api/rezervacije - nova rezervacija
app.post('/api/rezervacije', provjeriPrijavu, async (req, res) => {
  try {
    const { dogadanje_id, broj_mjesta } = req.body
    if (!dogadanje_id) {
      return res.status(400).json({ poruka: 'Događanje je obavezno.' })
    }

    const [rezultat] = await db.query(
      'INSERT INTO rezervacije (korisnik_id, dogadanje_id, broj_mjesta) VALUES (?, ?, ?)',
      [req.korisnik.id, dogadanje_id, broj_mjesta || 1]
    )
    res.status(201).json({ id: rezultat.insertId, poruka: 'Rezervacija poslana.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// PUT /api/rezervacije/:id/status - promjena statusa rezervacije (samo admin)
app.put('/api/rezervacije/:id/status', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const { status } = req.body
    const dozvoljeni = ['na_cekanju', 'potvrdena', 'otkazana']
    if (!dozvoljeni.includes(status)) {
      return res.status(400).json({ poruka: 'Nepoznat status.' })
    }
    await db.query('UPDATE rezervacije SET status = ? WHERE id = ?', [status, req.params.id])
    res.json({ poruka: 'Status ažuriran.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// DELETE /api/rezervacije/:id - otkazivanje vlastite rezervacije
app.delete('/api/rezervacije/:id', provjeriPrijavu, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM rezervacije WHERE id = ? AND korisnik_id = ?',
      [req.params.id, req.korisnik.id]
    )
    res.json({ poruka: 'Rezervacija otkazana.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška na serveru.' })
  }
})

// ručni uvoz eventova s Entrio.hr (dugme u Admin -> Pregled), logika
// dohvaćanja/parsiranja je u entrio.js jer je predugačka da ide ovdje

app.post('/api/uvoz', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const pronadeno = await dohvatiSveEvente()

    let dodano = 0
    let preskoceno = 0

    for (const event of pronadeno) {
      // preskoči ako event s istim nazivom na isti dan već postoji - da
      // ponovni klik na "Uvezi" ne puni bazu duplikatima
      const [postojeci] = await db.query(
        'SELECT id FROM dogadanja WHERE naziv = ? AND DATE(datum_pocetka) = DATE(?)',
        [event.naziv, event.datum_pocetka]
      )
      if (postojeci.length > 0) {
        preskoceno++
        continue
      }

      await db.query(
        `INSERT INTO dogadanja (naziv, opis, lokacija, grad, datum_pocetka, cijena, web_link)
         VALUES (?, ?, ?, ?, ?, NULL, ?)`,
        [
          event.naziv,
          'Uvezeno automatski s Entrio.hr. Cijena ulaznice i dodatne informacije dostupne su na priloženoj poveznici.',
          event.lokacija,
          event.grad,
          event.datum_pocetka,
          event.web_link
        ]
      )
      dodano++
    }

    res.json({
      poruka: `Uvoz završen. Pronađeno: ${pronadeno.length}, dodano novo: ${dodano}, preskočeno (već postoji): ${preskoceno}.`,
      pronadeno: pronadeno.length,
      dodano,
      preskoceno
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ poruka: 'Greška prilikom uvoza. Aplikacija i baza su i dalje u redu - probaj ponovno kasnije.' })
  }
})

// Ruta koja ne postoji
app.use((req, res) => {
  res.status(404).json({ poruka: 'Ruta ne postoji.' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Kantun backend radi na http://localhost:${PORT}`)
})
