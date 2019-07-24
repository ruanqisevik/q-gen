const camelCase = require('camelcase')

function getModuleName(fullPath) {
	const pieces = fullPath.split('/').filter(piece => piece)
	pieces.shift() && pieces.pop()
	return camelCase(pieces.join('-'))
}

module.exports = getModuleName
