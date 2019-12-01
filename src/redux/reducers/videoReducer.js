import * as types from '../types';

const INITIAL_STATE = {
	homeVideos: [],
	trendingVideos: [],
	userVideos: [],
	singleVideoToPlay: {},
	videoComments: {}
};

let tempVideos = [];
let tempVideo = {};
let tempComments = {};
let tempComment = {};
let propsToUpdate = {};

let returnObj = {};

export default videoReducer = (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case types.GET_VIDEOS:
			//If it's the first time or a refresh, we load the videos
			//if user reached end of videos, then new videos were requested and will be append to the current videos
			if (payload.merge) return { ...state, homeVideos: [...state.homeVideos, ...payload.videos] };
			else return { ...state, homeVideos: payload.videos };
		case types.GET_TRANDING_VIDEOS:
			//TODO: Do the refresh and get new videos
			return { ...state, trendingVideos: payload };
		case types.GET_USER_VIDEOS:
			return { ...state, userVideos: payload };
		case types.SET_SINGLE_VIDEO_TO_PLAY:
			return { ...state, singleVideoToPlay: payload };
		case types.VIDEO_LAUGHED_SUCCESS:
			returnObj = { ...state };
			propsToUpdate = { laughs: payload.laughs, already_like: true };

			//HOME VIDEOS
			returnObj.homeVideos = state.homeVideos.map(v => {
				return v.id === payload.videoId ? { ...v, ...propsToUpdate } : v;
			});

			//TRENDING VIDEOS
			returnObj.trendingVideos = state.trendingVideos.map(v => {
				return v.id === payload.videoId ? { ...v, ...propsToUpdate } : v;
			});

			//GENERAL PROFILE VIDEOS
			// returnObj.userVideos = state.userVideos.map(v => {
			// 	return v.id === payload.videoId ? { ...v, ...propsToUpdate } : v;
			// });

			//SINGLE VIDEO TO PLAY
			returnObj.singleVideoToPlay = { ...state.singleVideoToPlay, ...propsToUpdate };

			return returnObj;

		case types.VIDEO_WAS_VIEWED_SUCCESS:
			returnObj = { ...state };
			propsToUpdate = { views: payload.data.views, rewatches: payload.data.rewatches };

			//HOME VIDEOS
			//To modify the properties and create a new reference to make redux update the properties
			returnObj.homeVideos = state.homeVideos.map(v => {
				return v.id === payload.videoId ? { ...v, ...propsToUpdate } : v;
			});

			//TRENDING VIDEOS
			returnObj.trendingVideos = state.trendingVideos.map(v => {
				return v.id === payload.videoId ? { ...v, ...propsToUpdate } : v;
			});

			//GENERAL PROFILE VIDEOS (another way to do it without map)
			if (state.userVideos.length > 0) {
				tempVideos = [...state.userVideos];
				tempVideo = tempVideos.find(v => v.id === payload.videoId);
				tempVideo.views = payload.data.views;
				tempVideo.rewatches = payload.data.rewatches;
				returnObj.userVideos = [...tempVideos];
			}

			return returnObj;
		case types.GET_VIDEO_COMMENTS:
			returnObj = { ...state };
			tempComments = { ...state.videoComments };
			if (payload.merge) tempComments[payload.videoId] = [...tempComments[payload.videoId], ...payload.comments];
			else tempComments[payload.videoId] = [...payload.comments];

			returnObj.videoComments = { ...tempComments };

			return returnObj;
		case types.POST_VIDEO_COMMENT_SUCCESS:
			returnObj = { ...state };
			//HOME VIDEOS
			//To modify the properties and create a new reference to make redux update the properties
			returnObj.homeVideos = state.homeVideos.map(v => {
				return v.id === payload.id_video ? { ...v, comments: v.comments + 1 } : v;
			});

			//TRENDING VIDEOS
			returnObj.trendingVideos = state.trendingVideos.map(v => {
				return v.id === payload.id_video ? { ...v, comments: v.comments + 1 } : v;
			});

			//GENERAL PROFILE
			returnObj.userVideos = state.userVideos.map(v => {
				return v.id === payload.id_video ? { ...v, comments: v.comments + 1 } : v;
			});

			//Getting the comments of the video
			tempComments = state.videoComments[payload.id_video];
			//Inserting the new comment at the top by creating a new reference
			tempComments = [payload, ...tempComments];
			//Assigning to the return object the comments
			returnObj.videoComments[payload.id_video] = tempComments;

			return returnObj;
		case types.COMMENT_LIKED_SUCCESS:
			returnObj = { ...state };
			//Getting the comments of the video
			tempComments = state.videoComments[payload.comment.id_video];
			//To modify the properties and create a new reference to make redux update the properties
			tempComments = tempComments.map(c => {
				return c.id === payload.comment.id ? { ...c, likes: payload.likes, already_like: payload.liked } : c;
			});
			//assigning to the return object the modified comments object
			returnObj.videoComments[payload.comment.id_video] = tempComments;

			return returnObj;
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
