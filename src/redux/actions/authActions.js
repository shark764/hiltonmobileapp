import * as types from '../types';
import apiServices from '../../services/apiServices';
import AlertMessages from '../../components/commons/AlertMessages';
import LocalStorage from '../../services/LocalStorage';
import { goToRootRouteFromChild, setUserAvatarUrl } from '../../utils/helpers';

export const getLoggedUser = () => async dispatch => {
	let loggedUser = await LocalStorage.getObject('loggedUser');

	//If there's an user object saved in the local storage,
	//then we call the api to update the user info
	if (loggedUser) {
		const response = await apiServices.getUserData(loggedUser.id);

		if (response.success) {
			loggedUser = setUserAvatarUrl(response.data);

			LocalStorage.setObject('loggedUser', loggedUser);
		}
	}

	dispatch({ type: types.USER_LOGGED_IN_SUCCESS, payload: loggedUser });
};

export const userLoginWithEmail = (user, rememberMe, redirectTo) => async dispatch => {
	const response = await apiServices.loginUserWithEmail(user);

	if (response.success) {
		await LocalStorage.setValue('token', response.data.token);
		const loggedUser = setUserAvatarUrl(response.data.user);

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
