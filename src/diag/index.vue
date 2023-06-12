<script lang="ts" setup>
import { onMounted } from 'vue';
import { getD, setD } from '../store/testU';
import { ipcRenderer } from 'electron';

onMounted(() => {
  ipcRenderer.send('message', 'hhhhhhh');
  setD('aaaaaaaaaa');
  console.log('aaaaaa');
});
</script>

<template>
  <div><h3>这是一个弹框页面</h3></div>
</template>

<style scoped></style>
