/*
 * @Author: xiaohuolong
 * @Date: 2020-08-28 17:50:23
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-08-31 11:43:43
 * @FilePath: /kjlive-h5/live/wp-js/a.js
 */
import "./es.api/Promise"
import "./es.api/Map"
import "./es.api/Set"
new Promise(res => {
    alert('by promise')
    res()
}).then(() => {
    alert('by then')
})
// alert(`${1}`)
import { a } from './common/base'
alert(a)
console.log(a)
alert(`${1+1}`)
a().then(() => {
    alert('-- a.then --')
})
let map = new Map()
map.set('1',1)
alert(`map ${map.get("1")}`)

let set = new Set()
set.add(1)
set.add(1)
set.add(2)
set.forEach(item => alert(`set - ${item}`))

alert([...[1,2,3]])
alert({...{a:1}})