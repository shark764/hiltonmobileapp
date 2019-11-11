import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import combinedReducers from '../reducers';

export default function configureStore() {
	return createStore(combinedReducers, applyMiddleware(thunk));
}
