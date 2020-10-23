## 消息中心组件

消息中心组件`LinNotify`

- 提供**可选**易用的WebSoket支持。
- 提供基础的消息中心模板，支持自定义消息模板。


### 使用组件  

```js
// main.js
// 在main.js中全局注册LinNotify
import LinNotify from '@/components/notify'

Vue.use(LinNotify)

```

### 基础示例

```vue
<lin-notify
  @readMessages="readMessages"
  :messages="messages"
  @readAll="readAll"
  @viewAll="viewAll"
  >
</lin-notify>

<script>

export default {
  data() {
    return {
      messages： [{
        is_read: false, id: 45, time: "03-14 09:35:19", user: "root", content: "《测试》"
      }]
    };
  },
  methods: {
    readMessages(msg, index) {
      console.log('你点击了的该条消息')
    }
    readAll() {
      console.log('你点击了全部已读按钮')
    }
    viewAll() {
      console.log('你点击了查看全部按钮')
    }
  }
};
</script>
```





### 自定义模板
```vue
<lin-notify
  @readMessages="readMessages"
  :messages="messages"
  @readAll="readAll"
  @viewAll="viewAll">
  <template slot-scope="scope">
    <i class="el-icon-time"></i>
    <span style="margin-left: 10px">{{ scope.row.date }}</span>
  </template>
</lin-notify>
```

### 渲染嵌套数据的配置选项
```vue
<lin-notify
  :messages="messages">
</lin-notify>
<script>
export default {
  data() {
    return {
      props: {
        'is_read': 'readed',
        'time': 'time',
        'user': 'userName',
        'content': 'detail'
      }
      messages： [{
        readed: false, time: "03-14 09:35:19", userName: "root", detail: "《测试》"
      }]
    };
  },
};
</script>
```
### 属性

|      参数      |     类型      |  默认值  |                                            说明                                            |
| :------------: | :-----------: | :------: | :----------------------------------------------------------------------------------------: |
| messages  |   Array    | []   | 显示的数据 |
|     value      |     string, number     |    []    |                                        出现在按钮、图标旁的数字或状态标记显示值                                        |
|  max   |    number    |   -   |                                   出现在按钮、图标旁的数字或状态标记的最大值，超过最大值会显示 '{max}+'，要求 value 是 Number 类型                                   |
|    isDot    |    Boolean    |  false   |  出现在按钮、图标旁的数字或状态标记是否为小圆点                                          |
|    hidden     |    Boolean    |   false   |                                         隐藏出现在按钮、图标旁的数字或状态标记                                  |
|    trigger    |    string    |  hover   |                                      触发下拉框的行为 , 可设置为click                                    |
|    placement     |    string     |    bottom-end     |                                        菜单弹出位置， 可选 为 top/top-start/top-end/bottom/bottom-start/bottom-end                                    |
|    icon     |    string     |    el-icon-bell    |                                 消息中心icon图标类名                                 |
| height  |   Number    |   200   | 消息中心模板高度 |
| props  |   Obejct    | -  | 渲染嵌套数据的配置选项 |
| hideOnClick  |   Boolean    |    | 是否在点击菜单项后隐藏菜单 |

### 方法
|  方法名  | 参数 |                     说明                     |
| :------: | :--: | :------------------------------------------: |
| readMessages |  message, index  | 点击消息触发的函数 |
|  readAll   |  -  |               点击全部已读按钮时触发               |
|  viewAll   |  -  |     点击查看全部按钮时触发      |


## 使用webSoket[可选]

### 手动连接
```js
// main.js
// 在main.js中全局注册LinNotify时候，传入配置项
import LinNotify from '@/components/notify'
// 手动连接
Vue.use(LinNotify, {option})

// 示例
Vue.use(LinNotify, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000
})
```

### 自动连接
```js
// main.js
// 在main.js中全局注册LinNotify时候，传入配置项
import LinNotify from '@/components/notify'
// 自动连接
Vue.use(LinNotify,'//api.dev.com/', {option})

// 示例
Vue.use(LinNotify,'//api.dev.com/', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000
})
```
### webSoket配置项说明

| 配置项 |类型  |配置项说明  |
| --- | --- | --- |
| reconnection |  Boolen |是否自动重新连接  |
| reconnectionAttempts |  Number| 重新连接尝试 |
| reconnectionDelay |Number  | 重新连接延迟 |

### 使用webSoket示例
```vue
<lin-notify
  @readMessages="readMessages"
  :messages="messages"
  @readAll="readAll"
  @viewAll="viewAll"
  >
</lin-notify>

<script>

export default {
  data() {
    return {
      messages： [{
        is_read: false, id: 45, time: "03-14 09:35:19", user: "root", content: "《测试》"
      }]
    };
  },
  created() {
    // 连接webSoket
    this.$connect(this.path, { format: 'json' })
    // 接收到webSoket消息的回调
    this.$options.sockets.onmessage = data => {
      this.messages.push(data)
    }
    // webSoket出现错误的回调
    this.$options.sockets.onerror = err => {
      console.log(err)
    }
  }
};
</script>
```
### webSoket全局方法

|  方法名  | 参数 |                     说明                     |
| :------: | :--: | :------------------------------------------: |
| vm.$connect(path) |  path  | 连接webSokect,path格式前缀需为`//`，由此来根据网站采取`http`还是`https` eg: `//face.cms.talelin.com/`|
|  vm.$disconnect()   |  -  |               断开webSokect               |
|  vm.$socket.send('some data')   |  -  |     webSokect推送消息      |
|  vm.$socket.sendObj({awesome: 'data'})   |  -  |     webSokect推送消息（配置为`{format: 'json'}`）    |
|  vm.$options.sockets.onopen   |  -  |   webSokect连接成功回调函数    |
|  vm.$options.sockets.onmessage   |  -  |   webSokect接受到推送消息的回调函数    |
|  vm.$options.sockets.onerror   |  -  |   webSokect连接失败回调函数    |
|  vm.$options.sockets.onclose   |  -  |   webSokect连接关闭回调函数    |
|  delete this.$options.sockets.onmessage   |  -  |   移除监听函数    |

<RightMenu/>