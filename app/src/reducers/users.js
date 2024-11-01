import { FETCH_USERS_BEGIN, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE } from '../actions';

const initialState = {
	payload: [],
	loading: false,
	error: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_USERS_BEGIN:
			return {
				...state,
				loading: true,
				error: null
			}

		case FETCH_USERS_SUCCESS:
			return {
				...state,
				loading: false,
				payload: action.payload
			}

		case FETCH_USERS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
				items: []
			}

		default:
			return state
	}
}