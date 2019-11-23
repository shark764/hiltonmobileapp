import React from 'react';
import { Text, View } from 'react-native';
import { Input, Button, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fonts, colors } from '../../../config/constants';
import { Loader } from '../../commons/Loader';
import { userLoginWithEmail } from '../../../redux/actions/authActions';
import Form from '../../commons/Form';
import AlertMessages from '../../commons/AlertMessages';

class LoginScreen extends Form {
	state = {
		data: { email: '', password: '' },
		rememberMe: false,
		loading: false
	};

	fromScreen = '';

	componentDidMount() {
		this.fromScreen = this.props.navigation.getParam('fromScreen');
		console.log(this.fromScreen);
	}

	onRemberMePress = () => this.setState({ rememberMe: !this.state.rememberMe });

	doSubmit = async () => {
		const user = { ...this.state.data };
		const { rememberMe } = this.state;
		this.setState({ loading: true });
		const result = await this.props.userLoginWithEmail(user, rememberMe, this.fromScreen);

		//If login fails, we show an error, if not, the redux action will redirect to home
		if (!result.success) {
			AlertMessages.error(result.message, undefined, undefined, 50);
			this.setState({ loading: false });
		}
	};

	render() {
		const { data, loading, rememberMe } = this.state;
		const inputErrors = this.inputErrors;

		return (
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				style={{ flex: 1, margin: 16, marginTop: 20 }}
				contentContainerStyle={{ alignItems: 'center' }}
			>
				<Text style={{ fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 17, color: '#2F2F2F' }}>
					Log in to GrapeVine
				</Text>
				<View style={{ width: '100%', marginTop: 35 }}>
					<Input
						placeholder="Email Address"
						placeholderTextColor="#D9D9D9"
						autoCapitalize="none"
						keyboardType="email-address"
						errorMessage={inputErrors['email']}
						inputContainerStyle={styles.inputContainer}
						inputStyle={styles.input}
						labelStyle={styles.label}
						value={data['email']}
						onChangeText={text => this.onInputChange(text, 'email')}
						onSubmitEditing={e => this.handleInputSubmit(e, 'password')}
					/>
				</View>
				<View style={{ width: '100%', marginTop: 20 }}>
					<Input
						placeholder="Password"
						placeholderTextColor="#D9D9D9"
						errorMessage={inputErrors['password']}
						inputContainerStyle={styles.inputContainer}
						inputStyle={styles.input}
						labelStyle={styles.label}
						secureTextEntry
						onChangeText={text => this.onInputChange(text, 'password')}
						onSubmitEditing={e => this.handleInputSubmit(e, 'submit')}
						ref={input => (this.rawInputs['password'] = input)}
						value={data['password']}
					/>
				</View>
				<View style={{ width: '100%', marginTop: 10 }}>
					<CheckBox
						title="Remember me?"
						checkedColor={colors.MAIN}
						checked={rememberMe}
						onPress={this.onRemberMePress}
						containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
						textStyle={{ fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 14, color: '#606060' }}
					/>
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 13, color: colors.MAIN }}>
						Forgot your password?
					</Text>
				</View>
				<View style={{ width: '100%', marginTop: 20 }}>
					{!loading && (
						<Button
							containerStyle={{ width: '100%', marginTop: 20 }}
							buttonStyle={{
								backgroundColor: colors.MAIN,
								padding: 16,
								borderRadius: 6
							}}
							titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: '#fff' }}
							title="Login"
							onPress={this.handleSubmit}
						/>
					)}
					<Loader show={loading} />
				</View>
				<View style={{ width: '100%', marginVertical: 40, justifyContent: 'center', alignItems: 'center' }}>
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
						width: '100%',
						marginTop: 10,
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<View
						style={{
							width: 36,
							height: 36,
							borderRadius: 18,
							backgroundColor: colors.MAIN,
							marginRight: 20,
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Icon color="#fff" size={20} name="phone" />
					</View>
					<Text style={{ fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 15, color: '#606060' }}>
						Login via phone number
					</Text>
				</View>
			</KeyboardAwareScrollView>
		);
	}
}

export default connect(null, { userLoginWithEmail })(LoginScreen);

const styles = {
	input: {
		backgroundColor: '#fff',
		width: '100%',
		height: 45,
		borderWidth: 1,
		borderColor: '#dddddd',
		borderRadius: 10,
		paddingVertical: 11,
		paddingHorizontal: 17,
		fontFamily: fonts.OPENSANS_REGULAR,
		fontSize: 14,
		color: '#898989'
	},
	inputContainer: {
		borderBottomWidth: 0
	},
	label: {
		fontFamily: fonts.OPENSANS_REGULAR,
		fontSize: 14,
		color: '#5F5F5F',
		marginBottom: 15,
		fontWeight: 'normal'
	}
};
