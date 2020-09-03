/*
 * @Author: xiaohuolong
 * @Date: 2020-08-27 11:47:22
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-08-31 11:31:03
 * @FilePath: /kjlive-h5/live/build/webpack.prod.css.js
 */
// webpack.config.js
// 路径模块
const path = require('path')
// 引入公共方法
const { checkFile, getFiles } = require('./common.js')
// webpack SourceMap
const SourceMapDevToolPlugin = require('webpack').SourceMapDevToolPlugin
// webpack 输出 css 文件插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 需变更的文件
const needChange = process.env.change || ''
// 文件夹
const dirName = 'wp-css'
// 需匹配文件后缀
const scssReg = /\.scss$/
// 文件名
const dir = `./${dirName}`
// 替换文件名
const repDir = `./${dirName}/`
const dirReg = new RegExp(dirName,'ig')
// 配置
const options = {
    dir,
    reg: scssReg,
    dirName,
    repDir,
    dirReg
}
// loader 配置
const sassLoaders = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',//需要插在css-loader之前
    'sass-loader'
]
// 文件修改路径数组
const scssPath = []
// 获取配置
const getConf = (key, file) => {
    return {
        mode: "production",  //模式配置
        entry:{
            [key]: file
        }, //多文件入口
        output:{
            filename: '.empty.index.js', // 打包后文件名
            path: path.resolve('css') // 打包后目录，需为绝对路径
        },         
        module:{
            rules:[
                {
                    test: /\.scss$/, //匹配查找 scss 文件 
                    use: sassLoaders
                }
            ]
        },          //处理对应模块
        plugins: [
            new SourceMapDevToolPlugin({
                filename: '.map/[file].map',
            }),
            new MiniCssExtractPlugin({
                filename: `/[name].css`
            })
        ]
    }
}
if(needChange === 'all') {
    // 打包所有 scss 文件
    getFiles(options.dir, (file) => {
        checkFile(file, options, getConf, scssPath)
    })
}else{
    // 打包目标 scss 文件
    checkFile(`./${needChange}`,options, getConf, scssPath)
}

module.exports = scssPath.length ? scssPath : {}
