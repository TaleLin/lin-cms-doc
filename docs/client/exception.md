---
title: 异常机制
---

## 怎么处理 API 异常

在后端 MVC 思想中，一个很重要的概念是分层机制，模型层关注数据的处理，异常层来处理全局异常。这种服务端的思想逐渐在这个大前端不断被提及的今天被用在前端代码中。之前一直从事前端的同学一开始可能不太适应，但是慢慢地你会喜欢上它。

首先，我们要明确这里说的异常仅指 API 异常，是前后端已经约定过的，比如密码错误、无登录权限、token 令牌失效等，如果是业务代码异常或其他异常，这就需要你自己处理了，我们不可能将所有的异常处理掉。所有的 API 请求都是 HTTP 请求，所以我们可以抽象出所有 API 请求共同的一个基类，如果你开发过小程序，同样的可以把 wx.request 封装起来，那么我们这里的 http 请求用的是 [axios](https://github.com/axios/axios) ，通过查看官方文档，我们知道了可以通过请求拦截器来实现。

这种思想叫做面向切面编程（AOP），这种做法对原有代码毫无入侵性，将与主业务无关的事情放到别的地方去做。

## 代码实现

代码位置： `src/lin/plugins/axios.js`

我们来看下这个文件，首先创建一个拥有通用配置的 axios 实例，官网提供的请求配置有很多，可以根据你的具体需求进行配置。

```js
// 创建一个拥有通用配置的axios实例
const http = axios.create({
  baseURL: Config.baseUrl, // api 的 base_url
  transformResponse: [data => JSON.parse(data)], // 对 data 进行任意转换处理
  timeout: 5000, // 请求超时
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  validateStatus(status) {
    return status >= 200 && status < 500
  },
})
```

然后添加一个请求拦截器，将 Authorization 混入到 HTTP 的 header 中，这块是使用的 `jwt` 的机制。

<!-- 想要了解详情的可以到[jwt 使用](../inside/jwt.md)查看。 -->

接下来介绍一下 `token在前端的获得及刷新流程`：

1. 在 `login.vue` 中登陆获取 tokens，这里面会同时获取 `access_token和refresh_token`，将其存储到 `cookie` 中（每次登录颁发的都是新令牌），不进入 vuex 全局管理，refresh_token 的过期时间是 30 天，access_token 的过期时间是 2 小时。我们每个 API 请求都要携带 access_token 才能请求成功，access_token 包含了管理员的唯一身份标识。

2. 如果管理员在操作过程中，access_token 过期了，那么当次请求服务端会返回 `10050` 错误码，检测到这个错误码后，通过 refresh_token 来换取 access_token，并再次保存。

```js
// 添加一个请求拦截器
// step2: auth 处理
http.interceptors.request.use(
  (requestConfig) => {
    if (requestConfig.url === 'cms/user/refresh') {
      const refreshToken = getToken('refresh_token')
      if (refreshToken) {
        // eslint-disable-next-line no-param-reassign
        requestConfig.headers.Authorization = refreshToken
        return requestConfig
      }
    } else {
      // 有access_token
      const accessToken = getToken('access_token')
      if (accessToken) {
        // eslint-disable-next-line no-param-reassign
        requestConfig.headers.Authorization = accessToken
        return requestConfig
      }
    }
    return requestConfig
  },
  error => Promise.reject(error),
)
```

继续往下看，在 HTTP 的 `response` 响应中，如果接口出现异常，则判断其 http 状态码：

```js

// 返回结果处理
// Add a response interceptor
_axios.interceptors.response.use(async (res) => {
    let { code, message } = res.data // eslint-disable-line
    if (res.status.toString().charAt(0) === '2') {
      return res.data
    }
    return new Promise(async (resolve, reject) => {
      const { params, url } = res.config

      // refresh_token 异常，直接登出
      if (code === 10000 || code === 10100) {
        setTimeout(() => {
          store.dispatch('loginOut')
          const { origin } = window.location
          window.location.href = origin
        }, 1500)
        return resolve(null)
      }
      // 令牌相关，刷新令牌
      if (code === 10040 || code === 10041 || code === 10050 || code === 10051) {
        const cache = {}
        if (cache.url !== url) {
          cache.url = url
          const refreshResult = await _axios('cms/user/refresh')
          saveAccessToken(refreshResult.access_token)
          // 将上次失败请求重发
          const result = await _axios(res.config)
          return resolve(result)
        }
      }
      // 本次请求添加 params 参数：handleError 为 true，用户自己try catch，框架不做处理
      if (params && params.handleError) {
        return reject(res)
      }
      console.log('message', message)
      if (Config.useFrontEndErrorMsg) {
        // 这一次请求添加 params 参数：showBackend 为 true, 弹出后端返回错误信息
        if (params && !params.showBackend) {
          // 弹出前端自定义错误信息
          const errorArr = Object.entries(ErrorCode).filter(v => v[0] === code.toString())
          // 匹配到前端自定义的错误码
          if (errorArr.length > 0) {
            if (errorArr[0][1] !== '') {
              message = errorArr[0][1] // eslint-disable-line
            }
          } else {
            message = ErrorCode['777']
          }
        }
      }

      Vue.prototype.$message({
        message,
        type: 'error',
      })
      reject()
    })
  },
  error => {
    if (!error.response) {
      Vue.prototype.$notify({
        title: 'Network Error',
        dangerouslyUseHTMLString: true,
        message: '<strong class="my-notify">请检查 API 是否异常</strong>',
      })
      console.log('error', error)
    }

    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Vue.prototype.$message({
        type: 'warning',
        message: '请求超时',
      })
    }
    return Promise.reject(error)
  },
})
```

通过拿到的 HTTP 状态码和服务端 restful 接口返回的自定义异常数据，根据不同的 `code` 来进行不同的处理逻辑，将异常拦截在全局，业务逻辑只专注处理业务。

 `code` 要前后端商量确认，前端在 `src/config/error-code.js` 中定义：

| error_code | 说明           |
| ---------- | -------------- |
| 0-9998          | 成功           |
| 777       | 前端错误码未定义       |
| 999        | 服务器未知错误 |
| 10000      | 未携带令牌       |
| 10020      | 资源不存在     |
| 10030      | 参数错误       |
| 10041      | assessToken损坏       |
| 10042      | refreshToken损坏       |
| 10051      | assessToken过期       |
| 10052      | refreshToken过期       |
| 10050      | 令牌过期       |
| 10060      | 字段重复       |


这里我们进行了全局异常拦截，但是如果你不想在全局处理异常，当然也是可以的，根据开发者自己的需求，在 api 获取过程中的任意阶段都可以进行异常捕获处理。

## 小结

本小节介绍了前端异常层的处理，这里主要是希望大家了解分层的思想，那么同样的，数据验证层、模型层、业务层等这些 MVC 分层的思想也可以逐渐应用到前端代码中。

<RightMenu />
