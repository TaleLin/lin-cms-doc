# <H2Icon /> 闲谈 Lin

::: tip
注意：本小节为选看章节，它不会涉及具体业务的实现，在这里笔者想畅谈一下 Lin。这也是笔者在完成一些项目之后的总结和体会，希望在此与诸君分享，当然笔者才疏学浅，如果你有任何意见，请在 github 上提 issue 反馈。
:::

## 前后端分离的核心

`前后端分离`这个概念已经被提及太多太多次了，在多次项目经验及 Lin 的开发过程中，笔者觉得有一个核心点至关重要——`数据流动`。我们不难发现，无论是单机应用，还是微服务架构下的庞大集群；无论是前端、后台亦或是数据库；无论是 REST 还是 RPC；它们中都有一条线贯穿始终，那就是**数据流动**。

这就像化学实验课上的提炼实验一样，液体从入口出发，经过条条导管，层层器皿，最后流入杯中。当然在应用的开发中，数据的流动可能会更加复杂，用户在前端界面产生的数据，服务器自己产生的监控数据，数据库自己生成的数据，数据不断的彼此流动，彼此交互。就是这样的一条数据线盘活了整个应用，形成了系统的脉络。

在 Lin 中，我们可以通过如下这副图来一窥整体的结构脉络：

<img-wrapper>
  <img src="https://cdn.talelin.com/lin/docs/structure.png"/>
</img-wrapper>

上图的右半部分，是整个 Lin 的系统架构，虚线表示数据流动的过程。可以看到数据从用户流向控制层，转移至检验层、模型层而后流入数据库，再从数据库返回流至视图层最后返回给用户。

可以看到，我们通过数据的流动可以很清晰的勾勒出 Lin 的系统结构。如果此时你也正在着手一个其它项目的开发，请尝试用`数据流动`的思路来描绘你项目整体的结构。
