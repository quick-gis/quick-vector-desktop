<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { QvMap } from './map/QvMap';
import { ipcRenderer } from 'electron';

const map = ref<any>();
const aaa = ref(0);
let qvMap = new QvMap('map');

ipcRenderer.on('map-config', function (event, arg) {
  console.log('event:', event);
  console.log('arg:', arg);
  aaa.value = arg;
});
onMounted(() => {
  console.log('初始化地图');
  map.value = qvMap.initMap();

  const movableDiv = document.getElementById('left');

  movableDiv.addEventListener('mousedown', startDrag);

  function startDrag(e) {
    e.preventDefault();

    const startX = e.clientX - movableDiv.offsetLeft;
    const startY = e.clientY - movableDiv.offsetTop;

    document.documentElement.addEventListener('mousemove', drag);
    document.documentElement.addEventListener('mouseup', stopDrag);

    function drag(e) {
      const newLeft = e.clientX - startX;
      const newTop = e.clientY - startY;

      movableDiv.style.left = newLeft + 'px';
      movableDiv.style.top = newTop + 'px';
    }

    function stopDrag() {
      document.documentElement.removeEventListener('mousemove', drag);
      document.documentElement.removeEventListener('mouseup', stopDrag);
    }
  }
});
</script>

<template>
  <div id="map" ref="map" style="height: 100vh; width: 100%">
    <div id="left" class="movable">左侧 {{ aaa }}</div>
  </div>
</template>

<style scoped>
#left {
  position: fixed;
  z-index: 999;
  background-color: #fff;
  height: 100%;
  resize: both;
}
.movable {
  position: absolute;
  cursor: move;
}
</style>
