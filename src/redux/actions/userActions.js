import * as types from '../types';
import apiServices from '../../services/apiServices';

export const createUser = user => async dispatch => {
	const response = await apiServices.createUser(user);
	console.log(response);
	if (response.success) dispatch({ type: types.ADD_USER_SUCCESS, payload: response.data });
	return response;
};