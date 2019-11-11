import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { fonts } from '../../../config/constants';

export default class SecuritySettingsScreen extends Component {
	static navigationOptions = () => ({ title: 'Security' });

	goToSettingItem = item => {
		this.props.navigation.push(item);
	};

	render() {
		return (
			<View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 20 }}>
				<TouchableOpacity
					onPress={() => {
						this.goToSettingItem('ChangePasswordSettings');
					}}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
						<Icon name="key" size={25} color={'#5F5F5F'} />
						<Text
							style={{
								fontSize: 16,
								fontFamily: fonts.OPENSANS_SEMI_BOLD,
								color: '#5F5F5F',
								marginLeft: 10
							}}
						>
							Password
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						this.goToSettingItem('ChangeEmailSettings');
					}}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
						<Icon name="mail" size={25} color={'#5F5F5F'} />
						<Text
							style={{
								fontSize: 16,
								fontFamily: fonts.OPENSANS_SEMI_BOLD,
								color: '#5F5F5F',
								marginLeft: 10
							}}
						>
							Email
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}
