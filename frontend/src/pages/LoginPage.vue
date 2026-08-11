<template>
  <q-page class="auth-page">

    <div class="auth-container">

      <div class="auth-logo">
        <span>K</span>
        Kantun
      </div>

      <q-card
        flat
        bordered
        class="auth-card"
      >

        <div class="auth-heading">

          <div class="eyebrow">
            KANTUN
          </div>

          <h1>
            Prijava
          </h1>

          <p>
            Prijavi se kako bi mogao spremati svoja omiljena
            događanja.
          </p>

        </div>

        <q-form @submit="prijaviSe">

          <q-input
            v-model="email"
            outlined
            type="email"
            label="E-mail"
            class="q-mb-md"
            :rules="[
              vrijednost =>
                !!vrijednost ||
                'Unesite e-mail adresu'
            ]"
          />

          <q-input
            v-model="lozinka"
            outlined
            type="password"
            label="Lozinka"
            class="q-mb-lg"
            :rules="[
              vrijednost =>
                !!vrijednost ||
                'Unesite lozinku'
            ]"
          />

          <q-btn
            unelevated
            no-caps
            label="Prijavi se"
            type="submit"
            class="auth-button full-width"
          />

        </q-form>

        <div class="auth-link">
          Nemaš račun?

          <router-link to="/register">
            Registriraj se
          </router-link>
        </div>

      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const lozinka = ref('')

function prijaviSe () {
  console.log({
    email: email.value
  })

  router.push('/')
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100%;
  display: flex;
  justify-content: center;
  background: #fafcfc;
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
  margin-bottom: 25px;
  color: #173f4f;
  font-size: 25px;
  font-weight: 800;
}

.auth-logo span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #f4d35e;
}

.auth-card {
  padding: 35px;
  border-radius: 18px;
  background: white;
}

.auth-heading {
  margin-bottom: 30px;
}

.eyebrow {
  color: #d09d1e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1 {
  margin: 7px 0;
  font-size: 38px;
}

.auth-heading p {
  color: #71858b;
  line-height: 1.5;
}

.auth-button {
  min-height: 48px;
  background: #173f4f;
  color: white;
  font-weight: 700;
}

.auth-link {
  margin-top: 25px;
  text-align: center;
  color: #71858b;
}

.auth-link a {
  color: #173f4f;
  font-weight: 700;
  text-decoration: none;
}
</style>