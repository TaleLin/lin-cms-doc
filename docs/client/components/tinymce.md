# 富文本

二次封装富文本-Tinymce, [演示效果](http://face.cms.talelin.com/#/custom/tinymce)

- 开箱即用
- 支持富文本效果实时预览
- 支持富文本源码预览
- 支持拖拽图片上传
- 支持自定义工具栏图标
- 支持部分markdown语法

::: tip
如果使用插入图片功能，需配合后端[文件上传接口](http://doc.cms.talelin.com/lin/server/koa/file.html)使用;图片上传成功后，会以该图片完整的url地址的形式插入到富文本内容当中。
:::

## 基础示例

``` vue
<template>
  <tinymce  @change="change" upload_url="文件存储接口地址" />
</template>

<script>
import Tinymce from '@/components/base/tinymce'

export default {
  components: {
    Tinymce,
  },
  methods: {
    // 监听富文本内容变化
    change(val) {
      console.log(val)
    },
  },
}
</script>
```

## props


参数 | 类型 | 默认值 | 说明
--- | ---| ---| ---|
height| Number | 500 | 富文本高度
width | Number | —— | 富文本宽度
defaultContent | String | —— | 富文本默认内容
upload_url | String | —— | 图片上传地址
showMenubar | Boolean | true | 是否展示左上方的中文菜单栏
toolbar | String | undo redo \| formatselect \| bold italic strikethrough forecolor backcolor formatpainter \| link image \| alignleft aligncenter alignright alignjustify \| numlist bullist outdent indent \| removeformat \| preview fullscreen code | 自定义工具栏图标

## events

方法名 | 参数 | 说明
--- | ---| ---
change| val | 监听富文本的内容变化

::: tip
更多用法请参考[Tinymce](https://www.tiny.cloud/docs/demo/full-featured/)
:::


