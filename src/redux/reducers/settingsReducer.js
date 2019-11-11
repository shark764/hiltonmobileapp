import * as types from '../types';

const INITIAL_STATE = {
	notifications: {}
};

export default videoReducer = (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case types.SET_SETTINGS_NOTIFICATIONS:
			return { ...state, notifications: payload };
		
		default:
			return state;
	}
};
