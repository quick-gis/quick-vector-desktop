<script setup lang="ts">
const fff = () => {
  // @ts-ignore
  window.electronAPI.sendUri('/diag');
};
</script>

<template>
  <div>首页</div>
  <div>
    <button @click="fff">弹框</button>
  </div>
</template>

<style scoped></style>
