import * as types from '../types';

const INITIAL_STATE = {
	dashboard: [],
	messages: []
};

export default directMessagesReducer = (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case types.GET_DIRECT_MESSAGES_DASHBOARD:
			return { ...state, dashboard: payload };
		case types.GET_DIRECT_MESSAGES:
			return { ...state, messages: payload };
		default:
			return state;
	}
};
