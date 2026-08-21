import { defineRouter } from '#q-app'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'

import routes from './routes.js'



export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE)
  })

  // Čuvar ruta: štiti stranice koje zahtijevaju prijavu / admin ulogu.
  // useAuthStore se poziva unutar callbacka (a ne na vrhu datoteke) kako bi
  // Pinia sigurno već bila aktivna u trenutku prve navigacije.
  Router.beforeEach(async to => {
    if (!to.meta.zahtijevaPrijavu && !to.meta.zahtijevaAdmina) return true

    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()

    if (!authStore.jePrijavljen) {
      return { name: 'prijava', query: { redirect: to.fullPath } }
    }

    if (to.meta.zahtijevaAdmina && !authStore.jeAdmin) {
      return { name: 'pocetna' }
    }

    return true
  })

  return Router
})
