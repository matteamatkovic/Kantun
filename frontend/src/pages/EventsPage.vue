<template>
  <q-page class="events-page">

    <div class="page-container">

      <div class="page-heading">

        <div class="eyebrow">
          KANTUN
        </div>

        <h1>
          Događanja na Kvarneru
        </h1>

        <p>
          Pronađi koncerte, festivale, izložbe, predstave,
          sportska događanja i još mnogo toga.
        </p>

      </div>

      <EventFilters @promjena="primijeniFiltere" />

      <div class="results-header">

        <div>
          Pronađeno
          <strong>{{ filtriranaDogadanja.length }}</strong>
          događanja
        </div>

        <q-select
          v-model="sortiranje"
          outlined
          dense
          emit-value
          map-options
          label="Sortiranje"
          :options="opcijeSortiranja"
          style="width: 190px"
        />

      </div>

      <div
        v-if="filtriranaDogadanja.length"
        class="events-grid"
      >

        <EventCard
          v-for="event in filtriranaDogadanja"
          :key="event.id"
          :event="event"
        />

      </div>

      <div
        v-else
        class="empty-state"
      >

        <q-icon
          name="event_busy"
          size="70px"
        />

        <h2>
          Nema pronađenih događanja
        </h2>

        <p>
          Pokušaj promijeniti kriterije pretraživanja.
        </p>

      </div>

    </div>

  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import EventCard from 'components/EventCard.vue'
import EventFilters from 'components/EventFilters.vue'

const sortiranje = ref('datum')

const filteri = ref({
  pretraga: '',
  kategorija: null,
  grad: null
})

const opcijeSortiranja = [
  {
    label: 'Najbliži datum',
    value: 'datum'
  },
  {
    label: 'Naziv A-Z',
    value: 'naziv'
  }
]

const dogadanja = ref([
  {
    id: 1,
    naziv: 'Ljeto na Gradini',
    datum: '8. kolovoza 2026.',
    datumSort: '2026-08-08',
    vrijeme: '21:00',
    lokacija: 'Trsatska gradina, Rijeka',
    grad: 'Rijeka',
    kategorija: 'Koncerti',
    slika: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    omiljeno: false
  },
  {
    id: 2,
    naziv: 'Riječki koncert',
    datum: '9. kolovoza 2026.',
    datumSort: '2026-08-09',
    vrijeme: '20:00',
    lokacija: 'Rijeka',
    grad: 'Rijeka',
    kategorija: 'Koncerti',
    slika: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    omiljeno: false
  },
  {
    id: 3,
    naziv: 'Ljetni festival',
    datum: '10. kolovoza 2026.',
    datumSort: '2026-08-10',
    vrijeme: '18:00',
    lokacija: 'Opatija',
    grad: 'Opatija',
    kategorija: 'Festivali',
    slika: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    omiljeno: false
  },
  {
    id: 4,
    naziv: 'Izložba suvremene umjetnosti',
    datum: '15. kolovoza 2026.',
    datumSort: '2026-08-15',
    vrijeme: '19:00',
    lokacija: 'Muzej moderne i suvremene umjetnosti, Rijeka',
    grad: 'Rijeka',
    kategorija: 'Izložbe',
    slika: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912',
    omiljeno: false
  },
  {
    id: 5,
    naziv: 'Kazališna večer',
    datum: '20. kolovoza 2026.',
    datumSort: '2026-08-20',
    vrijeme: '20:00',
    lokacija: 'HNK Ivana pl. Zajca, Rijeka',
    grad: 'Rijeka',
    kategorija: 'Predstave',
    slika: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
    omiljeno: false
  },
  {
    id: 6,
    naziv: 'Ljetna fešta',
    datum: '22. kolovoza 2026.',
    datumSort: '2026-08-22',
    vrijeme: '20:00',
    lokacija: 'Crikvenica',
    grad: 'Crikvenica',
    kategorija: 'Ostalo',
    slika: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    omiljeno: false
  }
])

const filtriranaDogadanja = computed(() => {
  let rezultat = dogadanja.value.filter(event => {
    const pretraga =
      filteri.value.pretraga?.toLowerCase() || ''

    const odgovaraPretrazi =
      !pretraga ||
      event.naziv.toLowerCase().includes(pretraga) ||
      event.lokacija.toLowerCase().includes(pretraga)

    const odgovaraKategoriji =
      !filteri.value.kategorija ||
      event.kategorija === filteri.value.kategorija

    const odgovaraGradu =
      !filteri.value.grad ||
      event.grad === filteri.value.grad

    return (
      odgovaraPretrazi &&
      odgovaraKategoriji &&
      odgovaraGradu
    )
  })

  if (sortiranje.value === 'naziv') {
    rezultat = [...rezultat].sort((a, b) =>
      a.naziv.localeCompare(b.naziv)
    )
  }

  return rezultat
})

function primijeniFiltere (noviFilteri) {
  filteri.value = noviFilteri
}
</script>

<style scoped lang="scss">
.events-page {
  min-height: 100%;
  background: #fafcfc;
  color: #173f4f;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.page-heading {
  margin-bottom: 35px;
}

.eyebrow {
  color: #d09d1e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1 {
  margin: 8px 0 12px;
  font-size: clamp(36px, 5vw, 52px);
}

.page-heading p {
  max-width: 700px;
  margin: 0;
  color: #71858b;
  font-size: 17px;
  line-height: 1.6;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #71858b;
}

.results-header strong {
  color: #173f4f;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: #71858b;
}

.empty-state h2 {
  color: #173f4f;
}

@media (max-width: 900px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .results-header {
    align-items: stretch;
    flex-direction: column;
    gap: 15px;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>