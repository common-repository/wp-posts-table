export const FETCH_CATEGORIES_BEGIN   = 'FETCH_CATEGORIES_BEGIN';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';
export const FETCH_POSTS_BEGIN   = 'FETCH_POSTS_BEGIN';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';
export const FETCH_USERS_BEGIN   = 'FETCH_USERS_BEGIN';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';


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