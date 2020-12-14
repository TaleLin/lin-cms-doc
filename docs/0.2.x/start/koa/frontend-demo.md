---
title: 前端快速上手
---

# 快速上手

::: warning
阅读本小节前，请确保你已经完成了[后端快速上手](./backend-demo.md)，根据已经完成的 API 来完成前端页面。

本小节主要目的：让刚接触 lin-cms 的同学，通过这样一个简单的例子，初步了解 lin-cms 的运行机制，比较熟悉的同学可跳过。
:::

想要完成这样一个图书管理 demo，需要以下流程：

- 新建承载内容的页面文件
- 配置访问页面需要的路由
- 通过 API 将数据渲染到页面
- 通过 API 完成添加、删除等用户行为
- 遇到 API 异常及时进行处理

<!-- 一个图书管理模块，首先包括图书列表查看和图书添加功能，我们需要这样两个页面承载，想要访问页面就需要规定相关的路由，通过路由我们访问到了页面，这时候就要获取api数据渲染到页面上，在获取数据的过程中，如果发现异常要及时进行处理。 -->


| url             |      description      | method |
| --------------- | :-------------------: | :----: |
| /v1/book/:id    |  查询指定 id 的书籍   |  GET   |
| /v1/book/:id    |  更新指定 id 的书籍   |  PUT   |
| /v1/book/:id    |  删除指定 id 的书籍   | DELETE |
| /v1/book/       |       创建图书        |  POST  |
| /v1/book/       |     获取所有图书      |  GET   |

## 建立页面

从业务逻辑分析，图书管理需要有图书列表与添加图书两个页面，先新建 `BookAdd.vue和BookList.vue` 两个文件。

位置： `src/views/book/`

PS: 如果对Lin的[目录结构](../../client/catalog.md)不是非常清楚，可以先进行大致浏览。

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/book.png">
</img-wrapper>

## 页面路由

页面想要被访问需要有对应路由，接下来完成图书管理的路由配置：

位置： `src/config/stage/book.js`

```js
const bookRouter = {
  route: null,
  name: null,
  title: '图书管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-demo',
  filePath: 'views/book/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加图书',
      type: 'view',
      name: 'bookAdd',
      route: '/book/add',
      filePath: 'views/book/BookAdd.vue',
      inNav: true,
      icon: 'iconfont icon-demo',
    },
    {
      title: '图书列表',
      type: 'view',
      name: 'bookList',
      route: '/book/list',
      filePath: 'views/book/BookList.vue',
      inNav: true,
    },
  ],
}

export default bookRouter

```

此时，我们只是把图书管理的路由文件建立，接下来需要将数据插入到整个路由树中：

位置： `src/config/stage/index.js`

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/book10.png">
</img-wrapper>

到这里，已经可以看到图书管理的菜单和页面了。

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/book8.png">
</img-wrapper>

## 获取数据

图书列表页面，需要先从 API 获取到数据，并将其渲染到视图中。首选调用查询 API 接口：

位置：`src/view/book/BookList.vue`

```vue
<script>
import book from '@/model/book'

export default {
  data() {
    return {
      tableColumn: [{ prop: 'title', label: '书名' }, { prop: 'author', label: '作者' }],
      tableData: [],
      operate: [],
    }
  },
   async created() {
    this.loading = true
    this.getBooks()
    this.loading = false
  },
  methods: {
    async getBooks() {
      const books = await book.getBooks()
      this.tableData = books
    },
  }
}
</script>
```


那么根据在[模型层](../../client/model.md)中的介绍，将所有与 API 相关的处理，封装到 `model` 下面的一个 `book.js` 文件中。

位置：`src/model/book.js`

```js
import { get } from '@/lin/plugins/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Book {
  async getBooks() {
    const res = await get('v1/book/')
    return res
  }
}
export default new Book()
```
这样通过数据的变更来改变视图，图书列表就可以渲染出来了：

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/book9.png">
</img-wrapper>

## 异常处理

如果在数据获取过程中，遇到异常情况，根据在[异常机制](../../client/exception.md)的介绍，通过 API 返回的不同 `code` 将异常拦截在 `src/lin/utils/exception.js` 这个文件中进行处理，这里就不详细说明了。

## 权限控制

权限的控制有两种：

- 视图层的访问权限，也就是菜单根据权限来显示
- API 的操作权限

具体[权限控制](../../client/authority.md)请参考专门的章节介绍

<!-- 
首先，一个管理员登录后，我们在 vuex 中保存了该管理员的所有权限（超级管理员除外，超级管理员根据身份判断权限），存储在 `store` 中，字段是 `auths` ，所以你可以通过下面的方式来获得：

```vue
<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'auths',
      // ...
    ])
  }
}
</script>
```

auths 的数据结构是一个一维数组：

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/book2.png">
</img-wrapper>

在路由配置文件中添加属性 `right` ：

```js
const bookRouter = {
  route: null,
  name: null,
  title: '图书管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-demo',
  filePath: 'views/book/', // 文件路径
  order: null,
  inNav: true,
  right: ['图书管理']
  children: []
}
```

那么如果当前登录的管理员没有 `图书管理` 权限，则不显示菜单，有权限则显示：

<!-- <img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/book3.png" style="display:inline-block;height:215px;">
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/book4.png" style="display:inline-block;height:215px">
</img-wrapper> -->

<!-- 同样的，api 级别的控制，我们也提供了相应的指令：

```html
<button v-auth="'编辑图书'">编辑</button>
<button v-auth="'删除图书'">删除</button>
```

如果当前登录的管理员没有 `删除图书` 权限，则不显示该 DOM，有权限则显示：

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/book5.png" style="display:inline-block;height:215px;margin-right:10px">
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/book6.png" style="display:inline-block;height:215px">
</img-wrapper> -->

<RightMenu />
