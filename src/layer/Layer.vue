<script setup lang="ts">
import { h, onMounted, reactive, ref, watch } from 'vue';
import { QvMap } from './map/QvMap';
import { ipcRenderer } from 'electron';
import LayerLeft from './LayerLeft.vue';
import AttrRange from '../attr/AttrRange.vue';
import { ProdLayersTypeEnum } from './map/ConstValue';
import { ElMessage } from 'element-plus';
const map = ref<any>();
const aaa = ref(0);
let mapData = reactive({
  coordinates: [],
  click: false,
  // 是否开启选择元素
  openSelect: false,
  // 选择要素的数据
  selectData: {},

  // 是否选中要素
  isSelect: false,
});

let qvMap = new QvMap('map', mapData);
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

ipcRenderer.on('gen-pointOrLine-show', function (event, args) {
  console.log('成图完毕');
  console.log('文件地址', args.fileName);
  console.log('数据', args.geo);
  qvMap.addGeoJsonForImport(args.uid, args.geo, args.type);
});

onMounted(() => {
  console.log('初始化地图');
  map.value = qvMap.initMap();
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
const d2 = reactive({
  x: 300,
  y: 200,
  h: 100,
  w: 100,
  active: false,
});
const print = (e) => {
  console.log(e);
};
watch(mapData, (o, n) => {
  if (n.click) {
    console.log('点击了', n.coordinates);
    n.click = false;
    ElMessage({
      message: h('p', null, [
        h('span', null, '坐标x'),
        h('i', { style: 'color: teal' }, n.coordinates[0]),
        h('br'),
        h('span', null, '坐标y'),
        h('i', { style: 'color: teal' }, n.coordinates[1]),
      ]),
    });
  }
  if (n.isSelect) {
    let value = JSON.parse(n.selectData);
    aaaa.value = value;
    n.isSelect = false;
  }
});
const aaaa = ref({
  type: 'Feature',
  properties: {
    a: 3,
  },
  geometry: {
    coordinates: [
      [
        [40.31180535307365, 5.473333383004288],
        [39.217191604897835, 5.257582796860234],
        [40.02842818983956, 3.706592460938964],
        [39.4672302783388, 3.7010476515846022],
        [40.31180535307365, 5.473333383004288],
      ],
    ],
    type: 'Polygon',
  },
});
</script>

<template>
  <div id="map" ref="map" style="height: 100vh; width: 100%">
    <div>
      <div id="flood">
        <span>x:{{ mapData.coordinates[0] }}</span
        ><span>,</span><span>y:{{ mapData.coordinates[1] }}</span>
      </div>
      <el-button
        @click="
          () => {
            qvMap.openOrClose();
          }
        "
        >开关选择 {{ mapData.openSelect }}</el-button
      >
    </div>

    <!--  todo: 尺寸动态 -->
    <Vue3DraggableResizable
      id="a"
      :initW="200"
      :initH="600"
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
        <LayerLeft :qv-map="qvMap"></LayerLeft>
      </div>
    </Vue3DraggableResizable>

    <div>
      <Vue3DraggableResizable
        id="b"
        :initW="100"
        :initH="120"
        v-model:x="d2.x"
        v-model:y="d2.y"
        v-model:w="d2.w"
        v-model:h="d2.h"
        v-model:active="d2.active"
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
          <attr-range :geometry="aaaa"></attr-range>
        </div>
      </Vue3DraggableResizable>
    </div>
  </div>
</template>

<style scoped>
#a {
  position: fixed;
  z-index: 999;
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
}
#b {
  position: fixed;
  z-index: 999;
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
}
#flood {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 300px;
  height: 20px;
  background-color: rgba(255, 0, 0, 0.5);
}
</style>
