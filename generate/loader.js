var fs = require('fs')
var path = require('path')
const { promisify } = require('util')
const { fsTypeOf } = require('../utils').file

async function load(templatePath, whitelist) {
	const type = await fsTypeOf(templatePath)
	const filePath = templatePath
	const filePaths = await (async () => {
		return (await promisify(fs.readdir)(templatePath)).map(fileName =>
			path.join(templatePath, fileName)
		)
	})()
	const files = type === 'file' ? [filePath] : filePaths
	const buffers = await Promise.all(
		files
			.filter(file => {
				return (
					path.basename(file) !== '.DS_Store' &&
					// ['helpers', 'config'].indexOf(path.basename(file, '.js')) === -1 &&
					(whitelist || []).indexOf(path.basename(file, '.js')) === -1
				)
			})
			.map(async file => {
				return {
					buffer: await promisify(fs.readFile)(file, 'utf8'),
					file: file,
					fileName: path.basename(file, '.ejs'),
				}
			})
	)
	return buffers
}

module.exports = load
