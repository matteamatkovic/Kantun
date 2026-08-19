<template>
  <q-page class="events-page">
    <div class="page-container">
      <div class="page-heading">
        <div class="kantun-eyebrow"> KANTUN </div>

        <h1> Događanja na Kvarneru </h1>

        <p>
          Pronađi koncerte, festivale, izložbe, predstave, sportska događanja i
          još mnogo toga u idućih nekoliko mjeseci.
        </p>
      </div>

      <EventFilters @promjena="primijeniFiltere" />

      <div class="results-header">
        Pronađeno
        <strong>{{ eventStore.dogadanja.length }}</strong>
        događanja
      </div>

      <div v-if="eventStore.ucitavanje" class="loading-state">
        <q-spinner color="primary" size="48px" />
      </div>

      <div v-else-if="eventStore.dogadanja.length" class="events-grid">
        <EventCard
          v-for="event in eventStore.dogadanja"
          :key="event.id"
          :event="event"
        />
      </div>

      <div v-else class="empty-state">
        <q-icon name="event_busy" size="70px" />

        <h2> Nema pronađenih događanja </h2>

        <p> Pokušaj promijeniti kriterije pretraživanja. </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EventCard from '@/components/EventCard.vue'
import EventFilters from '@/components/EventFilters.vue'
import { useEventStore } from '@/stores/events'
import { useFavoriteStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'

const eventStore = useEventStore()
const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()

const trenutniFilteri = ref({})

function primijeniFiltere(noviFilteri) {
  trenutniFilteri.value = noviFilteri
  ucitaj()
}

function ucitaj() {
  eventStore.pretraziDogadanja(trenutniFilteri.value)
}

onMounted(() => {
  ucitaj()
  if (authStore.jePrijavljen) favoriteStore.ucitajFavorite()
})
</script>

<style scoped lang="scss">
.events-page {
  min-height: 100%;
  background: var(--kantun-pozadina);
  color: var(--kantun-tekst);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.page-heading {
  margin-bottom: 35px;
}

h1 {
  margin: 8px 0 12px;
  font-size: clamp(36px, 5vw, 52px);
}

.page-heading p {
  max-width: 700px;
  margin: 0;
  color: var(--kantun-tekst-suptilan);
  font-size: 17px;
  line-height: 1.6;
}

.results-header {
  margin-bottom: 20px;
  color: var(--kantun-tekst-suptilan);
}

.results-header strong {
  color: var(--kantun-tekst);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: var(--kantun-tekst-suptilan);
}

.empty-state h2 {
  color: var(--kantun-tekst);
}

@media (max-width: 900px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
