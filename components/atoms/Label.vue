<template>
  <label class="text-xs font-bold text-secondary">{{ text }}</label>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: undefined
    }
  }
});
</script>
