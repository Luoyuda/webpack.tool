/*
 * @Author: xiaohuolong
 * @Date: 2020-08-28 11:18:39
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-08-28 17:32:40
 * @FilePath: /npm-demo/live/build/common.js
 */
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