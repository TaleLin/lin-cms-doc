---
title: 插件使用
---

# <H2Icon /> 插件使用（目前处于测试状态）

## 用配置开启插件

打开`app/config/setting.py`文件，如果该文件中已经存在了如下配置：

```py
PLUGIN_PATH = {
    'oss': {'path': 'app.plugins.oss', 'enable': True},
}
```

那便证明你已经使用了最新的示例项目，不需要更新，如果你的配置文件没有上述字段，请更换成上述配置。

下面我们解释这个配置项：

- PLUGIN_PATH：每个插件的单独配置。
  如`oss`代表当前的插件的名字为**oss**，`path`表示插件的路径，如 oss 插件的路径在`app/plugins/oss`下，`enable`表示开启 oss 插件。

## 上传图片至本地

### 默认使用

我们运行`starter.py`文件，然后请打开 postman 测试工具，选择 post 方法，请求 url 为`http://localhost:5000/plugin/oss/upload_to_local`。

你可能会有所疑惑？这个 url 是如何确定的，插件中的路由 url 满足下述规范。

- 所有插件的路由都会被挂载到 plugin 的蓝图中，该蓝图的路径前缀为`/plugin`。
- 每个单独的插件都会有一个名字，如 oss 插件的名称为`oss`，若在该插件下，存在多个红图实例（redprint）,则其所有路由都会有一个二级前缀`/oss`。若该插件下只存在一个红图实例，即一个 controller，则不会有二级前缀，你的路径只有一个一级前缀，即`/plugin`。
- 后面的路径就被每个插件下的红图所确定，如 oss 插件下有个名为`oss`红图实例，该红图下有`upload_to_local`这个视图函数。此时该插件只有一个红图实例，故它的前缀只有一级，所以上传到本地的 url 为`/plugin/oss/upload_to_local`。如果 oss 插件下有多个红图实例，且某个红图名为`some`，some 下有`test`的视图函数，则访问这个视图函数的 url 为`/plugin/oss/some/test`。

<img-wrapper>
  <img src="http://imglf6.nosdn0.126.net/img/Qk5LWkJVWkF3NmdaV1VSUVRXWWR1TnJRMkV2dzF4ampld1lyWHA4L1duZmMyVFc3RWVnQ2pRPT0.png?imageView&thumbnail=1680x0&quality=96&stripmeta=0"/>
</img-wrapper>

并选择任意一张本地图片上传，你可能会有些许奇怪，本地上传本地？当然你也可以上传到阿里云，前提是你已经开通了自己的 oss，在这里我们先以上传到本地为例。

点击`Send`，如果一些顺利你会看到如下返回结果：

```json
{
  "error_code": 0,
  "msg": "成功",
  "request": "POST  /plugin/oss/upload_to_local"
}
```

并且你的根目录下的 app 目录下会多出一张你刚才上传的图片。

### 修改配置后使用

有时候，我们不希望直接把图片传到 app 目录下（oss 插件的默认配置上传目录为 app 目录），那将该如何修改了？

很简单，前面我们提到过多次插件的配置，记住是插件单独的配置。打开`app\plugins\oss\config.py`文件：

```py
access_key_id = 'not complete'
access_key_secret = 'not complete'
endpoint = 'http://oss-cn-shenzhen.aliyuncs.com'
bucket_name = 'not complete'

upload_folder = 'app'
allowed_extensions = ['jpg', 'gif', 'png', 'bmp']
```

如上，便是该 oss 插件的配置，其中`access_key_id`，`access_key_secret`，`endpoint`，`bucket_name`均为阿里云 oss 的配置项，如需使用 oss 上传图片，直接修改这些配置项即可。

`upload_folder`表示上传到本地的路径，默认是工作目录下的 app 目录，`allowed_extensions`便是支持哪些格式的图片上传，如`jpg`。

接下来，我们修改配置使图片上传到`app/static`，请注意，如果你的 app 目录下没有 static 目录，请新建一个 static 文件夹。

那么我们该在上述的`config.py`文件中修改`upload_folder`吗？理论上说没问题，但是原则上不好！因为我们的插件可能来源于`pipy`，即它可能不在当前的 plugins 目录下，那么我们不可能直接去 site-packages 下修改配置，所以我们需要在另外一个地方修改配置。这个地方就是刚才的`PLUGIN_PATH`。

```py
PLUGIN_PATH = {
    'oss': {'path': 'app.plugins.oss', 'enable': True, 'upload_folder': 'app/static'},
}
```

再次在 postman 上点击`Send`按钮，如果顺利，此时`app/static`下已经多了一张图片。

## 小结

在本小节，我们使用了 oss 这个插件，当然只能上传到本地，如果你有阿里云 oss 账号，大可配置好后，使用其他接口，请在`controller.py`文件中查看相应的 api。

我们还通过修改配置来修改上传的目录，请注意配置很重要，真的很重要，它给了插件很大的灵活性。

但是，在此你可能会疑惑，插件的配置与 Flask 的配置有何区别？为何我们还需要一个插件的配置，而不是直接从 Flask 中读取。

原因有如下几点:

- Flask 的配置依赖 Flask 的上下文。在 Flask 中读取配置，你必须在 Flask 的上下文中才能读取到相应的配置，而我们的插件是通过路径加载的，它的加载先于 Flask 的上下文创建，因此很多配置只能在视图函数中使用，这不够灵活。

- 插件的配置既可以在 config.py 中配置，也可以在 setting.py 中更改，Flask 本身的配置机制不能够满足如此需求。

- 再者，Flask 的配置有明确的要求，所有字母均要求大写，但很多时候如`oss`名称，我们还是觉得小写比较直观，而且我们必须让取配置更加方便，如`lin_config.get_config('oss.upload_folder')`可直接取到 oss 下的 upload_folder 配置。很多时候插件的配置是层叠的，我们支持二级直接取配置。

插件的实战到这里就结束了，你可能觉得会有些短，有些少。但是这确实是真实的情况，因为插件本身就很简单，你完全可以把它理解为一个**微 app**。按照我们之前的开发规范来开发插件即可。

想要自己写一个插件，来，[我们开始](./plugin_create.md)

<RightMenu />
