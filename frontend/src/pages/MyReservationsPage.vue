<template>
  <q-page class="reservations-page">
    <div class="page-container">
      <div class="page-heading">
        <div class="kantun-eyebrow">KANTUN</div>
        <h1>Moje rezervacije</h1>
        <p>Pregled tvojih prijava/rezervacija ulaznica za događanja.</p>
      </div>

      <div v-if="ucitavanje" class="loading-state">
        <q-spinner color="primary" size="48px" />
      </div>

      <div
        v-else-if="reservationStore.mojeRezervacije.length"
        class="reservations-list"
      >
        <q-card
          v-for="rez in reservationStore.mojeRezervacije"
          :key="rez.id"
          flat
          bordered
          class="reservation-card"
        >
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="event-naziv">{{ rez.dogadanje_naziv }}</div>
              <div class="event-meta">
                {{ formatDatum(rez.datum_pocetka) }} · {{ rez.broj_mjesta }}
                {{ rez.broj_mjesta === 1 ? 'mjesto' : 'mjesta' }}
                <span v-if="rez.lokacija || rez.grad">
                  ·
                  {{
                    rez.lokacija ? `${rez.lokacija}, ${rez.grad}` : rez.grad
                  }}</span
                >
              </div>
            </div>

            <div class="reservation-actions">
              <q-badge :color="statusBoja(rez.status)">{{
                statusTekst(rez.status)
              }}</q-badge>
              <q-btn
                v-if="rez.status !== 'otkazana'"
                flat
                dense
                no-caps
                color="negative"
                label="Otkaži"
                @click="otkazi(rez.id)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div v-else class="empty-state">
        <q-icon name="confirmation_number" size="70px" />
        <h2>Nemaš rezervacija</h2>
        <p>Rezerviraj ulaznice na stranici bilo kojeg događanja.</p>
        <q-btn
          unelevated
          no-caps
          label="Pregledaj događanja"
          color="primary"
          to="/dogadanja"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useReservationStore } from '@/stores/reservations'

const reservationStore = useReservationStore()
const ucitavanje = ref(true)

function formatDatum(datum) {
  if (!datum) return ''
  return new Date(datum).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function statusTekst(status) {
  return (
    { na_cekanju: 'Na čekanju', potvrdena: 'Potvrđeno', otkazana: 'Otkazano' }[
      status
    ] || status
  )
}
function statusBoja(status) {
  return (
    { na_cekanju: 'warning', potvrdena: 'positive', otkazana: 'negative' }[
      status
    ] || 'grey'
  )
}

async function otkazi(id) {
  try {
    await reservationStore.otkaziRezervaciju(id)
    Notify.create({ type: 'positive', message: 'Rezervacija otkazana.' })
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Greška pri otkazivanju.' })
  }
}

onMounted(async () => {
  try {
    await reservationStore.ucitajMoje()
  } finally {
    ucitavanje.value = false
  }
})
</script>

<style scoped lang="scss">
.reservations-page {
  min-height: 100%;
  background: var(--kantun-pozadina);
  color: var(--kantun-tekst);
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 24px;
}

.page-heading {
  margin-bottom: 35px;
}

h1 {
  margin: 8px 0 12px;
  font-size: clamp(32px, 5vw, 46px);
}

.page-heading p {
  color: var(--kantun-tekst-suptilan);
  font-size: 17px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.reservations-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.reservation-card {
  border-radius: 14px;
  background: var(--kantun-bg-card);
  border-color: var(--kantun-granica);
}

.event-naziv {
  font-size: 18px;
  font-weight: 700;
}

.event-meta {
  margin-top: 4px;
  color: var(--kantun-tekst-suptilan);
  font-size: 14px;
}

.event-cijena {
  margin-top: 6px;
  font-weight: 700;
}

.reservation-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: var(--kantun-tekst-suptilan);
}

.empty-state h2 {
  margin: 15px 0 8px;
  color: var(--kantun-tekst);
}

.empty-state p {
  margin-bottom: 20px;
}
</style>
