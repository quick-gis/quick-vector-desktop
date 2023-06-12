<script lang="ts" setup>
import { reactive, watch } from 'vue';
var mysql = require('mysql');

const data = reactive({
  linkConfig: {
    table: '',
    field: '',
    db: '',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root123@',
    databases: [],
    tables: [],
    tableFields: [],
    isLink: false,
  },
  geojsonCollections: [],
});
let connection;
const testLink = () => {
  connection = mysql.createConnection({
    host: data.linkConfig.host,
    user: data.linkConfig.username,
    password: data.linkConfig.password,
  });
  connection.connect();

  connection.query('show databases;', (err, result) => {
    if (err) {
      console.log(err);
    }
    data.linkConfig.isLink = true;

    data.linkConfig.databases = [];
    for (let re of result) {
      data.linkConfig.databases.push(re.Database);
    }
    console.log(result);
  });
};
watch(
  () => {
    return data.linkConfig.db;
  },
  (newVal, oldVal) => {
    connection.query(
      'SELECT\n' +
        'table_name 表名,\n' +
        'table_comment 表说明\n' +
        'FROM\n' +
        'information_schema.TABLES\n' +
        'WHERE\n' +
        "table_schema = '" +
        data.linkConfig.db +
        "'\n" +
        'ORDER BY\n' +
        'table_name',
      (err, result) => {
        if (err) {
          console.log(err);
        }
        data.linkConfig.tables = [];
        for (let re of result) {
          console.log(re);
          data.linkConfig.tables.push({
            cn_name: re.表名,
            en_name: re.表说明,
          });
        }
        console.log(result);
      }
    );
  }
);
watch(
  () => {
    return data.linkConfig.table;
  },
  (nv, ov) => {
    connection.query(
      'SELECT\n' +
        'a.table_name 表名,\n' +
        'a.table_comment 表说明,\n' +
        'b.COLUMN_NAME 字段名,\n' +
        'b.column_comment 字段说明,\n' +
        'b.column_type 字段类型,\n' +
        'b.column_key 约束\n' +
        'FROM\n' +
        'information_schema. TABLES a\n' +
        'LEFT JOIN information_schema. COLUMNS b ON a.table_name = b.TABLE_NAME\n' +
        'WHERE\n' +
        "a.table_schema = '" +
        data.linkConfig.db +
        "'\n" +
        "and a.table_name = '" +
        data.linkConfig.table +
        "'\n" +
        'ORDER BY\n' +
        'a.table_name',
      (err, result) => {
        if (err) {
          console.log(err);
        }
        data.linkConfig.tableFields = [];
        for (let re of result) {
          data.linkConfig.tableFields.push({
            cn_name: re.字段说明,
            en_name: re.字段名,
            type: re.字段类型,
          });
        }
        console.log(result);
      }
    );
  }
);
const calcGeojson = () => {
  let fied = '';

  let d = [...data.linkConfig.tableFields];
  for (let o of d) {
    fied = fied + "'" + o.en_name + "' ," + o.en_name + ',\n';
  }
  fied = fied.substring(0, fied.length - 2);
  console.log(fied);
  let sql =
    'SELECT JSON_OBJECT(\n' +
    "    'type', 'FeatureCollection',\n" +
    "    'features', JSON_ARRAYAGG(\n" +
    '        JSON_OBJECT(\n' +
    "            'type', 'Feature',\n" +
    "            'geometry', ST_AsGeoJSON(" +
    data.linkConfig.field +
    '),\n' +
    "            'properties', JSON_OBJECT(\n" +
    fied +
    '            )\n' +
    '        )\n' +
    '    )\n' +
    ') AS geojson\n' +
    'FROM ' +
    data.linkConfig.table +
    ';\n';
  console.log(sql);
  let conn = mysql.createConnection({
    host: data.linkConfig.host,
    user: data.linkConfig.username,
    password: data.linkConfig.password,
    port: data.linkConfig.port,
    database: data.linkConfig.db,
  });
  let geojsonCollections = [];
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (let g of result) {
      geojsonCollections.push(g.geojson);
    }
  });
  conn.end();
  data.geojsonCollections = geojsonCollections;
};
</script>

<template>
  <div>数据库链接</div>
  <div>
    <el-form :model="data.linkConfig">
      <el-form-item label="数据库ip">
        <el-input v-model="data.linkConfig.host" />
      </el-form-item>
      <el-form-item label="数据库端口">
        <el-input v-model="data.linkConfig.port" />
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="data.linkConfig.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="data.linkConfig.password" />
      </el-form-item>

      <el-form-item v-if="data.linkConfig.isLink" label="数据库">
        <el-select v-model="data.linkConfig.db">
          <el-option v-for="(col, idx) in data.linkConfig.databases" :label="col" :value="col" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.linkConfig.db" label="表">
        <el-select v-model="data.linkConfig.table">
          <el-option v-for="(col, idx) in data.linkConfig.tables" :key="idx" :label="col.en_name" :value="col.cn_name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.linkConfig.table" label="空间字段">
        <el-select v-model="data.linkConfig.field">
          <el-option
            v-for="(col, idx) in data.linkConfig.tableFields"
            :key="idx"
            :label="col.cn_name"
            :value="col.en_name"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div>{{ data.geojsonCollections }}</div>

    <el-button @click="testLink">测试链接</el-button>
    <el-button @click="calcGeojson">获取geojson</el-button>
  </div>
</template>

<style scoped></style>
