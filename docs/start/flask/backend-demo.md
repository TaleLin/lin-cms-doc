---
title: 后端快速上手
---

# <H2Icon /> 后端快速上手

接下来，我们将开始一个简单的图书项目，来帮你熟悉整个项目的开发流程。

`Lin-CMS-Flask`提供的图书代码是帮助开发者熟悉框架的 demo 样例，现在你可以按如下步骤将它直接删除：

1. 删除 app/api/v1
2. 删除 app/app.py 中的两行代码

```python
...
    from app.api.v1 import create_v1

    app.register_blueprint(create_v1(), url_prefix="/v1")
...
```

好了，现在让我们重新出发。

## 视图控制

创建并打开 `app/api/v1` 文件夹，新建 `book.py` 文件。

接着，我们从 `Lin` 从导入红图来创建 API 视图：

```python
from lin.redprint import Redprint
```

而后，初始化一个名为 `book_api` 的红图，并创建一个视图函数`get_book`：

:::warning
请记住此处视图函数所代表的意思，在后续的章节中它会非常重要！！！
:::

```python
book_api = Redprint('book')


@book_api.route('/<id>', methods=['GET'])
def get_book(id):
    return {
        'msg': 'hello, I am a book'
    }
```

> **Tips:**
> Flask 1.1.1 之后可以直接返回`dict`, 不需要再使用`jsonify(...)`(当然调用也不会报错)。

如果你熟悉 Flask，应该可以发现这与 Flask 的 API 开发几乎一致，不过我们提供了一个红图的机制，让 API 的开发更加细粒度化。

到此一个简单的图书 API 开发就实现了，但是我们此时运行程序并不能访问到该 API。我们还需要将该红图挂载到项目的默认 API 蓝图上。

创建 `app/api/v1/__init__.py` 文件，向其中添加如下内容：

```py
from flask import Blueprint
from app.api.v1 import book

def create_v1():
    bp_v1 = Blueprint('v1', __name__)
    book.book_api.register(bp_v1)
    return bp_v1
```

最后，在`app/app.py`中，向`app`注册 `bp_v1` 蓝图。

还记得我们删除的那两行代码么，把它们写到下面的函数中：

```python
def register_blueprints(app):
    from app.api.cms import create_cms
    # 引入 v1 蓝图
    from app.api.v1 import create_v1
    # 注册 v1 蓝图
    app.register_blueprint(create_v1(), url_prefix="/v1")
    app.register_blueprint(create_cms(), url_prefix="/cms")
```

现在，我们已经可以通过 HTTP 请求到该 API 了，运行服务:

```bash
flask run
```

> **Tips:** 在请求测试接口时，请确认服务处于正常运行状态，后面不再赘述。

然后通过 选择一种请求测试工具，如 curl、httpie、postman 或者浏览器，访问 `http://127.0.0.1:5000/v1/book/1`。

如果一切顺利，你就可以在 terminal 中看到下面返回数据：

```py
{
  "msg": "hello, I am a book"
}
```

## 数据库模型使用

进入 `app/model/v1` 文件夹，在 `book.py` 文件中，查看以下内容：

```py
from lin.interface import InfoCrud
from sqlalchemy import Column, Integer, String


class Book(InfoCrud):
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    author = Column(String(30), default="未名")
    summary = Column(String(1000))
    image = Column(String(100))
```

这是已经完成的 `Book` Model，该模型继承自 `InfoCrud`，有关于 `InfoCrud` 的详细，将在[后续](../server/authority_and_models.md##InfoCrud和BaseCrud)详细介绍，本章我们注重于 CMS 的开发使用。

下面，我们继续完善 `app/api/v1/book.py` 下的 `get_book` 函数，在上一步中，我们只是简单的返回了一条信息，但是在真正的开发中，数据库几乎是任何应用都摆脱不了的一环。

我们重写 `get_book` 函数，顺便引入相关依赖：

```py
from lin.redprint import Redprint
from lin.exception import NotFound
from app.model.v1.book import Book

book_api = Redprint('book')


@book_api.route('/<id>')
def get_book(id):
    # 通过Book模型在数据库中查询id=`id`, 且没有被软删除的书籍
    book = Book.query.filter_by(id=id, delete_time=None).first()
    if book:
        return book # 如果存在，返回该数据的信息
    raise NotFound('没有找到相关书籍') # 如果书籍不存在，返回一个异常给前端
```

> **Tips:**
>
> 现在，直接返回数据库的模型实例，也可以在返回响应时被自动序列化了。
>
> 异常类允许直接传入告警文字或数字作为参数，新版本的异常新增了多项功能，我们将在[异常](../server/exceptin.md)详细介绍。

在上面重写的 `book.py` 文件中，我们使用到了 `flask-sqlalchemy` 提供的便捷查询 API，详细使用请参考[官网](http://flask-sqlalchemy.pocoo.org/2.3/)。

通过 curl 再次访问`http://127.0.0.1:5000/v1/book/2`，我们会得到如下响应：

```json
{ "code": 10021, "message": "没有找到相关书籍", "request": "GET  /v1/book/2" }
```

返回了`NotFound("没有找到相关书籍")`这个异常的响应。 是的，我们没有添加任何图书信息，当然获取不到数据。

运行 `flask db fake` 命令，向数据库中`book`表下添加两条书籍的数据。

> **Tips:** `flask db fake` 也是我们自定义的 flask cli 命令，它位于`app/cli/db/fake.py`, 你可以根据需要修改它。

通过 curl 再次访问`http://127.0.0.1:5000/v1/book/2`，我们会得到如下响应：

```json
{
  "author": "（美）Brian W. Kernighan",
  "create_time": "2020-12-15T08:50:16Z",
  "id": 2,
  "image": "https://img3.doubanio.com/lpic/s1106934.jpg",
  "summary": "\n        在计算机发展的历史上，没有哪一种程序设计语言像C语言这样应用广泛。\n        本书原著即为C语言的设计者之一Dennis M.Ritchie和著名计算机科学家Brian W.Kernighan合著的一本介绍C语言的权威经典著作。\n        我们现在见到的大量论述C语言程序设计的教材和专著均以此书为蓝本。\n        原著第1版中介绍的C语言成为后来广泛使用的C语言版本——标准C的基础。\n        人们熟知的“hello,World\"程序就是由本书首次引入的，现在，这一程序已经成为众多程序设计语言入门的第一课。\n\n        原著第2版根据1987年制定的ANSIC标准做了适当的修订．引入了最新的语言形式，并增加了新的示例，通过简洁的描述、典型的示例，作者全面、系统、准确地讲述了C语言的各个特性以及程序设计的基本方法。\n        对于计算机从业人员来说，《C程序设计语言》是一本必读的程序设计语 言方面的参考书。\n        ",
  "title": "C程序设计语言",
  "update_time": "2020-12-15T08:50:16Z"
}
```

## 参数校验

> **Tips:** > `WTForms`参数校验，暂时请参考 0.2.x 版本的文档，当前文档先补充使用`Pydantic`进行参数校验的方法。

在应用的开发中，尤其是在 Web 领域中，对于任何从用户传入的数据都是无规则可循的，我们无法去预测用户传入的数据，因此参数（数据）校验是开发中不可或缺的一环。

访问`http://127.0.0.1:5000/v1/book/a`，我们会得到如下响应：

```json
{ "code": 10021, "message": "没有找到相关书籍", "request": "GET  /v1/book/1" }
```

按照现在的写法，这个响应是没有问题的，但如果我们期望传入的路径参数`id` 必须是整型数字，该怎么做呢?

将装饰器修改为

```python
    ....
@book_api.route('/<int:id>')
    ....
```

再次访问`http://127.0.0.1:5000/v1/book/a`，我们会得到如下报错：

```json
{
  "code": 20000,
  "message": "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.",
  "request": "GET  /v1/book/a"
}
```

告知我们传入请求 url 不存在。

当然访问`http://127.0.0.1:5000/v1/book/1`，依旧返回正确的图书数据，这里我们就不演示了。

路径参数可以由 Flask 自带的规则帮助校验，那其他种类参数如何校验呢？

我们新建 `app/validators/book.py` 文件，向其中*添加*如下内容：

```python
from lin import BaseModel

class BookQuerySearchSchema(BaseModel):
    q: str
```

> **Tips:** 我们对`BaseModel`做了一些更改，请从`lin`中引入。

我们新建了一个 `BookQuerySearchSchema` 的校验类，当前端传入数据时必须携带 `q` 这个参数，它被用来查询书籍。

然后，我们在 `app/api/v1/book.py` 文件中新增一个视图函数 `search_book`:

```python
from app.validator.book import BookQuerySearchSchema
from flask import g
from app.api import api

@book_api.route('/search', methods=['GET'])
# 使用校验，需要引入定义好的对象`api`,它是Spectree的一个实例
# query代表来自url中的参数，如`http://127.0.0.1:5000?q=abc&page=1`中的 `q` 和 `page`都属于query参数
@api.validate(query=BookQuerySearchSchema)
def search_book():
    # 使用这种方式校验通过的参数将会被挂载到g的对应属性上，方便直接取用。
    q = '%' + g.q + '%' # 取出参数中的`q`参数，加`%`进行模糊查询
    books = Book.query.filter(Book.title.like(q), delete_time==None).all() # 搜索书籍标题
    if books:
        return books
    raise NotFound('没有找到相关书籍')
```

最后，访问 `http://127.0.0.1:5000/v1/book/search`，我们会得到如下响应：

```py
{"code": 10030, "message": {"q": ["field required"]}, "request": "GET  /v1/book/search"}
```

很明显我们未输入参数 `q`，因此校验未通过。我们修改 url 为 `http://127.0.0.1:5000/v1/book/search?q=C`，会得到如下数据：

```json
[
  {
    "author": "（美）Brian W. Kernighan",
    "create_time": "2020-12-15T08:50:16Z",
    "id": 2,
    "image": "https://img3.doubanio.com/lpic/s1106934.jpg",
    "summary": "\n        在计算机发展的历史上，没有哪一种程序设计语言像C语言这样应用广泛。\n        本书原著即为C语言的设计者之一Dennis M.Ritchie和著名计算机科学家Brian W.Kernighan合著的一本介绍C语言的权威经典著作。\n        我们现在见到的大量论述C语言程序设计的教材和专著均以此书为蓝本。\n        原著第1版中介绍的C语言成为后来广泛使用的C语言版本——标准C的基础。\n        人们熟知的“hello,World\"程序就是由本书首次引入的，现在，这一程序已经成为众多程序设计语言入门的第一课。\n\n        原著第2版根据1987年制定的ANSIC标准做了适当的修订．引入了最新的语言形式，并增加了新的示例，通过简洁的描述、典型的示例，作者全面、系统、准确地讲述了C语言的各个特性以及程序设计的基本方法。\n        对于计算机从业人员来说，《C程序设计语言》是一本必读的程序设计语 言方面的参考书。\n        ",
    "title": "C程序设计语言",
    "update_time": "2020-12-15T08:50:16Z"
  }
]
```

## 完善 API

上面，我们陆续地完成了查询图书和搜索图书两个 API，此处我们再补上创建、更新、删除和获取所有图书这四个 API, 顺便熟悉一下`lin-cms`提供的 ORM 便捷操作。

- 创建图书

在 `app/validators/book.py` 文件中*追加*如下内容：

```python
class BookSchema(BaseModel):
title: str
author: str
image: str
summary: str
```

在`app/api/v1/book.py`中追加:

```python
from app.validator.book import BookSchema
from flask import request
from lin.exception import Success


@book_api.route("", methods=["POST"])
# json代表来自请求体body中的参数
@api.validate(json=BookSchema)
def create_book():
    # 请求体的json 数据位于 request.context.json
    book_schema = request.context.json
    Book.create(**book_schema.dict(), commit=True)
    # 12 是 消息码
    return Success(12)
```

- 更新图书

在`app/api/v1/book.py`中追加:

```python
@book_api.route("/<int:id>", methods=["PUT"])
@api.validate(json=BookSchema)
def update_book(id: int):
    book_schema = request.context.json
    book = Book.get(id=id)
    if book:
        book.update(
            id=id,
            **book_schema.dict(),
            commit=True,
        )
        return Success(13)
    raise NotFound(10020)
```

- 删除图书

在`app/api/v1/book.py`中追加:

```python
@book_api.route("/<int:id>", methods=["DELETE"])
def delete_book(id: int):
    """
    传入id删除对应图书
    """
    book = Book.get(id=id)
    if book:
        # 删除图书，软删除
        book.delete(commit=True)
        return Success(14)
    raise NotFound(10020
```

- 获取所有图书

在`app/api/v1/book.py`中追加:

```python
@book_api.route("")
def get_books():
    """
    获取图书列表
    """
    return Book.get(one=False
```

我们完成了一个关于图书 CRUD 的简单 demo，事实上很多应用都是重复如此操作，希望你能熟练掌握这套流程。

## 小结

到此，我们运行了示例的工程项目，并通过 `starter` 完成了一个简单的图书 API 的开发，我们使用了如下几点：

- 使用红图细粒度的创建 API

| url             |      description      | method |
| --------------- | :-------------------: | :----: |
| /v1/book/:id    |  查询指定 id 的书籍   |  GET   |
| /v1/book/:id    |  更新指定 id 的书籍   |  PUT   |
| /v1/book/:id    |  删除指定 id 的书籍   | DELETE |
| /v1/book/search | 根据关键字`q`搜索书籍 |  GET   |
| /v1/book/       |       创建图书        |  POST  |
| /v1/book/       |     获取所有图书      |  GET   |

- 使用 Model 层创建和查询数据
- 使用 WTForms 来校验参数
- 继承 APIException 来自定义异常

当然在本章中，我们只是一个快速上手的指导，如果你熟悉 `Flask` 及其生态，那么你完全可以按照此种模式开发自己的应用，[后续](../server/README.md)我们会讨论项目开发的基础约定和流程。

后端开发完成！[移步前端部分？](./frontend-demo.md)

<RightMenu />
