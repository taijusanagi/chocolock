<template>
  <section>
    <div class="flex mb-8">
      <div class="mx-auto" v-html="lock.embed" />
    </div>
    <MoleculesCard :lock="lock" class="mb-4" />
    <AtomsButton class="mb-4">Unlock</AtomsButton>
    <AtomsButton>Edit</AtomsButton>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    lock: {
      type: Object,
      default: undefined,
    },
  },
});
</script>
