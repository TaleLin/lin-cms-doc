---
title: 行为日志
---

# <H2Icon /> 行为日志

## 行为日志（logger）

在诸多 CMS 系统中，权限被分配给用户后，那么就代表这一用户拥有某个权限的绝对控制权。但是有些权限又比较危险，比如删除所有图书这个权限，它很可能直接清除了系统里面的所有图书数据，这显然是一个危险的操作。那么这么危险的操作，如果发生了，作为管理员你该怎么办了。很简单，找到该用户，并禁用该用户，随后联系开发者，恢复数据。

logger 主要用来解决这一类的问题，当然你可以将记录任何你觉得敏感的操作，比如某用户访问了某私密数据。接下来，我们来实操一下 logger 的使用。

我们修改`get_book`这个视图函数为：

```py
from lin.log import Logger
# 省略诸多代码
@book_api.route('/<id>', methods=['GET'])
@Logger(template='某用户查询了一本图书') # 推送的消息
def get_book(id):
    book = Book.query.filter_by(id=id).first()
    if book is None:
        raise NotFound(msg='没有找到相关书籍')
    return jsonify(book)
```

接下来，当有任何用户请求这个 API 时，均会在数据库中写入一条日志信息。该日志信息的数据模型的定义在`lin.core`中，对应的数据表名为`lin_log`。

但有时，*某用户查询了一本图书*这样的信息未免显得太过于单薄，它无法很好的向前端说明更多的信息。因此 Lin 提供了一个简单的模板语法，你可以在`template`这个参数中，写入一些变量，如`{user.username}查询了一本图书`，请记住每一个`{}`中就可以写入一个变量，`user.username`就表示当前用户的昵称。如下：

```py
from lin.log import Logger
from lin import route_meta, group_required, login_required
# 省略诸多代码
@book_api.route('/<id>', methods=['GET'])
@Logger(template='{user.username}查询了一本图书') # 推送的消息
@login_required # 必须，如果用户不登陆，就没有user这个实例
def get_book(id):
    book = Book.query.filter_by(id=id).first()
    if book is None:
        raise NotFound(msg='没有找到相关书籍')
    return jsonify(book)
```

此时，你每请求一次这个 API，它就会在数据中写下下面类似的信息（请注意，这个 API 现在请求必须登陆）。

```bash
+----+---------------------+---------------------+---------+-----------+-------------+--------+------------+-----------+
| id | message             | time                | user_id | user_name | status_code | method | path       | authority |
+----+---------------------+---------------------+---------+-----------+-------------+--------+------------+-----------+
|  1 | pedro查询了一本图书 | 2018-10-24 18:11:40 |       4 | pedro     |         200 | GET    | /v1/book/1 |           |
+----+---------------------+---------------------+---------+-----------+-------------+--------+------------+-----------+
1 row in set (0.13 sec)
```

:::warning
如果你此时请求，发现`没有找到相关书籍`的异常时，请不要惊慌，因为在前面的教程中，我们确实通过软删除删除了所有的图书数据
所以此时你有两种选择：
一、前往数据库将 delete_time 置为 NULL。
二、在 filter_by 函数中，将 soft 参数置为 False，如`Book.query.filter_by(soft=False,id=id).first()`。
:::

我们的模板语法，不仅仅可以在其中嵌入`user`这个实例，你还可以嵌入 Flask Response 的任何属性，如：`response.status`，还有 Flask Request 的诸多属性，如`request.url`。

| name     |        说明         |  类型  |
| -------- | :-----------------: | :----: |
| user     |   user_model 实例   | object |
| response | Flask Response 实例 | object |
| request  | Flask Request 实例  | object |

这一切取决于你的需求，关于 user 的所有属性，请阅读 user_model 中的所有属性，response 和 request 的所有属性，请阅读[Response](http://flask.pocoo.org/docs/1.0/api/#response-objects)，[Request](http://flask.pocoo.org/docs/1.0/api/#incoming-request-data)。

<!-- ## 消息推送（notify）

notify 是一种消息推送的解决方案，它基于 SSE（Server Sent Events）,关于 SSE 你可以简单的理解为它是一种类 Websocket 的通信方式，
具体细节请你阅读[MDN 官网](https://developer.mozilla.org/zh-CN/docs/Server-sent_events/EventSource)。

notify 主要用来解决服务器向前端推送消息，例如当购物小程序中，某用户配送一件商品，这是服务器向 CMS 前端推送该消息，然后管理员看到消息通知配送员配送。
接下来，我们来实操一下 notify 插件的使用。

我们再次修改`get_book`这个视图函数为：

```py
from lin.log import Logger
from lin.notify import Notify
# 省略代码。。。
@book_api.route('/<id>', methods=['GET'])
@Logger(template='{user.username}查询了一本图书')
@Notify(template='{user.username}查询了一本图书', event='queryBook')
@login_required
def get_book(id):
    book = Book.query.filter_by(id=id).first()
    if book is None:
        raise NotFound(msg='没有找到相关书籍')
    return jsonify(book)
```

在 Notify 的构造函数中你可以传入诸多参数，其中`template`与`event`为必传，template 的用法与 Logger 的 template 用法完全一致，而 event 为当前推送事件的名称。

你可能会奇怪，为什么需要多加一个 event 参数，因为对于 CMS 来说，管理员需要决定某些用户可接受的推送消息，有一些消息只能推送到某些人。因此请开发者你谨慎使用 event 这个属性，因为有些推送消息不能让某些人知道。

接下来，当任何用户访问该 API 时，CMS 前端便可以接受到一条推送消息，关于真正的实现效果，[参考]()。 -->

<RightMenu />
