const pino = require('pino')

module.exports = pino({
	level: 'warn',
	base: null,
	timestamp: false,
})
