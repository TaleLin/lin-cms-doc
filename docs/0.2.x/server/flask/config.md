---
title: 配置
---

# <H2Icon /> 配置

## 前言

我们曾不止一次的提到，Lin 是一个基于 Flask 的框架，你可以把 Lin 理解成一个 Flask 的上层框架。这个概念**很重要**，意味着你可以在 Lin 中去使用 Flask 的一切特性。

配置是应用中一个很重要的部分，一般的我们把通用性、安全性的参数提取为一个配置项。当修改这个配置时，在应用中所有使用该配置的地方都会同时生效。

Flask 框架本身提供了两种配置方式。

- 硬编码的方式。
  你可以直接在代码中通过`app.config['DEBUG'] = True`这种赋值的方式来进行配置。
- 配置文件的方式
  通过加载专门的配置文件，如`setting.py`文件，来导入配置。

Lin 本身并未对 Flask 的配置方式进行任何更改和扩展。在这里我们便不再详细赘述，如果你不熟悉请先阅读 Flask 的配置文档[Flask](http://flask.pocoo.org/docs/1.0/config/#configuration-basics)。

## Lin 的既有配置

在[项目结构及开发规范](./README.md)一节中，我们谈到所有的配置文件均在`app/config`该目录下，并着重区分了`setting.py`（普通配置）和`secure.py`（安全配置，如数据库密码等）这两个配置文件。

下面我们来详细说明一下这两个文件里面配置的作用：

```py
# secure.py
# 安全性配置
SQLALCHEMY_DATABASE_URI = 'mysql+cymysql://root:123456@localhost:3306/lin-cms'

SECRET_KEY = '\x88W\xf09\x91\x07\x98\x89\x87\x96\x20A\xc63\xf9\xecJJU\x17\xc5V\xbe\x8b\xef\xd7\xd8\xd3\xe6\x95*4'
```

- SQLALCHEMY_DATABASE_URI。数据库配置项，默认数据库为`mysql`，数据库在本地`localhost`，端口号默认`3306`，数据库名默认`lin-cms`，账户名默认`root`，密码默认`123456`。如你需更改数据库配置，请在此项更改。

- SECRET_KEY。 用于令牌生成的密匙，此处请务必修改，防止密匙与他人一样导致令牌被破解。

```py
# setting.py
# 基础配置

from datetime import timedelta

# 分页配置
COUNT_DEFAULT = 10
PAGE_DEFAULT = 0

# 令牌配置
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
```

- COUNT_DEFAULT。分页配置，每页的数目，默认`10`。

- PAGE_DEFAULT。分页配置，默认从第`1`页开始。

- JWT_ACCESS_TOKEN_EXPIRES。 `access_token`的过期时间，默认为 1 小时（推荐）。
