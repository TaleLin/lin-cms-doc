---
title: 运行流程分析
---

# <H2Icon /> 运行流程

> 在前面几小节中，我们介绍了 starter 项目的结构和开发规范，还通过一个简单的 book 项目熟悉了整体开发流程。
> 本小节将会详细说明`Lin`的运行流程，你会对整个项目有更加清晰的认识。

## app 初始化

在前面我们提到，程序的入口文件是根目录下的`starter.py`文件，我们打开`starter.py`文件，里面的内容为：

```py
from app.app import create_app # 从app.app中导入create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
```

内容十分简单，我们从 app.app 中导入`create_app`函数，该函数会创建一个 Flask app 的实例，而后调用实例的`run`方法。

```py
def run(self, host=None, port=None, debug=None,
            load_dotenv=True, **options):
```

run 方法的定义如上，你可以传入很多参数，例如：`host`，默认为`127.0.0.1`；`port`，默认为`5000`。当你运行该文件时，会以`debug`模式打开一个本地的服务，默认监听`127.0.0.1:5000`。请注意，当你在应用上线时，请关闭 debug 模式。

`create_app`方法是 starter 项目中的一个自定义方法，它的定义我们可以在`app/app.py`中找到。如下：

```py
#**********************
def create_app():
    app = Flask(__name__) # 1. 初始化Flask app实例
    app.config.from_object('app.config.setting')
    app.config.from_object('app.config.secure') # 2. 导入配置文件
    register_blueprints(app) # 3. 注册所有蓝图
    Lin(app) # 4. 初始化Lin，第一个初始化的扩展
    apply_cors(app) # 5. 应用跨域扩展，使app支持请求跨域
    # 创建所有表格
    create_tables(app)# 6. 创建所有数据表
    return app
```

在注释中，我们已经详细的描述了`create_app`函数每一行代码所发挥的作用。相信你能理解这个函数的作用，但是我们仍然必须罗列如下几点要求：

- 一旦 app 创建，我们推荐第一时间导入配置。Flask 的扩展会依赖一些配置，因此你必须在第一时间导入配置以保证你的配置生效。
- 请将 Lin 的初始化放在 Flask 扩展的第一位。Flask 有诸多扩展，如应用跨域的 flask-cors 扩展，因此你必须在初始化这些扩展之前，先初始化 Lin。
- 请在函数的最后调用`create_tables`函数来创建所有数据库表，以保证你所有的模型类均能与数据库关联。

## Lin 初始化

在上面 app 的初始化过程中，无疑 Lin 的初始化是最为重要的。接下来，我们来着重分析一下 Lin 初始化的详细流程。我们查看源码（第三方包 lin-cms 的源码），在`lin/core.py`中可以找到 Lin 的定义。

```py
class Lin(object):

    def __init__(self,
                 app: Flask = None,  # flask app , default None
                 group_model=None,  # group model, default None
                 user_model=None,  # user model, default None
                 auth_model=None,  # authority model, default None
                 create_all=False,  # 是否创建所有数据库表, default false
                 mount=True,  # 是否挂载默认的蓝图, default True
                 handle=True,  # 是否使用全局异常处理 , default True
                 json_encoder=True,  # 是否使用自定义的json_encoder , default True
                 ):
        self.app = app
        self.manager = None
        if app is not None:
            self.init_app(app, group_model, user_model, auth_model, create_all, mount, handle, json_encoder)
```

Lin 的构造函数共有 8 个参数，它们作用如下：

| name         |              说明               |  类型   | 作用                                                                   |
| ------------ | :-----------------------------: | :-----: | ---------------------------------------------------------------------- |
| app          |         Flask app 实例          | object  | 传入 app 实例                                                          |
| group_model  |           权限组模型            | object  | 默认为 None，使用 Lin 中默认的权限组模型；若传入模型，则使用传入的模型 |
| user_model   |            用户模型             | object  | 默认为 None，使用 Lin 中默认的用户模型；若传入模型，则使用传入的模型   |
| auth_model   |            权限模型             | object  | 默认为 None，使用 Lin 中默认的权限模型；若传入模型，则使用传入的模型   |
| create_all   |       是否创建所有数据表        | boolean | \*\*\*\*                                                               |
| mount        |        是否挂载默认蓝图         | boolean | \*\*\*\*                                                               |
| handle       |        是否处理全局异常         | boolean | \*\*\*\*                                                               |
| json_encoder | 是否使用 自定义的 json 的编码器 | boolean | 改变 Flask 的默认 json 编码器                                          |

关于三个模型参数的使用，我们将在后面单独的一个小节详细介绍。在 Lin 的构造函数中，它本身还调用了自己的一个方法`init_app`，如下：

```py
    def init_app(self,***
                 ***):
        # default config
        app.config.setdefault('PLUGIN_PATH', {})# 默认的PLUGIN_PATH配置，插件路径的配置
        # 默认蓝图的前缀
        app.config.setdefault('BP_URL_PREFIX', '')# 默认的BP_URL_PREFIX配置，默认蓝图的url前缀
        json_encoder and self._enable_json_encoder(app) # 使用 自定义的 json 的编码器
        self.app = app
        # 初始化 manager ，manager主要负责基础库中模型的使用
        self.manager = Manager(app.config.get('PLUGIN_PATH'),
                               group_model,
                               user_model,
                               auth_model)
        self.app.extensions['manager'] = self.manager # 将manager注册到app的extensions中
        db.init_app(app) # 初始化flask-sqlalchemy扩展
        create_all and self._enable_create_all(app) # 创建所有数据库表，不建议在此处调用
        jwt.init_app(app) # 初始化flask-jwt扩展
        mount and self.mount(app) # 挂载默认的CMS蓝图
        handle and self.handle_error(app) # 使用全局异常处理
```

因为 manager 主要负责 Lin 的数据模型的操作，这会在[其它小节](./authority_and_models.md)和上述的三个模型参数一起介绍。

关于`db`和`jwt`这两个 Flask 的扩展，Lin 默认就已经集成这两个扩展，如果你希望对它们有更加深入的了解，请阅读相应的官方文档。[Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/en/latest/)；[Flask-SQLAlchemy](http://flask-sqlalchemy.pocoo.org/2.3/)。

## 视图函数挂载

接下来我们着重分析`mount`这个函数，它会将默认的视图函数以及 Lin 插件的视图函数挂载到 app 中，当用户访问相应的 url 时便可得到相应的回应。

```py
def mount(self, app):
    # 加载默认的路由
    bp = Blueprint('plugin', __name__) # 得到默认的CMS蓝图
    # 加载插件的路由
    for plugin in self.manager.plugins.values():
        for controller in plugin.controllers.values():
            controller.register(bp) # 在Lin的插件的视图函数挂载到默认蓝图中
    app.register_blueprint(bp, url_prefix=app.config.get('BP_URL_PREFIX')) # 将默认的蓝图注册到app中
    # 将每个需要权限管理的视图函数加入到ep_meta中，注：此处我们将在后续介绍，你只需要知道它会把某个视图函数的信息加入到manager中，供权限调度
    for ep, func in app.view_functions.items():
        info = route_meta_infos.get(func.__name__, None)
        if info:
            self.manager.ep_meta.setdefault(ep, info)
```

到此，你或许有些疑惑，Lin 还有插件？是的，Lin 是有自己的插件机制的，Lin 的插件（plugin）跟 Flask 的扩展（extension）很像，但它们**压根**不是同一种东西！！！

::: warning
你可以如此区分，Lin 是 Flask 的一个扩展，而 Lin 本身又带有诸多插件，Lin 的插件可以认为是 Flask 扩展的一部分。
关于插件，Lin 在第一个版本并没有引入，这将会在下个版本进行支持。如果你有兴趣，可以通过源代码提前了解。
:::

```py
bp = Blueprint('plugin', __name__)
```

在上段代码中，我们定义了一个默认的插件蓝图，这个蓝图并没有停止挂载红图。而是依次遍历每个插件，并且将插件的 controller（控制类，实则就是一个红图）挂载到这个蓝图上。所以，这个蓝图上就有*默认基础库*和*插件*的所有的视图函数。

至此，程序跑起来后，你就可以通过相应的 url 访问所有视图函数对应的 API。

## 小节

在本小节中，我们分析了项目的运行流程。当然我们没有叙述 app 的启动流程，而是介绍了 Lin 的初始化和视图函数的挂载流程，并且着重区分了 Flask 的**扩展**以及 Lin 的**插件**。当然这里面有很重要的一环——插件的加载。

:::warning
在 Lin 的 1.0.0 的版本之前，插件机制虽然存在，但却未被真正使用。因此如果你对此有所疑惑，没关系，我们会在插件彻底上线后，着重解析插件的使用和原理。
:::

<RightMenu />
