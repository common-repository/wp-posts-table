export const FETCH_CATEGORIES_BEGIN   = 'FETCH_CATEGORIES_BEGIN';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

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

export const fetchCategoriesSuccess = response => ({
	type: FETCH_CATEGORIES_SUCCESS,
	payload: response
});

export const fetchCategoriesFailure = error => ({
	type: FETCH_CATEGORIES_FAILURE,
	payload: error
});

export const fetchCategories = () => {
	return dispatch => {
		dispatch({
			type: FETCH_CATEGORIES_BEGIN
		})
		return fetch(WPPT_API.api.homeUrl + '/wp-json/wp/v2/categories?per_page=100')
			.then(handleErrors)
			.then(res => res.json())
			.then(json => {
				dispatch(fetchCategoriesSuccess(json));
				return json;
			})
			.catch(error => dispatch(fetchCategoriesFailure(error)));
	}
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}