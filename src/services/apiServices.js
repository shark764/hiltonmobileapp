import httpService from './httpService';
import Upload from 'react-native-background-upload';
import AlertMessages from '../components/commons/AlertMessages';
import { globals } from '../config/constants';

const DEFAULT_RESPONSE = { data: null, success: false, message: '' };

export default apiServices = {
	async getHomeVideos(
		userId = null,
		status = 'published',
		videosPerPage = globals.VIDEOS_TO_FETCH_PER_PAGE,
		page = 1
	) {
		const response = { ...DEFAULT_RESPONSE };

		try {
			let endPoint = `videos/${status}/${videosPerPage}?page=${page}`;
			if (userId) endPoint += `&id_user=${userId}`;

			const { data } = await httpService.get(endPoint);

			response.data = data.data;
			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async getVideosByUser(userId, loggedUserId = null, status = 'published', videosPerPage = 30) {
		const response = { ...DEFAULT_RESPONSE };

		try {
			let endPoint = `user/${userId}/videos`;
			if (loggedUserId) endPoint += `?id_user=${loggedUserId}`;

			const { data } = await httpService.get(endPoint);

			response.data = data.data;
			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async videoWasViewed(videoId, userId) {
		const response = { ...DEFAULT_RESPONSE };
		const dataToSend = {
			data: {
				id_user: userId
			}
		};
		try {
			const endPoint = `video/${videoId}/view`;
			const { data } = await httpService.post(endPoint, dataToSend);

			response.data = data.data;
			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async getVideoComments(videoId, userId, page = 1) {
		const response = { ...DEFAULT_RESPONSE };
		console.log('Calling comments api for video ', videoId);
		try {
			let endPoint = `video/${videoId}/comments?page=${page}`;
			if (userId) endPoint += `&id_user=${userId}`;

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

			let res;
			if (liked) res = await httpService.post(endPoint, dataToSend);
			else res = await httpService.delete(endPoint, { data: dataToSend });

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

			response.data = data;
			response.success = true;
			response.message = 'Welcome to Grape, have fun!';
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
			if (error.message.indexOf('code 400') !== -1) response.message = 'Invalid email or password';
		}

		return response;
	},
	async postVideo(dataToSend) {
		const response = { ...DEFAULT_RESPONSE };
		try {
			const endPoint = `video`;
			console.log('Uploading video...');
			const { data } = await httpService.post(endPoint, dataToSend);
			console.log('Video was uploaded...', data);
			response.data = data;
			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	},
	async postVideoInBackground(dataToSend) {
		const response = { ...DEFAULT_RESPONSE };

		Upload.startUpload(dataToSend)
			.then(uploadId => {
				console.log('Upload started');
				Upload.addListener('progress', uploadId, data => {
					console.log(`Progress: ${data.progress}%`);
				});
				Upload.addListener('error', uploadId, data => {
					console.log(`Error: ${data.error} % ${JSON.stringify(data)}`);
				});
				Upload.addListener('cancelled', uploadId, data => {
					console.log(`Cancelled!`);
				});
				Upload.addListener('completed', uploadId, data => {
					// data includes responseCode: number and responseBody: Object
					console.log(`responseCode : ${data.responseCode}  and   responseBody : ${data.responseBody}`);
					console.log('Completed!');
					response.data = data.responseBody;
					response.responseCode = data.responseCode;
					response.success = true;
					AlertMessages.success('Video was uploaded successfully');
				});
				console.log('End of "then" of upload video');
				response.success = true;
			})
			.catch(err => {
				console.log('Upload error!', err);
				response.message = error.message || 'Unable to connect to the api';
			});
		return response;
	},
	async searchProfiles(searchQuery) {
		const response = { ...DEFAULT_RESPONSE };
		try {
			//If query search is not blank
			if (searchQuery) {
				const endPoint = `profiles?username=${searchQuery}`;
				const { data } = await httpService.get(endPoint);
				response.data = data;
			} else response.data = { data: { data: [] } };

			response.success = true;
		} catch (error) {
			response.message = error.message || 'Unable to connect to the api';
		}

		return response;
	}
};
