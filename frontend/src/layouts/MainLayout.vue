<template>
  <q-layout view="lHh Lpr lff">
    <!-- Gornja navigacija -->
    <q-header class="kantun-header">
      <q-toolbar class="kantun-toolbar">
        <!-- Mobilni izbornik -->
        <q-btn
          flat
          dense
          round
          class="lt-md menu-toggle"
          @click="toggleLeftDrawer"
        >
          <span class="menu-toggle-bars">
            <span></span><span></span><span></span>
          </span>
        </q-btn>

        <!-- Logo -->
        <q-btn flat no-caps to="/" class="kantun-logo">
          <img :src="logoIcon" alt="" class="logo-icon" />
          <span class="kantun-wordmark">Kantun</span>
        </q-btn>

        <q-space />

        <!-- Desktop navigacija -->
        <div class="desktop-nav gt-sm">
          <q-btn flat no-caps label="Događanja" to="/dogadanja" />

          <q-btn flat no-caps label="Kalendar" to="/kalendar" />

          <q-btn
            v-if="authStore.jePrijavljen"
            flat
            round
            icon="favorite_border"
            to="/favoriti"
          >
            <q-tooltip>Favoriti</q-tooltip>
          </q-btn>

          <q-btn
            v-if="authStore.jePrijavljen && authStore.jeAdmin"
            flat
            no-caps
            icon="admin_panel_settings"
            label="Admin"
            to="/admin"
          />

          <!-- Korisnički meni (prijavljen) -->
          <q-btn v-if="authStore.jePrijavljen" flat round icon="account_circle">
            <q-menu>
              <q-list style="min-width: 200px">
                <q-item class="q-py-md">
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{
                      authStore.punoIme
                    }}</q-item-label>
                    <q-item-label caption>{{
                      authStore.user?.email
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup to="/moje-rezervacije">
                  <q-item-section avatar
                    ><q-icon name="confirmation_number"
                  /></q-item-section>
                  <q-item-section>Moje rezervacije</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="odjaviSe">
                  <q-item-section avatar
                    ><q-icon name="logout"
                  /></q-item-section>
                  <q-item-section>Odjava</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!-- Prijava (neprijavljen) -->
          <q-btn
            v-else
            flat
            no-caps
            label="Prijava"
            icon="person_outline"
            to="/prijava"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Mobilni izbornik -->
    <q-drawer v-model="leftDrawerOpen" bordered>
      <div class="drawer-header">
        <img :src="logoIcon" alt="" class="drawer-logo-icon" />
        <span class="kantun-wordmark drawer-wordmark">Kantun</span>
      </div>

      <q-list padding>
        <q-item clickable v-ripple to="/" exact @click="leftDrawerOpen = false">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Početna</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dogadanja"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar><q-icon name="event" /></q-item-section>
          <q-item-section>Događanja</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/kalendar"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar
            ><q-icon name="calendar_month"
          /></q-item-section>
          <q-item-section>Kalendar</q-item-section>
        </q-item>

        <q-item
          v-if="authStore.jePrijavljen"
          clickable
          v-ripple
          to="/favoriti"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar><q-icon name="favorite" /></q-item-section>
          <q-item-section>Favoriti</q-item-section>
        </q-item>

        <q-item
          v-if="authStore.jePrijavljen"
          clickable
          v-ripple
          to="/moje-rezervacije"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar
            ><q-icon name="confirmation_number"
          /></q-item-section>
          <q-item-section>Moje rezervacije</q-item-section>
        </q-item>

        <q-item
          v-if="authStore.jePrijavljen && authStore.jeAdmin"
          clickable
          v-ripple
          to="/admin"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar
            ><q-icon name="admin_panel_settings"
          /></q-item-section>
          <q-item-section>Admin panel</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <template v-if="!authStore.jePrijavljen">
          <q-item
            clickable
            v-ripple
            to="/prijava"
            @click="leftDrawerOpen = false"
          >
            <q-item-section avatar
              ><q-icon name="person_outline"
            /></q-item-section>
            <q-item-section>Prijava</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/registracija"
            @click="leftDrawerOpen = false"
          >
            <q-item-section avatar><q-icon name="person_add" /></q-item-section>
            <q-item-section>Registracija</q-item-section>
          </q-item>
        </template>

        <q-item v-else clickable v-ripple @click="odjaviSeIzDrawera">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section>Odjava</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Sadržaj stranica -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="kantun-footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-logo-row">
              <img :src="logoIcon" alt="" class="footer-logo-icon" />
              <span class="kantun-wordmark footer-wordmark">Kantun</span>
            </div>
            <p class="footer-tagline">
              Kantun znači "kut" na riječkom dijalektu — tvoj kutak za sva
              događanja na Kvarneru, na jednom mjestu.
            </p>
          </div>

          <div class="footer-col">
            <div class="footer-col-title">Istraži</div>
            <router-link to="/dogadanja">Događanja</router-link>
            <router-link to="/kalendar">Kalendar</router-link>
            <router-link to="/favoriti">Favoriti</router-link>
          </div>

          <div class="footer-col">
            <div class="footer-col-title">Račun</div>
            <router-link to="/prijava">Prijava</router-link>
            <router-link to="/registracija">Registracija</router-link>
            <router-link to="/moje-rezervacije">Moje rezervacije</router-link>
          </div>
        </div>

        <q-separator class="footer-separator" />

        <div class="footer-bottom">
          <span>© {{ godina }} Kantun — događanja na Kvarneru</span>
          <span class="footer-cities"
            >Rijeka · Opatija · Crikvenica · Krk · Cres · Lošinj · Rab</span
          >
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
// Layout za cijeli javni dio aplikacije (header, mobilni drawer, footer) -
// koristi ga svaka ruta osim /admin (ta ima svoj AdminLayout)
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoIcon from '@/assets/kantun-icon-transparent.png'

const router = useRouter()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)
const godina = new Date().getFullYear()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function odjaviSe() {
  authStore.odjava()
  router.push('/')
}

// isto kao odjaviSe(), samo dodatno zatvori mobilni izbornik nakon klika
function odjaviSeIzDrawera() {
  odjaviSe()
  leftDrawerOpen.value = false
}

// pri svakom učitavanju appa (ne samo prijavi) osvježi podatke o korisniku
// s backenda - token u localStorage može biti star pa je bolje provjeriti
onMounted(() => {
  if (authStore.jePrijavljen) authStore.ucitajProfil()
})
</script>

<style scoped lang="scss">
.kantun-header {
  background: rgba(10, 14, 26, 0.6);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  color: var(--kantun-tekst);
  border-bottom: 1px solid rgba(245, 158, 11, 0.14);
  box-shadow: none;
}

.kantun-toolbar {
  max-width: 1280px;
  margin: 0 auto;
  min-height: 88px;
  padding: 0 24px;
}

.kantun-logo {
  padding: 4px 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  height: 46px;
  width: auto;
  display: block;
}

.menu-toggle-bars {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 20px;
}

.menu-toggle-bars span {
  display: block;
  height: 2px;
  border-radius: 2px;
  background: var(--kantun-tekst);
}

.menu-toggle-bars span:nth-child(1) {
  width: 100%;
}

.menu-toggle-bars span:nth-child(2) {
  width: 70%;
  background: var(--kantun-zlatna-svijetlo);
}

.menu-toggle-bars span:nth-child(3) {
  width: 100%;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.desktop-nav .q-btn {
  color: var(--kantun-tekst);
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: color 0.15s ease;
}

.desktop-nav .q-btn:hover {
  color: var(--kantun-zlatna-svijetlo);
}

.desktop-nav .q-btn.q-router-link--active {
  color: var(--kantun-zlatna-svijetlo);
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px;
  border-bottom: 1px solid var(--kantun-granica);
}

.drawer-logo-icon {
  height: 38px;
  width: auto;
  display: block;
}

.drawer-wordmark {
  font-size: 24px;
}

.kantun-footer {
  background: rgba(10, 14, 26, 0.85);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  border-top: 1px solid rgba(245, 158, 11, 0.14);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 24px 30px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 40px;
  text-align: left;
}

.footer-brand {
  max-width: 340px;
}

.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.footer-logo-icon {
  height: 40px;
  width: auto;
  display: block;
}

.footer-wordmark {
  font-size: 24px;
}

.footer-tagline {
  margin: 0;
  color: rgba(255, 255, 255, 0.55);
  font-size: 14px;
  line-height: 1.6;
}

.footer-col-title {
  margin-bottom: 14px;
  color: var(--kantun-zlatna-svijetlo);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-col a:hover {
  color: var(--kantun-zlatna-svijetlo);
}

.footer-separator {
  margin: 40px 0 22px;
  background: rgba(255, 255, 255, 0.08);
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;
}

@media (max-width: 700px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-brand {
    max-width: none;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
