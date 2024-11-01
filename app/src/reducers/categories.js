import { FETCH_CATEGORIES_BEGIN, FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE } from '../actions';

const initialState = {
	payload: [],
	loading: false,
	error: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_CATEGORIES_BEGIN:
			return {
				...state,
				loading: true,
				error: null
			}

		case FETCH_CATEGORIES_SUCCESS:
			return {
				...state,
				loading: false,
				payload: action.payload
			}

		case FETCH_CATEGORIES_FAILURE:
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