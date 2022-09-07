<template>
  <div class="pfpContainer">
    <img :src="PfpImg" class="pfp" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { getAddressFromDid } from "@orbisclub/orbis-sdk/utils";
import makeBlockie from "ethereum-blockies-base64";

const props = defineProps({
  did: { type: String, required: true },
  details: { type: Object, required: false },
});

const { address } = getAddressFromDid(props.did);

const PfpImg = computed(() => {
  if (props.details && props.details.profile && props.details.profile.pfp) {
    return props.details.profile?.pfp;
  } else if (address) {
    return makeBlockie(address);
  } else {
    return "https://arweave.net/zNxzwq2U7nNZnEosK49drVmOom4nFv89nOlSlbsnczg";
  }
});
</script>

<style lang="scss" scoped></style>
