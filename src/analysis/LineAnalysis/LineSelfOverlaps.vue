<script lang="ts" setup>
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
  layerName: '',
  full: 'true',
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
  ipcRenderer.send('line-self-overlaps', {
    layerName: findNodeById(LayerTree.value, data.layerName).label,
    id: data.layerName,
    full: data.full,
  });
};
const error = () => {
  ipcRenderer.send('line-self-overlaps', {
    close: true,
  });
};
</script>

<template>
  <div>
    <div>线自重叠分析</div>

    <el-form :model="data" :rules="rules" label-width="120px">
      <el-form-item label="待分析图层" prop="layerName">
        <el-tree-select v-model="data.layerName" :data="LayerTree" :render-after-expand="false" node-key="id" />
      </el-form-item>
      <!--      <el-form-item prop="full" label="是否需要完全重叠">-->
      <!--        <el-select v-model="data.full">-->
      <!--          <el-option label="是" value="true" />-->
      <!--          <el-option label="否" value="false" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
    </el-form>
    <div>
      <el-button @click="ok">确定</el-button>
      <el-button @click="error">取消</el-button>
    </div>
  </div>
</template>

<style scoped></style>
