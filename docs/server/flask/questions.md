---
title: 常见问题汇总
---

# 待更新

# <H2Icon /> 常见问题汇总

## 如何部署项目

::: error
我们不建议在 windows 平台部署。
:::

在\*nix 平台平台，你可以使用如下命令安装依赖：

```bash
pip install -r requirements-prod.txt
```

使用 gunicorn 运行项目

```bash
gunicorn -c gunicorn.conf.py starter:app --daemon
```

> **Tips:**
>
> 确认当前`.flaskenv`文件设定为 `production`环境
>
> 如果不需要以守护进程运行，省略`--daemon`参数即可。
