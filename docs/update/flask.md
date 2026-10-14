---
title: flask日志
---

# 更新日志

最新版本 `0.3.0-alpha`   

## 主工程
### 0.7.0
#### Features
- 迁移：集成 Flask-Migrate（Alembic），schema 全部由迁移管理；`flask db init` 保持旧语义且幂等，新增 `--force` 重建；种子数据以数据迁移内置
- 会话：新增 `POST /cms/user/logout`（jti 黑名单吊销）；修改/重置密码吊销该用户全部令牌（token_version）；refresh_token 有效期显式化为 7 天
- 安全：认证接口限流（登录/刷新 20 次/分钟，验证码 30 次/分钟，注册 10 次/小时）；CORS 白名单（开发默认放行 localhost:5173）；生产屏蔽 /apidoc 与演示路由
- 日志：请求日志敏感字段自动脱敏（password/token 等）；LOG.LEVEL 配置真实生效
- 密码：哈希算法显式固化为 scrypt；密码策略保持 6-22 位（无复杂度强制）
- 质量：mypy 全量类型检查（check_untyped_defs）、flake8/black/isort 四门禁 + GitHub Actions CI（含迁移漂移检查 flask db check）；测试 69 项
- 部署：Dockerfile 非 root 运行 + .dockerignore；docker-deploy.sh 幂等化；gunicorn 加固（timeout/max_requests/日志）
- 工具链：包管理切换为 uv；`.*.env` 移出版本控制并提供 .env.example 模板
#### ⚠ BREAKING CHANGES
- SECRET_KEY 必填：未设置或仍为模板占位符时拒绝启动
- 启动不再自动建表：改模型需 `flask db migrate && flask db upgrade`；存量库需一次性 `flask db stamp head`（并补 `lin_user.token_version` 列）
- 生产 CORS 默认仅同源：跨域部署必须配置 CORS_ORIGINS
### 0.3.0-alpha
#### Features
- 权限: 支持多分组
- 文档化：集成openapi与redoc
- 校验：适配Pydantic ，校验输入输出模型
- 消息码：可配置的消息码机制
- 配置：支持多级环境变量/配置加载机制
- 命令：新增常用数据库与插件配置命令
####  Bug Fixes
- Form: 修复表单验证错误
#### ⚠ BREAKING CHANGES
- 虚拟环境：移除项目pipenv依赖
#### Code Refactoring
- 重构部分单元测试代码

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
