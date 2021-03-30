<template>
  <section>
    <NuxtLink to="/create">
      <AtomsButton class="mb-8">New</AtomsButton>
    </NuxtLink>
    <div v-for="(lock, index) of lockList" :key="index" class="mb-2">
      <NuxtLink :to="`/locks/${lock.id}`"><MoleculesCard :lock="lock" /></NuxtLink>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    lockList: {
      type: Array,
      default: undefined,
    },
  },
});
</script>
