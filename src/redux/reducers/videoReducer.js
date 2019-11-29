import * as types from '../types';

const INITIAL_STATE = {
	homeVideos: [],
	trendingVideos: [],
	userVideos: [],
	comments: []
};

let tempComments = [];
let tempVideos = [];
let tempVideo = {};

export default videoReducer = (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case types.GET_VIDEOS:
			return { ...state, homeVideos: payload };
		case types.GET_TRANDING_VIDEOS:
			return { ...state, trendingVideos: payload };
		case types.GET_USER_VIDEOS:
			return { ...state, userVideos: payload };
		case types.VIDEO_LAUGHED_SUCCESS:
			const { laughs } = payload;
			//TODO: modify other video arrays
			tempVideos = [...state.homeVideos];
			tempVideo = tempVideos.find(v => v.id === payload.videoId);
			tempVideo.laughs = laughs;
			tempVideo.already_like = true;
			return { ...state, homeVideos: tempVideos };

		case types.VIDEO_WAS_VIEWED_SUCCESS:
			const returnObj = { ...state };

			tempVideos = [...state.homeVideos];
			tempVideo = tempVideos.find(v => v.id === payload.videoId);
			tempVideo.views = payload.data.views;
			tempVideo.rewatches = payload.data.rewatches;
			returnObj.homeVideos = [...tempVideos];

			if (state.trendingVideos.length > 0) {
				tempVideos = [...state.trendingVideos];
				tempVideo = tempVideos.find(v => v.id === payload.videoId);
				tempVideo.views = payload.data.views;
				tempVideo.rewatches = payload.data.rewatches;
				returnObj.trendingVideos = [...tempVideos];
			}

			if (state.userVideos.length > 0) {
				tempVideos = [...state.userVideos];
				tempVideo = tempVideos.find(v => v.id === payload.videoId);
				tempVideo.views = payload.data.views;
				tempVideo.rewatches = payload.data.rewatches;
				returnObj.userVideos = [...tempVideos];
			}

			return returnObj;
		case types.GET_VIDEO_COMMENTS:
			tempComments = [...state.comments];
			tempComments[payload.videoId] = payload.comments;
			return { ...state, comments: tempComments };
		case types.POST_VIDEO_COMMENT_SUCCESS:
			//TODO: modify other video arrays
			//Increase the comments count
			const videosTemp = [...state.homeVideos];
			const videoTemp = videosTemp.find(v => v.id === payload.id_video);
			videoTemp.comments++;

			tempComments = [...state.comments];
			tempComments[payload.id_video] = [payload, ...tempComments[payload.id_video]];
			return { ...state, homeVideos: videosTemp, comments: tempComments };
		case types.COMMENT_LIKED_SUCCESS:
			const { comment, likes, liked } = payload;

			tempComments = [...state.comments];
			const tempComment = tempComments[comment.id_video].find(c => c.id === comment.id);

			tempComment.likes = likes;
			tempComment.already_like = liked;
			return { ...state, comments: tempComments };
		case types.POST_VIDEO:
			//const videosTemp = [...state.homeVideos];
			//const videoTemp = videosTemp.find(v => v.id === payload.id_video);
			//videoTemp.comments++;

			//tempComments = [...state.comments];
			//tempComments[payload.id_video] = [payload, ...tempComments[payload.id_video]];
			//return { ...state, homeVideos: videosTemp, comments: tempComments };
			return { ...state };
		default:
			return state;
	}
};
