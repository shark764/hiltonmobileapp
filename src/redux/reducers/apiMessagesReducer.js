import * as types from '../types';

const INITIAL_STATE = {
	errorMessage: null,
	successMessage: null
};

export default authReducer = (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case types.API_ERROR:
			return { ...state, errorMessage: payload };
		case types.API_SUCCESS:
			return { ...state, successMessage: payload };
		default:
			return state;
	}
};
