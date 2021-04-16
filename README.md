# VUE-SSR awilix koa模板

功能
1、基于IOC实现NodeJS的一个BFF层，将后端的基础服务接口进行聚合、裁剪、透传
2、vuessr 利用node实现同构SSR 用于满足SEO需求，解决首页渲染慢的问题
3、log4js 记录应用日志
4、使用 awilix：JavaScript / Node的极其强大的依赖注入（DI）容器

## BFF概念
BFF，即 Backends For Frontends (服务于前端的后端)，也就是服务端设计 API 时会考虑前端的使用，并在服务端直接进行业务逻辑的处理。

加入了BFF的前后端架构中，最大的区别就是前端不再直接访问后端微服务，而是通过 BFF 层进行访问。
这一层属于典型的无状态IO密集型模块，非常适合吞吐能力巨大的 node.js 开发，用 java 开发也不会带来什么额外的性能优势；这些数据处理都应该放在BFF层，保持了前端和后端代码的纯洁。

## 目录结构
```
|-src        
├── server      #服务端代码
|  ├── app.js             #应用入口
|  ├── config             #配置文件
|  ├── controllers        #controllers层
|  ├── libs               #引用依赖
|  ├── middlewares        #自己写的中间件
|  └── services           #services层
└── web         # web前端代码
   ├── app.js             #应用入口文件
   ├── App.vue
   ├── assets             # 前端资源
   ├── entry-client.js    # 客户端打包入口
   ├── entry-server.js    # 服务端打包入口
   ├── index.html         # index.html
   ├── router             # 路由相关
   ├── store              # store
   ├── utils              # 工具库方法
   └── views              # 页面视图
```

## SSR部分

请参考Vue SSR [官方指南](https://ssr.vuejs.org/zh/)

## BFF部分

controller 与 service 代码会自动注入awilix容器中，使用@route定义路由地址

### controller 开发

``` js
import { route, GET } from 'awilix-koa';
import logger from '../config/logger'
@route('/menu')
class MenuController {
  constructor({ menuService }) {
    this.menuService = menuService;
  }
  @route('')
  @GET()
  async actionGet(ctx, next) {
    let menu = await this.menuService.getMenu()
    ctx.body = {
      code: 200, data: menu
    }
    
  }
}
export default MenuController;

```

### service 开发

``` js

class IndexService {
  getData() {
    // 这里可调用下层后端服务接口实现聚合、代理等功能
    return Promise.resolve('indexservice🐻数据请求成功');
  }
}
export default IndexService;

```



