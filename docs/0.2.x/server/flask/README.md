---
title: 项目结构及开发规范
---

# <H2Icon /> 项目结构及开发规范

::: warning

阅读本小节前，请确保你已经完成了[上一节](../../start/flask/README.md)的内容，当然你非常熟
悉 Flask 的开发也可直接阅读本小节

:::

## 项目结构

> Flask 是一个优美的微框架。这既是一件好事——你可以按照自己的习惯和想法来组织你的
> 项目，不过对于团队来说这可能是一件坏事——团队每个人都有自己的喜好，这会使整体项
> 目的结构很混乱。因此我们提供了 starter 模板项目，它是我们团队从诸多项目开发中
> 提炼而来的一种规范，它不仅仅是结构，风格还有诸多细节，你会在后续逐渐了解到。

```bash
│   code.md // 记录自定义的返回码和信息
│   fake.py // 测试和做假数据的脚本
│   `starter.py` // 程序的开始文件
└───app // app目录
    │   app.py // 创建Flask app及应用扩展
    │   __init__.py // 默认的包初始化文件
    │
    ├───api // api目录
    │   │   __init__.py // 默认的包初始化文件
    │   │
    │   ├───cms // 开发CMS API目录
    │   │   │   __init__.py // 创建CMS2蓝图
    │   │
    │   ├───v1 // 开发普通API目录
    │   │   │   book.py // 上节的book测试文件
    │   │   │   __init__.py // 创建v1蓝图
    │
    ├───config // 配置文件目录
    │   │   `secure.py` // 有关于安全的配置
    │   │   setting.py // 基础配置
    │
    ├───libs // 类库文件夹
    │   │   error_code.py // 自定义异常文件
    │   │   utils.py // 工具文件
    │
    ├───models // 模型文件夹
    │   │   book.py // book模型文件
    │   │   __init__.py // 默认的包初始化文件
    │
    ├───plugins // Lin插件目录
    │       .gitkeep
    │
    ├───validators // 校验类存放目录
    │   │   forms.py // 校验类文件
    │   │   __init__.py // 默认的包初始化文件
```

上面是 starter 项目的整体结构，开发时我们强烈建议你遵循如下规范开发，在前期你肯
定会不适应，但慢慢地你会爱上它。

- 在 `app/api` 文件夹中开发 API，并将不同版本，不同类型的 API 分开，如：v1 代表
  第一版本的 API，v2 代表第二版本，cms 代表属于 cms 的 API。
- 将程序的配置文件放在 `app/config` 文件夹下，并着重区分 `secure（安全性配置）`
  和 `setting（普通性配置）`。配置更详细内容参考[配置](./config.md)
- 将可重用的类库放在 `app/libs` 文件夹下。
- 将数据模型放在 `app/models` 文件夹下。
- 将开发的插件放在 `app/plugins` 文件夹下。
- 将校验类放在 `app/validators` 文件夹下。

## 开发规范

### API 规范

由于 Flask 本身的灵活性，社区中涌现出了一些便捷开发 Flask Restful API 的框架，其
中包括 `flask-restful`，`flask-restplus` 等。就 Flask 本身而言，我们觉得它对于
API 的粒度控制不够好，因此我们提供了一个 `红图` 的机制来帮助我们细粒度的控制
API。相较于 `flask-restful`，`flask-restplus` 这些框架而言，红图更注
重**小**与**轻**。红图的源代码如下：

```py
class Redprint:
 def __init__(self, name, with_prefix=True):
     self.name = name
     self.with_prefix = with_prefix
     self.mound = []

 def route(self, rule, **options):
     def decorator(f):
         self.mound.append((f, rule, options))
         return f

     return decorator

 def register(self, bp, url_prefix=None):
     if url_prefix is None and self.with_prefix:
         url_prefix = '/' + self.name
     else:
         url_prefix = ''
     for f, rule, options in self.mound:
         endpoint = self.name + '+' + options.pop("endpoint", f.__name__)
         if rule:
             url = url_prefix + rule
             bp.add_url_rule(url, endpoint, f, **options)
         else:
             bp.add_url_rule(url_prefix, endpoint, f, **options)
```

红图本身只有 24 行代码，极易学习和掌握，它的作用并非去控制 API，而是做一个纽带将
细粒度的 API 传递到相应的蓝图（Flask 自带的机制）中。因此红图的书写方式几乎与蓝
图保持一致，相较于其它 API 开发方式，你几乎不需要任何学习成本。

一般的，我们推荐你在一类 API 中新建一个红图（如 Book 这一类，它负责与图书相关的
API）。如下：

```py
 # book.py
 book_api = Redprint('book') # 创建book红图

 @book_api.route('/<id>', methods=['GET'])
 def get_book(id):
     book = Book.query.filter_by(id=id).first()
     if book is None:
         raise NotFound(msg='没有找到相关书籍')
     return jsonify(book)
```

如果你熟悉 Flask，你会发现这几乎与 Flask 的标准开发方式一样。新建红图时，你需传
入红图的名称，如`book`，而后红图会自己在访问的 url 中加入`/book`前缀。

在 Flask 的开发中，几乎都会墨守成规的使用*装饰器*来优雅的书写视图函数，我们承袭
了这一特点，也希望你能够喜欢。

### 数据库模型规范

Flask 本身并非对数据库做出支持，但它通过集成`sqlalchemy`提供
了`flask sqlalchemy`这个好用的扩展，如果你不熟悉，请先阅
读[官方文档](http://flask-sqlalchemy.pocoo.org/2.3/)。

为了 使 flask sqlalchemy 更加好用和人性化，我们也提供了些许工具类，它将会为你的
开发助力。当然它本身也足够简单，核心代码如下：

```py
 class SQLAlchemy(_SQLAlchemy): # 重写SQLAlchemy的核心类
     @contextmanager
     def auto_commit(self):
         try:
             yield
             self.session.commit()
         except Exception as e:
             self.session.rollback()
             raise e
```

由于数据库本身的特性，为了保证数据的正确性，一般只有向数据库提交后才能使数据更新
生效，因此大多数情况下，你不得不在你的代码的最后几行写上：

```py
self.session.commit()
```

当然有时你的操作会触发异常，你也不得不加入：

```py
except Exception as e:
    self.session.rollback()
```

对于重复的操作，一般的方式是提供一个工具方法或工具类，因此我们为 SQLAlchemy 核心
类提供了一个非常实用的方法`auto_commit`（这需要一定的 contextmanager 知识）。有
了该方法后，对于属于数据库操作，我们可以这样：

```py
with db.auto_commit():
    data = {
        'from': 2,
        'url': url
    }
    Image.create(**data)
    one.update(status=form.status.data, reason=form.reason.data, qr_url=url, _check_time=datetime.now())
```

当然，对于数据库的查询，你还是得详细地阅读`sqlalchemy`的文档来学习。

### 异常处理规范

提起异常，大多时候我们都并不想碰见，因为它经常会与程序 crash 一起出现。但它确实
又是程序中不可或缺的一部分，在 Lin 中我们默认集成了全局异常处理机制。因此不论你
程序出现何种异常，都将会返回固定格式的提示信息给前端。对于前端来说，这是非常友好
的一种交互。

在 Lin 的源码中关于异常处理的代码如下：

```py
def handle_error(self, app):
    @app.errorhandler(Exception)
    def handler(e):
        if isinstance(e, APIException):# 已知的自定义异常直接返回
            return e
        if isinstance(e, HTTPException): # 未知的http异常，取信息再以特定的格式返回
            code = e.code
            msg = e.description
            error_code = 1007
            return APIException(msg, code, error_code)
        else:
            if not app.config['DEBUG']:
                return UnknownException() # 未定义异常，返回未知异常
            else:
                raise e
```

熟悉 Flask 的肯定知道，这就是 Flask 处理异常的方式。在项目开发中我们强力推荐，甚
至可以说是**要求**你在开发的过程中，关于某一类的异常一定要通过继
承`APIException`的方式来自定义，这会让前后端的交互更加友好。

当然，当你每自定义一个异常后，别忘记在根目录下的`code.md`中记录相关异常的
error_code 和 msg，方便前端查阅和团队协作。

### 数据校验规范

我们强烈建议你为每个有数据校验的接口定义一个相应的校验类。关于 flask-wtf 的使用
，请阅读[官方文档](https://flask-wtf.readthedocs.io/en/stable/)。

```py
class BookSearchForm(Form):
    q = StringField(validators=[DataRequired(message='必须传入搜索关键字')]) # 校验参数q
```

如上，我们定义了一个图书搜索的校验类，在`BookSearchForm`类中定义了一个字段`q`。
该字段会对前端传入的数据做出校验，若传入的数据中不存在`q`字段，则会返回前端一个
错误信息，错误信息为`必须传入搜索关键字`。

到这里，你或许未发现校验类的可取之处，因为这个简单的校验直接在视图函数中实现，或
许更为直接和简单。

但是，一旦我们的数据变多，且校验规则变得复杂，如下：

```py
class RegisterForm(Form):
    password = PasswordField('新密码', validators=[
        DataRequired(message='新密码不可为空'),
        Regexp(r'^[A-Za-z0-9_*&$#@]{6,22}$', message='密码长度必须在6~22位之间，包含字符、数字和 _ '),
        EqualTo('confirm_password', message='两次输入的密码不一致，请输入相同的密码')])
    confirm_password = PasswordField('确认新密码', validators=[DataRequired(message='请确认密码')])
    username = StringField(validators=[DataRequired(message='用户名不可为空'),
                                       length(min=2, max=10, message='用户名长度必须在2~10之间')])
    email = StringField('电子邮件', validators=[
        Regexp(r'^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$', message='电子邮箱不符合规范，请输入正确的邮箱'),
        Optional()
    ])
```

可以发现，当我们需要校验的参数变得复杂时，一个专注于校验的类可以让我们的代码变得
更易维护，提升代码整体的可读性。

### 配置规范

在我们的 starter 项目中，统一把项目的配置文件放在了`app/config`文件夹下。当然，
我们也强烈建议你如此做。不仅如此，由于 Flask 对配置项的限制，你必须保证命名全都
大写，如`BP_URL_PREFIX`。

```py
# main config
BP_URL_PREFIX = '/cms'
```

## 小结

到此，我们介绍了项目的结构和开发规范。本小节注重的不是项目的开发实现与细节，而是
项目的整体与规范，对于很多人来说，去适应一个规范会觉得不舒服，但对于团队来说，这
是一件必须的事。最后，送大家一句话——越规矩，越自由。

<RightMenu />
