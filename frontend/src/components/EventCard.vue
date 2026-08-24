<template>
  <q-card flat bordered class="event-card" @click="otvoriDetalje">
    <div class="event-image">
      <q-img :src="event.slika_url || zadanaSlika" :ratio="16 / 10" />

      <div
        v-if="!cijenaNepoznata"
        class="badge-cijena"
        :class="{ 'badge-besplatno': jeBesplatno }"
      >
        {{ cijenaTekst }}
      </div>

      <q-btn
        v-if="authStore.jePrijavljen"
        round
        dense
        flat
        size="md"
        :icon="jeOmiljeno ? 'favorite' : 'favorite_border'"
        class="favorite-button"
        :class="{ 'is-favorite': jeOmiljeno }"
        @click.stop="promijeniOmiljeno"
      />
    </div>

    <q-card-section>
      <div
        class="event-category"
        :style="{ color: event.kategorija_boja || 'var(--kantun-zlatna)' }"
      >
        <q-icon
          v-if="event.kategorija_ikona"
          :name="event.kategorija_ikona"
          size="14px"
        />
        {{ event.kategorija_naziv || 'Ostalo' }}
      </div>

      <div class="event-date">
        <q-icon name="event" size="14px" />
        {{ formatiranDatum }}
      </div>

      <div class="event-title">
        {{ event.naziv }}
      </div>

      <div class="event-location">
        <q-icon name="location_on" />
        {{ lokacijaTekst }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
// Kartica jednog događanja - koristi se na početnoj, na /dogadanja, u
// kalendaru i na favoritima, uvijek s istim izgledom (slika, cijena,
// kategorija, datum, lokacija + gumb za favorite ako je korisnik prijavljen)
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFavoriteStore } from '@/stores/favorites'
import { Notify } from 'quasar'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const authStore = useAuthStore()
const favoriteStore = useFavoriteStore()

const zadanaSlika =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'

const jeOmiljeno = computed(() => favoriteStore.jeOmiljeno(props.event.id))

const formatiranDatum = computed(() => {
  if (!props.event.datum_pocetka) return ''
  const d = new Date(props.event.datum_pocetka)
  return d.toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const lokacijaTekst = computed(() => {
  const { lokacija, grad } = props.event
  if (lokacija && grad) return `${lokacija}, ${grad}`
  return lokacija || grad || ''
})

// cijena === null/undefined znači "cijena nepoznata" (npr. uvezeno
// automatski), a 0 znači potvrđeno besplatan ulaz - ne smiju se miješati.
const cijenaNepoznata = computed(
  () => props.event.cijena === null || props.event.cijena === undefined
)
const jeBesplatno = computed(
  () => !cijenaNepoznata.value && Number(props.event.cijena) === 0
)

const cijenaTekst = computed(() => {
  if (cijenaNepoznata.value) return 'Provjeri cijenu'
  if (jeBesplatno.value) return 'Besplatno'
  return `${Number(props.event.cijena).toFixed(2)} €`
})

function otvoriDetalje() {
  router.push(`/dogadanja/${props.event.id}`)
}

// gumb ima @click.stop (vidi template) da klik na srce ne otvori i
// detalje događanja - to su dvije odvojene akcije na istoj kartici
async function promijeniOmiljeno() {
  try {
    await favoriteStore.prekidaciOmiljeno(props.event.id)
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: 'Greška pri spremanju favorita.'
    })
  }
}
</script>

<style scoped lang="scss">
.event-card {
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  background: var(--kantun-bg-card);
  border-color: var(--kantun-granica);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.35);
}

.event-image {
  position: relative;
}

.badge-cijena {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  background: var(--kantun-zlatna);
  color: #0a0f1e;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.badge-besplatno {
  background: #34d399;
}

.favorite-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  padding: 0;
  background: var(--kantun-bg-card);
  color: var(--kantun-tekst);
}

.favorite-button.is-favorite {
  color: #f87171;
}

.event-category {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 7px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.event-date {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  color: var(--kantun-accent);
  font-size: 13px;
  font-weight: 700;
}

.event-title {
  margin-bottom: 10px;
  color: var(--kantun-tekst);
  font-size: 21px;
  font-weight: 750;
  line-height: 1.25;
}

.event-location {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  color: var(--kantun-tekst-suptilan);
  font-size: 14px;
}
</style>
