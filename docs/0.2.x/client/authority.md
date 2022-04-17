---
title: 权限管理
---

# 权限管理

一个 CMS 系统，权限管理是比较基础的也是很重要的一块。在前端做权限管理，一般有两种做法：

- 视图层的访问权限
- API 的操作权限

## 视图控制

视图控制的目标是根据当前用户权限决定用户能访问哪些页面、操作哪些 DOM，典型场景是动态渲染菜单及控制各种操作按钮的显示隐藏。

::: tip
无论是控制页面显示还是控制页面内 DOM 显示，都是在后端返回的权限列表中，具体哪个权限控制哪里，要根据具体的业务场景由前端工程师和后端工程师共同商量确定。
:::

### 菜单渲染

> v0.3.0版本开始支持一个用户可以属于多个分组

在渲染菜单的时候，有两种不同的情况：

- 渲染所有菜单，当用户访问不在自己权限范围内的页面时提示权限不足。
- 只显示当前用户能访问的菜单，如果用户通过 URL 强制访问，提示用户无此权限并退回到当前页面。

为了提高用户体验，Lin 框架使用第二种方式来渲染菜单，

路由配置项里的 `permission` 属性为该路由的权限配置，该属性的值类型为数组，也就是说一个页面可以配置多个权限，而登录用户至少需要拥有其中的一种权限，左侧菜单才会把该路由的路口渲染出来；如果不配置 `permission` 属性，表示该页面是公共页面，所有用户都可以访问。

比如：

```js
const homeRouter = [
  {
    title: '林间有风',
    type: 'view',
    name: Symbol('about'),
    route: '/about',
    filePath: 'views/about/About.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 0,
  },
  {
    title: '日志管理',
    type: 'view',
    name: Symbol('log'),
    route: '/log',
    filePath: 'views/log/Log.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    order: 1,
    permission: ['查询所有日志'],
  },
]
```

所有用户都可以访问 `about` 页面，而 `log` 页面需要用户拥有 `查询所有日志` 的权限才能访问。

这部分权限筛选实现： `src/store/getters.js`

权限的筛选是由上及下，如果父路由没有权限，那么由此往下整个 `分支树` 都将被 shaking 掉。

如果用户试图通过 URL 强制访问没有权限的路由，Lin 框架也在全局路由里做了拦截：`src/router/index.js` 确保了用户在正常的操作过程中，无法访问与其权限不符合的页面。

### DOM 元素渲染

除了控制页面层级的访问，Lin 框架还提供了 `v-permission` 指令，在可以发出请求的 DOM 上添加该指令，根据用户权限，控制该 DOM 的**隐藏与显示**。

我们以能否搜索日志为例

```js
<button v-permission="['修改信息','修改密码']">编辑</button>

// 或者

<div  v-permission="'搜索日志'">
  // 具体展示代码省略
</div>
```

如果一个 DOM 对应多个 API，比如当前登录的管理员想要修改自己的用户信息，但是没有修改密码的权限，那么编辑按钮显示。如果一个 DOM 对应一个 API，那么直接传入字符串即可。

<img-wrapper>
  <img src=" http://cdn.talelin.com/lin/docs/auth.jpg">
</img-wrapper>

如果想要 DOM 显示，但只是不能操作状态，我们还提供了这样的指定：

``` js
<button v-permission="{ permission: '删除图书', type: 'disabled'}">删除</button>
```
<img-wrapper>
  <img src=" http://cdn.talelin.com/lin/docs/auth-disabled.png">
</img-wrapper>

## API 控制

视图层的权限控制实质上就是控制显示，过滤掉无法使用的页面及 DOM 节点，让用户体验变得更加友好。但这并不安全，比如用户可以用测试工具模拟 API 发出请求，同样可以拿到想要的数据，所以真正能实现安全的是接口，没有通过后端验证的 API 请求是无法到数据的。 在 Lin 框架里，当用户登录成功后，后端会返回 token，该 token 会自动添加到 axios 的请求头 `Authorization`，这样用户发出的每一个 API 请求才能通过后端验证拿到数据。

位置： `src/lin/utils/http.js`

```js
// 添加一个请求拦截器
http.interceptors.request.use(
  (requestConfig) => {
    if (requestConfig.url === 'cms/user/refresh') {
      const refreshToken = getToken('refresh_token')
      if (refreshToken) {
        requestConfig.headers.Authorization = refreshToken
        return requestConfig
      }
    } else {
      // 有access_token
      const accessToken = getToken('access_token')
      if (accessToken) {
        requestConfig.headers.Authorization = accessToken
        return requestConfig
      }
    }
    return requestConfig
  },
  error => Promise.reject(error),
)
```

更多关于 token 添加、验证、刷新实现原理参考[异常机制](../client/exception.md)

## 小节

在 Lin 框架里，我们实现了对每个页面、每一个 DOM 节点进行权限管理，在数据请求接口添加了 token 验证，通过验证后才能从后台拿回数据。开发者只需要经过简单的配置，就能拥有一个带权限管理的 CMS 系统。

<RightMenu />
