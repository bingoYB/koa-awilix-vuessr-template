class errorHandler {
  static error(app, logger) {
    app.use(async (ctx, next) => {
      ctx.logger = logger;
      try {
        // 入口信息保存
        let logContent = {
          method: ctx.method,
          url: ctx.url,
          headers: ctx.headers,
          ip: ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips
        }
        logger.info(JSON.stringify(logContent))
        await next();
        if (404 !== ctx.status) {
          return;
        }
        ctx.body ='<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8"></script>';
      } catch (e) {
        logger.error(e);
        ctx.status = err.status || 500;
        ctx.body = '500请求啦~恢复中.';
      }
    });
  }
}
export default errorHandler;
