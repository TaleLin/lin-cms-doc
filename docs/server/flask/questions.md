---
title: 常见问题汇总
---

# <H2Icon /> 常见问题汇总

## 如何使用 python3.7

文档中给出了两种安装方式，如果你通过 pipenv 安装，且本地没有 python3.6 的环境，只有 python3.7 的环境。那么你可能会遇到如下问题：

<img-wrapper>
  <img src="http://imglf5.nosdn0.126.net/img/Qk5LWkJVWkF3NmdBVHArVnMvMUMwMXJsK21VRFdteEJVN1NuSERVTGxtWkVZVitvTzFTS1p3PT0.png?imageView&thumbnail=1680x0&quality=96&stripmeta=0"/>
</img-wrapper>

我们在 Pipefile 中指定了 python 的环境为`3.6`，但是你想使用`3.7`，那么请将 Pipefile 中的 3.6 换成 3.7 即可。

## 核心库版本过旧问题

`Lin-CMS` 自 [0.1.1a6](../../update/flask.md#_0-1-1a6) 版本开始，针对数据表字段命名进行了重构，如果你在第一次启动项目的时候就报出如下错误：
```shell
from lin.enums import UserAdmin, UserActive
ImportError: cannot import name 'UserAdmin'
```
这可能是由于你的核心库版本过旧所导致，请检查 `Lin-CMS` 核心库版本号是否 >= `0.1.1a6`，如果不是，请升级核心库的版本号为 `0.1.1a6` 或更高即可。
