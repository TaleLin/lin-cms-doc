---
title: 按键 Button
---

<script>
export default {
    data () {
        return {
            loading: false,
            reload:true,
            tableColumn: [
                { prop: 'params', label: '参数', width: '120'}, 
                { prop: 'introduce', label: '说明', width: '170'},
                { prop: 'type', label: '类型',width: '108'}, 
                { prop: 'value', label: '可选值',width: '300' },
                { prop: 'defaultValue', label: '默认值', width: '200' },
            ],
            tableData:[
                {
                    params:'type',
                    introduce:'类型',
                    type:'String',
                    value:'primary / success / reverse / danger',
                    defaultValue: '-'
                },
                 {
                    params:'plain',
                    introduce:'是否朴素按钮',
                    type:'Boolean',
                    value:'-',
                    defaultValue: 'false'
                },
                 {
                    params:'circle',
                    introduce:'是否圆形按钮',
                    type:'Boolean',
                    value:'-',
                    defaultValue: 'false'
                },
                 {
                    params:'loading',
                    introduce:'是否加载中状态',
                    type:'Boolean',
                    value:'-',
                    defaultValue: 'false'
                },
                 {
                    params:'disabled',
                    introduce:'是否禁用状态',
                    type:'Boolean',
                    value:'-',
                    defaultValue: 'false'
                },
                 {
                    params:'ripple',
                    introduce:'是否开启水波动画',
                    type:'Boolean',
                    value:'-',
                    defaultValue: 'true'
                },
                {
                    params:'icon',
                    introduce:'图标类名',
                    type:'String',
                    value:'-',
                    defaultValue: '-'
                },
                {
                    params:'iconPosition',
                    introduce:'图标位置',
                    type:'String',
                    value:'left / right',
                    defaultValue: 'left'
                },
        ]
        }
    },
    methods: {
        setLoading() {
            this.loading = !this.loading
        },
         update() {
        this.reload = false
        this.$nextTick( () => {
          this.reload = true
        })
      },
    }
}
</script>

# Button 按钮

常用的操作按钮

:::tip
位置：`src/base/button/lin-button.vue`
:::

## 基础用法

<BorderContent @update="update">
<template slot="content">

<template>
   <div>
    <el-row>
    <el-tag type="success" style="margin-right:10px;">常规按钮</el-tag>
     <l-button type="primary" >主要按钮</l-button>
     <l-button type="success">成功按钮</l-button>
     <l-button type="reverse">反向按钮</l-button>
     <l-button type="danger">危险按钮</l-button>
    </el-row>
     <el-row style="margin-top:10px;margin-bottom:10px;">
    <el-tag type="reverse" style="margin-right:10px;">线框按钮</el-tag>
     <l-button type="primary" plain>主要按钮</l-button>
     <l-button type="success" plain>成功按钮</l-button>
     <l-button type="reverse" plain>反向按钮</l-button>
     <l-button type="danger" plain>危险按钮</l-button>
    </el-row>
     <el-row style="margin-top:10px;margin-bottom:10px;">
    <el-tag type="danger" style="margin-right:10px;">圆形按钮</el-tag>
     <l-button icon="icon-plus" type="primary" circle></l-button>
     <l-button type="success" icon="icon-search" circle></l-button>
     <l-button type="reverse"  icon="icon-comment" circle></l-button>
     <l-button type="danger"  icon="icon-chrome" circle></l-button>
      <l-button type="primary" icon="icon-heart-fill" plain circle></l-button>
     <l-button type="success" icon="icon-fire" plain circle></l-button>
     <l-button type="reverse"  icon="icon-check" plain circle></l-button>
     <l-button type="danger"  icon="icon-heart" plain circle></l-button>
    </el-row>
   </div>
</template>
</template>

<template slot="introduce">

使用 `type`、`plain`、和 `circle` 属性来定义 `Button` 的样式。

</template>

<template slot="code">

```vue
<template>
    <el-row>
        <el-tag type="success">常规按钮</el-tag>
        <l-button type="primary">主要按钮</l-button>
        <l-button type="success">成功按钮</l-button>
        <l-button type="reverse">反向按钮</l-button>
        <l-button type="danger">危险按钮</l-button>
    </el-row>
    <el-row>
        <el-tag type="reverse">线框按钮</el-tag>
        <l-button type="primary" plain>主要按钮</l-button>
        <l-button type="success" plain>成功按钮</l-button>
        <l-button type="reverse" plain>反向按钮</l-button>
        <l-button type="danger" plain>危险按钮</l-button>
    </el-row>
    <el-row>
        <el-tag type="danger">圆形按钮</el-tag>
        <l-button icon="settings" circle></l-button>
        <l-button type="success" icon="download" circle></l-button>
        <l-button type="reverse"  icon="down" circle></l-button>
        <l-button type="danger"  icon="thumbs-up" circle></l-button>
        <l-button type="primary" icon="settings" plain circle></l-button>
        <l-button type="success" icon="download" plain circle></l-button>
        <l-button type="reverse"  icon="down" plain circle></l-button>
        <l-button type="danger"  icon="thumbs-up" plain circle></l-button>
    </el-row>
</template>

```
</template>
</BorderContent>

## 禁用状态

按钮不可用状态

<BorderContent @update="update">
<template slot="content">

<template>
   <div>
    <el-row>
     <l-button type="primary" disabled>主要按钮</l-button>
     <l-button type="success" disabled>成功按钮</l-button>
     <l-button type="reverse" disabled>反向按钮</l-button>
     <l-button type="danger" disabled>危险按钮</l-button>
    </el-row>
    <el-row style="margin-top:10px;margin-bottom:10px;">
     <l-button type="primary" disabled plain>主要按钮</l-button>
     <l-button type="success" disabled plain>成功按钮</l-button>
     <l-button type="reverse" disabled plain>反向按钮</l-button>
     <l-button type="danger" disabled plain>危险按钮</l-button>
    </el-row>
   </div>
</template>
</template>

<template slot="introduce">

你可以使用 `disabled` 属性来定义按钮是否可用，它接受一个 `Boolean`值。

</template>

<template slot="code">

```vue
<template>
    <el-row>
        <l-button type="primary" disabled>主要按钮</l-button>
        <l-button type="success" disabled>成功按钮</l-button>
        <l-button type="reverse" disabled>反向按钮</l-button>
        <l-button type="danger" disabled>危险按钮</l-button>
    </el-row>
    <el-row>
        <l-button type="primary" disabled plain>主要按钮</l-button>
        <l-button type="success" disabled plain>成功按钮</l-button>
        <l-button type="reverse" disabled plain>反向按钮</l-button>
        <l-button type="danger" disabled plain>危险按钮</l-button>
    </el-row>
</template>

```
</template>
</BorderContent>

## 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）

<BorderContent @update="update">
<template slot="content">

<template>
   <div>
    <el-row>
      <l-button type="primary" icon="icon-wrench" >主要按钮</l-button>
        <l-button type="success" icon="icon-wifi" >成功按钮</l-button>
        <l-button type="reverse"  icon="icon-heart" icon-position="right">反向按钮</l-button>
        <l-button type="danger"  icon="icon-edit" icon-position="right">危险按钮</l-button>
    </el-row>
    <el-row style="margin-top:10px;margin-bottom:10px;">
        <l-button type="primary" icon="icon-sound" plain>主要按钮</l-button>
        <l-button type="success" icon="icon-cloud" plain>成功按钮</l-button>
        <l-button type="reverse"  icon="icon-scan" plain icon-position="right">反向按钮</l-button>
        <l-button type="danger"  icon="icon-folder-add" plain icon-position="right">危险按钮</l-button>
    </el-row>
   </div>
</template>
</template>

<template slot="introduce">

设置 `icon` 属性即可，`icon` 的列表可以参考 `icon` 组件，也可以设置在文字右边的 `icon` ，只要设置 `icon-position`即可。

</template>

<template slot="code">

```vue
<template>
    <el-row>
      <l-button type="primary" icon="settings" >主要按钮</l-button>
        <l-button type="success" icon="download" >成功按钮</l-button>
        <l-button type="reverse"  icon="down" icon-position="right">反向按钮</l-button>
        <l-button type="danger"  icon="thumbs-up" icon-position="right">危险按钮</l-button>
    </el-row>
    <el-row>
        <l-button type="primary" icon="settings" plain>主要按钮</l-button>
        <l-button type="success" icon="download" plain>成功按钮</l-button>
        <l-button type="reverse"  icon="down" plain icon-position="right">反向按钮</l-button>
        <l-button type="danger"  icon="thumbs-up" plain icon-position="right">危险按钮</l-button>
    </el-row>
</template>

```
</template>
</BorderContent>

## 加载中

点击按钮后进行数据加载操作，在按钮上显示加载状态。

<BorderContent @update="update">
<template slot="content">

<template>
   <div>
      <l-button type="primary" :loading="loading" @click="setLoading()">加载</l-button>
   </div>
</template>
</template>

<template slot="introduce">

要设置为 `loading` 状态，只要设置 `loading` 属性为 `true` 即可。

</template>

<template slot="code">

```vue
<template>
     <div>
      <l-button type="primary" :loading="loading" @click="setLoading()">加载</l-button>
   </div>
</template>

<script>
    data () {
        return {
            loading: false
        }
    },
    methods: {
        setLoading() {
            this.loading = !this.loading
        }
    }
</script>

```
</template>
</BorderContent>


## 按钮组

以按钮组的方式出现，常用于多项类似操作。。

<BorderContent @update="update">
<template slot="content">

<template>
   <div>
      <l-button-group>
        <l-button type="primary" icon="icon-left">上一页</l-button>
        <l-button type="primary" icon="icon-right" icon-position="right">下一页</l-button>
    </l-button-group>
    <l-button-group>
        <l-button type="primary" icon="icon-star"></l-button>
        <l-button type="primary" icon="icon-cloud-upload"></l-button>
        <l-button type="primary" icon="icon-like"></l-button>
    </l-button-group>
   </div>
</template>
</template>

<template slot="introduce">

使用 `<l-button-group>`c标签来嵌套你的按钮。。

</template>

<template slot="code">

```vue
<template>
    <div>
      <l-button-group>
        <l-button type="primary" icon="icon-left">上一页</l-button>
        <l-button type="primary" icon="icon-right" icon-position="right">下一页</l-button>
     </l-button-group>
     <l-button-group>
        <l-button type="primary" icon="icon-star"></l-button>
        <l-button type="primary" icon="icon-cloud-upload"></l-button>
        <l-button type="primary" icon="icon-like"></l-button>
      </l-button-group>
   </div>
</template>

```
</template>
</BorderContent>

## Attributes

<template>
   <lin-table :tableColumn="tableColumn"
            :tableData="tableData"
          ></lin-table>
</template>

<RightMenu ref="rightMenu" v-if="reload" />
