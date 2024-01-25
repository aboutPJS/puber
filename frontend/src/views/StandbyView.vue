<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">Waiting for ride requests ... </h1>
    <mt-8 class="flex justify-center">
      <Loader></Loader>
    </mt-8>

  </div>
</template>

<script>
import {defineComponent} from "vue";
import Loader from "@/components/Loader.vue";

export default defineComponent({
  components: {Loader}
})
</script>