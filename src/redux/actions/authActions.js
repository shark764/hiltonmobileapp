import * as types from '../types';
import { StackActions, NavigationActions } from 'react-navigation';
import apiServices from '../../services/apiServices';
import NavigationService from '../../services/NavigationService';
import AlertMessages from '../../components/commons/AlertMessages';

export const getLoggedUser = user => async dispatch => {
	//TODO: get data from localStorage
	const loggedUser = {
		id: 1,
		handle: '@davidrenji',
		fullName: 'Jason Lopez',
		img: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon'
	};

	//dispatch({ type: types.USER_LOGGED_IN_SUCCESS, payload: loggedUser });
};

export const userLogin = user => async dispatch => {
	const response = await apiServices.loginUserWithEmail(user);
	console.log(response);
	if (response.success) {
		dispatch({ type: types.USER_LOGGED_IN_SUCCESS, payload: response.data });

		//Redirect to Home Process
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Profile' })]
		});

		//Go to current parent route
		NavigationService.dispatch(resetAction);

		//Now, go to sibling screen - Home
		NavigationService.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'Home' });

		AlertMessages.success(response.message);
	}

	return response;
};

export const userLogout = () => async dispatch => {
	dispatch({
		type: types.USER_LOGGED_OUT_SUCCESS,
		payload: null
	});
};
