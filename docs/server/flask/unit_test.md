---
title: 测试与代码质量
---

# <H2Icon /> 测试与代码质量

## 概述

Lin-CMS-Flask 内置完整的测试与静态检查体系，并通过 CI（GitHub Actions）在每次推送时强制执行：

| 检查 | 工具 | 范围 |
|---|---|---|
| 单元测试 | pytest | `tests/`（内存 SQLite，与开发库完全隔离，可任意顺序执行） |
| 类型检查 | mypy | `app/` + `starter.py` + `tests/`（启用 `check_untyped_defs`） |
| 代码风格 | flake8 | 全量 |
| 格式化 | black + isort | 全量 |
| 迁移漂移 | `flask db check` | 空库 `upgrade` 后检测模型与迁移是否一致 |

## 运行测试

```bash
uv run pytest                          # 全量测试
uv run coverage run -m pytest && uv run coverage report   # 带覆盖率
```

测试的关键设计：

- **测试夹具直接执行迁移链**（`flask_migrate.upgrade()`）建库——每条迁移脚本都会被测试真实执行，迁移损坏会直接红
- 登录类夹具为**函数级**作用域：因为修改密码会吊销该用户全部令牌（见[令牌](./token.md)），会话级缓存的令牌在相邻用例间会失效
- 种子数据（root 用户、分组、权限）由数据迁移提供，测试夹具只补充额外的游客用户与示例图书

## 测试内容分布

| 文件 | 覆盖 |
|---|---|
| `test_user.py` | 登录/信息/改密/权限查询 |
| `test_admin.py` | 用户注册/改密/删除、分组 CRUD、权限分发回收 |
| `test_auth.py` | 登录成功失败、令牌刷新、验证码 |
| `test_book.py` | 图书 CRUD 全流程 |
| `test_log.py` | 日志分页/搜索/用户列表 |
| `test_openapi.py` | OpenAPI 文档结构 |
| `test_quality_fixes.py` | 配置快速失败、auto_commit 回滚、脱敏函数等回归 |
| `test_hardening.py` | 密码策略（6-22 位）、日志过滤器、CORS/限流配置项 |
| `test_session_revocation.py` | 登出吊销、改密全吊销、scrypt 哈希 |
| `test_framework_core.py` | 文件上传校验链、日志滚动切割、验证码工具 |

## 提交钩子与 CI

```bash
uv run pre-commit install    # 安装提交钩子：isort / black / flake8 / mypy
```

CI（`.github/workflows/ci.yml`）在每次 push/PR 时执行：flake8 → black/isort 检查 → mypy → 空库 `flask db upgrade` + `flask db check` → pytest（带覆盖率）。

> **Tips:**
>
> 改了模型却忘记生成迁移？CI 的 `flask db check` 步骤会直接失败——保持迁移与模型一致是被强制执行的约定。

<RightMenu />
