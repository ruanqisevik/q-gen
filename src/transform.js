var handlebars = require('handlebars')

function transform(source, context) {
	let template = handlebars.compile(source)
	return template(context)
}

module.exports = transform