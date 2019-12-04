/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

YellowBox.ignoreWarnings(['`-[RCTRootView cancelTouches]` is deprecated and will be deleted soon.']);
//console.disableYellowBox = true;
console.log('hey', __DEV__);
if (__DEV__) {
	import('./src/utils/ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

AppRegistry.registerComponent(appName, () => App);
