<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { ipcRenderer } from 'electron';
import {
  disableNodesWithInvalidGeoType,
  findNodeById,
  findNodeByLabel,
  removeNodesByLabel,
} from '../../layer/map/NodeUtil';

const rules = {
  layerName: [{ required: true, message: '必填', trigger: 'blur' }],
};
const data = reactive({
  layerName: '',
  fields: [],
  field: '',
  radio1: '1',
});
const LayerTree = ref();
onMounted(() => {
  ipcRenderer.send('getLayers');
});
ipcRenderer.on('curLayers', (event, args) => {
  console.log('当前图层', args);
  LayerTree.value = removeNodesByLabel(args.data, ['标记图层', 'WMS/WMTS', '底图']);
  findNodeByLabel(LayerTree.value, '数据库图层').disabled = true;
  findNodeByLabel(LayerTree.value, '文件图层').disabled = true;
  disableNodesWithInvalidGeoType(LayerTree.value, 'point');
});
ipcRenderer.on('get-geojson-field-res-Propagation', (event, args) => {
  let parse = JSON.parse(args);
  data.fields = parse.fields;
});
const ok = () => {
  ipcRenderer.send('point-repeat', {
    layerName: findNodeById(LayerTree.value, data.layerName).label,
    id: data.layerName,
    field: data.field,
  });
};
// 观察data.layerName是否发送变化，如果发生变化则获取字段集合
const stopWatch = watch(
  () => data.layerName,
  (newVal, oldVal) => {
    if (LayerTree.value) {
      let nid = findNodeById(LayerTree.value, data.layerName).id;

      ipcRenderer.send('get-geojson-field', { node_id: nid });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
const error = () => {
  ipcRenderer.send('point-repeat', {
    close: true,
  });
};
</script>

<template>
  <div>
    <div>点重复分析</div>

    <el-form :model="data" :rules="rules" label-width="120px">
      <el-form-item label="待分析图层" prop="layerName">
        <el-tree-select v-model="data.layerName" :data="LayerTree" :render-after-expand="false" node-key="id" />
      </el-form-item>
      <el-form-item label="检查模式" prop="module">
        <el-radio-group v-model="data.radio1" class="ml-4">
          <el-radio label="1" size="large">字段检查</el-radio>
          <el-radio label="2" size="large">坐标检查</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="data.radio1 == 1" label="检查字段" prop="fields">
        <el-select v-model="data.field">
          <el-option v-for="(col, idx) in data.fields" :label="col" :value="col" />
        </el-select>
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="ok">确定</el-button>
      <el-button @click="error">取消</el-button>
    </div>
  </div>
</template>

<style scoped></style>
