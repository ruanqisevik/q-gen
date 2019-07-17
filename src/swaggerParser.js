const path = require('path')
const camelCase = require('camelcase')

module.exports = async (swagger, config) => {
	if (config.requestUrl) {
		const request = {}
		const requestUrl = config.requestUrl
		const requestInfo = swagger.paths[requestUrl]
		const requestMethod = Object.keys(requestInfo)[0]
		const parameterInfos = requestInfo[requestMethod].parameters

		request['url'] = requestUrl
		request['method'] = requestMethod

		const parsed = requestUrl.split(path.sep).filter(piece => {
			return piece !== '' && piece !== 'rest'
		})
		const functionAction = parsed.pop()
		const functionName = camelCase([functionAction, ...parsed].join('-'))
		request.action = functionAction
		request.functionName = functionName

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
		request.headers = headers
		request.params = params
		request.body = body
		// console.log(JSON.parse(params + body))
		config.form = params + body
		config.request = request
	}
	return config
}
