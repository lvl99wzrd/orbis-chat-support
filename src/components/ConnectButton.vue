<script setup>
import { ref } from "vue";

import SpinnerWhiteIcon from "../assets/img/icons/question-spinner-white.png";

const props = defineProps({
  orbis: Object,
  user: Object,
});
const emits = defineEmits(["connected"]);
const loading = ref(false);

const connect = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;

  let res = await props.orbis.connect(null, false);

  /** Parse result and update status */
  switch (res.status) {
    case 200:
      /** Save user details returned by the connect function in state */
      loading.value = false;
      emits("connected", res.details);
      break;
    default:
      console.log("Couldn't connect to Ceramic: ", res.error);
  }
};
</script>

<template>
  <div v-if="loading" class="btnBlack">
    <img :src="SpinnerWhiteIcon" height="18" class="loadingSpinner" />
  </div>
  <div v-else>
    <div v-if="user" class="btnBlack">Connected</div>
    <div v-else class="btnBlack" @click="connect()">Connect</div>
  </div>
</template>
