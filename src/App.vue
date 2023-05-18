<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';

console.log('[App.vue]', `Hello world from Electron ${process.versions.electron}!`);
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9feaf9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
