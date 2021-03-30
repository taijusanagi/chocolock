<template>
  <section v-if="lock.id !== undefined">
    <div class="w-full my-8 flex items-center justify-center">
      <img class="h-20 w-20" src="~/assets/img/lock.png" />
    </div>
    <p class="text-primary text-md font-medium mb-1">Locked Content</p>
    <a :href="lock.contentUrl" target="_blank">
      <p class="text-xs text-url font-bold mb-4">{{ lock.contentUrl }}</p>
    </a>
    <p class="text-primary text-md font-medium mb-1">Key</p>
    <a :href="getExploreUrl(lock.chainId, lock.nftContractAddress)" target="_blank">
      <p class="text-xs-address text-url font-bold mb-4">
        {{ getNetworkNameFromChainId(lock.chainId) }}-{{ lock.nftContractAddress }}
      </p>
    </a>
    <p class="text-primary text-md font-medium mb-1">Password</p>
    <p class="text-xs text-secondary mb-8">
      {{ password ? password : "🔒" }}
    </p>
    <AtomsButton v-if="password === ''" class="mb-4" @click="unlock">Unlock</AtomsButton>
    <AtomsButton v-if="lock.userAddress === userAddress">Edit</AtomsButton>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { getNetworkNameFromChainId, getContractsForChainId } from "@/modules/web3";
import { functions } from "@/modules/firebase";

export default Vue.extend({
  props: {
    lock: {
      type: Object,
      default: undefined,
    },
  },
  data: () => {
    return {
      password: "",
    };
  },
  computed: {
    userAddress() {
      return this.$store.state.user.address;
    },
  },
  methods: {
    getNetworkNameFromChainId(chainId: string) {
      return getNetworkNameFromChainId(chainId);
    },
    getExploreUrl(chainId: string, address: string) {
      const { explore } = getContractsForChainId(chainId);
      return `${explore}address/${address}`;
    },
    async unlock() {
      const { data } = await functions.httpsCallable("unlock")({
        id: this.lock.id,
      });
      this.password = data;
    },
  },
});
</script>
