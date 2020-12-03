# Lin 的整体架构

::: warning
Lin 的整体架构十分清晰，但本章注定是比较难阅读的一章，请确保你拥有一定的 Flask 基础，并且拥有一定的真实项目开发经验。
:::

Lin 可以被很好的分为三大部分，分别是根目录下的核心文件，api 目录下的业务接口以及内置的插件目录。具体的目录架构如下：

```sh
|   // 根目录
│   code.md // 错误码定义文件
│   core.py // Lin的核心，负责插件的加载和管理
│   db.py // 数据库部分
│   enums.py // 枚举部分
│   exception.py // 全局异常部分
│   forms.py // 参数校验部分
│   interface.py // 接口类部分
│   jwt.py // 令牌部分
│   loader.py // 加载器部分
│   plugin.py // 插件类部分
│   redprint.py // 红图
│   util.py // 工具文件
│   __init__.py // 入口文件
│
├───api
│   │   // api目录
│   │   admin.py // 管理员独有业务接口
│   │   test.py // 测试接口
│   │   user.py // 用户接口
│   │   __init__.py // 入口文件
│
│
├───plugins
│   │   // 插件目录
│   ├───logger // 日志插件
│   │       config.py  // 插件配置文件
│   │       controller.py  // 插件视图函数文件
│   │       log.py // 日志插件的核心类库
│   │       model.py // 插件的模型类
│   │       service.py // 插件的业务类
│   │       __init__.py // 入口文件
│   │
│   └───notify // 消息推送插件
│           config.py // 同上（logger插件）
│           controller.py
│           model.py
│           notify.py
│           sse.py
│           __init__.py
```

## 核心部分

Lin 的核心是一套标准的 Restful API 的基础框架，这套基础框架包括：

- 全局异常处理： Lin 是一套遵循前后端分离的框架，因此标准化的异常处理是必须的，它是前、后端通信的桥梁。一般的，当前、后端通信发生异常时，Lin 会返回如下数据：

```json
{
  "error_code": 10030,
  "msg": "参数错误",
  "request": "POST  /login"
}
```

这是一个登陆时参数错误的异常结果，在数据中，我们可以很清楚的得到错误信息`msg`和请求路径、请求方法`request`，这些都可以帮助前端人员快速定位错误。
`error_code(错误码)`是异常中一个非常重要的概念，它是每一类异常（例如：参数异常被归为一类异常）的唯一标识。一般的，后端人员会为前端人员提供一套标准的 error_code 文档，当前端在请求检测到特定的错误码时，可以通过该文档迅速定位异常类别。

---

- 令牌机制： 在前后端分离的解决方案中，权限的认证与授权是非常重要的。Lin 集成了`Flask_JWT_Extended`为系统提供了标准的令牌授予和刷新机制。具体细节请参考[jwt](/inside/jwt.md)。

---

- 红图机制：Flask 的蓝图机制对于路由粒度的控制相对粗糙，我们提供红图来更细粒度的分配路由，具体细节请参考[jwt](/inside/jwt.md)。

- 参数检验：具体细节请参考[jwt](/inside/jwt.md)。
- 模型驱动数据库： 具体细节请参考[jwt](/inside/jwt.md)。
- 模型自动 Json 序列化： 具体细节请参考[jwt](/inside/jwt.md)。

另外 Lin 为了支持插件，还包括了：

- 加载器（Loader）：插件的加载器
- 插件类（Plugin）：插件类

## API 部分

在 Lin 的基础版本中，提供了完备的用户系统和权限系统的 api。分别对应了 api 目录下的`admin.py`和`user.py`文件，暴露的接口分别是`/user`和`/admin`。

这些接口分别包括：

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

## 插件部分

- logger 插件：Lin 的内置插件，为系统提供用户操作日志记录功能
- notify 插件：Lin 的内置插件，为系统提供消息推送功能
