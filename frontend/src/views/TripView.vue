<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">{{ title }}</h1>
    <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 py-5 sm:p-6">
        <div>
          <GMapMap
              :zoom="14"
              :center="location.current.geometry"
              style="width: 100%; height: 256px;"
              ref="gMap"
          >
            <GMapMarker :position="location.current.geometry" :icon="currentIcon"></GMapMarker>

          </GMapMap>
        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <span>
            {{ message }}
          </span>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {useLocationStore} from "@/stores/location.js";
import {useTripStore} from "@/stores/trip.js";
import {onMounted, ref} from "vue";
import Echo from "laravel-echo";
import Pusher from "pusher-js"

const title = ref('Waiting on a driver')
const message = ref('When a driver accepts the trip their info will appear here.')

const location = useLocationStore()
const trip = useTripStore()

const currentIcon = {
  url: 'https://openmoji.org/data/color/svg/1F920.svg',
  scaledSize: {
    width: 24,
    height: 24
  }
}

onMounted(() => {
  let echo = new Echo({
    broadcaster: 'pusher',
    key: 'mykey',
    cluster: 'mt1',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss']
  })

  echo.channel(`passenger_${trip.user_id}`)
      .listen('TripAccepted', (e) => {
        trip.$patch(e.trip)
        title.value = 'A Driver is on the way'
        message.value = `${e.trip.user.name} is coming in a ${e.trip.user.driver.year} ${e.trip.user.driver.color} ${e.trip.user.driver.model} with the license plate ${e.trip.user.driver.license_plate} `
      })
})
</script>