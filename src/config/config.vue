<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ipcRenderer } from 'electron';
import { GetTdtToken } from '../layer/map/Tdt';

const input1 = ref('');
const router = useRoute();
let type;

const blur = (canel) => {
  if (type == 'tdt') {
    console.log('天地图key =', input1.value);
  }
  if (type == 'biying') {
    console.log('必应地图key = ', input1.value);
  }
  if (type == 'bd') {
    console.log('百度地图key = ', input1.value);
  }
  if (type == 'gd') {
    console.log('高德地图key = ', input1.value);
  }

  ipcRenderer.send('map-config', JSON.parse(JSON.stringify({ type: type, token: input1.value, canel: canel })));
};
onMounted(() => {
  console.log('kkk');
  console.log('type = ', router.query.type);
  input1.value = GetTdtToken();
  type = router.query.type;
});
</script>

<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="令牌">
        <el-input v-model="input1" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="blur(false)">确定</el-button>
    <el-button type="primary" @click="blur(true)">取消</el-button>
  </div>
</template>

<style scoped></style>
