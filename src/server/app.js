import { addAliases } from 'module-alias';
addAliases({
  '@root': __dirname,
  '@models': __dirname + '/models',
  '@controllers': __dirname + '/controllers',
});
import Koa from 'koa';
import serve from 'koa-static';
import { createContainer, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-koa';

import errorHandler from './middlewares/errorHandler.js';
import proxy from 'koa-proxy';

import logger from './config/logger'

// const { historyApiFallback } = require('koa2-connect-history-api-fallback');
import config from './config';
import ssr from './middlewares/ssr'
const { port, viewDir, memoryFlag, staticDir,proxyHost } = config;
const app = new Koa();
//核心最重要的第一步 创建容器
const container = createContainer();
//把全部services交给容器管理
container.loadModules([`${__dirname}/services/*.js`], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
  },
});
// 错误处理注入
errorHandler.error(app, logger);
//终极注入
app.use(scopePerRequest(container));
app.use(serve(staticDir));
app.use(proxy({
	host: proxyHost, // proxy alicdn.com...
	match: /^\/agent\//,        // ...just the /static folder
	map: function (path) {
		return path.includes('/agent')?path.split('/agent')[1]:path;
	},
	jar:true
}));

// app.use(historyApiFallback({ index: '/', whiteList: ['/api'] }));
app.use(loadControllers(`${__dirname}/controllers/*.js`));

// ssr服务端渲染
ssr(app)

app.listen(port, () => {
  console.log('🍺服务启动成功', port);
});
