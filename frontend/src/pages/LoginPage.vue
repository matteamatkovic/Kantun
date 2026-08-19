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
          <h1>Prijava</h1>
          <p
            >Prijavi se kako bi mogao spremati svoja omiljena događanja i
            rezervirati ulaznice.</p
          >
        </div>

        <q-form @submit="prijaviSe">
          <q-input
            v-model="email"
            outlined
            type="email"
            label="E-mail"
            class="q-mb-md"
            :rules="[v => !!v || 'Unesite e-mail adresu']"
          />

          <q-input
            v-model="lozinka"
            outlined
            :type="prikaziLozinku ? 'text' : 'password'"
            label="Lozinka"
            class="q-mb-lg"
            :rules="[v => !!v || 'Unesite lozinku']"
          >
            <template #append>
              <q-icon
                :name="prikaziLozinku ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="prikaziLozinku = !prikaziLozinku"
              />
            </template>
          </q-input>

          <q-banner
            v-if="greska"
            dense
            class="bg-red-1 text-negative q-mb-md"
            rounded
          >
            {{ greska }}
          </q-banner>

          <q-btn
            unelevated
            no-caps
            label="Prijavi se"
            type="submit"
            class="auth-button full-width"
            :loading="ucitavanje"
          />
        </q-form>

        <div class="auth-hint">
          Demo admin račun: <strong>admin@kantun.hr</strong> /
          <strong>Kantun2026!</strong>
        </div>

        <div class="auth-link">
          Nemaš račun?
          <router-link to="/registracija">Registriraj se</router-link>
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

const email = ref('')
const lozinka = ref('')
const prikaziLozinku = ref(false)
const ucitavanje = ref(false)
const greska = ref('')

async function prijaviSe() {
  greska.value = ''
  ucitavanje.value = true
  try {
    await authStore.prijava(email.value, lozinka.value)
    router.push(route.query.redirect || '/')
  } catch (err) {
    greska.value =
      err.response?.data?.poruka || 'Prijava nije uspjela. Provjeri podatke.'
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
  max-width: 450px;
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

.auth-hint {
  margin-top: 18px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.1);
  color: var(--kantun-tekst-suptilan);
  font-size: 13px;
  text-align: center;
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
