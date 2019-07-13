#!/usr/bin/env node

const prog = require('caporal')

const log = require('../logger')
const list = require('../src/list')
const generate = require('../src/generate')

prog
	.version('0.0.1')
	.command('generate', 'Generate Template File; 从模板文件生成代码')
	.alias('g')
	.argument('<templateDir>', '指定模板目录或采用内置模板, 使用 list 命令查看内置模板; 在 --file 模式下为指定模板文件路径')
	.argument('<outputDir>', '指定生成后代码的输出目录')
	.option('--config <configFile>', '指定模板生成代码时使用的配置文件')
	.option('--file', '从单个模板文件生成代码')
	.action(async function (args, options, logger) {
		const templateDir = args.templateDir || logger.error('请传入正确的模板参数')
		const outputDir = args.outputDir || logger.error('请传入正确的模板参数')

		try {
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
	.action(function (args, options, logger) {
		list()
			.then(result => {
				logger.info(result)
			})
			.catch(err => {
				throw err
			})
	})

prog.parse(process.argv)