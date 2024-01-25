<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">Enter your phone number here</h1>
    <form v-if="!waitingOnVerification" action="#" @submit.prevent="handleLogin">
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input type="text" v-maska data-maska="## ###########" v-model="credentials.phone" name="phone" id="phone"
                   placeholder="49 17642933100"
                   class="mt-1 block w-full px-3 py-2 rounded-md border border-grey-300 shadow-sm"
            >
          </div>
          <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
                type="submit"
                @submit.prevent="handleLogin"
                class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600">
              Continue

            </button>
          </div>
        </div>
      </div>
    </form>
    <form v-else action="#" @submit.prevent="handleVerification">
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input type="text" v-maska data-maska="######" v-model="credentials.login_code" name="phone" id="phone"
                   placeholder="123456"
                   class="mt-1 block w-full px-3 py-2 rounded-md border border-grey-300 shadow-sm"
            >
          </div>
          <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
                type="submit"
                @submit.prevent="handleVerification"
                class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600">
              Continue

            </button>
          </div>
        </div>
      </div>
    </form>
  </div>

</template>


<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()


const credentials = reactive({
      phone: null,
      login_code: null
    }
)

const waitingOnVerification = ref(false)

onMounted(() => {
  if (localStorage.getItem('token')) {
    reroute()
  }
})

function getFormattedCredentials() {
  return {
    phone: credentials.phone.replaceAll(' ', ''),
    login_code: credentials.login_code
  }
}


const handleLogin = () => {
  axios
      .post('http://localhost/api/login', getFormattedCredentials())
      .then((response) => {
        waitingOnVerification.value = true
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.message)
      })
}

const handleVerification = () => {
  axios
      .post('http://localhost/api/login/verify', getFormattedCredentials())
      .then((response) => {
        reroute()
        localStorage.setItem('token', response.data)
      })
      .catch((error) => {
        console.log(error)
        alert(error.response.data.message)
      })
}

const reroute = () => router.push({
  name: 'landing'
})


</script>
