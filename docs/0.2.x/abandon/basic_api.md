---
title: 基础库 API 介绍
---

# 基础库 API 介绍

## 开发者 API

## CMS API

### /cms/admin/authority GET 方法

> 查询所有可分配的权限

管理员特有权限

---

### /cms/admin/users GET 方法

> 查询所有用户

管理员特有权限

---

### /cms/admin/groups GET 方法

> 查询所有权限组及其权限

管理员特有权限

---

### /cms/admin/group/all GET 方法

> 查询所有权限组

管理员特有权限

---

### /cms/admin/group/:id GET 方法

> 查询一个权限组及其权限

管理员特有权限

---

### /cms/admin/group POST 方法

> 新建权限组

管理员特有权限

---

### /cms/admin/group/:id PUT 方法

> 更新一个权限组

管理员特有权限

---

### /cms/admin/group/:id DELETE 方法

> 删除一个权限组

管理员特有权限

---

### /cms/admin/dispatch POST 方法

> 分配单个权限

管理员特有权限

---

### /cms/admin/dispatch/patch POST 方法

> 分配多个权限

管理员特有权限

---

### /cms/admin/remove POST 方法

> 删除多个权限

管理员特有权限

---

### /cms/user/register POST 方法

> 注册

所有人权限

---

### /cms/user/login POST 方法

> 登陆

所有人权限

---

### /cms/user/change_password POST 方法

> 修改密码

用户权限

---

### /cms/user/information GET 方法

> 查询自己信息

用户权限

---

### /cms/user/refresh GET 方法

> 刷新令牌

用户权限

---

### /cms/user/auths GET 方法

> 查询自己拥有的权限

用户权限

---

<RightMenu />
