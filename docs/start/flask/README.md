---
title: 后端起步
---

# <H2Icon /> 后端起步

## 你需要了解

入门一个新框架最好的方式就是将这个框架的 demo 运行起来。由于 Lin 采用的是前后端分离的架构，所以相比于传统的网站，它的环境搭建会稍显麻烦。但 Lin 并没有采用任何冷门的技术，相比于传统网站，只不过多出了一些对于 Vue 运行环境的支持。

Lin 的 Server 端是基于 Python Flask 的, 所以你必须首先在自己的 PC 上安装 Python 环境包。此外，Lin 是一个完整的框架，数据库是必然需要的。

无需担心，我们将详细阐述安装的步骤，让你轻松将 Lin 运行起来。

:::tip
对于初学者，我们建议首先安装 Server 的环境，在将 Server 端运行、调试通过后再进行 Client 的安装和配置。
:::

## 快速开始

### Server 端必备环境

- 安装`Python`环境(version： 3.6+)

### 获取工程项目

打开您的命令行工具（terminal），在其中键入:

```bash
git clone https://github.com/TaleLin/lin-cms-flask.git -b 0.3.x starter
```

> **Tips:** 当前分支不是默认分支，所以需要分支切换到`0.3.x`
>
> 我们以 `starter` 作为工程名，当然您也可以以任意您喜爱的名字作为工程名。
>
> 如果您想以某个版本，如`0.0.1`版，作为起始项目，那么请在 github 上的版本页下载相应的版本即可。

### 安装依赖包

进入项目目录，调用环境中的 pip 来安装依赖包:

```bash
pip install -r requirements-${env}.txt
```

### 数据库配置

#### 默认使用 Sqlite3

Lin 默认启用 Sqlite3 数据库，打开项目根目录下的.env 文件(我们提供了开发环境的`.development.env`和生产环境的`.production.env`)，配置其`SQLALCHEMY_DATABASE_URI`

> Tips: 下面我们用{env}指代配置对应的环境

```conf
# 数据库配置示例
    SQLALCHEMY_DATABASE_URI='sqlite:///relative/path/to/file.db'

    or

    SQLALCHEMY_DATABASE_URI='sqlite:////absolute/path/to/file.db'
```

这将在项目的最外层目录生成名为`lincms${env}.db`的 Sqlite3 数据库文件。

#### 使用 MySQL

**Tips:** 默认的依赖中不包含 Python 的 Mysql 库，如有需要，请自行在您的运行环境中安装它（如`pymysql`或`cymysql`等）。

Lin 需要您自己在 MySQL 中新建一个数据库，名字由您自己决定(例如`lincms`)。

创建数据库后，打开项目根目录下的`.${env}.env`文件，配置对应的`SQLALCHEMY_DATABASE_URI`。

如下所示：

```conf
# 数据库配置示例: '数据库+驱动库://用户名:密码@主机:端口/数据库名'
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:123456@localhost:3306/lincms'
```

> 您所使用的数据库账号必须具有创建数据表的权限，否则 Lin 将无法为您自动创建数据表

### 初始化

如果您是第一次使用 **`Lin-CMS`**，需要初始化数据库。

请先进入项目根目录，然后执行`flask db init`,用来添加超级管理员 root(默认密码 123456), 以及新建其他必要的分组

> **Tips:**
> 如果您需要一些业务样例数据，可以执行脚本`flask db fake`添加它

### 运行

一切就绪后，再次从命令行中执行

```bash
flask run
```

如果一切顺利，您将在命令行中看到项目成功运行的信息。如果您没有修改代码，Lin 将默认在本地启动一个端口号为 5000 的端口用来监听请求。此时，我们访问`http://localhost:5000`，将看到一组字符：

“心上无垢，林间有风"

点击“心上无垢”，将跳转到`Redoc`页面；点击“林间有风”，跳转到`Swagger`页面。

这证明您已经成功的将服务运行起来了，Congratulations！


如果你安装时遇到问题，那么尝试看看[常见问题汇总](../../server/flask/questions.md)，看能否解决，或者去我们的 github 仓库看 issue。如果没有出现你的问题，请给我们提 issue。

<RightMenu />
