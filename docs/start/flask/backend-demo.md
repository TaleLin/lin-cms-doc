---
title: 后端快速上手
---

# <H2Icon /> 后端快速上手

接下来，我们将开始一个简单的图书项目，来帮你熟悉整个项目的开发流程。

`Lin-CMS-Flask`提供的图书代码是帮助开发者熟悉框架的demo样例，现在你可以按如下步骤将它直接删除：

1. 删除 app/api/v1
2. 删除 app/model/v1
3. 删除 app/app.py 中的两行代码
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

```py
from lin.redprint import Redprint
```

而后，初始化一个名为 `book_api` 的红图，并创建一个视图函数`get_book`：

:::warning
请记住此处视图函数所代表的意思，在后续的章节中它会非常重要！！！
:::

```py
from lin.redprint import Redprint

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


def create_blueprint_v1():
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

然后通过 选择一种请求测试工具，如curl、httpie、postman或者浏览器，访问 `http://127.0.0.1:5000/v1/book/1`。

如果一切顺利，你就可以在 terminal 中看到下面返回数据：


```py
{
  "msg": "hello, I am a book"
}
```

## 数据库模型使用

打开 `app/model/v1` 文件夹，在该文件夹下新建 `book.py` 文件，并加入以下内容：

```py
from lin.interface import InfoCrud as Base
from sqlalchemy import Column, Integer, String


class Book(Base):
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    author = Column(String(30), default="未名")
    summary = Column(String(1000))
    image = Column(String(100))
```

我们新建了一个 `Book` 的 Model，该模型继承自 `InfoCrud`，有关于 `InfoCrud` 的详细，将在[后续](../server/authority_and_models.md##InfoCrud和BaseCrud)详细介绍，本章我们注重于 CMS 的开发使用。

有了该模型后，我们运行 `flask db fake` 命令，如果你的操作正确，你的数据库中将会存在一张`book`表，且包含两条书籍的数据。

下面，我们继续完善 `app/api/v1/book.py` 下的 `get_book` 函数，在上一步中，我们只是简单的返回了一条信息，但是在真正的开发中，数据库几乎是任何应用都摆脱不了的一环。

我们重写 `get_book` 函数：

```py
from lin.redprint import Redprint
from flask import jsonify
from lin.exception import NotFound
from app.models.book import Book

book_api = Redprint('book')


@book_api.route('/<id>', methods=['GET'])
def get_book(id):
    book = Book.query.filter_by(id=id).first() # 通过Book模型在数据库中查询id=`id`的书籍
    if book:
        return book # 如果存在，返回该数据的信息
    raise NotFound('没有找到相关书籍') # 如果书籍不存在，返回一个异常给前端
```
> **Tips:**
>
> 现在，直接返回数据库的模型实例，也可以被自动序列化了。
>
> 异常类允许直接传入告警文字或数字作为参数，新版本的异常新增了多项功能，我们将在[异常](../server/exceptin.md)详细介绍。


在上面重写的 `book.py` 文件中，我们使用到了 `flask-sqlalchemy` 提供的便捷查询 API，详细使用请参考[官网](http://flask-sqlalchemy.pocoo.org/2.3/)。

通过 curl 再次访问`http://127.0.0.1:5000/v1/book/1`，我们会得到如下数据：

```json
{
  "author": "Randal E.Bryant",
  "create_time": "2020-12-20 12:20:36",
  "id": 1,
  "image": "https://img3.doubanio.com/lpic/s1470003.jpg",
  "summary": "......"
}
```

## 参数校验

> **Tips:**
> `WTForms`参数校验，请参考0.2.x版本的文档，新版本建议使用`Pydantic`进行参数校验。

在应用的开发中，尤其是在 Web 领域中，对于任何从用户传入的数据都是无规则可循的，我们无法去预测用户传入的数据，因此参数（数据）校验是开发中不可或缺的一环。

访问`http://127.0.0.1:5000/v1/book/a`，我们会得到如下报错：

> TODO:报错提示1

将装饰器修改为
```python
@book_api.route('/<id>', methods=['GET'])
def get_book(id):
    ....
```

再次访问`http://127.0.0.1:5000/v1/book/a`，我们会得到如下报错：

> TODO:报错提示2

告知我们传入的路径参数类型不匹配。

路径参数可以由Flask自带的规则帮助校验，那其他种类参数如何校验呢？

我们打开 `app/validators/book.py` 文件，向其中*添加*如下内容：

```py
from lin import BaseModel


class BookQuerySearchSchema(BaseModel):
    q: Optional[str] = str()
```
> **Tips:** 我们对`BaseModel`做了一些更改，请从`lin`中引入。

我们新建了一个 `BookQuerySearchSchema` 的校验类，当前端传入数据时必须携带 `q` 这个参数，它被用来查询书籍。

然后，我们在 `app/api/v1/book.py` 文件中新增一个视图函数 `search`:

```python
from app.validators.book import BookQuerySearchSchema
from flask import g
from app.api import api

@book_api.route('/search', methods=['GET'])
#query代表来自url中的参数，如`http://127.0.0.1:5000?q=abc&page=1`中的 `q` 和 `page`都属于query参数
@api.validate(query=BookQuerySearchSchema) 
def search():
    # 校验通过的参数将会被挂载到g的对应属性上，方便直接取用。
    q = '%' + g.q + '%' # 取出参数中的`q`参数，加`%`进行模糊查询
    books = Book.query.filter(Book.title.like(q)).all() # 搜索书籍标题
    if books:
        return books
    raise NotFound('没有找到相关书籍')
```

最后，我们再次运行根目录下的 `flask run` 文件，并通过 curl 再次访问 `http://127.0.0.1:5000/v1/book/search`，我们会得到如下数据：

```py
{
    "error_code": 10030,
    "msg": {"q": ["field required"]},
    "request": "GET  /v1/book/search"
}
```

很明显我们未输入参数 `q`，因此校验未通过。我们修改 url 为 `http://127.0.0.1:5000/v1/book/search?q=C`，会得到如下数据：

```json
[
  {
    "author": "（美）Brian W. Kernighan",
    "create_time": 1539702050000,
    "id": 2,
    "image": "https://img3.doubanio.com/lpic/s1106934.jpg",
    "summary": "......",
    "title": "C程序设计语言"
  }
]
```
# TODO 下文未更新  
## 自定义异常

在刚才的图书搜索 API 中，当程序没有找到相关的书籍时，会抛出一个 `NotFound` 的异常。`NotFound` 是 Lin 基础库提供的一种异常，现在有如下需求：我们需要自定义一个 `BookNotFound` 的异常来专门表示图书未找到。打开 `app/libs/error_code.py`，在其中添加如下内容：

```python
class BookNotFound(APIException):
    code = 404 # http状态码
    msg = '没有找到相关图书' # 异常信息
    message_code = 80010 # 约定的异常码
```

:::warning
`BookNotFound`异常继承自`APIException`，所有继承自`APIException`的子类异常均会被框架的异常处理机制所捕捉到，并以固定的信息结构返回给前端，方便前端快速捕捉错误。
在`code`、`msg`和`error_code`中，msg 和 error_code 异常重要，msg 能直接的告诉前端错误信息，error_code 可以让前端快速判断是何种异常。
:::

然后更改图书搜索未找到图书的异常：

```py
from app.libs.error_code import BookNotFound

# *******

@book_api.route('/search', methods=['GET'])
def search():
    form = BookSearchForm().validate_for_api()
    q = '%' + form.q.data + '%'
    books = Book.query.filter(Book.title.like(q)).all()
    if books is None or len(books) < 1:
        raise BookNotFound()
    return jsonify(books)
```

再次运行程序，如果未找到图书，则前端会得到如下提示信息：

```py
{
    "error_code": 80010,
    "msg": '没有找到相关图书',
    "request": "GET  /v1/book/search"
}
```

## 完善 API

上面，我们陆续地完成了查询图书和搜索图书两个 API，此处我们再补上创建、更新、删除和获取图书这四个 API。

- 创建图书

```py
# book.py
from lin import db
from lin.redprint import Redprint
from flask import jsonify
from lin.exception import NotFound, ParameterException, Success

from app.libs.error_code import BookNotFound
from app.models.book import Book
from app.validators.forms import BookSearchForm, CreateOrUpdateBookForm

# ************

@book_api.route('/', methods=['POST'])
def create_book():
    form = CreateOrUpdateBookForm().validate_for_api()  # 校验参数
    book = Book.query.filter_by(title=form.title.data).first()  # 避免同名图书
    if book is not None:
        raise ParameterException(msg='图书已存在')
    # 新增图书
    with db.auto_commit():
        new_book = Book()
        new_book.title = form.title.data
        new_book.author = form.author.data
        new_book.summary = form.summary.data
        new_book.image = form.image.data
        db.session.add(new_book)
    return Success(msg='新建图书成功')
```

- 更新图书

```py
@book_api.route('/<id>', methods=['PUT'])
def update_book(id):
    form = CreateOrUpdateBookForm().validate_for_api()  # 校验参数
    book = Book.query.filter_by(id=id).first()  # 通过Book模型在数据库中查询id=`id`的书籍
    if book is None:
        raise NotFound(msg='没有找到相关书籍')  # 如果书籍不存在，返回一个异常给前端
    # 更新图书
    with db.auto_commit():
        book.title = form.title.data
        book.author = form.author.data
        book.summary = form.summary.data
        book.image = form.image.data
    return Success(msg='更新图书成功')
```

- 删除图书

```py
@book_api.route('/<id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.filter_by(id=id).first()  # 通过Book模型在数据库中查询id=`id`的书籍
    if book is None:
        raise NotFound(msg='没有找到相关书籍')  # 如果书籍不存在，返回一个异常给前端
    # 删除图书，软删除
    book.delete(commit=True)
    return Success(msg='删除图书成功')
```

- 获取所有图书

```py
@book_api.route('/', methods=['GET'])
def get_books():
    books = Book.query.filter_by().all()
    if books is None or len(books) < 1:
        raise NotFound(msg='没有找到相关书籍')
    return jsonify(books)
```

我们完成了一个关于图书 CRUD 的简单 demo，事实上很多应用都是重复如此操作，希望你能熟练掌握这套流程。

详细代码参考示例项目[book](https://github.com/TaleLin/lin-cms-flask/blob/master/app/api/v1/book.py)。

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
