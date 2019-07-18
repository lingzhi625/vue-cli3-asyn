const path = require('path')
const Px2remWebpackPlugin = require('qg-px2rem-webpack')
const isProduction = process.env.NODE_ENV === 'production'
const UglifyPlugin = require('uglifyjs-webpack-plugin')
let config = {}

config = {
  assetsDir: 'static',
  publicPath: '/',
  chainWebpack: config => {
    config.resolve.alias
      .set('src', path.resolve(__dirname, '../src'))
      .set('assets', path.resolve(__dirname, '../src/assets'))
      .set('component', path.resolve(__dirname, '../src/component'))
    if (isProduction) {
      //删除懒加载模块的prefetch，降低带宽压力
      config.plugins.delete('prefetch')
      config.plugins.delete('preload')
    }
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type =>
      addStyleResource(config.module.rule('less').oneOf(type))
    )
  },
  configureWebpack: config => {
    let newplugins = [new Px2remWebpackPlugin({ originScreenWidth: 375 })]
    config.plugins = [...config.plugins, ...newplugins]
    if (isProduction) {
      let plu = [
        new UglifyPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']
            }
          }
        })
      ]
      config.plugins = [...config.plugins, ...plu]
    }
  },
  devServer: {
    port: 7088
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/less/form.less') // 需要全局导入的less
      ]
    })
}
module.exports = config
