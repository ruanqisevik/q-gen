const wrapRowFunc = (value, options) => {
	if (value % 3 === 2) {
		return options.fn(this)
	} else {
		return options.inverse(this)
	}
}

const formItemLabel = value => {
	return value.description
}

const formItemKey = value => {
	return value.name
}

const formItemInputType = (value, options) => {
	if (value === 'string') {
		return options.fn(this)
	} else {
		return options.inverse(this)
	}
}

const formItemTimePickerType = (value, options) => {
	if (value === 'date-time') {
		return options.fn(this)
	} else {
		return options.inverse(this)
	}
}

const singleModule = (value, options) => {
	if (value instanceof Array && value.length === 1) {
		return options.fn(value[0])
	} else {
		return options.inverse(value[0])
	}
}

module.exports = {
	wrapRow: wrapRowFunc,
	label: formItemLabel,
	key: formItemKey,
	isInput: formItemInputType,
	isTime: formItemTimePickerType,
	isSingleModule: singleModule,
}
