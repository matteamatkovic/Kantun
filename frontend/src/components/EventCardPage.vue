<template>
  <q-card
    flat
    bordered
    class="event-card"
    @click="otvoriDetalje"
  >

    <div class="event-image">

      <q-img
        :src="event.slika"
        ratio="16/10"
      />

      <q-btn
        round
        flat
        :icon="event.omiljeno ? 'favorite' : 'favorite_border'"
        class="favorite-button"
        @click.stop="promijeniOmiljeno"
      />

    </div>

    <q-card-section>

      <div class="event-category">
        {{ event.kategorija }}
      </div>

      <div class="event-date">
        {{ event.datum }}
      </div>

      <div class="event-title">
        {{ event.naziv }}
      </div>

      <div class="event-location">
        <q-icon name="location_on" />
        {{ event.lokacija }}
      </div>

    </q-card-section>

  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function otvoriDetalje () {
  router.push(`/event/${props.event.id}`)
}

function promijeniOmiljeno () {
  props.event.omiljeno = !props.event.omiljeno
}
</script>

<style scoped lang="scss">
.event-card {
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 35px rgba(23, 63, 79, 0.12);
}

.event-image {
  position: relative;
}

.favorite-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  color: #173f4f;
}

.event-category {
  margin-bottom: 7px;
  color: #d09d1e;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.event-date {
  margin-bottom: 8px;
  color: #355965;
  font-size: 13px;
  font-weight: 700;
}

.event-title {
  margin-bottom: 10px;
  color: #173f4f;
  font-size: 21px;
  font-weight: 750;
}

.event-location {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #71858b;
  font-size: 14px;
}
</style>