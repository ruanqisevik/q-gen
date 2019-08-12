const path = require('path')
const sep = path.sep
const compile = require('./compile')
const camelcase = require('camelcase')
const { URL } = require('url')
const _ = require('lodash')
const debug = require('../logger')

const compilePagesWithSwagger = (templates, requestInfo, swagger) => {
	const config = getListConfigFromRequestInfo(requestInfo, swagger)
	debug.debug('...........................config is: \n', config)
	return templates.map(template => {
		let output = {
			filename: config.fileName + path.extname(template.fileName),
			content: compile(template.buffer, config),
		}
		return output
	})
}

const compileApiWithSwagger = (templates, swagger, specifiedModules) => {
	swagger.modules = separateInModules(swagger)
	const candidateModules =
		specifiedModules && specifiedModules.length > 0
			? Object.keys(swagger.modules)
				.filter(moduleName => {
					return specifiedModules.find(specifiedModule => {
						return moduleName.indexOf(camelcase(specifiedModule)) !== -1
					})
				})
				.reduce((obj, key) => {
					obj[key] = swagger.modules[key]
					return obj
				}, {})
			: swagger.modules

	const outputs = _.flatten(
		Object.keys(candidateModules).map(moduleName => {
			return templates.map(template => {
				let output = {
					filename: moduleName + sep + template.fileName,
					content: compile(template.buffer, getApiConfigFromSwagger(swagger, moduleName)),
				}
				return output
			})
		})
	)
	return outputs
}

const separateInModules = swagger => {
	const modules = {}
	Object.entries(swagger.paths).map(([path, infos]) => {
		const pieces = path.split(sep)
		const action = pieces.pop()
		const moduleName = camelcase(pieces.pop())
		if (moduleName in modules === false) {
			modules[moduleName] = {}
		}
		modules[moduleName][path] = infos
	})
	return modules
}

const getApiConfigFromSwagger = (swagger, moduleName) => {
	const config = {}
	const modules = swagger.modules[moduleName]
	config.requests = Object.entries(modules).map(([key, value]) => {
		const action = key.split(sep).pop()
		const functionName = camelcase(`${action}-${moduleName}`)
		const method = Object.keys(value)[0]
		const url = key
		const params = value[method].parameters.some(params => {
			return params.in === 'query'
		})
		const body = value[method].parameters.some(params => {
			return params.in === 'body'
		})
		return {
			url,
			action,
			functionName,
			method,
			params,
			body,
		}
	})
	config.moduleName = moduleName
	return config
}

const getListConfigFromRequestInfo = (requestInfo, swagger) => {
	const basePath = swagger.basePath
	const requestUrl = requestInfo.config.url
	const data = requestInfo.data.data
	const url = new URL(requestUrl)
	const requestPath = url.pathname.slice(basePath === '/' ? 0 : basePath.length)
	const pieces = requestPath.split(sep)
	const action = pieces.pop()
	const moduleName = camelcase(pieces.pop())
	const className = camelcase(moduleName + 'List', { pascalCase: true })
	const fileName = moduleName + sep + className
	const functionName = camelcase(action + '-' + moduleName)

	const request = swagger.paths[requestPath]
	const requestMethod = Object.keys(request)[0]
	const parameterInfos = request[requestMethod].parameters
	const headers = []
	const params = []
	const body = []

	parameterInfos.map(paramInfo => {
		if (paramInfo.in === 'header') {
			headers.push(paramInfo)
		} else if (paramInfo.in === 'query') {
			params.push(paramInfo)
		} else if (paramInfo.in === 'body') {
			if (paramInfo.schema) {
				const pieces = paramInfo.schema.$ref.split(path.sep)
				pieces.shift()
				const getEntity = (obj, remainKeys) => {
					if (remainKeys.length > 0) {
						const key = remainKeys.shift()
						return getEntity(obj[key], remainKeys)
					} else {
						return obj
					}
				}
				paramInfo.entity = getEntity(swagger, pieces)
			}
			body.push(paramInfo)
		}
	})
	const form = params.concat(body)
	const config = {
		fileName,
		className,
		moduleName,
		requestUrl,
		action,
		functionName,
		columns: generateColumns(data.list),
		form,
		// columns:
		// 	'[{"title":"id","dataIndex":"id"},{"title":"modifyTime","dataIndex":"modifyTime"},{"title":"modifyById","dataIndex":"modifyById"},{"title":"createTime","dataIndex":"createTime"},{"title":"createById","dataIndex":"createById"},{"title":"deleted","dataIndex":"deleted"},{"title":"userId","dataIndex":"userId"},{"title":"name","dataIndex":"name"},{"title":"mobile","dataIndex":"mobile"},{"title":"phone","dataIndex":"phone"},{"title":"province","dataIndex":"province"},{"title":"city","dataIndex":"city"},{"title":"district","dataIndex":"district"},{"title":"street","dataIndex":"street"},{"title":"zipCode","dataIndex":"zipCode"},{"title":"address","dataIndex":"address"},{"title":"isDefault","dataIndex":"isDefault"}]',
	}
	return config
}

const generateColumns = list => {
	const listItem = list.length > 0 && list[0]
	const columns = Object.keys(listItem)

	return JSON.stringify(
		columns.map(column => {
			return {
				title: column,
				dataIndex: column,
			}
		})
	)
}

module.exports = { compileApiWithSwagger, compilePagesWithSwagger }
