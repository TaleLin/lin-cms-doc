---
title: 配置
---

# <H2Icon /> 配置

## 前言

koa 本身没有任何关于配置的实现，而任何一个可用的应用都离不开配置这个重要的组成部
分。 Lin 在配置方面没有将其于 koa 强绑定在一起，而是将其单独抽离出来，这样你就可
以在任何地方拿到这个配置。 Lin 提供了两种配置方式。

- 硬编码的方式。你可以直接在代码中通
  过`config.setItem()`或`config.getConfigFromObj()`这种赋值的方式来进行配置。
- 配置文件的方式。Lin 可以通
  过`config.getConfigFromFile("app/config/setting.js")`加载专门的配置文件，
  如`setting.js`文件，来导入配置。

Lin 的配置实现的非常简单，我们仅仅通过 Node.js 自带的`require`方式来导入配置，并
给 config 实例提供了诸多便利的方法。

## Lin 的既有配置

在[项目结构及开发规范](./README.md)一节中，我们谈到所有的配置文件均
在`app/config`该目录下，并着重区分了`setting.js`（普通配置）和`secure.js`（安全
配置，如数据库密码等）这两个配置文件。

下面我们来详细说明一下这两个文件里面配置的作用：

```js
# secure.js
# 安全性配置
"use strict";

module.exports = {
  // 数据库配置项
  db: {
    database: "lin-cms4",// 数据库名，请现在数据库中新建你自己的数据库
    host: "localhost",// 数据库host
    port: 3306,// 数据库端口
    username: "root",// 用户名
    password: "123456",// 密码
    logging: false// 是否打印sql的日志
  },
  // 令牌的secret 重要！！！，千万不可泄漏，也请更换！
  secret:
    "\x88W\xf09\x91\x07\x98\x89\x87\x96\xa0A\xc68\xf9\xecJJU\x17\xc5V\xbe\x8b\xef\xd7\xd8\xd3\xe6\x95*4"
};
```

```js
# setting.js
# 基础配置

"use strict";

module.exports = {
  // 分页参数，每页的个数
  countDefault: 10,
  // 分页参数，默认的开始页
  pageDefault: 0,
  // api目录，默认从 app/api目录中自动加载所有api
  apiDir: "app/api",
  // access token 的过期时间 默认 1 个小时
  accessExp: 60 * 60, // 1h 单位秒
  // debug 模式
  debug: true,
  // refreshExp 设置refresh_token的过期时间
  // 插件配置，暂时未开放
  // 暂不启用插件
  pluginPath: {
  }
};
```

`pluginPath`是插件的配置项，插件我们将在后续推出，敬请期待。

`debug`模式会默认打开，输出相关的日志，生产环境下建议关掉。

## 获取配置

当 config 加载所有的配置后，我们可以通过函数`getItem`获取配置，如：

```js
import { config } = from "lin-mizar/lin/config";

const count = config.getItem("countDefault");
```

这样我们就可以获取配置文件中的`exports.countDefault`项，对于嵌套的配置项，
如`db`下的`database`，由于`db`是一个 object，我们可以通过：

```js
config.getItem("db");
```

这样的方式拿到整个 db 配置，也可以通过：

```js
config.getItem("db.database");
```

获取 db 下的 database 单个配置项。

### apiDir

Lin 在 api 的开发上沿袭了社区很火的**约定大于配置**的方式。因此你无需主动的将你
开发的 api 挂到路由上，而 Lin 能自动帮你完成。

默认指定的`apiDir`为 app/api，意味着你在该目录下的 koa-router 实例均会自动被挂载
到主路由上。如：

```js
import { LinRouter } from "lin-mizar";

const bookApi = new LinRouter({
  prefix: "/v1/book"
});

bookApi.get("/:id", async ctx => {
  ctx.json({
    msg: "hello, I am a book"
  });
});

module.exports = { bookApi };
```

bookApi 是一个 koa-router 的实例(LinRouter 继承自 koa-router)，你只需在当前模块
中导出 bookApi，Lin 便会自动加载 bookApi。

Lin 默认会自动加载每个模块下导出的 koa-router 实例，但是有时候我们希望当前模块下
的实例不被加载到主路由上。这个时候，你只需告诉加载器放弃当前模块的加载即可。

```js
import { disableLoading } from "lin-mizar";
// 省略
module.exports = { bookApi, [disableLoading]: false };
```

`disableLoading`是 Lin 定义的一个 Symbol，它是唯一的，你只需要设置当前模块的
disableLoading 为 true，Lin 便会跳过当前模块的，不会加载其中的路由。

<RightMenu />
