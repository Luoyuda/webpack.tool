/*
 * @Author: xiaohuolong
 * @Date: 2020-08-27 11:47:22
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-08-31 11:27:01
 * @FilePath: /kjlive-h5/live/build/webpack.prod.es.js
 */
// webpack.config.js
// 路径模块
const path = require('path')
// 引入公共方法
const { checkFile, getFiles } = require('./common.js')
// webpack SourceMap 插件
const SourceMapDevToolPlugin = require('webpack').SourceMapDevToolPlugin
// 传入需要修改的文件名
const needChange = process.env.change || ''
// 需要修改的 js 文件列表
const jsPath = []
// 处理的文件夹名
const dirName = 'wp-js'
// 匹配正则
const jsReg = /\.js$/
// 文件夹名
const dir = `./${dirName}`
// 需要替换的文件夹名
const repDir = `./${dirName}/`
// 文件夹正则
const dirReg = new RegExp(dirName,'ig')
// 配置
const options = {
    dir,
    reg: jsReg,
    dirName,
    repDir,
    dirReg
}
// 批量生成webpack配置
/*
    webpack 开启 Tree Shaking 特性
    单页面打包时可直接输出一个对象，多页面打包时需要用数组来输出一个配置给webpack
    1. mode: "production"
    2. 单页面时不需要额外配置，多页面需要整理成数组配置项告知webpack
*/
const getConf = (key, file) => {
    return {
        mode: "production",  //模式配置
        entry:{
            [key]: file
        }, //多文件入口
        output:{
            filename: '[name].js', // 打包后文件名
            path: path.resolve('js') // 打包后目录，需为绝对路径
        },         
        module:{
            rules:[
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    // include: dirReg,          // 只转化src目录下的js
                    exclude: /node_modules/  // 排除掉node_modules，优化打包速度
                }
            ]
        },          //处理对应模块
        plugins: [
            new SourceMapDevToolPlugin({
                filename: '.map/[file].map',
            })
        ]
    }
}
if(needChange === 'all') {
    // 如果 all 则批量打包所有js
    getFiles(options.dir, (file) => {
        checkFile(file, options, getConf, jsPath)
    })
}else{
    // 指定文件则打包目标js
    checkFile(`./${needChange}`,options, getConf, jsPath)
}

module.exports = jsPath.length ? jsPath : {}
