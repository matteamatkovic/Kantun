<template>
  <q-page class="details-page">

    <div class="details-container">

      <q-btn
        flat
        no-caps
        icon="arrow_back"
        label="Natrag na događanja"
        class="back-button"
        @click="$router.back()"
      />

      <q-card
        flat
        bordered
        class="details-card"
      >

        <q-img
          :src="dogadanje.slika"
          class="details-image"
        />

        <q-card-section class="details-content">

          <div class="heading-row">

            <div>

              <div class="category">
                {{ dogadanje.kategorija }}
              </div>

              <h1>
                {{ dogadanje.naziv }}
              </h1>

            </div>

            <q-btn
              round
              unelevated
              :icon="
                dogadanje.omiljeno
                  ? 'favorite'
                  : 'favorite_border'
              "
              class="favorite-button"
              @click="dogadanje.omiljeno = !dogadanje.omiljeno"
            />

          </div>

          <div class="information-grid">

            <div class="information-item">
              <q-icon name="event" />

              <div>
                <small>Datum</small>
                <strong>{{ dogadanje.datum }}</strong>
              </div>
            </div>

            <div class="information-item">
              <q-icon name="schedule" />

              <div>
                <small>Vrijeme</small>
                <strong>{{ dogadanje.vrijeme }}</strong>
              </div>
            </div>

            <div class="information-item">
              <q-icon name="location_on" />

              <div>
                <small>Lokacija</small>
                <strong>{{ dogadanje.lokacija }}</strong>
              </div>
            </div>

            <div class="information-item">
              <q-icon name="person" />

              <div>
                <small>Organizator</small>
                <strong>{{ dogadanje.organizator }}</strong>
              </div>
            </div>

          </div>

          <q-separator class="q-my-xl" />

          <section>
            <h2>
              O događanju
            </h2>

            <p class="description">
              {{ dogadanje.opis }}
            </p>
          </section>

          <section class="additional-info">

            <div>
              <strong>Cijena</strong>
              <span>{{ dogadanje.cijena }}</span>
            </div>

            <div>
              <strong>Kategorija</strong>
              <span>{{ dogadanje.kategorija }}</span>
            </div>

          </section>

          <div class="actions">

            <q-btn
              unelevated
              no-caps
              icon="map"
              label="Prikaži na karti"
              class="map-button"
              @click="otvoriMapu"
            />

            <q-btn
              outline
              no-caps
              :icon="
                dogadanje.omiljeno
                  ? 'favorite'
                  : 'favorite_border'
              "
              :label="
                dogadanje.omiljeno
                  ? 'Spremljeno u favorite'
                  : 'Spremi u favorite'
              "
              class="save-button"
              @click="dogadanje.omiljeno = !dogadanje.omiljeno"
            />

          </div>

        </q-card-section>

      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { reactive } from 'vue'

const dogadanje = reactive({
  id: 1,
  naziv: 'Ljeto na Gradini',
  datum: '8. kolovoza 2026.',
  vrijeme: '21:00',
  lokacija: 'Trsatska gradina, Rijeka',
  kategorija: 'Koncerti',
  organizator: 'Kantun događanja',
  cijena: 'Prema organizatoru',
  omiljeno: false,
  slika:
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
  opis:
    'Ljeto na Gradini donosi večer glazbe i zabave na jednoj od najpoznatijih lokacija u Rijeci. Posjetitelji mogu uživati u programu na otvorenom i posebnoj atmosferi Trsatske gradine.'
})

function otvoriMapu () {
  const lokacija = encodeURIComponent(
    dogadanje.lokacija
  )

  window.open(
    `https://www.google.com/maps/search/?api=1&query=${lokacija}`,
    '_blank'
  )
}
</script>

<style scoped lang="scss">
.details-page {
  min-height: 100%;
  background: #fafcfc;
  color: #173f4f;
}

.details-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 35px 24px 70px;
}

.back-button {
  margin-bottom: 20px;
  color: #355965;
}

.details-card {
  overflow: hidden;
  border-radius: 20px;
  background: white;
}

.details-image {
  height: 430px;
}

.details-content {
  padding: 40px;
}

.heading-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.category {
  color: #d09d1e;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

h1 {
  margin: 8px 0 0;
  font-size: 46px;
}

.favorite-button {
  color: #173f4f;
  background: #f4d35e;
}

.information-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 35px;
}

.information-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.information-item .q-icon {
  color: #d09d1e;
  font-size: 28px;
}

.information-item small {
  display: block;
  margin-bottom: 4px;
  color: #71858b;
}

.information-item strong {
  display: block;
}

.description {
  color: #5d7178;
  font-size: 16px;
  line-height: 1.8;
}

.additional-info {
  display: flex;
  gap: 50px;
  margin-top: 30px;
}

.additional-info div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.additional-info span {
  color: #71858b;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 35px;
}

.map-button {
  background: #173f4f;
  color: white;
}

.save-button {
  color: #173f4f;
}

@media (max-width: 600px) {
  .details-image {
    height: 250px;
  }

  .details-content {
    padding: 25px;
  }

  h1 {
    font-size: 34px;
  }

  .information-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .additional-info {
    flex-direction: column;
    gap: 15px;
  }
}
</style>