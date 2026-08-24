import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    kategorije: [],
    ucitano: false
  }),

  actions: {
    // kategorije se rijetko mijenjaju pa se jednom dohvate i onda ponovno
    // koriste iz store-a - forsirano=true (npr. nakon uređivanja u adminu)
    // ipak ide ponovno na backend
    async ucitajKategorije(forsirano = false) {
      if (this.ucitano && !forsirano) return this.kategorije
      const { data } = await api.get('/kategorije')
      this.kategorije = data
      this.ucitano = true
      return data
    },

    async kreirajKategoriju(podaci) {
      const { data } = await api.post('/kategorije', podaci)
      this.kategorije.push(data)
      return data
    },

    // backend kod PUT-a ne vraća ažurirani zapis, zato ga sami sastavimo
    // ovdje (id + podaci koje smo poslali) da se lokalni popis odmah ažurira
    async azurirajKategoriju(id, podaci) {
      await api.put(`/kategorije/${id}`, podaci)
      const idx = this.kategorije.findIndex(k => k.id === id)
      if (idx !== -1) this.kategorije[idx] = { id, ...podaci }
      return { id, ...podaci }
    },

    async obrisiKategoriju(id) {
      await api.delete(`/kategorije/${id}`)
      this.kategorije = this.kategorije.filter(k => k.id !== id)
    }
  }
})
