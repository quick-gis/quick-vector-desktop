<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getD, setD } from '../store/testU';
import { ipcRenderer } from 'electron';

const fff = () => {
  console.log('弹框');
  ipcRenderer.send('message', 'hhhhhhh');

  ipcRenderer.send('open-win', '/diag');
};
onMounted(() => {
  setD('jkljljlk');
});
const mm = ref();

const b2 = () => {
  mm.value = getD();
};
</script>

<template>
  <div>首页</div>
</template>

<style scoped></style>
