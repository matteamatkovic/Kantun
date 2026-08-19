<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="admin-header">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawerOpen = !drawerOpen" />

        <q-toolbar-title>
          <q-icon name="admin_panel_settings" class="q-mr-sm" />
          Kantun — Admin panel
        </q-toolbar-title>

        <q-btn flat no-caps icon="open_in_new" label="Otvori stranicu" to="/" />

        <q-btn flat no-caps icon="logout" label="Odjava" @click="odjaviSe" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" show-if-above bordered class="admin-drawer">
      <q-list padding>
        <q-item clickable v-ripple to="/admin" exact>
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Pregled</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/dogadanja">
          <q-item-section avatar><q-icon name="event" /></q-item-section>
          <q-item-section>Događanja</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/kategorije">
          <q-item-section avatar><q-icon name="category" /></q-item-section>
          <q-item-section>Kategorije</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/rezervacije">
          <q-item-section avatar
            ><q-icon name="confirmation_number"
          /></q-item-section>
          <q-item-section>Rezervacije</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const drawerOpen = ref(true)

function odjaviSe() {
  authStore.odjava()
  router.push('/')
}
</script>

<style scoped lang="scss">
.admin-header {
  background: var(--kantun-bg-card);
}

.admin-drawer {
  background: var(--kantun-pozadina);
}
</style>
