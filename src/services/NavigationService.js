import { NavigationActions } from 'react-navigation';

let navigator;

setTopLevelNavigator = navigatorRef => {
	navigator = navigatorRef;
};

navigate = (routeName, params) => {
	navigator.dispatch(
		NavigationActions.navigate({
			routeName,
			params
		})
	);
};

dispatch = action => {
	navigator.dispatch(action);
};

export default {
	navigate,
	dispatch,
	setTopLevelNavigator
};
