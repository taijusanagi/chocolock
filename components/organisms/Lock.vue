<template>
  <section>
    <div class="w-full mb-4 flex items-center justify-center">
      <img class="h-20 w-20" src="~/assets/img/lock.png" />
    </div>
    <form class="mb-8">
      <AtomsRadio v-model="chainId" :values="chainIdValues" :labels="chainIdLabels" class="mb-1" />
      <AtomsLabel text="NFT Contract Address" />
      <AtomsInput v-model="nftContractAddress" type="text" placeholder="0x..." class="mb-2" />
      <AtomsLabel text="Token Id (Optional)" />
      <AtomsInput v-model="tokenId" type="number" placeholder="" class="mb-4" />
      <AtomsLabel text="Content URL" />
      <AtomsInput v-model="contentUrl" type="text" placeholder="https://..." class="mb-2" />
      <AtomsLabel text="Embed Content" />
      <AtomsInput v-model="embedContent" type="text" placeholder="<iframe..." class="mb-2" />
      <AtomsLabel text="Password" />
      <AtomsInput v-model="password" type="password" placeholder="password" class="mb-2" />
    </form>
    <AtomsButton class="w-32 mx-auto" @click="send">Lock</AtomsButton>
  </section>
</template>

<script lang="ts">
import {
  initializeWeb3Modal,
  getEthersSigner,
  getWeb3,
  getContractsForChainId,
  getNetworkNameFromChainId,
  chainIdLabels,
  chainIdValues,
} from "@/modules/web3";
import { functions } from "@/modules/firebase";
import Vue from "vue";

export default Vue.extend({
  data: () => {
    return {
      chainIdValues,
      chainIdLabels,
      chainId: chainIdValues[0],
      nftContractAddress: "",
      tokenId: "",
      contentUrl: "",
      embedContent: "",
      password: "",
    };
  },
  methods: {
    async send() {
      this.toggleLoadingOverlay();
      try {
        const { chainId, nftContractAddress, tokenId, contentUrl, embedContent, password } = this;
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
          tokenId,
          contentUrl,
          embedContent,
          password,
        });

        this.toggleLoadingOverlay();
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
