import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    kategorije: [],
    ucitano: false
  }),

  actions: {
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
