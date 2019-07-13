var fs = require('fs')
var path = require('path')

var templatePath = path.join(__dirname, '../template')
// module.exports = () => {
const list = () => {
	return new Promise((resolve, reject) => {
		fs.readdir(templatePath, function (err, files) {
			if (err) {
				reject(err)
			}
			resolve(files)
		})
	})
}
module.exports = list