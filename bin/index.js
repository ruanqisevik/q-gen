#!/usr/bin/env node

const prog = require('caporal')
const inquirer = require('inquirer')

const log = require('../logger')
const list = require('../src/list')
const generate = require('../src/generate')
const generateApi = require('../src/generateApi')

prog
	.version('0.0.1')
	.command('generate', 'Generate Template File; 从模板文件生成代码')
	.alias('g')
	.argument(
		'<templateDir>',
		'指定模板目录或采用内置模板, 使用 list 命令查看内置模板; 在 --file 模式下为指定模板文件路径'
	)
	.argument('<outputDir>', '指定生成后代码的输出目录')
	.option('--config <configFile>', '指定模板生成代码时使用的配置文件')
	.option('--file', '从单个模板文件生成代码')
	.option('--swagger <swaggerJsonPath>', '从 swagger.json 文件指定模块默认的请求信息')
	.action(async function(args, options, logger) {
		const templateDir = args.templateDir || logger.error('请传入正确的模板参数')
		const outputDir = args.outputDir || logger.error('请传入正确的模板参数')
		var answers = []
		try {
			if (options.swagger) {
				answers = await inquirer.prompt([
					{
						type: 'input',
						name: 'requestUrl',
						message: 'Please input your request url',
						default: false,
					},
				])
				options = {
					...options,
					...answers,
				}
			}
			const err = await generate(templateDir, outputDir, options)
			if (err) {
				throw err
			} else {
				logger.info('generate complete!')
			}
		} catch (error) {
			log.debug(error)
			logger.error(error.message)
		}
	})

	.command('list', 'List All built-in templates; 列出所有内置模板')
	.action(function(args, options, logger) {
		list()
			.then(result => {
				logger.info(result)
			})
			.catch(err => {
				throw err
			})
	})

	.command('api', 'Generate Api files; 从 swagger.json 生成接口代码')
	.argument('<swaggerJsonPath>', '指定 swagger.json 的文件路径')
	.argument('<outputDir>', '指定生成后代码的输出目录')
	.argument('[modules...]', '指定需要生成的模块, 不传入此参数则生成所有模块')
	.action(function(args, options, logger) {
		const swaggerJsonPath =
			args.swaggerJsonPath || logger.error('请传入正确的 swagger.json 文件路径')
		const outputDir = args.outputDir || logger.error('请传入正确的输出目录')
		const modules = args.modules || logger.error('请传入正确的模块参数')

		try {
			generateApi(swaggerJsonPath, outputDir, modules)
		} catch (error) {
			log.debug(error)
			logger.error(error.message)
		}
	})

prog.parse(process.argv)
