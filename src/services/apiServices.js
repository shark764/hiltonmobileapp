import httpService from './httpService';
import LocalStorage from './LocalStorage';

export default apiServices = {
	async getHomeVideos(status = 'published', videosPerPage = 30) {
		const response = { data: null, errorMessage: '' };

		try {
			const endPoint = `videos/${status}/${videosPerPage}`;
			const { data } = await httpService.get(endPoint);

			response.data = data.data;
		} catch (error) {
			response.errorMessage = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async getVideoComments(videoId) {
		const response = { data: null, errorMessage: '' };

		try {
			const endPoint = `video/${videoId}/comments`;
			const { data } = await httpService.get(endPoint);
			response.data = data.data;
		} catch (error) {
			response.errorMessage = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async postVideoComment(videoId, userId, comment) {
		const response = { data: null, errorMessage: '' };
		const dataToSend = {
			data: {
				id_video: videoId,
				id_user: userId,
				comment
			}
		};
		try {
			const endPoint = `video/${videoId}/comment`;
			const { data } = await httpService.post(endPoint, dataToSend);
			response.data = data.data;
		} catch (error) {
			response.errorMessage = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async createUser(user) {
		const response = { data: null, success: false, message: '' };
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
		const response = { data: null, success: false, message: '' };

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

			await LocalStorage.setValue('token', data.token);
			//TODO: save to local storage the logged user

			response.data = data.data;
			response.success = true;
			response.message = 'Welcome to Grape, have fun!';
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	}
};
