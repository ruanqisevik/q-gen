const compiler = require('ejs')
const lint = require('ejs-lint')
const debug = require('../logger')
module.exports = (template, context, options) => {
	const err = lint(template)
	err && debug.fatal(err)
	const compileTemplate = compiler.compile(template, options || {})
	const output = compileTemplate(context)
	return output
}
