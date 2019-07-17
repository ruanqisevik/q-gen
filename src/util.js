const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

async function safeDir(dir) {
	try {
		const exists = await isDirExists(dir)
		if (exists) {
			return path.resolve(dir)
		} else {
			throw new Error(`no such dir called '${dir}'`)
		}
	} catch (error) {
		throw error
	}
}

async function safeFile(file) {
	try {
		const exists = await isFileExists(file)
		if (exists) {
			return path.resolve(file)
		} else {
			throw new Error(`no such file called '${file}'`)
		}
	} catch (error) {
		throw error
	}
}

async function isDirExists(dir) {
	try {
		const stats = await promisify(fs.stat)(dir)
		return stats.isDirectory(dir)
	} catch (err) {
		return false
	}
}

async function isFileExists(file) {
	try {
		const stats = await promisify(fs.stat)(file)
		return stats.isFile(file)
	} catch (err) {
		throw false
	}
}

async function fsTypeOf(param) {
	try {
		const stats = await promisify(fs.stat)(param)
		if (stats.isFile(param)) {
			return 'file'
		} else if (stats.isDirectory(param)) {
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

async function writeFileTo(output, content) {
	try {
		const err = await promisify(fs.writeFile)(output, content)
		if (err) {
			throw err
		} else {
			return true
		}
	} catch (error) {
		throw error
	}
}

module.exports = {
	safeDir,
	safeFile,
	isDirExists,
	isFileExists,
	fsTypeOf,
	writeFileTo,
}
