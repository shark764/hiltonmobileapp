import * as types from '../types';
import apiServices from '../../services/apiServices';

export const doSearch = searchQuery => async dispatch => {
	const response = await apiServices.searchProfiles(searchQuery);
	const profiles = response.data.data.data;

	if (response.success) dispatch({ type: types.GET_SEARCH_RESULTS, payload: profiles });

	return response;
};
