<template>
  <div class="filters">

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
      v-model="filteri.kategorija"
      outlined
      dense
      clearable
      emit-value
      map-options
      label="Kategorija"
      :options="kategorije"
    />

    <q-select
      v-model="filteri.grad"
      outlined
      dense
      clearable
      emit-value
      map-options
      label="Grad"
      :options="gradovi"
    />

    <q-btn
      flat
      no-caps
      icon="restart_alt"
      label="Očisti"
      @click="ocisti"
    />

  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const emit = defineEmits(['promjena'])

const filteri = reactive({
  pretraga: '',
  kategorija: null,
  grad: null
})

const kategorije = [
  {
    label: 'Koncerti',
    value: 'Koncerti'
  },
  {
    label: 'Festivali',
    value: 'Festivali'
  },
  {
    label: 'Izložbe',
    value: 'Izložbe'
  },
  {
    label: 'Predstave',
    value: 'Predstave'
  },
  {
    label: 'Sport',
    value: 'Sport'
  },
  {
    label: 'Radionice',
    value: 'Radionice'
  },
  {
    label: 'Ostalo',
    value: 'Ostalo'
  }
]

const gradovi = [
  {
    label: 'Rijeka',
    value: 'Rijeka'
  },
  {
    label: 'Opatija',
    value: 'Opatija'
  },
  {
    label: 'Crikvenica',
    value: 'Crikvenica'
  },
  {
    label: 'Novi Vinodolski',
    value: 'Novi Vinodolski'
  },
  {
    label: 'Krk',
    value: 'Krk'
  },
  {
    label: 'Cres',
    value: 'Cres'
  },
  {
    label: 'Lošinj',
    value: 'Lošinj'
  },
  {
    label: 'Rab',
    value: 'Rab'
  }
]

watch(
  filteri,
  () => {
    emit('promjena', { ...filteri })
  },
  {
    deep: true
  }
)

function ocisti () {
  filteri.pretraga = ''
  filteri.kategorija = null
  filteri.grad = null
}
</script>

<style scoped lang="scss">
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #e8eeee;
  border-radius: 16px;
  background: white;
}

@media (max-width: 800px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>