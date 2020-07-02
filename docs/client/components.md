---
title: 自定义组件
---

## 组件

Lin 框架内置了[element-ui 库](http://element-cn.eleme.io/#/zh-CN/component/installation)，并对一部分组件的样式进行了重写，所有重写的样式都放在 `assets/styles/elementUi.css`文件里。

为了方便开发者开发，Lin 框架自己封装了一些组件，同时对一些常用的`element`组件进行了二次封装，所有封装好的组件都放在`base`文件夹下，下面逐一介绍已经封装好的组件。

### lin-table

如果想渲染一个带操作按键的 table，

<img-wrapper>
   <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/lin-table.jpeg"/>
</img-wrapper>

只需要写以下代码即可：

```vue
<template>
  <lin-table
    :tableColumn="tableColumn"
    :tableData="tableData"
    :operate="operate"
    @handleEdit="handleEdit"
    @handleDelete="handleDelete"
  >
  </lin-table>
</template>

<script>
data () {
  return {
    tableColumn : [{ prop: 'username', label: '名称' }, { prop: 'group_name', label: '所属分组' }] // 设置表头信息
    tableData: [{username: "佩德罗", group_name: "管理员"}, {username: "打酱油", group_name: "管理员"}] // 表格数据
    operate : [{ name: '编辑', func: 'handleEdit', type: 'edit' }, { name: '删除', func: 'handleDelete', type: 'del' }] // 功能区内容 按键
  }
}

handleEdit(val) {
  ...
}

handleDelete(val) {
  ...
}
</script>
```

`operate` 的字段名分别表示：

- name: 按键名称

- type: 按键样式

- func: 按键绑定的函数名称，组件内部已经写好了`handleEdit`、`handleDelete`，点击可以获取到该行的相关数据，如果想要绑定别的函数实现其他功能，可以自己在`lin-table`组件里自己编写绑定函数。

可见，只要传入表头、表格、功能区的数据，就能很方便的渲染出一个表格，这里要注意的是，要保持表头和表格数据字段名的一致性，如 `username` 、`group_name`，否则表格无法正常渲染。如果不需要功能区，operate 可以不传。
