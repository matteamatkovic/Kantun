<template>
  <q-page class="q-pa-lg">
    <h1 class="q-mb-md">Rezervacije</h1>

    <q-table
      flat
      bordered
      :rows="reservationStore.sveRezervacije"
      :columns="kolone"
      row-key="id"
      :loading="ucitavanje"
      :pagination="{ rowsPerPage: 20 }"
    >
      <template #body-cell-korisnik="props">
        <q-td :props="props">
          {{ props.row.ime }} {{ props.row.prezime }}
          <div class="text-caption text-grey">{{ props.row.email }}</div>
        </q-td>
      </template>

      <template #body-cell-datum_pocetka="props">
        <q-td :props="props">{{ formatDatum(props.value) }}</q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-select
            :model-value="props.row.status"
            dense
            outlined
            emit-value
            map-options
            :options="statusOpcije"
            style="min-width: 170px"
            @update:model-value="v => promijeniStatus(props.row, v)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
// Admin pregled SVIH rezervacija svih korisnika (/admin/rezervacije) -
// koristi reservationStore.ucitajSve() (ruta s ?sve=1), za razliku od
// MyReservationsPage koja prikazuje samo rezervacije prijavljenog korisnika
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useReservationStore } from '@/stores/reservations'

const reservationStore = useReservationStore()
const ucitavanje = ref(true)

const kolone = [
  {
    name: 'dogadanje_naziv',
    label: 'Događanje',
    field: 'dogadanje_naziv',
    align: 'left'
  },
  {
    name: 'datum_pocetka',
    label: 'Datum',
    field: 'datum_pocetka',
    align: 'left',
    format: val =>
      val
        ? new Date(val).toLocaleString('hr-HR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : ''
  },
  { name: 'korisnik', label: 'Korisnik', field: 'korisnik', align: 'left' },
  {
    name: 'broj_mjesta',
    label: 'Broj mjesta',
    field: 'broj_mjesta',
    align: 'left'
  },
  { name: 'status', label: 'Status', field: 'status', align: 'left' }
]

const statusOpcije = [
  { label: 'Na čekanju', value: 'na_cekanju' },
  { label: 'Potvrđeno', value: 'potvrdena' },
  { label: 'Otkazano', value: 'otkazana' }
]

function formatDatum(datum) {
  if (!datum) return ''
  return new Date(datum).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// select u tablici zove ovo izravno na promjenu (@update:model-value) -
// nema posebnog gumba "Spremi", status se mijenja odmah čim admin odabere
async function promijeniStatus(rezervacija, status) {
  try {
    await reservationStore.postaviStatus(rezervacija.id, status)
    Notify.create({ type: 'positive', message: 'Status ažuriran.' })
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: 'Greška pri ažuriranju statusa.'
    })
  }
}

onMounted(async () => {
  try {
    await reservationStore.ucitajSve()
  } finally {
    ucitavanje.value = false
  }
})
</script>

<style scoped lang="scss">
h1 {
  margin: 0;
  color: var(--kantun-tekst);
}
</style>
