import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView } from 'react-native';
import { fonts, colors, globals } from '../../../config/constants';
import { Button } from 'react-native-elements';
import DatePicker from '../../commons/DateTimePicker';
import { Input } from 'react-native-elements';
import { validateEmail } from '../../../utils/helpers';
import { Header } from 'react-navigation-stack';
import ModalPopup from '../../commons/ModalPopup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUser } from '../../../redux/actions/userActions';
import { connect } from 'react-redux';
import { Loader } from '../../commons/Loader';
import AlertMessages from '../../commons/AlertMessages';
import Form from '../../commons/Form';

class EmailRegistrationScreen extends Form {
	static navigationOptions = () => ({ title: 'Sign up with your email' });

	state = {
		data: { email: '', full_name: '', bio: '', username: '', birth_date: '', password: '', confirmPassword: '' },
		showDialog: false,
		dialogTitle: '',
		loading: false
	};

	doSubmit = async () => {
		const user = { ...this.state.data };

		this.setState({ loading: true });
		const result = await this.props.createUser(user);

		//If create user fails, we show an error, if not, the redux action will redirect to home
		if (!result.success) {
			AlertMessages.error(result.message);
			this.setState({ loading: false });
		}
	};

	showModal = option => {
		const dialogTitle = option === 'terms' ? 'Terms of use' : 'Privacy Policy';
		this.setState({ showDialog: true, dialogTitle });
		console.log(option);
	};

	hideModal = () => {
		this.setState({ showDialog: false });
	};

	render() {
		const { data, showDialog, dialogTitle, loading } = this.state;
		const inputErrors = this.inputErrors;

		return (
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				enableOnAndroid
				style={{ flex: 1 }}
				contentContainerStyle={styles.scrollContainer}
				keyboardVerticalOffset={Header.HEIGHT}
				scrollEnabled
			>
				<View style={{ width: '100%', marginTop: 20 }}>
					<Input
						label="Email Address"
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
						onSubmitEditing={e => this.handleInputSubmit(e, 'full_name')}
					/>
				</View>
				<View style={{ width: '100%', marginTop: 20 }}>
					<Input
						label="Full Name"
						placeholder="Full Name"
						placeholderTextColor="#D9D9D9"
						errorMessage={inputErrors['full_name']}
						inputContainerStyle={styles.inputContainer}
						inputStyle={styles.input}
						labelStyle={styles.label}
						ref={input => (this.rawInputs['full_name'] = input)}
						onChangeText={text => this.onInputChange(text, 'full_name')}
						onSubmitEditing={e => this.handleInputSubmit(e, 'username')}
						value={data['full_name']}
					/>
				</View>
				<View style={{ width: '100%', marginTop: 20 }}>
					<View
						style={{
							backgroundColor: colors.MAIN,
							padding: 8,
							paddingHorizontal: 15,
							color: '#fff',
							position: 'absolute',
							top: 36,
							left: 10,
							borderTopLeftRadius: 10,
							borderBottomLeftRadius: 10,
							width: 'auto',
							zIndex: 100
						}}
					>
						<Text
							style={{
								color: '#fff',
								fontFamily: fonts.OPENSANS_BOLD,
								fontSize: 20
							}}
						>
							@
						</Text>
					</View>
					<Input
						label="Username"
						placeholder="Username"
						placeholderTextColor="#D9D9D9"
						autoCapitalize="none"
						errorMessage={inputErrors['username']}
						inputContainerStyle={styles.inputContainer}
						inputStyle={[styles.input, { paddingLeft: 60 }]}
						labelStyle={styles.label}
						onChangeText={text => this.onInputChange(text, 'username')}
						ref={input => (this.rawInputs['username'] = input)}
						value={data['username']}
					/>
				</View>
				<View style={{ width: '100%', paddingLeft: 10, marginTop: 20 }}>
					<DatePicker
						style={styles.datePicker}
						date={data['birth_date']}
						mode="date"
						placeholder="Birthday"
						label="Birthday"
						format="MM/DD/YYYY"
						showIcon={false}
						errorMessage={inputErrors['birth_date']}
						customStyles={styles.datePickerCustom}
						onDateChange={date => this.onInputChange(date, 'birth_date')}
					/>
				</View>
				<View style={{ width: '100%', marginTop: 20 }}>
					<Input
						label="Bio"
						placeholder="Bio"
						placeholderTextColor="#D9D9D9"
						errorMessage={inputErrors['bio']}
						secureTextEntry
						multiline
						maxLength={100}
						inputContainerStyle={styles.inputContainer}
						inputStyle={[styles.input, { height: 80 }]}
						labelStyle={styles.label}
						ref={input => (this.rawInputs['bio'] = input)}
						onChangeText={text => this.onInputChange(text, 'bio')}
						onSubmitEditing={e => this.handleInputSubmit(e, 'password')}
						value={data['bio']}
					/>
				</View>
				<View style={{ width: '100%', marginTop: 20 }}>
					<Input
						label="Password"
						placeholder="Password"
						placeholderTextColor="#D9D9D9"
						errorMessage={inputErrors['password']}
						secureTextEntry
						inputContainerStyle={styles.inputContainer}
						inputStyle={styles.input}
						labelStyle={styles.label}
						ref={input => (this.rawInputs['password'] = input)}
						onChangeText={text => this.onInputChange(text, 'password')}
						onSubmitEditing={e => this.handleInputSubmit(e, 'confirmPassword')}
						value={data['password']}
					/>
				</View>
				<View style={{ width: '100%', marginTop: 20 }}>
					<Input
						label="Confirm Password"
						placeholder="Confirm Password"
						placeholderTextColor="#D9D9D9"
						errorMessage={inputErrors['confirmPassword']}
						secureTextEntry
						inputContainerStyle={styles.inputContainer}
						inputStyle={styles.input}
						labelStyle={styles.label}
						onChangeText={text => this.onInputChange(text, 'confirmPassword')}
						ref={input => (this.rawInputs['confirmPassword'] = input)}
						value={data['confirmPassword']}
					/>
				</View>
				<View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
					<Text style={{ textAlign: 'center' }}>
						<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 12, color: '#555555' }}>
							By signing up, you agree to our{' '}
						</Text>

						<Text
							onPress={() => {
								this.showModal('terms');
							}}
							style={{
								fontFamily: fonts.OPENSANS_REGULAR,
								color: colors.MAIN,
								fontSize: 12
							}}
						>
							Terms of Use
						</Text>
						<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 12, color: '#555555' }}>
							{' '}
							and have read and understood our{' '}
						</Text>

						<Text
							onPress={() => {
								this.showModal('privacy');
							}}
							style={{
								fontFamily: fonts.OPENSANS_REGULAR,
								color: colors.MAIN,
								fontSize: 12
							}}
						>
							Privacy Policy.
						</Text>
					</Text>
				</View>
				{!loading && (
					<Button
						containerStyle={{ width: '100%', marginTop: 20, marginBottom: 40 }}
						buttonStyle={{
							backgroundColor: colors.MAIN,
							padding: 16,
							borderRadius: 6
						}}
						titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: '#fff' }}
						title="Sign Up"
						onPress={this.handleSubmit}
					/>
				)}
				<Loader show={loading} />
				<ModalPopup
					title={dialogTitle}
					confirmBtnText="Got it"
					onConfirmPressed={this.hideModal}
					visible={showDialog}
				>
					<Text>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at accumsan sapien. Aenean
						dictum mauris magna, a accumsan est elementum sed. Sed maximus, magna sit amet cursus
						vestibulum, diam neque interdum sem, nec molestie leo felis pulvinar leo. Quisque tincidunt
						dolor justo, in elementum augue tincidunt et. Morbi vel purus ultrices, convallis lorem
						hendrerit, convallis orci. Aliquam commodo lacus vel nunc vulputate condimentum. Donec vel lorem
						purus. Nullam elementum dolor viverra libero rhoncus cursus. Ut finibus, nibh ut aliquet
						tincidunt, orci magna laoreet dolor, at eleifend purus ante eu ex.{' '}
					</Text>
				</ModalPopup>
			</KeyboardAwareScrollView>
		);
	}
}

const mapstateToProps = null;

export default connect(mapstateToProps, { createUser })(EmailRegistrationScreen);

const styles = {
	scrollContainer: {
		padding: 16,
		width: '100%'
	},
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
	},
	datePicker: { width: '100%', paddingRight: 10, marginBottom: -20 },
	datePickerCustom: {
		label: {
			fontFamily: fonts.OPENSANS_REGULAR,
			fontSize: 14,
			color: '#5F5F5F',
			marginBottom: 15,
			fontWeight: 'normal'
		},
		placeholderText: { color: '#D9D9D9' },
		dateInput: [
			{
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
				color: '#898989',
				alignItems: 'flex-start'
			}
		],
		dateText: { color: '#898989' }
	}
};
