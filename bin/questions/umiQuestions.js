const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const download = require('download')
const axios = require('axios')
const tempy = require('tempy')
const ora = require('ora')

const questionsFlows = {
	'umi-start': chooseUmiModules,
	'umi-1-1': inputSwaggerPath,
	'umi-1-2': inputListRequestPath,
	'umi-2': inputSwaggerPath,
}

async function chooseUmiModules(previousAnswers) {
	const questionNo = 'umi-1'
	const modules = [
		{ name: 'Api models & Services', value: 'api' },
		{ name: 'TableList', value: 'tableList' },
	]
	const questions = [
		{
			type: 'list',
			name: 'umi',
			message: 'please choose umi module',
			choices: modules,
			default: modules[0],
		},
	]
	const answer = await inquirer.prompt(questions)
	const flowTag = questionNo + '-' + (modules.map(item => item.value).indexOf(answer.umi) + 1)
	const answers = Object.assign(previousAnswers, answer, { flowTag })
	return answers
}

async function inputSwaggerPath(previousAnswers) {
	if (previousAnswers.swagger) {
		const answers = Object.assign(previousAnswers, { flowTag: 'end' })
		return answers
	}
	const question = {
		type: 'input',
		name: 'baseUrl',
		message: 'please input your swagger json url',
	}
	const answer = await inquirer.prompt(question)
	const spinner = ora('downloading swagger infos...').start()
	const swaggerJsonBuffer = await download(answer.baseUrl)
	const tempFile = tempy.file({ extension: 'json' })
	fs.writeFileSync(path.resolve(tempFile), swaggerJsonBuffer, 'utf8')
	spinner.succeed('complete download')
	Object.assign(answer, {
		swagger: tempFile,
	})

	const flowTag = 'end'
	const answers = Object.assign(previousAnswers, answer, { flowTag: flowTag })
	return answers
}

async function inputListRequestPath(previousAnswers) {
	const questionNo = 'umi-2'
	if (previousAnswers.swagger) {
		const answers = Object.assign(previousAnswers, { flowTag: 'end' })
		return answers
	}
	const question = {
		type: 'input',
		name: 'requestUrl',
		message: 'please input your request url',
	}
	const answer = await inquirer.prompt(question)
	const response = await axios.post(answer.requestUrl)
	Object.assign(answer, {
		listRequest: response,
	})
	const flowTag = questionNo
	const answers = Object.assign(previousAnswers, answer, { flowTag: flowTag })
	return answers
}

module.exports = questionsFlows
