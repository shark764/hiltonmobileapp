import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from './src/redux/stores/store';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import HomeScreen from './src/components/screens/HomeScreen';
import CommentsScreen from './src/components/partials/Comments';
import SearchScreen from './src/components/screens/SearchScreen';
import CameraScreen from './src/components/screens/CameraScreen';
import BoostingScreen from './src/components/screens/BoostingScreen';
import ProfileScreen from './src/components/screens/ProfileScreen';
import DirectMessageScreen from './src/components/screens/DirectMessageScreen';
import DirectMessageDashboardScreen from './src/components/screens/DirectMessageDashboardScreen';
import SettingsScreen from './src/components/screens/Settings/SettingsScreen';
import NotificationsSettingScreen from './src/components/screens/Settings/NotificationsSettingsScreen';
import SecuritySettingsScreen from './src/components/screens/Settings/SecuritySettingsScreen';
import ProfileSettingsScreen from './src/components/screens/Settings/ProfileSettingsScreen';
import ChangePasswordSettingsScreen from './src/components/screens/Settings/ChangePasswordSettingsScreen';
import ChangeEmailSettingsScreen from './src/components/screens/Settings/ChangeEmailSettingsScreen';
import PostVideoScreen from './src/components/screens/PostVideoScreen';
import { navigationStyles } from './src/assets/styles';
import { colors } from './src/config/constants';
import SingleVideoScreen from './src/components/screens/SingleVideoScreen';
import LoginOrSignupScreen from './src/components/screens/SignUp/LoginOrSignupScreen';
import EmailRegistrationScreen from './src/components/screens/SignUp/EmailRegistrationScreen';
import CameraRollView from './src/components/partials/CameraRollView';
import LoginScreen from './src/components/screens/SignUp/LoginScreen';
import LocalStorage from './src/services/LocalStorage';
import appJson from './app.json';
import NavigationService from './src/services/NavigationService';
import GeneralProfile from './src/components/screens/GeneralProfile';

export default class App extends Component {
	componentDidMount() {
		LocalStorage.setAppName(appJson.name);
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
				<Provider store={configureStore()}>
					<StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
					<AppContainer
						ref={navigatorRef => {
							NavigationService.setTopLevelNavigator(navigatorRef);
						}}
					/>
				</Provider>
			</View>
		);
	}
}

const ProfileStack = createStackNavigator(
	{
		LoginOrSignup: {
			screen: LoginOrSignupScreen,
			navigationOptions: { header: null }
		},
		EmailRegistration: {
			screen: EmailRegistrationScreen
		},
		Login: {
			screen: LoginScreen
		},
		Profile: {
			screen: ProfileScreen,
			navigationOptions: { header: null }
		},
		DirectMessageDashboard: {
			screen: DirectMessageDashboardScreen
		},
		DirectMessages: {
			screen: DirectMessageScreen
		},
		Settings: {
			screen: SettingsScreen
		},
		NotificationsSettings: {
			screen: NotificationsSettingScreen
		},
		SecuritySettings: {
			screen: SecuritySettingsScreen
		},
		ProfileSettings: {
			screen: ProfileSettingsScreen
		},
		ChangePasswordSettings: {
			screen: ChangePasswordSettingsScreen
		},
		ChangeEmailSettings: {
			screen: ChangeEmailSettingsScreen
		},
		SingleVideoPlayer: {
			screen: SingleVideoScreen
		}
	},
	{
		initialRouteName: 'Profile',
		defaultNavigationOptions: {
			headerTitleStyle: navigationStyles.header
		}
	}
);

const SearchStack = createStackNavigator(
	{
		Search: {
			screen: SearchScreen,
			navigationOptions: { header: null }
		},
		SingleVideoPlayer: {
			screen: SingleVideoScreen,
			navigationOptions: { header: null }
		},
		GeneralProfile: {
			screen: GeneralProfile
		}
	},
	{
		initialRouteName: 'Search',
		defaultNavigationOptions: {
			headerTitleStyle: navigationStyles.header
		}
	}
);

const CameraStack = createStackNavigator(
	{
		Camera: {
			screen: CameraScreen
		},
		CameraRoll: {
			screen: CameraRollView
		},
		PostVideo: {
			screen: PostVideoScreen
		}
	},
	{
		initialRouteName: 'Camera',
		defaultNavigationOptions: {
			headerTitleStyle: navigationStyles.header
		},
		headerMode: 'none'
	}
);

//To Hide the bottom tab navigation in all screens except
//the first one (LoginOrSignup) and the second one (Profile)
ProfileStack.navigationOptions = ({ navigation }) => {
	const { routeName } = navigation.state.routes[navigation.state.index];
	const screensWithBottomBar = ['LoginOrSignup', 'EmailRegistration', 'Login', 'Profile'];
	if (!screensWithBottomBar.includes(routeName)) return { tabBarVisible: false, headerMode: 'none' };
	return { tabBarVisible: true };
};

//To Hide the bottom tab navigation in all screens except the first one
SearchStack.navigationOptions = ({ navigation }) => {
	//console.log(navigation);
	const { routeName } = navigation.state.routes[navigation.state.index];
	const screensWithHiddenBottomBar = ['SingleVideoPlayer'];

	if (screensWithHiddenBottomBar.includes(routeName)) return { tabBarVisible: false, headerMode: 'none' };
	return { tabBarVisible: true };
};

CameraStack.navigationOptions = ({ navigation }) => {
	const { routeName } = navigation.state.routes[navigation.state.index];

	const screensWithHiddenBottomBar = ['Camera', 'CameraRoll', 'PostVideo'];
	if (screensWithHiddenBottomBar.includes(routeName)) return { tabBarVisible: false, headerMode: 'none' };
	return { tabBarVisible: true };
};

const bottomTabNavigator = createBottomTabNavigator(
	{
		Home: {
			screen: HomeScreen,
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => <FeatherIcon name="home" size={25} color={tintColor} />
			}
		},
		Search: {
			screen: SearchStack,
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => <FeatherIcon name="search" size={25} color={tintColor} />
			}
		},
		Camera: {
			screen: CameraStack,
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => <FeatherIcon name="plus-circle" size={25} color={tintColor} />
				//tabBarVisible: false
			}
		},
		Boost: {
			screen: BoostingScreen,
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => <FeatherIcon name="zap" size={25} color={tintColor} />
			}
		},
		Profile: {
			screen: ProfileStack,
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => <FeatherIcon name="user" size={25} color={tintColor} />
			}
		}
	},
	{
		initialRouteName: 'Home',
		tabBarOptions: {
			activeTintColor: colors.MAIN,
			showLabel: false,
			style: navigationStyles.tabBar
		}
	}
);

const AppContainer = createAppContainer(bottomTabNavigator);
