import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import combinedReducers from '../reducers';

export default function configureStore() {
	//To add redux inspect funcionality
	//Install this app to debug redux https://github.com/jhen0409/react-native-debugger
	const middleware = [thunk];
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	return createStore(combinedReducers, composeEnhancers(applyMiddleware(...middleware)));
}
