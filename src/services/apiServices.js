import httpService from './httpService';

const DEFAULT_RESPONSE = { data: null, success: false, message: '' };

export default apiServices = {
	async getHomeVideos(status = 'published', videosPerPage = 30) {
		const response = { ...DEFAULT_RESPONSE };

		try {
			const endPoint = `videos/${status}/${videosPerPage}`;
			const { data } = await httpService.get(endPoint);

			response.data = data.data;
			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async getVideoComments(videoId, userId) {
		const response = { ...DEFAULT_RESPONSE };

		try {
			let endPoint;
			if (userId) endPoint = `video/${videoId}/comments?id_user=${userId}`;
			else endPoint = `video/${videoId}/comments`;

			const { data } = await httpService.get(endPoint);
			response.data = data.data;
			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async postVideoComment(videoId, userId, comment) {
		const response = { ...DEFAULT_RESPONSE };
		const dataToSend = {
			data: {
				id_video: videoId,
				id_user: userId,
				comment
			}
		};

		try {
			const endPoint = `comments`;

			const { data } = await httpService.post(endPoint, dataToSend);
			console.log('post comment data', data);
			response.data = data.data;
			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async videoLaughed(videoId, userId) {
		const response = { ...DEFAULT_RESPONSE };
		const dataToSend = {
			data: {
				id_user: userId
			}
		};

		try {
			const endPoint = `video/${videoId}/like`;
			const { data } = await httpService.post(endPoint, dataToSend);

			response.data = data.data;
			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async commentLiked(commentId, userId, liked) {
		const response = { ...DEFAULT_RESPONSE };
		const dataToSend = {
			data: {
				id_user: userId
			}
		};

		try {
			const endPoint = `comments/${commentId}/like`;
			console.log(endPoint, dataToSend);
			let res;
			if (liked) res = await httpService.post(endPoint, dataToSend);
			else res = await httpService.delete(endPoint, { data: dataToSend });
			console.log('like on api ' + liked.toString(), res);
			const { data } = res;
			response.data = data.data;
			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async createUser(user) {
		const response = { ...DEFAULT_RESPONSE };
		delete user.confirmPassword;

		try {
			const endPoint = `user`;
			const dataToSend = {
				data: user
			};

			const { data } = await httpService.post(endPoint, dataToSend);
			response.data = data.data;
			response.success = true;
			response.message = 'Welcome to Grape, have fun!';
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async loginUserWithEmail({ email, password }) {
		const response = { ...DEFAULT_RESPONSE };

		try {
			const endPoint = `users/login`;
			const dataToSend = {
				data: {
					email,
					password
				}
			};

			const { data } = await httpService.post(endPoint, dataToSend);
			console.log('api response', data);

			response.data = data;
			response.success = true;
			response.message = 'Welcome to Grape, have fun!';
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
			if (error.message.indexOf('code 400') !== -1) response.message = 'Invalid email or password';
		}

		return response;
	}
};
