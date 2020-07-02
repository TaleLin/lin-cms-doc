---
title: spring-boot 日志
---

# 更新日志

最新版本 `0.1.1-RC1`   

### 0.1.1-RC1
1. `U` 整理代码规范：为一行语句的 if/else 添加大括号；为 VO 添加 @Data 注解；为覆写方法添加 @Override 注解
2. `U` 新增 file 模块，将 file 扩展中除了实现类和配置文件的其他业务移动到 file 模块下
3. `U` 将原工程名 `merak` 改为 `latticy`

### 0.1.0-RELEASE

1. `A` 新增`CreateVO`、`UpdatedVO`、`DeleteVO`类，并将接口中的`UnifyResponseVO`替换为对应的增、删、改`VO`
2. `U` 统一命名规范：类名、包名统一使用单数命名
3. `F` 修复图片上传接口返回数据结构未统一的 `bug`
4. `U` 去掉 code-message.properties 中注释的 code 码，并将 lin.cms.code-message 命名简化为 code-message

### 0.0.1-RC1

1. `A` 初始化内测版


<!-- markdownlint-disable -->
<RightMenu />
<!-- markdownlint-enable -->
