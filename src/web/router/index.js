import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import request from '../utils/request'

Vue.use(Router)

async function getAsyncRoutes(){
  const routes = []
  let data
  try {
    let res = await request.get('/menu')
    data = res.data
  } catch (error) {
    console.error('菜单请求异常,改用静态数据')
    data = [
      {
        funcName: 'helloWorld',
        funcId: 1,
        funcPath: '/helloWorld',
        filePath: 'helloWorld'
      }
    ]
  }
  for (let i = 0; i < data.length; i++) {
    const {filePath,funcPath} = data[i];
    routes.push({
      path: funcPath,
      component: () => import(`../views/${filePath}.vue`)
    })
  }

  return routes
}

const routes = [
  {
    path: '/',
    component: ()=>import('../views/index.vue')
  }
]

export const createRouter = async () => {
  const  menuRouter = await getAsyncRoutes()
  const router = new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes:[...routes, ...menuRouter]
  })

  if (typeof window !== 'undefined') {
    router.beforeEach((to, from, next) => {
      NProgress.start()
      next()
    })
    router.afterEach((to, from) => {
      NProgress.done()
    })
  }

  return router
}
