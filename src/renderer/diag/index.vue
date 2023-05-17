<script setup lang="ts">
import { onMounted } from 'vue';
import { getD, setD } from '../store/testU';

onMounted(() => {
  setD('aaaaaaaaaa');
  console.log('aaaaaa');
});
</script>

<template>
  <div><h3>aaaaaaaa</h3></div>
</template>

<style scoped></style>
