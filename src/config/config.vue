<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { SendMapConfig } from '../msg/MessageUtils';

const input1 = ref('');
const router = useRoute();
let type;

const blur = () => {
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
  SendMapConfig(input1.value);
};
onMounted(() => {
  console.log('kkk');
  console.log('type = ', router.query.type);
});
</script>

<template>
  <div>
    <el-button @click="blur" type="primary">a</el-button>
    <el-form label-width="120px">
      <el-form-item label="令牌">
        <el-input @blur="blur" v-model="input1" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
