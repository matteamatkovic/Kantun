import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    favoriti: [],
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
        await this.ucitajFavorite()
      }
    },

    ocisti() {
      this.favoriti = []
      this.idevi = new Set()
      this.ucitano = false
    }
  }
})
