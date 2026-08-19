<template>
  <div class="filters kantun-card">
    <q-input
      v-model="filteri.pretraga"
      outlined
      dense
      clearable
      label="Pretraži događanja"
      placeholder="Naziv ili lokacija..."
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-select
      v-model="filteri.kategorija_id"
      outlined
      dense
      clearable
      emit-value
      map-options
      label="Kategorija"
      :options="kategorijeOpcije"
    />

    <q-select
      v-model="filteri.grad"
      outlined
      dense
      clearable
      emit-value
      map-options
      label="Grad"
      :options="gradoviOpcije"
    />

    <q-toggle v-model="filteri.besplatno" label="Samo besplatno" />

    <q-btn flat no-caps icon="restart_alt" label="Očisti" @click="ocisti" />
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, computed } from 'vue'
import { useCategoryStore } from '@/stores/categories'
import { useEventStore } from '@/stores/events'

const emit = defineEmits(['promjena'])
const categoryStore = useCategoryStore()
const eventStore = useEventStore()

const filteri = reactive({
  pretraga: '',
  kategorija_id: null,
  grad: null,
  besplatno: false
})

const kategorijeOpcije = computed(() =>
  categoryStore.kategorije.map(k => ({ label: k.naziv, value: k.id }))
)

const gradoviOpcije = computed(() =>
  eventStore.gradovi.map(g => ({ label: g, value: g }))
)

// čeka 300ms nakon zadnje promjene prije nego pošalje filtere roditelju,
// da ne šaljemo API poziv na svaki utipkani znak dok korisnik piše u polje
let debounceTimer = null
watch(
  filteri,
  () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      emit('promjena', { ...filteri })
    }, 300)
  },
  { deep: true }
)

function ocisti() {
  filteri.pretraga = ''
  filteri.kategorija_id = null
  filteri.grad = null
  filteri.besplatno = false
}

onMounted(() => {
  categoryStore.ucitajKategorije()
  eventStore.ucitajGradove()
})
</script>

<style scoped lang="scss">
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

@media (max-width: 1100px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
