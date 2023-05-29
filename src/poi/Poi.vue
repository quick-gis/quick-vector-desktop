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
    <el-button @click="search">搜索</el-button>
  </el-form>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="name" label="名称" width="180" />
    <el-table-column prop="type" label="兴趣点类型" width="180" />
    <el-table-column prop="typecode" label="兴趣点类型编码" width="180" />
    <el-table-column prop="address" label="地址" width="180" />
    <el-table-column prop="location" label="经纬度" width="180" />
    <el-table-column prop="cityname" label="城市名" width="180" />
  </el-table>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { GaoDePoiRest } from './Poi.ts';

const form = reactive({
  keywords: 'kfc',
  type: '',
});

const search = () => {
  let poi = new GaoDePoiRest();
  poi
    .search({
      key: 'df9e141f75c34da017e73b62a4617096',
      polygon:
        '116.460988,40.006919|116.48231,40.007381|116.47516,39.99713|116.472596,39.985227|116.45669,39.984989|116.460988,40.006919',
      keywords: form.keywords,
      page: 0,
    })
    .then((e) => {
      tableData.value = e;
      console.log(e);
    });
};

//名称兴趣点类型兴趣点类型编码地址经纬度城市名
const tableData = ref();
</script>
