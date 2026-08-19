<template>
  <q-page class="auth-page">
    <div class="auth-container">
      <router-link to="/" class="auth-logo">
        <img :src="logoIcon" alt="" class="auth-logo-icon" />
        <span class="kantun-wordmark">Kantun</span>
      </router-link>

      <q-card flat bordered class="auth-card">
        <div class="auth-heading">
          <div class="kantun-eyebrow">KANTUN</div>
          <h1>Registracija</h1>
          <p>Kreiraj račun i počni spremati događanja koja te zanimaju.</p>
        </div>

        <q-form class="q-gutter-md" @submit="registrirajSe">
          <div class="row q-col-gutter-md">
            <q-input
              v-model="ime"
              outlined
              label="Ime"
              class="col"
              :rules="[v => !!v || 'Unesite ime']"
            />
            <q-input
              v-model="prezime"
              outlined
              label="Prezime"
              class="col"
              :rules="[v => !!v || 'Unesite prezime']"
            />
          </div>

          <q-input
            v-model="email"
            outlined
            type="email"
            label="E-mail"
            :rules="[v => !!v || 'Unesite e-mail adresu']"
          />

          <q-input
            v-model="lozinka"
            outlined
            type="password"
            label="Lozinka"
            hint="Najmanje 6 znakova"
            :rules="[
              v =>
                (v && v.length >= 6) || 'Lozinka mora imati najmanje 6 znakova'
            ]"
          />

          <q-banner v-if="greska" dense class="bg-red-1 text-negative" rounded>
            {{ greska }}
          </q-banner>

          <q-btn
            unelevated
            no-caps
            label="Registriraj se"
            type="submit"
            class="auth-button full-width"
            :loading="ucitavanje"
          />
        </q-form>

        <div class="auth-link">
          Već imaš račun?
          <router-link to="/prijava">Prijavi se</router-link>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoIcon from '@/assets/kantun-icon-transparent.png'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const ime = ref('')
const prezime = ref('')
const email = ref('')
const lozinka = ref('')
const ucitavanje = ref(false)
const greska = ref('')

async function registrirajSe() {
  greska.value = ''
  ucitavanje.value = true
  try {
    await authStore.registracija(
      ime.value,
      prezime.value,
      email.value,
      lozinka.value
    )
    router.push(route.query.redirect || '/')
  } catch (err) {
    greska.value = err.response?.data?.poruka || 'Registracija nije uspjela.'
  } finally {
    ucitavanje.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100%;
  display: flex;
  justify-content: center;
  background: var(--kantun-pozadina);
}

.auth-container {
  width: 100%;
  max-width: 480px;
  padding: 70px 24px;
}

.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  text-decoration: none;
}

.auth-logo-icon {
  height: 48px;
  width: auto;
  display: block;
}

.auth-logo .kantun-wordmark {
  font-size: 30px;
}

.auth-card {
  padding: 35px;
  border-radius: 18px;
  background: var(--kantun-bg-card);
  border-color: var(--kantun-granica);
  border-top: 2px solid var(--kantun-zlatna);
}

.auth-heading {
  margin-bottom: 30px;
}

h1 {
  margin: 7px 0;
  font-size: 38px;
}

.auth-heading p {
  color: var(--kantun-tekst-suptilan);
  line-height: 1.5;
}

.auth-button {
  min-height: 48px;
  background: var(--kantun-accent);
  color: #0a0f1e;
  font-weight: 700;
}

.auth-link {
  margin-top: 25px;
  text-align: center;
  color: var(--kantun-tekst-suptilan);
}

.auth-link a {
  color: var(--kantun-accent);
  font-weight: 700;
  text-decoration: none;
}
</style>
