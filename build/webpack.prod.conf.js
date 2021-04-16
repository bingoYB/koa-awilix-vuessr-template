"use strict"
const path = require('path')
const webpack = require('webpack')
const prodConf = require('../config').build //生产环境配置参数
const baseConf = require('./webpack.base') //webpack基本配置

//一个webpack配置合并模块,可简单的理解为与Object.assign()功能类似！
const merge = require("webpack-merge")
//一个创建html入口文件的webpack插件！
const HtmlWebpackPlugin = require("html-webpack-plugin")
//一个拷贝文件的webpack插件！
const CopyWebpackPlugin = require("copy-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// 资源路径
const assetsPath = dir => path.posix.join(prodConf.assetsPath, dir)

const prod = merge({}, baseConf, {
  mode: 'production',
  output: {
    //文件名
    filename: assetsPath('js/[name].[chunkhash].min.js'),

    //用于打包require.ensure(代码分割)方法中引入的模块
    chunkFilename: assetsPath('js/[name].[chunkhash].js')
  },

  optimization: {
    // 使用webpack内置的TerserPlugin 或者 minimizer定义的方式压缩
    // minimize: true,
    // 允许你通过提个一个不同的一个插件或者自定义的TerserPlugin实例去覆盖默认的minimizer
    // 如果你使用的是 webpack v5 或以上版本，你不需要安装这个插件。webpack v5 自带最新的 terser-webpack-plugin。如果使用 webpack v4，则必须安装 terser-webpack-plugin v4 的版本。
    // minimizer: [
    //   new TerserPlugin({
    //     parallel: true,
    //     sourceMap: true, // Must be set to true if using source-maps in production
    //     terserOptions: {
    //       // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
    //     },
    //   }),
    // ],
    runtimeChunk: {
      name: "manifest"
    },
    // moduleIds: 'hashed',
    // namedChunks: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    },
    /*
    
    optimization: {
        splitChunks: {
          chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
          minSize: 0,                // 最小尺寸，默认0
          minChunks: 1,              // 最小 chunk ，默认1
          maxAsyncRequests: 1,       // 最大异步请求数， 默认1
          maxInitialRequests: 1,    // 最大初始化请求书，默认1
          name: () => {},              // 名称，此选项课接收 function
          cacheGroups: {                 // 这里开始设置缓存的 chunks
            priority: "0",                // 缓存组优先级 false | object |
            vendor: {                   // key 为entry中定义的 入口名称
              chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
              test: /react|lodash/,     // 正则规则验证，如果符合就提取 chunk
              name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
              minSize: 0,
              minChunks: 1,
              enforce: true,
              maxAsyncRequests: 1,       // 最大异步请求数， 默认1
              maxInitialRequests: 1,    // 最大初始化请求书，默认1
              reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
            }
          }
        }
      },
     */
  },
  plugins: [
    //压缩js
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: false, // 打包后去除console.log
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
          pure_funcs: ['console.log']
        }
      },
      sourceMap: prodConf.productionSourceMap,
      parallel: true // 使用多进程并行运行来提高构建速度
    }),

    //根据模块相对路径生成四位数hash值作为模块id
    new webpack.HashedModuleIdsPlugin(),

    //将整个文件复制到构建输出指定目录下
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, "../static"),
      to: prodConf.assetsPath,
      ignore: [".*"]
    }]),

    // html配置
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/web/index.html'),
      // favicon: path.resolve(__dirname, '../static/favicon.ico'),
      inject: true,
      //压缩配置
      // minify: {
      //     //删除Html注释
      //     // removeComments: true,
      //     //去除空格
      //     collapseWhitespace: true,
      //     //去除属性引号
      //     removeAttributeQuotes: true
      // },
    })
  ]
})


// 查看打包内容
if (process.env.analyz_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  prod.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = prod