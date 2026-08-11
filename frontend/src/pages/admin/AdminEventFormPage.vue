<template>
  <q-page class="admin-page">

    <div class="admin-container">

      <div class="page-heading">

        <q-btn
          flat
          no-caps
          icon="arrow_back"
          label="Natrag na događanja"
          to="/admin/events"
          class="back-button"
        />

        <div class="eyebrow">
          ADMINISTRACIJA
        </div>

        <h1>
          {{ jeUredivanje
            ? 'Uredi događanje'
            : 'Dodaj događanje'
          }}
        </h1>

        <p>
          Unesi sve potrebne podatke o događanju.
        </p>

      </div>

      <q-card
        flat
        bordered
        class="form-card"
      >

        <q-form @submit="spremiDogadanje">

          <div class="form-grid">

            <q-input
              v-model="obrazac.naziv"
              outlined
              label="Naziv događanja *"
              :rules="[obavezno]"
            />

            <q-select
              v-model="obrazac.kategorija"
              outlined
              emit-value
              map-options
              label="Kategorija *"
              :options="kategorije"
              :rules="[obavezno]"
            />

            <q-input
              v-model="obrazac.datum"
              outlined
              type="date"
              label="Datum *"
              :rules="[obavezno]"
            />

            <q-input
              v-model="obrazac.vrijeme"
              outlined
              type="time"
              label="Vrijeme"
            />

            <q-input
              v-model="obrazac.lokacija"
              outlined
              label="Lokacija *"
              :rules="[obavezno]"
            />

            <q-input
              v-model="obrazac.grad"
              outlined
              label="Grad / mjesto *"
              :rules="[obavezno]"
            />

            <q-input
              v-model="obrazac.organizator"
              outlined
              label="Organizator"
            />

            <q-input
              v-model="obrazac.cijena"
              outlined
              label="Cijena"
              placeholder="npr. Besplatno"
            />

            <q-input
              v-model="obrazac.slika"
              outlined
              label="URL slike"
              class="full-width"
            />

            <q-input
              v-model="obrazac.opis"
              outlined
              type="textarea"
              rows="7"
              label="Opis događanja *"
              class="full-width"
              :rules="[obavezno]"
            />

          </div>

          <div class="form-actions">

            <q-btn
              flat
              no-caps
              label="Odustani"
              to="/admin/events"
            />

            <q-btn
              unelevated
              no-caps
              icon="save"
              label="Spremi događanje"
              type="submit"
              class="save-button"
            />

          </div>

        </q-form>

      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const jeUredivanje = computed(() => {
  return Boolean(route.params.id)
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

const obrazac = ref({
  naziv: '',
  kategorija: null,
  datum: '',
  vrijeme: '',
  lokacija: '',
  grad: '',
  organizator: '',
  cijena: '',
  slika: '',
  opis: ''
})

function obavezno (vrijednost) {
  return Boolean(vrijednost) || 'Ovo polje je obavezno'
}

function spremiDogadanje () {
  $q.notify({
    type: 'positive',
    message: jeUredivanje.value
      ? 'Događanje je uspješno uređeno.'
      : 'Događanje je uspješno dodano.'
  })

  router.push('/admin/events')
}
</script>

<style scoped lang="scss">
.admin-page {
  min-height: 100%;
  background: #fafcfc;
  color: #173f4f;
}

.admin-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px 70px;
}

.page-heading {
  margin-bottom: 30px;
}

.back-button {
  margin-bottom: 25px;
  color: #355965;
}

.eyebrow {
  color: #d09d1e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1 {
  margin: 8px 0;
  font-size: 46px;
}

.page-heading p {
  color: #71858b;
}

.form-card {
  padding: 35px;
  border-radius: 18px;
  background: white;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.save-button {
  background: #173f4f;
  color: white;
}

@media (max-width: 700px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>