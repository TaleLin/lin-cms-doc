---
title: 快速上手
---

> 测试状态，仅供参考

# <H2Icon /> 快速上手

本小节，我们将以[诗词展示插件](http://face.cms.7yue.pro/#/poems)为例, 让你体验插件的基本使用。
在开始之前， 我们默认你已会使用 Lin CMS 进行基本开发。若你是首次接触 Lin-CMS，请阅读[后端入门](../start/README.md)和[前端入门](../start/vue-client.md)。

诗词展示插件说明： 本插件功能是从服务端API获取古诗词数据，并展示在 Lin-CMS 舞台上。属于 AB 型插件。

## 预备

请确认你的 Lin-CMS 的版本符合要求

## 获取后端插件

用终端打开后端项目根目录，执行下面的命令，并将下载插件的源码到 `app/plugins/` 目录中
```shell
cd app/plugins/ && git clone 后端古诗词插件的仓库地址 poem
```
## 初始化后端插件
执行根目录下的插件初始化脚本`plugin_init.py`
```shell
python plugin_init.py
```

::: tip
由于我们的插件初始化机制使用pipenv检测依赖，请务必确保你的项目跑在pipenv虚拟环境下！
:::

启动项目，使用 Python 命令运行根目录下的`starter.py`
```shell
python starter.py
```

## 获取前端插件

用终端打开前端项目根目录，执行下面的命令，并将下载插件的源码到 `src/plugins/` 目录中

```shell
cd src/plugins/ && git clone 前端古诗词插件的仓库地址 Poem
```

## 初始化前端插件

执行命令

```shell
npm run plugin-init
# Poem
```

执行命令

```shell
npm run serve
```

根据执行结果打开页面， 通常是 [http://localhost:8080](http://localhost:8080)

登陆后， 左侧栏最下方是否有 `插件示例` 选项，若有，恭喜你！你已成功安装并运行了 `古诗词插件`！

<img-wrapper>
  <img src="http://imglf5.nosdn0.126.net/img/L1FxUmNhYXM3L2VBY3pTSXdzSVQraXpVZU5DRDR2N1dDclI5RStId0NqYktGbFdlN0NnbHlnPT0.png?imageView&thumbnail=1680x0&quality=96&stripmeta=0"/>
</img-wrapper>

<!-- markdownlint-disable -->
<RightMenu />
<!-- markdownlint-enable -->
