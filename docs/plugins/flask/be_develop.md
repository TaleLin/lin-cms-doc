---
title: 后端插件开发
---

# <H2Icon /> 后端插件开发（目前处于测试状态）

# 深入学习插件机制

> 本小节让我们来详细介绍一下 Lin 的精髓——插件机制
> 我们在这里再次强调，诸如 Flask-JWT 这样的第三方库，Flask 官方把它称之为`扩展`（extension）
> 而在 Lin 中，我们的插件（plugin）某种程度上类似于扩展，但是它们完全不是一种东西！

## 插件的规范
首先，我们通过[插件使用](./fe.md)一章中的`古诗词`插件示例 来看看插件的目录规范和开发规范。

### 目录规范

```bash
├───poem
│   │   config.py  // 配置文件（必需），记录关于插件的可用配置
│   │   info.py    // 插件基本信息
│   │   README.md  // 插件文档
│   │   requirements.txt // 插件依赖包
│   │
│   └───app     // 应用开发目录
│           controller.py  // 控制层文件
│           forms.py       // 校验层文件
│           model.py       // 模型层文件
│           __init__.py    // 导出文件（必需）。重要！！！
```

Lin 的插件可能与你以前了解的插件概念不一样，_你可以把每个插件理解为一个小 app_。每个插件都有自己的配置、控制层、模型层甚至校验层（forms），换言之每个插件都有自己的业务，它的功能很像**微服务**，即每个插件只负责完成某一项功能。

下面我们来介绍插件目录结构中的几个关键文件，你可以打开本地已经安装好的 `poem` 插件的源码，对照学习
- **config.py**  
配置文件，其中的所有配置项会在我们执行 `python plugin_init.py` 初始化插件成功后，自动写入到项目配置文件 `setting.py` 中，你也可以根据自己的业务场景自由修改配置项，关于配置文件的更多话题，我们在下面会继续介绍。

- 关于 **info.py**  
插件基本信息，里面定义了三个变量`__name__`、`__version__`和`__author__`，分别表示插件名、插件版本号和插件开发者。在插件初始化时，插件初始化脚本会根据 `info.py` 中的信息来找到对应的插件。

- 关于 **requirements.txt**  
如果你是在插件中使用了一些第三方库，这些库在主应用中是没有的，那么请你将它添加到 **requirements.txt** 中。以方便我们运行初始化插件脚本的时候自动检测并安装这些依赖。**注意，在你自己开发插件的时候，请一定不要将主应用中已经存在的第三方库添加到该文件中，否则可能造成插件与主应用的版本冲突，无法使用插件甚至主应用都会因此受损！** 文件的格式如下
```
oss2==2.6.1
```

### 开发规范

如果你想开发一个插件，你可以使用项目中的 `verdor/plugin_generator.py` 脚本来生成一个后端插件的基础模板。

假设你想生成一个名为 `test` 的插件模板，请在项目的根目录下运行如下命令：

```shell
python vendor/plugin_generator.py -n test
```

由于插件本身就是一个微型的 app，插件的开发规范与项目的开发规范几乎一致，如果你还不够熟悉，那么请你再次阅读[开发规范](../server/README.md)。

当然，插件这里也有一个自己独特的机制——加载。在前面，我们在介绍项目开发时，红图以及模型都是我们主动去通过`import`导入的。但是在插件中，我们可以不用做这件事情，因为 Lin 会自动通过 loader（加载器）来帮我们做这件事，loader 可以帮我们自动去加载插件中的红图 api 和数据模型类。

但是，在你开发的插件中，你必须明确告诉 loader，因为 loader 真的不够聪明，它到底该加载哪些东西。而`poem/app/__init__.py`这个文件则扮演这个角色，它里面的代码很简单，如下：

```py
from .controller import api
from .model import Poem

def initial_data():
  ...
```

在代码的第一行，我们从当前目录中的`controller`导入了`api`这个红图，第二行从`model`中导入了`Poem`这个模型类。而后，loader 会自动的从`__init__.py`文件得到刚才导出的`api`和`Poem`，然后存储到自身的容器中。

当然，在`__init__.py`你可以导入多个的红图和模型，如你还可能需要加载另外一个红图`some_api`和另外一个模型`Some`，接下来你应该在上段的代码中加入：

```py
from .some import some_api
from .model import Some
```

被 loader 加载红图会被直接挂载到默认的 plugin 蓝图中，你可通过相应的 url 直接访问。而加载的模型你可通过如下的方式得到：

```py
from lin.core import manager # 得到manager
Image = manager.get_model('Poem') # 得到加载到容器中的Log模型
```

当然如果你不喜欢这种方式，你也可以通过`import`方式得到这个模型：

```py
from lin.plugins.poem.app.model import Poem
```

除了导出插件中的红图 api 和数据模型类的功能，`__init__.py`中还可以定义一个名称为`initial_data`的函数，当插件初始化时，我们有时候需要向数据库添加一些初始数据，其业务逻辑可以封装在这个函数中。

`initial_data`函数的编写方法非常简单，你可以查看`poem/app/__init__.py`的源码来学习如何向数据添加初始数据。当然，如果你自己编写的插件不需要初始数据，可以不定义这个函数。但注意，`__init__.py`文件中只处理上述的两种业务，_请不要在该文件下编写任何其他的业务逻辑_。

## 插件的加载

在[运行流程](../server/run_process.md)一节中我们留下了一个悬念，那就是插件的加载流程。在 Lin 源代码中，可以在 Manager 的构造函数中找到如下代码段：

```py
...
from .loader import Loader
self.loader: Loader = Loader(plugin_path)
...
```

这里初始化的 loader （插件加载器），由它来负责所有插件的加载，我们继续打开 Loader 的构造函数。

```py
def __init__(self, plugin_path):
    self.plugins = {}
    assert type(plugin_path) is dict, 'plugin_path must be a dict'
    self.plugin_path = plugin_path
    self.load_plugins_config() # 加载插件配置
    self.load_plugins() # 加载插件
```

这里大致的流程是这样的，loader 率先从主 app 中读取插件的路径和配置（setting.py 文件中），然后加载每个插件单独的配置，最后加载插件。

```bash
|--------------|           |-------------------|              |----------|
| 加载插件配置   |   ---->   |  加载插件各自配置    |     ---->    | 加载插件  |
|--------------|           |-------------------|              |----------|
```

接下来我们继续，在 Loader 类中还有两个方法`_load_plugin`和`_load_config`，这两个方法是 loader 的核心方法，由它们向容器中加载插件和插件配置。这两个方法的思路很明确，我们相信你完全可以自己理解。

好，插件的整体流程的梳理到此已经结束了。如果你感到疑惑，请记住 loader 的加载本身只是一个很简单的过程，当你亲身通过断点 Debug 的方式去运行程序时，你就会觉得豁然开朗。


## 实操Poem插件
> 在大家已经了解了插件机制和插件的使用方法后，下面我们来手把手带着大家来实操的古诗词插件，你将学到一个插件的整个开发流程和注意事项。好了，话不多说，我们开始吧！

### 主配置文件解析

打开`app/config/setting.py`文件，如果该文件中已经存在了如下配置：

```py
PLUGIN_PATH = {
    'poem': {'path': 'app.plugins.poem', 'enable': True, 'limit': 20},
}
```

证明你已经下载插件源码并且在项目中进行了插件的初始化，上述配置会被自动写入。如果你想了解插件初始化脚本的执行流程，请查看`vendor/plugin_init.py`的文档注释。

如果你是自己开发插件，为了让插件的路由成功注册，以方便在开发中调试插件的api，你可以先手动将插件的配置写入到`setting.py`文件中。

下面我们解释这个配置项：

- PLUGIN_PATH：每个插件的单独配置。
  如`poem`代表当前的插件的名字为**poem**，`path`表示插件的路径，如 poem 插件的路径在`app/plugins/poem`下，`enable: True`表示开启当前插件。其他更多的配置项如 `limit` 是插件中使用到的配置。


### 调用获取古诗词接口

我们运行`starter.py`文件，然后请打开 postman 测试工具，选择 get 方法，请求 url 为`http://localhost:5000/plugin/poem/all`。

你可能会有所疑惑？这个 url 是如何确定的，插件中的路由 url 满足下述规范。

- 所有插件的路由都会被挂载到 plugin 的蓝图中，该蓝图的路径前缀为`/plugin`。
- 每个单独的插件都会有一个名字，如 poem 插件的名称为`poem`，若在该插件下，存在多个红图实例（redprint）,则其所有路由都会有一个二级前缀`/poem`。若该插件下只存在一个红图实例，即一个 controller，则不会有二级前缀，你的路径只有一个一级前缀，即`/plugin`。
- 后面的路径就被每个插件下的红图所确定，如 poem 插件下有个名为`poem`红图实例，该红图下有`get_list`这个视图函数。此时该插件只有一个红图实例，故它的前缀只有一级，所以获取古诗词接口的 url 为`/plugin/poem/all`。如果 all 插件下有多个红图实例，且某个红图名为`some`，some 下有`test`的视图函数，则访问这个视图函数的 url 为`/plugin/poem/some/test`。

点击`Send`，如果一些顺利你会看到如下返回结果：

<img-wrapper>
  <img src="http://imglf4.nosdn0.126.net/img/L1FxUmNhYXM3L2RnZnhXR0grZFJTZlg3RFJkRnU1UitnT3ppYmZNWlpnblFzYXI0ZktGY3dRPT0.png?imageView&thumbnail=1680x0&quality=96&stripmeta=0"/>
</img-wrapper>

### 插件局部配置文件
在`poem`的模型层`poem/app/model.py`代码中，你或许已经发现，我们从lin的核心库中导入了`lin_config`，并且使用`lin_config.get_config('poem.limit')`获取到了配置，那么配置文件定义在哪里呢？
我们打开`poem/config.py`配置文件，可以发现，Lin建议用户定义的配置项是小写的。如果你开发的插件有更多的配置，都可以在这个文件中添加。
```python
# app/plugins/poem/config.py
limit = 20
```

此处设置了limit为20，由于我们在 `setting.py` 中也有**limit**的相关配置，`lin_config`会优先调用setting.py中的配置。修改`setting.py`中的 limit 为5，再次调用接口，可发现接口返回了5条古诗词的记录。

## 小结

在本小节，我们通过 poem 这个插件示例，学习了插件的开发规范和加载流程，请在`controller.py`文件中查看相应的 api。

我们还通过修改配置来限制获取古诗词的数量，请注意配置很重要，真的很重要，它给了插件很大的灵活性。

但是，在此你可能会疑惑，插件的配置与 Flask 的配置有何区别？为何我们还需要一个插件的配置，而不是直接从 Flask 中读取。

原因有如下几点:

- Flask 的配置依赖 Flask 的上下文。在 Flask 中读取配置，你必须在 Flask 的上下文中才能读取到相应的配置，而我们的插件是通过路径加载的，它的加载先于 Flask 的上下文创建，因此很多配置只能在视图函数中使用，这不够灵活。

- 插件的配置既可以在 config.py 中配置，也可以在 setting.py 中更改，Flask 本身的配置机制不能够满足如此需求。

- 再者，Flask 的配置有明确的要求，所有字母均要求大写，但很多时候如`poem`名称，我们还是觉得小写比较直观，而且我们必须让取配置更加方便，如`lin_config.get_config('poem.limit')`可直接取到 poem 下的 limit 配置。很多时候插件的配置是层叠的，我们支持二级直接取配置。

插件的实战到这里就结束了，你可能觉得会有些短，有些少。但是这确实是真实的情况，因为插件本身就很简单，你完全可以把它理解为一个**微 app**。按照我们之前的开发规范来开发插件即可。
<RightMenu />
