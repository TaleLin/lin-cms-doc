---
title: 后端快速上手
---

# <H2Icon /> 后端快速上手

接下来，我们将开始一个简单的图书项目，来帮你熟悉整个项目的开发流程。

## 视图控制

打开 `app/api/v1` 文件夹，在该文件夹里新建 `book.js` 文件。我们从 `lin-mizar` 中
导入 LinRouter 来创建 API 视图：

```js
import { LinRouter } from 'lin-mizar';
```

:::tip

项目已经配置了 babel，因此可以直接使用 ECMAScript 6 Modules 来替换 CommonJS 模块。

:::

而后，初始化一个名为 `bookApi` 的 Router，并创建一个匿名视图函数：

:::warning

请记住此处视图函数所代表的意思，在后续的章节中它会非常重要！！！严格上来说，koa
的中间件机制是没有严格意义上的视图函数的，但是我们仍然希望通过这种概念来区分普通
中间件和真正的视图函数。

:::

```js
import { LinRouter } from 'lin-mizar';

const bookApi = new LinRouter({
  prefix: "/v1/book",
  module: '图书'
});

bookApi.get("/:id", async ctx => {
  ctx.json({
    message: "hello, I am a book"
  });
});
```

如果你熟悉 koa 或者 koa-router，应该可以发现这与 koa 的 API 开发几乎一致，不过我
们提供了一个 LinRouter，它实际上继承了 koa-router，并提供了更多的方法来帮助我们
进行权限管理。

到此一个简单的图书 API 开发就实现了，但是我们此时运行程序并不能访问到该 API。得
益于 Lin loader 的便利，我们只需要在当前模块导出`bookApi`，即可自动挂载到主路由
上。

```js
export { bookApi };
```

现在，我们已经可以通过 HTTP 请求到该 API 了，运行程序。然后通过 curl(你可以使用
任何你喜爱的测试工具，postman 甚至浏览器都行)访问
`http://127.0.0.1:5000/v1/book/1`。

如果一切顺利，你就可以在 terminal 中看到下面返回数据：

```json
{
  "message": "hello, I am a book"
}
```

## 模型使用

打开 `app/models` 文件夹，在该文件夹下新建 `book.js` 文件，并加入以下内容：

```js
import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../libs/db';

class Book extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      title: this.title,
      author: this.author,
      summary: this.summary,
      image: this.image
    };
    return origin;
  }
}

Book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    author: {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: '未名'
    },
    summary: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    image: {
      type: Sequelize.STRING(100),
      allowNull: true
    }
  },
  merge(
    {
      tableName: 'book',
      modelName: 'book',
      sequelize
    },
    InfoCrudMixin.options
  )
);

export { Book };
```

我们新建了一个 `Book` 的 Model，该模型混入了 `InfoCrudMixin`，有关于
`InfoCrudMixin` 的详细信息，将
在[后续](../../server/koa/authority_model.md##InfoCrudMixin)详细介绍，本章我们注
重于 CMS 的开发使用。

:::tip

这里我们还在`Book.prototype`上定义了一个`toJSON`函数。我们推荐你为每一个模型类定
义一个属于自己的 toJSON 函数，它会在 json 序列化的时候提供巨大的便利。

js 会在 JSON.stringfy()的时候默认的调用类的 toJSON 函数。在 koa 中，当我们对
ctx.body 进行赋值时，尤其是使 body 等于某个模型时，koa 会对模型默认调用 stringfy
函数，因此我们可以在 toJSON 函数中定义你需要传输到前端的模型数据。

:::

有了该模型后，修改 test/helper/initial.js 下的 secure 路径为 `('../../app/config/secure')`
我们打开 test/helper 目录下的 `fake-book` 文件夹，并运行
`fake-book` 文件加下的 `index.js`，如果你的操作正确，你的数据库将会在多出两条书籍的数据。

```bash
node test/helper/fake-book
```

下面，我们继续完善 `app/api/v1/book.js` 下的匿名视图函数，在上一步中，我们只是简
单的返回了一条信息，但是在真正的开发中，数据库几乎是任何应用都摆脱不了的一环。

我们重写函数：

```js
const { LinRouter } = require("lin-mizar");
const { Book } = require("../../models/book");
const { getSafeParamId } = require("../../libs/util");

const bookApi = new LinRouter({
  prefix: "/v1/book"
});

bookApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const book = await bookDto.getBook(id);
  if (!book) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(book);
});

export { bookApi };
```

在上面重写的 `book.js` 文件中，我们使用到了 `sequelize` 提供的便捷查询 API，详细
使用请参考[官网](http://docs.sequelizejs.com/)。

至此，我们再次运行根目录下的 `starter.js` 文件，并通过 curl 再次访
问`http://127.0.0.1:5000/v1/book/1`，我们会得到如下数据：

```bash
{
  "author": "Randal E.Bryant",
  "id": 1,
  "image": "https://img3.doubanio.com/lpic/s1470003.jpg",
  "summary": "********"
}
```

:::tip

请记住，如果你没有 sequelize 的任何基础，甚至没有任何 orm 的使用经历，我们强烈建
议你学习一下 sequelize 的使用。

:::

## 参数校验

在应用的开发中，尤其是在 Web 领域中，对于任何从用户传入的数据都是无规则可循的，
我们无法去预测用户传入的数据，因此参数(数据)校验是开发中不可或缺的一环。

我们打开 `app/validators/book.js` 文件，向其中*添加*如下内容：

```js
# ********
# ********

class BookSearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule("isNotEmpty", "必须传入搜索关键字");
  }
}

export { BookSearchValidator };
```

我们新建了一个 `BookSearchValidator` 的校验类，当前端传入数据时必须携带 `q` 这个
参数，它被用来查询书籍。

然后，我们在 `app/api/v1/book.js` 文件中新增一个视图函数用来搜索图书:

```js
import { Op } = from "sequelize";

bookApi.get("/search/one", async ctx => {
  const v = await new BookSearchValidator().validate(ctx);
  const book = await Book.findOne({
    where: {
      title: {
        [Op.like]: `%${v.get("query.q")}%`
      }
    }
  });
  if (!book) {
    throw new NotFound({ code: 10022 });
  }
  ctx.json(book);
});
```

最后，我们再次运行根目录下的 `index.js` 文件，并通过 curl 再次访问
`http://127.0.0.1:5000/v1/book/search/one`，我们会得到如下数据：

```json
{
  "code": 10030,
  "message": "必须传入搜索关键字",
  "request": "GET /v1/book/search/one"
}
```

很明显我们未输入参数 `q`，因此校验未通过。我们修改 url 为
`http://127.0.0.1:5000/v1/book/search/one?q=C`，会得到如下数据：

```json
{
  "author": "（美）Brian W. Kernighan",
  "id": 2,
  "image": "https://img3.doubanio.com/lpic/s1106934.jpg",
  "summary": "在计算机发展的历史上，没有哪一种程序设计语言像C语言这样应用广泛。本书原著即为C语言的设计者之一Dennis M.Ritchie和著名计算机科学家Brian W.Kernighan合著的一本介绍C语言的权威经典著作。我们现在见到的大量论述C语言程序设计的教材和专著均以此书为蓝本。原著第1版中介绍的C语言成为后来广泛使用的C语言版本——标准C的基础。人们熟知的“hello,World\"程序就是由本书首次引入的，现在，这一程序已经成为众多程序设计语言入门的第一课。\n原著第2版根据1987年制定的ANSIC标准做了适当的修订．引入了最新的语言形式，并增加了新的示例，通过简洁的描述、典型的示例，作者全面、系统、准确地讲述了C语言的各个特性以及程序设计的基本方法。对于计算机从业人员来说，《C程序设计语言》是一本必读的程序设计语 言方面的参考书。",
  "title": "C程序设计语言"
}
```

一般情况下，我们都推荐使用校验器来对参数进行校验，因为校验器具有良好的扩展性。当
然你觉得每次定义一个校验器较为麻烦，你也可以定义如`getSafeParamId`这样的帮助函数
来进行少量参数的校验。

## 自定义异常

在刚才的图书搜索 API 中，当程序没有找到相关的书籍时，会抛出一个 `NotFound` 的异
常。`NotFound` 是 Lin 基础库提供的一种异常，现在有如下需求：我们需要自定义一个
`BookNotFound` 的异常来专门表示图书未找到。打开 `app/libs/exception.js`，在其中添
加如下内容：

```js
import { HttpException, config } from 'lin-mizar';

const CodeMessage = config.getItem('codeMessage', {});

/**
 * 自定义异常类
 */
class BookNotFound extends HttpException {
  constructor (ex) {
    super();
    this.status = 404;
    this.code = 10022;
    this.message = CodeMessage.getMessage(10022);
    this.exceptionHandler(ex);
  }
}

export { BookNotFound };
```

:::warning

`BookNotFound`异常继承自`HttpException`，所有继承自`HttpException`的子类异常均会
被框架的异常处理机制所捕捉到，并以固定的信息结构返回给前端，方便前端快速捕捉错误
。在`status`、`message`和`code`中，message 和 code message 能直接的告诉
前端错误信息，code 可以让前端快速判断是何种异常。因此 code 和 message 都应该统一定义，
在 `app/config/code-message.js` 中进行定义。

:::

然后更改图书搜索未找到图书的异常：

```js
import { Op } from "sequelize";
import { BookNotFound } from '../../libs/exception';

# *******

bookApi.get("/search/one", async ctx => {
  const v = await new BookSearchValidator().validate(ctx);
  const book = await Book.findOne({
    where: {
      title: {
        [Op.like]: `%${v.get("query.q")}%`
      }
    }
  });
  if (!book) {
    throw new BookNotFound();
  }
  ctx.json(book);
});
```

再次运行程序，通过 curl 访问`http://127.0.0.1:5000/v1/book/search/one?q=123`，如果未找到图书，则前端会得到如下提示信息：

```json
{
  "code": 10022,
  "message": "未找到相关书籍",
  "url": "GET /v1/book/search/one?q=123"
}
```

## 完善 API

上面，我们陆续地完成了查询图书和搜索图书两个 API，此处我们再补上创建、更新、删除
和获取图书这四个 API。

- 创建图书

```js
bookApi.post("/", async ctx => {
  const v = await new CreateOrUpdateBookValidator().validate(ctx);
  const book = await Book.findOne({
    where: {
      title: v.get("body.title")
    }
  });
  if (book) {
    throw new Forbidden({
      code: 10240
    });
  }
  const bk = new Book();
  bk.title = v.get("body.title");
  bk.author = v.get("body.author");
  bk.summary = v.get("body.summary");
  bk.image = v.get("body.image");
  bk.save();
  ctx.success({
    code: 12
  });
});
```

- 更新图书

```js
bookApi.put("/:id", async ctx => {
  const v = await new CreateOrUpdateBookValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  const book = await Book.findById(id);
  if (!book) {
    throw new NotFound({
      code: 10022
    });
  }
  book.title = v.get("body.title");
  book.author = v.get("body.author");
  book.summary = v.get("body.summary");
  book.image = v.get("body.image");
  book.save();
  ctx.success({
    code: 13
  });
});
```

- 删除图书

```js
bookApi.linDelete(
  "deleteBook",
  "/:id",
  bookApi.permission('删除图书'),
  async ctx => {
    const id = getSafeParamId(ctx);
    const book = await Book.findOne({
      where: {
        id
      }
    });
    if (!book) {
      throw new NotFound({
        code: 10022
      });
    }
    book.destroy();
    ctx.success({
      code: 14
    });
  }
);
```

- 获取所有图书

```js
bookApi.get("/", async ctx => {
  const books = await Book.findAll();
  if (books.length < 1) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(books);
});
```

我们完成了一个关于图书 CRUD 的简单 demo，事实上很多应用都是重复如此操作，希望你
能熟练掌握这套流程。

详细代码参考示例项
目[book](https://github.com/TaleLin/lin-cms-koa/blob/master/app/api/v1/book.js)。

## 小结

到此，我们运行了示例的工程项目，并通过 `starter` 完成了一个简单的图书 API 的开发
，我们使用了如下几点：

- 使用红图创建 API

| url                 |      description      | method |
| ------------------- | :-------------------: | :----: |
| /v1/book/:id        |  查询指定 id 的书籍   |  GET   |
| /v1/book/:id        |  更新指定 id 的书籍   |  PUT   |
| /v1/book/:id        |  删除指定 id 的书籍   | DELETE |
| /v1/book/search/one | 根据关键字`q`搜索书籍 |  GET   |
| /v1/book/           |       创建图书        |  POST  |
| /v1/book/           |     获取所有图书      |  GET   |

- 使用 Model 层创建和查询数据
- 使用 LinValidator 来校验参数
- 继承 HttpException 来自定义异常

当然在本章中，我们只是一个快速上手的指导，如果你熟悉 `koa` 及其生态，那么你完全
可以按照此种模式开发自己的应用，[后续](../../server/README.md)我们会讨论项目开发
的基础约定和流程。

后端开发完成！[移步前端部分？](./frontend-demo.md)

<RightMenu />
