const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const loader = require('./loader')
const compile = require('./compile')
const { compileApiWithSwagger, compilePagesWithSwagger } = require('./compileWithSwagger')
const { writeFileTo, isDirExists } = require('../utils').file
const ora = require('ora')

const generate = (templatePath, configFile, outputPath, ...infos) => {
	const templates = getTemplates(templatePath)
	templates.map()
}

const generateUmi = async (templatePath, configFile, outputPath, config) => {
	const templates = await getTemplates(templatePath)
	switch (config.umi) {
	case 'api':
		var apiOutputs = await compileApiWithSwagger(
			templates,
			require(config.swagger),
			config.moduleNames || []
		)
		apiOutputs.forEach(async output => {
			const spinner = ora('writing output...' + output.filename).start()
			const outputfile = path.join(outputPath || process.cwd(), output.filename)
			const succeed = await writeFileTo(outputfile, output.content)
			if (succeed) {
				spinner.succeed(output.filename + ' complete')
			} else {
				spinner.fail(output.filename + ' output failed')
			}
		})
		break
	case 'tableList':
		var listOutputs = await compilePagesWithSwagger(
			templates,
			config.listRequest,
			require(config.swagger)
		)

		listOutputs.forEach(async output => {
			const spinner = ora('writing output...' + output.filename).start()
			const outputfile = path.join(outputPath || process.cwd(), output.filename)
			const succeed = await writeFileTo(outputfile, output.content)
			if (succeed) {
				spinner.succeed(output.filename + ' complete')
			} else {
				spinner.fail(output.filename + ' output failed')
			}
		})
		break
	default:
		break
	}
}

const getTemplates = async templatePath => {
	return await loader(templatePath)
}

module.exports = { generate, generateUmi }
