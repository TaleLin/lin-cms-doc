---
title: 数据处理
---

## 为什么需要模型层（数据处理）

在 vue 的组件中，我们一般需要在 `created` 或者 `mounted` 中通过 api 来获取需要渲染到视图上的数据，或者在 `methods` 中获取数据，如果把这些逻辑都写在这里，会显得非常冗杂，如果把这部分 api 相关的抽离出来，单独封装，这样可以大大提升代码的可读性与可维护性。下面以 `日志` 这个业务逻辑来说明：

```vue
<script>
import log from 'lin/models/log' // 日志类的实例

export default {
  async created() { // created钩子
      await this.initPage()
  },

  methods: {
      // 页面初始化
      async initPage() {
        try {
          this.users = await log.getLoggedUsers({}) // api请求
          const res = await log.getLogs({ page: 0 }) // api请求
          this.logs = res.collection
        } catch (err) {
          console.error(err)
        }
      },
  }
}
</script>
```

这里的 `log` 是日志类的实例，把所有跟日志相关的 api 封装在 `Log` 这个类中，这里就叫日志模型。在这个 `Log` 类中有很多相关日志获取的方法，如果有业务逻辑变动，只需要修改相关方法即可。我们把每个业务模型独立成一个 js 文件，声明一个类通过其属性和方法来实现这个模型相关的数据获取。

<!-- 通过用户模型采用单例模式来实现，日志模型采用工厂模式来实现，这些设计模式在前端代码中可能表现的没有Java这种面向对象语言那样的具体，但我们仍需要学习并应用。 -->

## 怎么来封装一个模型

我们来假设这样一个场景：有一个图书的后台管理系统，在图书管理这个模块，初始化的时候要看到已经上架的图书，点击图书可以看到详情，可以更改图书的上下架状态，可以删除图书。这其实是服务端典型的增删改查，我们既然采用前后端分离模式，这部分的处理就自然就是前端的职责了。

首先，当前这个业务模型是图书，那就可以创建一个 `Book` 类，管理员对图书的增加、删除、修改、查看这些行为分别对应类中的方法，这里已经有四个方法了。

```js
import { get, post, put, _delete } from '../utils/http'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
export default class Book {
  constructor() {}

  // 类中的方法可以代表一个用户行为
  async addBook(info) {
    const res = await post('v1/book', { info })
    return res
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async editBook(id) {
    const res = await put('v1/book', { id })
    return res
  }

  // static 方法修饰的成员不再属于某个对象，而是属于它所在的类。
  // 只需要通过其类名就可以访问，不需要再消耗资源反复创建对象。
  static async delectBook(id) {
    const res = await _delete(`v1/book/${id}`)
    return res
  }

  async getBooks() {
    const res = await get('v1/book')
    return res
  }
}
```


## 小结

本小节主要还是介绍思想，将设计模式应用到前端代码中来，也是需要我们共同学习的，对于我们程序猿来说写代码是我们的工作，更是一种热爱，怎样让代码更加优雅更加有艺术感是一个长期话题，愿与君共勉。

<RightMenu />
