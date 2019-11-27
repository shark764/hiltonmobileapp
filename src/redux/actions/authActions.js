import * as types from '../types';
import apiServices from '../../services/apiServices';
import AlertMessages from '../../components/commons/AlertMessages';
import LocalStorage from '../../services/LocalStorage';
import { goToRootRouteFromChild } from '../../utils/helpers';

export const getLoggedUser = () => async dispatch => {
	const loggedUser = await LocalStorage.getObject('loggedUser');

	dispatch({ type: types.USER_LOGGED_IN_SUCCESS, payload: loggedUser });
};

export const userLoginWithEmail = (user, rememberMe, redirectTo) => async dispatch => {
	const response = await apiServices.loginUserWithEmail(user);

	if (response.success) {
		await LocalStorage.setValue('token', response.data.token);
		const loggedUser = response.data.user;
		if (rememberMe) await LocalStorage.setObject('loggedUser', loggedUser);

		AlertMessages.success(response.message);

		dispatch({ type: types.USER_LOGGED_IN_SUCCESS, payload: loggedUser });
		
		if (redirectTo) goToRootRouteFromChild(redirectTo, 'Home');
	}

	return response;
};

export const userLogout = () => async dispatch => {
	await LocalStorage.remove('loggedUser');
	dispatch({ type: types.USER_LOGGED_OUT_SUCCESS, payload: null });

	goToRootRouteFromChild('LoginOrSignup', 'Home');
};
