const fs = require('fs')
const path = require('path')
const MFS = require('memory-fs')
const webpack = require('webpack')
const clientConfig = require('./webpack.client')
const serverConfig = require('./webpack.server')
const webpackDevMiddleware = require('./koa/dev')
const webpackHotMiddleware = require('./koa/hot')

const readFile = (fs, file) =>
  fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')

module.exports = function setupDevServer(app, cb) {
  let bundle, template, clientManifest
  const update = () => {
    if (bundle && template) {
      cb(bundle, {
        template,
        clientManifest
      })
    }
  }

  // client
  clientConfig.output.filename = '[name].js' //热更新不能跟 [chunkhash] 同用
  const clientCompiler = webpack(clientConfig)
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    //  绑定中间件的公共路径,使用与webpack相同
    publicPath: clientConfig.output.publicPath,
    stats: {
      //  用于形成统计信息的选项
      colors: true,
      chunks: false
    },
    noInfo: true, // 显示无信息到控制台（仅警告和错误）
    serverSideRender: false //  关闭服务器端渲染模式。有关详细信息，请参阅服务器端渲染部分
  })
  app.use(devMiddleware)
  clientCompiler.plugin('done', stats => {
    const fs = devMiddleware.fileSystem
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return

    console.log('client-dev...')
    let filePath = path.join(clientConfig.output.path, 'index.html')
    if (fs.existsSync(filePath)) {
      // 读取内存模板
      template = readFile(fs, 'index.html')
    }
    clientManifest = JSON.parse(readFile(fs, 'vue-ssr-client-manifest.json'))
    update()
  })
  app.use(webpackHotMiddleware(clientCompiler))

  //server
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs         // 自定义 compiler 文件系统将文件输出到内存
  serverCompiler.watch({}, (err, stats) => {
    if (err) {
      throw err
    }
    stats = stats.toJson()
    if (stats.errors.length) return

    console.log('server-dev...')
    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
    update()
  })
}
