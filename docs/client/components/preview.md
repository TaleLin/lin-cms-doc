# 画廊 Gallery

仿照小程序图片预览api, [演示效果](http://face.cms.7yue.pro/#/custom/gallery)

- 挂载到 Vue 实例，开箱即用
- 封装 photoswipe ，可拓展高级应用

## methods

```
this.$imagePreview(options = {})
```

options有三个参数

参数 | 默认值 | 说明
--- | ---| ---
images | 空数组 | 图片的url数组
index | 0 | 预览图片的索引值, 默认是0
defaultOpt | {} | 配置项

defaultOpt 的配置项请参考[photoswipe配置项](http://photoswipe.com/documentation/options.html)，


