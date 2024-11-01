export const FETCH_USERS_BEGIN   = 'FETCH_USERS_BEGIN';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

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

export const fetchUsersSuccess = response => ({
	type: FETCH_USERS_SUCCESS,
	payload: response
});

export const fetchUsersFailure = error => ({
	type: FETCH_USERS_FAILURE,
	payload: error
});

export const fetchUsers = () => {
	return dispatch => {
		dispatch({
			type: FETCH_USERS_BEGIN
		})
		return fetch(WPPT_API.api.homeUrl + '/wp-json/wp/v2/users?per_page=100')
			.then(handleErrors)
			.then(res => res.json())
			.then(json => {
				dispatch(fetchUsersSuccess(json));
				return json;
			})
			.catch(error => dispatch(fetchUsersFailure(error)));
	}
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}