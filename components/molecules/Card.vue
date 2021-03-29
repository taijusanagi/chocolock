<template>
  <div class="border rounded-md p-4 relative shadow-sm">
    <p class="absolute right-0 top-0 p-4 text-xs text-secondary font-bold">
      {{ getNetworkNameFromChainId(lock.chainId) }}
    </p>
    <p class="text-sm font-bold text-secondary">{{ lock.contentUrl }}</p>
    <p class="text-xs text-tertiary">{{ lock.nftContractAddress }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getNetworkNameFromChainId } from "../../modules/web3";
export default Vue.extend({
  props: {
    lock: {
      type: Object,
      default: undefined,
    },
  },
  methods: {
    getNetworkNameFromChainId(chainId: string) {
      return getNetworkNameFromChainId(chainId);
    },
  },
});
</script>
