import React, { Component } from 'react';
import { View, Dimensions, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import IconFeather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Slider from '@react-native-community/slider';
import { Input, Button } from 'react-native-elements';
import AmazingCropper from 'react-native-amazing-cropper';
import { colors, fonts } from '../../../config/constants';
import Loader from '../../commons/Loader';
import { getShowHideStyle, requestCameraPermission } from '../../../utils/helpers';
import Form from '../../commons/Form';
import DatePicker from '../../commons/DateTimePicker';
import ImagePicker from 'react-native-image-picker';
import AlertMessages from '../../commons/AlertMessages';
import { uploadAvatar } from '../../../redux/actions/userActions';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

class ProfileSettingsScreen extends Form {
	static navigationOptions = () => ({ title: 'Edit Profile' });

	state = {
		data: { full_name: '', bio: '', birth_date: '', goalValue: 2000 },
		loading: true,
		imageToCrop: null
	};

	componentDidMount() {
		const { loggedUser } = this.props;

		if (loggedUser) this.refreshUserStateData(loggedUser);
	}

	componentDidUpdate(prevProps, prevState) {
		const { loggedUser } = this.props;
		if (prevProps.loggedUser !== loggedUser) this.refreshUserStateData(loggedUser);
	}

	refreshUserStateData = user => {
		const data = { ...this.state.data };

		data.full_name = user.full_name;
		data.bio = user.bio;
		data.birth_date = user.birth_date;
		this.setState({ loading: false, data });
	};

	onGoalSlide = val => {
		const data = { ...this.state.data };
		data.goalValue = val;
		this.setState({ data });
	};

	uploadImage = async () => {
		if (await this.requestPhotoGalleryAccess()) {
			const options = {
				title: 'Select Avatar',
				storageOptions: {
					skipBackup: true,
					path: 'images'
				}
			};

			ImagePicker.showImagePicker(options, async response => {
				//console.log('Response = ', response);

				if (response.didCancel) {
					console.log('User cancelled image picker');
				} else if (response.error) {
					console.log('ImagePicker Error: ', response.error);
				} else {
					const imageToCrop = {
						uri: response.uri,
						type: response.type,
						fileName: response.fileName,
						width: response.width,
						height: response.height
					};
					this.setState({ imageToCrop });
				}
			});
		} else {
			AlertMessages.error(
				'\nYou need to give access to the your photos gallery in order to select your profile picture!\n'
			);
		}
	};

	requestPhotoGalleryAccess = async () => {
		if (Platform.OS === 'android') {
			return await requestCameraPermission();
		}

		return true;
	};

	onCroppingCancel = () => {
		this.setState({ imageToCrop: null });
	};

	onCroppingDone = async croppedImageUri => {
		const { loggedUser, uploadAvatar } = this.props;
		const { imageToCrop } = this.state;

		const image = { ...imageToCrop, uri: croppedImageUri };
		this.setState({ imageToCrop: null, loading: true });
		await uploadAvatar(image, loggedUser);
		//this.setState({ loading: false });
		//TODO: delete cropped image
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

	render() {
		const { loggedUser } = this.props;
		const { loading, data, imageToCrop } = this.state;
		//console.log(loggedUser);
		return (
			<SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
				<Loader show={loading} />
				<KeyboardAwareScrollView
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
					enableOnAndroid
					style={[{ flex: 1 }, getShowHideStyle(!loading && !imageToCrop)]}
					contentContainerStyle={{
						width: screenWidth,
						padding: 16,
						alignItems: 'center'
					}}
				>
					<View
						style={[
							{
								width: screenWidth / 3.4,
								height: screenWidth / 3.4,
								borderRadius: screenWidth / 2,
								borderColor: colors.LINES,
								borderWidth: 1,
								marginBottom: 16
							}
						]}
					>
						<Image
							source={{ uri: loggedUser.avatar }}
							style={{
								height: '100%',
								width: '100%',
								borderRadius: screenWidth / 2
							}}
						/>
						<TouchableOpacity onPress={this.uploadImage}>
							<View
								style={{
									width: 40,
									height: 40,
									borderRadius: 39,
									backgroundColor: '#6C56EB',
									borderWidth: 1,
									borderColor: '#FFFFFF',
									justifyContent: 'center',
									alignItems: 'center',
									position: 'absolute',
									right: 0,
									bottom: 0
								}}
							>
								<IconFeather name={'plus'} size={30} color={'#fff'} />
							</View>
						</TouchableOpacity>
					</View>
					<Text style={{ fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 15, color: '#575757' }}>
						Change Profile Picture
					</Text>

					<View style={{ width: '90%', marginTop: 20 }}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 14, color: '#2F2F2F' }}>
								Goal
							</Text>
							<Text style={{ fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 16, color: colors.MAIN }}>
								${data.goalValue.toLocaleString()}
							</Text>
						</View>
						<Slider
							value={data.goalValue}
							onValueChange={this.onGoalSlide}
							minimumValue={1}
							maximumValue={10000}
							minimumTrackTintColor={colors.MAIN}
							maximumTrackTintColor="#DED9FF"
							thumbTintColor={colors.MAIN}
							style={{}}
						/>
					</View>
					<View style={{ width: '100%', marginTop: 20 }}>
						<Input
							//label="Full Name"
							placeholder="Full Name"
							placeholderTextColor="#D9D9D9"
							errorMessage={this.inputErrors['full_name']}
							inputContainerStyle={styles.inputContainer}
							inputStyle={styles.input}
							labelStyle={styles.label}
							ref={input => (this.rawInputs['full_name'] = input)}
							onChangeText={text => this.onInputChange(text, 'full_name')}
							value={data['full_name']}
						/>
					</View>
					<View style={{ width: '100%', paddingLeft: 10, marginTop: 20, marginBottom: 20 }}>
						<DatePicker
							style={styles.datePicker}
							date={data['birth_date']}
							mode="date"
							placeholder="Birthday"
							//label="Birthday"
							format="MM/DD/YYYY"
							showIcon={false}
							errorMessage={this.inputErrors['birth_date']}
							customStyles={styles.datePickerCustom}
							onDateChange={date => this.onInputChange(date, 'birth_date')}
						/>
					</View>
					<View style={{ width: '100%', marginTop: 20 }}>
						<Input
							//label="Bio"
							placeholder="Bio"
							placeholderTextColor="#D9D9D9"
							errorMessage={this.inputErrors['bio']}
							secureTextEntry
							multiline
							maxLength={100}
							inputContainerStyle={styles.inputContainer}
							inputStyle={[styles.input, { height: 80 }]}
							labelStyle={styles.label}
							ref={input => (this.rawInputs['bio'] = input)}
							onChangeText={text => this.onInputChange(text, 'bio')}
							value={data['bio']}
						/>
					</View>
					<Button
						containerStyle={{ width: '100%', marginTop: 20, marginBottom: 40 }}
						buttonStyle={{
							backgroundColor: colors.MAIN,
							padding: 16,
							borderRadius: 6
						}}
						titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: '#fff' }}
						title="Save"
						onPress={this.handleSubmit}
					/>
				</KeyboardAwareScrollView>

				{imageToCrop && (
					<AmazingCropper
						onDone={this.onCroppingDone}
						onCancel={this.onCroppingCancel}
						imageUri={imageToCrop.uri}
						imageWidth={imageToCrop.width}
						imageHeight={imageToCrop.height}
						NOT_SELECTED_AREA_OPACITY={0.3}
						BORDER_WIDTH={20}
					/>
				)}
			</SafeAreaView>
		);
	}
}

const mapStateToProps = ({ user }) => ({ loggedUser: user.loggedUser });

export default connect(mapStateToProps, { uploadAvatar })(ProfileSettingsScreen);

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
