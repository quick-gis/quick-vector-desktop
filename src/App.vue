<script lang="ts" setup>
import TestLineRing from './test/TestLineRing.vue';
import TestSampleMap from './test/TestSampleMap.vue';
import TestLayerEditor from './test/TestLayerEditor.vue';
import TestMySqlConnection from './test/TestMySqlConnection.vue';
import MySqlGeojson from './db/mysql/MySqlGeojson.vue';
import TestWMSMap from './test/TestWMSMap.vue';
</script>

<template>
  <div>
    <!--    <TestWMSMap></TestWMSMap>-->
    <router-view></router-view>
  </div>
</template>

<style></style>
