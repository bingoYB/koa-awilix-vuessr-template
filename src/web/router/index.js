import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import request from '../utils/request'

Vue.use(Router)

async function getAsyncRoutes(){
  const routes = []
  let {data} = await request.get('/menu')
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
    path: '/index',
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
