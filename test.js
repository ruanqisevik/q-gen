const { URL } = require('url')
let myurl = new URL('https://api.cnjiang.com/yph/rest/admin/AdminUsers/list?pageNum=1&pageSize=10')

console.log(myurl.pathname)
