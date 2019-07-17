var handlebars = require('handlebars')
handlebars.registerHelper('raw', function(options) {
	return options.fn(this)
})

function transform(source, context) {
	let template = handlebars.compile(source)
	return template(context)
}

module.exports = transform
