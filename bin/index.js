#!/usr/bin/env node

const path = require('path')
const prog = require('caporal')
const debug = require('../logger')
const questions = require('./questions')
const { generate, generateUmi } = require('../generate')
const { isFileExists } = require('../utils').file
// general generate command
prog
	.version('0.0.2')
	.command('generate')
	.alias('g')
	.option('-t --template <template>', '指定模板文件或目录')
	.option('-c --config <configFile>', '指定配置文件')
	.option('-o --output <outputPath>', '指定输出路径')
	.action(async function(args, options, logger) {
		const templatePath = options.template
		const configFile = options.config
		const outputPath = options.output
		if (templatePath) {
			generate(templatePath, configFile, outputPath)
		} else {
			const answers = await questions.askQuestions()
			debug.info(answers)
			const templateDir = getTemplatePath(answers)
			generate(templateDir, configFile, outputPath, answers)
		}
	})

	// umi generate command
	.command('umi', '生成内置 umi 代码')
	.option('-c --config <configFile>', '指定配置文件')
	.option('-o --output <outputPath>', '指定输出路径')
	.option('-s --swagger <swaggerFile>', '指定本地 swagger 文件')
	.option('-m --modules <moduleNames>', '指定需要输出的 swagger 模块, 使用 "," 进行连接')
	.action(async function(args, options, logger) {
		const configFile = options.config
		const outputPath = options.output
		const swagger = options.swagger
		const moduleNames = options.modules
		const isValidSwaggerFile = await isFileExists(swagger)
		console.log(isValidSwaggerFile)
		const initialAnswer = Object.assign(
			{
				builtIn: 'umi',
			},
			isValidSwaggerFile ? { swagger: path.resolve(swagger) } : {},
			moduleNames ? { moduleNames: moduleNames.split(',') } : {}
		)
		const answers = await questions.askQuestions('umi-start', initialAnswer)
		const templateDir = getTemplatePath(answers)
		await generateUmi(templateDir, configFile, outputPath, answers)
	})

prog.parse(process.argv)

const getTemplatePath = answers => {
	if ('builtIn' in answers) {
		const builtIn = answers.builtIn
		const moduleName = answers[answers.builtIn]
		const templateDir = path.join(path.join(__dirname, '../templates'), builtIn, moduleName)
		return templateDir
	} else if ('repository' in answers) {
		return answers.tempDir
	} else if ('remoteFile' in answers) {
		return answers.tempFile
	} else {
		return ''
	}
}
