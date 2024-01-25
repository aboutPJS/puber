import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueGoogleMaps from '@fawmi/vue-google-maps'

import App from './App.vue'
import router from './router'


const app = createApp(App)
app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyBczLUyXhvRYGQsx3gPOIlBN5rFiiZu9Ao',
        libraries: "places"
    },
})

app.use(createPinia())
app.use(router)

app.mount('#app')
