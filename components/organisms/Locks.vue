<template>
  <section>
    <p class="text-primary text-xl font-medium mb-4">Your Locks</p>
    <div v-for="(lock, index) of lockList" :key="index" class="mb-8">
      <NuxtLink :to="`/locks/${lock.id}`"><MoleculesCard :lock="lock" /></NuxtLink>
    </div>
    <NuxtLink to="/locks/create">
      <AtomsButton>New</AtomsButton>
    </NuxtLink>
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
