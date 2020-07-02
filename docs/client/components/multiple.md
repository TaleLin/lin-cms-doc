## 多重输入框

演示效果：演示效果：[http://face.cms.7yue.pro/#/lin-cms-ui/form/multiple-input](http://face.cms.7yue.pro/#/lin-cms-ui/form/multiple-input)

通过这个 demo 的演示，可以看到类似这种多重信息录入，并且 dom 元素一致的情况，只要定义好数据类型，并且通过下面两个关键 api 就能实现自定义新增与删除。

```js
  addContent() {
    // this.list 的数据结构根据具体业务情况自定义
    this.list.push({
      text: '',
      type: 'plus',
    })
  },
  removeContent(index) {
    this.list.splice(index, 1)
  }
```