import * as types from '../types';

const INITIAL_STATE = {
	videosInfo: [],
	comments: []
};

let tempComments = [];
export default videoReducer = (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case types.GET_VIDEOS:
			return { ...state, videosInfo: payload };
		case types.VIDEO_LAUGHED_SUCCESS:
			const { videoId, laughs } = payload;
			const videos = [...state.videosInfo];
			const video = videos.find(v => v.id === videoId);
			video.laughs = laughs;
			video.laughed = true;
			return { ...state, videosInfo: videos };
		case types.GET_VIDEO_COMMENTS:
			tempComments = [...state.comments];
			tempComments[payload.videoId] = payload.comments;
			return { ...state, comments: tempComments };
		case types.POST_VIDEO_COMMENT_SUCCESS:
			//Increase the comments count
			const videosTemp = [...state.videosInfo];
			const videoTemp = videosTemp.find(v => v.id === payload.id_video);
			videoTemp.comments++;

			tempComments = [...state.comments];
			tempComments[payload.id_video] = [payload, ...tempComments[payload.id_video]];
			return { ...state, videosInfo: videosTemp, comments: tempComments };
		case types.COMMENT_LIKED_SUCCESS:
			const { comment, likes, liked } = payload;

			tempComments = [...state.comments];
			const tempComment = tempComments[comment.id_video].find(c => c.id === comment.id);

			//const comments = [...state.comments];
			//const comment = comments.find(c => c.id === comment.id);
			tempComment.likes = likes;
			tempComment.already_like = liked;
			return { ...state, comments: tempComments };
		default:
			return state;
	}
};
