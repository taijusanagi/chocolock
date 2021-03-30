<template>
  <AtomsContainer>
    <OrganismsEdit :lock="lock" />
  </AtomsContainer>
</template>

<script lang="ts">
import Vue from "vue";
import { firestore } from "@/modules/firebase";

export default Vue.extend({
  data: () => {
    return {
      lock: {},
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    const doc = await firestore.collection("locks").doc(id).get();
    const lock = doc.data();
    if (!lock) {
      return;
    }
    this.lock = lock;
  },
});
</script>
