---
title: 模型管理和权限管理
---

# <H2Icon /> 模型管理和权限管理

> 阅读本小节前，请确保你一定完成了[快速开始](../../start/koa/README.md)的全部内
> 容本小结使用`postman`作为 http 测试工具，请确保你有 postman 或类似的 http 测试
> 工具，它是我们后续开发必不可少的工具。

## 权限管理

### 架构介绍

Lin 的定位是一整套的 CMS 解决方案。对于任何的 CMS 来说，权限这一块都是**不可或缺**的，
因此 Lin 在基础框架中便已经集成了权限模块，它是开箱即用的。

不过 Lin 的权限模块的概念可能与其它的权限框架由些许不同，当然你完全不用担心，
因为大部分权限系统的模式都大同小异。

在 Lin 的权限模块中，我们有四个模型类来组成这个这个权限模块。如下：

- 用户模型(userModel，数据表名称为 lin_user)用户是权限系统服务的基本单位，CMS 与
  一些网站的很大的区别在于，CMS 可能不存在不用登陆便可进入的页面（登陆页除外）。

- 用户身份模型(userIdentityModel，数据表名称为 lin_user_identity)
  身份模型用于记录用户的登录凭证（比如密码）。

- 权限组模型(groupModel，数据表名称为 lin_group)权限组是一个非常重要的概念，权限
  组是权限分配的基本单位，同时它也是容纳用户的容器，它是用户与权限之间的纽带。

  一个用户可以拥有多个权限组，一个权限组也可以拥有多个用户，超级管理员(admin)默认属于
  超级用户组，并且超级管理员拥有所有的权限。

  权限组也可拥有多个权限，也就是说，在某个权限组的用户拥有该权限组的所有权限。

* 权限模型(permissionModel，数据表名称为 lin_permission)你可以把一个权限理解成一把钥匙，然你
  拥有这把钥匙的时候你就可以打开某扇门，而当你没有这把钥匙的时候，你就会被锁在门
  的外面。

  所以对于某个用户，比如说：你，当你拥有某个权限时，你就可以访问某个 API(或多个
  AP)，而当你没有这个权限时，你访问 API 时会得到一个授权失败或禁止的信息。

:::tip
考虑到有可能使用多种登录类型，因此用户登录需要用到 userModel 和 userIdentityModel 两个模型。
userIdentityModel 用于管理登录类型、登录标识和密码凭证。
:::

### 基本使用

接下来，就让我们开始实战了。请先在`app/v1/book.js`中添加如下一个删除图书功能的
API。

```js
// 参数 mountPermission 如果设为 false，则不挂载这个模块下的所有权限
const bookApi = new LinRouter({
  prefix: '/v1/book',
  module: '图书'  // 权限模块，非必选
});

bookApi.linDelete(
  "deleteBook", // 权限的唯一标示
  "/:id",
  bookApi.permission('删除图书'), // 如果不想挂载可以把传入第二个参数 false
  groupRequired,
  async ctx => {
    const id = getSafeParamId(ctx);
    await bookDto.deleteBook(id);
    ctx.success({
      code: 14
    });
  }
);
```

通过上面的 API，在运行程序的时候会向`lin_permission`这个表中插入`name`为删除图书，
`module`为图书这条权限数据，并且默认是挂载的。

在快速开始一节中已经在数据中创建了一个名为`root`超级管理员的账号，为了更好的测试，我们还需
要一个普通用户的账号，接下来我们把`tests/helper/fake/fake.js`的内容更换为如下内容：

```js
import '../initial';
import sequelize from '../../../app/lib/db';
import { MountType, IdentityType } from '../../../app/lib/type';
import { generate } from 'lin-mizar';
import { UserModel, UserIdentityModel } from '../../../app/model/user';
import { GroupModel } from '../../../app/model/group';
import { PermissionModel } from '../../../app/model/permission';
import { GroupPermissionModel } from '../../../app/model/group-permission';

/**
 * 如果创建失败，请确保你的数据库中没有同名的分组和同名的用户
 */
const run = async () => {
  // 创建权限组
  const group = new GroupModel();
  group.name = '普通分组';
  group.info = '就是一个分组而已';
  await group.save();

  // 创建用户
  const user = new UserModel();
  user.username = 'pedro';
  await user.save();

  // 创建用户密码
  await UserIdentityModel.create({
    user_id: user.id,
    identity_type: IdentityType.Password,
    identifier: user.username,
    credential: generate('123456')
  });

  // 在运行 app 的时候会获取路由中定义好的权限并插入，这里需要找到 id 来关联权限组
  const permission = await PermissionModel.findOne({
    where: {
      name: '删除图书',
      module: '图书',
      mount: MountType.Mount
    }
  });

  // 关联 permission 权限和 group 权限组
  await GroupPermissionModel.create({
    group_id: group.id,
    permission_id: permission.id
  });

  setTimeout(() => {
    sequelize.close();
  }, 500);
};

run();
```

把 `test/helper/initial.js` 下的 `const secure = require('./secure');` 更换为
`const secure = require('../../app/config/secure')`, 然后在项目根目录下运行
`node test/helper/fake/index`执行上述代码。

如果你仔细理解了上面架构介绍，这段代码的作用便是创建一个权限(删除图书)，一个用户
(pedro)，一个权限组(普通分组)；且权限与权限组已经绑定了，不过新建的用户却未与权
限组关联，这个新建权限就是上段代码中的删除图书的 API。

:::warning

这里，虽然新建了`pedro`这个用户，但是他却没有*删除图书*这个权限。

:::

请在 postman 的 url 地址栏输入`http://127.0.0.1:5000/cms/user/login`，请求方法选
择 post 方法，并在请求参数的 body 里面填入下面数据：

```json
{
  "username": "root",
  "password": "123456"
}
```

如果顺利，你会得到如下返回结果：

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODQ1MTc1NDEsImlkZW50aXR5IjoxLCJzY29wZSI6ImxpbiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE1ODQ1MTM5NDF9.G4kEAXX0XAmGHJ0DhpwyGCYDQ1HJ7bwqEq3kBaFSI4A",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODcxMDU5NDEsImlkZW50aXR5IjoxLCJzY29wZSI6ImxpbiIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNTg0NTEzOTQxfQ.6BqbBBByqqF1GNSISOVdS4TrIdrgXE-mmZ-HtD7O3vc"
}
```

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/root_login.png"/>
</img-wrapper>

到此，我们拿到了访问 API 所必须的令牌，请记住这是超级管理员的令牌，它可以访问一
切 API。接下来我们访问改变 postman 的 url 地址为

`http://127.0.0.1:5000/cms/admin/permission`，并且在请求头中加入键值对。

```bash
# 此处的access_token是变量，为上面返回结果的access_token
Authorization: Bearer ${access_token}
```

结果为：

```json
// 图书模块
"图书": [
  {
    // 权限
    "id": 8,
    "name": "删除图书",
    "module": "图书"
  }
]
// 省略... 
```

请记住以`/admin`为前缀的 url 一般为超级管理员专有，需要以超级管理员账号申请令牌
才可访问。

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/permission.png?imageView&thumbnail=2052y1112&type=png&quality=96&stripmeta=0"/>
</img-wrapper>

如果你顺利得到了结果，你可能不明白这些数据究竟代表着什么。这没关系，我们会一一说
明，不过在此之前，你的先了解一个概念，那就是 Lin 中的**endpoint(端点)**。

无论你是否熟悉 koa，在这里，一个 endpoint 所能起到的作用那便是——_唯一标识一个视
图函数，或者说一个 url，一个 API(严格来说 API 不等同于一个视图函数，但是在大多数
的开发中，一个视图函数确实与一个 API 对应)_。

在视图函数中，第一个参数就是一个**endpoint**，比如上面删除图书的视图函数的
**endpoint**就是`DELETE deleteBook`。也就是说，这个端点标识了一个视图函数，
而**删除图书**代表的是这个权限的名称。聪明的你会发现，一个权限可以拥有多个端点，
换言之那就是一个权限可以对应多个视图函数。当然一般情况下，一个权限对应一个视图函数，
我们也强烈推荐你这么做。

**删除图书**这个权限它还有一个重要的属性，那就是模块(module)，也就是**图书**这个
字段。

之所以需要这个属性，是因为权限一旦多了之后，你可能无法很好的梳理它们之间的关联，
而有了模块这个概念之后，你可以很好的区分哪些权限属于哪一个模块，在前端操作界面，
当管理员进行操作的时候，这也会为他提供诸多便利。

:::warning

开发者请注意，此处的**删除图书**权限和**图书**模块对应的是上述添加视图函数中的

```js
bookApi.linDelete(
  "deleteBook", // 权限的唯一标识
  "/:id",
  bookApi.permission('删除图书'),
  groupRequired,
  async ctx => {
    const id = getSafeParamId(ctx);
    await bookDto.deleteBook(id);
    ctx.success({
      code: 14
    });
  }
);
```

权限的命名和分配均是由开发者自己来斟酌，如果你们是团队协作，请与你们的前端、客户
仔细交流再做决定。

:::

上面，我们添加了一个`deleteBook`的 API，其对应的 url
为`http://127.0.0.1:5000/v1/book/1`，请求方法为`delete`。如果此时，你以超级管理
员的 token 进行操作，那么毫无疑问，这个 id 为 1 的图书会被删除。但是绝大多数情况
下，我们不能让别人直接以超级管理员的身份来操作，这太危险了！！！

聪明的你又会发现，我们刚刚不是已经申请了一个名为`pedro`的用户吗？而且他还未被分
配到任何权限组(请注意，我们非常不推荐存在离群用户，即没有被分配到权限组的用户，
超级管理员除外，此处我们仅仅是为了方便测试而未直接给 pedro 用户分配权限组)，因此
理论上说 pedro 并没有访问`deleteBook`的权限，那么实际如何了。

我们通过 pedro 的账号名、密码登陆获取令牌，并将 header 中的 Authorization 字段换
成相应的令牌字段。而后访问`http://127.0.0.1:5000/v1/book/1`，你会得到如下结果：

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/delete_book_forbidden.png"/>
</img-wrapper>

现在权限系统已经开始显现它的威能了。它告诉我们，pedro 这个用户未被分配权限组，并
没有权限能够访问这个 API。既然没有权限，那我们便分配这个权限给 pedro(请注意，这
里分配权限仅为了测试方便，一般的只允许超级管理员分配)。

打开`tests/helper/fake/fake.js`文件，换成如下代码：

```js
import '../initial';
import sequelize from '../../../app/libs/db';
import { UserModel } from '../../../app/models/user';
import { GroupModel } from '../../../app/models/group';
import { UserGroupModel } from '../../../app/models/user-group';

const run = async () => {
  // 查找需要关联的权限组 id
  const group = await GroupModel.findOne({
    where: {
      name: '普通分组'
    }
  });

  // 查找 pedro 用户的 id 用去关联权限组
  const user = await UserModel.findOne({
    where: {
      username: 'pedro'
    }
  });

  // 关联用户和权限组
  await UserGroupModel.create({
    user_id: user.id,
    group_id: group.id
  });

  setTimeout(() => {
    sequelize.close();
  }, 500);
};

run();
```

运行它后，pedro 用户便被分配到了 id 为 1(理论上为 1，可能为其它值) 的这个权限组
。接下来，我们再次访问`http://127.0.0.1:5000/v1/book/1`，结果如下：

<img-wrapper>
  <img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/docs/delete_book_success.png">
</img-wrapper>

如果你也是一样的结果，那么恭喜你，你已经完成了一个权限开发的全部流程，再你后续的
开发过程中，都是类似的做法来完成全部的权限管理开发。

### 守卫函数

在上一节中，你一定注意到了一个名为`groupRequired`的中间件。我们把这它称之为**守
卫函数**。他们都分布在`app/middleware/jwt.js`文件下，请记住，守卫函数是权限系统中非常重要的一环，在基础库中我们提供了 3 个
守卫函数，分别是：

| name          | 说明                                                              | 作用     |
| ------------- | :---------------------------------------------------------------- | :------- |
| loginRequired | 被 loginRequired 装饰的视图函数需登陆后才可访问                   | **\*\*** |
| groupRequired | 被 groupRequired 装饰的视图函数需登陆且被授予相应的权限后才可访问 | **\*\*** |
| adminRequired | 被 adminRequired 装饰的视图函数只有超级管理员才可访问             | **\*\*** |

开发者请注意，这三个守卫函数是开发层面上权限管理。如果你的视图函数未加任何守卫函
数修饰，那么它可以被任何人访问，这样的视图函数一般是登陆这些功能的视图函数。又如
哪些视图函数需要用户登陆才能访问，如用户修改密码，那么它可以加
上`loginRequired`这个守卫函数。如果有些视图函数的功能需要授予权限才能访问，请使
用`groupRequired`。而有些视图函数非超级管理员不可操作，那么请加
上`adminRequired`修饰。

## 模型管理

在权限管理的架构介绍时，我们就已经介绍了四个模型
类`userModel`、`userIdentityModel`、`groupModel`和`permissionModel`。这是 Lin 里面最重要的四个模型，Lin 默
认暴露的 API 和权限系统均直接依赖于这四个模型类。所有模型都定义在`app/models`目录下，
如果需要对模型进行扩展只需要根据需要修改即可。

由于 sequelize 的特性，当你修改了数据库中的某张表时时，它并不会直接更新这张表。
所以为了确保扩展成功，请你在数据库中先删除掉这张表，然后再次运行`npm run start:dev`。

## InfoCrudMixin

Lin 默认集成了 sequelize 这个方便的 ORM 库，因此我们可以很好的根据模型(model) 来
进行相关的数据库操作。某种意义上，sequelize 提供的 API 已经可以很好的操作数据库
了。

sequelize 在模型定义时，提供了`createdAt`，`updatedAt`,`deletedAt`这三个选项，方
便进行数据的软删除和观测。

为了保持与其他版本的一致性，InfoCrudMixin 在基础模型上改变
了`createdAt`，`updatedAt`,`deletedAt`这三个字段名。其分别被改
为`create_time`，`update_time`，`delete_time`这三个字段。

并且 InfoCrudMixin 提供了 create_time 的 get 方法，会把 Date 类型的 create_time
改变为 unix 时间戳。

## 小结

在本节中，我们熟悉了一下权限管理的开发流程，并介绍了模型的管理和扩展。

如果你对模型类的操作还不够了解，甚至有些疑惑，请你详细阅
读[sequelize](http://docs.sequelizejs.com/)的官方文档。

<RightMenu />
