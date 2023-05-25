<template>
  <div id="hello">
    <!-- 表格 -->
    <el-table
      :data="testDatas"
      border
      style="width: 100%; margin-top: 10px"
      @header-contextmenu="(column, event) => tableHeaderRightClick(column, event)"
      @cell-contextmenu="numbRightClick"
    >
      <el-table-column v-if="columnList.length > 0" :width="50" label="序号" type="index" />
      <el-table-column v-for="(col, idx) in columnList" :key="col.prop" :index="idx">
        <!-- 表头 -->
        <template #header>
          <p v-show="col.show">
            {{ col.label }}
            <i class="el-icon-edit-outline" @click="col.show = false"></i>
          </p>
          <el-input v-show="!col.show" v-model="col.label" size="mini"> </el-input>
        </template>
        <!-- 列-->
        <template #default="scope">
          <p v-show="scope.row[col.prop].show" @dblclick="rowDoubleClick(scope, col)">
            {{ scope.row[col.prop].content }}
            <i class="el-icon-edit-outline" @click="scope.row[col.prop].show = false"></i>
          </p>
          <el-input
            v-show="!scope.row[col.prop].show"
            v-model="scope.row[col.prop].content"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            @blur="scope.row[col.prop].show = true"
          >
          </el-input>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="showMenu" id="contextmenu" @mouseleave="showMenu = false" @mousemove.stop>
      <div>
        <el-button
          @click="
            curData.before = false;
            newFieldDisplay = true;
          "
          >后加一列
        </el-button>
        <el-button
          @click="
            curData.before = true;
            newFieldDisplay = true;
          "
          >前加一列
        </el-button>
        <el-divider />
        <el-button @click="fieldCalcDisplay = true">字段计算器</el-button>
      </div>
    </div>
    <div v-show="showNumbMenu" id="contextmenu-numb" @mouseleave="showNumbMenu = false" @mousemove.stop>
      <el-button @click="deleteRow">删除本行</el-button>
      <el-button @click="copyRow">复制本行</el-button>
    </div>
    <div>
      <!--    字段计算器-->
      <el-dialog v-model="fieldCalcDisplay" title="字段计算器" width="30%">
        <el-form-item label="选择字段">
          <el-select v-model="calcParam.curField" placeholder="请选择字段">
            <el-option v-for="op in columnList" :key="op" :label="op.label" :value="op.prop" />
          </el-select>
          <el-button @click="calcAddField">添加</el-button>
        </el-form-item>

        <el-divider />
        <div>
          <el-button @click="calcParam.dataTipsDisplay = true">data数据案例 </el-button>
        </div>
        <div></div>
        <el-input disabled placeholder="   (function(data) {" />
        <el-input
          v-model="calcParam.rule"
          :rows="8"
          placeholder="请输入计算公式"
          type="textarea"
          @keyup.delete="calcOnDeleteKeymap(e)"
        />
        <el-input disabled placeholder="   })(rowData); " />

        <el-divider />
        <el-button @click="mockFirstCalc">模拟第一行计算</el-button>
        <el-button @click="calcField">计算</el-button>
        <el-button @click="fieldCalcDisplay = false">取消</el-button>
      </el-dialog>
    </div>

    <div>
      <!--          数据提示框-->
      <el-dialog v-model="calcParam.dataTipsDisplay" title="数据案例" width="30%">
        <div>{{ calcParam.data_tips }}</div>
      </el-dialog>
    </div>
    <div>
      <!--            新建字段弹框-->
      <el-dialog v-model="newFieldDisplay" title="新增字段" width="30%">
        <el-form :model="newFieldParam" label-position="right" label-width="100px" style="max-width: 460px">
          <el-form-item label="中文">
            <el-input v-model="newFieldParam.cn" />
          </el-form-item>
          <el-form-item label="英文">
            <el-input v-model="newFieldParam.en" />
          </el-form-item>
        </el-form>
        <el-divider />
        <el-button @click="newFieldOk">确定</el-button>
        <el-button @click="newFieldCanle">取消</el-button>
      </el-dialog>
    </div>

    <div>
      {{ testDatas }}
    </div>
  </div>
</template>

<script>
import { h } from 'vue';
import { ElMessage } from 'element-plus';

export default {
  name: 'demo',
  methods: {
    mockFirstCalc() {
      // rowData 这个变量名不要修改
      let rowData = this.testDatas[0];
      const jsFunction = this.calcParam.pre + this.calcParam.rule + this.calcParam.pro;
      try {
        let d = eval(jsFunction);

        ElMessage({
          message: h('p', null, [h('span', null, '执行结果:'), h('i', { style: 'color: teal' }, d)]),
        });
      } catch (e) {
        console.log(e);
        ElMessage({
          message: h('p', null, [h('span', null, '执行失败:'), h('i', { style: 'color: red' }, e.stack)]),
        });
      }
    },
    calcOnDeleteKeymap(e) {
      console.log('按下了退格');
    },
    calcAddField() {
      // this.calcParam.rule = "a";
      this.calcParam.rule + '[[' + this.calcParam.curField + ']]';
    },
    calcField() {
      const jsFunction = this.calcParam.pre + this.calcParam.rule + this.calcParam.pro;

      let canChange = true;

      // rowData 这个变量名不要修改
      for (const rowData of this.testDatas) {
        try {
          let d = eval(jsFunction);
        } catch (e) {
          canChange = false;
          break;
        }
      }

      if (canChange) {
        // rowData 这个变量名不要修改
        this.testDatas.forEach((rowData) => {
          let d = eval(jsFunction);
          if (d) {
            let col = this.columnList[this.curData.colIndex];
            rowData[col.prop].content = d;
          }
        });
        this.fieldCalcDisplay = false;
      } else {
        ElMessage({
          message: h('p', null, [h('span', null, '计算失败，重新编写脚本')]),
        });
      }
    },
    deleteRow() {
      this.testDatas.splice(this.curData.rowIndex, 1);
    },
    copyRow() {
      console.log('复制本行');
      var row = this.testDatas[this.curData.rowIndex];
      this.testDatas.splice(this.curData.rowIndex + 1, 0, row);
      console.log(row);
    },
    // todo： 如果要做添加一行需要控制主程序显示顺序
    addRow() {
      let d = {};

      this.columnList.forEach((e) => {
        console.log(1);
        d[e.prop] = { content: '', show: true };
      });
      this.testDatas.splice(this.curData.rowIndex + 1, 0, d);
    },
    newFieldOk() {
      this.addCloField(this.curData.before, this.newFieldParam);
      this.newFieldCanle();
    },
    newFieldCanle() {
      this.newFieldDisplay = false;
      this.newFieldParam = {};
    },
    numbRightClick(row, column, cell, event) {
      this.closeRightMenu();
      event.preventDefault();

      console.log(row);
      console.log('当前行索引', this.calcRowIndex(row));
      this.curData.rowIndex = this.calcRowIndex(row);

      let isFirst = column.label == '序号';
      if (isFirst) {
        this.showNumbMenu = true;
        this.locateMenuOrEditInput('contextmenu-numb', 200, event);
      }
    },
    tableHeaderRightClick(column, event) {
      console.log(column);
      let calcColIndex1 = this.calcColIndex(column.rawColumnKey);
      this.curData.colIndex = calcColIndex1;
      this.restShow();
      this.closeRightMenu();
      event.preventDefault();

      this.showMenu = true;
      this.locateMenuOrEditInput('contextmenu', 200, event);
    },
    // 菜单定位
    locateMenuOrEditInput(eleId, eleWidth, event) {
      let ele = document.getElementById(eleId);
      ele.style.top = event.clientY + 25 + 'px';
      ele.style.left = event.clientX + 10 + 'px';
      if (window.innerWidth - eleWidth < event.clientX) {
        ele.style.left = 'unset';
        ele.style.right = 0;
      }
    },
    // 确保每次只有一个单元格被修改
    restShow: function () {
      this.testDatas.forEach((e) => {
        for (let index in e) {
          let eElement = e[index];
          eElement.show = true;
        }
      });
    },
    /**
     * 根据列名计算第几列
     * @param colName
     * @return {number|string}
     */
    calcColIndex(colName) {
      for (let index in this.columnList) {
        if (this.columnList[index].prop == colName) {
          return index;
        }
      }
      return -1;
    },

    /**
     * 根据行数据计算第几行
     * @param rowData
     */
    calcRowIndex(rowData) {
      return this.testDatas.indexOf(rowData);
    },

    /**
     * 行右键
     * @param scope
     * @param col
     *
     */
    rowDoubleClick(scope, col) {
      this.closeRightMenu();
      this.restShow();
      scope.row[col.prop].show = false;
    },
    closeRightMenu() {
      this.restShow();
      this.showMenu = false;
      this.showNumbMenu = false;
    },
    addCloField(before, data) {
      let ll = { prop: data.en, label: data.cn, show: true };

      if (before) {
        this.columnList.splice(this.curData.colIndex, 0, ll);
      } else {
        this.columnList.splice(Number(this.curData.colIndex) + 1, 0, ll);
      }

      this.testDatas.forEach((e) => {
        e[ll.prop] = { content: '', show: true };
      });
    },
  },

  mounted() {
    document.body.addEventListener('click', () => {
      this.closeRightMenu();
    });
  },
  data() {
    return {
      calcParam: {
        dataTipsDisplay: false,
        pre: '   (function(data) {',
        pro: '   })(rowData); ',
        rule: '    \n     console.log(data.name.content); \n     console.log(data.age.content); \n     \n     return "aaa";\n   ',
        curField: '',
        data_tips: {
          name: {
            content: '张三',
            show: true,
          },
          age: {
            content: 24,
            show: true,
          },
          city: {
            content: '啊啊啊',
            show: true,
          },
          tel: {
            content: '111',
            show: true,
          },
        },
      },
      newFieldParam: {
        cn: '',
        en: '',
      },
      newFieldDisplay: false,
      fieldCalcDisplay: false,
      curData: {
        // 当前列号
        colIndex: -1,
        // 前加后加
        before: false,
        rowIndex: -1,
      },
      showMenu: false,
      showNumbMenu: false,

      columnList: [
        { prop: 'name', label: '姓名', show: true },
        { prop: 'age', label: '年龄', show: true },
        { prop: 'city', label: '城市', show: true },
        { prop: 'tel', label: '电话', show: true },
      ],
      testDatas: [
        {
          name: { content: '张三', show: true },
          age: { content: 24, show: true },
          city: { content: '啊啊啊', show: true },
          tel: { content: '111', show: true },
        },
        {
          name: { content: '李四', show: true },
          age: { content: 25, show: true },
          city: { content: '啊啊啊冲冲冲', show: true },
          tel: { content: '122', show: true },
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
#contextmenu {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  width: 120px;
  border-radius: 3px;
  border: 1px solid #999999;
  background-color: #f4f4f4;
  padding: 10px;
  z-index: 12;

  button {
    display: block;
    margin: 0 0 5px;
  }
}

#contextmenu-numb {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  width: 120px;
  border-radius: 3px;
  border: 1px solid #c57e7e;
  background-color: #e08585;
  padding: 10px;
  z-index: 12;

  button {
    display: block;
    margin: 0 0 5px;
  }
}
</style>
