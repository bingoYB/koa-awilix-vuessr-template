import { join } from 'path';

let config = {
	viewDir: join(__dirname, '..', 'views'),
	staticDir: join(__dirname, '..', 'assets'),
  port: 8082,
  memoryFlag: 'memory',
  proxyHost: 'http://127.0.0.1:8082/'
};

export default  config;
