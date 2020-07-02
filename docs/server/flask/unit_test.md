# <H2Icon /> 单元测试

> 请注意，这是一个选看章节，如果你原来一直在使用单元测试，那么这节你必不可错过。
> 如果你原来没有做过单测，或者说极少做，我们强烈建议你，从此开始把单元测试作为一种习惯。

## 导语

在写这章之前，笔者一直很踌躇，因为我并没有多年的开发经验，甚至是一年都没有。换言之，我还没有一个良好的软件开发习惯，没有一个标准的开发约束，如果你和我一样，那么请你一定要仔细阅读本小节，并且开始尝试认真，仔细的做单测，它将会让你受益匪浅。

谈到单测，我想许多人和我一样一开始都比较抗拒，因为这是一种自我的否定，你默认自己写出来的代码是有问题的，于是你尝试用不同的方法，不同的角度去测试你代码的健壮性。于是不出所料，你的单测没有通过，或者部分通过，然后开始在代码中找 bug，边找边改。

没错，这看起来很烦，很浪费时间，甚至占据了开发的一半时间。但是人无完人，玉无完璧，没有人可以很自信的说，我的代码就是完美的，在辩证法中，有一种不断自我否定追求极致的言论。著名的曾国藩先生，被很多人评价为古今第一完人，那么他真的是完人吗？当然不是的，曾国藩不知道有多少的小毛病和错误，但他一直坚持自我完善，所以才能做到趋于极致，连毛主席都对他敬赞有加，甚至拿他和孔子相提并论。

所以，我想你已经大致明白了我的意思。**单测**真的很有必要，你可以在单测中找到自己的毛病，认识自己的不足，甚至在与其对抗时不断的提高自己，凝练自己思维，这将会让你的成长越发迅速。

## 准备

回到正题，在 flask 的[官方文档](http://flask.pocoo.org/docs/1.0/testing/)中给出有了一系列的单元测试方法，由于 Lin 本身是前后端分离的方式，后端遵循 Restful 风格，所以本节并没有用到如此多的测试方式，如果你觉得下面的测试方法不能满足使用，请记得一定去阅读 flask 的[官方文档](http://flask.pocoo.org/docs/1.0/testing/)。

在 Python 中有许多的测试库，我们选择主流的`pytest`来进行单元测试，当然如果你喜欢折腾，不使用 pytest 也是可行的。如果你使用的是我们提供的`Pipefile`安装的虚拟环境，那么你已经默认安装好了 pytest，如果你是通过`requirements.txt`安装的依赖，那么你还没有 pytest 这个库，因为`requirements.txt`是为生成环境所提供。所以无论你是那种方式，你都可以先通过如下命令来测试一下你是否已有 pytest 这个库，如果你没有，它都会帮你装上这个库。

pytest 是一个强大的 python 测试库，它的特性很丰富，你可以查看[文档](https://docs.pytest.org/en/latest/)进行了解。

```bash
pip install pytest
```

## 测试

接下来让我们开始一个简单的测试吧。聪明的你，一定会发现我们项目的根目录下有一个 tests 的目录，按照约定，请将专用于测试的文件全部置于此目录下。然后在此目录下新建`test1.py`文件，并向其中加入以下内容：

```py
import sys
import os

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))))
from app.app import create_app

app = create_app()

```

请注意，如果你使用 pycharm，由于它自带便于测试的工具，你可以直接点击运行箭头运行测试。但是如果你使用其它的编辑器，那么请一定在测试文件**最顶部**加入：

```py
import sys
import os

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))))
```

这段代码。否则你会找不到 app 这个模块。接下来，我们书写测试函数：

```py
def test_login():
    with app.test_client() as c:
        rv = c.post('/cms/user/login', json={
            'username': 'pedro', 'password': '123456'
        })
        json_data = rv.get_json()
        print(json_data)
        assert json_data['access_token'] is not None
        assert rv.status_code == 200

```

在这个测试函数中，我们测试了`/cms/user/login`这个 API，传入了`username`和`password`这两个参数，通过断言来验证返回结果的正确性。

接下来，运行这个测试文件：

```bash
pytest.exe test1.py
```

如果一些顺利，它会给你一个 pass。

很好，一般情况下 http 请求偶尔会带 `params` 和 `headers`，params 我们可以在请求路径中加入，如`/cms/user/login?name=pedro`,这样 name 就可以被解析成一个参数，参数值为 pedro，对于 header 我们可通过如下方式进行传入：

```py
def test_change_password():
    with app.test_client() as c:
        rv = c.put('/cms/user/', headers={
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDQwNTc4NTEsIm5iZiI6MTU0NDA1Nzg1MSwianRpIjoiOTkxNzU3MzAtODAyZi00NTAwLWFkNzMtY2NiZjY4YTc4ZjM3IiwiZXhwIjoxNTQ0MDYxNDUxLCJpZGVudGl0eSI6MiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.sHpcCqVEy7d-LjhJpKY2uyeHPxpU3XGZO6CJFyaAHsw'
        }, json={
            'email': '1312342604@qq.com'
        })
        json_data = rv.get_json()
        print(json_data)
        assert rv.status_code == 201

```

再次运行：

```bash
pytest.exe test1.py
```

如果顺利，这两个测试都会通过，如果`test_change_password`未通过，这也在情理之中，因为 token 的有效期仅有一个小时。这个时候你需要拿到登陆成功后颁发的 access_token 替换 header 中的内容，这样你的测试便会全部通过。

## 尾语

以上两个测试对于一般的项目 API 开发来说可能已经足够，但是对于其它类型的单测，笔者均未提到。这些测试大多异曲同工，也希望你能真正的去学习如何利用单测来提高代码质量，顺便凝练自己的思维，愿你在漫漫的成长路上珍惜每一个自我否定，自我沉淀的机会，与诸君共勉之。
