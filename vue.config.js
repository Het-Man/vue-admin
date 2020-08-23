const path = require('path');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// 代码压缩
const TerserPlugin = require('terser-webpack-plugin')

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
  
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  // 输出文件目录
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,

  
  /**
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: (config) => {
    // 解析svg
    const svgRule = config.module.rule("svg");     
      svgRule.uses.clear();     
      svgRule       
        .use("svg-sprite-loader")       
        .loader("svg-sprite-loader")       
        .options({         
          symbolId: "icon-[name]",         
          include: ["./src/icons"]       
        });
     // ============压缩图片 start============
    //  config.module
    //  .rule('images')
    //  .use('image-webpack-loader')
    //  .loader('image-webpack-loader')
    //  .options({ bypassOnDebug: true })
    //  .end()
     // ============压缩图片 end============ 
  },
  configureWebpack: (config) => {
    config.resolve = { // 配置解析别名
      extensions: ['.js', '.json', '.vue'],
      alias: {
        'vue':'vue/dist/vue.js',
        '@': path.resolve(__dirname, './src'),
        '@c ': path.resolve(__dirname, './src/components'),
      }
    }
    if (process.env.NODE_ENV === 'production') {
      //webpack 可视化分析
      config.plugins.push(new BundleAnalyzerPlugin())
      // 代码压缩
      // config.optimization.minimizer.map((arg) => {
      //   const option = arg.options.terserOptions.compress;
      //   option.drop_console = true; // 打开开关
      //   return arg;
      // });

      // config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
      // config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']

      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true

      //gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
          new CompressionWebpackPlugin({
              filename: '[path].gz[query]',
              algorithm: 'gzip',
              test: new RegExp(
                  '\\.(' + productionGzipExtensions.join('|') + ')$'
              ),
              threshold: 10240, // 只有大小大于该值的资源会被处理 10240
              minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
              deleteOriginalAssets: false // 删除原文件
          })
      )
      
      // 公共代码抽离
      config.optimization = {
        minimizer: [
          new TerserPlugin({
            // 开启多进程打包
            parallel: true,
            // 启动source-map
            sourceMap: true
          }),
        ],
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all', //设置优先级，首先抽离第三方模块
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              minChunks: 1,//最少引入了1次
              maxInitialRequests: 5, 
              minSize: 0, //大小超过0个字节
              priority: 100 //权限
            },
            elementui: {
              chunks: 'all',
              test:  /[\\/]node_modules[\\/]element-ui[\\/]/,
              name: 'elementui',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 110
            },
            common: {
              chunks: 'all',
              test:  path.resolve("src/components"),
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60,
              // reuseExistingChunk: true
            },
            // styles: {
            //   chunks: 'all',
            //   name: 'styles',
            //   test: /\.(sa|sc|c)ss$/,
            //   enforce: true
            // },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      }
    }    
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      // 如发现 css.modules 报错，请查看这里：http://www.web-jshtml.cn/#/detailed?id=12
      sass:{ 
        prependData: `@import "./src/styles/main.scss";`
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: false, // 编译完成是否打开网页
    host: '0.0.0.0', // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8080, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: true, // 开启热加载
    hotOnly: false,
    proxy: {
      [process.env.VUE_APP_API]: {
          target: "http://www.web-jshtml.cn/vue_admin_api/token", //API服务器的地址  http://www.web-jshtml.cn/api http://www.web-jshtml.cn/dependenciesapi/token
          changeOrigin: true,
          pathRewrite: {
              '^/devApi': ''
          }
      }
    }, // 设置代理
    overlay: { // 全屏模式下是否显示脚本错误
      warnings: true,
      errors: true
    },
    before:app =>{
    }
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {}
}
