---
title: koa日志
---

# 更新日志

最新版本 `0.3.5`

### 0.3.5

1. `U` 更新核心库 lin-mizar 到 0.3.4 版本

### 0.3.4

1. `U` 更新路由视图权限挂载的方式
2. `U` HttpException 不允许直接修改 status，传入的参数由 errorCode 改为 code
3. `U` 新增 code-message 配置，返回的成功码和错误码都在这里配置
4. `U` 支持自定义工作目录
5. `U` 更新核心库 lin-mizar 到 0.3.3 版本

### 0.3.3

1. `F` `GET /cms/user/information` 返回完整的头像链接
2. `F` 文件名重命名为用 `-` 连接，并且使用单数

### 0.3.2

1. `F` 更改文件上传返回字段
2. `F` `GET admin/users` 和 `GET admin/group/all` 接口过滤 `root` 用户
3. `F` `PUT /admin/user/{id}` 接口不允许修改 `root` 用户的分组

### 0.3.1

1. `F` 更新 `lin-mizar` 到 `0.3.2` 版本，路由属性名由 `auth` --> `permission`

### 0.3.0

1. `A` 将模型层抽离核心库进行重构

### 0.2.1

1. `C` 替换 nickname 为 username，作为登录用户名，并新增用户昵称 nickname 字段。**先将 user 表中 nickname 字段替换为 username，然后，再添加一个 nickname 字段**
2. `C` 列表信息字段由 collection -> items, total_nums -> total, 增加 count、page、total_page字段

### 0.2.0-beta.1

1. `A`: 添加环境变量区分 `F`: 修改文件上传成功后的返回格式（增加 path 键名）

### 0.1.0-beta.3

1. `F` 添加日志记录并修复更换密码校验器的 bug
2. `F` 修复用户分页的分组条件丢失问题
3. `U` 添加日志文件系统
4. `F` 添加 sequelize 初始化配置项和修复日志校验器
5. `F` 修复文件上传的大小缺失 bug

### 0.1.0-beta.2

1. `U` 添加文件上传业务
2. `U` 用户模块新增头像上传业务
3. `U` 新增 extensions 模块

### 0.1.0-beta.1

1. `U` 基本完成了功能，发布版本 beta.1

<!-- ## 核心库

> 核心库即 koa 版本的 Lin CMS 在 `npm` 上发布的包，详情请查
> 看[github](https://github.com/TaleLin/lin-cms-koa-core)\

### 0.2.1

1. `C` 替换 nickname 为 username，作为登录用户名，并新增用户昵称 nickname 字段

### 0.2.0-beta.2

1. `F` 修复 avatar 的结果处理

### 0.2.0-beta.1

1. `A` 添加 avatar 的结果处理

### 0.1.0-beta.5

1. `F` 移除是否 async 函数的判断

### 0.1.0-beta.4

1. `F` 修复模型扩展的问题

### 0.1.0-beta.3

1. `U` 添加日志文件记录系统
2. `F` 修复权限查找的条件
3. `U` 添加 sequelize 初始化配置项
4. `F`修复文件上传的大小缺失 bug

### 0.1.0-beta.2

1. `U` 增加文件上传功能
2. `U` 用户信息新增 avatar 字段
3. `U` 新增 logger，limiter，file 类库

### 0.1.0-beta.1

1.  `U` 总体功能基本稳定，发布版本 beta.1
 -->


<!-- markdownlint-disable -->
<RightMenu />
<!-- markdownlint-enable -->
