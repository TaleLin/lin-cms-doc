---
title: 项目结构及开发规范
---

# <H2Icon /> 项目结构及开发规范

:::warning

阅读本小节前，请确保你已经完成了[上一节](../../start/koa/README.md)的内容，当然
你非常熟悉 koa 的开发也可直接阅读本小节

:::

## 项目结构

> koa 是一个优美的微框架。这既是一件好事——你可以按照自己的习惯和想法来组织你的项
> 目，不过对于团队来说这可能是一件坏事——团队每个人都有自己的喜好，这会使整体项目
> 的结构很混乱。因此我们提供了 starter 模板项目，它是我们团队从诸多项目开发中提
> 炼而来的一种规范，它不仅仅是结构，风格还有诸多细节，你会在后续逐渐了解到。

```bash
app
├── api                 # api 层
│   ├── cms             # 关于 cms 的 api
│   │   ├── admin.js
│   │   ├── log.js
│   │   ├── test.js
│   │   └── user.js
│   └── v1              # 普通api
│       └── book.js
├── config              # 配置文件目录
│   ├── code-message.js # 返回成功码错误码和返回信息配置
│   ├── log.js          # 日志配置文件
│   ├── secure.js       # 安全性配置文件
│   └── setting.js      # 普通配置文件
├── dao                 # 数据库操作
│   ├── admin.js
│   ├── book.js
│   ├── log.js
│   └── user.js
├── extension           # 扩展目录
├── lib                 # 其它类库
│   ├── db.js           # Sequelize 实例
│   ├── exception.js    # 异常类库
│   ├── type.js         # 枚举
│   └── util.js         # 助手函数
├── middleware          # 中间件目录
│   ├── jwt.js
│   └── logger.js
├── model               # 模型层
│   ├── book.js
│   ├── file.js
│   ├── group-permission.js
│   ├── group.js
│   ├── log.js
│   ├── permission.js
│   ├── user-group.js
│   └── user.js
├── plugin              # 插件目录
├── validator           # 校验层
│   ├── admin.js        # 校验器模块
│   ├── book.js
│   ├── common.js
│   ├── log.js
│   └── user.js
├── app.js              # 创建koa实例及应用扩展
└── starter.js          # 程序的启动文件
```

上面是 starter 项目的整体结构，开发时我们强烈建议你遵循如下规范开发，在前期你肯
定会不适应，但慢慢地你会爱上它。

- 在 `app/api` 文件夹中开发 API，并将不同版本，不同类型的 API 分开，如：v1 代表
  第一版本的 API，v2 代表第二版本，cms 代表属于 cms 的 API。
- 将程序的配置文件放在 `app/config` 文件夹下，并着重区分 `secure（安全性配置）`
  和 `setting（普通性配置）`。配置更详细内容参考[配置](./config.md)
- 将可重用的类库放在 `app/lib` 文件夹下。
- 将数据模型放在 `app/model` 文件夹下。
- 将开发的插件放在 `app/plugin` 文件夹下。
- 将校验类放在 `app/validator` 文件夹下。

:::tip

在你自己的实际开发中你可能不需要`dao`这一层，对于简单的模型操作，我们建议你直接
在视图函数中操作，而对于复杂的操作，我们建议你为每一类的 router 封装一个 dao。

dao 全称 **data access object**，主要是负责数据对对象的操作，实际上它也属于模型
层，属于 MVC 中的 M 层。

:::

## 开发规范

### API 规范

koa 的 API 开发规范是一个很棘手的问题，目前社区中知名的基于 koa 二次的开发的
think.js 与 egg.js 都为 API 的开发引入了 Controller 这个概念。但 koa 官方以及它
的生态大多都是以匿名函数的形式来进行 API 的开发的。koa-router 是目前很流行的路由
管理库，它也遵循了匿名函数这一方式。所以 Lin 仍然是选择了与 koa 官方文档一致的做
法，通过匿名函数来进行 API 的开发，从而降低学习成本。

Lin 是一套高可用的 CMS 系统，因为权限的控制是必须的，但是 koa-router 本身并不能
满足我们的需求，因此我们在 koa-router 的基础上扩展除了 LinRouter 这一概念，它
100%兼容了 koa-router 的开发，并且也提供了相应的方式进行权限的配置与管理。

一般的，我们推荐你在一类 API 中新建一个 router(如 Book 这一类，它负责与图书相关
的 API)。如下：

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
```

如果你熟悉 koa 和 koa-router，你会发现这几乎与 koa 的标准开发方式一样。新建
router 时，你需传入红图的前缀`prefix`，如`/v1/book`，而后红图会自己在访问的 url
中加入`/v1/book`前缀。当然你可以查看 koa-router
的[文档](https://github.com/ZijianHe/koa-router)，获得更多的初始化参数。

### 数据库模型规范

koa 本身并非对数据库做出支持，Lin 通过集成`sequelize`这个 orm 库来进行数据访问，
如果你不熟悉，请先阅读[官方文档](http://docs.sequelizejs.com/)。

`Sequelize` 实例放在`app/lib/db.js`文件，你可以通过如下方式拿到这个实例：

```js
// 路径根据实际情况进行引入
import sequelize from '../../lib/db';
// 使用 Sequelize 实例
await sequelize.query(...);
```

### 异常处理规范

提起异常，大多时候我们都并不想碰见，因为它经常会与程序 crash 一起出现。但它确实
又是程序中不可或缺的一部分，在 Lin 中我们默认集成了全局异常处理机制。因此不论你
程序出现何种异常，都将会返回固定格式的提示信息给前端。对于前端来说，这是非常友好
的一种交互。

在项目开发中我们强力推荐，甚至可以说是**要求**你在开发的过程中，关于某一类的异常
一定要通过继承`HttpException`的方式来自定义，这会让前后端的交互更加友好。

当然，当你每自定义一个异常后，别忘记在根目录下的`code.md`中记录相关异常的
error_code 和 msg，方便前端查阅和团队协作。

### 数据校验规范

我们强烈建议你为每个有数据校验的接口定义一个相应的校验类。Lin 整合
了`validator.js`这个好用的校验库，并提供了一个基础的校验类`LinValidator`来方便参
数的校验。 validator.js 包含了很多的校验函数，你可以查
看[官方文档](https://github.com/chriso/validator.js)。

```js
class BookSearchValidator extends LinValidator {
  constructor() {
    super();
    this.q = new Rule("isNotEmpty", "必须传入搜索关键字");
  }
}
```

如上，我们定义了一个图书搜索的校验类，在`BookSearchValidator`类中定义了一个字
段`q`，并且传入了 q 的校验规则为 `isNotEmpty`，表示 q 不可为空。该字段会对前端传
入的数据做出校验，若传入的数据中不存在`q`字段，则会返回前端一个错误信息，错误信
息为`必须传入搜索关键字`。

到这里，你或许未发现校验类的可取之处，因为这个简单的校验直接在视图函数中实现，或
许更为直接和简单。

但是，一旦我们的数据变多，且校验规则变得复杂，如下：

```js
class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.username = [
      new Rule("isNotEmpty", "昵称不可为空"),
      new Rule("isLength", "昵称长度必须在2~10之间", 2, 10)
    ];
    this.group_id = new Rule("isInt", "分组id必须是整数，且大于0", {
      min: 1
    });
    this.email = [
      new Rule("isOptional"),
      new Rule("isEmail", "电子邮箱不符合规范，请输入正确的邮箱")
    ];
    this.password = [
      new Rule(
        "matches",
        "密码长度必须在6~22位之间，包含字符、数字和 _ ",
        /^[A-Za-z0-9_*&$#@]{6,22}$/
      )
    ];
    this.confirm_password = new Rule("isNotEmpty", "确认密码不可为空");
  }

  validateConfirmPassword(data) {
    if (!data.body.password || !data.body.confirm_password) {
      return [false, "两次输入的密码不一致，请重新输入"];
    }
    let ok = data.body.password === data.body.confirm_password;
    if (ok) {
      return ok;
    } else {
      return [false, "两次输入的密码不一致，请重新输入"];
    }
  }
}
```

可以发现，当我们需要校验的参数变得复杂时，一个专注于校验的类可以让我们的代码变得
更易维护，提升代码整体的可读性。

Lin 的校验器十分灵活，详细内容的请参考[校验器](./validator.md)这一节。

### 配置规范

在我们的 starter 项目中，统一把项目的配置文件放在了`app/config`文件夹下。当然，
我们也强烈建议你如此做。不仅如此，由于 Node.js 的特点你必须导出每一个配置项。

```js
"use strict";

module.exports = {
  apiDir: "app/api"
};
```

如上我们导出了 apiDir 这个配置项，Lin 会自动将配置加载到 config 中，如果你需要扩
展配置，请直接在`module.exports`中添加其他的配置项，详细内容的请参
考[配置](./config.md)这一节。

## 小结

到此，我们介绍了项目的结构和开发规范。本小节注重的不是项目的开发实现与细节，而是
项目的整体与规范，对于很多人来说，去适应一个规范会觉得不舒服，但对于团队来说，这
是一件必须的事。最后，送大家一句话——越规矩，越自由。

<RightMenu />
