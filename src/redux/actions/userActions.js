import * as types from '../types';
import { StackActions, NavigationActions } from 'react-navigation';
import apiServices from '../../services/apiServices';
import AlertMessages from '../../components/commons/AlertMessages';
import NavigationService from '../../services/NavigationService';

export const createUser = user => async dispatch => {
	const response = await apiServices.createUser(user);

	if (response.success) {
		dispatch({ type: types.ADD_USER_SUCCESS, payload: response.data });

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
