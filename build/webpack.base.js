const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const CONF = require('./config').base

const resolve = dir => path.join(__dirname, '../code/client/', dir)
const assetsPath = dir => path.posix.join(CONF.assetsPath, dir)
const isProd = process.env.NODE_ENV === 'production'


module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    path: CONF.path,
    publicPath: CONF.publicPath,
    filename: '[name]-[hash:5].js'
  },
  //配置模块如何被解析
  resolve: {
    //自动解析文件扩展名(补全文件后缀)(从左->右)
    // import hello from './hello'  （!hello.js? -> !hello.vue? -> !hello.json）
    extensions: [".js", ".vue", ".json", ".jsx"],

    //配置别名映射
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'src': resolve('src'),
      'components': resolve('src/components'),
      'assets': resolve('src/assets'),
      'views': resolve('src/views'),
      'store': resolve('src/store')
    }
  },
  //处理模块的规则(可在此处使用不同的loader来处理模块！)
  module: {
    rules: [
      {
        test: /\.js$/, //资源路径
        loader: 'babel-loader', //该路径执行的loader
        include: resolve("src") //指定哪个文件loader
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // enable CSS extraction
          extractCSS: isProd
        }
      },
      {
        test: /\.(css|postcss)$/,
        use: isProd
          ? ExtractTextPlugin.extract({
            use: ['css-loader', 'postcss-loader'],
            fallback: 'vue-style-loader'
          })
          : ['vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                esModule: false,
              }
            }, 'postcss-loader']
        // exclude: /node_modules/,
      },
      // 图片文件处理
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      // 媒体资源处理
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      // 字体文件处理
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    // 抽离css
    // new ExtractTextPlugin({
    //   filename: assetsPath('css/[name].[hash].css')
    // }),
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ]
}
