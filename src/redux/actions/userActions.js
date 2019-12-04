import * as types from '../types';
import apiServices from '../../services/apiServices';
import AlertMessages from '../../components/commons/AlertMessages';
import { goToRootRouteFromChild, setUserAvatarUrl } from '../../utils/helpers';

export const createUser = (user, redirectTo) => async dispatch => {
	const response = await apiServices.createUser(user);

	if (response.success) {
		await dispatch({ type: types.ADD_USER_SUCCESS, payload: response.data });

		AlertMessages.success(response.message);

		if (redirectTo) goToRootRouteFromChild(redirectTo, 'Home');
	}

	return response;
};

export const uploadAvatar = (image, loggedUser) => async dispatch => {
	const response = await apiServices.uploadAvatar(image, loggedUser);

	if (response.success) {
		const user = setUserAvatarUrl(response.data.data);

		const localUser = await LocalStorage.getObject('loggedUser');

		//Update local user is it was remembered
		if (localUser) await LocalStorage.setObject('loggedUser', user);

		await dispatch({ type: types.USER_UPDATED_SUCCESS, payload: user });
	} else AlertMessages.error(response.message);
};
