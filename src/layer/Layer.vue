<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { QvMap } from './map/QvMap';
import { ipcRenderer } from 'electron';

const map = ref<any>();
const aaa = ref(0);
let qvMap = new QvMap('map');

ipcRenderer.on('update-counter', function (event, arg) {
  console.log('event:', event);
  console.log('arg:', arg);
  aaa.value = aaa.value + arg;
});
onMounted(() => {
  console.log('初始化地图');
  map.value = qvMap.initMap();
});
</script>

<template>
  <div id="map" ref="map" style="height: 100vh; width: 100%">
    <div>左侧 {{ aaa }}</div>
  </div>
</template>

<style scoped></style>
