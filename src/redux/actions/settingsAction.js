import * as types from '../types';

export const getNotificationsSettings = () => async dispatch => {
	//TODO: api callback
	const settings = {
		pauseAll: false,
		laughs: true,
		comments: true,
		newFollow: false,
		messages: true
	};
	dispatch({
		type: types.SET_SETTINGS_NOTIFICATIONS,
		payload: settings
	});
};
