const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')
const { promisify } = require('util')
const inquirer = require('inquirer')
const download = require('download')
const tempy = require('tempy')
const ora = require('ora')

const questionsFlows = {
	'main-start': chooseOrigin,
	'main-1-1': chooseBuiltInModules,
	'main-1-2': inputRepositoryUrl,
	'main-1-3': inputRemoteFileUrl,
	'main-2-1': 'umi-start',
}

async function chooseOrigin(previousAnswers) {
	const questionNo = 'main-1'
	const question = {
		type: 'list',
		name: 'type',
		message: 'where do you want to generate from?',
		choices: ['built-ins', 'git-repository', 'remote-file'],
		default: 'built-ins',
	}
	const answer = await inquirer.prompt(question)
	const flowTag = questionNo + '-' + (question.choices.indexOf(answer.type) + 1)
	const answers = Object.assign(previousAnswers, answer, { flowTag })
	return answers
}

async function inputRepositoryUrl(previousAnswers) {
	// const questionNo = '2'
	const question = {
		type: 'input',
		name: 'repository',
		message: 'please input git repository path or url.',
	}
	const answer = await inquirer.prompt(question)
	const spinner = ora('clone repository...').start()
	const tempDir = tempy.directory()
	const result = await promisify(exec)(`git clone ${answer.repository} ${tempDir}`)
	if (!result.err) {
		spinner.succeed('git clone complete')
	} else {
		spinner.fail('git clone failed')
	}
	const answers = Object.assign(previousAnswers, answer, { tempDir }, { flowTag: 'end' })
	return answers
}

async function inputRemoteFileUrl(previousAnswers) {
	// const questionNo = '2'
	const question = {
		type: 'input',
		name: 'remoteFile',
		message: 'please input template path or url.',
	}
	const answer = await inquirer.prompt(question)
	const spinner = ora('download remote template file...').start()
	const fileExt = path.extname(answer.remoteFile) || ''
	const remoteFile = await download(answer.remoteFile)
	const tempFile = tempy.file({ extension: fileExt + '.ejs' })
	fs.writeFileSync(path.resolve(tempFile), remoteFile, 'utf8')
	spinner.succeed('complete download')
	const answers = Object.assign(previousAnswers, answer, { tempFile }, { flowTag: 'end' })
	return answers
}

async function chooseBuiltInModules(previousAnswers) {
	const questionNo = 'main-2'
	const modules = ['umi']
	const question = {
		type: 'list',
		name: 'builtIn',
		message: 'please choose built-in module',
		choices: modules,
		default: modules[0],
	}

	const answer = await inquirer.prompt(question)
	const flowTag = questionNo + '-' + (question.choices.indexOf(answer.builtIn) + 1)
	const answers = Object.assign(previousAnswers, answer, { flowTag: flowTag })
	return answers
}

module.exports = questionsFlows
