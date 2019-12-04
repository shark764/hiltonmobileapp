import { combineReducers } from 'redux';
import videoReducer from './videoReducer';
import directMessagesReducer from './directMessagesReducer';
import userReducer from './userReducer';
import settingsReducer from './settingsReducer';
import searchReducer from './searchReducer';

export default combineReducers({
	videos: videoReducer,
	directMessages: directMessagesReducer,
	user: userReducer,
	settings: settingsReducer,
	search: searchReducer
});
