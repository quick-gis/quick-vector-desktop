<script lang="ts" setup>
import { GeoJsonLineCyc, GeoJsonLineWithOnceCyc } from '../analysis/geojson/analysis/GeoJsonLineCyc';
import { onMounted, reactive, ref } from 'vue';

import OlMap from 'ol/Map';
import View from 'ol/View';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Fill, Stroke, Style, Text } from 'ol/style';

const data = reactive({
  source: JSON.stringify({
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
  }),
  target: null,
});
const map = ref<any>();
let cmap = null;

const click = () => {
  data.target = GeoJsonLineCyc(JSON.parse(data.source));

  let vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(JSON.parse(data.source)),
    }),
    style: new Style({
      stroke: new Stroke({
        color: '#000000', // 线段的颜色
        width: 10, // 线段的宽度，即加粗的程度
      }),
    }),
  });

  map.value.addLayer(vectorLayer);

  let features = new GeoJSON().readFeatures(JSON.parse(data.source));

  let p = [];
  for (let ft of features) {
    let dpoints = ft.getGeometry().getCoordinates();
    for (let t of dpoints) {
      p.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: t,
        },
      });
    }
  }
  let dp = {
    type: 'FeatureCollection',
    features: p,
  };

  let ppp = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(dp),
    }),
    style: function (f) {
      return new Style({
        text: new Text({
          offsetX: 18,
          offsetY: -10,
          scale: 2,
          text: JSON.stringify(f.getGeometry().getCoordinates()),
          fill: new Fill({
            color: '#000000', // 设置标签颜色
          }),
          stroke: new Stroke({
            color: '#ffffff', // 设置标签边框颜色
            width: 2, // 设置标签边框宽度
          }),
        }),
      });
    },
  });

  map.value.addLayer(ppp);

  let vectorLayer2 = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(data.target),
    }),
    style: new Style({
      stroke: new Stroke({
        color: '#e5bbbb', // 线段的颜色
        width: 2.5, // 线段的宽度，即加粗的程度
      }),
    }),
  });

  map.value.addLayer(vectorLayer2);
};

const getText = function (feat) {};
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
  map.value = cmap;
});
</script>

<template>
  <div>
    <el-input v-model="data.source" type="textarea"></el-input>
  </div>
  <el-button type="primary" @click="click">监测环</el-button>
  <div id="map" ref="map" style="height: 100vh; width: 100%"></div>
</template>

<style scoped>
.id {
  background-color: #000;
}
</style>
