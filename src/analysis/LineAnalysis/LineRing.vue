<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
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
  unity: 'meters',
  size: 0,
  layerName: '',
  geojson: '',
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
  disableNodesWithInvalidGeoType(LayerTree.value, 'line');
});

const ok = () => {
  ipcRenderer.send('line-ring', {
    layerName: findNodeById(LayerTree.value, data.layerName).label,
    id: data.layerName,
  });
};
const error = () => {
  ipcRenderer.send('line-ring', {
    close: true,
  });
};
</script>

<template>
  <div>
    <div>环分析</div>

    <el-form :rules="rules" :model="data" label-width="120px">
      <el-form-item prop="layerName" label="环分析图层">
        <el-tree-select node-key="id" v-model="data.layerName" :data="LayerTree" :render-after-expand="false" />
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="ok">确定</el-button>
      <el-button @click="error">取消</el-button>
    </div>
  </div>
</template>

<style scoped></style>
