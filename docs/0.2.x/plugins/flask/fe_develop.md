---
title: 前端插件开发
---

> 测试状态，仅供参考

# <H2Icon /> 前端插件开发

## 插件结构说明

添加的插件结构如下:

```hash
.
├── package.json     # 插件基础配置
├── stage-config.js  # 舞台配置
├── README.md        # 给插件使用者查看的帮助文档
├── views            # 舞台页面
│   ├── xxx.vue
│   └── ...
├── components       # 组件
│   ├── xxx.vue
│   └── ...
└── assets           # 资源文件
    └── ...
```

查看文件结构说明[插件结构](./fe_structure.md)

## 创建插件

1. 进入项目文件夹
1. 执行命令 `npm run plugin-new` 并根据提示操作
1. 若项目未启动, 执行 `npm run serve` 启动项目

打开项目, 可以看到左侧栏中多了刚创建的插件内容, 并且可以点击打开对应页面. 接下来就可以根据具体业务需求进行开发了

## 开发插件业务

参看 [前端开发](../../client/README.md)

::: tip
业务开发与 Lin-CMS 前端开发一致
:::

## 插件依赖

开发插件的时候您可以根据需要使用 `npm` 安装需要的依赖, 但是需要将安装后的依赖添加进插件的 `package.json` 中.

<!-- markdownlint-disable -->
<RightMenu />
<!-- markdownlint-enable -->
