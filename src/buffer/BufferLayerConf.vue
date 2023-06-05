<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { onMounted, ref } from 'vue';

onMounted(() => {
  ipcRenderer.send('getLayers');
});
const LayerTree = ref();
ipcRenderer.on('curLayers', (event, args) => {
  console.log('当前图层', args);
  LayerTree.value = args;
});
</script>

<template>
  <div>图层缓冲区</div>
  <div>{{ LayerTree }}</div>
</template>

<style scoped></style>
