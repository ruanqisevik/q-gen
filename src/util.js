const fs = require('fs')
const {
	promisify
} = require('util')

async function isDirExists(path) {
	try {
		const stats = await promisify(fs.stat)(path)
		return stats.isDirectory(path)
	} catch (err) {
		return false
	}
}

async function isFileExists(path) {
	try {
		const stats = await promisify(fs.stat)(path)
		return stats.isFile(path)
	} catch (err) {
		throw err
	}
}

async function fsTypeOf(path) {
	try {
		const stats = await promisify(fs.stat)(path)
		if (stats.isFile(path)) {
			return 'file'
		} else if (stats.isDirectory(path)) {
			return 'directory'
		} else if (stats.isSymbolicLink) {
			return 'link'
		} else {
			return 'unknown'
		}

	} catch (err) {
		throw err
	}
}

module.exports = {
	isDirExists,
	isFileExists,
	fsTypeOf
}