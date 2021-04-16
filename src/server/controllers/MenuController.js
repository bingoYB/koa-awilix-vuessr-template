// import Book from '@models/Book';
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
