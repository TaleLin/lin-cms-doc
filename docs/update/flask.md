---
title: flask日志
---

# 更新日志

最新版本 `0.2.1`   
::: warning 注意
目前`lin-cms-flask`对应前端`lin-cms-vue`版本的 [0.2.x](https://github.com/TaleLin/lin-cms-vue/tree/0.2.x)，请不要选错版本以免造成困扰。
::: 

## 主工程

### 0.2.1
1. `C` 替换 nickname 为 username，作为登录用户名，并新增用户昵称 nickname 字段。**先将 user 表中 nickname 字段替换为 username，然后，再添加一个 nickname 字段**
2. `C` 列表信息字段由 collection -> items, total_nums -> total, 增加 count、page、total_page字段

### 0.2.0-beta.1

1. `U` 增加环境变量ENV，使用配置类的方式来区分生产环境和开发环境的配置
2. `F` 修改文件上传成功后的返回格式（增加path键名）

### 0.1.0-beta.3

1. `U` 添加日志文件记录系统
2. `F` 修复文件上传到第三方服务依然在本地创建目录的bug

### 0.1.0-beta.2

1. `U` 新增上传文件到本地实现类
2. `U` 新增头像上传功能
3. `U` 新增 extensions 模块
4. `F` 修复插件初始化脚本在cmd下执行时编码错误的bug

### 0.1.0-beta.1

1. `F` 修复 mysql8 的兼容性问题
2. `F` 修复当用户被禁用或软删除后，可以访问受保护接口的bug
3. `U` 更新所依赖的 Lin-CMS 核心库版本为 0.1.1b1

### 0.0.1-alpha.2

1. `A` 插件支持
2. `A` 将 `super` 字段统一更新为 `admin`

### 0.0.1-alpha.1

1. `A` 初始化内测版



## 核心库
> 核心库即flask版本的 Lin CMS 在 `pipy` 上发布的包，详情请查看[pipy](https://pypi.org/project/Lin-CMS/#history)


### 0.2.0b2

1. `C` 替换 nickname 为 username，作为登录用户名，并新增用户昵称 nickname 字段

### 0.2.0b1

1. `U` 增加JWT的ip检验
2. `F` 修改lin_user表的avatar字段为相对路径

### 0.1.1b4

1. `U` 添加日志文件记录系统
2. `F` 修复文件上传到第三方服务依然在本地创建目录的bug
3. `A` 优化文件上传基类

### 0.1.1b3

1. `U` 新增文件上传功能
2. `U` 用户信息新增 avatar 字段
3. `U` 新增 file 类库
4. `U` 新增更多JWT接口

### 0.1.1b2

1. `F` 修复权限管理bug

### 0.1.1b1

1. `U` 修改lin所生成的数据表时间戳字段类型为 datetime

### 0.1.1a7

1. `F` 修复当用户被禁用或软删除后，可以访问受保护接口的bug
2. `A` 新增`Logger`装饰器被错误使用时的报错
3. `A` 增加数据表字段注释

### 0.1.1a6

1.  `U` 将 `super` 字段统一更新为 `admin`
2. `A` 插件支持

### 0.1.1a5

1. `A` 推出插件内部测试版本

### 0.1.1

1. `A` 初始化内测版

<!-- markdownlint-disable -->
<RightMenu />
<!-- markdownlint-enable -->
