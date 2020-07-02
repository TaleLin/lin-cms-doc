---
title: 表格 Table
---

<script>
import spread from './spread.png'
import retract from './retract.png'

  export default {
    data() {
      return {
        tableColumn : [
          { prop: 'date', label: '日期', width: '150'}, 
          { prop: 'name', label: '姓名', width: '150'},
          { prop: 'province', label: '省份',width: '150'}, 
          { prop: 'city', label: '市区',width: '100' },
          { prop: 'address', label: '地址', width: '300' },
          { prop: 'zip', label: '邮政编码' , width:'150' }, 
        ],
        sortTableColumn : [
          { prop: 'date', label: '日期', width: '150',sortable: true}, 
          { prop: 'name', label: '姓名', width: '150'},
          { prop: 'province', label: '省份',width: '150'}, 
          { prop: 'city', label: '市区',width: '100' },
          { prop: 'address', label: '地址', width: '300', formatter:this.formatter },
          { prop: 'zip', label: '邮政编码' , width:'150' }, 
        ],
        filterTableColumn : [
          { prop: 'date', label: '日期', width: '150',sortable: true, filters:[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}],
          filterMethod: this.filterHandler}, 
          { prop: 'name', label: '姓名', width: '150'},
          { prop: 'province', label: '省份',width: '150'}, 
          { prop: 'city', label: '市区',width: '100' },
          { prop: 'address', label: '地址', width: '300', formatter:this.formatter },
          { prop: 'zip', label: '邮政编码' , width:'150' }, 
        ],
        list: [
          {  
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '1'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '2'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '3'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '4'
        },{
          date: '2016-05-05',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '5'
        },{
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '6'
        },{
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '7'
        },{
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '8'
        },{
          date: '2016-05-09',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '9'
        }],
        tableData:[],
        operate : [
          { name: '编辑', func: 'handleEdit', type: 'primary' }, 
          { name: '删除', func: 'handleDelete', type: 'danger' }
        ] ,
        customColumn: [],
        checkboxList: [],
        fixedLeftList: [],
        fixedRightList:[],
        loading: false,
        pagination: {
          pageSize: 4,
          pageTotal: null
        },
        type: 'selection',
        isSpread: false,
        selectedTotal: 0,
        index: 'index',
        filterValue: [],
        reload: true
      }
    },
    created() {
      // 表格行内编辑  
      this.tableData = this.list.map((v,index) => {
        v.index = index
        this.$set(v, 'edit', false) 
          v.originalAddress = v.address 
          return v
      })
     this.customColumn = this.tableColumn.map( item => item.label),
     this.checkboxList = [...this.customColumn]
     this.$set(this.pagination, 'pageTotal', this.tableData.length)
    },
    methods: {
      update() {
        this.reload = false
        this.$nextTick( () => {
          this.reload = true
        })
      },
      // 固定列
      handleClick(row) {
        console.log(row);
      },
      // 普通表格
      handleEdit(val) {
        console.log(val)
      },
      handleDelete(val) {
         console.log(val)
        this.loading = true
        setTimeout( () => {
          this.tableData.splice(val.index,1)
          this.$set(this.pagination, 'pageTotal', this.tableData.length)
          this.loading = false
        },1000)  
      },
      rowClick(val) {
        console.log(val)
      },
      // 行内编辑
      cancelEdit(index, row) {
        row.address = row.originalAddress
        row.edit = false
      },
      confirmEdit(index, row) {
        row.edit = false
        row.originalAddress = row.address
      },
      currentChange(page) {
        console.log(page)
      },
      handleSelectionChange(val) {
        console.log(val)
        this.selectedTotal = val.length
      },
      // 监听单选
      handleCurrentChange(val) {
        console.log(val)
      },
       formatter(row, column) {
        return row.address;
      },
      filterHandler(value, row, column) {
        const filteredValue = column.filteredValue
        const columnKey = column.columnKey
        const total = this.tableData.filter(item => filteredValue.includes(item[columnKey]))
        this.$set(this.pagination, 'pageTotal', total.length) // 重新设置分页
        const property = column['property'];
        return row[property] === value;
      },
      changeStatus () {
        this.isSpread = !this.isSpread
      },
      getDragData(val) {
        console.log(val.dragData)
        console.log(val.oldIndex)
        console.log(val.newIndex)
      },
      exportExcel() {
        this.$refs.linTable.exportExcel('aaa')
      }  
    },
    computed: {
      imgSrc () {
        return this.isSpread ? retract : spread
      },
      content () {
        return this.isSpread ? '隐藏代码' : '展示代码'
      }
    },

  }
</script>

<style>
.el-button--text{
  color: #3963bc;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 12px;
}
.basic {
  padding: 2rem;
  box-shadow: 2px 2px 30px #C7CCD7;
}
.selecte {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px 0;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #3963bc;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #3963bc;
  border-color: #3963bc;
}
.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #3963bc;
}
.el-button--primary {
  background-color: #3963bc;
  border-color: #3963bc;
}
</style>


lin-table 在 element-ui 库 [Table 组件](http://element.eleme.io/#/zh-CN/component/table) 的基础上进行二次开发，完全兼容原生API。

:::tip
位置：`src/base/table/lin-table.vue`
:::

## 基础表格

快速渲染一个带操作按键的 table

<BorderContent @update="update">
<template slot="content">

<template>
  <lin-table :tableColumn="tableColumn"
            :tableData="tableData"
            :operate="operate"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"></lin-table>
</template>
</template>

<template slot="introduce">

`operate` 接受一个 `Array`, 子元素有三个属性: `name` 按键名称、 `type` 按键名称 、 `func` 按键绑定的函数名称，组件内部已经写好了`handleEdit`、`handleDelete`，点击可以获取到该行的索引和内容，如果想要绑定别的函数实现其他功能，可以自己在`lin-table`组件里自己编写绑定函数。

只要传入表头、表格数据、功能区操作函数，就能很方便的渲染出一个表格，这里要注意的是，要保持表头和表格数据字段名的一致性，否则表格无法正常渲染。如果不需要功能区，可以不传 `operate` 。

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :operate="operate"
    @handleEdit="handleEdit"
    @handleDelete="handleDelete">
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
       tableColumn : [
          { prop: 'date', label: '日期'}, 
          { prop: 'name', label: '姓名'},
          { prop: 'province', label: '省份'}, 
          { prop: 'city', label: '市区' },
          { prop: 'address', label: '地址'},
          { prop: 'zip', label: '邮政编码'}, 
        ],
        tableData: [
          {  
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          key: '1'
        }......],
        operate : [
          { name: '编辑', func: 'handleEdit', type: 'edit' }, 
          { name: '删除', func: 'handleDelete', type: 'del' }
        ],
    }
  }
  methods: {
      // 编辑
      handleEdit(val) {
        console.log(val)
      },
      // 删除
      handleDelete(val) {
         console.log(val)
      },
   }
}
</script>
```
</template>
</BorderContent>

:::tip
打开控制台，点击编辑或者删除按键，查看结果。
:::

## 定制列 固定列
当一个表格的横向内容过多时，可以通过定制列或者固定列来解决，由用户来控制table的呈现方式。

<BorderContent @update="update">
<template slot="content">

<template>
  <div>
  <span>需要展示的列：</span>
  <el-checkbox-group class="selecte" v-model="customColumn">
   <el-checkbox :disabled="item === '姓名'"v-for="(item, index) in checkboxList" :key="item" :label="item"></el-checkbox>
    </el-checkbox-group>
    <span>固定在左侧的列：</span>
  <el-checkbox-group class="selecte" v-model="fixedLeftList">
   <el-checkbox :disabled="!customColumn.includes(item) || fixedRightList.includes(item)" v-for="(item, index) in checkboxList" :key="item" :label="item"></el-checkbox>
  </el-checkbox-group>
  <span>固定在右侧的列：</span>
  <el-checkbox-group class="selecte" v-model="fixedRightList">
   <el-checkbox :disabled="!customColumn.includes(item) || fixedLeftList.includes(item)" v-for="(item, index) in checkboxList" :key="item" :label="item"></el-checkbox>
  </el-checkbox-group>
  <lin-table :tableColumn="tableColumn"
            :tableData="tableData"
            :customColumn="customColumn"
            :fixedLeftList="fixedLeftList"
            :fixedRightList="fixedRightList"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"></lin-table>
  </div>          
</template>
</template>

<template slot="introduce">

`customColumn` 传入需要展示的列的 `label` 名称, 类型为 `Array`， 默认全部展示；
`fixedLeftList` 传入需要固定在左侧的列的 `label` 名称 类型为 `Array` ,默认不固定;
`fixedRightList`  传入需要固定在右侧的列的l `abel` 名称, 类型为 `Array`, 默认不固定。

</template>

<template slot="code">

```vue
<template>
  <div>
    <span>需要展示的列：</span>
    <el-checkbox-group class="selecte" v-model="customColumn">
      <el-checkbox :disabled="item === '姓名'"v-for="(item, index) in checkboxList" :key="item" :label="item"></el-checkbox>
    </el-checkbox-group>
    <span>固定在左侧的列：</span>
    <el-checkbox-group class="selecte" v-model="fixedLeftList">
      <el-checkbox :disabled="!customColumn.includes(item)" v-for="(item, index) in checkboxList" :key="item" :label="item"></el-checkbox>
    </el-checkbox-group>
    <span>固定在右侧的列：</span>
    <el-checkbox-group class="selecte" gv-model="fixedRightList">
     <el-checkbox :disabled="!customColumn.includes(item)" v-for="(item, index) in checkboxList" :key="item" :label="item"></el-checkbox>
    </el-checkbox-group>
    <lin-table 
      :tableColumn="tableColumn"
      :tableData="tableData"
      :customColumn="customColumn"
      :fixedLeftList="fixedLeftList"
      :fixedRightList="fixedRightList"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete">
    </lin-table>
  </div>  
</template>

<script>
export default {
  data () {
    return {
      tableColumn:[
        { prop: 'date', label: '日期', width: '100' }, 
        { prop: 'name', label: '姓名', width: '100'},
        { prop: 'province', label: '省份',width: '100'}, 
        { prop: 'city', label: '市区',width: '100' },
        { prop: 'address', label: '地址', width: '300'},
        { prop: 'zip', label: '邮政编码', width: '150'}, 
      ],
      customColumn: [], // 定制列
      fixedLeftList: [], // 左侧固定
      fixedRightList:[], // 右侧固定
      checkboxList: [],
    }
  },
  created () {
    this.customColumn = this.tableColumn.map( item => item.label),
    this.checkboxList = [...this.customColumn]
  },
}
</script>
```
</template>
</BorderContent>

::: tip
当需要设置固定列功能时，需要给表头column设置width属性。
:::

## 分页

当数据量不大的时候，可以一次性获取全部的数据，在前端做分页功能，而不用每次切换页的时候都需要重新向后端请求数据。

<BorderContent @update="update">
<template slot="content">

<template>
  <div>
  <lin-table :tableColumn="tableColumn"
            :tableData="tableData"
            :loading="loading"
            :pagination="pagination"></lin-table>
  </div>          
</template>
</template>

<template slot="introduce">

`pagination` 为分页配置项，类型为 `Object` | `Boolean` ，默认为 `false`，不显示分页；当接受一个对象类型时，它有两个属性：`pageSize`  每页显示条目个数, `pageTotal` 总条目数。

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :pagination="pagination"
    @currentChange="currentChange">
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
      pagination: {
        pageSize: 4,
        pageTotal: null
      },
    }
  },
  created () {
    this.$set(this.pagination, 'pageTotal', this.tableData.length) // 获取数据总条数
  },
  methods: {
    // 监听页码变化
    currentChange(page) {
      console.log(page)
    },
  }
}
</script>
```
</template>
</BorderContent>


## 动画

在删除数据后需要更新列表的时候，加入loading效果

<BorderContent @update="update">
<template slot="content">

<template>
  <div>
  <lin-table :tableColumn="tableColumn"
            :tableData="tableData"
            :operate="operate"
            :loading="loading"
            @handleDelete="handleDelete"></lin-table>
  </div>          
</template>
</template>

<template slot="introduce">

`loading` 控制动画, 类型为 `Boolean`, 默认为`false`, 不显示动画;
`loadingText` 提示文字， 类型为 `String`,  默认为空, 没有提示文字;
`loadingIcon`  动画 `icon`, 默认为 `el-icon-loading` ;
`loadingBG` 控制动画背景色, 类型为 `String`, 默认为 `rgba(255,255,255,0.5)` ;

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :operate="operate"
    :loading="loading"
    @handleDelete="handleDelete">
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
      loading:false
    }
  },
  methods: {
    // 删除
    handleDelete(val) {
      console.log(val)
      this.loading = true
      setTimeout( () => {
        this.tableData.splice(val.index,1)
        this.$set(this.pagination, 'pageTotal', this.tableData.length)
        this.loading = false
      },1000)  
    },
  }
}
</script>
```
</template>
</BorderContent>

## 索引

显示行索引

<BorderContent @update="update">
<template slot="content">

<template>
  <lin-table :tableColumn="tableColumn"
            :tableData="tableData"
            :pagination="pagination"
            :index="index"
            @handleCurrentChange="handleCurrentChange"
            ></lin-table>     
</template>
</template>

<template slot="introduce">

传入`index`即可显示索引号。

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :index="index"
    :pagination="pagination">
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
      pagination: {
        pageSize: 4,
        pageTotal: null
      },
      index: 'index'
    }
  }
}
</script>
```
</template>
</BorderContent>


## 单选

选择单行数据时使用色块表示

<BorderContent @update="update">
<template slot="content">

<template>
  <lin-table :tableColumn="tableColumn"
            :tableData="tableData"
            :pagination="pagination"
            :highlightCurrentRow=true
            @handleCurrentChange="handleCurrentChange"
             ></lin-table>     
</template>
</template>

<template slot="introduce">

设置 `highlightCurrentRow` 为 `true` 即可开启单选功能，默认为 `false` 。

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :highlightCurrentRow=true
    >
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
      pagination: {
        pageSize: 4,
        pageTotal: null
      },
    }
  }
  methods: {
    // 监听选中/取消的数据
    handleCurrentChange(val) {
      console.log(val)
    }
  }
}
</script>
```
</template>
</BorderContent>

:::tip
选中该行后，再次单击可以取消该行的选中;在使用单选功能的时候，要保证每条table数据都有唯一的key。
:::


## 多选

选择多行数据时使用,配合分页使用，效果更佳

<BorderContent @update="update">
<template slot="content">

<template>
  <div>
  <span>已选中: {{selectedTotal}}</span>
  <lin-table :tableColumn="tableColumn"
            :tableData="tableData"
            :type="type"
            :index="index" 
            :pagination="pagination"
            @selection-change="handleSelectionChange"></lin-table>
  </div>          
</template>
</template>

<template slot="introduce">

`type` 设置为 `selection` 即可开启多选功能

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :type="type"
    :pagination="pagination"
    @currentChange="currentChange"
    >
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
      type: 'selection',
      index: 'index',
      pagination: {
        pageSize: 4,
        pageTotal: null
      },
    }
  }
   methods: {
      handleSelectionChange(val) {
        condole.log(val)
      },
   }
}
</script>
```
</template>
</BorderContent>

::: tip
单击 `table` 行即可选中该行的数据，无需选中 `checkbox` ；
在使用多选功能的时候，要保证每条 `table` 数据都有唯一的 `key` 。
:::

## 排序

对表格进行排序，可快速查找或对比数据

<BorderContent @update="update">
<template slot="content">

<template>
  <lin-table :tableColumn="sortTableColumn"
            :tableData="tableData"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"></lin-table>     
</template>
</template>

<template slot="introduce">

在列中设置 `sortable` 属性即可实现以该列为基准的排序，接受一个Boolean，默认为false。也可以通过 `formatter` 使用自定义的排序规则，接受一个 `Function`，会传入两个参数：`row` 和 `column`，可以根据自己的需求进行处理。

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :pagination="pagination">
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
       tableColumn : [
          { prop: 'date', label: '日期', width: '150',sortable: true}, 
          { prop: 'name', label: '姓名', width: '150'},
          { prop: 'province', label: '省份',width: '150'}, 
          { prop: 'city', label: '市区',width: '100' },
          { prop: 'address', label: '地址', width: '300',formatter:this.formatter },
          { prop: 'zip', label: '邮政编码' , width:'150' }, 
        ],
      index: 'index',
       pagination: {
        pageSize: 4,
        pageTotal: null
      },

    }
  }
  methods: {
    // 自定义排序h
    formatter(row, column) {
      return row.address;
    },
  }
}
</script>
```
</template>
</BorderContent>


## 筛选

对表格进行筛选，可快速查找到自己想看的数据

<BorderContent @update="update">
<template slot="content">

<template>
  <lin-table :tableColumn="filterTableColumn"
            :tableData="tableData"
            :pagination="pagination"
            @handleCurrentChange="handleCurrentChange"
            ></lin-table>     
</template>
</template>

<template slot="introduce">

在列中设置 `filters` 和 `filter-method` 属性即可开启该列的筛选，`filters` 是一个数组，`filter-method` 是一个方法，它用于决定某些数据是否显示，会传入三个参数：`value`, `row` 和 `column`。

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :pagination="pagination"
   >
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
        filterTableColumn : [
          {
            prop: 'date', label: '日期', width: '150', 
            filters:[
              {text: '2016-05-01', value: '2016-05-01'}, 
              {text: '2016-05-02', value: '2016-05-02'},
              {text: '2016-05-03', value: '2016-05-03'},
              {text: '2016-05-04', value: '2016-05-04'}
            ],
            filterMethod: this.filterHandler
          }, 
          { prop: 'name', label: '姓名', width: '150'},
          { prop: 'province', label: '省份',width: '150'}, 
          { prop: 'city', label: '市区',width: '100' },
          { prop: 'address', label: '地址', width: '300', formatter:this.formatter },
          { prop: 'zip', label: '邮政编码' , width:'150' }, 
        ],
        pagination: {
          pageSize: 4,
          pageTotal: null
        },
    }
  }
  methods: {
    // 筛选
    formatter(row, column) {
      return row.address;
    },
    filterHandler(value, row, column) {
      const filteredValue = column.filteredValue
      const columnKey = column.columnKey
      const total = this.tableData.filter(item => filteredValue.includes(item[columnKey]))
      // 重新设置分页
      this.$set(this.pagination, 'pageTotal', total.length) 
      const property = column['property'];
      return row[property] === value;
    }
  }
}
</script>
```
</template>
</BorderContent>

:::tip
如果没有用到分页功能，`filterHandler` 只需要写 `const property = column['property']` 和 `return row[property] === value` 即可。
:::

## 拖拽

通过拖拽来排序

<BorderContent @update="update">
<template slot="content">

<template>
  <lin-table :tableColumn="tableColumn"
             :tableData="tableData"
            :pagination="pagination"
            drag
            @getDragData="getDragData"
            @handleCurrentChange="handleCurrentChange"
            ></lin-table>
</template>
</template>

<template slot="introduce">

设置 `drag` 属性即可开启拖拽功能，它接收一个 `Boolean`类型的值， 可通过监听 `getDragData` 函数来获取拖拽行为，该函数的返回参数为一个 `Object`, 包含如下信息：`dragData` 拖拽后当前页重新排列的数据, `oldIndex` 被拖拽行的索引值, `newIndex` 拖拽目标行的索引值。

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :pagination="pagination"
    drag
    @getDragData="getDragData"
    @handleCurrentChange="handleCurrentChange
   >
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
        pagination: {
          pageSize: 4,
          pageTotal: null
        },
    }
  }
  methods: {
    // 拖拽
    getDragData(val) {
      console.log(val.dragData) // 拖拽后当前页重新排列的数据
      console.log(val,oldIndex) // 被拖拽行的索引值
      console.log(val,newIndex) // 拖拽目标行的索引值
    }  
  }
}
</script>
```
</template>
</BorderContent>

## 数据导出

支持导出excel和csv

<BorderContent @update="update">
<template slot="content">

<template>
  <lin-table :tableColumn="tableColumn"
             :tableData="tableData"
            :pagination="pagination"
            ref="linTable"
            @getDragData="getDragData"
            @handleCurrentChange="handleCurrentChange"
            ></lin-table>
</template>
</template>

<template slot="introduce">

`lin-table` 内置了 `exportExcel` 和 `exportCsv` 两种方法用来导出 `excel`和 `csv` 两种格式的数据，可以通过 `ref` 来调用, 如: `this.$refs.linTable.exportExcel()` 导出 `Excel`。

</template>

<template slot="code">

```vue
<template>
  <lin-table 
    :tableColumn="tableColumn"
    :tableData="tableData"
    :pagination="pagination"
    ref="linTable"
    @getDragData="getDragData"
    @handleCurrentChange="handleCurrentChange
   >
  </lin-table>
</template>

<script>
export default {
  data () {
    return {
        pagination: {
          pageSize: 4,
          pageTotal: null
        },
    }
  }
}
</script>
```
</template>
</BorderContent>

数据的导出效果，请移步demo地址：[http://face.cms.7yue.pro/#/table](http://face.cms.7yue.pro/#/table)

## 自定义列模板

关于自定义模版的使用，如行内编辑、单元格编辑、定制列、数据导出、拖拽等使用方法，请参考demo地址：[http://face.cms.7yue.pro/#/table](http://face.cms.7yue.pro/#/table)

<!-- ## 行内编辑

可在行内直接进行内容编辑

<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="province"
      label="省份"
      width="120"
      :show-overflow-tooltip="true">
    </el-table-column>
   <el-table-column min-width="300px" label="地址">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.address" class="edit-input" size="small"/>
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">cancel</el-button>
          </template>
          <span v-else>{{ scope.row.address }}</span>
        </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
         <el-button v-if="scope.row.edit" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(scope.row)">Ok</el-button>
          <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="scope.row.edit=!scope.row.edit">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
</template> -->

<RightMenu ref="rightMenu" v-if="reload" />