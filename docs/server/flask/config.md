---
title: 配置
---

# <H2Icon /> 配置

## 前言

我们曾不止一次的提到，Lin 是一个基于 Flask 的框架，你可以把 Lin 理解成一个 Flask 的上层框架。这个概念**很重要**，意味着你可以在 Lin 中去使用 Flask 的一切特性，它支持三种配置方式:

1. 环境变量的方式
   通过加载记录环境变量的文件，如`.flaskenv`,`.development.env`文件，来导入环境变量配置。
2. 配置文件的方式
   通过加载专门的配置文件，如`app/config/development.py`文件，来导入配置。
3. 硬编码的方式。
   你可以直接在代码中通过值的方式来进行配置。

当然，优先级也是依次递增的。

## Lin-CMS-Flask 配置加载顺序

1. 从 .flaskenv 中读取 Flask 本身的环境变量。

   - FLASK_ENV：启动环境，development, testing and production. **决定加载配置的入口**
   - FLASK_RUN_HOST: 启动监听 IP 地址
   - FLASK_RUN_PORT: 启动监听端口
   - FLASK_APP: 启动入口，flask 核心对象

2. 根据`FLASK_ENV`的启动环境，读取此环境对应的项目配置 env。

   > **Tips:**
   >
   > 比如`FLASK_ENV`指定以`development`环境启动，则读取`.development.env`
   >
   > 一般包含私密配置，建议不要将此文件上传的公开仓库。

   - SQLALCHEMY_DATABASE_URI: 数据库链接
   - SECRET_KEY: FLASK 密钥

3.根据`FLASK_ENV`的启动环境，读取此环境对应的项目配置 py。

> **Tips:**
>
> 比如`FLASK_ENV`指定以`development`环境启动，则读取`app/config/development.py`

默认情况下在此 python 配置文件中继承了我们提供的初始配置，你也可以根据需要覆盖其配置，如:

```pytyhon
    # 指定加密KEY
    SECRET_KEY = os.getenv("SECRET_KEY", "https://github.com/TaleLin/lin-cms-flask")

    # 指定数据库
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        "sqlite:////" + os.getcwd() + os.path.sep + "lincms.db",
    )

    # 指定访问api服务的url, 用于本地文件上传
    SITE_DOMAIN="https://lincms.example.com"

    # 令牌有效期配置
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    # 默认文件上传配置
    FILE = {
        "STORE_DIR": "app/assets",
        "SINGLE_LIMIT": 1024 * 1024 * 2,
        "TOTAL_LIMIT": 1024 * 1024 * 20,
        "NUMS": 10,
        "INCLUDE": set(["jpg", "png", "jpeg"]),
        "EXCLUDE": set([]),
    }

    # 运行日志
    LOG = {
        "LEVEL": "DEBUG",
        "DIR": "logs",
        "SIZE_LIMIT": 1024 * 1024 * 5,
        "REQUEST_LOG": True,
        "FILE": True,
    }
```

## 自定义配置文件

你也可以完全按照需要自己定义全套配置文件：

1. 从`.flaskenv`开始，指定 flask `FLASK_ENV`为`myenv`。
2. 创建`.myenv.env`, `app/config/myenv.py`。
3. 对照样例代码补充自己的配置逻辑。

## （Optional）无关上下文和核心对象的全局配置

初始化核心对象调用`create_app`传参时， 以 `config_`开头的关键字参数，传入的对象会被挂载到`lin.config.global_config`字典下，作为可被全局调用的配置。
例如:

```python
app = create_app(
    ...
    config_MESSAGE=MSG,
    ...
)
```

可以通过以下方式获取：

```python
from lin.config import global_config
message = global_config.get("MESSAGE")
```
