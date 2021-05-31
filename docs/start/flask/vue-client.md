# 前端起步

::: warning
阅读本小节前，请确保你已经完成了[服务端部署](./)，否则在登录时将无法通过权鉴认证。
:::

## 你必须了解

Lin 的前端是基于 Vue 的，所以你必须首先安装一些支持 Vue 的运行环境以及必备工具。无需担心，正如同我们之前运行 Server 时的步骤一样，前端的起步依然非常简单。

## Client 端必备环境

- 安装 `Node.js`（version：8.11.0+）
- 确保 `npm` 或者 `yarn` 可用

## 下载工程代码

打开命令行工具，键入以下命令：

```bash
git clone https://github.com/TaleLin/lin-cms-vue.git
```

## 安装依赖包

进入工程项目根目录后，键入以下命令:

```bash
npm install
```

## 运行

因为 Lin 是基于 `vue-cli3` 开发的，那么默认的本地服务启动的命令：

```bash
npm run serve
```

::: tip Node 版本要求
Vue CLI 需要 [Node.js](https://nodejs.org/) 8.9 或更高版本 (推荐 8.11.0+)。你可以使用 [nvm](https://github.com/creationix/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 在同一台电脑中管理多个 Node 版本。
:::

<br/>

**每个人的 `node` 开发版本不尽相同，可能会遇到 `Node Sass` 兼容性问题，请尝试下面的命令：**

```bash
npm rebuild node-sass
```

## 完成登录

1. **配置 api 地址：** 打开配置文件 `src/config/index.js` 配置 `baseUrl` ，本地开发阶段配置本地虚拟域名(http://localhost:5000/)，线上部署生产域名。

2. 通过管理员账号密码登录，[账号密码](./README.md#运行)通过 `起步` 中脚本创建。

到此，通过脚手架内置的 webpack 本地服务，访问http://localhost:8080，将打开 Lin 的登录页面，接下来你可以查看前端代码的[目录结构](../../client/catalog.md)，对 Lin 有一个初步认识。

**接下来我们来完成一个简单的 [Demo](./frontend-demo.md) 帮助开发者更快的熟悉 Lin。**

<RightMenu />
