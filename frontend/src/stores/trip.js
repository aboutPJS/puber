import {defineStore} from "pinia";
import {reactive, ref} from "vue";

export const useTripStore = defineStore('trip', () => {
    const id = ref(null)

    const user_id = ref(null)

    const origin = reactive({
        lat: null,
        lng: null
    })

    const destination = reactive({
        lat: null,
        lng: null
    })

    const destination_name = ref('')

    const driver = reactive({
        id: null,
        year: null,
        make: null,
        model: null,
        license_plate: null,
        user: {
            name: null,
        }

    })

    const reset = () => {
        id.value = null
        id.user_id = null
        id.origin = null
        id.destination = null
        id.destination_name = null

        driver.id = null
        driver.year = null
        driver.make = null
        driver.model = null
        driver.license_plate = null
        driver.user.name = null
    }


    return {id, user_id, origin, destination, destination_name, reset}
})