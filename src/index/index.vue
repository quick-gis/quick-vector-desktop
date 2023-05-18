<script setup lang="ts">
import { onMounted, ref } from 'vue';
import  { getD, setD } from '../store/testU';
import {ipcRenderer} from "electron";

const fff = () => {
ipcRenderer.send("'open-win'","/diag")
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
  <div>
    <button @click="fff">弹框</button>
    <button @click="b2">输出存储</button>

    <div>{{ mm }}</div>
  </div>
</template>

<style scoped></style>
