<script lang="ts" setup>
import { reactive } from 'vue';
import { ipcRenderer } from 'electron';
import { ElMessage, FormRules } from 'element-plus';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const rules = reactive<FormRules>({
  file: [{ trigger: 'blur', required: true, message: '必填' }],
  encoding: [{ trigger: 'blur', required: true, message: '必填' }],
});
const importGeoJsonData = reactive({
  file: '',
  encoding: 'utf8',
  type: 'collection',
});

ipcRenderer.on('open-select-geojson-gen-success', (event, args) => {
  importGeoJsonData.file = args;
});

const ok = async () => {
  if (!importGeoJsonData.file) {
    ElMessage({
      message: '文件必选',
      grouping: true,
      type: 'error',
    });
    return;
  }

  try {
    const data = fs.readFileSync(importGeoJsonData.file, importGeoJsonData.encoding);
    ipcRenderer.send(
      'gen-geojson',
      JSON.parse(
        JSON.stringify({
          uid: uuidv4(),
          fileName: importGeoJsonData.file,
          geo: data,
        })
      )
    );
  } catch (err) {
    console.error(err);
    ElMessage({
      message: '文件读取失败',
      grouping: true,
      type: 'error',
    });
  }
};
const error = () => {
  ipcRenderer.send(
    'gen-geojson',
    JSON.parse(
      JSON.stringify({
        close: true,
      })
    )
  );
};
</script>

<template>
  <div>导入GeoJson</div>
  <div>
    <el-form :model="importGeoJsonData" :rules="rules" label-width="120px">
      <el-form-item label="选择文件" prop="file">
        <el-input v-model="importGeoJsonData.file" disabled></el-input>
        <el-button @click="ipcRenderer.send('open-select-geojson-gen')">...</el-button>
      </el-form-item>
      <el-form-item label="编码格式" prop="encoding">
        <el-select v-model="importGeoJsonData.encoding" placeholder="请选择文件编码">
          <el-option label="GB2312" value="GB2312" />
          <el-option label="UTF-8" value="utf8" />
        </el-select>
      </el-form-item>
      <el-form-item label="成图类型" prop="type">
        <el-select v-model="importGeoJsonData.type" placeholder="请选择成图类型">
          <el-option label="点" value="point" />
          <el-option label="线" value="line" />
          <el-option label="面" value="polygon" />
          <el-option label="集合" value="collection" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button @click="ok">确定</el-button>
    <el-button @click="error">取消</el-button>
  </div>
</template>

<style scoped></style>
