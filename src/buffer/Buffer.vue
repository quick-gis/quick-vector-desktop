<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ipcRenderer } from 'electron';

const data = reactive({
  unity: '',
  size: 0,
  layerName: '',
  geojson: '',
});
const units = [
  { label: '米', value: 'meters' },
  { label: '毫米', value: 'millimeters' },
  { label: '厘米', value: 'centimeters' },
  { label: '千米', value: 'kilometers' },
  { label: '英亩', value: 'acres' },
  { label: '英里', value: 'miles' },
  { label: '海里', value: 'nauticalmiles' },
  { label: '英寸', value: 'inches' },
  { label: '码', value: 'yards' },
  { label: '英尺', value: 'feet' },
  { label: '弧度', value: 'radians' },
  { label: '度', value: 'degrees' },
  { label: '公顷', value: 'hectares' },
];
ipcRenderer.on('buffer-config-data', (event, args) => {
  data.layerName = args.fileName;
  data.geojson = args.json;
});
const ok = () => {
  ipcRenderer.send('buffer-config-data-complete', {
    unity: data.unity,
    size: data.size,
    layerName: data.layerName,
    close: false,
    geojson: data.geojson,
  });
};
const error = () => {
  ipcRenderer.send('buffer-config-data-complete', {
    close: true,
  });
};
</script>

<template>
  <div>缓冲区分析</div>
  <el-form :model="data" label-width="120px">
    <el-form-item label="缓冲图层">
      <el-input disabled v-model="data.layerName" />
    </el-form-item>
    <el-form-item label="缓冲长度">
      <el-input-number :step="0.1" v-model="data.size" />
    </el-form-item>
    <el-form-item label="单位">
      <el-select v-model="data.unity" placeholder="请选择长度单位">
        <el-option v-for="unit in units" :key="unit.value" :label="unit.label" :value="unit.value"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div>
    <el-button @click="ok">确定</el-button>
    <el-button @click="error">取消</el-button>
  </div>
</template>

<style scoped></style>
