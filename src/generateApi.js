const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const camelCase = require('camelcase')
const logger = require('caporal').logger()

const log = require('../logger')
const load = require('./loader')
const transform = require('./transform')
const getModuleName = require('./moduleHelper')
const { TEMPLATE_PATH } = require('./globals')

const { safeFile, safeDir, writeFileTo, isDirExists } = require('./util')

const generate = async (swaggerJsonPath, outputDir, modules) => {
	try {
		const output = await safeDir(outputDir)
		const swagger = JSON.parse(fs.readFileSync(await safeFile(swaggerJsonPath), 'utf8'))

		const modulesMapToGen = {}
		modules.forEach(moduleName => {
			const modulePaths = Object.keys(swagger.paths).filter(key => {
				let exits = key.indexOf(moduleName) !== -1
				if (exits) {
					moduleName = getModuleName(key)
				}
				return exits
			})

			if (modulePaths.length > 0) {
				modulesMapToGen[moduleName] = modulePaths.map(modulePath => {
					const map = {}
					map[modulePath] = swagger.paths[modulePath]
					return map
				})
			} else {
				logger.warn(`module '${moduleName}' not found`)
			}
		})

		Object.entries(modulesMapToGen).map(async (moduleMap, index) => {
			const moduleName = moduleMap[0]
			const modulePaths = moduleMap[1]
			const config = createConfig(moduleName, modulePaths)
			const pendingBuffers = await load(path.join(TEMPLATE_PATH, '/api'))

			const processFlag = await Promise.all(
				pendingBuffers.map(async ({ buffer, fileName }) => {
					const outputPath = path.join(output, fileName)

					if (index === 0) {
						!(await isDirExists(outputPath)) && (await promisify(fs.mkdir)(outputPath))
					}
					log.debug('processing', fileName)
					const source = await buffer
					const outputContent = transform(source, config)

					return await writeFileTo(path.join(outputPath, moduleName + '.js'), outputContent)
				})
			)
			if (processFlag.includes(false)) return new Error('some file process failed')
		})
	} catch (error) {
		throw error
	}
}

function createConfig(moduleName, modulePaths) {
	const config = {}
	config.module = moduleName
	config.requests = modulePaths.map(modulePath => {
		const config = {}
		const requestUrl = Object.keys(modulePath)[0]
		const requestInfo = Object.values(modulePath)[0]
		const requestMethod = Object.keys(requestInfo)[0]
		const parameterInfos = requestInfo[requestMethod].parameters

		config['url'] = requestUrl
		config['method'] = requestMethod

		const parsed = requestUrl.split(path.sep).filter(piece => {
			return piece !== '' && piece !== 'rest'
		})
		const functionAction = parsed.pop()
		const functionName = camelCase([functionAction, ...parsed].join('-'))
		config.action = functionAction
		config.functionName = functionName

		const headers = []
		const params = []
		const body = []
		parameterInfos.map(paramInfo => {
			if (paramInfo.in === 'header') {
				headers.push(paramInfo)
			} else if (paramInfo.in === 'query') {
				params.push(paramInfo)
			} else if (paramInfo.in === 'body') {
				body.push(paramInfo)
			}
		})
		config.headers = headers
		config.params = params
		config.body = body
		return config
	})
	return config
}

module.exports = generate
