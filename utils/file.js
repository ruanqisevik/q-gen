const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

async function safeDir(dir) {
	const exists = await isDirExists(dir)
	if (exists) {
		return path.resolve(dir)
	} else {
		throw new Error(`no such dir called '${dir}'`)
	}
}

async function safeFile(file) {
	const exists = await isFileExists(file)
	if (exists) {
		return path.resolve(file)
	} else {
		throw new Error(`no such file called '${file}'`)
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
		return false
	}
}

async function fsTypeOf(param) {
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
}

async function writeFileTo(output, content) {
	!(await isDirExists(path.dirname(output))) &&
		(await promisify(fs.mkdir)(path.dirname(output), { recursive: true }))
	try {
		const err = await promisify(fs.writeFile)(output, content)
		if (err) {
			return false
		} else {
			return true
		}
	} catch (error) {
		return false
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
