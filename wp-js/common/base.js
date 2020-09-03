/*
 * @Author: xiaohuolong
 * @Date: 2020-08-27 10:23:38
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-08-31 10:22:45
 * @FilePath: /kjlive-h5/live/wp-js/common/base.js
 */
import "../es.api/Promise";

export function a() {
    return new Promise((resolve, reject) => {
        alert(this)
        alert('-a-')
        resolve()
    })
}

export function b() {
    return new Promise((resolve, reject) => {
        console.log('-b-')
        resolve()
    })
}

alert('base')