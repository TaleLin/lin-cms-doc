---
title: 日志系统
---

# <H2Icon /> 日志系统
## 简介
不同于[行为日志](./logger_and_notify.md)，日志系统可以记录你的程序在运行时的所有信息。  
在一个项目的开发阶段，控制台会显示明了的请求以及报错信息，使用IDE来debug也非常方便，但是到了生产环境，出于安全起见我们必须关闭掉debug模式，当我们的程序发生问题时(要知道在生产环境下也会产生意想不到的bug)，如果没有记录日志，我们就很难定位到错误发生的位置和错误的具体信息，想修复这些线上产生的未知错误就变得非常困难。    
日志系统主要依赖于python标准库的logging类实现。Lin自定义了日志记录方式、分割方式和格式。这可以让开发者更明了地查看日志信息。当然，如果你不喜欢Lin的日志处理方式，可以实现自己的日志处理类，按照自己的想法和业务情况记录日志。关于自定义日志类我们会在后面探讨。

## 配置
日志系统拥有自己的配置，和文件上传系统相同，日志系统配置文件也是一个单独的python模块，需要在启动app的时候注册到app上。配置文件的存放位置为`app/config/log.py`，我们根据下面的配置代码了解一下每个配置项的含义。
```python
LOG = {
    'LEVEL': 'DEBUG',               # 日志级别
    'DIR': 'logs',                  # 存放目录名
    'SIZE_LIMIT': 1024 * 1024 * 5,  # 切分大小
    'REQUEST_LOG': True,            # 是否开启请求日志
    'FILE': True                    # 是否开启日志
}
```
在上面的代码中，我们已经给出了每一项配置对应的注释。下面我们来详细介绍每一项配置：
* LEVEL 为日志级别，当该配置项为DEBUG时，日志会记录客户端的请求参数，当该配置项为INFO时，日志不会记录客户端的详细参数。
* DIR 为日志存放目录名称，采用文件的形式来记录日志，默认存放在项目根目录的`logs`目录下
* SIZE_LIMIT 为日志切分大小，在当天的日志文件大小达到切分标准时，会对日志进行切分，旧的日志以 `yyyy-mm-dd-hh-mm-ss.log` 的形式命名。而新的日志继续以 `yyyy-mm-dd.log` 命名。
* REQUEST_LOG 配置项为一个布尔值，表示是否开启`请求日志`，请求日志即客户端发起request请求的时候，会记录详细的信息，如客户端请求了管理员登录接口，日志文件中就会记录如下配置：
```bash
2019-06-16 21:19:51,879 DEBUG 63566   ---  [Thread-2] - [POST] -> [/cms/user/login] from:127.0.0.1 costs:149.200 ms data:{
	param: {},   # url parameters
	body: {'username': 'super', 'password': '123456'}  # body parameters
} 
```
当设置REQUEST_LOG为False时，系统不会记录任何请求信息。
* FILE 配置项同样为布尔值，由于日志系统默认采用文件方式进行记录，当访问量非常庞大时，大量的文件IO操作会消耗系统性能，这时你可以设置FILE配置项为False来关闭文件日志，使用自己的方式去记录日志。当然，通常对于一个中小型项目你可以不必多虑，采用此方式记录日志系统也不会有问题。

## 使用

### 默认使用
Lin默认已经开启了日志的记录，当你的程序在生产环境产生错误时，核心库的全局异常处理方法会记录这些错误的堆栈信息，例如：
```python
# 业务层的一个视图函数中产生了一个除零异常。此时模拟线上环境：app.debug = False
@app.route("/log", methods=['POST'])
def index():
    1 / 0
    return 'ok'
```
使用postman请求得到数据是这样的：
```json
{
    "error_code": 999,
    "msg": "服务器未知错误",
    "request": "POST  /log"
}
```
显然，我们无法通过这样的信息来定位错误，此时日志文件的作用就体现出来了，打开当天的日志文件，你会发现日志文件中新增了两条数据，第一条为错误的堆栈信息，错误级别为`ERROR`，第二条为请求的具体信息，错误级别为`DEBUG`，你可以通过分析日志来排查错误。  
当然，也可以使用`tail -f ${日志文件名}`来追踪日志文件，下面为具体日志信息：
```bash
2019-06-19 21:49:54,628 ERROR 44939   ---  [Thread-1] - Traceback (most recent call last):
  File "/Users/fujiale/.local/share/virtualenvs/Lin-CMS-Flask-Core-PK22Bmbq/lib/python3.6/site-packages/flask/app.py", line 1813, in full_dispatch_request
    rv = self.dispatch_request()
  File "/Users/fujiale/.local/share/virtualenvs/Lin-CMS-Flask-Core-PK22Bmbq/lib/python3.6/site-packages/flask/app.py", line 1799, in dispatch_request
    return self.view_functions[rule.endpoint](**req.view_args)
  File "/Users/fujiale/Desktop/flask-api/Lin-CMS-Flask-Core/starter.py", line 144, in index
    1 / 0
ZeroDivisionError: division by zero
2019-06-19 21:49:54,660 DEBUG 44939   ---  [Thread-1] - [POST] -> [/log] from:127.0.0.1 costs:34.990 ms data:{
	param: {}, 
	body: {}
} 
```

### 自定义使用
Lin已经在内部记录了异常日志，如果用户想在自己的业务代码中记录日志，可以直接使用[`flask框架为我们提供的日志记录方式`](https://dormousehole.readthedocs.io/en/latest/logging.html)来记录日志，即`app.logger.错误级别()`的方式来在任何位置记录。下面我们看一下示例代码：
```python
@app.route("/log", methods=['POST'])
def index():’
    # app.logger.info('info msg')
    # app.logger.warning('warning msg')
    # app.logger.debug('debug msg')
    try:
        1 / 0
    except Exception as e:
        app.logger.error("发生了除零异常")
    return 'ok'
```
再次查看日志文件，可以看到新增了两条信息：
```bash
2019-06-19 22:00:42,679 ERROR 45462   ---  [Thread-1] - 发生了除零异常
2019-06-19 22:00:42,680 DEBUG 45462   ---  [Thread-1] - [POST] -> [/log] from:127.0.0.1 costs:0.710 ms data:{
	param: {}, 
	body: {}
} 
```

:::tip

在上面的示例中，我们使用app.logger.error()来记录了error级别的日志，这里常用的错误级别还有：app.logger.info()、app.logger.warning()、app.logger.debug()等等。在我们自己记录日志的时候，一定要选择合适的错误级别，不能随便使用。
:::

## 自定义日志类
在简介中我们提到了如果开发者觉得Lin的日志记录方式不适用于自己的业务场景，可以自定义自己的日志类，本小结我们来看一看如何自定义自己的日志类，首先，我们先来关闭Lin的日志，找到app/app.py的create_app方法，实例化Lin的时候将logger设置为False：
```python
 Lin(app, logger=False)
```
此时，你就可以实现自己的日志类并且使用到项目当中了。当然，具体的实现方法不一，在标准库`logging.handlers`模块下，定义了各种方式的记录日志类，可以参考或者直接使用这个模块下面的日志处理类。
