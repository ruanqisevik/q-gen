const fs = require('fs')
const path = require('path')
const {
	promisify
} = require('util')

const camelCase = require('camelcase')
const yaml = require('js-yaml')

const log = require('../logger')
const load = require('./loader')
const list = require('./list')
const transform = require('./transform')
const {
	isDirExists,
	isFileExists
} = require('./util')
const {
	TEMPLATE_PATH
} = require('./globals')

async function generate(template, output, options) {
	try {
		var templatePath = ''
		var configFile = ''
		var config = {}
		if (options.config) {
			configFile = options.config
			const exist = await isFileExists(configFile)
			const extname = exist && path.extname(configFile)
			if (extname === '.json') {

			} else if (extname === '.js') {

			} else if (extname === '.yml') {
				config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
			}
		}

		if (options.file) {
			templatePath = await templateFile(template)
		} else {
			templatePath = await templateDir(template)
		}

		const outputPath = await outputDir(output)
		const loadedTemplates = await load(templatePath)

		const processFlag = await Promise.all(loadedTemplates.map(async ({
			buffer,
			fileName
		}) => {
			log.debug('processing', fileName)
			const source = await buffer
			const outputContent = transform(source, config)
			return await writeFileTo(path.join(outputPath, fileName), outputContent)
		}))
		if (processFlag.includes(false)) return new Error('some file process failed')
	} catch (error) {
		throw error
	}
}

async function writeFileTo(path, content) {
	try {
		const err = await promisify(fs.writeFile)(path, content)
		if (err) {
			throw err
		} else {
			return true
		}
	} catch (error) {
		throw error
	}
}

async function templateFile(template) {
	try {
		const exists = await isFileExists(template)
		if (exists) {
			return path.resolve(template)
		} else {
			throw new Error('judge file failed')
		}
	} catch (error) {
		throw error
	}
}

async function templateDir(template) {
	const exists = await isDirExists(template)
	if (exists) {
		return path.resolve(template)
	} else {
		return await defaultTemplateDir(camelCase(template))
	}
}

async function outputDir(output) {
	const exists = await isDirExists(output)
	if (exists) {
		return path.resolve(output)
	} else {
		throw new Error(`no such output path called '${output}'`)
	}
}

async function defaultTemplateDir(template) {
	const lists = await list()
	if (lists.indexOf(template) !== -1) {
		return path.join(TEMPLATE_PATH, template)
	} else {
		throw new Error(`no such built-in template called '${template}'`)
	}
}



module.exports = generate