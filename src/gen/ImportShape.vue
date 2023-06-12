<script lang="ts" setup>
import { reactive } from 'vue';
import { ipcRenderer } from 'electron';
import { readShapefile } from '../utils/ShapeUtil';
import { v4 as uuidv4 } from 'uuid';
import { ElMessage, FormRules } from 'element-plus';

const importShapeData = reactive({
  file: '',
  encoding: 'gbk',
  type: '',
});

const rules = reactive<FormRules>({
  file: [{ trigger: 'blur', required: true, message: '必填' }],
  encoding: [{ trigger: 'blur', required: true, message: '必填' }],
  type: [{ trigger: 'blur', required: true, message: '必填' }],
});
ipcRenderer.on('open-select-shp-gen-success', (event, args) => {
  importShapeData.file = args;
});

const ok = async () => {
  if (!importShapeData.file) {
    ElMessage({
      message: '文件必选',
      grouping: true,
      type: 'error',
    });
    return;
  }
  if (!importShapeData.type) {
    ElMessage({
      message: '类型必须',
      grouping: true,
      type: 'error',
    });
    return;
  }
  let data = await readShapefile(importShapeData.file);

  ipcRenderer.send(
    'gen-shp',
    JSON.parse(
      JSON.stringify({
        uid: uuidv4(),
        type: importShapeData.type,
        fileName: importShapeData.file,
        geo: data,
        geo_type: importShapeData.type,
      })
    )
  );
};
const error = () => {
  importShapeData.file = '';
  importShapeData.encoding = 'gbk';
  ipcRenderer.send(
    'gen-shp',
    JSON.parse(
      JSON.stringify({
        close: true,
      })
    )
  );
};
</script>

<template>
  <div>导入SHP</div>
  <div>
    <el-form :model="importShapeData" :rules="rules" label-width="120px">
      <el-form-item label="选择文件" prop="file">
        <el-input v-model="importShapeData.file" disabled></el-input>
        <el-button @click="ipcRenderer.send('open-select-shp-gen')">...</el-button>
      </el-form-item>
      <el-form-item label="编码格式" prop="encoding">
        <el-select v-model="importShapeData.encoding" placeholder="请选择文件编码">
          <el-option label="GBK" value="gbk" />
        </el-select>
      </el-form-item>
      <el-form-item label="成图类型" prop="type">
        <el-select v-model="importShapeData.type" placeholder="请选择成图类型">
          <el-option label="点" value="point" />
          <el-option label="线" value="line" />
          <el-option label="面" value="polygon" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button @click="ok">确定</el-button>
    <el-button @click="error">取消</el-button>
  </div>
</template>

<style scoped></style>
