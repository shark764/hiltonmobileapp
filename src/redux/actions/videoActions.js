import * as types from '../types';
import apiServices from '../../services/apiServices';
import { globals } from '../../config/constants';
import httpService from '../../services/httpService';
import AlertMessages from '../../components/commons/AlertMessages';

export const getVideos = () => async dispatch => {
	// const videos = [
	//   {
	//     id: 1,
	//     url:
	//       'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
	//     laughed: false,
	//     caption: 'Game of thrones rocks!',
	//     user: {
	//       handle: '@davidrenji',
	//       img:
	//         'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon',
	//     },
	//   },
	//   {
	//     id: 2,
	//     url: 'http://drryrbqhnl119.cloudfront.net/SampleVideo_1280x720_2mb.mp4',
	//     laughed: false,
	//     caption: 'Funny bunny',
	//     user: {
	//       handle: '@mar87',
	//       img: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png',
	//     },
	//   },
	//   {
	//     id: 3,
	//     url:
	//       'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
	//     laughed: false,
	//     caption: 'My caption video!',
	//     user: {
	//       handle: '@mega8',
	//       img:
	//         'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png',
	//     },
	//   },
	//   {
	//     id: 4,
	//     url:
	//       'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
	//     laughed: false,
	//     caption: 'More camption!',
	//     user: {
	//       handle: '@davidrenji',
	//       img:
	//         'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg',
	//     },
	//   },
	//   {
	//     id: 5,
	//     url:
	//       'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
	//     laughed: false,
	//     caption: 'Woo hoooo!',
	//     user: {
	//       handle: '@davidrenji',
	//       img:
	//         'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg',
	//     },
	//   },
	//   {
	//     id: 6,
	//     url:
	//       'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
	//     laughed: false,
	//     caption: 'No way!',
	//     user: {
	//       handle: '@davidrenji',
	//       img:
	//         'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg',
	//     },
	//   },
	// ];

	const response = await apiServices.getHomeVideos();

	let videos = getVideosWithUrlField(response.data);
	//TODO: REMOVE THIS
	if (videos) videos = videos.reverse();

	//console.log('Videos: ', videos);
	if (response.success) dispatch({ type: types.GET_VIDEOS, payload: videos });
};

export const getVideoComments = (videoId, userId) => async dispatch => {
	const response = await apiServices.getVideoComments(videoId, userId);
	let comments = response.data;

	if (comments) comments = comments.sort((a, b) => b.created - a.created);

	if (response.success) dispatch({ type: types.GET_VIDEO_COMMENTS, payload: comments });
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

export const postVideoComment = (videoId, userId, comment) => async dispatch => {
	const response = await apiServices.postVideoComment(videoId, userId, comment);

	if (response.success) dispatch({ type: types.POST_VIDEO_COMMENT_SUCCESS, payload: response.data });
	else AlertMessages.error(response.message);
};

export const commentLiked = (commentId, userId, liked) => async dispatch => {
	const response = await apiServices.commentLiked(commentId, userId, liked);
	console.log('like ' + liked.toString(), response);
	if (response.success)
		dispatch({ type: types.COMMENT_LIKED_SUCCESS, payload: { commentId, likes: response.data.total, liked } });
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
		return video;
	});
};
