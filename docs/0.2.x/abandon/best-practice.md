# 最佳实践

> 本文将带你从 0 开始使用 Lin，并给出最佳实践的开发目录和方法。  
> 当然你也可以直接访问[Lin-Template](http://www.baidu.com)查看最佳实践的模板项目。

## 1.安装 Lin-CMS-Flask

我们将 Lin-CMS-Flask（以下，我们简称 Lin） 发布到了 `pypi` 上，因此你可以直接通过`pip`来安装。在安装使用前，请确保你的 python 版本大于或等于 3.0。
对于 python 的版本，我们没有严格的界限，Lin 是一个基于 Flask 和 Flask-SQLAlchemy 的框架，一般来说只要满足这两者的版本均可以使用 Lin。但我们**强烈建议**，你使用 python3.6 的版本。

打开你熟悉的 terminal 工具，键入如下命令：

```bash
pip install Lin-CMS-Flask
```

如果一切顺利，你会在 python 的库目录（site-packages）下找到名为`lin`的文件夹。

## 2.开始一个项目

接下来，我们会以一个简单`book`项目来详细介绍 Lin 的使用（请确保你有一定的 Flask 开发经验）。在刚才的 terminal 中输入如下命令：

```bash
mkdir book && cd book
```

然后用你喜爱的 IDE 打开该项目，在根目录下新建`book.py`文件。lin 确切的说，是一个 Flask 的插件，因此我们必须首先初始化一个 Flask 的 app。在`book.py`中输入如下代码：

```py
from flask import Flask

app = Flask(__name__)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

这是一个最简单的 Flask app 的创建方式，接下来我们需要引入 lin，并将其逐步变得复杂，但其实真的不复杂。
lin 的使用跟其他 Flask 插件的使用一样简单，首先，我们引入`Lin`这个核心类。

```py
from lin import Lin
```

接着，由于 lin 是一套完备的 CMS 解决方案，因此数据库的引入是必须的。lin 使用 SQLAlchemy 作为数据库操作工具，所以只要是 SQLAlchemy 支持的数据库，lin 也肯定支持。但是我们建议你使用 mysql 作为数据库首先，在本文中我们使用 sqlite。在 Flask 的配置中加入`SQLALCHEMY_DATABASE_URI`的配置：

```py
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'book.db')
```

我们以当前工作目录下的`book.db`作为 sqlite 数据库的存储位置（book.db 会在程序运行后自动创建）。随后我们初始化 lin,完整代码如下：

```py
from flask import Flask
from lin import Lin
import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'book.db')

lin = Lin(app, create_all=True)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

如果一切顺利，你会在当前目录下看到`book.db`数据库文件，服务器会监听本地的 5000 端口。并且数据库中已经有如下表格：

```bash
lin_auth // 权限表
lin_event // 推送事件表
lin_group // 权限组表
lin_log // 日志表
lin_user // 用户表
```

到此你已经创建了一个最小型的 CMS 项目，lin 默认集成了一套用户系统和权限系统以及内置了日志插件和推送插件。具体使用参考[说明](###2.开始一个项目)。

## 3.视图函数及权限挂载

lin 本身对 Flask 无侵入性，因此你可以按照你喜爱的 Flask 构建方式进行后续开发，当然我们非常希望你能够参考我们的[Lin-Template](http://www.baidu.com)进行开发。接下来，我们将创建第一个视图函数：

```py
@app.route('/')
def home():
    return jsonify({
        'msg': 'hello lin cms!!!'
    })
```

而后我们打开浏览器输入`http://127.0.0.1:5000/`，你会看到如下返回结果：

```json
{
  "msg": "hello lin cms!!!"
}
```

## 4.新建用户和分组

## 5.自制插件与应用
