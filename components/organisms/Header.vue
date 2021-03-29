<template>
  <header>
    <div class="relative h-20">
      <NuxtLink to="/">
        <div class="px-4 py-8 absolute left-0 text-gray-900 font-bold">Chocolock</div>
      </NuxtLink>
      <div class="px-4 py-6 absolute right-0">
        <AtomsButton v-if="userAddress === ''" @click="signIn"> Connect </AtomsButton>
        <NuxtLink v-else to="/locks">
          <AtomsButton type="tertiary">
            {{ shortenAddress(userAddress) }}
          </AtomsButton>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import {
  initializeWeb3Modal,
  getEthersSigner,
  getContractsForChainId,
  getNetworkNameFromChainId,
  chainIdLabels,
  chainIdValues,
} from "@/modules/web3";

import { shortenAddress } from "@/modules/util";
import Vue from "vue";

export default Vue.extend({
  computed: {
    userAddress() {
      return this.$store.state.user.address;
    },
  },
  methods: {
    async signIn() {
      const provider = await initializeWeb3Modal();
      const signer = await getEthersSigner(provider);
      const userAddress = await signer.getAddress();
      this.$store.commit("user/setAddress", userAddress);
    },
    shortenAddress(address: string) {
      return shortenAddress(address);
    },
  },
});
</script>
