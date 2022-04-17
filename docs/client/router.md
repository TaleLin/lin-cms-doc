---
title: 路由配置
---

# 路由配置

在 Lin CMS 中，路由数据可以直接用来渲染生成左侧菜单，简化了开发流程。
Lin CMS 路由数据的配置目录为: `src/config/stage/`，其中 `index.js` 作为入口文件导出所有路由数据，形成一个路由树。这些路由数据有两个用途：

- 导入 `vue-router` 在项目中进行路由管理
- 根据当前登录管理员所拥有的权限筛选左侧菜单

## 导入 vue-router

相关代码：`src/router/home-router.js`

筛除掉所有的父级路由，将所有的最终子路由打平，这些最终导入到 `vue-router` 中的路由都可以在 `舞台` 展示出对应的页面。

<img-wrapper>
  <img src=" http://cdn.talelin.com/lin/docs/route.png">
</img-wrapper> 

## 左侧菜单

相关代码：`src/store/getter.js` 在文件中找到方法 `sidebarList` 。

将数据根据权限筛选，得到当前登录用户有权限的路由数据，根据最终过滤后的数据渲染左侧菜单。数据可以在 vuex 的 getter 中看到，key是 `sidebarList`。

<img-wrapper>
  <img src=" http://cdn.talelin.com/lin/docs/route2.png">
</img-wrapper> 

<!-- 
除了需要通过新窗口打开的页面如登陆页，要在路由入口文件`router.js`下配置：

```js
// router.js
 {
    path: '',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/',
        redirect: '/about',
      },
      ...authRouter,  // 舞台页面路由
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login, // 登陆页路由
  },
```

其余所有子页面都挂载在 `Home` 组件下(`舞台页面`)，需要在 `home-router.js` 里配置：

```js
// home-router.js
 {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: '林间有风',
      icon: 'iconfont el-icon-setting',
      src: 'icons/your-icon.png',
      menuTab: true,
    }
  },
  ...
  adminRouter, // 模块化路由导入
```

meta 属性介绍：

- `title` 浏览器 tab 标题 默认为空
- `icon` 路由标题左侧 icon 默认为空
- `src` 路由标题左侧图标（和 icon 只需要配置其中一种即可,如果 icon 和 src 都配置了，只会渲染 src）默认为空
- `menuTab` 控制二级路由在右侧`舞台`上方以 tab 的形式渲染 默认 false，二级路由在左侧菜单渲染
- `auths` 页面访问权限配置 默认为[]



::: tip
左侧菜单最多只能渲染到二级路由，三级路由将在右侧内容区以 tab 的形式渲染;
当 menuTab 不配置或者配置为 false 时，二级路由在左侧菜单渲染，此时二级路由配置的 icon 和 src 不会生效，默认以空心圆或者实心圆展示；但是在 reuseTab 组件(历史浏览记录)会被渲染出来。
::: -->



| 字段 | 说明   |
| ---- | ----- |
| title        | 页面title / 左侧sidebar           |
| name | 使用 Symbol 确保唯一性，若未设置则默认为随机字符串 |
| type        | folder：有子路由，折叠sidebar / tab：子路由在右侧以menuTab展现 / view：直接展示页面 |
| icon        | 可直接配置 iconfont 类名 / 也可配置为图片路径 |
| route | 当前页面路由 |
| filePath        | 文件路径 |
| order        | 路由排序 |
| inNav        | 是否在左侧菜单栏显示 |
| permission        | 当前路由权限，数组格式，满足数组内任一权限即可展示该页面 |