<template>
  <section>
    <div class="w-full my-8 flex items-center justify-center">
      <img class="h-20 w-20" src="~/assets/img/lock.png" />
    </div>
    <form class="mb-8">
      <AtomsRadio v-model="chainId" :values="chainIdValues" :labels="chainIdLabels" class="mb-1" />
      <AtomsLabel text="NFT Contract Address" />
      <AtomsInput
        v-model="nftContractAddress"
        :initial-value="lock && lock.nftContractAddress"
        type="text"
        placeholder="0x..."
        class="mb-2"
      />
      <AtomsLabel text="Content URL" />
      <AtomsInput
        v-model="contentUrl"
        :initial-value="lock && lock.contentUrl"
        :value="contentUrl"
        type="text"
        placeholder="https://..."
        class="mb-2"
      />
      <AtomsLabel text="Password" />
      <AtomsInput v-model="password" :value="password" type="password" placeholder="password" class="mb-2" />
    </form>
    <AtomsButton class="w-32 mx-auto" @click="send">Lock</AtomsButton>
  </section>
</template>

<script lang="ts">
import {
  initializeWeb3Modal,
  getEthersSigner,
  getNetworkNameFromChainId,
  chainIdLabels,
  chainIdValues,
} from "@/modules/web3";
import { functions } from "@/modules/firebase";
import Vue from "vue";

export default Vue.extend({
  props: {
    lock: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      chainIdValues,
      chainIdLabels,
      chainId: this.lock ? this.lock.chainId : chainIdValues[0],
      nftContractAddress: this.lock ? this.lock.nftContractAddress : "",
      contentUrl: this.lock ? this.lock.contentUrl : "",
      password: "",
    };
  },
  methods: {
    async send() {
      this.toggleLoadingOverlay();
      try {
        const { chainId, nftContractAddress, contentUrl, password } = this;
        const provider = await initializeWeb3Modal();
        const signer = await getEthersSigner(provider);
        const signerNetwork = await signer.provider.getNetwork();
        if (chainId !== signerNetwork.chainId.toString()) {
          const networkName = getNetworkNameFromChainId(chainId);
          this.openNotificationToast({ type: "error", text: `Please connect ${networkName} network` });
          this.toggleLoadingOverlay();
          return;
        }
        const { data } = await functions.httpsCallable("lock")({
          chainId,
          nftContractAddress,
          contentUrl,
          password,
        });
        this.openNotificationToast({ type: "success", text: "Content is locked!" });
        this.toggleLoadingOverlay();
        this.$router.push(`/locks/${data}`);
      } catch (err) {
        this.toggleLoadingOverlay();
        this.openNotificationToast({ type: "error", text: err.message });
      }
    },
    openMessageModal(props: any) {
      this.$store.commit("messageModal/open", props);
    },
    toggleLoadingOverlay() {
      this.$store.commit("loadingOverlay/toggle");
    },
    openNotificationToast(props: any) {
      this.$store.commit("notificationToast/open", props);
    },
  },
});
</script>
