var fs = require('fs')
var path = require('path')
const { promisify } = require('util')

const { fsTypeOf } = require('./util')

async function load(templatePath) {
	try {
		var files = []

		const type = await fsTypeOf(templatePath)
		files =
			type === 'file'
				? [path]
				: await (async () => {
					const fileNames = await promisify(fs.readdir)(templatePath)
					return fileNames.map(fileName => path.join(templatePath, fileName))
				  })()

		const buffers = files.map(file => {
			return {
				buffer: promisify(fs.readFile)(file, 'utf8'),
				file: file,
				fileName: path.basename(file),
			}
		})
		return buffers
	} catch (error) {
		throw error
	}
}

module.exports = load
