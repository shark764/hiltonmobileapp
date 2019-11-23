import * as types from '../types';
import apiServices from '../../services/apiServices';
import AlertMessages from '../../components/commons/AlertMessages';
import { goToRootRouteFromChild } from '../../utils/helpers';

export const createUser = (user, redirectTo) => async dispatch => {
	const response = await apiServices.createUser(user);

	if (response.success) {
		await dispatch({ type: types.ADD_USER_SUCCESS, payload: response.data });

		AlertMessages.success(response.message);
		console.log('redirectTo', redirectTo);
		goToRootRouteFromChild(redirectTo, 'Home');
	}

	return response;
};
