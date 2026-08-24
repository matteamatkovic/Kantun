<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-md">
      <h1>Kategorije</h1>
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="add"
        label="Nova kategorija"
        @click="otvoriDialog(null)"
      />
    </div>

    <q-table
      flat
      bordered
      :rows="categoryStore.kategorije"
      :columns="kolone"
      row-key="id"
      :loading="ucitavanje"
    >
      <template #body-cell-boja="props">
        <q-td :props="props">
          <div class="color-swatch" :style="{ background: props.value }" />
        </q-td>
      </template>

      <template #body-cell-ikona="props">
        <q-td :props="props">
          <q-icon :name="props.value" size="20px" />
          {{ props.value }}
        </q-td>
      </template>

      <template #body-cell-akcije="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            icon="edit"
            @click="otvoriDialog(props.row)"
          />
          <q-btn
            flat
            dense
            round
            icon="delete"
            color="negative"
            @click="obrisi(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{
            uredivanje ? 'Uredi kategoriju' : 'Nova kategorija'
          }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="forma.naziv" outlined label="Naziv *" />
          <q-input
            v-model="forma.ikona"
            outlined
            label="Ikona (Material Icons naziv)"
            hint="npr. music_note, festival, palette..."
          />
          <!-- tekstualno polje i nativni color picker dijele isti v-model,
               pa promjena u jednom odmah ažurira drugi - korisnik može ili
               ručno upisati HEX ili kliknuti na kružić i odabrati boju -->
          <q-input
            v-model="forma.boja"
            outlined
            label="Boja (HEX)"
            hint="npr. #22d3ee"
          >
            <template #append>
              <input v-model="forma.boja" type="color" class="color-input" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Odustani" v-close-popup />
          <q-btn
            unelevated
            no-caps
            label="Spremi"
            color="primary"
            :loading="spremanje"
            @click="spremi"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
// Admin upravljanje kategorijama (/admin/kategorije) - isti obrazac kao
// AdminEventsPage: jedan dialog za dodavanje i uređivanje
import { ref, onMounted } from 'vue'
import { Notify, Dialog } from 'quasar'
import { useCategoryStore } from '@/stores/categories'

const categoryStore = useCategoryStore()
const ucitavanje = ref(true)
const dialogOpen = ref(false)
const uredivanje = ref(false)
const spremanje = ref(false)
const forma = ref({ id: null, naziv: '', boja: '#22d3ee', ikona: 'event' })

const kolone = [
  { name: 'naziv', label: 'Naziv', field: 'naziv', align: 'left' },
  { name: 'boja', label: 'Boja', field: 'boja', align: 'left' },
  { name: 'ikona', label: 'Ikona', field: 'ikona', align: 'left' },
  { name: 'akcije', label: '', field: 'akcije', align: 'right' }
]

function otvoriDialog(kategorija) {
  if (kategorija) {
    uredivanje.value = true
    forma.value = { ...kategorija }
  } else {
    uredivanje.value = false
    forma.value = { id: null, naziv: '', boja: '#22d3ee', ikona: 'event' }
  }
  dialogOpen.value = true
}

async function spremi() {
  spremanje.value = true
  try {
    const podaci = {
      naziv: forma.value.naziv,
      boja: forma.value.boja,
      ikona: forma.value.ikona
    }
    if (uredivanje.value) {
      await categoryStore.azurirajKategoriju(forma.value.id, podaci)
    } else {
      await categoryStore.kreirajKategoriju(podaci)
    }
    Notify.create({ type: 'positive', message: 'Kategorija spremljena.' })
    dialogOpen.value = false
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: err.response?.data?.poruka || 'Greška pri spremanju.'
    })
  } finally {
    spremanje.value = false
  }
}

function obrisi(kategorija) {
  Dialog.create({
    title: 'Brisanje kategorije',
    message: `Obrisati kategoriju "${kategorija.naziv}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await categoryStore.obrisiKategoriju(kategorija.id)
      Notify.create({ type: 'positive', message: 'Kategorija obrisana.' })
    } catch (err) {
      Notify.create({ type: 'negative', message: 'Greška pri brisanju.' })
    }
  })
}

onMounted(async () => {
  try {
    await categoryStore.ucitajKategorije(true)
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

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid var(--kantun-granica);
}

.color-input {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}
</style>
