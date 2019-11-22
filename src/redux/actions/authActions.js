import * as types from '../types';
import { StackActions, NavigationActions } from 'react-navigation';
import apiServices from '../../services/apiServices';
import NavigationService from '../../services/NavigationService';
import AlertMessages from '../../components/commons/AlertMessages';
import LocalStorage from '../../services/LocalStorage';

export const getLoggedUser = () => async dispatch => {
	//TODO: get data from localStorage
	// const loggedUser = {
	// 	id: 1,
	// 	handle: '@davidrenji',
	// 	fullName: 'Jason Lopez',
	// 	img: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon'
	// };
	const loggedUser = await LocalStorage.getObject('loggedUser');
	console.log('user', loggedUser);
	dispatch({ type: types.USER_LOGGED_IN_SUCCESS, payload: loggedUser });
};

export const userLoginWithEmail = (user, rememberMe) => async dispatch => {
	const response = await apiServices.loginUserWithEmail(user);
	console.log('response login: ', response);

	if (response.success) {
		await LocalStorage.setValue('token', response.data.token);
		const loggedUser = response.data.user;
		if (rememberMe) await LocalStorage.setObject('loggedUser', loggedUser);

		dispatch({ type: types.USER_LOGGED_IN_SUCCESS, payload: loggedUser });

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
	await LocalStorage.remove('loggedUser');
	dispatch({
		type: types.USER_LOGGED_OUT_SUCCESS,
		payload: null
	});

	//Redirect to Home Process
	const resetAction = StackActions.reset({
		index: 0,
		actions: [NavigationActions.navigate({ routeName: 'LoginOrSignup' })]
	});

	//Go to current parent route
	NavigationService.dispatch(resetAction);

	//Now, go to sibling screen - Home
	NavigationService.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'Home' });
};
