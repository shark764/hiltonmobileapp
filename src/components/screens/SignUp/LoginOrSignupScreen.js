import React, { Component } from 'react';
import { Text, View, SafeAreaView, TextInput, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { fonts, colors } from '../../../config/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EmailRegistrationScreen from './EmailRegistrationScreen';
import LoginScreen from './LoginScreen';
import { getShowHideStyle } from '../../../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');

class LoginOrSignupScreen extends Component {
	fromScreen = '';
	state = { currentAction: 'login' };

	componentDidMount() {
		const { navigation } = this.props;
		this.fromScreen = navigation ? navigation.getParam('fromScreen') : '';
		this.redirectToLoggedScreen();
		this.setState({});
	}

	componentDidUpdate(prevProps, prevState) {
		const { navigation } = this.props;
		this.fromScreen = navigation ? navigation.getParam('fromScreen') : '';
		this.redirectToLoggedScreen();
	}

	redirectToLoggedScreen = () => {
		const { loggedUser } = this.props;
		if (loggedUser && this.fromScreen) this.props.navigation.replace(this.fromScreen);
	};

	goToEmailRegistration = () => {
		this.props.navigation.push('EmailRegistration', { fromScreen: this.fromScreen });
	};

	goToPhoneRegistration = () => {
		this.props.navigation.push('PhoneRegistration', { fromScreen: this.fromScreen });
	};

	showLogin = () => this.setState({ currentAction: 'login' });

	showRegister = () => this.setState({ currentAction: 'register' });

	render() {
		const { onCloseModal } = this.props;
		const { currentAction } = this.state;
		const marginTop = this.props.navigation ? 40 : 0;
		return (
			<View
				style={{
					alignItems: 'center',
					flex: 1,
					backgroundColor: '#fff',
					marginTop
				}}
			>
				<View style={{ alignItems: 'center', flex: 1, margin: 16 }}>
					<Text
						style={{
							fontFamily: fonts.OPENSANS_SEMI_BOLD,
							fontSize: 18,
							color: '#2F2F2F',
							marginTop: 20,
							marginBottom: 10
						}}
					>
						You need an account to continue
					</Text>

					<Text
						style={{
							fontFamily: fonts.OPENSANS_REGULAR,
							fontSize: 14,
							color: '#2F2F2F'
						}}
					>
						{currentAction === 'register'
							? 'Sign up with your email or phone'
							: 'Login with your email or phone'}
					</Text>
					<View style={{ flexDirection: 'row', marginTop: 10 }}>
						<TouchableOpacity
							style={{
								borderWidth: 1,
								borderColor: colors.MAIN,
								backgroundColor: colors.MAIN,
								borderTopLeftRadius: 5,
								borderBottomLeftRadius: 5
							}}
						>
							<Text
								style={{
									color: '#FFF',
									paddingVertical: 10,
									paddingHorizontal: 40,
									fontFamily: fonts.OPENSANS_REGULAR,
									fontSize: 13
								}}
							>
								Email
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								borderWidth: 1,
								borderColor: colors.MAIN,
								backgroundColor: '#FFF',
								borderTopRightRadius: 5,
								borderBottomRightRadius: 5
							}}
						>
							<Text
								style={{
									color: colors.MAIN,
									paddingVertical: 10,
									paddingHorizontal: 40,
									fontFamily: fonts.OPENSANS_REGULAR,
									fontSize: 13
								}}
							>
								Phone
							</Text>
						</TouchableOpacity>
					</View>
					<View style={getShowHideStyle(currentAction !== 'login')}>
						<EmailRegistrationScreen onCloseModal={onCloseModal} />
					</View>
					<View style={getShowHideStyle(currentAction === 'login')}>
						<LoginScreen onCloseModal={onCloseModal} />
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
					<Text
						style={[
							getShowHideStyle(currentAction !== 'login'),
							{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 15, color: '#2F2F2F' }
						]}
					>
						Already have an account?{' '}
						<Text
							onPress={this.showLogin}
							style={{ color: colors.MAIN, fontFamily: fonts.OPENSANS_BOLD, fontSize: 15 }}
						>
							Login
						</Text>
					</Text>
					<Text
						style={[
							getShowHideStyle(currentAction === 'login'),
							{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 15, color: '#2F2F2F' }
						]}
					>
						Don't have an account?{' '}
						<Text
							onPress={this.showRegister}
							style={{ color: colors.MAIN, fontFamily: fonts.OPENSANS_BOLD, fontSize: 15 }}
						>
							Register
						</Text>
					</Text>
				</View>
			</View>
		);
	}
}

const mapStateToProps = ({ auth }) => ({ loggedUser: auth.loggedUser });

export default connect(mapStateToProps, null)(LoginOrSignupScreen);
