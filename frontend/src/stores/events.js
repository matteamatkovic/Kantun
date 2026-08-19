import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useEventStore = defineStore('events', {
  state: () => ({
    dogadanja: [],
    gradovi: [],
    ucitavanje: false,
    trenutniEvent: null
  }),

  actions: {
    async pretraziDogadanja(filteri = {}) {
      this.ucitavanje = true
      try {
        const params = {}
        if (filteri.pretraga) params.pretraga = filteri.pretraga
        if (filteri.kategorija_id) params.kategorija_id = filteri.kategorija_id
        if (filteri.grad) params.grad = filteri.grad
        if (filteri.besplatno) params.besplatno = 1
        if (filteri.nadolazeca) params.nadolazeca = 1

        const { data } = await api.get('/dogadanja', { params })
        this.dogadanja = data
        return data
      } finally {
        this.ucitavanje = false
      }
    },

    async ucitajGradove() {
      const { data } = await api.get('/dogadanja/gradovi')
      this.gradovi = data
      return data
    },

    async ucitajEvent(id) {
      this.ucitavanje = true
      try {
        const { data } = await api.get(`/dogadanja/${id}`)
        this.trenutniEvent = data
        return data
      } finally {
        this.ucitavanje = false
      }
    },

    // --- Admin akcije ---
    async kreirajEvent(podaci) {
      const { data } = await api.post('/dogadanja', podaci)
      return data
    },

    async azurirajEvent(id, podaci) {
      const { data } = await api.put(`/dogadanja/${id}`, podaci)
      return data
    },

    async obrisiEvent(id) {
      await api.delete(`/dogadanja/${id}`)
    }
  }
})
