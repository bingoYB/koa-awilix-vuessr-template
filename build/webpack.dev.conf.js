"use strict"
const path = require('path')
const webpack = require('webpack')
const devConf = require('./config').dev  //开发环境配置参数
const baseConf = require('./webpack.base') //webpack基本配置
//一个webpack配置合并模块,可简单的理解为与Object.assign()功能类似！
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")

const {CleanWebpackPlugin} = require('clean-webpack-plugin')

//发送系统通知的一个node模块！
// const notifier = require("node-notifier")

const dev = merge(baseConf, {
  mode: 'development',

  //生成sourceMaps(方便调试)
  devtool: devConf.devtoolType,
  // module: {
  //   rules: styleLoader.styleLoader({ extract: false, sourceMap: true })
  // },
  plugins: [
    new CleanWebpackPlugin(),
    //开启HMR(热替换功能,替换更新部分,不重载页面！)
    new webpack.HotModuleReplacementPlugin(),

    //配置html入口信息
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/web/index.html'),
      inject: true
    }),

    //编译提示插件
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http:`],
      },
      // onErrors: function (severity, errors) {
      //     if (severity !== "error") {
      //         return
      //     }
      //     const error = errors[0]
      //     const filename = error.file.split("!").pop()
      //     // console.log(filename)
      //     //编译出错时,右下角弹出错误提示！
      //     notifier.notify({
      //         title: "blog",
      //         message: severity + ": " + error.name,
      //         subtitle: filename || ""
      //     })
      // }
    })
  ]
})

module.exports = dev