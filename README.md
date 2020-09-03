# 打包js,css脚手架

首先理清脚手架需要帮我们优化哪些步骤，通过对kjlive-h5的项目分析，得出脚手架需要帮助我们处理好以下问题

* js的打包，es6语法支持，模块引用问题，按需引入问题，提高业务开发效率和兼容性问题
* sass文件的打包
* 自动化编译
* 区分js css的打包配置，各司其职

## 安装模块

```shell
# babel
npm i -D @babel/core @babel/cli core-js@3 @babel/preset-env
 
# sass
npm i -D mini-css-extract-plugin sass node-sass autoprefixer
 
# webpack
npm i -D webpack webpack-cli webpack-dev-server css-loader sass-loader babel-loader postcss-loader
 
# shell
npm i -D/-g shelljs chalk onchange cross-env
```

## 配置文件

build 文件夹存放 webpack 配置

```shell
build
├── common.js
├── webpack.prod.css.js
└── webpack.prod.es.js
```

公共方法 common.js
```js
// 文件处理模块
const fs = require('fs')
// 检查当前改变文件是否匹配我们的目标文件
const checkFile = (file, { reg, dirReg, repDir }, getConf, path) => {
    if(file.match(dirReg) && file.match(reg)){
        // 匹配则往 path 数组中新增
        let key = file.replace(reg, '').replace(repDir, '')
        const conf = getConf(key, file)
        console.log(`======== 打包 ${key} ${file} ========`)
        path.push(conf)
    }
}
// 递归获取目标文件夹内容
const getFiles = (path, callback) => {
    const files = fs.readdirSync(path)
    files.map(file => {
        if(!callback(`${path}/${file}`, path)){
            let exists = true
            let newPath = `${path}/${file}`
            try {
                fs.readdirSync(newPath)
            } catch (error) {
                exists = false
            }
            if(exists) getFiles(newPath, callback)
        }
    })
}
// 暴露方法
module.exports = {
    checkFile,
    getFiles
}
```

js配置
```js
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
```

处理scss文件

```js
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
```
 
从开发文件夹 wp-js 输出到 js 文件夹，wp-css 输出到 css 文件夹，通过 onchange 模块对项目进行监听，做自动化打包，创建一个 change.js 来作为变动后的脚本，判断是否执行打包操作

```js
const { rm, cp, mkdir, exec, echo, env } = require('shelljs')
const chalk = require('chalk')
// 获取变更文件夹
let change = process.env.change || ''
 
console.log(chalk.green('==== 执行change脚本 ===='))
console.log(chalk.red(`==== 变更${change} ====`))
// 判断是否在文件夹内的变动
if(change.match('wp-js')){
    exec(`cross-env change=${change} npm run build:js -s`)
}else if(change.match('wp-css')){
    exec(`cross-env change=${change} npm run build:css -s`)
}
console.log(chalk.green('==== 打包结束 ===='))
```

babel 配置

```json
{
    "presets":[
        ["@babel/preset-env", {
            "modules": false,
        }],
    ],
    "plugins": [
        ["@babel/plugin-proposal-object-rest-spread", { "loose": true }],
    ]
}
```

postcss 配置

```js
module.exports = {
    plugins: [
        require('autoprefixer')({})
    ]
}
```

配置可执行命令，package.json 中的 scripts

```json
{
"scripts": {
    "build:js": "webpack --config build/webpack.prod.es.js",
    "build:all:js": "cross-env change='all' npm run build:js",
    "build:css": "webpack --config build/webpack.prod.css.js",
    "build:all:css": "cross-env change='all' npm run build:css",
    "build:all": "cross-env change='all' npm run build:css & cross-env change='all' npm run build:js",
    "watch": "onchange --await-write-finish 500 -i \"**/*.js\" \"**/*.scss\" -e './js/**/*.js' './css/**/*.scss' -- cross-env change='{{changed}}' node scripts/change.js",
    "watch:js": "onchange --await-write-finish 500 -i \"**/*.js\" -e './js/**/*.js' -- cross-env change='{{changed}}' node scripts/change.js",
    "watch:css": "onchange --await-write-finish 500 -i \"**/*.scss\" -e './css/**/*.scss' -- cross-env change='{{changed}}' node scripts/change.js",
    "postbuild:css": "rm -rf css/.empty.index.js & rm -rf css/.map/.empty.index.js.map"
  },
}
```

运行 npm run watch 进行开发

wp-js => js
1. 支持 es6 语法，es6 api 需要到 es.api 文件夹引入对应api（不然安卓4.4不支持）
2. 支持 import export 语法
3. 支持混淆压缩
4. 支持 tree shaking

wp-css => css
1. 支持 scss 文件处理