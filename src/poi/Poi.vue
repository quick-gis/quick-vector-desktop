<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { SendMapConfig } from '../msg/MessageUtils';
const router = useRoute();
let type;
onMounted(() => {
  console.log('kkk');
  console.log('type = ', router.query.type);
});
</script>

<template>
  <div></div>
</template>

<style scoped></style>
