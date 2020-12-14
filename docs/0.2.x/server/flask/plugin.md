---
title: 插件机制
---

# <H2Icon /> 插件机制（目前处于测试状态）

> 本小节让我们来详细介绍一下 Lin 的精髓——插件机制
> 我们在这里再次强调，诸如 Flask-JWT 这样的第三方库，Flask 官方把它称之为`扩展`（extension）
> 而在 Lin 中，我们的插件（plugin）某种程度上类似于扩展，但是它们完全不是一种东西！

## 插件的规范

首先，我们通过 一个 oss（用于图片上传到本地或阿里云） 插件来看看插件的目录规范和开发规范。

### 目录规范

```bash
├───oss
│   │   config.py // 配置文件（必需），记录关于插件的可用配置
│   │   info.py // 当前插件信息文件
│   │
│   └───app // 应用开发目录
│           controller.py  // 控制层，每个控制层文件要求只有一个红图实例，当然你可以将文件名换成你喜欢的名字，而且你也可以拥有多个红图实例文件
│           enums.py // 枚举类文件
│           oss.py // 日志核心类库，插件的核心文件，如oss插件的核心文件为oss.py，当然你也可有多个核心文件
│           model.py // 模型层，数据库模型类
│           __init__.py // 导出文件（必需）。重要！！！
```

Lin 的插件可能与你以前了解的插件概念不一样，_你可以把每个插件理解为一个小 app_。每个插件都有自己的配置、控制层、模型层甚至校验层（forms），换言之每个插件都有自己的业务，它的功能很像**微服务**，即每个插件只负责完成某一项功能。

### 开发规范

由于插件本身就是一个微型的 app，插件的开发规范与项目的开发规范几乎一致，如果你还不够熟悉，那么请你再次阅读[开发规范](./README.md)。

当然，插件这里也有一个自己独特的机制——加载。在前面，我们在介绍项目开发时，红图以及模型都是我们主动去通过`import`导入的。但是在插件中，我们可以不用做这件事情，因为 Lin 会自动通过 loader（加载器）来帮我们做这件事，loader 可以帮我们自动去加载插件中的红图 api 和数据模型类。

但是，在你开发的插件中，你必须明确告诉 loader，因为 loader 真的不够聪明，它到底该加载哪些东西。而`oss/app/__init__.py`这个文件则扮演这个角色，它里面的代码很简单，如下：

```py
from .controller import api
from .model import Image
```

在代码的第一行，我们从当前目录中的`controller`导入了`api`这个红图，第二行从`model`中导入了`Image`这个模型类。而后，loader 会自动的从`__init__.py`文件得到刚才导出的`api`和`Image`，然后存储到自身的容器中。

当然，在`__init__.py`你可以导入多个的红图和模型，如你还可能需要加载另外一个红图`some_api`和另外一个模型`Some`，接下来你应该在上段的代码中加入：

```py
from .some import some_api
from .model import Some
```

被 loader 加载红图会被直接挂载到默认的 plugin 蓝图中，你可通过相应的 url 直接访问。而加载的模型你可通过如下的方式得到：

```py
from lin.core import manager # 得到manager
Image = manager.get_model('Image') # 得到加载到容器中的Log模型
```

当然如果你不喜欢这种方式，你也可以通过`import`方式得到这个模型：

```py
from lin.plugins.oss.app.model import Image
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
    self.load_plugins_config() # 加载插件配置
    self.load_plugins() # 加载插件
```

这里大致的流程是这样的，loader 率先从主 app 中读取插件的路径和配置（setting.py 文件中），然后加载每个插件单独的配置，最后加载插件。

```bash
|--------------|           |-------------------|              |----------|
| 加载插件配置  |   ---->    |  加载插件各自配置  |     ---->      | 加载插件 |
|--------------|           |-------------------|              |----------|
```

接下来我们继续，在 Loader 类中还有两个方法`_load_plugin`和`_load_config`，这两个方法是 loader 的核心方法，由它们向容器中加载插件和插件配置。这两个方法的思路很明确，我们相信你完全可以自己理解。

好，插件的整体流程的梳理到此已经结束了。如果你感到疑惑，请记住 loader 的加载本身只是一个很简单的过程，当你亲身通过断点 Debug 的方式去运行程序时，你就会觉得豁然开朗。

## 小结

在本节中，我们梳理插件的概念与流程，并通过`oss`这个插件来熟悉了插件的规范，当然插件的精彩绝不止于此，在下一节我们会[实操](./plugin_practice.md) 插件。

<RightMenu />
