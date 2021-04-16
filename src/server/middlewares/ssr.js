const koaRouter = require('koa-router')
const { createBundleRenderer } = require('vue-server-renderer')
const router = koaRouter()
const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'

const createRenderer = (bundle, options) => {
  return createBundleRenderer(
    bundle,
    Object.assign({}, options, {
      runInNewContext: false
    })
  )
}
const renderData = (ctx, renderer) => {
  const context = {
    url: ctx.url
  }
  return new Promise(async (resolve, reject) => {
    // 读取 redis 缓存
    // const html = await redis.getHtml(context.url)
    // if (html) {
    //   resolve(html)
    //   return
    // }
    renderer.renderToString(context, (err, html) => {
      if (err) {
        return reject(err)
      }
      resolve(html)
    })
  })
}
module.exports = app => {
  let renderer
  if (isProd) {
    // 生产环境直接获取
    const bundle = require('../assets/vue-ssr-server-bundle.json')
    const template = fs.readFileSync(
      resolve('../assets/index.html'),
      'utf-8'
    )
    const clientManifest = require('../assets/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, {
      template,
      clientManifest
    })
  } else {
    // 开发环境
    require('../../build/setup-dev-server.js')(app, (bundle, options) => {
      renderer = createRenderer(bundle, options)
    })
  }

  

  router.get('(.*)', async (ctx, next) => {
    let html, status
    // 提示webpack还在工作
    if (!renderer) {
      ctx.type = 'html'
      ctx.status = status ? status : 200
      return (ctx.body = 'waiting for compilation... refresh in a moment.')
    }
    const s = Date.now()
    try {
      html = await renderData(ctx, renderer)
      ctx.type = 'html'
      ctx.status = status ? status : 200
      ctx.body = html
      console.log(`whole request: ${Date.now() - s}ms`)
    } catch (e) {
      console.log(e)
      next()
    }
  })

  app.use(router.routes()).use(router.allowedMethods())
}
