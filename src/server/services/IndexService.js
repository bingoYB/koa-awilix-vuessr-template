// import { get } from 'axios';
class IndexService {
  getData() {
    // return get('http://localhost/basic/web/index.php?r=books');
    return Promise.resolve('indexservice🐻数据请求成功');
  }
}

export default IndexService;
