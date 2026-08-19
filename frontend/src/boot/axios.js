import { defineBoot } from '#q-app'
import axios from 'axios'

// Bazni URL backend API-ja - postavi u .env datoteci (VITE_API_URL)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const api = axios.create({ baseURL })

// Automatski prilaže JWT token (ako postoji) na svaki zahtjev
api.interceptors.request.use(config => {
  const token = localStorage.getItem('kantun_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Ako token istekne/nevažeći je (401), automatski odjavi korisnika
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('kantun_token')
      localStorage.removeItem('kantun_user')
    }
    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
