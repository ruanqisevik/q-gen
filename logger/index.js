const pino = require('pino')

module.exports = pino({
	level: 'silent',
	base: null,
	timestamp: false
})