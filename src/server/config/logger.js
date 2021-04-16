import { configure, getLogger } from 'log4js';

const isProd = process.env.NODE_ENV === 'production'

configure({
	appenders: { app: { 
		category:'app-error',
    type: isProd?'file':'console',
		filename: './logs/date',
		alwaysIncludePattern:true,
		pattern: "yyyy-MM-dd.log",
		maxLogSize: 100000, 
		backups: 5,
	} },
	categories: { default: { appenders: ['app'], level: 'info' } },
});
const logger = getLogger('app');

export default logger

// a = {
// 	"category": "log_date",
// 	"type": "dateFile",
// 	"filename": "./logs/log_date/date",
// 	"alwaysIncludePattern": true,
// 	"pattern": "-yyyy-MM-dd-hh:mm:ss.log"
// }