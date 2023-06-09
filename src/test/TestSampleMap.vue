<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import OlMap from 'ol/Map';
import View from 'ol/View';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';

const data = reactive({});
const map = ref<any>();
let cmap = null;
import dp from './test';
import { DefaultSelectStyle, SelectedStyles } from '../config/mapmapStyle';
const click = () => {
  let ppp = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(dp),
    }),
    style: function (f) {
      return DefaultSelectStyle[f.getGeometry().getType()];
    },
  });

  map.value.addLayer(ppp);
};
onMounted(() => {
  console.log('初始化地图');
  cmap = new OlMap({
    target: 'map',
    controls: [],

    layers: [],

    view: new View({
      center: [38.230560853772744, 9.797195236555524],
      zoom: 8,
      projection: 'EPSG:4326',
    }),
  });
  map.value = cmap;
});
</script>

<template>
  <el-button type="primary" @click="click">导入geojson</el-button>
  <div id="map" ref="map" style="height: 100vh; width: 100%"></div>
</template>

<style scoped>
.id {
  background-color: #000;
}
</style>
