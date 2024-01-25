<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">{{ title }}</h1>
    <mt-8 v-if="!trip.id" class="flex justify-center">
      <Loader></Loader>
    </mt-8>

    <div v-else class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 py-5 sm:p-6">
        <div>
          <GMapMap
              :zoom="11"
              :center="trip.destination"
              style="width: 100%; height: 256px;"
              ref="gMap"
          ></GMapMap>
        </div>
        <div class="mt-2">
          <p class="text-xl">Going to <strong>{{ trip.destination_name }}</strong></p>
        </div>
      </div>
      <div class="flex justify-between bg-gray-50 px-4 py-3 text-right sm:px-6">
        <button
            @click="handleAcceptTrip"
            class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white"
        >
          Accept
        </button>
        <button
            @click="handleDeclineTrip"
            class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white"
        >
          Decline
        </button>

      </div>
    </div>


  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import Loader from "@/components/Loader.vue";
import Echo from "laravel-echo";
import Pusher from "pusher-js"
import {useTripStore} from "@/stores/trip.js";
import http from "@/helpers/http.js";
import {useLocationStore} from "@/stores/location.js";
import router from "@/router/index.js";

const title = ref('Waiting for ride requests ... ')
const gMap = ref(null)
const trip = useTripStore()
const location = useLocationStore()


onMounted(async () => {
  await location.updateCurrentLocation()

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

  echo.channel('drivers')
      .listen('TripCreated', (e) => {
        trip.$patch(e.trip)
        title.value = 'Ride requested:'

        setTimeout(initMapDirection, 2000)
      })
})

const initMapDirection = () => {
  gMap.value.$mapPromise.then((mapObject) => {
    let originPoint = new google.maps.LatLng(trip.origin),
        destinationPoint = new google.maps.LatLng(trip.destination),
        directionsService = new google.maps.DirectionsService(),
        directionsDisplay = new google.maps.DirectionsRenderer({
          map: mapObject
        })

    directionsService.route({
      origin: originPoint,
      destination: destinationPoint,
      avoidTolls: false,
      avoidHighways: false,
      travelMode: google.maps.TravelMode.DRIVING
    }, (res, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(res)
      } else {
        console.log(status)
      }
    })
  })
}

const handleDeclineTrip = () => {
  trip.reset()
  title.value = 'Waiting for ride requests ... '
}

const handleAcceptTrip = () => {
  http().post(`/api/trip/${trip.id}/accept`, {
        driver_location: location.current.geometry,
      }
  ).then((response) => {
    location.$patch({
      destination: {
        name: 'Passenger',
        geometry: response.data.origin
      }
    })

    router.push({
      name: 'driving'
    })
  }).catch((error) => {
    console.log(error)
    alert(error.response.data.message)
  })
}


</script>