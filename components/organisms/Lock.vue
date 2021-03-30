<template>
  <section v-if="lock.id !== undefined">
    <div class="w-full mb-8 flex items-center justify-center">
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
    <div class="mb-4">
      <AtomsButton @click="unlock">Unlock</AtomsButton>
    </div>
    <AtomsButton v-if="lock.userAddress === userAddress" @click="deleteLock">Delete</AtomsButton>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { getNetworkNameFromChainId, getContractsForChainId } from "@/modules/web3";
import { functions } from "@/modules/firebase";
import { ethers } from "ethers";

export default Vue.extend({
  props: {
    lock: {
      type: Object,
      default: undefined,
    },
    isOwner: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
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
    toggleLoadingOverlay() {
      this.$store.commit("loadingOverlay/toggle");
    },
    openNotificationToast(props: any) {
      this.$store.commit("notificationToast/open", props);
    },
    getNetworkNameFromChainId(chainId: string) {
      return getNetworkNameFromChainId(chainId);
    },
    getExploreUrl(chainId: string, address: string) {
      const { explore } = getContractsForChainId(chainId);
      return `${explore}address/${address}`;
    },
    async unlock() {
      this.toggleLoadingOverlay();
      try {
        const { erc721Contract } = getContractsForChainId(this.lock.chainId);
        const balance = await erc721Contract.attach(this.lock.nftContractAddress).balanceOf(this.userAddress);
        if (!ethers.BigNumber.from(balance).gt(0)) {
          this.openNotificationToast({ type: "error", text: `must have nft to unlock` });
          this.toggleLoadingOverlay();
          return;
        }
        if (this.password !== "") {
          this.openNotificationToast({ type: "error", text: `password already unlocked` });
          this.toggleLoadingOverlay();
          return;
        }
        const { data } = await functions.httpsCallable("unlock")({
          id: this.lock.id,
        });
        this.password = data;
        this.openNotificationToast({ type: "default", text: "Unlocked!" });
        this.toggleLoadingOverlay();
      } catch (err) {
        this.openNotificationToast({ type: "error", text: err.message });
        this.toggleLoadingOverlay();
      }
    },
    async deleteLock() {
      this.toggleLoadingOverlay();
      try {
        if (this.lock.userAddress !== this.userAddress) {
          this.openNotificationToast({ type: "error", text: `must be lock owner` });
          this.toggleLoadingOverlay();
          return;
        }
        await functions.httpsCallable("delete")({
          id: this.lock.id,
        });
        this.$router.push("/locks/");
        this.openNotificationToast({ type: "default", text: "Lock deleted!" });
        this.toggleLoadingOverlay();
      } catch (err) {
        this.openNotificationToast({ type: "error", text: err.message });
        this.toggleLoadingOverlay();
      }
    },
  },
});
</script>
