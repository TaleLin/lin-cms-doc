---
title: 图标 Icon
---

<script>
export default {
    data () {
        return {
            loading: false,
            reload:true,
            color: '#3963bc',
            width: '30px',
            height: '30px',
            iconList: [
                'shake',
                'api',
                'fork',
                'dashboard',
                'table',
                'android',
                'apple',
                'windows',
                'chrome',
                'aliwangwang',
                'weibo',
                'twitter',
                'taobao',
                'skype',
                'medium',
                'linkedin',
                'dropbox',
                'facebook',
                'codepen',
                'amazon',
                'google',
                'alipay',
                'zhihu',
                'slack',
                'behance',
                'behance-square',
                'dribbble-square',
             ],
             tableColumn: [
                { prop: 'params', label: '参数', width: '120'}, 
                { prop: 'introduce', label: '说明', width: '170'},
                { prop: 'type', label: '类型',width: '108'}, 
                { prop: 'value', label: '可选值',width: '200' },
                { prop: 'defaultValue', label: '默认值', width: '200' },
            ],
            tableData:[
                {
                    params:'name',
                    introduce:'icon类型',
                    type:'String',
                    value:'-',
                    defaultValue: '-'
                },
                {
                    params:'color',
                    introduce:'颜色',
                    type:'String',
                    value:'-',
                    defaultValue: '#3963bc'
                },
                 {
                    params:'width',
                    introduce:'宽度',
                    type:'String',
                    value:'-',
                    defaultValue: '1.2em'
                },
                 {
                    params:'height',
                    introduce:'高度',
                    type:'String',
                    value:'-',
                    defaultValue: '1.2em'
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

[l-icon](http://dev.f.colorful3.com/#/lin-cms-ui/icon) 集成了 `Antd` 图标,更多的图标请查看[官方图标库](https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.d9df05512&cid=9402)。

:::tip
位置：`src/base/icon/lin-icon.vue`
:::


## 使用方法

通过直接设置类名为 `icon-iconName` 来使用即可例如:

<BorderContent @update="update">
<template slot="content">

<template>
   <div>
     <el-row style="margin-bottom:10px;">
          <el-col
            :span="4"
            v-for="item in iconList"
            :key="item"
            style="margin-bottom:10px;text-align:center;">
            <l-icon
              :name="item"
              :color="color"
              :width="width"
              :height="height"></l-icon>
          </el-col>
        </el-row>
   </div>
</template>
</template>

<template slot="introduce">

通过 `name`、 `color` 、`width` 、`height` 来设置 `icon` 的形状、颜色、长度、高度。

</template>

<template slot="code">

```vue

  <l-icon name="icon-star" color="#aaa" ></l-icon>
  <l-icon name="icon-search" color="#ccc"></l-icon>
  <l-icon name="icon-apple" color="#eee" width="30px" height="30px"></l-icon>

```
</template>
</BorderContent>

## 新增更多图标

如果开发者需要导入自己的 `icon` 图标，先在[iconfot官网](https://www.iconfont.cn/)官网上添加自己需要的图标，切换到`Symbol`选项，把生成的cdn地址通过script标签引入到根目录下的`public/index.html`，即可通过设置类名为 `icon-iconName` 来使用该图标。

## Attributes

<template>
   <lin-table :tableColumn="tableColumn"
            :tableData="tableData"
          ></lin-table>
</template>
