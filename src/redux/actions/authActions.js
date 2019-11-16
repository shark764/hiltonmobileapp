import * as types from '../types';

export const userLogin = user => async dispatch => {
	//TODO: api callback
	const loggedUser = {
		id: 1,
		handle: '@davidrenji',
		fullName: 'Jason Lopez',
		img: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon'
	};

	dispatch({ type: types.API_ERROR, payload: 'Invalid user' });

	//dispatch({ type: types.USER_LOGGED_IN_SUCCESS, payload: loggedUser });
};

export const userLogout = () => async dispatch => {
	dispatch({
		type: types.USER_LOGGED_OUT_SUCCESS,
		payload: null
	});
};
