<template>
  <div>逻辑属性</div>
  <el-form label-position="right" label-width="100px" :model="feature" style="max-width: 460px">
    <el-form-item v-for="(col, index) in feature.properties" :label="index">
      <el-input disabled="true" v-model="feature.properties[index]" />
    </el-form-item>
  </el-form>
  <div></div>
  <div>空间属性</div>
  <el-form label-position="right" label-width="100px" :model="feature" style="max-width: 460px">
    <el-table :data="tabledata" style="width: 100%">
      <el-table-column prop="id" label="序号" width="100" />
      <el-table-column prop="x" label="x" width="180" />
      <el-table-column prop="y" label="y" width="180" />
    </el-table>
  </el-form>
</template>
<script lang="ts">
export default {
  name: 'atte',
  mounted() {
    let d = this.getCoordinates(this.geometry.geometry);
    for (let i in d) {
      this.tabledata.push({
        id: i,
        x: d[i][0],
        y: d[i][1],
      });
    }
    this.feature = this.geometry;
  },

  methods: {
    getCoordinates(geometry) {
      let coordinates = [];
      if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
        coordinates.push(geometry.coordinates);
      } else if (geometry.type === 'LineString' || geometry.type === 'MultiLineString') {
        coordinates.push(...geometry.coordinates);
      } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach((coords) => {
          coordinates.push(...coords);
        });
      }
      return coordinates;
    },
  },

  props: {
    geometry: Object,
  },
  data() {
    return {
      tabledata: [],
      feature: {
        properties: {},
        geometry: {},
      },
    };
  },
};
</script>
<style></style>
