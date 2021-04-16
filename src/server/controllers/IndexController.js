import { route, GET } from 'awilix-koa';
import logger from '../config/logger'
@route('/data')
class IndexController {
  constructor({ indexService }) {
    this.indexService = indexService;
  }
  @route('')
  @GET()
  async actionIndex(ctx, next) {
    ctx.body = {
      data:'demo data'
    }
    // 添加了反而会导致卡住
    // next()
  }

  @route('/get')
  @GET()
  async actionGet(ctx, next) {
    const data = await this.indexService.getData()
    logger.info(data)
    ctx.body = {data}
  }
}
export default IndexController;
