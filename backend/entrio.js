// jednostavan "uvoznik" eventova s Entrio.hr, pokreće se ručno klikom na
// gumb u admin panelu (bez crona, admin sam odlučuje kad se uvoz pokreće)
//
// umjesto da tražim točne CSS klase na stranici (te se mijenjaju kod svakog
// redizajna i onda scraper prestane raditi), tražim linkove čiji tekst u
// blizini sadrži datum u obliku DD.MM.GGGG - puno stabilniji uzorak. Ako
// Entrio promijeni izgled stranice, uvoz jednostavno vrati 0 rezultata,
// aplikacija i dalje normalno radi sa stvarnim eventima iz seed.sql

const axios = require('axios')
const cheerio = require('cheerio')

// Gradovi u Primorsko-goranskoj županiji koje provjeravamo na Entrio.hr
const GRADOVI = ['rijeka', 'opatija', 'krk', 'crikvenica']

// DD.MM.GGGG (npr. 22.08.2026)
const DATUM_REGEX = /(\d{2})\.(\d{2})\.(\d{4})/
// HH:MM (npr. 21:00)
const VRIJEME_REGEX = /(\d{2}):(\d{2})/

// Riječi koje sigurno NISU naziv događanja (navigacija, izbornici, footer...)
const CRNA_LISTA = [
  'home', 'login', 'log in', 'sign up', 'register', 'events', 'event',
  'categories', 'category', 'cities', 'city', 'music', 'sport', 'culture',
  'business', 'family', 'entertainment', 'see all', 'view all', 'more',
  'next', 'previous', 'search', 'contact', 'about', 'terms', 'privacy',
  'facebook', 'instagram', 'twitter', 'entrio', 'menu', 'help', 'faq',
  'cart', 'checkout', 'my account', 'newsletter'
]

function jeNazivValjan (naziv) {
  const n = naziv.trim().toLowerCase()
  if (n.length < 4 || n.length > 120) return false
  if (CRNA_LISTA.includes(n)) return false
  return true
}

// Pretvara pronađeni tekst (npr. "Saturday, 22.08.2026., 21:00h") u MySQL
// DATETIME format. Vraća null ako datum nije prepoznat ili je predaleko u
// prošlosti/budućnosti (obrana od slučajnih pogodaka na broj u tekstu).
function parsirajDatum (tekst) {
  const datumMatch = tekst.match(DATUM_REGEX)
  if (!datumMatch) return null

  const [, dan, mjesec, godina] = datumMatch
  const brDan = Number(dan)
  const brMjesec = Number(mjesec)
  const brGodina = Number(godina)
  if (brDan < 1 || brDan > 31 || brMjesec < 1 || brMjesec > 12) return null

  const vrijemeMatch = tekst.match(VRIJEME_REGEX)
  const sat = vrijemeMatch ? vrijemeMatch[1] : '20'
  const minuta = vrijemeMatch ? vrijemeMatch[2] : '00'

  const datum = new Date(brGodina, brMjesec - 1, brDan)
  const danas = new Date()
  const zaOsamnaestMjeseci = new Date()
  zaOsamnaestMjeseci.setMonth(danas.getMonth() + 18)

  if (datum < danas || datum > zaOsamnaestMjeseci) return null

  return `${godina}-${mjesec}-${dan} ${sat}:${minuta}:00`
}

async function dohvatiZaGrad (grad) {
  const url = `https://www.entrio.hr/en/events/${grad}`
  const rezultati = []

  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KantunUvoznik/1.0)' }
    })
    const $ = cheerio.load(html)

    $('a').each((_, el) => {
      if (rezultati.length >= 40) return // sigurnosni limit po gradu

      const naziv = $(el).text().trim().replace(/\s+/g, ' ')
      if (!jeNazivValjan(naziv)) return

      // Obližnji blok (roditeljski element) obično sadrži i datum i lokaciju
      const kontekst = $(el).closest('div, li, article').text().trim().replace(/\s+/g, ' ')
      if (kontekst.length > 500) return // predobroko - vjerojatno cijeli meni/blok stranice

      const datum = parsirajDatum(kontekst)
      if (!datum) return

      if (rezultati.some(r => r.naziv === naziv && r.datum_pocetka === datum)) return

      // Best-effort: lokacija = ono što ostane u kontekstu kad se makne
      // naziv i datum/vrijeme - nije uvijek savršeno čisto, admin može
      // ručno doraditi kroz uređivanje događanja.
      let lokacija = kontekst.replace(naziv, '').replace(DATUM_REGEX, '').replace(VRIJEME_REGEX, '').trim()
      lokacija = lokacija.replace(/^[,\-.\s]+|[,\-.\s]+$/g, '').slice(0, 150)

      rezultati.push({
        naziv,
        datum_pocetka: datum,
        lokacija: lokacija || null,
        grad: grad.charAt(0).toUpperCase() + grad.slice(1),
        web_link: url
      })
    })
  } catch (err) {
    console.warn(`[uvoz] Dohvaćanje za grad "${grad}" nije uspjelo: ${err.message}`)
  }

  return rezultati
}

async function dohvatiSveEvente () {
  const sviRezultati = []
  for (const grad of GRADOVI) {
    const rezultatiGrada = await dohvatiZaGrad(grad)
    sviRezultati.push(...rezultatiGrada)
  }
  return sviRezultati
}

module.exports = { dohvatiSveEvente, parsirajDatum, jeNazivValjan }
