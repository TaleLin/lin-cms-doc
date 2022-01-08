---
title: 模型管理和权限管理
---

# <H2Icon /> 模型管理和权限管理

> 阅读本小节前，请确保你一定完成了[快速开始](../../start/flask/README.md)的全部内容
> 本小结使用`postman`作为 http 测试工具，请确保你有 postman 或类似的 http 测试工具，它是我们后续开发必不可少的工具。

### 架构介绍

Lin 的定位是一整套的 Flask CMS 解决方案。对于任何的 CMS 来说，权限这一块都是**不可或缺**的，因此 Lin 在基础框架中便已经集成了权限模块，它是开箱即用的。

不过 Lin 的权限模块的概念可能与其它的权限框架由些许不同，当然你完全不用担心，因为大部分权限系统的模式都大同小异。

在 Lin 的权限模块中，我们有三个模型类来组成这个这个权限模块。如下：

- 用户模型（user_model，数据表名称为 lin_user）
  用户是权限系统服务的基本单位，CMS 与一些网站的很大的区别在于，CMS 可能不存在不用登陆便可进入的页面（登陆页除外）。

  简而言之，用户是必须的。

- 分组模型（group_model，数据表名称为 lin_group）
  分组是一个非常重要的概念，分组是权限分配的基本单位，同时它也是容纳用户的容器，它是用户与权限之间的纽带。

  一个用户可以属于多个分组，一个分组可以拥有多个用户。超级管理员（root）属于任何超级管理员组，但超级管理员组拥有所有的权限。

  分组也可拥有多个权限，也就是说，在某个分组的用户拥有该分组的所有权限。

- 权限模型（permission_model，数据表名称为 lin_permission）
  你可以把一个权限理解成一把钥匙，然你拥有这把钥匙的时候你就可以打开某扇门，而当你没有这把钥匙的时候，你就会被锁在门的外面。

  所以对于某个用户，比如说：你，当你拥有某个权限时，你就可以访问某个 API（或多个 API），而当你没有这个权限时，你访问 API 时会得到一个授权失败或禁止的信息。

::: tip

在依赖的核心库`lin-cms`可以找到这些数据模型类。`lin.interface`下定义了它们接口，`lin.model`中实现了它们权限相关逻辑，最后在 create_app 时传入`app.model.lin`下对应继承的类。

根据需要，你也可以对`app.model.lin`下的模型进行增改。

:::

### 基本使用

在`app/v1/book.py`中修改删除图书功能的 API。

```py
...
@book_api.route("/<int:id>", methods=["DELETE"])
# 将这个视图函数注册到权限管理容器中；permission的名称为 `删除图书` 模块名为 `图书`
@permission_meta(auth="删除图书", module="图书")
# 只有在分组授权后才可访问
@group_required
def delete_book(bid):
...
```

:::warning

请注意,这一行代码，也就是说，权限的命名和分配均是由开发者自己来斟酌，如果你们是团队协作，请与你们的前端、客户仔细交流再做决定。

:::

然后在前端为分组分配权限，再将用户划入此有权限的分组，即可登录此用户删除图书了。

::: TODO

补充后端演示脚本

:::

### 守卫函数

在上一节中，聪明的你一定注意到了一个`@group_required`的装饰器。我们把这它称之为**守卫函数**。请记住，守卫函数是权限系统中非常重要的一环，在基础库中我们提供了 3 个守卫函数，分别是：
| name | 说明 | 作用 |
| -------------- | :----------------------------------------------------------------: | :------: |
| login_required | 被 login_required 装饰的视图函数需登陆后才可访问 | **\*\*** |
| group_required | 被 group_required 装饰的视图函数需登陆且被授予相应的权限后才可访问 | **\*\*** |
| admin_required | 被 admin_required 装饰的视图函数只有超级管理员才可访问 | **\*\*** |

请注意，这三个守卫函数是开发层面上权限管理。如果你的视图函数未加任何守卫函数修饰，那么它可以被任何人访问，这样的视图函数一般是登陆这些功能的视图函数。又如哪些视图函数需要用户登陆才能访问，如用户修改密码，那么它可以加上`login_required`这个守卫函数。如果有些视图函数的功能需要授予权限才能访问，请使用`group_required`。而有些视图函数非超级管理员不可操作，那么请加上`admin_required`修饰。

### 扩展模型

刚刚我们谈到扩展模型，事实上扩展 group_model 非常简单。

首先我们在`app/api/cms/model/`下打开`group.py`文件, 然后在`Group`类上追加你想要的字段即可。

由于 flask-sqlalchemy 的特性，当数据库中有 lin_user 这张表时，它并不会直接更新这张表。所以为了确保扩展成功，请你在数据库中先删除掉 lin-user 这张表，然后再次运行`flask run` (或者`flask db init --force`强制初始化数据库中所有表)。

## InfoCrud 和 BaseCrud

Lin 默认集成了 flask-sqlalchemy 这个方便的 ORM 库，因此我们可以很好的根据模型（model）来进行相关的数据库操作。某种意义上，sqlalchemy 提供的 API 已经可以很好的操作数据库了。

林间有风团队在诸多项目的开发中，也同时积累了些许经验，我们希望当模型类被定义时便已经默认拥有了简单的 CRUD，因此在 Lin 中我们提供了这两个方便的基础模型类—— InfoCrud 和 BaseCrud。

BaseCrud 默认便拥有`create`，`delete`，`update`，`get`这些便捷方法，你可以很便捷的进行数据的增删查改。

InfoCrud 在 BaseCrud 的基础上，添加了`create_time`，`update_time`，`delete_time`这三个字段，方便你进行数据的分析和观察，另外 InfoCrud 还增加了`hard_delete`方法，InfoCrud 使用`delete_time`来进行数据的软删除，因此当你调用`delete`方法时，数据并不会真正的从数据库中删除，而是写入`delete_time`，所以若要真正的删除数据，需调用`hard_delete`。

## 小结

如果你对模型类的操作还不够了解，甚至有些疑惑，请你详细阅读[flask-sqlalchemy](http://flask-sqlalchemy.pocoo.org/2.3/queries/#querying-records)的官方文档，

和这个[sqlalchemy 小教程](https://www.jianshu.com/p/8d085e2f2657)。

<RightMenu />
