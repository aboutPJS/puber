<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semi-bold mb-4">PUBER</h1>
    <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 py-5 sm:p-6">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div class="flex justify-between">
            <button
                class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white"
                @click="handleStartDriving"
            >
              Start Driving
            </button>
            <button
                @click="handleFindARide"
                class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white"
            >
              Find A Ride
            </button>

          </div>
        </div>

      </div>
    </div>

  </div>

</template>

<script setup>
import {useRouter} from "vue-router";
import http from "@/helpers/http.js";

const router = useRouter()
const handleFindARide = () => {
  router.push({
    name: 'location'
  })
}

const handleStartDriving = () => {
  http()
      .get('/api/driver')
      .then((response) => {
        if (response.data.driver) {
          router.push({
            name: 'standby'
          })
        } else {
          router.push({
            name: 'driver'
          })
        }
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.message)
      })
}

</script>