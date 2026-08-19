import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useAuthStore = defineStore('auth', {
  // user/token se čitaju izravno iz localStorage pri pokretanju aplikacije,
  // tako da prijava ostane zapamćena i nakon refresha stranice
  state: () => ({
    user: JSON.parse(localStorage.getItem('kantun_user') || 'null'),
    token: localStorage.getItem('kantun_token') || null
  }),

  getters: {
    jePrijavljen: state => !!state.token,
    jeAdmin: state => state.user?.uloga === 'admin',
    punoIme: state =>
      state.user ? `${state.user.ime} ${state.user.prezime}` : ''
  },

  actions: {
    postaviSesiju(podaci) {
      this.user = podaci.korisnik
      this.token = podaci.token
      localStorage.setItem('kantun_token', podaci.token)
      localStorage.setItem('kantun_user', JSON.stringify(podaci.korisnik))
    },

    async prijava(email, lozinka) {
      const { data } = await api.post('/auth/prijava', { email, lozinka })
      this.postaviSesiju(data)
      return data
    },

    async registracija(ime, prezime, email, lozinka) {
      const { data } = await api.post('/auth/registracija', {
        ime,
        prezime,
        email,
        lozinka
      })
      this.postaviSesiju(data)
      return data
    },

    async ucitajProfil() {
      if (!this.token) return
      try {
        const { data } = await api.get('/auth/ja')
        this.user = data.korisnik
        localStorage.setItem('kantun_user', JSON.stringify(data.korisnik))
      } catch {
        this.odjava()
      }
    },

    odjava() {
      this.user = null
      this.token = null
      localStorage.removeItem('kantun_token')
      localStorage.removeItem('kantun_user')
    }
  }
})
