import * as types from '../types';

const INITIAL_STATE = {
	trendingVideos: [],
	searchResults: []
};

export default searchReducer = (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case types.GET_TRANDING_VIDEOS:
			return { ...state, trendingVideos: payload };
		case types.GET_SEARCH_RESULTS:
			return { ...state, searchResults: payload };
		default:
			return state;
	}
};
