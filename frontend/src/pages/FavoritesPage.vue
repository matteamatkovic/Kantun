<template>
  <q-page class="favorites-page">
    <div class="page-container">
      <div class="page-heading">
        <div class="kantun-eyebrow">KANTUN</div>
        <h1>Moji favoriti</h1>
        <p>Događanja koja si spremila/spremio za kasnije.</p>
      </div>

      <div v-if="ucitavanje" class="loading-state">
        <q-spinner color="primary" size="48px" />
      </div>

      <div v-else-if="favoriteStore.favoriti.length" class="events-grid">
        <EventCard
          v-for="event in favoriteStore.favoriti"
          :key="event.id"
          :event="event"
        />
      </div>

      <div v-else class="empty-state">
        <q-icon name="favorite_border" size="70px" />
        <h2>Nemaš spremljenih događanja</h2>
        <p>Klikni na ikonu srca na bilo kojem događanju da ga spremiš ovdje.</p>
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
// Stranica s favoritima prijavljenog korisnika (/favoriti, zahtijeva
// prijavu - vidi meta.zahtijevaPrijavu u routes.js)
import { ref, onMounted } from 'vue'
import EventCard from '@/components/EventCard.vue'
import { useFavoriteStore } from '@/stores/favorites'

const favoriteStore = useFavoriteStore()
const ucitavanje = ref(true)

onMounted(async () => {
  try {
    await favoriteStore.ucitajFavorite()
  } finally {
    ucitavanje.value = false
  }
})
</script>

<style scoped lang="scss">
.favorites-page {
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
  font-size: clamp(32px, 5vw, 46px);
}

.page-heading p {
  color: var(--kantun-tekst-suptilan);
  font-size: 17px;
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
  margin: 15px 0 8px;
  color: var(--kantun-tekst);
}

.empty-state p {
  margin-bottom: 20px;
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
