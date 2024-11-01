export const FETCH_POSTS_BEGIN   = 'FETCH_POSTS_BEGIN';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

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

export const fetchPostsSuccess = response => ({
	type: FETCH_POSTS_SUCCESS,
	payload: response
});

export const fetchPostsFailure = error => ({
	type: FETCH_POSTS_FAILURE,
	payload: error
});

export const fetchPosts = () => {
	return dispatch => {
		dispatch({
			type: FETCH_POSTS_BEGIN
		})
		return fetch(WPPT_API.api.homeUrl + '/wp-json/wp/v2/posts?per_page=100')
			.then(handleErrors)
			.then(res => res.json())
			.then(json => {
				dispatch(fetchPostsSuccess(json));
				return json;
			})
			.catch(error => dispatch(fetchPostsFailure(error)));
	}
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}