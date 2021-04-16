const path = require('path')
module.exports = {
  base: {
    path: path.resolve(__dirname, '../dist/assets'),
    publicPath: '/',
    assetsPath: 'public'
  },
  dev: {
    env: 'development',
    publicPath: '/',
    assetsPath: 'public',
    assetsSubDirectory: 'public',
    devtoolType: 'cheap-module-eval-source-map',
  },
  build: {
    env: 'production',
    publicPath: '/',
    assetsPath: 'public',
    assetsSubDirectory: 'public',
    devtoolType: 'source-map'
  }
}