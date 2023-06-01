<script setup lang="ts">
import { h, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { QvMap } from './map/QvMap';
import { ipcRenderer } from 'electron';
import LayerLeft from './LayerLeft.vue';
import AttrRange from '../attr/AttrRange.vue';
import { ReadDiTuConfig, WriteDiTuConfig } from '../utils/FileUtils';
import { GetTdtToken } from './map/Tdt';
import jkl from './map/a.js';

const map = ref<any>();
const token = ref(0);
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
const winSize = reactive({
  w: null,
  h: null,
});

let qvMap = new QvMap('map', mapData);
// 接受地图配置
ipcRenderer.on('map-config', function (event, arg) {
  console.log('event:', event);
  console.log('地图配置数据:', arg);
  let readDiTuConfig = ReadDiTuConfig();
  if (readDiTuConfig['token']) {
    readDiTuConfig['token'][arg.type] = arg.token;
  } else {
    readDiTuConfig['token'] = {};
    readDiTuConfig['token'][arg.type] = arg.token;
  }
  WriteDiTuConfig(readDiTuConfig);
  console.log('配置文件中 地图配置 = ', readDiTuConfig);
});
ipcRenderer.on('calc-windows-size', function (event, args) {
  winSize.w = args.w;
  winSize.h = args.h;
  attrShowSize.x = winSize.w - attrShowSize.initW - 20;
  attrShowSize.y = 35;
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
const attrShowSize = reactive({
  x: 300,
  y: 35,
  h: 100,
  w: 100,
  initW: 500,
  initH: 380,
  active: false,
});
const print = (e) => {
  console.log(e);
};
watch(mapData, (o, n) => {
  if (n.isSelect) {
    onceFeature.value = JSON.parse(n.selectData);
    // 发送事件获取窗口尺寸
    ipcRenderer.send('calc-windows-size');
    if (mapData.openSelect) {
      attrArrayDisplay.value = true;
    }
    n.isSelect = false;
  }
});
const onceFeature = ref({
  type: 'Feature',
  properties: {
    a: 3,
  },
  geometry: {
    coordinates: [[119.45436769887343, 29.2080525919085]],
    type: 'Point',
  },
});
const attrArrayDisplay = ref(false);
const mapConfig = ref({
  tdt_token: '',
});
const test = () => {
  mapConfig.value.tdt_token = GetTdtToken();
};

ipcRenderer.on('openOrCloseSelect', function (event, args) {
  console.log('开关选择器');

  qvMap.openOrClose();
});
</script>

<template>
  <div>
    <el-button
      @click="
        () => {
          ipcRenderer.send('openAttrTable', { geojson: jkl });
        }
      "
      >测试属性弹框
    </el-button>
  </div>
  <div id="map" ref="map" style="height: 100vh; width: 100%">
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

    <div v-if="attrArrayDisplay">
      <Vue3DraggableResizable
        id="b"
        :initW="attrShowSize.initW"
        :initH="attrShowSize.initH"
        v-model:x="attrShowSize.x"
        v-model:y="attrShowSize.y"
        v-model:w="attrShowSize.w"
        v-model:h="attrShowSize.h"
        v-model:active="attrShowSize.active"
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
          <div style="position: relative">
            <!-- 此处是你的内容 -->
            <div class="close-button" @click="attrArrayDisplay = false">X</div>
          </div>
          <attr-range :geometry="onceFeature"></attr-range>
        </div>
      </Vue3DraggableResizable>
    </div>
    <div id="flood">
      <span>x:{{ mapData.coordinates[0] }}</span
      ><span>,</span><span>y:{{ mapData.coordinates[1] }}</span>
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
  background-color: rgba(238, 255, 0, 0.5);
}
.close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px;
  background-color: #ccc;
  cursor: pointer;
}
</style>
