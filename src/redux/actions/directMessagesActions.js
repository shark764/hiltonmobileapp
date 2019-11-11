import * as types from '../types';

export const getDashboardMessages = userId => async dispatch => {
	//TODO: api callback
	const dashboardMessages = [
		{
			id: 1,
			user: {
				id: 1,
				handle: '@davidrenji',
				fullName: 'Jason Lopez',
				img: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon'
			},
			lastMessageSent: 'Hey man, remember to send me the video!!!.'
		},
		{
			id: 2,
			user: {
				id: 2,
				handle: '@mario87',
				fullName: 'Mario Bross',
				img: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png'
			},
			lastMessageSent: "Bro, you gotta check this out, it's amazing. We gotta do it."
		},
		{
			id: 3,
			user: {
				id: 3,
				handle: '@megaX9',
				fullName: 'Megaman Xtream',
				img: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png'
			},
			lastMessageSent: 'Hey man, remember to send me the video.'
		},
		{
			id: 4,
			user: {
				id: 1,
				handle: '@davidrenji',
				fullName: 'Jason Lopez',
				img: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon'
			},
			lastMessageSent: 'Hey man, remember to send me the video.'
		},
		{
			id: 5,
			user: {
				id: 2,
				handle: '@mario87',
				fullName: 'Mario Bross',
				img: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png'
			},
			lastMessageSent: "Bro, you gotta check this out, it's amazing. We gotta do it."
		},
		{
			id: 6,
			user: {
				id: 3,
				handle: '@megaX9',
				fullName: 'Megaman Xtream',
				img: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png'
			},
			lastMessageSent: 'Hey man, remember to send me the video.'
		},
		{
			id: 7,
			user: {
				id: 1,
				handle: '@davidrenji',
				fullName: 'Jason Lopez',
				img: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon'
			},
			lastMessageSent: 'Hey man, remember to send me the video.'
		},
		{
			id: 8,
			user: {
				id: 2,
				handle: '@mario87',
				fullName: 'Mario Bross',
				img: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png'
			},
			lastMessageSent: "Bro, you gotta check this out, it's amazing. We gotta do it."
		},
		{
			id: 9,
			user: {
				id: 3,
				handle: '@megaX9',
				fullName: 'Megaman Xtream',
				img: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png'
			},
			lastMessageSent: 'Hey man, remember to send me the video.'
		},
		{
			id: 10,
			user: {
				id: 1,
				handle: '@davidrenji',
				fullName: 'Jason Lopez',
				img: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon'
			},
			lastMessageSent: 'Hey man, remember to send me the video.'
		},
		{
			id: 11,
			user: {
				id: 2,
				handle: '@mario87',
				fullName: 'Mario Bross',
				img: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png'
			},
			lastMessageSent: "Bro, you gotta check this out, it's amazing. We gotta do it."
		},
		{
			id: 12,
			user: {
				id: 3,
				handle: '@megaX9',
				fullName: 'Megaman Xtream',
				img: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png'
			},
			lastMessageSent: 'Hey man, remember to send me the video.'
		},
		{
			id: 13,
			user: {
				id: 1,
				handle: '@davidrenji',
				fullName: 'Jason Lopez',
				img: 'https://secure.gravatar.com/avatar/cf36a722597adb2e6d3b3c199bf7a51b?s=46&d=identicon'
			},
			lastMessageSent: 'Hey man, remember to send me the video.'
		},
		{
			id: 14,
			user: {
				id: 2,
				handle: '@mario87',
				fullName: 'Mario Bross',
				img: 'https://mario.nintendo.com/assets/img/home/intro/mario-pose2.png'
			},
			lastMessageSent: "Bro, you gotta check this out, it's amazing. We gotta do it."
		},
		{
			id: 15,
			user: {
				id: 3,
				handle: '@megaX9',
				fullName: 'Megaman Xtream',
				img: 'http://www.sweatpantsgaming.com/wp-content/uploads/2019/01/Samus-Super-Smash-Bros-Ultimate.png'
			},
			lastMessageSent: 'Hey man, remember to send me the video.'
		}
	];
	dispatch({
		type: types.GET_DIRECT_MESSAGES_DASHBOARD,
		payload: dashboardMessages
	});
};

export const getMessages = (currentUser, otherUser) => async dispatch => {
	//TODO: api callback
	const messages = [
		{
			id: 1,
			message: '1. Hey man, remember to send me the video.',
			user: otherUser,
			me: false
		},
		{
			id: 2,
			message: "Bro, you gotta check this out, it's amazing. We gotta do it.",
			user: currentUser,
			me: true
		},
		{
			id: 3,
			message: 'Hey man, remember to send me the video.',
			user: otherUser,
			me: false
		},
		{
			id: 4,
			message: 'Hey man, remember to send me the video.',
			user: otherUser,
			me: false
		},
		{
			id: 5,
			message: "Bro, you gotta check this out, it's amazing. We gotta do it.",
			user: currentUser,
			me: true
		},
		{
			id: 6,
			message: 'Hey man, remember to send me the video.',
			user: otherUser,
			me: false
		},
		{
			id: 7,
			message: 'Hey man, remember to send me the video.',
			user: otherUser,
			me: false
		},
		{
			id: 8,
			message: "Bro, you gotta check this out, it's amazing. We gotta do it.",
			user: currentUser,
			me: true
		},
		{
			id: 9,
			message: '9. Hey man, remember to send me the video.',
			user: otherUser,
			me: false
		}
	];
	dispatch({
		type: types.GET_DIRECT_MESSAGES,
		payload: messages
	});
};
