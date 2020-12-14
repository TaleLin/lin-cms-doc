# <H2Icon /> 单元测试

> 请注意，这是一个选看章节，如果你原来一直在使用单元测试，那么这节你必不可错过。
> 如果你原来没有做过单测，或者说极少做，我们强烈建议你，从此开始把单元测试作为一
> 种习惯。

## 导语

在写这章之前，笔者一直很踌躇，因为我并没有多年的开发经验，甚至是一年都没有。换言
之，我还没有一个良好的软件开发习惯，没有一个标准的开发约束，如果你和我一样，那么
请你一定要仔细阅读本小节，并且开始尝试认真，仔细的做单测，它将会让你受益匪浅。

谈到单测，我想许多人和我一样一开始都比较抗拒，因为这是一种自我的否定，你默认自己
写出来的代码是有问题的，于是你尝试用不同的方法，不同的角度去测试你代码的健壮性。
于是不出所料，你的单测没有通过，或者部分通过，然后开始在代码中找 bug，边找边改。

没错，这看起来很烦，很浪费时间，甚至占据了开发的一半时间。但是人无完人，玉无完璧
，没有人可以很自信的说，我的代码就是完美的，在辩证法中，有一种不断自我否定追求极
致的言论。著名的曾国藩先生，被很多人评价为古今第一完人，那么他真的是完人吗？当然
不是的，曾国藩不知道有多少的小毛病和错误，但他一直坚持自我完善，所以才能做到趋于
极致，连毛主席都对他敬赞有加，甚至拿他和孔子相提并论。

所以，我想你已经大致明白了我的意思。**单测**真的很有必要，你可以在单测中找到自己
的毛病，认识自己的不足，甚至在与其对抗时不断的提高自己，凝练自己思维，这将会让你
的成长越发迅速。

## 准备

回到正题，koa 是一个轻量级的库，轻量到连单元测试都没有提供。那还能怎么办，当然是
选择原谅它啊。koa 没有但是不代表不能做啊，在单测方面 Lin 选择整合 Jest。

在 starter 项目中，我们已经安装好了 Jest，你可以方便的直接使用。

## 测试

接下来让我们开始一个简单的测试吧。聪明的你，一定会发现我们项目的根目录下有一个
tests 的目录，按照约定，请将专用于测试的文件全部置于此目录下。然后在此目录下
的`api`目录下新建`test1.test.js`文件，并向其中加入以下内容：

```js
import "../../helper/initial";
import request from "supertest";
import { createApp } from '../../../app/app';
import sequelize from "../../../app/libs/db";

describe("test1.test.js", () => {
  // 必须，app示例
  let app;

  beforeAll(async () => {
    // 初始化app示例
    app = await createApp();
  });

  afterAll(() => {
    // 最后关闭数据库
    setTimeout(() => {
      sequelize.close();
    }, 500);
  });
});
```

接下来，我们书写测试函数：

```js
import "../../helper/initial";
import request from "supertest";
import { createApp } from '../../../app/app';
import sequelize from "../../../app/libs/db";

describe("test1.test.js", () => {
  // 必须，app示例
  let app;

  beforeAll(async () => {
    // 初始化app示例
    app = await createApp();
  });

  afterAll(() => {
    // 最后关闭数据库
    setTimeout(() => {
      sequelize.close();
    }, 500);
  });

  // 测试 api 的函数
  // 测试 api的 URL 为 /cms/test/
  test("测试/cms/test/", async () => {
    const response = await request(app.callback()).get("/cms/test/");
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/html/);
  });
});
```

在这个测试函数中，我们测试了`/cms/test/`这个 API。

接下来，运行这个测试文件：

```bash
npx jest tests/api/test1.test.js
```

如果一些顺利，它会给你一个 pass。

很好，一般情况下 http 请求偶尔会带 `params`，params 我们可以在请求路径中加入，
如`/cms/user/login?name=pedro`,这样 name 就可以被解析成一个参数，参数值为
pedro，对于数据传入我们可通过如下方式进行传入：

```js
test("测试/cms/user/register 输入不规范用户名", async () => {
  const response = await request(app.callback())
    .post("/cms/user/register")
    .send({
      username: "p",
      group_ids: [2],
      password: "123456",
      confirm_password: "123456"
    });
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("error_code", 10030);
  expect(response.type).toMatch(/json/);
});
```

在 lin-cms-koa 的 starter 项目中，有一些可供参考的测试示例，如果你对代码质量有要求，可以
详细参考一下。

## 尾语

以上两个测试对于一般的项目 API 开发来说可能已经足够，但是对于其它类型的单测，笔
者均未提到。这些测试大多异曲同工，也希望你能真正的去学习如何利用单测来提高代码质
量，顺便凝练自己的思维，愿你在漫漫的成长路上珍惜每一个自我否定，自我沉淀的机会，
与诸君共勉之。
