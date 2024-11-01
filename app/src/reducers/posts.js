import { FETCH_POSTS_BEGIN, FETCH_POSTS_SUCCESS, FETCH_POSTS_FAILURE } from '../actions';

const initialState = {
	payload: [],
	loading: false,
	error: null
}

/*
 * TODO: be able to load more than 100 posts: https://stackoverflow.com/questions/48494711/wordpress-rest-api-get-all-posts
 *
 */
export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_POSTS_BEGIN:
			return {
				...state,
				loading: true,
				error: null
			}

		case FETCH_POSTS_SUCCESS:
			return {
				...state,
				loading: false,
				payload: action.payload
			}

		case FETCH_POSTS_FAILURE:
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