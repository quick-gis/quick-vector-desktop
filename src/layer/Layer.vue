<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
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
ipcRenderer.on('map_to_xy', function (event, arg) {
  console.log('event:', event);
  console.log('arg:', arg);
  qvMap.moveToXY(arg.x, arg.y);
});
ipcRenderer.on('file-select', function (event, args) {
  console.log('文件：', args);
});

onMounted(() => {
  console.log('初始化地图');
  map.value = qvMap.initMap();
  qvMap.testAddLayers();
});
const fileOpen = () => {
  ipcRenderer.send('openDialog');
};
const a = () => {};
const b = () => {};
const d = reactive({
  x: 100,
  y: 100,
  h: 100,
  w: 100,
  active: false,
});
const print = (e) => {
  console.log(e);
};
</script>

<template>
  <div id="map" ref="map" style="height: 100vh; width: 100%">
    <Vue3DraggableResizable
      id="a"
      :initW="110"
      :initH="120"
      v-model:x="d.x"
      v-model:y="d.y"
      v-model:w="d.w"
      v-model:h="d.h"
      v-model:active="d.active"
      :draggable="true"
      :resizable="true"
      @activated="print('activated')"
      @deactivated="print('deactivated')"
      @drag-start="print('drag-start')"
      @resize-start="print('resize-start')"
      @dragging="print('dragging')"
      @resizing="print('resizing')"
      @drag-end="print('drag-end')"
      @resize-end="print('resize-end')"
    >
      <div>
        <div>
          <el-button @click="a">a</el-button>
          <el-button @click="b">b</el-button>
          <el-button @click="fileOpen">文件选择</el-button>
        </div>
      </div>
      <div id="left" class="movable">左侧 {{ aaa }}</div>
    </Vue3DraggableResizable>
  </div>
</template>

<style scoped>
#a {
  position: fixed;
  z-index: 999;
  background-color: #fff;
  height: 100%;
}
</style>
