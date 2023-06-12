<script lang="ts" setup>
import TestLineRing from './test/TestLineRing.vue';
import TestSampleMap from './test/TestSampleMap.vue';
import TestLayerEditor from './test/TestLayerEditor.vue';
import TestMySqlConnection from './test/TestMySqlConnection.vue';
import MySqlGeojson from './db/mysql/MySqlGeojson.vue';
</script>

<template>
  <div>
    <!--    <MySqlGeojson></MySqlGeojson>-->
    <router-view></router-view>
  </div>
</template>

<style></style>
