<template>
  <q-page class="q-pa-lg admin-dashboard">
    <h1>Pregled</h1>

    <div v-if="ucitavanje" class="loading-state">
      <q-spinner color="primary" size="42px" />
    </div>

    <div v-else class="stats-grid">
      <q-card flat bordered class="stat-card">
        <q-icon name="event" size="30px" />
        <div class="stat-value">{{ eventStore.dogadanja.length }}</div>
        <div class="stat-label">Ukupno događanja</div>
      </q-card>

      <q-card flat bordered class="stat-card">
        <q-icon name="category" size="30px" />
        <div class="stat-value">{{ categoryStore.kategorije.length }}</div>
        <div class="stat-label">Kategorije</div>
      </q-card>

      <q-card flat bordered class="stat-card">
        <q-icon name="confirmation_number" size="30px" />
        <div class="stat-value">{{
          reservationStore.sveRezervacije.length
        }}</div>
        <div class="stat-label">Rezervacije</div>
      </q-card>
    </div>

    <div class="quick-links">
      <q-btn
        unelevated
        no-caps
        icon="event"
        label="Uredi događanja"
        to="/admin/dogadanja"
      />
      <q-btn
        unelevated
        no-caps
        icon="category"
        label="Uredi kategorije"
        to="/admin/kategorije"
      />
      <q-btn
        unelevated
        no-caps
        icon="confirmation_number"
        label="Pregledaj rezervacije"
        to="/admin/rezervacije"
      />
    </div>

    <div class="uvoz-sekcija">
      <div class="uvoz-naslov">Uvoz stvarnih događanja</div>
      <p class="uvoz-opis">
        Ovaj gumb pokušava dohvatiti trenutno najavljena događanja s Entrio.hr
        (Rijeka, Opatija, Krk, Crikvenica) i dodati ona koja još nisu u bazi. Ne
        stvara duplikate - ako događanje s istim nazivom i datumom već postoji,
        samo se preskoči. Ako ništa ne pronađe (npr. stranica je promijenila
        izgled ili blokira automatske zahtjeve), aplikacija normalno nastavlja
        raditi s postojećim događanjima.
      </p>
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="cloud_download"
        label="Uvezi evente s Entrio.hr"
        :loading="uvozUTijeku"
        @click="pokreniUvoz"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { api } from '@/boot/axios'
import { useEventStore } from '@/stores/events'
import { useCategoryStore } from '@/stores/categories'
import { useReservationStore } from '@/stores/reservations'

const eventStore = useEventStore()
const categoryStore = useCategoryStore()
const reservationStore = useReservationStore()

const ucitavanje = ref(true)
const uvozUTijeku = ref(false)

onMounted(async () => {
  try {
    await Promise.all([
      eventStore.pretraziDogadanja(),
      categoryStore.ucitajKategorije(true),
      reservationStore.ucitajSve()
    ])
  } finally {
    ucitavanje.value = false
  }
})

async function pokreniUvoz() {
  uvozUTijeku.value = true
  try {
    const { data } = await api.post('/uvoz')
    Notify.create({ type: 'positive', message: data.poruka, timeout: 6000 })
    await eventStore.pretraziDogadanja()
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: err.response?.data?.poruka || 'Uvoz nije uspio.'
    })
  } finally {
    uvozUTijeku.value = false
  }
}
</script>

<style scoped lang="scss">
.admin-dashboard h1 {
  margin: 0 0 24px;
  color: var(--kantun-tekst);
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.stat-card {
  padding: 20px;
  border-radius: 14px;
  text-align: center;
  background: var(--kantun-bg-card);
  border-color: var(--kantun-granica);
}

.stat-card .q-icon {
  color: var(--kantun-zlatna);
}

.stat-value {
  margin-top: 10px;
  font-size: 30px;
  font-weight: 800;
  color: var(--kantun-tekst);
}

.stat-label {
  color: var(--kantun-tekst-suptilan);
  font-size: 13px;
}

.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.uvoz-sekcija {
  margin-top: 36px;
  padding: 20px;
  border-radius: 14px;
  max-width: 560px;
  background: var(--kantun-bg-card);
  border: 1px solid var(--kantun-granica);
}

.uvoz-naslov {
  font-weight: 700;
  color: var(--kantun-tekst);
  margin-bottom: 6px;
}

.uvoz-opis {
  color: var(--kantun-tekst-suptilan);
  font-size: 13px;
  margin: 0 0 14px;
}
</style>
