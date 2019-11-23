import * as types from '../types';
import apiServices from '../../services/apiServices';
import { globals } from '../../config/constants';
import AlertMessages from '../../components/commons/AlertMessages';

export const getVideos = () => async dispatch => {
	const response = await apiServices.getHomeVideos();

	let videos = getVideosWithUrlField(response.data);

	//console.log('Videos: ', videos);
	if (response.success) dispatch({ type: types.GET_VIDEOS, payload: videos });
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
	//console.log('Video viewed:', response);
	if (response.success) dispatch({ type: types.VIDEO_WAS_VIEWED_SUCCESS, payload: { videoId } });
};

export const getVideoComments = (videoId, userId) => async dispatch => {
	const response = await apiServices.getVideoComments(videoId, userId);
	let comments = response.data;

	if (comments) comments = comments.sort((a, b) => b.created - a.created);

	if (response.success) dispatch({ type: types.GET_VIDEO_COMMENTS, payload: { videoId, comments } });
	return response;
};

export const postVideoComment = (videoId, userId, comment) => async dispatch => {
	const response = await apiServices.postVideoComment(videoId, userId, comment);

	if (response.success) dispatch({ type: types.POST_VIDEO_COMMENT_SUCCESS, payload: response.data });
	else AlertMessages.error(response.message);
};

export const commentLiked = (comment, userId, liked) => async dispatch => {
	const response = await apiServices.commentLiked(comment.id, userId, liked);

	if (response.success)
		dispatch({ type: types.COMMENT_LIKED_SUCCESS, payload: { comment, likes: response.data.total, liked } });
	else if (!response.message.includes('code 400')) {
		AlertMessages.error(response.message);
	}

	return response;
};

//******************************************************************************************* */
//Helper functions

//To build the url of the video and add it to the object
const getVideosWithUrlField = videos => {
	//videos = [videos[1]];
	return videos.map(video => {
		video.url = globals.VIDEOS_SERVER_URL + `videos/${video.user.id}/${video.path}`;
		console.log(video.url);
		return video;
	});
};
