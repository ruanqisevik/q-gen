import { 
insertAdminGoodsCategory, 
 } from '@/services/adminGoodsCategory'

export default {
	namespace: 'adminGoodsCategory',

	state: {
		data: {
			list: [],
			pagination: {},
		},
	},

	effects: {
		*insert({ payload }, { call, put }) {
			const response = yield call(insertAdminGoodsCategory, payload)
			yield put({
				type: 'save',
				payload: response,
			})
		},
	},

	reducers: {
		save(state, action) {
			return {
				...state,
				data: action.payload,
			}
		},
	},
}
