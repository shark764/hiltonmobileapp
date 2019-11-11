import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class ProfileSettingsScreen extends Component {
	static navigationOptions = () => ({ title: 'Profile' });

	render() {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text> ProfileSettingsScreen </Text>
			</View>
		);
	}
}
