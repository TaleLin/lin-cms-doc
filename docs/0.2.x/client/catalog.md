---
title: 目录结构
---

## 目录结构

> Lin 的前端部分，是在 vue-cli3 生成的模板项目的基础上开发而来的 。
> 当然对于本项目而言，你几乎可以不用关注 vue-cli3 的内容，如果你需要对 webpack 的配置进行更改，那么如果你对 vue-cli 的使用不熟悉，建议先阅读[官方文档](https://cli.vuejs.org/zh/)。
> Lin 的开发遵循严格的目录结构和代码规范、我们希望你能对此达成共识，这非常有助于你后续的开发。

Lin 的前端部分代码结构如下：

```bash
├───public // 公共资源目录，该目录webpack原封打包
│    ├───icons // icon图片存放目录
│    │   favicon.ico // 本站favicon图片
│    │   iconfont.css // 阿里iconfont文件
│    │   index.html // template模板
│    │   robots.txt // Robots协议
├───script // 脚本
├───src
│    ├───assets // 静态资源文件存放目录
│    ├───component // 布局组件及业务基础组件
│    │   ├───layout // layout布局组件
│    │   ├───base // 通用基础组件库（包含element-ui二次封装组件）
│    ├───config // config配置项
│    │   ├───stage // 路由配置文件
│    │   │   error-code.js // 与服务端约定的错误状态码
│    │   │   index.js // 前端自定义配置项
│    ├───lin // Lin CMS核心库
│    │   ├───directive // 全局指令
│    │   ├───filter // 全局过滤器
│    │   ├───mixin // 全局mixin
│    │   ├───model // model层
│    │   ├───util // 各种工具函数
│    ├───plugin // 插件
│    ├───router // 前端路由
│    │   ├───home-router.js // 菜单路由
│    │   ├───index.js // vue-router入口文件
│    │   ├───route.js // vue-router路由配置
│    ├───store // vuex状态管理文件
│    ├───view // 业务组件
│    │   app.vue // vue根组件
│    │   main.js // webpack打包入口
│   babel.config.js // babel配置文件
│   .browserslistrc // 适配浏览器版本
│   .eslintrc.js // eslint配置文件
│   .gitignore // git上传忽略文件

```

## 解释说明

**在上面我们针对每个目录都做了相应的注释，不过下面还有几个文件夹需要额外说明一下**

- public/icons 文件夹

菜单栏的 icon 图标我们推荐用阿里的[iconfont](http://www.iconfont.cn/)，但是这并不满足一些同学需要用设计师设计的指定图标，所以我们提供了相应的机制，可以在路由配置文件直接填写路径。把 icons 文件夹放到 public 下，是因为任何放置在 `public` 文件夹的静态资源都会被简单的复制，而不经过 `webpack` 。

```js
   {
      title: '添加图书',
      type: 'view',
      name: 'bookAdd',
      route: '/book/add',
      filePath: 'views/book/BookAdd.vue',
      inNav: true,
      // icon: 'iconfont icon-demo', // 二选一，如果你的 icon 需要引用自己的图片文件
      icon: 'icons/your-icon.png',
    },
```
<!-- 
- src/base 文件夹

这个文件夹主要放置两种组件，一种是我们二次封装 `element-ui` 的组件库，使其更符合 Lin 的风格，如果你想要引入其他第三方组件库，比如 `antd`，也同样建议在此文件夹进行二次封装。

还有一种是平常做 vue 项目积累的基础组件库，也希望大家养成基础组件库封装的习惯。

这两种组件我们都遵循同样的规范：尽量不与业务耦合，只封装基础组件。 -->

- src/config/stage/ 文件夹

这里注意，路由文件是以配置项形式提供，vue-router 读取的是这里的配置项文件


## 小结

希望通过阅读本小节，使你对 Lin 的前端部分有了初步的了解。通过目录结构不难看出，项目使用了大量的组件封装，这其实也是一种设计思想，让每个模块只做好一件事。

另外如果有疑问，请在 [issue](https://github.com/TaleLin/lin-cms-vue/issues) 中提出，我们会及时回复并处理。

<RightMenu />
