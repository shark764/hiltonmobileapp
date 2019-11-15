import httpService from './httpService';

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
			console.log('getcomments', data);
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
		console.log('payload', dataToSend);
		try {
			const endPoint = `video/${videoId}/comment`;
			const { data } = await httpService.post(endPoint, dataToSend);
			console.log('postcomment', data);
			response.data = data.data;
		} catch (error) {
			response.errorMessage = error.message || 'Unable to connect to the api';
		}

		return response;
	}
};
