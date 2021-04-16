// import { get } from 'axios';
class MenuService {
  getMenu() {
    // return get('http://localhost/basic/web/index.php?r=books');
    return Promise.resolve([{
      funcName: 'helloWorld',
      funcId: 1,
      funcPath: '/helloWorld',
      filePath: 'helloWorld'
    }]);
  }
}

export default MenuService;
