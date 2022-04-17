---
title: 模型管理和权限管理
---

# <H2Icon /> 模型管理和权限管理

> 阅读本小节前，请确保你一定完成了[快速开始](../../start/flask/README.md)的全部内容
> 本小结使用`postman`作为 http 测试工具，请确保你有 postman 或类似的 http 测试工具，它是我们后续开发必不可少的工具。

## 权限管理

### 架构介绍

Lin 的定位是一整套的 Flask CMS 解决方案。对于任何的 CMS 来说，权限这一块都是**不可或缺**的，因此 Lin 在基础框架中便已经集成了权限模块，它是开箱即用的。

不过 Lin 的权限模块的概念可能与其它的权限框架由些许不同，当然你完全不用担心，因为大部分权限系统的模式都大同小异。

在 Lin 的权限模块中，我们有三个模型类来组成这个这个权限模块。如下：

- 用户模型（user_model，数据表名称为 lin-user）
  用户是权限系统服务的基本单位，CMS 与一些网站的很大的区别在于，CMS 可能不存在不用登陆便可进入的页面（登陆页除外）。

  简而言之，用户是必须的。在源代码`lin/core.py`可以找到`User`这个类。User 类实则是一个数据库模型类，它有一些必要的属性和实用的方法。

- 权限组模型（group_model，数据表名称为 lin-group）
  权限组是一个非常重要的概念，权限组是权限分配的基本单位，同时它也是容纳用户的容器，它是用户与权限之间的纽带。

  一个用户只能属于一个权限组，超级管理员（super）不属于任何权限组，但超级管理员拥有所有的权限，一个权限组可以拥有多个用户。

  权限组也可拥有多个权限，也就是说，在某个权限组的用户拥有该权限组的所有权限。

  如果，你还不清楚，请你在源代码`lin/core.py`中阅读`Group`这个类的属性。

- 权限模型（auth_model，数据表名称为 lin-auth）
  你可以把一个权限理解成一把钥匙，然你拥有这把钥匙的时候你就可以打开某扇门，而当你没有这把钥匙的时候，你就会被锁在门的外面。

  所以对于某个用户，比如说：你，当你拥有某个权限时，你就可以访问某个 API（或多个 API），而当你没有这个权限时，你访问 API 时会得到一个授权失败或禁止的信息。

  想了解更详细的细节，请查看源代码`lin/core.py`中`Auth`这个类。

:::tip
上述中的源代码，请在第三方包`lin-cms`中寻找。
:::

### 基本使用

接下来，就让我们开始实战了。请先在`app/v1/book.py`中添加如下一个删除图书功能的 API。

```py
from lin.exception import NotFound, Success
from lin import route_meta, group_required
# 省略很多行代码
@book_api.route('/<id>', methods=['DELETE'])
@route_meta('删除图书', module='图书') # 将这个视图函数注册到权限管理容器中；auth的名称为 `删除图书` 模块名为 `图书`
@group_required # 只有在权限组授权后才可访问
def delete_book(id):
    book: Book = Book.query.filter_by(id=id).first()
    if book is None:
        raise NotFound(msg='没有找到相关书籍')
    book.delete(commit=True)
    return Success(msg='删除图书成功')
```

在快速开始一节中已经在数据中创建了一个超级管理员的账号，为了更好的测试，我们还需要一个普通用户的账号，接下来我们把`fake.py`的内容更换为如下内容：

```py
from app.app import create_app
from app.models.book import Book
from lin.db import db
from lin.core import User, Group, Auth

app = create_app()
with app.app_context():
    with db.auto_commit():
        group = Group()
        group.name = '普通分组'
        group.info = '就是一个分组而已'
        db.session.add(group)
        db.session.flush()

        user = User()
        user.username = 'pedro'
        user.password = '123456'
        user.email = '123456780000@qq.com'
        db.session.add(user)

        auth = Auth()
        auth.auth = '删除图书'
        auth.module = '图书'
        auth.group_id = group.id
        db.session.add(auth)
```

如果你仔细理解了上面架构介绍，这段代码的作用便是创建一个权限（删除图书），一个用户（pedro），一个权限组（普通分组）；且权限与权限组已经绑定了，不过新建的用户却未与权限组关联，这个新建权限就是上段代码中的删除图书的 API。

:::warning
这里，虽然新建了`pedro`这个用户，但是他却没有*删除图书*这个权限。
:::

请在 postman 的 url 地址栏输入`http://127.0.0.1:5000/cms/user/login`，请求方法选择 post 方法，并在请求参数的 body 里面填入下面数据：

```json
{
  "username": "super",
  "password": "123456"
}
```

如果顺利，你会得到如下返回结果：

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDAxMzM0NjAsIm5iZiI6MTU0MDEzMzQ2MCwianRpIjoiYTlmMWIzNTYtMzI3ZS00MjcyLWE0MTUtZWU5YTliOGRjYTUxIiwiZXhwIjoxNTQwMjE5ODYwLCJpZGVudGl0eSI6InN1cGVyIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.xXTxkadyPqZDvL6G7YyNF-H7hHgAopI57W1cLI586vs",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDAxMzM0NjAsIm5iZiI6MTU0MDEzMzQ2MCwianRpIjoiNDFhOTVhMjMtODk4MC00NzA4LWIzYzgtODBlYWFlMzU3ZTZjIiwiZXhwIjoxNTQyNzI1NDYwLCJpZGVudGl0eSI6InN1cGVyIiwidHlwZSI6InJlZnJlc2gifQ.ZZQ-RPtFYSOx_Jp6jv1g0iUP0g4Qw-ylf13YYipMim0"
}
```

<img-wrapper>
  <img src="https://cdn.talelin.com/lin/docs/authority_and_models1.png"/>
</img-wrapper>

到此，我们拿到了访问 API 所必须的令牌，请记住这是超级管理员的令牌，它可以访问一切 API。接下来我们访问改变 postman 的 url 地址为

`http://127.0.0.1:5000/cms/admin/authority`，并且在请求头中加入键值对。

```bash
# 此处的access_token是变量，为上面返回结果的access_token
Authorization: Bearer ${access_token}
```

结果为：

```json
{
  // 图书模块
  "图书": {
    // 一个权限
    "删除图书": ["v1.book+delete_book"] // 权限下的endpoint
  },
  省略......
}
```

请记住以`/admin`为前缀的 url 一般为超级管理员专有，需要以超级管理员账号申请令牌才可访问。

<img-wrapper>
  <img src="http://imglf3.nosdn0.126.net/img/Qk5LWkJVWkF3NmdYN2FJcVlYMkpSVG1VZWNYUUt4M1d6RkkvY3NnU2w2Wnp0Z1dtdFIzRWVnPT0.png?imageView&thumbnail=1680x0&quality=96&stripmeta=0"/>
</img-wrapper>

如果你顺利得到了结果，你可能不明白这些数据究竟代表着什么。这没关系，我们会一一说明，不过在此之前，你的先了解一个概念，那就是 Flask 中的**endpoint(端点)**。

无论你是否熟悉 Flask，在这里，一个 endpoint 所能起到的作用那便是——_唯一标识一个视图函数，或者说一个 url，一个 API(严格来说 API 不等同于一个视图函数，但是在大多数的开发中，一个视图函数确实与一个 API 对应)_。

在刚才的返回结果中，我们可以找到`v1.book+delete_book`这个字段，这个字段就是一个**endpoint**。也就是说，这个端点标识了一个视图函数，而**删除图书**代表的是这个权限的名称。聪明的你会发现，一个权限可以拥有多个端点，换言之那就是一个权限可以对应多个视图函数。当然一般情况下，一个权限对应一个视图函数，我们也强烈推荐你这么做。

**删除图书**这个权限它还有一个重要的属性，那就是模块（module），也就是**图书**这个字段。

之所以需要这个属性，是因为权限一旦多了之后，你可能无法很好的梳理它们之间的关联，而有了模块这个概念之后，你可以很好的区分哪些权限属于哪一个模块，在前端操作界面，当管理员进行操作的时候，这也会为他提供诸多便利。

:::warning
开发者请注意，此处的**删除图书**权限和**图书**模块对应的是上述添加视图函数中的

```py
@route_meta('删除图书', module='图书') # 将这个视图函数注册到权限管理容器中；auth的名称为 `删除图书` 模块名为 `图书`
```

这一行代码，也就是说，权限的命名和分配均是由开发者自己来斟酌，如果你们是团队协作，请与你们的前端、客户仔细交流再做决定。
:::

上面，我们添加了一个`delete_book`的 API，其对应的 url 为`http://127.0.0.1:5000/v1/book/1`，请求方法为`delete`。如果此时，你以超级管理员的 token 进行操作，那么毫无疑问，这个 id 为 1 的图书会被删除。但是绝大多数情况下，我们不能让别人直接以超级管理员的身份来操作，这太危险了！！！

聪明的你又会发现，我们刚刚不是已经申请了一个名为`pedro`的用户吗？而且他还未被分配到任何权限组（请注意，我们非常不推荐存在离群用户，即没有被分配到权限组的用户，超级管理员除外，此处我们仅仅是为了方便测试而未直接给 pedro 用户分配权限组），因此理论上说 pedro 并没有访问`delete_book`的权限，那么实际如何了。

我们通过 pedro 的账号名、密码登陆获取令牌，并将 header 中的 Authorization 字段换成相应的令牌字段。而后访问`http://127.0.0.1:5000/v1/book/1`，你会得到如下结果：

<img-wrapper>
  <img src="https://cdn.talelin.com/lin/docs/authority_and_models3.png"/>
</img-wrapper>

现在权限系统已经开始显现它的威能了。它告诉我们，pedro 这个用户未被分配权限组，并没有权限能够访问这个 API。既然没有权限，那我们便分配这个权限给 pedro（请注意，这里分配权限仅为了测试方便，一般的只允许超级管理员分配）。

打开`fake.py`文件，换成如下代码：

```py
from app.app import create_app
from app.models.book import Book
from lin.db import db
from lin.core import User, Group, Auth

app = create_app()
with app.app_context():
    with db.auto_commit():
        pedro: User = User.query.filter_by(username='pedro').first()
        # 注意：此处的group_id为刚才新建group的id，一般情况下它确实为1
        # 如果你以前有新建其它权限组，可能它的id不是1，所以请你先确定它的id
        pedro.update(group_id=1, commit=True)
```

运行它后，pedro 用户便被分配到了 id 为 1 的这个权限组。接下来，我们再次访问`http://127.0.0.1:5000/v1/book/1`，结果如下：

<img-wrapper>
  <img src="https://cdn.talelin.com/lin/docs/authority_and_models4.png">
</img-wrapper>

如果你也是一样的结果，那么恭喜你，你已经完成了一个权限开发的全部流程，再你后续的开发过程中，都是类似的做法来完成全部的权限管理开发。

在刚才，我们提到了一点。一个权限是可以拥有多个视图函数的，下面我们来亲身实践一下。

我们新增一个删除多个图书的 API——`delete_books`。`delete_books`与`delete_book`同属于一个权限，聪明的你肯定已经想到了，用户 pedro 也应该能够访问这个 API。

```py
@book_api.route('/patch', methods=['DELETE'])
@route_meta('删除图书', module='图书')
@group_required
def delete_books():
    books = Book.query.filter_by().all()
    if books is None or len(books) < 1:
        raise BookNotFound()
    # 删除所有的图书，这是一个危险的操作，请记住真正的开发时谨慎使用
    for book in books:
        book.delete(commit=True)
    return Success(msg='删除所有图书成功')
```

我们改变 post 的 url 为`http://127.0.0.1:5000/v1/book/patch`，点击 send 按钮，结果如下，所有的图书已被删除。

<img-wrapper>
  <img src="https://cdn.talelin.com/lin/docs/authority_and_models5.png"/>
</img-wrapper>

:::warning
如果你此时打开数据库，你一定很奇怪，book 的数据并未被删除，相反它们还新增了数据`delete_time`，这是因为 Book 模型继承了 InfoCrud 这个带软删除的模型基类。

另外，请开发者一定仔细斟酌你的权限分配问题，适当的权限才能带来良好的管理。
:::

### 守卫函数

在上一节中，聪明的你一定注意到了一个`@group_required`的装饰器。我们把这它称之为**守卫函数**。请记住，守卫函数是权限系统中非常重要的一环，在基础库中我们提供了 3 个守卫函数，分别是：

| name           |                                说明                                |   作用   |
| -------------- | :----------------------------------------------------------------: | :------: |
| login_required |          被 login_required 装饰的视图函数需登陆后才可访问          | **\*\*** |
| group_required | 被 group_required 装饰的视图函数需登陆且被授予相应的权限后才可访问 | **\*\*** |
| admin_required |       被 admin_required 装饰的视图函数只有超级管理员才可访问       | **\*\*** |

开发者请注意，这三个守卫函数是开发层面上权限管理。如果你的视图函数未加任何守卫函数修饰，那么它可以被任何人访问，这样的视图函数一般是登陆这些功能的视图函数。又如哪些视图函数需要用户登陆才能访问，如用户修改密码，那么它可以加上`login_required`这个守卫函数。如果有些视图函数的功能需要授予权限才能访问，请使用`group_required`。而有些视图函数非超级管理员不可操作，那么请加上`admin_required`修饰。

## 模型管理

在权限管理的架构介绍时，我们就已经介绍了三个模型类`user_model`、`group_model`和`auth_model`。这是 Lin 里面最重要的三个模型，Lin 默认暴露的 API 和权限系统均直接依赖于这三个模型类。接下来请记住一个原则，如果你想使用这三个类，请通过`manager`来得到这三个类，而后再使用，如下：

```py
from lin.core import  manager
######省略代码
# 得到用户模型
manager.user_model
# 得到权限组模型
manager.group_model
# 得到权限模型
manager.auth_model
```

你可能会疑惑，为什么我们不直接通过`import`导入模型来使用，而是间接通过 manager 来访问，因为这三个核心模型默认集成在 Lin 中的，可是有时候我们需要对其中某个模型进行扩展。例如，user_model 可能还需要一个`phone（电话）`属性，那么我们就必须扩展该模型，因此你就需要改变这个 user_model，所以我们才把 user_model 挂载到 manager 中。

### 扩展模型

刚刚我们谈到扩展模型，接下来让我们来实操一下如何扩展 user_model。首先我们在`app/models`下新建`user.py`文件，并添加如下代码：

```py
from lin.core import User as _User
from sqlalchemy import Column, String


class User(_User):
    # 扩展user，增加一个phone属性
    phone = Column(String(20), unique=True)
```

接下来，我们修改`app/app.py`文件中的 create_app 函数：

```py{6}
def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.setting')
    app.config.from_object('app.config.secure')
    register_blueprints(app)
    from app.models.user import User
    Lin(app, user_model=User)
    apply_cors(app)
    # 创建所有表格
    create_tables(app)
    return app
```

由于 flask-sqlalchemy 的特性，当数据库中有 lin-user 这张表时，它并不会直接更新这张表。所以为了确保扩展成功，请你在数据库中先删除掉 lin-user 这张表，然后再次运行`starter.py`文件。如果，一切顺利你会在数据库中看到 lin-user 这张表多了一个`phone`字段。到这里，我们的模型扩展已经成功了，为了确保我们的 manager 可以访问到新的 user_model，我们在`fake.py`文件中写入如下代码测试（首先请确保你的 lin-user 表中已经有 super 这个用户了）：

```py
from app.app import create_app
from app.models.book import Book
from lin.db import db
from lin.core import manager

app = create_app()
with app.app_context():
    with db.auto_commit():
        pedro = manager.user_model.query.filter_by(username='super').first()
        pedro.update(phone=197868758987, commit=True)
```

运行后，你将会在数据库中看到 super 用户的 phone 字段已经为`197868758987`了。

## InfoCrud 和 BaseCrud

Lin 默认集成了 flask-sqlalchemy 这个方便的 ORM 库，因此我们可以很好的根据模型（model）来进行相关的数据库操作。某种意义上，sqlalchemy 提供的 API 已经可以很好的操作数据库了。

林间有风团队在诸多项目的开发中，也同时积累了些许经验，我们希望当模型类被定义时便已经默认拥有了简单的 CRUD，因此在 Lin 中我们提供了这两个方便的基础模型类—— InfoCrud 和 BaseCrud。

BaseCrud 默认便拥有`create`，`delete`，`update`，`get`这些便捷方法，你可以很便捷的进行数据的增删查改。

InfoCrud 在 BaseCrud 的基础上，添加了`create_time`，`update_time`，`delete_time`这三个字段，方便你进行数据的分析和观察，另外 InfoCrud 还增加了`hard_delete`方法，InfoCrud 使用`delete_time`来进行数据的软删除，因此当你调用`delete`方法时，数据并不会真正的从数据库中删除，而是写入`delete_time`，所以若要真正的删除数据，需调用`hard_delete`。

## 小节

在本节中，我们熟悉了一下权限管理的开发流程，并介绍 manager 的模型管理和扩展。

如果你对模型类的操作还不够了解，甚至有些疑惑，请你详细阅读[flask-sqlalchemy](http://flask-sqlalchemy.pocoo.org/2.3/queries/#querying-records)的官方文档，

和这个[sqlalchemy 小教程](https://www.jianshu.com/p/8d085e2f2657)。

<RightMenu />
