(window.webpackJsonp=window.webpackJsonp||[]).push([[131],{511:function(t,v,_){"use strict";_.r(v);var e=_(26),r=Object(e.a)({},(function(){var t=this,v=t.$createElement,_=t._self._c||v;return _("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[_("h1",{attrs:{id:"路由配置"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#路由配置"}},[t._v("#")]),t._v(" 路由配置")]),t._v(" "),_("p",[t._v("在 Lin CMS 中，路由数据可以直接用来渲染生成左侧菜单，简化了开发流程。\nLin CMS 路由数据的配置目录为: "),_("code",[t._v("src/config/stage/")]),t._v("，其中 "),_("code",[t._v("index.js")]),t._v(" 作为入口文件导出所有路由数据，形成一个路由树。这些路由数据有两个用途：")]),t._v(" "),_("ul",[_("li",[t._v("导入 "),_("code",[t._v("vue-router")]),t._v(" 在项目中进行路由管理")]),t._v(" "),_("li",[t._v("根据当前登录管理员所拥有的权限筛选左侧菜单")])]),t._v(" "),_("h2",{attrs:{id:"导入-vue-router"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#导入-vue-router"}},[t._v("#")]),t._v(" 导入 vue-router")]),t._v(" "),_("p",[t._v("相关代码："),_("code",[t._v("src/router/home-router.js")])]),t._v(" "),_("p",[t._v("筛除掉所有的父级路由，将所有的最终子路由打平，这些最终导入到 "),_("code",[t._v("vue-router")]),t._v(" 中的路由都可以在 "),_("code",[t._v("舞台")]),t._v(" 展示出对应的页面。")]),t._v(" "),_("img-wrapper",[_("img",{attrs:{src:" http://cdn.talelin.com/lin/docs/route.png"}})]),t._v(" "),_("h2",{attrs:{id:"左侧菜单"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#左侧菜单"}},[t._v("#")]),t._v(" 左侧菜单")]),t._v(" "),_("p",[t._v("相关代码："),_("code",[t._v("src/store/getter.js")]),t._v(" 在文件中找到方法 "),_("code",[t._v("sidebarList")]),t._v(" 。")]),t._v(" "),_("p",[t._v("将数据根据权限筛选，得到当前登录用户有权限的路由数据，根据最终过滤后的数据渲染左侧菜单。数据可以在 vuex 的 getter 中看到，key是 "),_("code",[t._v("sidebarList")]),t._v("。")]),t._v(" "),_("img-wrapper",[_("img",{attrs:{src:" http://cdn.talelin.com/lin/docs/route2.png"}})]),t._v(" "),_("table",[_("thead",[_("tr",[_("th",[t._v("字段")]),t._v(" "),_("th",[t._v("说明")])])]),t._v(" "),_("tbody",[_("tr",[_("td",[t._v("title")]),t._v(" "),_("td",[t._v("页面title / 左侧sidebar")])]),t._v(" "),_("tr",[_("td",[t._v("name")]),t._v(" "),_("td",[t._v("使用 Symbol 确保唯一性，若未设置则默认为随机字符串")])]),t._v(" "),_("tr",[_("td",[t._v("type")]),t._v(" "),_("td",[t._v("folder：有子路由，折叠sidebar / tab：子路由在右侧以menuTab展现 / view：直接展示页面")])]),t._v(" "),_("tr",[_("td",[t._v("icon")]),t._v(" "),_("td",[t._v("可直接配置 iconfont 类名 / 也可配置为图片路径")])]),t._v(" "),_("tr",[_("td",[t._v("route")]),t._v(" "),_("td",[t._v("当前页面路由")])]),t._v(" "),_("tr",[_("td",[t._v("filePath")]),t._v(" "),_("td",[t._v("文件路径")])]),t._v(" "),_("tr",[_("td",[t._v("order")]),t._v(" "),_("td",[t._v("路由排序")])]),t._v(" "),_("tr",[_("td",[t._v("inNav")]),t._v(" "),_("td",[t._v("是否在左侧菜单栏显示")])]),t._v(" "),_("tr",[_("td",[t._v("permission")]),t._v(" "),_("td",[t._v("当前路由权限，数组格式，满足数组内任一权限即可展示该页面")])])])])],1)}),[],!1,null,null,null);v.default=r.exports}}]);