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

## Server 端必备环境

- 安装`MySQL`（version： 5.6+）

- 安装`Python`环境(version： 3.6+)

## 获取工程项目

打开你的命令行工具（terminal），在其中键入:

```bash
git clone https://github.com/TaleLin/lin-cms-flask.git starter
```

:::tip
此处我们以 `starter` 作为工程名，当然你也可以以任意你喜爱的名字作为工程名。

如果你想以某个版本，如`0.0.1`版，作为起始项目，那么请在 github 上的版本页下载相应的版本即可。
:::

## 安装依赖包

我们强烈建议使用 Python 的虚拟环境来安装依赖包，推荐使用 Pipenv 来创建虚拟环境。关于`Pipenv`的更多使用请参考[Pipenv 官网](https://pipenv.readthedocs.io/en/latest/)。接下来，继续在命令行中输入：

```bash
cd starter && pipenv install --dev
```

执行此命令前，请确保系统中已成功安装了 pipenv。这将为 Lin 创建一个虚拟环境并安装所有依赖包。如果你不想使用虚拟环境，那么键入以下命令：

```bash
cd starter && pip install -r requirements.txt
```

这将调用系统环境中的 pip 来安装依赖包。

## 数据库配置

Lin 需要你自己在 MySQL 中新建一个数据库，名字由你自己决定。例如，新建一个名为 lin-cms 的数据库，数据库字符编码设置为`utf-8`。接着，我们需要在工程中进行一项简单的配置。使用编辑器打开 Lin 工程的`app/config/secure.py`，找到如下配置项：

```py
# 数据库配置示例
SQLALCHEMY_DATABASE_URI = 'mysql+cymysql://root:123456@localhost:3306/lin-cms'
```

请在`SQLALCHEMY_DATABASE_URI`这项中配置 MySQL 数据库的用户名、密码、ip、端口号与数据库名。**请务必根据自己的实际情况修改此配置项**。

:::warning
你所使用的数据库账号必须具有创建数据表的权限，否则 Lin 将无法为你自动创建数据表
:::

## 运行

一切就绪后，再次从命令行中使用 Python 命令运行项目根目录下的`starter.py`：

```bash
python starter.py
```

如果你是以 pipenv 创建的虚拟环境，那么请先通过下面命令进入虚拟环境，再运行上面的命令。

```bash
pipenv shell
```

如果一切顺利，你将在命令行中看到项目成功运行的信息。如果你没有修改代码，Lin 将默认在本地启动一个端口号为 5000 的端口用来监听请求。此时，我们访问http://localhost:5000，将看到一组字符：

“心上无垢，林间有风"

这证明你已经成功的将 Lin 运行起来了，Congratulations！

欣喜之余，请你运行一下根目录下的`add_super.py`文件，我们会为在数据库中新建一个超级管理员账户，方便你后续在前端登陆。

```bash
python add_super.py
```

如果你安装时遇到问题，那么尝试看看[常见问题汇总](../../server/flask/questions.md)，看能否解决，或者去我们的 github 仓库看 issue。如果没有出现你的问题，请给我们提 issue。

<RightMenu />
