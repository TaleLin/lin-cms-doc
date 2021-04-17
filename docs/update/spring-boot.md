---
title: spring-boot 日志
---

# 更新日志

最新版本 `v0.2.0-RELEASE`   

### [v0.2.0-RELEASE](https://github.com/TaleLin/lin-cms-spring-boot/compare/v0.2.0-RC2...master)

- 修复 MyBatisPlus 分页失效的问题
- 修复代码生成器控制器模板的 bug
- 修复由于只在 servlet 加载时获取七牛 token 导致的文件上传时 token 过期的 bug
- 修复删除用户接口(deleteUser) 允许删除 root 分组的用户的 bug
- 修复升级 spring-boot 2.4.0 后导致的跨域问题
- 修复分组下若有成员，该分组不可删除的问题
- 修复当请求体中的 json 参数类型错误，异常拦截报错不准确的问题 
- 移除对 hutool 的依赖
- 将单元测试使用的 junit4 替换为junit5


### [v0.2.0-RC2](https://github.com/TaleLin/lin-cms-spring-boot/compare/v0.2.0-RC1...v0.2.0-RC2)
1. `A` 新增book表的创建sql 
2. `A` 新增日志文件大小限制
3. `F` 修复当 refresh token 损坏时 code 码指定错误的问题
4. `F` 常量命令修改为全大写
5. `F` 为数据源账号密码配置添加双引号
6. `F` 修复行为日志搜索全部人员无结果的问题

### [v0.2.0-RC1](https://github.com/TaleLin/lin-cms-spring-boot/compare/sleeve-0.1.1...v0.2.0-RC1)
1. `U` 将 `application-*.properties`配置文件改为`yml`格式
2. `U` 重构 Uploader 实例注入方式
3. `A` 新增代码生成器`src/test/java/CodeGenerator.java`
4. `U` 重构所有 Model，使其继承 BaseModel
5. `F` 修复`windows` 平台上传文件后，目录分隔符（反斜杠）被转译的问题
6. `U`  重构所有 `id` 类型：将原本的`Long`类型改为`Integer`类型
7. `A` 为`lin_group`新增 `level`字段表示分组级别，`lin_permission`表新增`mount`字段表示该权限是否挂载
8. `A` `application.yml`配置文件新增配置项`default-enum-type-handler`，用以指定默认枚举类型的类型转换器
9. `A` 增强 Logback 功能：按不同级别日志分文件夹输出、基于 ServletFliter 实现 Access Log
10. `F` 整理代码：修改一些单词拼写错误，删除多余的 `import` 语句，补充完整泛型参数


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
