<template>
  <div>逻辑属性</div>
  <el-form :model="feature" label-position="right" label-width="100px" style="max-width: 460px">
    <el-form-item v-for="(col, index) in feature.properties" :label="index">
      <el-input v-model="feature.properties[index]" disabled="true" />
    </el-form-item>
  </el-form>
  <div></div>
  <div>空间属性</div>
  <el-form :model="feature" label-position="right" label-width="100px" style="max-width: 460px">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" prop="id" width="100" />
      <el-table-column label="x" prop="x" width="180" />
      <el-table-column label="y" prop="y" width="180" />
    </el-table>
  </el-form>
</template>
<script lang="ts">
export default {
  name: 'attrRange',
  mounted() {
    console.log('=========');
    console.log(this.geometry);
  },
  computed: {
    tableData() {
      console.log('tableData refresh');
      this.feature = this.geometry;

      let d = this.getCoordinates(this.geometry.geometry);
      const arr = [];
      for (let i in d) {
        arr.push({
          id: i,
          x: d[i][0],
          y: d[i][1],
        });
      }
      return arr;
    },
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
      feature: {
        properties: {},
        geometry: {},
      },
    };
  },
};
</script>
<style></style>
