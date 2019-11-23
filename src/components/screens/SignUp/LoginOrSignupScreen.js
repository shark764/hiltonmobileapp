import React, { Component } from 'react';
import { Text, View, SafeAreaView, TextInput, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { fonts, colors } from '../../../config/constants';
import IconFeather from 'react-native-vector-icons/Feather';
import LineSeparator from '../../commons/LineSeparator';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

class LoginOrSignupScreen extends Component {
	fromScreen = '';
	state = { fromScreen: '' };

	componentDidMount() {
		this.fromScreen = this.props.navigation.getParam('fromScreen');
		console.log('1. did mount', this.fromScreen);
		this.redirectToLoggedScreen();
	}

	componentDidUpdate(prevProps, prevState) {
		this.fromScreen = this.props.navigation.getParam('fromScreen');
		console.log('1. did update', this.fromScreen);
		this.redirectToLoggedScreen();
	}

	redirectToLoggedScreen = () => {
		console.log(this.fromScreen);
		const { loggedUser } = this.props;
		if (loggedUser && this.fromScreen) this.props.navigation.replace(this.fromScreen);
	};

	goToEmailRegistration = () => {
		this.props.navigation.push('EmailRegistration', { fromScreen: this.fromScreen });
	};

	goToPhoneRegistration = () => {
		this.props.navigation.push('PhoneRegistration', { fromScreen: this.fromScreen });
	};

	goToLogin = () => {
		this.props.navigation.push('Login', { fromScreen: this.fromScreen });
	};

	render() {
		return (
			<SafeAreaView style={{ alignItems: 'center', flex: 1 }}>
				<View style={{ alignItems: 'center', flex: 1, margin: 16, justifyContent: 'space-evenly' }}>
					<Text
						style={{
							fontFamily: fonts.OPENSANS_SEMI_BOLD,
							fontSize: 16,
							color: '#2F2F2F',
							marginVertical: 40
						}}
					>
						You need an account to continue
					</Text>
					<View
						style={{
							flex: 1,
							width: '100%',
							alignItems: 'center',
							justifyContent: 'space-evenly'
						}}
					>
						<TouchableOpacity onPress={this.goToEmailRegistration}>
							<View
								style={{
									height: 88,
									width: 88,
									borderRadius: 44,
									backgroundColor: colors.MAIN,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<IconFeather name={'mail'} size={45} color={'#fff'} />
							</View>
						</TouchableOpacity>
						<Text
							style={{
								fontFamily: fonts.OPENSANS_REGULAR,
								fontSize: 14,
								color: '#2F2F2F',
								marginTop: 10
							}}
						>
							Sign up with your email
						</Text>

						<Text
							style={{
								fontFamily: fonts.OPENSANS_REGULAR,
								fontSize: 12,
								color: '#555555',
								marginTop: 10
							}}
						>
							Note: You will receive an email with a code to confirm your registration.
						</Text>
					</View>

					<View
						style={{
							width: screenWidth,
							marginVertical: 40,
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<LineSeparator style={{ marginVertical: 0 }} />

						<Text
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								marginTop: -8,
								marginLeft: -15,
								backgroundColor: '#fff',
								width: 'auto',
								paddingHorizontal: 10,
								alignSelf: 'center',
								fontFamily: fonts.OPENSANS_REGULAR,
								fontSize: 12,
								color: '#A2A2A2'
							}}
						>
							OR
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							width: '100%',
							alignItems: 'center',
							justifyContent: 'space-evenly'
						}}
					>
						<TouchableOpacity>
							<View
								style={{
									height: 88,
									width: 88,
									borderRadius: 44,
									backgroundColor: colors.MAIN,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<IconFeather name={'phone'} size={45} color={'#fff'} />
							</View>
						</TouchableOpacity>
						<Text
							style={{
								fontFamily: fonts.OPENSANS_REGULAR,
								fontSize: 14,
								color: '#2F2F2F',
								marginTop: 10
							}}
						>
							Sign up with your phone
						</Text>

						<Text
							style={{
								fontFamily: fonts.OPENSANS_REGULAR,
								fontSize: 12,
								color: '#555555',
								marginTop: 10
							}}
						>
							Note: You will receive a sms with a code to confirm your registration.
						</Text>
					</View>
				</View>
				<View
					style={{
						width: '100%',
						backgroundColor: '#F0F0F0',
						marginTop: 20,
						padding: 30,
						alignItems: 'center'
					}}
				>
					<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 15, color: '#2F2F2F' }}>
						Already have an account?{' '}
						<Text
							onPress={this.goToLogin}
							style={{ color: colors.MAIN, fontFamily: fonts.OPENSANS_BOLD, fontSize: 15 }}
						>
							Login
						</Text>
					</Text>
				</View>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = ({ auth }) => ({ loggedUser: auth.loggedUser });

export default connect(mapStateToProps, null)(LoginOrSignupScreen);
