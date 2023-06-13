<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import OlMap from 'ol/Map';
import View from 'ol/View';
import { Style } from 'ol/style';
import { getTopLeft, getWidth } from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { get } from 'ol/proj';

const data = reactive({});
const map = ref<any>();
let cmap = null;

const click = () => {
  let projection = get('EPSG:4326');
  let projectionExtent = projection?.getExtent();
  let size = getWidth(projectionExtent) / 256;
  let url = 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=af329b7c71730694d8ffadce86e45236';
  let layer = new TileLayer({
    zIndex: 1,
    visible: true,

    source: new WMTS({
      url: url,
      style: 'default',
      matrixSet: 'c',
      format: 'tiles',
      wrapX: true,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: getResolutions(size),
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      }),
    }),
  });
  map.value.addLayer(layer);
};

function getResolutions(size: number) {
  let resolutions = [];

  for (let z = 2; z < 19; ++z) {
    resolutions[z] = size / Math.pow(2, z);
  }

  return resolutions;
}

onMounted(() => {
  console.log('初始化地图');
  cmap = new OlMap({
    target: 'map',
    controls: [],

    layers: [],

    view: new View({
      center: [120, 30],
      zoom: 8,
      projection: 'EPSG:4326',
    }),
  });

  map.value = cmap;
});
</script>

<template>
  <el-button type="primary" @click="click">添加WMS服务</el-button>
  <div id="map" ref="map" style="height: 100vh; width: 100%"></div>
</template>

<style scoped></style>
