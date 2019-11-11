import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import { fonts, colors } from '../../../config/constants';
import { Button } from 'react-native-elements';

export default class ChangePasswordSettingsScreen extends Component {
	static navigationOptions = () => ({ title: 'Change password' });

	state = {
		settings: {}
	};

	onInputChange = (value, field) => {
		const settings = { ...this.state.settings };
		settings[field] = value;
		this.setState({ settings });
	};

	render() {
		const { settings } = this.state;
		return (
			<View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 30 }}>
				<View style={{ alignItems: 'center', marginBottom: 20 }}>
					<Text
						style={{ fontSize: 16, fontFamily: fonts.OPENSANS_REGULAR, color: '#5F5F5F', marginBottom: 10 }}
					>
						Current password
					</Text>
					<TextInput
						placeholder="*********"
						placeholderTextColor="#898989"
						secureTextEntry
						style={{
							backgroundColor: '#fff',
							color: '#FFF',
							width: '100%',
							height: 45,
							borderWidth: 1,
							borderColor: '#CCCCCC',
							borderRadius: 10,
							paddingVertical: 11,
							paddingHorizontal: 17,
							fontFamily: fonts.OPENSANS_REGULAR,
							fontSize: 14,
							color: '#898989'
						}}
						onChangeText={text => this.onInputChange(text, 'currentPassword')}
						value={settings['pauseAll']}
					/>
				</View>

				<View style={{ alignItems: 'center', marginBottom: 20 }}>
					<Text
						style={{ fontSize: 16, fontFamily: fonts.OPENSANS_REGULAR, color: '#5F5F5F', marginBottom: 10 }}
					>
						New password
					</Text>
					<TextInput
						placeholder="*********"
						placeholderTextColor="#898989"
						secureTextEntry
						style={{
							backgroundColor: '#fff',
							color: '#FFF',
							width: '100%',
							height: 45,
							borderWidth: 1,
							borderColor: '#CCCCCC',
							borderRadius: 10,
							paddingVertical: 11,
							paddingHorizontal: 17,
							fontFamily: fonts.OPENSANS_REGULAR,
							fontSize: 14,
							color: '#898989'
						}}
						onChangeText={text => this.onInputChange(text, 'newPassword')}
						value={settings['pauseAll']}
					/>
				</View>

				<View style={{ alignItems: 'center' }}>
					<Text
						style={{ fontSize: 16, fontFamily: fonts.OPENSANS_REGULAR, color: '#5F5F5F', marginBottom: 10 }}
					>
						Confirm password
					</Text>
					<TextInput
						placeholder="*********"
						placeholderTextColor="#898989"
						secureTextEntry
						style={{
							backgroundColor: '#fff',
							color: '#FFF',
							width: '100%',
							height: 45,
							borderWidth: 1,
							borderColor: '#CCCCCC',
							borderRadius: 10,
							paddingVertical: 11,
							paddingHorizontal: 17,
							fontFamily: fonts.OPENSANS_REGULAR,
							fontSize: 14,
							color: '#898989'
						}}
						onChangeText={text => this.onInputChange(text, 'confirmPassword')}
						value={settings['pauseAll']}
					/>
				</View>
				<View style={{ alignItems: 'center' }}>
					<Button
						style={{}}
						containerStyle={{ width: '100%' }}
						buttonStyle={{ backgroundColor: colors.MAIN, marginTop: 40, padding: 16, borderRadius: 10 }}
						titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: '#FFF' }}
						title="Save"
					/>
				</View>
			</View>
		);
	}
}
