---
title: 校验器
---

# <H2Icon /> 校验器

<!-- ## 基础校验

Lin 在参数校验上整合了`validator.js`这个十分强大的校验库，不仅如此 Lin 在继承了
validator 的基础上更扩展了一些很有用的校验函数。你可以通过如下方式使用：

```js
const { extendedValidator } = require("lin-mizar/lin/extendedValidator");

extendedValidator.isNotEmpty(args);
```

extendedValidator 在 validator 的基础上，扩展了诸
如`hasProperty`和`objPropertyIsNotEmpty`这些有用的校验方法。

这些方法有很多，你可以通过代码提示或者查看源码来选择可用的校验函数。

不过`extendedValidator`仅仅可用于单项的校验，下面我们看看如何以类的方式进行批量
校验。 -->

## 类校验

对于参数的校验，Lin 提供了类校验这种便捷，好用的方式，它会
对`ctx.request.body(上下文请求体)`、`ctx.request.query(上下文请求query参数)`
、`ctx.request.header(上下文请求头)`、`ctx.param(路由参数)`这些参数进行统一校验
，所以请保证你的参数名**没有重复**。

它的使用方式如下：

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

我们以**RegisterValidator**为例来详细的分析类校验器的使用。

- 必须继承自`LinValidator`这个基类，且需要在构造函数中初始化校验规则。如我们在
  RegisterValidator 的构造函数中定义了 username，group_id 等校验规则。
- 校验规则的规范。如 username 被初始化成一个数组，这个数组里面的必须是 Rule，当
  然也可以是 group_id 这样的单个 Rule。但是你必须给校验规则传入 Rule 或是
  Rule[]。LinValidator 会自动对前端传入数据中的 username 字段进行 Rule 规则的校
  验。
- Rule 规范。Rule 的构造函数中，你可以传入三个参数。

| 参数         | 作用                                                                 |
| ------------ | -------------------------------------------------------------------- |
| validateFunc | 校验函数                                                             |
| message      | 校验失败后返回的信息                                                 |
| options      | 校验函数的参数，如果`validateFunc`为`isOptional`，则这个参数为默认值 |

:::tip

注意，你传入的 validateFunc 为 string 类型时，你实际传入的是`函数名`，当然这些函
数是有限的，这些函数实际上均是`validator.js`上校验函数。

所有可用的函数，你可以参考 validator.js
的[文档](https://github.com/chriso/validator.js)

:::

我们把这些在`constructor`中显示申明的校验规则称为`Rule校验`。Rule 校验是校验器的
基础校验方式，它足够方便，你只需要在构造函数中定义如下的校验字段：

```js
this.username = [
  new Rule("isNotEmpty", "昵称不可为空"),
  new Rule("isLength", "昵称长度必须在2~10之间", 2, 10)
];
```

校验器便可以自动帮助你在参数中找到`username`这个字段，并对这个字段的参数做 Rule
校验。

`username`这个字段显示的被绑定了两个 Rule，它们以数组的形式组成，如果是一个
Rule，直接绑定一个 Rule 即可，如：

```js
this.group_id = new Rule("isInt", "分组id必须是整数，且大于0", {
  min: 1
});
```

当`username`被校验的时候，参数会被链式的校验，即先进行`isNotEmpty`Rule 校验，再
进行`isLength`Rule 校验。如果`username`参数并未通过`isNotEmpty`这个 Rule，当前链
便会中断。如果参数通过了这个链上所有 Rule，则参数的校验可判断为成功。

每个 Rule 的第三个参数是校验参数，它是`validator.js`中校验函数的校验参数。
如`isInt`这个函数可以接受一些参数，我们在 Rule 的第三个参数中传入`{ min: 1 }`，
这些参数便可以被使用到 isInt 这个函数中。它会被这样调用：

```js
isInt("9", { min: 1 });
```

### isOptional

下面我们需要着重了解`isOptional`这个 Rule 校验。单独拿它出来，因为它很特殊。它可
以一定程度上左右我们的检验链。

首先，我们规定如果一个字段参数用到了`isOptional`，那么`isOptional`Rule 最好被放
在校验链的首位。通过字面上，你肯定已经知道了`isOptional`的作用，它可以使一个字段
的校验变的可选。

详细一点，如果一个字段被`isOptional`这个 Rule 所标记，那么这个字段参数
可`有`可`无`。

**有**：当这个参数字段存在的时候，校验器会对它做校验链上的其它校验。如`email`这
个字段，它被标记为`isOptional`，如果这个参数存在（前端传入这个参数），那么 email
会被后面的`isEmail`Rule 所校验。

**无**: 注意，此处的无并非没有。而是一定理念意义上的无。lin-validator 为了保持与
wtforms 上的一致性。规定一下的参数情况可以被定义为**无**。

- 参数不存在。即参数压根没有被前端传入。
- null。如果一个参数为 null，那么它被定义为无。
- 空字符串。如果一个参数为 ""，它被认为无。
- 空格字符串。如果一个参数为字符串，且只有空格，也被视作无。如： " "。

若字段是**有**的状态，那么它会被校验链上后面的 Rule 所校验，如果字段是**无**的状
态，那么这个字段会逃逸，它不会被校验链上后面的 Rule 所捕获。

当定义一个 Rule 为`isOptional`时，可以给该 Rule 传入第三个参数，默认值。如：

```js
new Rule("isOptional", "", "pedrogao1996@gmail.com"),
```

这段代码中的 `10` 就是默认值，请记住默认值是`isOptional`所独有的（目前来说）。

当`isOptional`Rule 被赋有默认值时，这个字段就会发生变化。以`email`为例，当前端没
有传入这个参数时，校验器中的`email`数据肯定是一个`undefined`。但是因为默认值的存
在，这个`email`会被赋予默认值，即`pedrogao1996@gmail.com`。

<!-- validateFunc 是一个很灵活的参数。它可以为 String 也可以为 Function。当
validateFunc 为 String 时，validator 会自动根据字符串的内容在 `validator.js` 中
找到相应的校验函数。并且用该校验函数对前端传入的参数进行校验。当然你也可以自定义
你的校验函数，如:

```js
  passwordCheck(val) {
    if (!this.data.body.password || !this.data.body.confirm_password) {
      return false;
    }
    let ok = this.data.body.password === this.data.body.confirm_password;
    return ok;
  }
```

你可以向 Rule 的 validateFunc 参数传入自定义的 passwordCheck 函数，它必须返回一
个 boolean 值，true 代表校验成功。

在这个自定义的校验函数函数中，你会发现前端传入的数据均会被 Lin 放到`this.data`中
，因此你可以通过它访问任何前端传入的数据。它们的格式如下： -->

### 自定义规则函数

你可能已经发现了在`RegisterValidator`这个校验类中，有一
个`validateConfirmPassword`的函数。

> 我们把以`validate`开头的类方法称之为**规则函数**，我们会在校验的时候自动的调用
> 这些规则函数。

规则函数是校验器中另一种用于对参数校验的方式，它比显示的 Rule 校验具有更加的灵活
性和可操作性。下面我们以一个小例子来深入理解规则函数：

```js
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
```

首先任何一个规则函数，满足以`validate`开头的类方法，除`validate()`这个函数外。都
会被带入一个重要的参数 `data`。data 是前端传入参数的容器，它的整体结构如下：

```js
this.data = {
  body: ctx.request.body, // body -> body
  query: ctx.request.query, // query -> query
  path: ctx.params, // params -> path
  header: ctx.request.header // header -> header
};
```

请记住 data 参数是一个二级的嵌套对象，它的属性如下：

| property |                   来源                   |  类型  | 作用     |
| -------- | :--------------------------------------: | :----: | -------- |
| body     |      ctx.request.body(上下文请求体)      | object | \*\*\*\* |
| query    | ctx.request.query(上下文请求 query 参数) | object | \*\*\*\* |
| path     |           ctx.param(路由参数)            | object | \*\*\*\* |
| header   |            ctx.request.header            | object | \*\*\*\* |

`data`是所有参数的原始数据，前端传入的参数会原封不动的装进 data。通过这个 data
我们可以很方便的对所有参数进行校验，如在`validateConfirmPassword`这个规则函数中
，我们便对`data.body`中的`password`和`confirm_password`进行了联合校验。

我们通过对规则函数的返回值来判断，当前规则函数的校验是否通过。简单的理解，如果规
则返回`true`，则校验通过，如果返回`false`,则校验失败。但是校验失败的情况下，我们
需要返回一条错误信息，如：

```js
return [false, "两次输入的密码不一致，请重新输入"];
```

表示规则函数校验失败，并且错误信息为`两次输入的密码不一致，请重新输入`。

返回值的所有可选项类似如下：

```js
validateNameAndAge() {
  // 表示校验成功
  return true;
  // 校验失败，并给定错误信息
  return [false,"message"]
  // 校验失败，并给定错误信息，以及错误信息的键为nameAndAge
  // 一般情况下，我们会默认生成键，如这个函数生成的键为 NameAndAge，当然你也可以选择自定义
  return [false,"message","nameAndAge"]
}
```

规则函数除了通过返回值来判断失败之外，还可以通过抛出异常来提前结束规则函数并校验
失败。如下：

```js
validateNameAndAge() {
  // 抛出异常，即校验失败
  throw new ParametersException({ msg: "Lin will carry you!" });
  // 返回true，表示校验成功
  return true;
}
```

这两种方式都可以使规则函数校验失败，但是我们推荐你使用第一种方式，即 **返回值方
式**。

## 使用

### 校验

上面我们谈到了类校验的定义与检验函数的使用。那么校验器如何使用，我们从示例工程的
项目看看上面定义的`RegisterValidator`如何去使用。

```js
user.linPost(
  "userRegister",
  "/register",
  {
    permission: "注册",
    module: "用户",
    mount: false
  },
  async ctx => {
    // 使用
    const v = await new RegisterValidator().validate(ctx);
    // 取数据
    const username = v.get("body.username");
    await userDao.createUser(ctx, v);
    ctx.json(
      new Success({
        msg: "用户创建成功"
      })
    );
  }
);
```

通常，我们会在视图函数中初始化一个 validator，当视图函数被调用的时候，会初始化
RegisterValidator，并调用`validate`方法，validate 方法会返回实例化的
RegisterValidator 即`v`。

:::tip

此处的`validate`方法，我们必须使用 await 强制让它同步，只有参数校验成功后才能进
入后面的逻辑，否则抛出异常退出当前视图函数。

:::

### 取参

校验器的另一大功能便是**取参**。lin 提供的 validator 会对 int，float，boolean 和
date 类型的参数做转型，当然这些转型是需要条件的，如：

```js
this.group_id = new Rule("isInt", "分组id必须是整数，且大于0", {
  min: 1
});
```

前端穿参时，由于 js 弱语言的性质，group_id 以字符串的形式被传入，但是我们需要以
int 的类型来使用它，因此我们对 group_id 加上一个 Rule。

校验器会被 group_id 做整型校验，即`isInt`。在做校验的同时，我们还是对 group_id
做转型，即将 group_id 从 string 类型转化为 int 类型。被转化的数据会被存放
在`parsed`里面。我们可以通过`v.get()`来取出相应的参数。

`v.get()`可接受三个参数，如下：

| param      |              说明               |  类型   |
| ---------- | :-----------------------------: | :-----: |
| path       |            参数路径             | string  |
| parsed     | 是否取解析后的参数，默认为 true | boolean |
| defaultVal | 默认值，如果参数为空时取默认值  |   any   |

```js
const username = v.get("body.username");
```

`v.get("body.username")`会取出 body 下面的 username 参数。parsed 默认为 true 即
默认取转型后的参数，但此处的 username 为 string，故转型后仍为 string。

但`v.get("body.group_id")`会取出 int 型的 group_id，如需要原始的数据，你可以这样
`v.get("body.group_id", parsed = false)`。有时候你需要取出整个 body 的参数，你可
以这样 `v.get("body")`。

刚才我们谈到`isOptional`这个 Rule 校验时，提到`isOptional`是可以携带一个默认值参
数的，这个默认值你也可以通过`v.get()`这个函数取到。

接下来我们暂时回到自定义规则函数这一小节中，假如有如下规则函数（伪代码）：

```js
validateStart (data) {
  const start = data.query.start;
  // 如果 start 为可选
  if (isOptional(start)) {
    return true;
  }
  const ok = checkDateFormat(start);
  if (ok) {
    this.parsed['query']['start'] = toDate(start);
    return ok;
  } else {
    return [false, "请输入正确格式开始时间", "start"];
  }
}
```

`start`这个参数是一个字符串形式的时间，如`2019-01-01 12:00:00`，我们首先通
过`checkDateFormat`这个函数对这个字符串进行校验。如果校验成功，我们还可以做另外
一件事，将 start 这个参数从字符串类型转为 date 类型，并将转型后的数据赋值给
`this.parsed` 中的对应参数路径，如 start 的原始路径是 data 的`query.start`，那么
我们将解析后的参数赋值给`this.parsed` 的`query.start`。这样你可以通过`v.get()`这
个函数得到解析后的数据。

## 进阶

### 继承

校验器提供继承的方式，让你的参数可以被组合校验。

```js
class PositiveIdValidator extends LinValidator {
  constructor() {
    super();
    this.id = new Rule("isInt", "id必须为正整数", { min: 1 });
  }
}
```

我们首先定义了一个`PositiveIdValidator`的校验器，它会被 id 这个参数进行正整数校
验，一般情况下 id 的校验被使用的很普遍，其他的校验器也需要使用，但是我们又不想重
新再写一遍。因此，我们可以继承`PositiveIdValidator`。

```js
class UpdateUserInfoValidator extends PositiveIdValidator {
  constructor() {
    super();
    this.group_id = new Rule("isInt", "分组id必须是正整数", {
      min: 1
    });
    this.email = new Rule("isEmail", "电子邮箱不符合规范，请输入正确的邮箱");
  }
}
```

这里`UpdateUserInfoValidator`继承了`PositiveIdValidator`，因
此`UpdateUserInfoValidator`也可对 id 参数进行校验，而且扩展了 group_id 和 email
两个参数的校验。

### 别名

lin-validator 不仅仅提供继承，还提供另一种解放劳动力的方式——别名。如：

```js
class PositiveIdValidator extends LinValidator {
  constructor() {
    super();
    this.id = new Rule("isInt", "id必须为正整数", { min: 1 });
  }
}
```

`PositiveIdValidator`会对 id 参数进行校验，但是有时候参数的校验逻辑是一样的，但
是参数的名字不相同。如 uid 这个参数，它跟 id 这个参数的 Rule 一样。那么我们是不
是还需要重新再写一个校验器定义一个 uid 的 Rule 了。这可行，但不优雅。

```js
const v = await new PositiveIdValidator().validate(ctx, { id: "uid" });
```

我们可以通过上面的方式来给 id 一个别名，这个别名为 uid。当使用了别名之后，校验器
不会对 id 这个参数做校验，**但是会对 uid 这个参数做校验**。

<RightMenu />
