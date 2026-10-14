---
title: 数据库与迁移
---

# <H2Icon /> 数据库与迁移

## 概述

Lin-CMS-Flask 使用 **Flask-Migrate（Alembic）** 管理数据库结构版本。建表、字段变更全部通过迁移脚本完成，应用启动时**不再**自动执行 `create_all`。

数据库结构演进的历史记录存放在仓库的 `migrations/` 目录中，请**务必将其纳入版本控制**。

## 快速开始

空库一次到位（建表 + 种子数据：超级管理员 root/123456、Guest 分组、权限同步）：

```bash
flask db init          # 幂等：重复执行无副作用
flask db fake          # 可选：补充示例图书数据（演示用途，手动执行）
```

> **Tips:**
>
> `flask db init` 与旧版语义完全一致（含 `--force` 清空重建），内部即执行 `flask db upgrade`；
> alembic 通过 `alembic_version` 表记录版本，天然幂等。

## 日常开发：模型变更

修改了 `app/` 下的模型（如新增字段）后：

```bash
flask db migrate -m "add xxx column"   # 生成增量迁移脚本（SQLite 自动启用 batch 模式）
# 检查 migrations/versions/ 下新生成的脚本，确认 upgrade/downgrade 内容合理
flask db upgrade                        # 应用到数据库
```

> **Tips:**
>
> **SQLite 的限制**：SQLite 对 `ALTER TABLE` 的支持不完整，项目已在初始化时开启 `render_as_batch=True`，
> 改列、改约束会以「建新表-拷数据-换表」的方式执行，无需手工干预。

## 存量库升级到迁移体系（一次性）

如果你的数据库建于引入迁移体系之前：

```bash
# 1.（仅从旧版本直升的库需要）补一列，SQLite 示例：
#    ALTER TABLE lin_user ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0;
# 2. 登记当前版本（只记录、不执行 DDL）：
flask db stamp head
```

之后统一走 `flask db upgrade`。

## 常用命令速查

| 命令 | 说明 |
|---|---|
| `flask db init` | 建表 + 种子（幂等）；`--force` 确认后清空重建 |
| `flask db fake` | 补充示例图书数据 |
| `flask db migrate -m "..."` | 对比模型与数据库，生成增量迁移脚本 |
| `flask db upgrade` | 升级到最新版本（幂等） |
| `flask db downgrade base` | 回退到初始状态（会清空种子数据） |
| `flask db current` | 查看数据库当前版本 |
| `flask db stamp head` | 存量库登记版本（不执行 DDL） |
| `flask db check` | 检测模型与迁移是否有漂移（CI 中使用） |

## 种子数据说明

种子以**数据迁移**的形式内置在迁移链中（`migrations/versions/*_seed_root_guest_permissions.py`）：

- Root 分组、Guest 分组、root 用户（密码 123456，scrypt 哈希）
- 权限数据同步（依据代码中的 `@permission_meta` 装饰器）

种子迁移自带幂等保护——检测到已有用户数据时自动跳过，因此对存量库执行 `upgrade` 也是安全的。

## 与权限同步的关系

应用每次启动时会执行权限数据同步（将代码中 `@permission_meta` 标记的权限与数据库比对增删），
这只操作**数据**，不涉及表结构。若数据库尚未迁移，启动日志会提示先执行 `flask db upgrade`，不影响启动。

## 插件与迁移

启用插件（poem/oss/cos 等）后，插件的模型才会注册到应用中。此时**必须重新生成增量迁移**：

```bash
flask db migrate -m "enable poem plugin tables"
flask db upgrade
```

否则插件表游离于迁移体系之外，`flask db check` 会报告漂移。

<RightMenu />
