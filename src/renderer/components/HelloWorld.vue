<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  msg: String,
});

const count = ref(0);
const ff = () => {
  count.value++;
  console.log('aa');
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="ff">count is {{ count }}</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
