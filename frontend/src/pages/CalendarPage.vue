<template>
  <q-page class="calendar-page">

    <div class="page-container">

      <div class="page-heading">

        <div class="eyebrow">
          KANTUN
        </div>

        <h1>
          Kalendar događanja
        </h1>

        <p>
          Odaberi datum i pogledaj koja se događanja održavaju
          na Kvarneru.
        </p>

      </div>

      <div class="calendar-layout">

        <q-card
          flat
          bordered
          class="calendar-card"
        >

          <q-date
            v-model="odabraniDatum"
            mask="YYYY-MM-DD"
            minimal
            today-btn
          />

        </q-card>

        <div class="day-content">

          <div class="selected-date">

            <div class="eyebrow">
              ODABRANI DATUM
            </div>

            <h2>
              {{ formatDatum(odabraniDatum) }}
            </h2>

          </div>

          <div
            v-if="dogadanjaZaDatum.length"
            class="events-list"
          >

            <q-card
              v-for="event in dogadanjaZaDatum"
              :key="event.id"
              flat
              bordered
              class="calendar-event"
              @click="otvoriDetalje(event.id)"
            >

              <q-img
                :src="event.slika"
                width="160px"
                height="110px"
              />

              <div class="event-content">

                <div class="category">
                  {{ event.kategorija }}
                </div>

                <h3>
                  {{ event.naziv }}
                </h3>

                <div class="event-info">
                  <q-icon name="schedule" />
                  {{ event.vrijeme }}
                </div>

                <div class="event-info">
                  <q-icon name="location_on" />
                  {{ event.lokacija }}
                </div>

              </div>

            </q-card>

          </div>

          <div
            v-else
            class="empty-day"
          >

            <q-icon
              name="event_available"
              size="60px"
            />

            <h3>
              Nema događanja
            </h3>

            <p>
              Za odabrani datum nema evidentiranih događanja.
            </p>

          </div>

        </div>

      </div>

    </div>

  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const odabraniDatum = ref('2026-08-08')

const dogadanja = [
  {
    id: 1,
    naziv: 'Ljeto na Gradini',
    datum: '2026-08-08',
    vrijeme: '21:00',
    lokacija: 'Trsatska gradina, Rijeka',
    kategorija: 'Koncerti',
    slika: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a'
  },
  {
    id: 2,
    naziv: 'Riječki koncert',
    datum: '2026-08-09',
    vrijeme: '20:00',
    lokacija: 'Rijeka',
    kategorija: 'Koncerti',
    slika: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
  },
  {
    id: 3,
    naziv: 'Ljetni festival',
    datum: '2026-08-10',
    vrijeme: '18:00',
    lokacija: 'Opatija',
    kategorija: 'Festivali',
    slika: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3'
  }
]

const dogadanjaZaDatum = computed(() => {
  return dogadanja.filter(
    event => event.datum === odabraniDatum.value
  )
})

function formatDatum (datum) {
  if (!datum) {
    return ''
  }

  const [godina, mjesec, dan] = datum.split('-')

  return `${dan}. ${mjesec}. ${godina}.`
}

function otvoriDetalje (id) {
  router.push(`/event/${id}`)
}
</script>

<style scoped lang="scss">
.calendar-page {
  min-height: 100%;
  background: #fafcfc;
  color: #173f4f;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.eyebrow {
  color: #d09d1e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

.page-heading h1 {
  margin: 8px 0 12px;
  font-size: 48px;
}

.page-heading p {
  color: #71858b;
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
  background: white;
}

.selected-date {
  margin-bottom: 25px;
}

.selected-date h2 {
  margin: 8px 0;
  font-size: 30px;
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
  background: white;
  transition: transform 0.2s ease;
}

.calendar-event:hover {
  transform: translateY(-2px);
}

.event-content {
  padding: 15px;
}

.category {
  color: #d09d1e;
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
  color: #71858b;
  font-size: 14px;
}

.empty-day {
  padding: 60px 20px;
  text-align: center;
  color: #71858b;
}

.empty-day h3 {
  color: #173f4f;
}

@media (max-width: 800px) {
  .calendar-layout {
    grid-template-columns: 1fr;
  }
}
</style>