import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { fonts, colors } from '../../../config/constants';
import { getShowHideStyle, validateEmail } from '../../../utils/helpers';
import { ErrorMessage } from '../../commons/ErrorMessage';
import alerts from '../../commons/AlertMessages';

export default class ChangeEmailSettingsScreen extends Component {
	static navigationOptions = () => ({ title: 'Change Email' });

	state = {
		inputs: {
			token: '',
			email: ''
		},
		errorMessage: '',
		emailAlreadySent: false,
		validated: false
	};

	onInputChange = (value, field) => {
		const inputs = { ...this.state.inputs };
		inputs[field] = value;
		this.setState({ inputs });
	};

	sendEmail = () => {
		this.setState({ emailAlreadySent: true });
	};

	validateCode = () => {
		this.setState({ errorMessage: '' });
		const validationCode = '123';
		const { token: userValidationCode } = this.state.inputs;
		if (validationCode === userValidationCode) {
			this.setState({ validated: true });
		} else {
			const errorMessage = 'Invalid code, please try again';
			this.setState({ errorMessage });
		}
	};

	submitEmail = () => {
		const { email } = this.state.inputs;
		if (!validateEmail(email)) {
			this.setState({ errorMessage: 'Invalid email' });
			return;
		}
		this.props.navigation.replace('SecuritySettings');
		alerts.success(`Email successfully changed to ${email}`);
	};

	render() {
		const { inputs, emailAlreadySent, validated, errorMessage } = this.state;
		return (
			<View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 30 }}>
				<View style={getShowHideStyle(!validated)}>
					<View>
						<Text
							style={{
								fontSize: 16,
								fontFamily: fonts.OPENSANS_SEMI_BOLD,
								color: '#2F2F2F',
								marginBottom: 20
							}}
						>
							Email Verification
						</Text>
						<Text style={{ fontSize: 16, fontFamily: fonts.OPENSANS_REGULAR, color: '#5F5F5F' }}>
							We will send you a verification code to
						</Text>
						<Text style={{ fontSize: 16, fontFamily: fonts.OPENSANS_SEMI_BOLD, color: '#5F5F5F' }}>
							youremail@gmail.com
						</Text>
						<Text style={{ fontSize: 16, fontFamily: fonts.OPENSANS_REGULAR, color: '#5F5F5F' }}>
							Then enter the code to change your password.
						</Text>
						<Button
							containerStyle={{ width: '100%' }}
							buttonStyle={{
								backgroundColor: '#ffffff',
								borderColor: colors.MAIN,
								borderWidth: 2,
								marginTop: 60,
								marginBottom: 30,
								padding: 16,
								borderRadius: 6
							}}
							titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: colors.MAIN }}
							title={emailAlreadySent ? 'Resend Email' : 'Send Email'}
							onPress={this.sendEmail}
						/>
					</View>

					<View style={[{}, getShowHideStyle(emailAlreadySent)]}>
						<TextInput
							placeholder="Enter the code"
							placeholderTextColor="#D9D9D9"
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
							onChangeText={text => this.onInputChange(text, 'token')}
							value={inputs['token']}
						/>

						<Button
							containerStyle={{ width: '100%' }}
							buttonStyle={{
								backgroundColor: '#ffffff',
								borderColor: colors.MAIN,
								borderWidth: 2,
								marginVertical: 30,
								padding: 16,
								borderRadius: 6
							}}
							titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: colors.MAIN }}
							title="Validate"
							onPress={this.validateCode}
						/>
					</View>
				</View>
				<View style={getShowHideStyle(validated)}>
					<Text style={{ fontSize: 16, fontFamily: fonts.OPENSANS_REGULAR, color: '#5F5F5F' }}>
						Enter your new email:
					</Text>
					<TextInput
						placeholder="myEmail@email.com"
						placeholderTextColor="#D9D9D9"
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
							color: '#898989',
							marginTop: 20
						}}
						onChangeText={text => this.onInputChange(text, 'email')}
						value={inputs['email']}
					/>
					<Button
						containerStyle={{ width: '100%' }}
						buttonStyle={{
							backgroundColor: '#ffffff',
							borderColor: colors.MAIN,
							borderWidth: 2,
							marginVertical: 20,
							padding: 16,
							borderRadius: 6
						}}
						titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: colors.MAIN }}
						title="Change"
						onPress={this.submitEmail}
					/>
				</View>

				<ErrorMessage>{errorMessage}</ErrorMessage>
			</View>
		);
	}
}
