---
title: 自定义异常响应
---

## 前言

Lin-CMS 提供了强大的异常机制 APIException， 你可以使用它来定制你想要的 WEB API 响应（甚至不是异常）。

## 使用

我们在`app/api/v1/book.py`中加入如下代码：

```python
from app.exception.api import BookNotFound


@book_api.route("/exception/<string:t>")
def get_exception(t):
    """测试异常的返回值"""
    raise {
        "b": NotFound("没找到"),
        "c": NotFound(12, "没找到"),
        "d": NotFound(12),
        "e": BookNotFound(12),
    }.get(t, NotFound)

```

首先，我们需要知道`NotFound`和`BookNotFound`异常是这样定义的:

```python
class NotFound(APIException):
    # 消息状态码，对应响应头的http status code
    code = 404
    # 消息内容, 对应响应体 message 字段
    message = "Not Found"
    # 消息码 对应响应体的 code字段
    message_code = 10021

class BookNotFound(NotFound):
    message = "书籍不存在"
    # 自动转换消息文本，默认为True
    _config = False

```

然后，我们来直接测试一下。

运行 flask 服务,在浏览器打开调试模式，切换到`network`功能标签，然后在地址栏中分别访问如下地址并观察得到的响应：

- http://127.0.0.1:5000/v1/book/exception/a

  > http 状态码 404
  >
  > { code: 10021, message: "用户不存在", request: "GET /v1/book/exception/a" }

  按照逻辑，返回的是`NotFound`, 即`{code: 10021, message: "Not Found", request: "GET /v1/book/exception/a"}`, 响应体的`message`字段为何被更改了？

  Lin-CMS-Flask 的默认异常策略是，根据异常的消息码, 获取`app/config/code_message`中`MESSAGE`对应的消息，填充到响应体的`message`字段，当消息码没有被收录，才会返回定义时的 message。

- http://127.0.0.1:5000/v1/book/exception/b

  > http 状态码 404
  >
  > {"code": 10021, "message": "没找到", "request": "GET /v1/book/exception/b"}

  如果你只是临时需要定义响应体的 message，那么就像`NotFound("没找到")`直接传入对应的文字即可。

- http://127.0.0.1:5000/v1/book/exception/c

  > http 状态码 404
  >
  > {"code": 12, "message": "没找到", "request": "GET /v1/book/exception/c"}

  如果你只是想在程序中偶尔表达`NotFound`的语义以及需要返回 404 的 http status，消息状态码(code)和消息文本(message)都需要定制，那么你可以使用类似`NotFound(12,"没找到")`的形式传入两个参数即可,注意传入的先后顺序。

- http://127.0.0.1:5000/v1/book/exception/d

  > http 状态码 404
  >
  > {"code": 12, "message": "新建图书成功", "request": "GET /v1/book/exception/d"}

  看见这个 message 可能有些错愕:它指定 message_code 为 12， 然后获取了 12 对应的消息文本。

- http://127.0.0.1:5000/v1/book/exception/d

  > http 状态码 404
  >
  > {"code": 12, "message": "书籍不存在", "request": "GET /v1/book/exception/e"}

  如果你常用的 异常类不需要自动替换 消息文本 message 的特性，那么可以加一个类属性`_config`，并定义其为`False`即可。
