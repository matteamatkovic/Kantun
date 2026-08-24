<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-md">
      <h1>Događanja</h1>
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="add"
        label="Novo događanje"
        @click="otvoriDialog(null)"
      />
    </div>

    <q-table
      flat
      bordered
      :rows="eventStore.dogadanja"
      :columns="kolone"
      row-key="id"
      :loading="ucitavanje"
      :pagination="{ rowsPerPage: 15 }"
    >
      <template #body-cell-cijena="props">
        <q-td :props="props">
          {{
            props.value === null || props.value === undefined
              ? 'Nepoznato'
              : Number(props.value) === 0
                ? 'Besplatno'
                : `${Number(props.value).toFixed(2)} €`
          }}
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

    <!-- Dialog uređivanja/kreiranja eventa -->
    <q-dialog v-model="dialogOpen" full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{
            uredivanje ? 'Uredi događanje' : 'Novo događanje'
          }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="forma.naziv" outlined label="Naziv *" />

          <q-select
            v-model="forma.kategorija_id"
            outlined
            emit-value
            map-options
            label="Kategorija"
            :options="kategorijeOpcije"
          />

          <div class="row q-col-gutter-md">
            <q-input
              v-model="forma.lokacija"
              outlined
              label="Lokacija (naziv mjesta)"
              class="col"
            />
            <q-input v-model="forma.grad" outlined label="Grad" class="col" />
          </div>

          <q-input v-model="forma.adresa" outlined label="Adresa" />

          <div class="row q-col-gutter-md">
            <q-input
              v-model="forma.datum_pocetka"
              outlined
              type="datetime-local"
              label="Datum i vrijeme početka *"
              class="col"
            />
            <q-input
              v-model="forma.datum_zavrsetka"
              outlined
              type="datetime-local"
              label="Datum i vrijeme završetka"
              class="col"
            />
          </div>

          <q-input v-model="forma.opis" outlined type="textarea" label="Opis" />

          <q-input v-model="forma.slika_url" outlined label="URL slike" />

          <q-input
            v-model="forma.web_link"
            outlined
            label="Web link (više informacija)"
          />

          <q-input
            v-model.number="forma.cijena"
            outlined
            type="number"
            min="0"
            step="0.01"
            label="Cijena (EUR, 0 = besplatno, prazno = nepoznato)"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Zatvori" v-close-popup />
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
// Admin upravljanje događanjima (/admin/dogadanja) - tablica + jedan dialog
// koji se koristi i za dodavanje i za uređivanje (uredivanje ref odlučuje koji je)
import { ref, computed, onMounted } from 'vue'
import { Notify, Dialog } from 'quasar'
import { useEventStore } from '@/stores/events'
import { useCategoryStore } from '@/stores/categories'

const eventStore = useEventStore()
const categoryStore = useCategoryStore()

const ucitavanje = ref(true)
const dialogOpen = ref(false)
const uredivanje = ref(false)
const spremanje = ref(false)

const zadanaForma = () => ({
  id: null,
  naziv: '',
  opis: '',
  kategorija_id: null,
  lokacija: '',
  grad: '',
  adresa: '',
  datum_pocetka: '',
  datum_zavrsetka: '',
  cijena: null,
  slika_url: '',
  web_link: ''
})
const forma = ref(zadanaForma())

const kolone = [
  { name: 'naziv', label: 'Naziv', field: 'naziv', align: 'left' },
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
  { name: 'grad', label: 'Grad', field: 'grad', align: 'left' },
  { name: 'cijena', label: 'Cijena', field: 'cijena', align: 'left' },
  { name: 'akcije', label: '', field: 'akcije', align: 'right' }
]

const kategorijeOpcije = computed(() =>
  categoryStore.kategorije.map(k => ({ label: k.naziv, value: k.id }))
)

async function ucitajSve() {
  ucitavanje.value = true
  try {
    await eventStore.pretraziDogadanja()
  } finally {
    ucitavanje.value = false
  }
}

// event=null -> prazna forma za novo događanje; event=objekt -> forma
// se popuni postojećim podacima i uredivanje se postavi na true
function otvoriDialog(event) {
  if (event) {
    uredivanje.value = true
    forma.value = {
      id: event.id,
      naziv: event.naziv,
      opis: event.opis,
      kategorija_id: event.kategorija_id,
      lokacija: event.lokacija,
      grad: event.grad,
      adresa: event.adresa,
      // baza vraća puni ISO datum, a datetime-local input traži samo
      // "YYYY-MM-DDTHH:mm" pa se ostatak jednostavno odreže
      datum_pocetka: event.datum_pocetka?.slice(0, 16) || '',
      datum_zavrsetka: event.datum_zavrsetka?.slice(0, 16) || '',
      cijena:
        event.cijena === null || event.cijena === undefined
          ? null
          : Number(event.cijena),
      slika_url: event.slika_url,
      web_link: event.web_link
    }
  } else {
    uredivanje.value = false
    forma.value = zadanaForma()
  }
  dialogOpen.value = true
}

// id se ne šalje u tijelu zahtjeva - kod uređivanja već je u URL-u
// (PUT /dogadanja/:id), a kod kreiranja ga baza sama generira
async function spremi() {
  spremanje.value = true
  try {
    const podaci = { ...forma.value }
    delete podaci.id
    if (!podaci.datum_zavrsetka) podaci.datum_zavrsetka = null
    if (uredivanje.value) {
      await eventStore.azurirajEvent(forma.value.id, podaci)
    } else {
      await eventStore.kreirajEvent(podaci)
    }
    Notify.create({ type: 'positive', message: 'Događanje spremljeno.' })
    dialogOpen.value = false
    ucitajSve()
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: err.response?.data?.poruka || 'Greška pri spremanju.'
    })
  } finally {
    spremanje.value = false
  }
}

// Quasar Dialog.create umjesto obične JS potvrde (window.confirm) - ljepše
// se uklapa u izgled aplikacije i radi na mobitelu bez čudnog ponašanja
function obrisi(event) {
  Dialog.create({
    title: 'Brisanje događanja',
    message: `Obrisati događanje "${event.naziv}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await eventStore.obrisiEvent(event.id)
      Notify.create({ type: 'positive', message: 'Događanje obrisano.' })
      ucitajSve()
    } catch (err) {
      Notify.create({ type: 'negative', message: 'Greška pri brisanju.' })
    }
  })
}

onMounted(async () => {
  await Promise.all([ucitajSve(), categoryStore.ucitajKategorije(true)])
})
</script>

<style scoped lang="scss">
h1 {
  margin: 0;
  color: var(--kantun-tekst);
}
</style>
