import * as types from '../types';

export const getVideos = () => async dispatch => {
	//TODO: api callback
	const videos = [
		{
			id: 1,
			url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
			laughed: false,
			caption: 'Game of thrones rocks!',
			user: {
				handle: '@davidrenji',
				img: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon'
			}
		},
		{
			id: 2,
			url: 'http://drryrbqhnl119.cloudfront.net/SampleVideo_1280x720_2mb.mp4',
			laughed: false,
			caption: 'Funny bunny',
			user: {
				handle: '@mar87',
				img: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png'
			}
		},
		{
			id: 3,
			url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
			laughed: false,
			caption: 'My caption video!',
			user: {
				handle: '@mega8',
				img: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png'
			}
		},
		{
			id: 4,
			url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
			laughed: false,
			caption: 'More camption!',
			user: {
				handle: '@davidrenji',
				img: 'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg'
			}
		},
		{
			id: 5,
			url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
			laughed: false,
			caption: 'Woo hoooo!',
			user: {
				handle: '@davidrenji',
				img: 'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg'
			}
		},
		{
			id: 6,
			url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
			laughed: false,
			caption: 'No way!',
			user: {
				handle: '@davidrenji',
				img: 'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg'
			}
		}
	];
	dispatch({
		type: types.GET_VIDEOS,
		payload: videos
	});
};

export const getVideoComments = videoId => async dispatch => {
	//TODO: api callback
	const comments = [
		{
			id: 1,
			comment:
				'Here is where the comment will appear and it can be up to 4 lines long which is about how long this sentence is here',
			user: {
				handle: '@mega87',
				img: 'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg'
			},
			likes: 10
		},
		{
			id: 2,
			comment:
				'Here is where the comment will appear and it can be up to 4 lines long which is about how long this sentence is here 2',
			user: {
				handle: '@marioTux1',
				img: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png'
			},
			likes: 10
		},
		{
			id: 3,
			comment: 'Here is where the',
			user: {
				handle: '@Samu2019',
				img: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png'
			},
			likes: 10
		},
		{
			id: 4,
			comment:
				'Here is where the comment will appear and it can be up to 4 lines long which is about how long this sentence is here 2',
			user: {
				handle: '@mega87',
				img: 'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg'
			},
			likes: 10
		},
		{
			id: 5,
			comment:
				'Here is where the comment will appear and it can be up to 4 lines long which is about how long this sentence is here 2',
			user: {
				handle: '@marioTux1',
				img: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png'
			},
			likes: 10
		},
		{
			id: 6,
			comment:
				'Here is where the comment will appear and it can be up to 4 lines long which is about how long this sentence is here 2',
			user: {
				handle: '@Samu2019',
				img: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png'
			},
			likes: 10
		},
		{
			id: 7,
			comment:
				'Here is where the comment will appear and it can be up to 4 lines long which is about how long this sentence is here 2',
			user: {
				handle: '@mega87',
				img: 'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg'
			},
			likes: 10
		}
	];
	dispatch({
		type: types.GET_VIDEO_COMMENTS,
		payload: comments
	});
};
