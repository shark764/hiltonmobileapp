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
		case types.POST_VIDEO_COMMENT_SUCCESS:
			//Increase the comments count
			const videosTemp = [...state.videosInfo];
			const videoTemp = videosTemp.find(v => v.id === payload.id_video);
			videoTemp.comments++;
			return { ...state, videosInfo: videosTemp, comments: [payload, ...state.comments] };
		case types.VIDEO_LAUGHED_SUCCESS:
			console.log('payload', payload);
			const { videoId, laughs } = payload;
			const videos = [...state.videosInfo];
			const video = videos.find(v => v.id === videoId);
			video.laughs = laughs;
			video.laughed = true;
			return { ...state, videosInfo: videos };
		case types.COMMENT_LIKED_SUCCESS:
			const { commentId, likes, liked } = payload;
			const comments = [...state.comments];
			const comment = comments.find(c => c.id === commentId);
			comment.likes = likes;
			comment.already_like = liked;
			return { ...state, comments };
		default:
			return state;
	}
};
