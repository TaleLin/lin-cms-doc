# 文件上传系统

## 概述
在一个CMS系统中，除了增删改查的业务，可能最刚需的功能的就是图片上传了，
而图片又是属于文件的范畴，所以，为了避免开发者重复编写上传相关的业务代码，
Lin 为开发者提供了一个文件上传系统。

在 flask 框架中，虽说已经内置好了文件上传操作，但如果你想实现一个功能比较完备的文件上传系统，可能还需要考虑到诸如文件扩展名校验、文件大小校验、文件数量校验、文件存储位置等等问题。

lin 提供的文件上传系统，已经封装好了上述比较棘手耗时的功能，这可以帮助你简单快速地实现文件上传的相关业务。

## 使用

### 模式

我们把 lin 的文件上传接口定到了`cms/file/`这个路径上，你可以通过 post 方法上传文件。lin 默认的文件上传实现`LocalUploader`这个类，意思是前端上传的文件会保存到服务器本地，但更多的时候我们需要将文件保存到云服务器上，如阿里云或腾讯云，lin 并没有局限在此，你可以自己实现存储文件的逻辑，将文件保存到你希望的地方。

对于文件上传(`file`)这种可以有多种实现方式的功能，我们把其诸多实现归入
到`app/extensions/file`这个目录下。如`local_uploader.py`这个文件实现了上传到本地
的`LocalUploader`类，`config.py`文件是与其相关的配置文件。

```bash
app/extensions/
└── file
    ├── config.py  # 配置文件
    └── local_uploader.py # LocalUploader类实现文件
```

默认的情况下在，`cms/file/`这个接口使用`LocalUploader`这个文件上传实现类。

```python
@file_api.route('/', methods=['POST'])
@login_required
def post_file():
    # 解析前端上传的文件
    files = request.files
    # 将解析后的字典作为参数传入LoaclUploader类
    uploader = LocalUploader(files)
    ret = uploader.upload()
    return jsonify(ret)
```

在这段代码中， 我们首先调用了flask的请求对象`request`上的`files`字典，它会为我们自动解析客户端传输过来的文件，然后实例化了`LocalUploader`类，并将`files`作为构造参数传递给 LocalUploader，在LocalUploader构造方法中，我们校验了客户端传输过来的文件是否符合我们约定的配置，最后调用其`upload`方法。

记住这一步，它是固定的，任何继承自`Uploader`这个基类的实现类必须重写`upload`方法
，如`LocalUploader`中：

```python
class LocalUploader(Uploader):

    def upload(self):
        pass
```

当需要实现其它的上传类时，如上传到阿里云 OSS，我们只需要重新定义一个`Aliyun`类，
在类中重新实现这个`upload`方法，而后在视图函数中，更
换`LocalUploader`为`Aliyun`即可快速切换。

### 实操

在具体的实践之前，我们需要了解一下`file`的具体配置。

```python
FILE = {
    "STORE_DIR": 'app/assets',       # 文件的存储路径
    "SINGLE_LIMIT": 1024 * 1024 * 2, # 单个文件的大小限制，默认2M
    "TOTAL_LIMIT": 1024 * 1024 * 20, # 所有文件的大小限制，默认20M
    "NUMS": 10,                      # 文件数量限制，默认10
    "INCLUDE": [],                   # 文件后缀名的排除项，默认排除[]，即允许所有类型的文件上传
    "EXCLUDE": []                    # 文件后缀名的包括项
}
```

:::tip

为了提高配置的灵活性，你也可以在实例化Uploader的实现类的时候，指定 config 参数来传入你的自定义配置。方法如下：

:::
```python
# config 参数为一个字典。注意：当字典的key值和上述6个配置项key值相同时，才会被解析
uploader = LocalUploader(files, config={'NUMS': 2, 'SINGLE_LIMIT': 1024 * 1024 * 1})
```

在单个配置的后面，笔者已经以注释的方式解释了每项的作用。当然还需要着重解释一下`exclude`和`include`
这两项，默认情况下，只会读取它们中的一项，如果两项皆为空列表的话，所有的文件类型都会被允许上传，如果二者都不是空列表则取`include`为有效配置，总而言之，系统只会支持使用一项。

注意了！！！在`app/extensions/`下的配置文件，系统不会帮我们做自动加载，不同于
`app/config`。因此，你必须在`app/app.py`的`create_app`方法中，显示的加载该配置文件

```py
## 手动加载配置文件
def create_app(register_all=True):
    app = Flask(__name__, static_folder='./assets')
    app.config.from_object('app.config.setting')
    app.config.from_object('app.config.secure')
    # 加载其他配置文件：
    app.config.from_object('app.extensions.file.config')
    ...
```

当做好了这些后，我们使用 postman 测试一下文件上传。

<img-wrapper>
  <img src="http://imglf5.nosdn0.126.net/img/L1FxUmNhYXM3L2ZWaFZGUFVNRWJBbmZMYldnckpPNEk0RjNJcEM3K3duYmxMeEJxMm1hOGFnPT0.png?imageView&thumbnail=2090y1120&quality=96&stripmeta=0">
</img-wrapper>

上传成功后，我们会得到如下的结果：

```json
[
    {
        "id": 19,
        "key": "one",
        "path": "2019/07/17/e892f8da-a840-11e9-8088-c4b30191a4f8.png",
        "url": "http://127.0.0.1:5000/assets/2019/07/17/e892f8da-a840-11e9-8088-c4b30191a4f8.png"
    },
    {
        "id": 20,
        "key": "two",
        "path": "2019/07/17/e89816ba-a840-11e9-9f59-c4b30191a4f8.png",
        "url": "http://127.0.0.1:5000/assets/2019/07/17/e89816ba-a840-11e9-9f59-c4b30191a4f8.png"
    }
]
```

由于上传了两个文件，因此我们得到了两个元素的数组，它们的结构如下：

| name |         说明          |  类型  |
| ---- | :-------------------: | :----: |
| id   | 文件存储到数据库的 id | string |
| key  |    文件上传的 key     | string |
| path  | 文件的服务器本地相对路径  | string |
| url  |     可访问的 url      | string |

:::tip

系统会自动帮助我们上传的文件做 md5，因此你大可不必担心文件重复上传，如果你上传了
重复的文件，服务器会返回已传文件的数据。

:::
