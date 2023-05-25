<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="选择面">
      <el-button>...</el-button>
    </el-form-item>
    <el-form-item label="关键字">
      <el-input v-model="form.keywords" />
    </el-form-item>
    <el-form-item label="类型">
      <el-input v-model="form.type" />
    </el-form-item>
  </el-form>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="名称" width="180" />
    <el-table-column prop="date" label="兴趣点类型" width="180" />
    <el-table-column prop="date" label="兴趣点类型编码" width="180" />
    <el-table-column prop="date" label="地址" width="180" />
    <el-table-column prop="date" label="经纬度" width="180" />
    <el-table-column prop="date" label="城市名" width="180" />
  </el-table>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const form = reactive({
  keywords: '',
  type: '',
});

//名称兴趣点类型兴趣点类型编码地址经纬度城市名
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];
</script>
