// pomoćna skripta za generiranje bcrypt hash-a lozinke, korisno kad se
// korisnik dodaje ručno u bazu preko HeidiSQL-a (treba ispravan hash za
// stupac lozinka_hash) - pokretanje: node hash.js

const bcrypt = require('bcryptjs')

const LOZINKA = 'Korisnik123'

async function generirajHash () {
  const hash = await bcrypt.hash(LOZINKA, 10)
  console.log('Lozinka: ', LOZINKA)
  console.log('Hash:    ', hash)
}

generirajHash()
