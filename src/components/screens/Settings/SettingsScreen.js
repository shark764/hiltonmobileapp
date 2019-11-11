import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StackActions, NavigationActions } from 'react-navigation';
import { settingsStyles as styles } from '../../../assets/styles';
import LineSeparator from '../../commons/LineSeparator';

export default class SettingsScreen extends Component {
	static navigationOptions = () => ({ title: 'Settings' });

	goToSettingItem = item => {
		this.props.navigation.push(item);
	};

	onLogOut = () => {
		//Reset current Stack
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Profile' })]
		});

		this.props.navigation.dispatch(resetAction);
		//Go to parent screen - Home
		this.props.navigation.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'Home' });
	};

	render() {
		return (
			<View style={styles.mainContainer}>
				<TouchableOpacity
					onPress={() => {
						this.goToSettingItem('NotificationsSettings');
					}}
				>
					<View style={styles.itemContainer}>
						<Icon name="bell" size={25} color={'#757575'} />
						<Text style={styles.label}>Notifications</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						this.goToSettingItem('SecuritySettings');
					}}
				>
					<View style={styles.itemContainer}>
						<Icon name="lock" size={25} color={'#757575'} />
						<Text style={styles.label}>Security</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						this.goToSettingItem('ProfileSettings');
					}}
				>
					<View style={styles.itemContainer}>
						<Icon name="user" size={25} color={'#757575'} />
						<Text style={styles.label}>Profile</Text>
					</View>
				</TouchableOpacity>
				<LineSeparator />
				<TouchableOpacity onPress={this.onLogOut}>
					<View style={styles.itemContainer}>
						<Icon name="log-out" size={25} color={'#6C5CE7'} />
						<Text style={[styles.label, styles.logoutLabel]}>Log out</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}
