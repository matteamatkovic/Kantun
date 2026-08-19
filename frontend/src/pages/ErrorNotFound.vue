<template>
  <q-page class="error-page">
    <div class="error-content">
      <div class="error-number">404</div>

      <h1>Stranica nije pronađena</h1>

      <p> Nažalost, stranica koju tražite ne postoji. </p>

      <q-btn
        unelevated
        no-caps
        label="Povratak na početnu"
        to="/"
        color="primary"
      />
    </div>
  </q-page>
</template>

<script setup></script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

.error-content {
  text-align: center;
}

.error-number {
  font-size: 100px;
  font-weight: 800;
  color: var(--kantun-tekst);
}

h1 {
  margin: 0 0 15px;
  color: var(--kantun-tekst);
}

p {
  margin-bottom: 25px;
  color: var(--kantun-tekst-suptilan);
}
</style>
