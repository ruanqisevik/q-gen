var handlebars = require('handlebars')

handlebars.registerHelper('raw', function(options) {
	return options.fn(this)
})

function transform(source, context, helpers) {
	helpers instanceof Object &&
		Object.entries(helpers).map(([key, func]) => {
			handlebars.registerHelper(key, func)
		})
	let template = handlebars.compile(source)
	return template(context)
}

// var ejs = require('ejs')
// function transform(source, context) {
// 	let template = ejs.compile(source)
// 	return template(context)
// }

module.exports = transform
