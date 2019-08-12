const { Signale } = require('signale')

const options = {
	disabled: false,
	interactive: false,
	logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
	scope: 'custom',
	secrets: [],
	stream: process.stdout,
}

const signale = new Signale(options)
module.exports = signale
