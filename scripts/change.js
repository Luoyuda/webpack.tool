/*
 * @Author: xiaohuolong
 * @Date: 2020-08-26 18:12:05
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-08-31 11:44:19
 * @FilePath: /kjlive-h5/live/scripts/change.js
 */
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
