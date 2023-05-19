<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GetLog } from '../utils/LogUtils';
import { DiTuConfig } from './mapConfig';
import { ipcRenderer } from 'electron';
const input1 = ref('');
const router = useRoute();
let type;

const blur = () => {
  if (type == 'tdt') {
    console.log('天地图key =', input1.value);
  }
};
onMounted(() => {
  ipcRenderer.on('aaa', (event, args) => {
    console.log('?a');
  });
  console.log('kkk');
  console.log('type = ', router.query.type);
});
</script>

<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="令牌">
        <el-input :blur="blur" v-model="input1" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
