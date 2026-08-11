<template>
  <q-page class="admin-page">

    <div class="admin-container">

      <div class="page-heading">

        <div class="eyebrow">
          ADMINISTRACIJA
        </div>

        <h1>
          Nadzorna ploča
        </h1>

        <p>
          Pregled i upravljanje aplikacijom Kantun.
        </p>

      </div>

      <div class="stats-grid">

        <q-card
          v-for="stat in statistike"
          :key="stat.naziv"
          flat
          bordered
          class="stat-card"
        >

          <q-icon
            :name="stat.ikona"
            size="35px"
          />

          <div>

            <div class="stat-number">
              {{ stat.vrijednost }}
            </div>

            <div class="stat-title">
              {{ stat.naziv }}
            </div>

          </div>

        </q-card>

      </div>

      <section class="section">

        <h2>
          Brze radnje
        </h2>

        <div class="actions-grid">

          <q-btn
            unelevated
            no-caps
            icon="add"
            label="Dodaj događanje"
            to="/admin/events/new"
            class="main-button"
          />

          <q-btn
            outline
            no-caps
            icon="event"
            label="Upravljanje događanjima"
            to="/admin/events"
          />

        </div>

      </section>

      <section class="section">

        <h2>
          Nedavno dodana događanja
        </h2>

        <q-table
          flat
          bordered
          :rows="dogadanja"
          :columns="stupci"
          row-key="id"
          class="table"
        />

      </section>

    </div>

  </q-page>
</template>

<script setup>
const statistike = [
  {
    naziv: 'Događanja',
    vrijednost: 128,
    ikona: 'event'
  },
  {
    naziv: 'Kategorije',
    vrijednost: 8,
    ikona: 'category'
  },
  {
    naziv: 'Korisnici',
    vrijednost: 342,
    ikona: 'people'
  },
  {
    naziv: 'Favoriti',
    vrijednost: 716,
    ikona: 'favorite'
  }
]

const stupci = [
  {
    name: 'naziv',
    label: 'Događanje',
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
  }
]

const dogadanja = [
  {
    id: 1,
    naziv: 'Ljeto na Gradini',
    kategorija: 'Koncerti',
    lokacija: 'Rijeka',
    datum: '8. 8. 2026.'
  },
  {
    id: 2,
    naziv: 'Ljetni festival',
    kategorija: 'Festivali',
    lokacija: 'Opatija',
    datum: '10. 8. 2026.'
  },
  {
    id: 3,
    naziv: 'Kazališna večer',
    kategorija: 'Predstave',
    lokacija: 'Rijeka',
    datum: '20. 8. 2026.'
  }
]
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

.eyebrow {
  color: #d09d1e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
}

.page-heading h1 {
  margin: 8px 0;
  font-size: 48px;
}

.page-heading p {
  color: #71858b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 40px 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 25px;
  border-radius: 16px;
  background: white;
}

.stat-card .q-icon {
  color: #d09d1e;
}

.stat-number {
  font-size: 30px;
  font-weight: 800;
}

.stat-title {
  color: #71858b;
  font-size: 13px;
}

.section {
  margin-top: 45px;
}

.section h2 {
  margin-bottom: 20px;
}

.actions-grid {
  display: flex;
  gap: 12px;
}

.main-button {
  background: #173f4f;
  color: white;
}

.table {
  background: white;
  border-radius: 16px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    flex-direction: column;
  }
}
</style>