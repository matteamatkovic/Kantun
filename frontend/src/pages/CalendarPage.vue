<template>
  <q-page class="calendar-page">
    <div class="page-container">
      <div class="page-heading">
        <div class="kantun-eyebrow"> KANTUN </div>

        <h1> Kalendar događanja </h1>

        <p>
          Odaberi datum i pogledaj koja se događanja održavaju na Kvarneru.
        </p>
      </div>

      <div class="calendar-layout">
        <q-card flat bordered class="calendar-card">
          <q-date
            v-model="odabraniDatum"
            mask="YYYY-MM-DD"
            minimal
            today-btn
            :events="datumiSDogadajima"
            event-color="accent"
          />
        </q-card>

        <div class="day-content">
          <div class="selected-date">
            <div class="kantun-eyebrow">ODABRANI DATUM</div>
            <h2>{{ formatDatum(odabraniDatum) }}</h2>
          </div>

          <div v-if="ucitavanje" class="loading-state">
            <q-spinner color="primary" size="40px" />
          </div>

          <div v-else-if="dogadanjaZaDatum.length" class="events-list">
            <q-card
              v-for="event in dogadanjaZaDatum"
              :key="event.id"
              flat
              bordered
              class="calendar-event"
              @click="otvoriDetalje(event)"
            >
              <q-img
                :src="event.slika_url || zadanaSlika"
                width="160px"
                height="110px"
              />

              <div class="event-content">
                <div
                  class="category"
                  :style="{
                    color: event.kategorija_boja || 'var(--kantun-zlatna)'
                  }"
                >
                  {{ event.kategorija_naziv || 'Ostalo' }}
                </div>

                <h3>{{ event.naziv }}</h3>

                <div v-if="event.datum_pocetka" class="event-info">
                  <q-icon name="schedule" />
                  {{ formatVrijeme(event.datum_pocetka) }}
                </div>

                <div v-if="event.lokacija || event.grad" class="event-info">
                  <q-icon name="location_on" />
                  {{
                    event.lokacija
                      ? `${event.lokacija}, ${event.grad}`
                      : event.grad
                  }}
                </div>
              </div>
            </q-card>
          </div>

          <div v-else class="empty-day">
            <q-icon name="event_available" size="60px" />
            <h3>Nema događanja</h3>
            <p>Za odabrani datum nema evidentiranih događanja.</p>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Kalendarski prikaz događanja (/kalendar) - q-date komponenta iz Quasara
// prikazuje mjesec, a klik na dan filtrira događanja tog dana ispod kalendara
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventStore } from '@/stores/events'

const router = useRouter()
const eventStore = useEventStore()
const zadanaSlika =
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a'

const danas = new Date()
const odabraniDatum = ref(danas.toISOString().slice(0, 10))
const ucitavanje = ref(false)

// Sva događanja se učitaju jednom (skup podataka je namjerno malen - bez paginacije)
// pa se filtriranje po odabranom danu radi lokalno.
const dogadanjaZaDatum = computed(() =>
  eventStore.dogadanja.filter(
    e => e.datum_pocetka?.slice(0, 10) === odabraniDatum.value
  )
)

// lista datuma (YYYY-MM-DD) koja ide u q-date prop "events" - Quasar sam
// nacrta točkicu ispod svakog dana u tom popisu, tako se vidi koji dani u
// mjesecu imaju događanja i prije nego se klikne na njih
const datumiSDogadajima = computed(() =>
  eventStore.dogadanja.map(e => e.datum_pocetka?.slice(0, 10))
)

function formatVrijeme(datum) {
  if (!datum) return ''
  return new Date(datum).toLocaleTimeString('hr-HR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDatum(datum) {
  if (!datum) return ''
  const [godina, mjesec, dan] = datum.split('-')
  const d = new Date(godina, mjesec - 1, dan)
  return d.toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function otvoriDetalje(event) {
  router.push(`/dogadanja/${event.id}`)
}

onMounted(async () => {
  ucitavanje.value = true
  try {
    await eventStore.pretraziDogadanja()
  } finally {
    ucitavanje.value = false
  }
})
</script>

<style scoped lang="scss">
.calendar-page {
  min-height: 100%;
  background: var(--kantun-pozadina);
  color: var(--kantun-tekst);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.page-heading h1 {
  margin: 8px 0 12px;
  font-size: 48px;
}

.page-heading p {
  color: var(--kantun-tekst-suptilan);
  font-size: 17px;
}

.calendar-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 40px;
  margin-top: 40px;
}

.calendar-card {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-radius: 18px;
  background: var(--kantun-bg-card);
  height: fit-content;
}

.selected-date {
  margin-bottom: 25px;
}

.selected-date h2 {
  margin: 8px 0;
  font-size: 30px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.calendar-event {
  display: flex;
  overflow: hidden;
  border-radius: 15px;
  cursor: pointer;
  background: var(--kantun-bg-card);
  transition: transform 0.2s ease;
}

.calendar-event:hover {
  transform: translateY(-2px);
}

.event-content {
  padding: 15px;
}

.category {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.event-content h3 {
  margin: 5px 0 10px;
}

.event-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 5px;
  color: var(--kantun-tekst-suptilan);
  font-size: 14px;
}

.empty-day {
  padding: 60px 20px;
  text-align: center;
  color: var(--kantun-tekst-suptilan);
}

.empty-day h3 {
  color: var(--kantun-tekst);
}

@media (max-width: 800px) {
  .calendar-layout {
    grid-template-columns: 1fr;
  }
}
</style>
