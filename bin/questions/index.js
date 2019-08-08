const mainQuestionFlows = require('./mainQuestions')
const umiQuestionFlows = require('./umiQuestions')
const debug = require('../../logger')

const questionFlows = {
	...mainQuestionFlows,
	...umiQuestionFlows,
}

async function askQuestions(startTag, initialNote) {
	return await ask(questionFlows, startTag || 'main-start', initialNote || {})
}

async function ask(questionFlows, flowTag, note) {
	if (flowTag === 'end') {
		delete note.flowTag
		return note
	} else {
		var action = questionFlows[flowTag]
		if (action && action instanceof Function) {
			const newAnswer = await action(note, questionFlows)
			const nextTag = newAnswer.flowTag
			const answers = Object.assign(note, newAnswer)
			return await ask(questionFlows, nextTag, answers)
		} else if (action && typeof action === 'string') {
			const nextTag = action
			return await ask(questionFlows, nextTag, note)
		} else {
			debug.fatal(new Error('flow do not have such tag ' + flowTag))
		}
	}
}

module.exports = {
	questionFlows: questionFlows,
	askQuestions: askQuestions,
}
