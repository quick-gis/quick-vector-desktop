<script lang="ts" setup>
import { reactive } from 'vue';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import { ElMessage } from 'element-plus';

const data = reactive({
  file: '',
  geojson: '',
});
const ok = () => {
  fs.writeFile(data.file, data.geojson, (err) => {
    if (err) {
      ElMessage({
        showClose: true,
        message: 'GeoJson文件导出失败: ' + err.message,
        type: 'error',
      });
    } else {
      ElMessage({
        showClose: true,
        message: '导出成功',
        type: 'success',
      });
      setTimeout(() => {
        ipcRenderer.send('close-export-geojson');
      }, 1000);
      console.log('文件已写出');
    }
  });
};
const error = () => {
  ipcRenderer.send('close-export-geojson');
};
ipcRenderer.on('save-geojson-step1', (event, args) => {
  data.file = args.path;
});
ipcRenderer.on('save-geojson-step2', (event, args) => {
  data.geojson = args.geojson;
});
</script>

<template>
  <div>导出数据</div>
  <el-form :model="data" label-width="120px">
    <el-form-item label="选择文件">
      <el-input v-model="data.file" disabled></el-input>
      <el-button @click="ipcRenderer.send('save-geojson')">...</el-button>
    </el-form-item>
  </el-form>
  <div>
    <el-button @click="ok">确认</el-button>
    <el-button @click="error">取消</el-button>
  </div>
</template>

<style scoped></style>
