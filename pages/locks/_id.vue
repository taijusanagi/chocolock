<template>
  <AtomsContainer><OrganismsLock :lock="lock" :is-owner="isOwner" /></AtomsContainer>
</template>

<script lang="ts">
import Vue from "vue";
import { ethers } from "ethers";
import { getContractsForChainId } from "@/modules/web3";
import { firestore } from "@/modules/firebase";

export default Vue.extend({
  data: () => {
    return {
      lock: {},
      isOwner: false,
    };
  },
  computed: {
    userAddress() {
      return this.$store.state.user.address;
    },
  },
  async mounted() {
    const id = this.$route.params.id;
    const doc = await firestore.collection("locks").doc(id).get();
    const lock = doc.data();
    if (!lock) {
      return;
    }
    const { erc721Contract } = getContractsForChainId(lock.chainId);
    this.lock = lock;
    try {
      const balance = await erc721Contract.attach(lock.nftContractAddress).balanceOf(this.userAddress);
      this.isOwner = ethers.BigNumber.from(balance).gt(0);
    } catch (err) {
      console.log(err);
    }
  },
});
</script>
