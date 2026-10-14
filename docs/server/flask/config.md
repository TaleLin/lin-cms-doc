---
title: 配置
---

# <H2Icon /> 配置

## 前言

我们曾不止一次的提到 `Lin` 是一个基于 `Flask` 的框架，你可以把 `Lin` 理解成一个 `Flask` 的上层框架。这个概念**很重要**，意味着你可以在 `Lin` 中去使用 `Flask` 的一切特性，它支持三种配置方式:

1. 环境变量的方式
   通过加载记录环境变量的文件，如`.flaskenv`,`.development.env`文件，来导入环境变量配置。
2. 配置文件的方式
   通过加载专门的配置文件，如`app/config/development.py`文件，来导入配置。
3. 硬编码的方式。
   你可以直接在代码中通过值的方式来进行配置。

当然，优先级也是依次递增的。

## Lin-CMS-Flask 配置加载顺序

1. 从 .flaskenv 中读取 Flask 本身的环境变量。

   - FLASK_ENV：启动环境，可选值 `development` / `production` / `test`，**决定加载配置的入口**。非法值会在启动时直接报错
   - FLASK_RUN_HOST: 启动监听 IP 地址
   - FLASK_RUN_PORT: 启动监听端口
   - FLASK_APP: 启动入口，flask 核心对象

2. 根据`FLASK_ENV`的启动环境，读取此环境对应的项目配置 env。

   > **Tips:**
   >
   > 比如`FLASK_ENV`指定以`development`环境启动，则读取`.development.env`
   >
   > 此文件一般包含私密配置，**已被 .gitignore 忽略，禁止上传公开仓库**。仓库中提供了模板 `.env.example`，首次克隆后请复制为对应环境文件并填入真实值。

   - SQLALCHEMY_DATABASE_URI: 数据库链接
   - SECRET_KEY: FLASK 密钥

   > **注意：SECRET_KEY 为必填项**
   >
   > 若未设置、或仍是 `.env.example` 中的占位符，应用会**拒绝启动**并给出明确提示。
   > 生成方式：`python -c 'import secrets; print(secrets.token_hex(32))'`

3. 根据`FLASK_ENV`的启动环境，读取此环境对应的项目配置 py。

> **Tips:**
>
> 比如`FLASK_ENV`指定以`development`环境启动，则读取`app/config/development.py`
>
> 由于 Flask 对配置项的限制，你必须保证命名全都大写

默认情况下在此 python 配置文件中继承了我们提供的初始配置，你也可以根据需要覆盖其配置，如:

```python
    # 指定加密KEY（必填，无缺省值——缺失或占位符会拒绝启动）
    SECRET_KEY = os.getenv("SECRET_KEY")

    # 指定数据库
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        "sqlite:////" + os.getcwd() + os.path.sep + "lincms.db",
    )

    # 指定访问api服务的url, 用于本地文件上传（未配置时按请求 Host 拼接）
    SITE_DOMAIN="https://lincms.example.com"

    # 令牌有效期配置
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    # 刷新令牌有效期（必须显式配置；框架默认 30 天过长且无法吊销）
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

    # CORS 跨域白名单：开发环境默认放行 localhost/127.0.0.1:5173，
    # 生产环境默认为空（仅同源），跨域部署必须显式配置
    CORS_ORIGINS: list = []

    # 登录验证码开关
    LOGIN_CAPTCHA = False

    # 限流存储：开发默认内存；生产多 worker 部署应配置 redis:// 等共享存储
    RATELIMIT_STORAGE_URI = "memory://"

    # 反向代理场景开启后，按 X-Forwarded-For 还原真实客户端 IP（限流 key 依赖）
    PROXY_FIX = False

    # 默认文件上传配置
    FILE = {
        "STORE_DIR": "assets",
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

## 生产环境专属校验

以 `production` 环境启动时，框架会进行额外的严格校验：

- `SQLALCHEMY_DATABASE_URI` 必须显式配置，缺失直接报错
- 使用 SQLite 会输出告警（仅建议开发/演示用途）
- 限流存储若为内存模式会输出告警（多 worker 下限额按进程各自计数，建议配置 `redis://` 共享存储）
- `/apidoc/*` 文档页面与 `/`、`/hello` 演示路由**不会注册**（API 校验功能不受影响）

## 自定义配置文件

你也可以完全按照需要自己定义全套配置文件：

1. 从`.flaskenv`开始，指定 flask `FLASK_ENV`为`myenv`（需在 `app/__init__.py` 的 `VALID_ENVS` 中登记）。
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
from app.lin import global_config
message = global_config.get("MESSAGE")
```

<RightMenu />
