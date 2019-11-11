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

export default class App extends Component {
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
				<Provider store={configureStore()}>
					<StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
					<AppContainer />
				</Provider>
			</View>
		);
	}
}

const ProfileStack = createStackNavigator(
	{
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
		}
	},
	{
		initialRouteName: 'Profile',
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
		PostVideo: {
			screen: PostVideoScreen
		},
		Profile: {
			screen: ProfileScreen,
			navigationOptions: { header: null }
		},
	},
	{
		initialRouteName: 'Camera',
		headerMode: 'none'
	}
);

//To Hide the bottom tab navigation in all screens except the first one
ProfileStack.navigationOptions = ({ navigation }) => {
	if (navigation.state.index > 0) return { tabBarVisible: false };
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
			screen: SearchScreen,
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => <FeatherIcon name="search" size={25} color={tintColor} />
			}
		},
		Camera: {
			screen: CameraStack,
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => <FeatherIcon name="plus-circle" size={25} color={tintColor} />,
				tabBarVisible: false
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
