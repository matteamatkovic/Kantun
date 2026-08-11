<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Gornja navigacija -->
    <q-header class="kantun-header">
      <q-toolbar class="kantun-toolbar">

        <!-- Mobilni izbornik -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md"
          @click="toggleLeftDrawer"
        />

        <!-- Logo -->
        <q-btn
          flat
          no-caps
          to="/"
          class="kantun-logo"
        >
          <span class="logo-mark">K</span>
          <span class="logo-text">Kantun</span>
        </q-btn>

        <q-space />

        <!-- Desktop navigacija -->
        <div class="desktop-nav gt-sm">

          <q-btn
            flat
            no-caps
            label="Događanja"
            to="/dogadanja"
          />

          <q-btn
            flat
            no-caps
            label="Kalendar"
            to="/kalendar"
          />

          <q-btn
            flat
            round
            icon="favorite_border"
            to="/favoriti"
          >
            <q-tooltip>
              Favoriti
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            icon="person_outline"
            to="/prijava"
          >
            <q-tooltip>
              Prijava
            </q-tooltip>
          </q-btn>

        </div>

      </q-toolbar>
    </q-header>

    <!-- Mobilni izbornik -->
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >

      <div class="drawer-header">

        <div class="drawer-logo">
          <span>K</span>
          Kantun
        </div>

      </div>

      <q-list padding>

        <!-- Početna -->
        <q-item
          clickable
          v-ripple
          to="/"
          exact
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section>
            Početna
          </q-item-section>
        </q-item>

        <!-- Događanja -->
        <q-item
          clickable
          v-ripple
          to="/dogadanja"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar>
            <q-icon name="event" />
          </q-item-section>

          <q-item-section>
            Događanja
          </q-item-section>
        </q-item>

        <!-- Kalendar -->
        <q-item
          clickable
          v-ripple
          to="/kalendar"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar>
            <q-icon name="calendar_month" />
          </q-item-section>

          <q-item-section>
            Kalendar
          </q-item-section>
        </q-item>

        <!-- Favoriti -->
        <q-item
          clickable
          v-ripple
          to="/favoriti"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar>
            <q-icon name="favorite" />
          </q-item-section>

          <q-item-section>
            Favoriti
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Prijava -->
        <q-item
          clickable
          v-ripple
          to="/prijava"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar>
            <q-icon name="person_outline" />
          </q-item-section>

          <q-item-section>
            Prijava
          </q-item-section>
        </q-item>

        <!-- Registracija -->
        <q-item
          clickable
          v-ripple
          to="/registracija"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>

          <q-item-section>
            Registracija
          </q-item-section>
        </q-item>

      </q-list>

    </q-drawer>

    <!-- Sadržaj stranica -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped lang="scss">

.kantun-header {
  background: #ffffff;
  color: #173f4f;
  border-bottom: 1px solid #e8eeee;
}

.kantun-toolbar {
  max-width: 1280px;
  margin: 0 auto;
  min-height: 72px;
  padding: 0 24px;
}

.kantun-logo {
  color: #173f4f;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 8px;
  border-radius: 10px;
  background: #f4d35e;
  color: #173f4f;
  font-weight: 800;
}

.logo-text {
  font-size: 22px;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.desktop-nav .q-btn {
  color: #355965;
}

.drawer-header {
  padding: 25px 20px;
  border-bottom: 1px solid #e8eeee;
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #173f4f;
  font-size: 22px;
  font-weight: 800;
}

.drawer-logo span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f4d35e;
}

</style>