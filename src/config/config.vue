<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ipcRenderer } from 'electron';

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

  ipcRenderer.send('map-config', { type: type, token: input1.value, canel: canel });
};
onMounted(() => {
  console.log('kkk');
  console.log('type = ', router.query.type);
  type = router.query.type;
});
</script>

<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="令牌">
        <el-input @blur="blur" v-model="input1" />
      </el-form-item>
    </el-form>
    <el-button @click="blur(false)" type="primary">确定</el-button>
    <el-button @click="blur(true)" type="primary">取消</el-button>
  </div>
</template>

<style scoped></style>
