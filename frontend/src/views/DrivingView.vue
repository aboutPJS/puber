<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">Driving to passenger ...</h1>

    <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 py-5 sm:p-6">
        <div>
          <GMapMap
              :zoom="11"
              style="width: 100%; height: 256px;"
              ref="gMap"
              :center="location.current.geometry"
          >
            <GMapMarker :position="location.current.geometry" :icon="currentIcon"></GMapMarker>
            <GMapMarker :position="location.destination.geometry" :icon="destinationIcon"></GMapMarker>
          </GMapMap>
        </div>
        <div class="mt-2">
          <p class="text-xl">Going to <strong>pick up passenger</strong></p>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
        <button v-if="trip.is_started"
            class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white"
        >
          Complete Trip
        </button>
        <button
            class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white"
        >
          Passenger Picked Up
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>

import {useLocationStore} from "@/stores/location.js";
import {onMounted, onUnmounted, ref} from "vue";
import http from "@/helpers/http.js";
import {useTripStore} from "@/stores/trip.js";

const trip = useTripStore()
const location = useLocationStore()
const gMap = ref(null)
const intervalRef = ref(null)

const currentIcon = {
  url: 'https://openmoji.org/data/color/svg/1F698.svg',
  scaledSize: {
    width: 32,
    height: 32
  }
}

const destinationIcon = {
  url: 'https://openmoji.org/data/color/svg/1F920.svg',
  scaledSize: {
    width: 24,
    height: 24
  }
}

const updateMapBounds = (mapObject) => {
  let originPoint = new google.maps.LatLng(location.current.geometry),
      destinationPoint = new google.maps.LatLng(location.destination.geometry),
      latLngBounds = new google.maps.LatLngBounds()

  latLngBounds.extend(originPoint)
  latLngBounds.extend(destinationPoint)

  mapObject.fitBounds(latLngBounds)
}

onMounted(() => {
  gMap.value.$mapPromise.then((mapObject) => {
    updateMapBounds(mapObject)

    intervalRef.value = setInterval(async () => {
      await location.updateCurrentLocation()

      updateMapBounds(mapObject)
    }, 5000)
  })
})

onUnmounted(() => {
  clearInterval(intervalRef.value)
  intervalRef.value = null
})

const broadcastDriverLocation = () => {
  http()
      .post(`/api/trip/${trip.id}/location`, {driver_location: location.current.geometry})
      .then((response) => {
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.message)
      })
}

</script>