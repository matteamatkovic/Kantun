<template>
  <q-page class="details-page">
    <div v-if="eventStore.ucitavanje && !dogadanje" class="loading-state">
      <q-spinner color="primary" size="48px" />
    </div>

    <div v-else-if="!dogadanje" class="loading-state">
      <p>Događanje nije pronađeno.</p>
    </div>

    <div v-else class="details-container">
      <q-btn
        flat
        no-caps
        icon="arrow_back"
        label="Natrag na događanja"
        class="back-button"
        to="/dogadanja"
      />

      <q-card flat bordered class="details-card">
        <q-img
          :src="dogadanje.slika_url || zadanaSlika"
          class="details-image"
        />

        <q-card-section class="details-content">
          <div class="heading-row">
            <div>
              <div
                class="category"
                :style="{
                  color: dogadanje.kategorija_boja || 'var(--kantun-zlatna)'
                }"
              >
                <q-icon
                  v-if="dogadanje.kategorija_ikona"
                  :name="dogadanje.kategorija_ikona"
                  size="16px"
                />
                {{ dogadanje.kategorija_naziv || 'Ostalo' }}
              </div>

              <h1>
                {{ dogadanje.naziv }}
              </h1>
            </div>

            <q-btn
              v-if="authStore.jePrijavljen"
              round
              dense
              unelevated
              size="lg"
              :icon="jeOmiljeno ? 'favorite' : 'favorite_border'"
              class="favorite-button"
              @click="promijeniOmiljeno"
            />
          </div>

          <div class="information-grid">
            <div class="information-item">
              <q-icon name="event" />
              <div>
                <small>Datum</small>
                <strong>{{ formatiranDatum }}</strong>
              </div>
            </div>

            <div
              v-if="dogadanje.lokacija || dogadanje.grad"
              class="information-item"
            >
              <q-icon name="location_on" />
              <div>
                <small>Lokacija</small>
                <strong>{{ lokacijaTekst }}</strong>
              </div>
            </div>

            <div class="information-item">
              <q-icon name="sell" />
              <div>
                <small>Cijena</small>
                <strong>{{ cijenaTekst }}</strong>
              </div>
            </div>

            <div v-if="dogadanje.grad" class="information-item">
              <q-icon :name="vrijeme.ikona" />
              <div>
                <small>Vrijeme</small>
                <strong>{{ vrijeme.tekst }}</strong>
              </div>
            </div>
          </div>

          <q-separator class="q-my-xl" />

          <section v-if="dogadanje.opis">
            <h2>O događanju</h2>
            <p class="description">
              {{ dogadanje.opis }}
            </p>
          </section>

          <!-- Karta i više informacija -->
          <section
            v-if="
              dogadanje.lokacija ||
              dogadanje.grad ||
              dogadanje.adresa ||
              dogadanje.web_link
            "
            class="q-mt-xl location-section"
          >
            <h2>Lokacija</h2>
            <div class="location-actions">
              <q-btn
                v-if="dogadanje.lokacija || dogadanje.grad || dogadanje.adresa"
                outline
                no-caps
                icon="map"
                label="Otvori na karti"
                class="gold-outline-btn"
                @click="otvoriMapu"
              />
              <q-btn
                v-if="dogadanje.web_link"
                outline
                no-caps
                icon="open_in_new"
                label="Više informacija"
                class="gold-outline-btn"
                type="a"
                :href="dogadanje.web_link"
                target="_blank"
              />
            </div>
          </section>

          <div class="actions">
            <div v-if="!cijenaNepoznata" class="actions-price">
              <small>Cijena</small>
              <strong>{{ cijenaTekst }}</strong>
            </div>
            <q-btn
              v-if="authStore.jePrijavljen"
              unelevated
              no-caps
              icon="confirmation_number"
              label="Rezerviraj mjesto"
              class="reserve-button"
              @click="rezervacijaDialog = true"
            />
            <q-btn
              v-else
              unelevated
              no-caps
              icon="login"
              label="Prijavi se za rezervaciju"
              class="reserve-button"
              :to="{ path: '/prijava', query: { redirect: $route.fullPath } }"
            />

            <q-btn
              flat
              no-caps
              icon="share"
              label="Podijeli"
              class="share-button"
              @click="podijeliEvent"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Dialog rezervacije -->
    <q-dialog v-model="rezervacijaDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Rezervacija mjesta</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model.number="brojMjesta"
            outlined
            type="number"
            min="1"
            label="Broj mjesta"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Odustani" v-close-popup />
          <q-btn
            unelevated
            no-caps
            label="Potvrdi"
            color="primary"
            :loading="spremanje"
            @click="posaljiRezervaciju"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
// Detalji jednog događanja (/dogadanja/:idOrSlug) - najveća stranica u
// aplikaciji: prikaz podataka, vremenska prognoza, favorit, rezervacija,
// dijeljenje. Sve to živi ovdje jer je logično vezano uz "ovo jedno događanje"
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Notify } from 'quasar'
import { useEventStore } from '@/stores/events'
import { useFavoriteStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import { useReservationStore } from '@/stores/reservations'

const route = useRoute()
const eventStore = useEventStore()
const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()
const reservationStore = useReservationStore()

const zadanaSlika =
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a'
const rezervacijaDialog = ref(false)
const brojMjesta = ref(1)
const spremanje = ref(false)

// Koordinate gradova na Kvarneru za dohvat vremenske prognoze (Open-Meteo
// je besplatan i ne treba API ključ, ali treba mu lat/lon umjesto naziva grada)
const KOORDINATE_GRADOVA = {
  Rijeka: [45.3271, 14.4422],
  Opatija: [45.3358, 14.3054],
  Krk: [45.0247, 14.5769],
  Crikvenica: [45.1769, 14.6939],
  Cres: [44.9587, 14.4059],
  Lošinj: [44.5297, 14.4664],
  'Mali Lošinj': [44.5297, 14.4664],
  Rab: [44.7566, 14.7597]
}

// WMO oznake vremena (koje vraća Open-Meteo) svedene na ikonu i kratak opis
function opisiVrijeme (kod) {
  if (kod === 0) return { ikona: 'sunny', tekst: 'Vedro' }
  if ([1, 2].includes(kod)) return { ikona: 'partly_cloudy_day', tekst: 'Djelomično oblačno' }
  if (kod === 3) return { ikona: 'cloud', tekst: 'Oblačno' }
  if ([45, 48].includes(kod)) return { ikona: 'foggy', tekst: 'Magla' }
  if ([51, 53, 55, 56, 57].includes(kod)) return { ikona: 'grain', tekst: 'Rosulja' }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(kod)) return { ikona: 'rainy', tekst: 'Kiša' }
  if ([71, 73, 75, 77, 85, 86].includes(kod)) return { ikona: 'weather_snowy', tekst: 'Snijeg' }
  if ([95, 96, 99].includes(kod)) return { ikona: 'thunderstorm', tekst: 'Grmljavina' }
  return { ikona: 'thermostat', tekst: 'Nepoznato' }
}

const vrijeme = ref({ ikona: 'schedule', tekst: 'Provjeri bliže datumu' })

// Open-Meteo daje prognozu samo za idućih ~16 dana - za evente dalje u
// budućnosti nema smisla prikazivati (ne postoji pouzdana prognoza), pa
// tada ostaje poruka "Provjeri bliže datumu"
async function ucitajVrijeme () {
  const e = dogadanje.value
  vrijeme.value = { ikona: 'schedule', tekst: 'Provjeri bliže datumu' }
  if (!e?.grad || !e?.datum_pocetka) return

  const koord = KOORDINATE_GRADOVA[e.grad]
  if (!koord) return

  const datumEventa = e.datum_pocetka.slice(0, 10)
  const danas = new Date()
  const zaKolikoDana = Math.floor(
    (new Date(datumEventa) - new Date(danas.toDateString())) / 86400000
  )
  if (zaKolikoDana < 0 || zaKolikoDana > 15) return

  try {
    const [lat, lon] = koord
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FZagreb&forecast_days=16`
    const odgovor = await fetch(url)
    const podaci = await odgovor.json()
    const indeks = podaci.daily?.time?.indexOf(datumEventa)
    if (indeks === undefined || indeks === -1) return

    const opis = opisiVrijeme(podaci.daily.weathercode[indeks])
    const max = Math.round(podaci.daily.temperature_2m_max[indeks])
    const min = Math.round(podaci.daily.temperature_2m_min[indeks])
    vrijeme.value = { ikona: opis.ikona, tekst: `${opis.tekst}, ${min}°-${max}°C` }
  } catch {
    // API nedostupan - ostaje zadana poruka, ne rušimo stranicu zbog toga
  }
}

const dogadanje = computed(() => eventStore.trenutniEvent)
const jeOmiljeno = computed(
  () => dogadanje.value && favoriteStore.jeOmiljeno(dogadanje.value.id)
)

const formatiranDatum = computed(() => {
  if (!dogadanje.value?.datum_pocetka) return ''
  const d = new Date(dogadanje.value.datum_pocetka)
  let tekst = d.toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  if (dogadanje.value.datum_zavrsetka) {
    const d2 = new Date(dogadanje.value.datum_zavrsetka)
    tekst +=
      ' — ' +
      d2.toLocaleDateString('hr-HR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
  }
  return tekst
})

const lokacijaTekst = computed(() => {
  const { lokacija, grad } = dogadanje.value || {}
  if (lokacija && grad) return `${lokacija}, ${grad}`
  return lokacija || grad || ''
})

const cijenaNepoznata = computed(() => {
  const e = dogadanje.value
  return !e || e.cijena === null || e.cijena === undefined
})

const cijenaTekst = computed(() => {
  const e = dogadanje.value
  if (!e) return ''
  // cijena === null/undefined znači "cijena nepoznata" (npr. uvezeno
  // automatski), a 0 znači potvrđeno besplatan ulaz.
  if (cijenaNepoznata.value) {
    return 'Cijena nije poznata - provjeri na poveznici ispod'
  }
  if (Number(e.cijena) === 0) return 'Besplatan ulaz'
  return `${Number(e.cijena).toFixed(2)} €`
})

// otvara Google Maps pretragu (ne zna se točna adresa svakog eventa, zato
// pretraga po tekstu umjesto npr. ugrađene karte s koordinatama)
function otvoriMapu() {
  const e = dogadanje.value
  const dijelovi = [e?.lokacija, e?.adresa, e?.grad].filter(Boolean)
  const upit = dijelovi.length ? dijelovi.join(', ') : e?.naziv
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(upit)}`,
    '_blank'
  )
}

async function promijeniOmiljeno() {
  try {
    await favoriteStore.prekidaciOmiljeno(dogadanje.value.id)
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: 'Greška pri spremanju favorita.'
    })
  }
}

async function posaljiRezervaciju() {
  spremanje.value = true
  try {
    await reservationStore.kreirajRezervaciju({
      dogadanje_id: dogadanje.value.id,
      broj_mjesta: brojMjesta.value || 1
    })
    Notify.create({ type: 'positive', message: 'Rezervacija je poslana!' })
    rezervacijaDialog.value = false
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: err.response?.data?.poruka || 'Greška pri rezervaciji.'
    })
  } finally {
    spremanje.value = false
  }
}

async function podijeliEvent() {
  const link = window.location.href
  const podaci = {
    title: dogadanje.value?.naziv,
    text: `Pogledaj ovo događanje na Kantunu: ${dogadanje.value?.naziv}`,
    url: link
  }

  // navigator.share otvara prirodni share meni (mobitel/desktop), a ako
  // preglednik to ne podržava, jednostavno kopiramo link u međuspremnik
  if (navigator.share) {
    try {
      await navigator.share(podaci)
    } catch {
      // korisnik je otkazao share dijalog - nema potrebe za greškom
    }
  } else {
    await navigator.clipboard.writeText(link)
    Notify.create({ type: 'positive', message: 'Poveznica kopirana u međuspremnik!' })
  }
}

async function ucitaj() {
  await eventStore.ucitajEvent(route.params.idOrSlug)
  ucitajVrijeme()
}

// ako korisnik ode s ove stranice na drugo događanje (npr. preko linka u
// "slična događanja"), Vue Router ponovno iskoristi istu komponentu bez
// remounta - zato watch na idOrSlug umjesto samo onMounted, inače bi
// stranica prikazivala staro događanje dok se ne osvježi ručno
watch(() => route.params.idOrSlug, ucitaj)

onMounted(() => {
  ucitaj()
  if (authStore.jePrijavljen) favoriteStore.ucitajFavorite()
})
</script>

<style scoped lang="scss">
.details-page {
  min-height: 100%;
  background: var(--kantun-pozadina);
  color: var(--kantun-tekst);
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 100px 0;
}

.details-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 35px 24px 70px;
}

.back-button {
  margin-bottom: 20px;
  color: var(--kantun-tekst-suptilan);
}

.details-card {
  overflow: hidden;
  border-radius: 20px;
  background: var(--kantun-bg-card);
  border-color: var(--kantun-granica);
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
  display: flex;
  align-items: center;
  gap: 6px;
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
  width: 52px;
  height: 52px;
  min-width: 52px;
  min-height: 52px;
  padding: 0;
  color: #0a0f1e;
  background: var(--kantun-zlatna-svijetlo);
  flex-shrink: 0;
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
  color: var(--kantun-zlatna);
  font-size: 28px;
}

.information-item small {
  display: block;
  margin-bottom: 4px;
  color: var(--kantun-tekst-suptilan);
}

.information-item strong {
  display: block;
}

.description {
  color: var(--kantun-tekst-suptilan);
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-line;
}

.location-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.gold-outline-btn {
  border: 1px solid var(--kantun-zlatna);
  color: var(--kantun-zlatna-svijetlo);
}

.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 35px;
}

.actions-price {
  display: flex;
  flex-direction: column;
}

.actions-price small {
  color: var(--kantun-tekst-suptilan);
}

.actions-price strong {
  color: var(--kantun-zlatna-svijetlo);
  font-size: 22px;
}

.reserve-button {
  background: var(--kantun-accent);
  color: #0a0f1e;
}

.share-button {
  color: var(--kantun-tekst-suptilan);
  border: 1px solid var(--kantun-granica);
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.share-button:hover {
  color: var(--kantun-zlatna-svijetlo);
  border-color: var(--kantun-zlatna);
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
}
</style>
