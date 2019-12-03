import * as types from '../types';
import apiServices from '../../services/apiServices';
import { globals } from '../../config/constants';
import AlertMessages from '../../components/commons/AlertMessages';
import { getVideosWithUrlField } from '../../utils/helpers';

export const getVideos = (userId, page = 1) => async dispatch => {
	const response = await apiServices.getHomeVideos(userId, undefined, undefined, page);

	const videos = getVideosWithUrlField(response.data);
	const merge = page > 1;
	if (response.success) dispatch({ type: types.GET_VIDEOS, payload: { videos, merge } });
};

export const getTrendingVideos = userId => async dispatch => {
	const response = await apiServices.getHomeVideos(userId);

	let videos = getVideosWithUrlField(response.data);

	dispatch({ type: types.GET_TRANDING_VIDEOS, payload: videos });
};

export const getVideosByUser = (userId, loggedUserId) => async dispatch => {
	const response = await apiServices.getVideosByUser(userId, loggedUserId);

	let videos = getVideosWithUrlField(response.data);

	dispatch({ type: types.GET_USER_VIDEOS, payload: videos });
};

export const videoLaughed = (videoId, userId) => async dispatch => {
	const response = await apiServices.videoLaughed(videoId, userId);

	if (response.success)
		dispatch({ type: types.VIDEO_LAUGHED_SUCCESS, payload: { videoId, laughs: response.data.total } });
	else if (!response.message.includes('code 400')) {
		AlertMessages.error(response.message);
	}

	return response;
};

export const videoWasViewed = (videoId, userId) => async dispatch => {
	const response = await apiServices.videoWasViewed(videoId, userId);

	if (response.success) {
		console.log(response);
		dispatch({ type: types.VIDEO_WAS_VIEWED_SUCCESS, payload: { videoId, data: response.data } });
		return response.data;
	}
};

export const setSingleVideoToPlay = video => async dispatch => {
	dispatch({ type: types.SET_SINGLE_VIDEO_TO_PLAY, payload: video });
};

export const getVideoComments = (videoId, userId, page = 1) => async dispatch => {
	const response = await apiServices.getVideoComments(videoId, userId, page);
	let comments = response.data;

	if (comments) comments = comments.sort((a, b) => b.created - a.created);

	const merge = page > 1;

	if (response.success) dispatch({ type: types.GET_VIDEO_COMMENTS, payload: { videoId, comments, merge } });
	return response;
};

export const postVideoComment = (videoId, userId, comment) => async dispatch => {
	const response = await apiServices.postVideoComment(videoId, userId, comment);

	if (response.success) dispatch({ type: types.POST_VIDEO_COMMENT_SUCCESS, payload: response.data });
	else AlertMessages.error(response.message);
};

export const commentLiked = (comment, userId, liked) => async dispatch => {
	const response = await apiServices.commentLiked(comment.id, userId, liked);

	if (response.success) {
		const likes = response.data.total;
		dispatch({ type: types.COMMENT_LIKED_SUCCESS, payload: { comment, likes, liked } });
	} else if (!response.message.includes('code 400')) {
		AlertMessages.error(response.message);
	}

	return response;
};

export const postVideoInBackground = videoToUpload => async dispatch => {
	const response = await apiServices.postVideoInBackground(videoToUpload);

	if (response.success) dispatch({ type: types.POST_VIDEO_SUCCESS, payload: response.data });
	else AlertMessages.error(response.message);
};

export const postVideo = videoToUpload => async dispatch => {
	const response = await apiServices.postVideo(videoToUpload);

	if (response.success) dispatch({ type: types.POST_VIDEO_SUCCESS, payload: response.data });
	else AlertMessages.error(response.message);
};

//TODO:
//Temporal function
// const addThumbnail = videos =>
// 	videos.map(video => {
// 		video.thumbnail =
// 			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnm5J_F7bcAJiIFd4UcmVTUWxjJk2e24EHJRqMQCsegfWqLTQe&s';
// 		return video;
// 	});
