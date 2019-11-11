import { combineReducers } from 'redux';
import videoReducer from './videoReducer';
import directMessagesReducer from './directMessagesReducer';
import authReducer from './authReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
	videos: videoReducer,
	directMessages: directMessagesReducer,
	auth: authReducer,
	settings: settingsReducer
});
