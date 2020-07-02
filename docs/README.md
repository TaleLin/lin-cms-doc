---
sidebar: false
---

# 介绍

## 什么是 Lin?

Lin 是一套基于 Python-Flask 的一整套开箱即用的**后台管理系统（CMS）**。Lin 遵循简洁、高效的原则，通过**核心库**加**插件**的方式来驱动整个系统高效的运行。

Lin 是一个轻量的第三方库，你可以像其它**Flask**扩展一样使用 Lin。Lin 本身也支持插件，这听起来有点绕，但它确实非常酷，具体的插件内容我们会在后面介绍。

Lin 选择了 `Flask_SQLAlchemy` 和 `Flask_JWT_Extended` 这两个 Flask 插件作为核心库的一部分，它们分别为 Lin 提供 `数据库` 和 `令牌` 的支持，我们将会在后续详细介绍。当然 Lin 不会干扰开发者自己的选择，你可以自由的选择自己想使用的其它的 Flask 扩展。

## 为何需要一个 Lin?

Lin 的萌芽并非偶然，在[七月有风](http://www.7yue.pro)这个项目的开始阶段，团队就一直在考虑出一套好用的 CMS，无奈时间仓促，这个 CMS 系统一直在日程上，却未真正的去实现。后来在七月有风这个项目的维护中，我们才深感 CMS 的重要性，因为缺乏 CMS 的管理，七月有风的维护都是通过手动的去数据库操作的，可想而知这样逆天而行的维护着实麻烦。

再后来，我们有机会为 `春山净水` 小程序开发后台，在这次的后台开发中，团队有了诸多积累，我们想是时候启动**Lin**了。

Lin 的初衷是做一套高可用、灵活、方便的 CMS 系统，目前市面上的 CMS 系统有很多，无论是 `Java` 还是 `php` ，亦或是其它语言都有数不清的实现。在 `Python` 的两大 web 框架—— `Django` 和 `Flask` 中，有像 `xadmin` 这样的前辈，但无奈 xadmin 是一套基于模板的 CMS 系统，仅支持 Django，而且风格样式皆与我们不符。

另外，Lin 积极拥抱目前的开发主流方向，希望通过前后端分离的方式来完成整个项目的开发。

## 特性

- 架构灵活

Lin 不希望将所有的东西糅合在一起，于是通过**核心库**加**插件**的方式来驱动整个系统的运行。在开发中，开发者既可以选择默认的既定集成系统进行快速开发，也可以通过配置和参数的方式自由的改变系统的架构。当然插件的精髓不仅仅在此，我们会在后续提供更多，更好用的插件，你可以轻松的集成到现有的系统中。

- 双端分离

Lin 是一个前后端分离的 CMS 解决方案。这意味着，Lin 既提供后台的支撑，也有一套对应的前端系统，当然双端分离的好处不仅仅在于此，我们会在后续提供 `php`和`node.js` 版本的 Lin。如果你心仪 Lin，却又因为技术栈的原因无法即可使用，没关系，我们会在后续提供更多的语言版本。

- 文档丰富、案例说服力强

Lin **绝非**是一个玩具项目。我们为 Lin 的使用提供了的丰富而又详细的文档说明，并且在多个案例的实践中提炼优化，力求成为一个优秀的开源项目。你甚至可以通过阅读文档和源码快速学习 Lin 的实现，而后一起参与开发。

## TODO LIST

- ✅ 插件

- ✅ 推送

- ✅ 权限

- ✅ 插件(service,config)

- ❌ 插件(oss)

<p class="action">
  <a href="/lin/start/" class="action-button">快速开始 →</a>
</p>

<style>
.action {
  text-align:center;
}

.action-button {
    display: inline-block;
    font-size: 1.2rem;
    color: #fff;
    background-color: #3683d6;
    padding: .8rem 1.6rem;
    border-radius: 4px;
    transition: background-color .1s ease;
    box-sizing: border-box;
    border-bottom: 1px solid #389d70;
}
</style>

<RightMenu />
