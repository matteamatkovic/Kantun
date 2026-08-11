<template>
  <q-page class="admin-page">

    <div class="admin-container">

      <div class="page-header">

        <div>

          <div class="eyebrow">
            ADMINISTRACIJA
          </div>

          <h1>
            Događanja
          </h1>

          <p>
            Dodavanje, uređivanje i brisanje događanja.
          </p>

        </div>

        <q-btn
          unelevated
          no-caps
          icon="add"
          label="Dodaj događanje"
          to="/admin/events/new"
          class="main-button"
        />

      </div>

      <q-card
        flat
        bordered
        class="table-card"
      >

        <q-table
          flat
          :rows="dogadanja"
          :columns="stupci"
          row-key="id"
        >

          <template #body-cell-akcije="props">

            <q-td :props="props">

              <q-btn
                flat
                round
                icon="edit"
                color="primary"
                :to="`/admin/events/${props.row.id}/edit`"
              >
                <q-tooltip>
                  Uredi događanje
                </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                @click="obrisiDogadanje(props.row)"
              >
                <q-tooltip>
                  Obriši događanje
                </q-tooltip>
              </q-btn>

            </q-td>

          </template>

        </q-table>

      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const dogadanja = ref([
  {
    id: 1,
    naziv: 'Ljeto na Gradini',
    kategorija: 'Koncerti',
    lokacija: 'Rijeka',
    datum: '8. 8. 2026.'
  },
  {
    id: 2,
    naziv: 'Riječki koncert',
    kategorija: 'Koncerti',
    lokacija: 'Rijeka',
    datum: '9. 8. 2026.'
  },
  {
    id: 3,
    naziv: 'Ljetni festival',
    kategorija: 'Festivali',
    lokacija: 'Opatija',
    datum: '10. 8. 2026.'
  }
])

const stupci = [
  {
    name: 'naziv',
    label: 'Naziv',
    field: 'naziv',
    align: 'left'
  },
  {
    name: 'kategorija',
    label: 'Kategorija',
    field: 'kategorija',
    align: 'left'
  },
  {
    name: 'lokacija',
    label: 'Lokacija',
    field: 'lokacija',
    align: 'left'
  },
  {
    name: 'datum',
    label: 'Datum',
    field: 'datum',
    align: 'left'
  },
  {
    name: 'akcije',
    label: 'Akcije',
    field: 'akcije',
    align: 'right'
  }
]

function obrisiDogadanje (dogadanje) {
  $q.dialog({
    title: 'Brisanje događanja',
    message:
      `Želiš li obrisati događanje "${dogadanje.naziv}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    dogadanja.value = dogadanja.value.filter(
      event => event.id !== dogadanje.id
    )

    $q.notify({
      type: 'positive',
      message: 'Događanje je obrisano.'
    })
  })
}
</script>

<style scoped lang="scss">
.admin-page {
  min-height: 100%;
  background: #fafcfc;
  color: #173f4f;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.page-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 35px;
}

.eyebrow {
  color: #d09d1e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1 {
  margin: 8px 0;
  font-size: 48px;
}

.page-header p {
  margin: 0;
  color: #71858b;
}

.main-button {
  background: #173f4f;
  color: white;
}

.table-card {
  overflow: hidden;
  border-radius: 16px;
  background: white;
}

@media (max-width: 700px) {
  .page-header {
    align-items: start;
    flex-direction: column;
  }
}
</style>