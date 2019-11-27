import * as types from '../types';

const INITIAL_STATE = {
	loggedUser: null
};

export default authReducer = (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case types.USER_LOGGED_IN_SUCCESS:
			return { ...state, loggedUser: payload };
		case types.USER_LOGGED_OUT_SUCCESS:
			return { ...INITIAL_STATE };
		case types.ADD_USER_SUCCESS:
			return { ...state, loggedUser: payload };
		default:
			return state;
	}
};
