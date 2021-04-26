## 1. 开发环境相关


### 1.1 各语言版本
1. NodeJS建议使用 NodeJS v8/v10/v12
2. Python建议使用 Python 3.7或更新版本，虚拟环境推荐使用 peotry

### 1.2 代码编辑器

1. 文件的默认编码必须为UTF-8，禁止其他一切编码保存文件（包括GBK/BIG5/ANSI等）
2. Tab宽度配置为2（JS），禁止使用空格替换tab来实现缩进
3. 文件换行符设置为Unix兼容（即LF），不允许设为CRLF（Windows默认）
## 2. API 规范


Lin CMS 采用 RESTful API 规范，每一个请求都会返回对应的 HTTP Status 和对应的 Resource。新增操作使用 POST 请求，查询操作使用 GET 请求，更新操作使用 PUT 请求，删除操作使用 DELETE 请求。
### 2.1 常见的 HTTP Status

- **200** Success 
- **201** Created 新建资源成功
- **401** Unauthorized 表示用户没有认证，无法进行当前操作
- **404** Not Found 服务端没有找到请求的资源



### 2.2 增删改查时的数据返回格式


新建、更新或者删除数据成功，返回的 code 小于 9999 时，即为成功。每一个小于 9999 的 code 码均可对应一个专属 message。


```javascript
{
  code: 9
  message: "添加权限成功"
  request: "POST /cms/admin/permission/dispatch/batch"
}
```


查询资源成功时，根据具体的业务需求返回对应的数据格式，可为对象，可为数组。查询接口没有返回 code 和 message 字段是因为一般查询场景前端不需要进行 message 的弹框提示。


无论增删改查失败时，返回对应的 code 码和 message 信息。代表错误的 code 码均大于 9999。


```javascript
{
  code: 10051
  message: "access token 过期"
  request: "GET /cms/admin/group/all"
}
```
#### 
### 2.3 接口提示信息


Lin CMS 默认弹出后端返回的 message 信息，但前端也可以自行定义一套前端专属的提示信息。比如针对同一个 code 码 10051，后端返回的 message 为 ‘access token 过期’，前端则可以同样定义 message 为 ‘令牌已过期’ 来进行弹窗提示。
## 3. 命名规范


- 文件夹名、文件名小写，如果多个单词使用 ‘-’ 连接，且统一使用单数，如 user 而非 ~~users~~，如果是集合则使用 list 或 collection 拼接
- 不推荐使用简写，比如用 image 而非 img
- RESTful API 统一采用小写英文，多个单词采用中划线分开，如/this-is-an-example
- 前端变量名采用驼峰形式
- Class name采用驼峰形式，首字母大写
- 数据库表名/字段名采用小写英文，多个单词用下划线分开
- 使用全大写英文来命名常量，多个单词采用下划线分开
