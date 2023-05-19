<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { QvMap } from './map/QvMap';

const map = ref<any>();
let qvMap = new QvMap('map');
onMounted(() => {
  console.log('初始化地图');
  map.value = qvMap.initMap();
});
</script>

<template>
  <div id="map" ref="map" style="height: 100vh; width: 100%">
    <div>左侧</div>
  </div>
</template>

<style scoped></style>
