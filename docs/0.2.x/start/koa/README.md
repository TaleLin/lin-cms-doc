---
title: 起步
---

# <H2Icon /> 起步

## 你需要了解

入门一个新框架最好的方式就是将这个框架的 demo 运行起来。由于 Lin 采用的是前后端
分离的架构，所以相比于传统的网站，它的环境搭建会稍显麻烦。但 Lin 并没有采用任何
冷门的技术，相比于传统网站，只不过多出了一些对于 Vue 运行环境的支持。

lin-cms-koa 依赖 Node.js 环境，在使用前请确保你已经搭建好了 Node 的环境，且版本
保证在`v8.14.0`以上，在项目中我们运用到了大量的 ES6 新特性，尤其是 `async` 和
`await`。

下面，我们将详细阐述安装的步骤，让你轻松将 Lin 运行起来。

:::tip

对于初学者，我们建议首先安装 Server 的环境，在将 Server 端运行、调试通过后再进行
Client 的安装和配置。

:::

## Server 端必备环境

- 安装 `MySQL`（version： 5.6+）

- 安装 `Node.js`环境 (version： 8.14.0+)

## 获取工程项目

打开你的命令行工具（terminal），在其中键入:

```bash
git clone https://github.com/TaleLin/lin-cms-koa.git starter
```

:::tip

此处我们以 `starter` 作为工程名，当然你也可以以任意你喜爱的名字作为工程名。如果
你想以某个版本，如 `0.0.1` 版，作为起始项目，那么请在 github 上的版本页下载相应
的版本即可。

:::

## 安装依赖包

如果你使用**npm**

```bash
cd starter && npm install
```

如果你使用**yarn**

```bash
cd starter && yarn
```

## 数据库配置

Lin 需要你自己在 MySQL 中新建一个数据库，名字由你自己决定。例如，新建一个名为
lin-cms 的数据库，数据库字符编码设置为`utf8mb4`。接着，我们需要在工程中进行一项
简单的配置。使用编辑器打开 Lin 工程的`app/config/secure.js`，找到如下配置项：

```js
module.exports = {
  db: {
    database: "lin-cms",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    logging: false
  }
};
```

请在`db`这项中配置 MySQL 数据库的用户名、密码、ip、端口号与数据库名。**请务必根
据自己的实际情况修改此配置项**。

:::warning

你所使用的数据库账号必须具有创建数据表的权限，否则 Lin 将无法为你自动创建数据表

:::

### 导入数据

数据库配置完成后需要导入数据，在你的开发环境 RDBMS 中，新建一个数据库，数据库名应当和上面配置的`database`字段相同，如`lin-cms`。

然后找到根目录下的`/schema.sql`文件，并在 MySQL 中执行该脚本文件。

推荐你使用 navicat 等数据库工具导入并执行脚本文件，如果你熟悉 mysql 客户端工具， 也可使用它导入数据。

此时脚本会为你创建一个名为`root`的超级管理员账户，默认密码为`123456`。

## 运行

一切就绪后，我们来运行项目：

如果你喜爱 npm scripts 的方式来运行，那么输入如下命令：

```bash
npm run start:dev
```

或者直接从命令行中使用命令运行项目 app 目录下的`index.js`：

```bash
node index.js
```


如果一切顺利，你将在命令行中看到项目成功运行的信息。如果你没有修改代码，Lin 将默
认在本地启动一个端口号为 5000 的端口用来监听请求。此时，我们访
问http://localhost:5000，将看到一组字符：

“心上无垢，林间有风"

这证明你已经成功的将 Lin 运行起来了，Congratulations！

如果你安装时遇到问题，那么尝试看
看[常见问题汇总](../../server/koa/questions.md)，看能否解决，或者去我们的
github 仓库看 issue。如果没有出现你的问题，请给我们提 issue。

<RightMenu />
