import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useReservationStore = defineStore('reservations', {
  state: () => ({
    mojeRezervacije: [],
    sveRezervacije: [] // admin pregled
  }),

  actions: {
    async ucitajMoje() {
      const { data } = await api.get('/rezervacije')
      this.mojeRezervacije = data
      return data
    },

    async kreirajRezervaciju(podaci) {
      const { data } = await api.post('/rezervacije', podaci)
      await this.ucitajMoje()
      return data
    },

    async otkaziRezervaciju(id) {
      await api.delete(`/rezervacije/${id}`)
      this.mojeRezervacije = this.mojeRezervacije.filter(r => r.id !== id)
    },

    // --- Admin ---
    async ucitajSve() {
      const { data } = await api.get('/rezervacije', { params: { sve: 1 } })
      this.sveRezervacije = data
      return data
    },

    async postaviStatus(id, status) {
      await api.put(`/rezervacije/${id}/status`, { status })
      const idx = this.sveRezervacije.findIndex(r => r.id === id)
      if (idx !== -1) this.sveRezervacije[idx].status = status
    }
  }
})
