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
import { signIn } from "@/modules/user";

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
      const userAddress = await signIn();
      this.$store.commit("user/setAddress", userAddress);
    },
    shortenAddress(address: string) {
      return shortenAddress(address);
    },
  },
});
</script>
