<template>
  <div>CSV成图</div>

  <el-form :model="gen_shp" label-width="120px">
    <el-form-item label="选择文件">
      <el-input v-model="gen_shp.file" disabled></el-input>
      <el-button @click="ipcRenderer().send('open-select-csv')">...</el-button>
    </el-form-item>
    <el-form-item label="成图类型">
      <el-select v-model="gen_shp.type" placeholder="请选择成图类型">
        <el-option label="点" value="point" />
        <el-option label="线" value="line" />
      </el-select>
    </el-form-item>

    <el-form-item label="是否包含坐标">
      <el-radio-group v-model="gen_shp.hasGeo">
        <el-radio label="是" value="是" />
        <el-radio label="否" value="否" />
      </el-radio-group>
    </el-form-item>

    <div v-if="gen_shp.hasGeo == '否'">
      <el-form-item label="属性链接配置">
        <el-button
          @click="
            () => {
              link_config.display = true;
            }
          "
          >配置
        </el-button>
      </el-form-item>
    </div>

    <div v-if="gen_shp.type == 'point' && (gen_shp.hasGeo == '是' || this.vlink)">
      <el-form-item label="X坐标">
        <el-select v-model="gen_shp.point.x_field" placeholder="请选择X坐标">
          <el-option
            v-for="(col, idx) in gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="gen_shp.fields[idx]"
            :value="gen_shp.fields[idx]"
            >{{ gen_shp.fields[idx] }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Y坐标">
        <el-select v-model="gen_shp.point.y_field" placeholder="请选择Y坐标">
          <el-option
            v-for="(col, idx) in gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="gen_shp.fields[idx]"
            :value="gen_shp.fields[idx]"
          />
        </el-select>
      </el-form-item>
    </div>
    <div v-if="gen_shp.type == 'line' && (gen_shp.hasGeo == '是' || this.vlink)">
      <el-form-item label="起点X坐标">
        <el-select v-model="gen_shp.line.sx_field" placeholder="请选择起点X坐标">
          <el-option
            v-for="(col, idx) in gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="gen_shp.fields[idx]"
            :value="gen_shp.fields[idx]"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="起点Y坐标">
        <el-select v-model="gen_shp.line.sy_field" placeholder="请选择起点Y坐标">
          <el-option
            v-for="(col, idx) in gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="gen_shp.fields[idx]"
            :value="gen_shp.fields[idx]"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="终点X坐标">
        <el-select v-model="gen_shp.line.ex_field" placeholder="请选择终点X坐标">
          <el-option
            v-for="(col, idx) in gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="gen_shp.fields[idx]"
            :value="gen_shp.fields[idx]"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="终点Y坐标">
        <el-select v-model="gen_shp.line.ey_field" placeholder="请选择终点Y坐标">
          <el-option
            v-for="(col, idx) in gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="gen_shp.fields[idx]"
            :value="gen_shp.fields[idx]"
          />
        </el-select>
      </el-form-item>
    </div>
  </el-form>

  <div>
    <el-dialog
      v-model="link_config.display"
      :close-on-click-modal="false"
      :show-close="false"
      title="引用配置"
      width="40%"
    >
      <el-form :model="link_config" :rules="link_config.rules" label-width="120px">
        <el-form-item label="选择链接文件" prop="file" required>
          <el-input v-model="link_config.file" disabled></el-input>
          <el-button :disabled="!link_config.canSelectFile" @click="cl">...</el-button>
        </el-form-item>
        <el-form-item label="原始表字段" prop="source_field" required>
          <el-select v-model="link_config.source_field" placeholder="请选择原始表字段">
            <el-option
              v-for="(col, idx) in gen_shp.fields"
              :key="idx"
              :index="idx"
              :label="gen_shp.fields[idx]"
              :value="gen_shp.fields[idx]"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标表字段" prop="target_field" required>
          <el-select v-model="link_config.target_field" placeholder="请选择目标表字段">
            <el-option
              v-for="(col, idx) in link_config.fields"
              :key="idx"
              :index="idx"
              :label="link_config.fields[idx]"
              :value="link_config.fields[idx]"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="前缀" prop="pre" required>
          <el-input v-model="link_config.pre" placeholder="请输入前缀"></el-input>
        </el-form-item>
        <el-form-item label="引用字段" prop="ref_field" required>
          <el-select v-model="link_config.ref_field" multiple placeholder="请选择引用字段">
            <el-option
              v-for="(col, idx) in link_config.fields"
              :key="idx"
              :index="idx"
              :label="link_config.fields[idx]"
              :value="link_config.fields[idx]"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button @click="linkClose">确定</el-button>
      <el-button
        @click="
          () => {
            link_config.display = false;
          }
        "
        >取消
      </el-button>
    </el-dialog>
  </div>

  <div>
    <el-button @click="ok">确认</el-button>
    <el-button @click="error">取消</el-button>
  </div>
</template>
<script lang="ts">
import { ipcRenderer } from 'electron';
import { csvToListAndMap } from '../utils/CsvUtils';
import { GetLog } from '../utils/LogUtils';
import { v4 as uuidv4 } from 'uuid';
import { ElMessage } from 'element-plus';
import { debounce } from '../utils/Utils';

export default {
  methods: {
    debounce,
    cl() {
      this.link_config.canSelectFile = false;
      ipcRenderer.send('open-link-select-csv');
    },
    a() {
      console.log('kljljl');
      this.ipcRenderer().send('gen-pointOrLine', {
        fileName: this.gen_shp.file,
        geo: [],
      });
    },
    ipcRenderer() {
      return ipcRenderer;
    },
    linkClose() {
      console.log('链接表窗口关闭');
      this.vlink = this.validateLinkConfig();

      this.link_config.ref_field.forEach((e) => {
        this.gen_shp.fields.push(this.link_config.pre + '_' + e);
      });
      this.csv.data.forEach((ee) => {
        let ss = ee[this.link_config.source_field];
        let o = this.find(ss, this.link_config.target_field);

        for (let refFieldElement of this.link_config.ref_field) {
          if (o) {
            ee[this.link_config.pre + '_' + refFieldElement] = o[refFieldElement];
          }
        }
        console.log('sssssssssss', ss);
        console.log('oooooo', o);
      });
      this.link_config.display = false;
    },
    find(ss, field) {
      let o = null;
      this.linkcsv.data.forEach((e) => {
        if (e[field] == ss) {
          o = e;
          return;
        }
      });
      return o;
    },
    ok() {
      let features: any[] = [];

      if (this.gen_shp.type == 'point') {
        for (let datum of this.csv.data) {
          datum['iid'] = uuidv4();
          let once = {
            type: 'Feature',
            properties: datum,
            geometry: {
              coordinates: [Number(datum[this.gen_shp.point.x_field]), Number(datum[this.gen_shp.point.y_field])],
              type: 'Point',
            },
          };
          features.push(once);
        }
      } else if (this.gen_shp.type == 'line') {
        for (let datum of this.csv.data) {
          datum['iid'] = uuidv4();
          let once = {
            type: 'Feature',
            properties: datum,
            geometry: {
              coordinates: [
                [Number(datum[this.gen_shp.line.sx_field]), Number(datum[this.gen_shp.line.sy_field])],
                [Number(datum[this.gen_shp.line.ex_field]), Number(datum[this.gen_shp.line.ey_field])],
              ],
              type: 'LineString',
            },
          };
          features.push(once);
        }
      }
      console.log(features);
      this.res = features;
      let data = {
        uid: uuidv4(),
        fileName: this.gen_shp.file,
        type: this.gen_shp.type,
        geo: {
          type: 'FeatureCollection',
          features: features,
        },
        geo_type: this.gen_shp.type,
      };
      console.log(data);
      GetLog().info(JSON.stringify(data));
      ipcRenderer.send('gen-pointOrLine', JSON.parse(JSON.stringify(data)));
    },

    error() {
      ipcRenderer.send('gen-pointOrLine', { close: true });
    },
    validateLinkConfig() {
      if (!this.link_config.file) {
        ElMessage({
          message: '链接文件必填',
          grouping: true,
          type: 'error',
        });
      }

      if (!this.link_config.source_field) {
        ElMessage({
          message: '原始字段必填',
          grouping: true,
          type: 'error',
        });
      }
      if (!this.link_config.target_field) {
        ElMessage({
          message: '目标字段必填',
          grouping: true,
          type: 'error',
        });
      }
      if (!this.link_config.pre) {
        ElMessage({
          message: '前缀必填',
          grouping: true,
          type: 'error',
        });
        if (~this.pre_list.indexOf(this.link_config.pre)) {
          ElMessage({
            message: '已使用前缀',
            grouping: true,
            type: 'error',
          });
        }
      }
      if (!this.link_config.ref_field || this.link_config.ref_field.length == 0) {
        ElMessage({
          message: '引用字段必填',
          grouping: true,
          type: 'error',
        });
      }

      let vPre = this.link_config.pre != '';
      this.pre_list.push(vPre);

      let vRefField = this.link_config.ref_field.length > 0;
      return vPre == true && vRefField == true;
    },
  },
  mounted() {
    ipcRenderer.on('open-select-csv-success', (event, args) => {
      this.gen_shp.file = args;
      let csvToListAndMap1 = csvToListAndMap(args);
      this.gen_shp.fields = csvToListAndMap1.header;
      this.csv.header = csvToListAndMap1.header;
      this.csv.data = csvToListAndMap1.list;
    });
    ipcRenderer.on('open-link-select-csv-success', (event, args) => {
      this.link_config.file = args;
      let csvToListAndMap1 = csvToListAndMap(args);
      this.link_config.fields = csvToListAndMap1.header;
      this.linkcsv.data = csvToListAndMap1.list;
      this.link_config.canSelectFile = true;
    });
  },

  data() {
    return {
      res: null,
      csv: {
        header: [],
        data: [],
      },
      vlink: false,
      linkcsv: {
        data: [],
        header: [],
      },
      pre_list: ['a'],
      link_config: {
        canSelectFile: true,
        rules: {
          file: [{ required: true, message: '必填', trigger: 'blur' }],
          source_field: [{ required: true, message: '必填', trigger: 'blur' }],
          target_field: [{ required: true, message: '必填', trigger: 'blur' }],
          pre: [
            { required: true, message: '必填', trigger: 'blur' },
            {
              validator: (rule: any, value: any, callback: any) => {
                if (~this.pre_list.indexOf(value)) {
                  callback(new Error('前缀已使用'));
                }
              },
            },
          ],
          ref_field: [{ required: true, message: '必填', trigger: 'blur' }],
        },
        fields: [],
        display: false,
        file: '',
        source_field: '',
        target_field: '',
        pre: '',
        ref_field: [],
      },
      gen_shp: {
        file: '',
        type: '',
        hasGeo: false,
        fields: [],
        point: {
          x_field: '',
          y_field: '',
        },
        line: {
          sx_field: '',
          sy_field: '',
          ex_field: '',
          ey_field: '',
        },
      },
    };
  },
};
</script>
<style></style>
