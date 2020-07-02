---
title: 前端日志
---

# 更新日志

最新版本 `0.3.5`

### 0.3.5

1. `F` 统一前端规范，文件夹、文件名统一用单数和小写字母中划线形式
2. `A` 新增右键关闭历史记录
3. `F` 调整默认 dialog 样式

### 0.3.4

1. `U` 优化变量命名，升级 `element-ui` 版本，
2. `F` `Home` 组件改为异步加载

### 0.3.3

1. `A` 新增消息中心组件

### 0.3.2

1. `A` 新增图表插件

### 0.3.1

1. `F` 增加历史栏高度

### 0.3.0

1. `A` 新增一个用户可以属于多个分组
2. `F` 权限相关 auth right 统一替换为 permission

### 0.2.2

1. `F` 修复 tinymce 富文本动态绑定问题
2. `U` 保持代码风格一致优化

### 0.2.1

1. `A` 新增一键清除 reuse tab
2. `A` 新增侧边导航搜索，可在 config 配置是否启用
3. `F` 修复 post put 等请求不能自动重发问题
4. `U` 优化异常处理，框架默认弹出前端配置异常信息，可通过 handleError 和 showBackend 控制本次请求是否开发者自行处理和是否直接展示后端返回异常信息
5. `C` 登录用户名字段由 nickname -> username，同时新增 nickname 为昵称字段，可以更新昵称(需后端同步修改)
6. `U` 优化了一些移动端适配
7. `C` 列表信息字段由 collection -> items, total_nums -> total, 增加 count、page、total_page字段（需后端同步修改）

### 0.2.0

1. `A` 新增图像上传、图像预览、富文本等自定义组件
2. `A` 新增 lin-cms-ui 多个基础组件

### 0.1.0-beta.3

1. `U` 首页更新为 card 设计
2. `A` 新增头像上传(对应lin-cms-koa [0.1.0-beta.2](https://github.com/TaleLin/lin-cms-koa/releases/tag/0.1.0-beta.2) 及以上版本，lin-cms-flask [0.1.0-beta.2](https://github.com/TaleLin/lin-cms-flask/releases/tag/0.1.0-beta.2) 及以上版本)
3. `A` 新增单元测试
2. `A` 新增switch、rate、tabs、link、tag组件

### 0.1.0-beta.2

1. `F` 修复无感知刷新令牌异常
2. `A` 新增入场动画
3. `A` 新增全屏功能
2. `A` 新增Icon、Form组件

### 0.0.1-beta.1

1. `U` 新UI界面
2. `A` button组件、table组件
3. `F` 修复令牌刷新异常

### 0.0.1-alpha.3

1.  `A` 添加插件机制
2.  `U` 重构路由设计
2.  `A` 可配置三级路由导航

### 0.0.1-alpha.2

1.  `U` 升级到 `vue-cli3.4` 
2.  `A` 慕课网专题插件

### 0.0.1-alpha.1

1.  `A` 初始化内测版