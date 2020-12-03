---
title: 插件结构
---

> 测试状态，仅供参考

# <H2Icon /> 插件结构

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

## README

README 中书写插件文档, 包括使用方式, 提供的api等. Lin 插件库中的插件, README 中包含以下几部分:

* 插件名和业务场景简述
* 舞台页面列表
* 组件列表
* 是否有配置文件, 配置文件说明
* 提供的全局方法列表

## package

:::tip
package 参考 npm 包的 package.json 文件格式. [npm标准](https://docs.npmjs.com/files/package.json)
:::

package.name 名称格式为: `lin-cms-plugin-<name>`

示例:

```js
{
  "name": "lc-plugin-test",         // 插件名称, 前缀 "lc-plugin-" 是固定部分, 后面是插件名
  "version": "1.0.0",               // 插件版本号
  "description": "",                // 插件简要描述
  "author": "",                     // 插件作者
  "dependencies": {},               // 插件的运行时依赖
  "devDependencies": {}             // 插件的开发期依赖
}
```

* 插件名称指去掉前缀 `lc-plugin-` 后的部分, 将其转换为首字母大写的驼峰命名后, 作为插件文件夹名称
* 插件标题默认不超过7个字
* dependencies 和 devDependencies 只需在开发完成后, 从项目 `package.json` 文件中取出插件需要的部分即可

## stage-config.js

舞台配置与 Lin-CMS 舞台配置模式一致, 请查看[此处](#)

## views, component等

views 中放置主舞台类型页面, component 中放置组件, assets 放置图片等资源. assets 中资源文件会使用 webpack 进行 load
