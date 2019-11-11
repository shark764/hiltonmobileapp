import * as types from '../types';

const INITIAL_STATE = {
	videosInfo: [],
	comments: []
};

export default videoReducer = (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case types.GET_VIDEOS:
			return { ...state, videosInfo: payload };
		case types.GET_VIDEO_COMMENTS:
			return { ...state, comments: payload };
		default:
			return state;
	}
};
