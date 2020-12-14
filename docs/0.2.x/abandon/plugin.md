---
title: 插件机制
---

# <H2Icon /> 插件机制

> 本小节让我们来详细介绍一下 Lin 的精髓——插件机制

## 插件的规范

首先，我们通过 Lin 的默认 logger 插件来看看插件的目录规范和开发规范。

### 目录规范

```bash
├───logger
│   │   config.py // 配置文件，记录关于插件的可用配置，所有配置项名均为大写，与starter项目的配置规范一致
│   │
│   └───app // app目录开发
│           controller.py  // 控制层，每个控制层文件要求只有一个红图实例，当然你可以将文件名换成你喜欢的名字，而且你也可以拥有多个红图实例文件
│           forms.py // 校验层，存放校验类文件
│           log.py // 日志核心类库，插件的核心文件，如logger插件的核心文件为log.py，当然你也可有多个核心文件
│           model.py // 模型层，数据库模型类
│           __init__.py // 导出文件。重要！！！
```

Lin 的插件可能与你以前了解的插件概念不一样，_你可以把每个插件理解为一个小 app_。每个插件都有自己的配置、控制层、模型层甚至校验层，换言之每个插件都有自己的业务，它的概念很像**微服务**，即每个插件只负责完成某一项功能。

### 开发规范

由于插件本身就是一个微型的 app，插件的开发规范与项目的开发规范几乎一致，如果你还不够熟悉，那么请你再次阅读[开发规范](./structure_and_specification.md)。

当然，插件这里也有一个自己独特的机制——加载。在前面，我们在介绍项目开发时，红图以及模型都是我们主动去通过`import`导入的。但是在插件中，我们可以不用做这件事情，因为 Lin 会自动通过 loader（加载器）来帮我们做这件事。

所以，在你开发的插件中，你必须明确告诉 loader，因为 loader 真的不够聪明，它到底该加载哪些东西。而`logger/app/__init__.py`这个文件则扮演这个角色，它里面的代码很简单，如下：

```py
from .controller import log_api
from .model import Log
```

在代码的第一行，我们从当前目录中的`controller`导入了`log_api`这个红图，第二行从`model`中导入了`Log`这个模型类。而后，loader 会自动的从`__init__.py`文件得到刚才导出的`log_api`和`Log`，然后存储到自身的容器中。

当然，在`__init__.py`你可以导入多个的红图和模型，如你还可能需要加载另外一个红图`some_api`和另外一个模型`Some`，接下来你应该在上段的代码中加入：

```py
from .some import some_api
from .model import Some
```

被 loader 加载红图会被直接挂载到默认的 CMS 蓝图中，你可通过相应的 url 直接访问。而加载的模型你可通过如下的方式得到：

```py
from lin.core import manager # 得到manager
Log = manager.get_model('Log') # 得到加载到容器中的Log模型
```

当然如果你不喜欢这种方式，你也可以通过`import`方式得到这个模型：

```py
from lin.plugins.logger.app.model import Log
```

## 插件的加载

在[运行流程](./run_process.md)一节中我们留下了一个悬念，那就是插件的加载流程。在 Lin 源代码中，可以在 Manager 的构造函数中找到如下代码段：

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
    self.load_default_plugins_config() # 加载内置插件的配置
    self.load_plugins_config() # 加载插件的配置
    self.load_default_plugins() # 加载内置的插件
    self.load_plugins() # 加载其它插件
```

这里大致的流程是这样的，loader 率先加载内置插件的配置，然后加载其它插件的配置，随后加载内置的插件，最后加载其它插件。

```bash
|-----------------|          |--------------|         |--------------|         |--------------|
| 加载内置插件配置 |  ---->    | 加载插件配置 |  ---->   | 加载内置插件 |  ---->   | 加载其它插件 |
|-----------------|          |--------------|         |--------------|         |--------------|
```

接下来我们继续，在 Loader 类中还有两个方法`_load_plugin`和`_load_config`，这两个方法是 loader 的核心方法，由它们向容器中加载插件和插件配置。这两个方法的思路很明确，我们相信你完全可以阅读[源代码](loader.py)来理解。

好，插件的整体流程的梳理到此已经结束了。如果你感到疑惑，请记住 loader 的加载本身只是一个很简单的过程，当你亲身通过断点 Debug 的方式去运行程序时，你就会觉得豁然开朗。

## 插件的开发

TODO

<RightMenu />
