const response = require('../../res.json')
const axios = require('axios')
const service = axios.create({
	baseURL: 'http://192.168.3.189:8080',
	timeout: 60 * 1000,
})

const request = async () => {
	try {
		const response = await service({
			method: 'post',
			url: '/rest/front/Address/getUserAddressList',
		})
		return response.data
	} catch (error) {
		throw error
	}
}

const generateColumns = async () => {
	const list = await request().data
	const listItem = list.length > 0 && list[0]
	const columns = Object.keys(listItem)

	const configs = (module.exports = {
		title: 'table list title',
		columns: JSON.stringify(
			columns.map(column => {
				return {
					title: column,
					dataIndex: column,
				}
			})
		),
	})
	return configs
}

module.exports = generateColumns
