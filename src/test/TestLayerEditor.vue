<script lang="ts" setup>
import { GeoJsonLineCyc, GeoJsonLineWithOnceCyc } from '../analysis/geojson/analysis/GeoJsonLineCyc';
import { onMounted, reactive, ref } from 'vue';

import OlMap from 'ol/Map';
import View from 'ol/View';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Modify, Snap } from 'ol/interaction';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { createStringXY } from 'ol/coordinate';
import { MousePosition } from 'ol/control';

const data = reactive({
  source: JSON.stringify({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [3, 3],
            [3, 4],
            [4, 4],
            [4, 3],
            [3, 3],
          ],
        },
      },
    ],
  }),
  target: null,
});
const map = ref<any>();
let cmap = null;

const click = () => {
  let source = vectorLayer.getSource();
  let modify = new Modify({
    source: source,
  });
  map.value.addInteraction(modify);
  let snap = new Snap({
    source: source,
  });

  map.value.addInteraction(snap);
};
const endclick = () => {};

onMounted(() => {
  console.log('初始化地图');
  cmap = new OlMap({
    target: 'map',
    controls: [],

    layers: [],

    view: new View({
      center: [0, 0],
      zoom: 8,
      projection: 'EPSG:4326',
    }),
  });
  vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(JSON.parse(data.source)),
    }),
    style: new Style({
      stroke: new Stroke({
        color: '#000000', //Ò 线段的颜色
        width: 10, // 线段的宽度，即加粗的程度
      }),
    }),
  });

  cmap.addLayer(vectorLayer);
  map.value = cmap;
});
let vectorLayer;
</script>

<template>
  <div>
    <el-input v-model="data.source" type="textarea"></el-input>
  </div>
  <el-button type="primary" @click="click">开始编辑</el-button>
  <el-button type="primary" @click="endclick">结束编辑</el-button>
  <div id="map" ref="map" style="height: 100vh; width: 100%"></div>
</template>

<style scoped></style>
