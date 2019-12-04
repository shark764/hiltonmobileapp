import axios from 'axios';
import { globals } from '../config/constants/index.js';

//Setting a base url for all axios requests
axios.defaults.baseURL = globals.API_URL;

//Interceptor on/before Request
axios.interceptors.request.use(req => {
	//console.log(req.headers);
	//console.log('req', req);
	return Promise.resolve(req);
}, null);

//To log success, error of axios after requests is done
axios.interceptors.response.use(
	result => {
		return Promise.resolve(result);
	},
	error => {
		// const expectedError = error.response && (error.response.status >= 400) & (error.response.status < 500);

		//We can have 2 types of errors:
		//-Expected: 404 not found, 400 bad request - CLIENTS ERRRORS
		//      - Display a specific error message
		//-Unexpected:
		//      -Log them
		//      - Display a generic and friendly error message
		//We will handle this in the http interceptor option in our httpService module
		let message = 'An unexpected error ocurred: ';
		const notFound = error.response && error.response.status === 404;
		const badRequest = error.response && error.response.status === 400;

		if (notFound) message = 'Record not found.';

		if (badRequest) message = 'Something is wrong with the data.';

		message += error.message;
		message += error.response ? ' - ' + error.response.data : '';

		//console.log('Axios response', error.response);

		return Promise.reject(error);
	}
);

function setJwt(jwt) {
	axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	patch: axios.patch,
	delete: axios.delete,
	setJwt,
	axios
};
