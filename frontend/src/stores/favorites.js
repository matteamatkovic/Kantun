import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    favoriti: [],
    // odvojeni Set samo s ID-evima da jeOmiljeno() bude brza provjera
    // (has() je O(1)) umjesto pretraživanja cijelog niza favoriti pri
    // svakom renderiranju kartice događanja
    idevi: new Set(),
    ucitano: false
  }),

  actions: {
    async ucitajFavorite() {
      const { data } = await api.get('/favoriti')
      this.favoriti = data
      this.idevi = new Set(data.map(e => e.id))
      this.ucitano = true
    },

    jeOmiljeno(eventId) {
      return this.idevi.has(eventId)
    },

    async prekidaciOmiljeno(eventId) {
      if (this.idevi.has(eventId)) {
        await api.delete(`/favoriti/${eventId}`)
        this.idevi.delete(eventId)
        this.favoriti = this.favoriti.filter(e => e.id !== eventId)
      } else {
        await api.post(`/favoriti/${eventId}`)
        this.idevi.add(eventId)
        // POST vraća samo poruku, ne i puni event (naziv, slika...), zato se
        // cijeli popis ponovno dohvati umjesto da se event samo gurne u niz
        await this.ucitajFavorite()
      }
    },

    // poziva se kod odjave da se favoriti prethodnog korisnika ne
    // zadrže u memoriji do sljedeće prijave
    ocisti() {
      this.favoriti = []
      this.idevi = new Set()
      this.ucitano = false
    }
  }
})
