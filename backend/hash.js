// Mala pomoćna skripta za generiranje bcrypt hash-a lozinke - korisno kad
// admin želi ručno dodati novog korisnika izravno u bazu (npr. preko
// HeidiSQL-a) pa treba ispravan hash za stupac lozinka_hash.
//
// Pokretanje: node hash.js
// (po potrebi promijeni vrijednost LOZINKA ispod pa ponovno pokreni)

const bcrypt = require('bcryptjs')

const LOZINKA = 'ovdje-upisi-lozinku'

async function generirajHash () {
  const hash = await bcrypt.hash(LOZINKA, 10)
  console.log('Lozinka: ', LOZINKA)
  console.log('Hash:    ', hash)
}

generirajHash()
