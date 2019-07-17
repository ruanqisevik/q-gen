const fs = require('fs')
const path = require('path')

const camelCase = require('camelcase')
const yaml = require('js-yaml')

const log = require('../logger')
const load = require('./loader')
const list = require('./list')
const swaggerParsed = require('./swaggerParser')
const transform = require('./transform')
const { safeDir, safeFile, writeFileTo, isDirExists, isFileExists } = require('./util')
const { TEMPLATE_PATH } = require('./globals')

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
				config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
			} else if (extname === '.js') {
				config = require(path.resolve(configFile))
			} else if (extname === '.yml') {
				config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
			}
		}
		if (options.swagger) {
			config.requestUrl = options.requestUrl
			const swaggerPath = path.resolve(options.swagger)
			const swagger =
				(await isFileExists(swaggerPath)) && JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))
			if (swagger.paths[config.requestUrl]) {
				config = swaggerParsed(swagger, config)
			} else {
				throw new Error('swagger has no such request path')
			}
		}

		if (options.file) {
			templatePath = await safeFile(template)
		} else {
			templatePath = await templateDir(template)
		}

		const outputPath = await safeDir(output)
		const loadedTemplates = await load(templatePath)

		const processFlag = await Promise.all(
			loadedTemplates.map(async ({ buffer, fileName }) => {
				log.debug('processing', fileName)
				const source = await buffer
				const outputContent = transform(source, config)
				return await writeFileTo(path.join(outputPath, fileName), outputContent)
			})
		)
		if (processFlag.includes(false)) return new Error('some file process failed')
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

async function defaultTemplateDir(template) {
	const lists = await list()
	if (lists.indexOf(template) !== -1) {
		return path.join(TEMPLATE_PATH, template)
	} else {
		throw new Error(`no such built-in template called '${template}'`)
	}
}

module.exports = generate
