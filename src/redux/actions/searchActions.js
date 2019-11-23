import * as types from '../types';

export const getTrandingVideos = () => async dispatch => {
	const videos = [
		{
			id: 11,
			url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
			thumbnail:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnm5J_F7bcAJiIFd4UcmVTUWxjJk2e24EHJRqMQCsegfWqLTQe&s',
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
			thumbnail: 'https://i.ytimg.com/vi/VzfxsPPd1XY/maxresdefault.jpg',
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
			thumbnail:
				'https://www.indiewire.com/wp-content/uploads/2019/04/Tick_205_11118_RT_fnl_rgb-e1554411994805.jpg',
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
			thumbnail:
				'https://vignette.wikia.nocookie.net/injusticegodsamongus/images/5/52/Red_Arrow_4.jpg/revision/latest?cb=20130610053026',
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
			thumbnail:
				'https://img.purch.com/o/aHR0cDovL3d3dy5uZXdzYXJhbWEuY29tL2ltYWdlcy9pLzAwMC8yNjIvNjE4L2kwMi9GbGFzaF8xLmpwZw==',
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
			thumbnail: 'https://images-na.ssl-images-amazon.com/images/I/81D%2BXXEnHBL._SY550_.jpg',
			laughed: false,
			caption: 'No way!',
			user: {
				handle: '@davidrenji',
				img: 'https://pbs.twimg.com/profile_images/1029816770897408000/aUljTnyv.jpg'
			}
		}
	];

	dispatch({ type: types.GET_TRANDING_VIDEOS, payload: videos });
};

export const doSearch = query => async dispatch => {
	const results = [
		{
			id: 1,
			image: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon',
			handle: '@davidrenji',
			fullName: 'Jason xyz',
			followers: '12.2M',
			laughs: '120M',
			views: '200M',
			following: false
		},
		{
			id: 2,
			image: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png',
			handle: '@mar87',
			fullName: 'Mario Bross',
			followers: '2K',
			laughs: '23K',
			views: '27.4K',
			following: false
		},
		{
			id: 3,
			image: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png',
			handle: '@mega63',
			fullName: 'Megaman X',
			followers: '34M',
			laughs: '84.3M',
			views: '3,837M',
			following: true
		},
		{
			id: 4,
			image: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon',
			handle: '@davidrenji',
			fullName: 'Jason xyz',
			followers: '12.2M',
			laughs: '120M',
			views: '200M',
			following: false
		},
		{
			id: 5,
			image: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png',
			handle: '@mar87',
			fullName: 'Mario Bross',
			followers: '2K',
			laughs: '23K',
			views: '27.4K',
			following: false
		},
		{
			id: 6,
			image: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png',
			handle: '@mega63',
			fullName: 'Megaman X',
			followers: '34M',
			laughs: '84.3M',
			views: '3,837M',
			following: true
		},
		{
			id: 7,
			image: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon',
			handle: '@davidrenji',
			fullName: 'Jason xyz',
			followers: '12.2M',
			laughs: '120M',
			views: '200M'
		},
		{
			id: 8,
			image: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png',
			handle: '@mar87',
			fullName: 'Mario Bross',
			followers: '2K',
			laughs: '23K',
			views: '27.4K'
		},
		{
			id: 9,
			image: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png',
			handle: '@mega63',
			fullName: 'Megaman X',
			followers: '34M',
			laughs: '84.3M',
			views: '3,837M'
		}
	];

	dispatch({
		type: types.GET_SEARCH_RESULTS,
		payload: results
	});
};
