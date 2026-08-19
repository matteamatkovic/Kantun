<template>
  <q-page class="index-page">
    <!-- Hero sekcija -->
    <section class="hero">
      <div class="hero-container">
        <div class="kantun-eyebrow hero-eyebrow">
          RIJEKA · KVARNER · PRIMORSKO-GORANSKA ŽUPANIJA
        </div>

        <h1>
          Sva događanja na Kvarneru,
          <span class="highlight">na jednom mjestu</span>
        </h1>
      </div>

      <div class="hero-photo">
        <img :src="rijekaSlika" alt="Rijeka" class="hero-photo-image" />
      </div>

      <div class="hero-container">
        <p>
          Kantun okuplja koncerte, festivale, izložbe, predstave, sportska i
          gastro događanja u Rijeci i cijeloj županiji — pretraži, filtriraj i
          spremi ono što te zanima u idućih nekoliko mjeseci.
        </p>

        <div class="hero-actions">
          <q-btn
            unelevated
            no-caps
            size="lg"
            label="Pregledaj događanja"
            icon="event"
            class="hero-button-primary"
            to="/dogadanja"
          />

          <q-btn
            outline
            no-caps
            size="lg"
            label="Kalendar"
            icon="calendar_month"
            class="hero-button-secondary"
            to="/kalendar"
          />

          <q-btn
            flat
            no-caps
            size="lg"
            label="Iznenadi me"
            icon="casino"
            class="hero-button-surprise"
            @click="iznenadiMe"
          />
        </div>
      </div>
    </section>

    <!-- Preporučeno -->
    <section class="section section-alt">
      <div class="section-container">
        <div class="section-heading-row">
          <h2>Preporučeno</h2>
          <q-btn
            flat
            no-caps
            label="Sva događanja"
            icon-right="arrow_forward"
            to="/dogadanja"
          />
        </div>

        <div v-if="eventStore.ucitavanje" class="loading-state">
          <q-spinner color="primary" size="48px" />
        </div>

        <div v-else class="events-grid">
          <EventCard
            v-for="event in preporuceniEventi"
            :key="event.id"
            :event="event"
          />
        </div>
      </div>
    </section>

    <!-- Kategorije -->
    <section class="section">
      <div class="section-container">
        <h2>Istraži po kategorijama</h2>

        <div class="category-grid">
          <q-card
            v-for="kategorija in categoryStore.kategorije"
            :key="kategorija.id"
            flat
            bordered
            class="category-card"
            @click="
              $router.push({
                path: '/dogadanja',
                query: { kategorija_id: kategorija.id }
              })
            "
          >
            <q-icon
              :name="kategorija.ikona || 'event'"
              :style="{ color: kategorija.boja || 'var(--kantun-zlatna)' }"
              size="34px"
            />
            <div class="category-naziv">{{ kategorija.naziv }}</div>
          </q-card>
        </div>
      </div>
    </section>

    <!-- O aplikaciji -->
    <section class="section about">
      <div class="section-container about-grid">
        <div>
          <h2>Zašto Kantun?</h2>
          <p>
            Kantun povezuje događanja iz cijelog Kvarnera na jednom mjestu — bez
            potrebe da pratiš desetke različitih stranica i profila. Lokalni
            organizatori objavljuju svoje evente izravno kroz admin sučelje.
          </p>
        </div>

        <div class="about-features">
          <div class="feature">
            <q-icon name="search" size="28px" />
            <div>
              <strong>Pretraga i filtri</strong>
              <span>Po kategoriji, gradu, datumu i cijeni ulaznice.</span>
            </div>
          </div>

          <div class="feature">
            <q-icon name="favorite" size="28px" />
            <div>
              <strong>Spremi favorite</strong>
              <span>Sačuvaj događanja koja te zanimaju za kasnije.</span>
            </div>
          </div>

          <div class="feature">
            <q-icon name="place" size="28px" />
            <div>
              <strong>Lokacija i mreže</strong>
              <span
                >Karta do mjesta održavanja i društvene mreže
                organizatora.</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EventCard from '@/components/EventCard.vue'
import { useEventStore } from '@/stores/events'
import { useCategoryStore } from '@/stores/categories'
import { useFavoriteStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import rijekaSlika from '@/assets/rijeka2.jpg'

const router = useRouter()
const eventStore = useEventStore()
const categoryStore = useCategoryStore()
const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()

const preporuceniEventi = ref([])

function izmijesaj(niz) {
  const kopija = [...niz]
  for (let i = kopija.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopija[i], kopija[j]] = [kopija[j], kopija[i]]
  }
  return kopija
}

// Odabere nasumično događanje iz već učitanog popisa i odvede korisnika
// izravno na njega - koristi isti popis kao i "Preporučeno" sekcija, bez
// dodatnog poziva prema API-ju
function iznenadiMe() {
  const popis = eventStore.dogadanja
  if (!popis.length) return
  const nasumicno = popis[Math.floor(Math.random() * popis.length)]
  router.push(`/dogadanja/${nasumicno.id}`)
}

onMounted(async () => {
  categoryStore.ucitajKategorije()
  const dogadanja = await eventStore.pretraziDogadanja({ nadolazeca: 1 })
  preporuceniEventi.value = izmijesaj(dogadanja || []).slice(0, 6)
  if (authStore.jePrijavljen) favoriteStore.ucitajFavorite()
})
</script>

<style scoped lang="scss">
.index-page {
  background: var(--kantun-pozadina);
  color: var(--kantun-tekst);
}

.hero {
  background: linear-gradient(135deg, #0f172a 0%, #0a0f1e 100%);
  color: white;
  margin-top: -88px;
  padding: 178px 24px 100px;
  position: relative;
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-eyebrow {
  color: var(--kantun-accent);
}

.hero h1 {
  margin: 14px 0 20px;
  font-size: clamp(34px, 6vw, 56px);
  line-height: 1.15;
}

.hero h1 .highlight {
  color: var(--kantun-accent);
}

.hero p {
  max-width: 620px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  line-height: 1.6;
}

.hero-photo {
  max-width: 900px;
  height: 320px;
  margin: 40px auto 45px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(245, 158, 11, 0.25);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
}

.hero-photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 35px;
  flex-wrap: wrap;
}

.hero-button-primary {
  background: var(--kantun-accent);
  color: #0a0f1e;
  font-weight: 700;
  padding: 0 28px;
}

.hero-button-secondary {
  color: white;
  border: 1px solid var(--kantun-zlatna-svijetlo);
  padding: 0 28px;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.hero-button-secondary:hover {
  background: rgba(251, 191, 36, 0.1);
}

.hero-button-surprise {
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0 20px;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.hero-button-surprise:hover {
  color: var(--kantun-zlatna-svijetlo);
  border-color: var(--kantun-zlatna-svijetlo);
  background: rgba(251, 191, 36, 0.1);
}

.section {
  padding: 70px 24px;
}

.section-alt {
  background: var(--kantun-bg-card);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section h2 {
  margin: 0 0 30px;
  font-size: 32px;
}

.section-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.section-heading-row h2 {
  margin: 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 26px 12px;
  border-radius: 16px;
  cursor: pointer;
  text-align: center;
  background: var(--kantun-bg-card);
  border-color: var(--kantun-granica);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.category-naziv {
  font-weight: 700;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: start;
}

.about p {
  color: var(--kantun-tekst-suptilan);
  font-size: 17px;
  line-height: 1.7;
}

.about-features {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.feature .q-icon {
  color: var(--kantun-zlatna);
  flex-shrink: 0;
}

.feature strong {
  display: block;
  margin-bottom: 4px;
}

.feature span {
  color: var(--kantun-tekst-suptilan);
  font-size: 14px;
}

@media (max-width: 900px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
