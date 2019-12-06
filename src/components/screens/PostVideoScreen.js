import React, { Component } from 'react';
import {
	Text,
	TextInput,
	Keyboard,
	View,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	PermissionsAndroid,
	Platform,
	TouchableWithoutFeedback,
	SafeAreaView
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container } from 'native-base';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';
import CameraRoll from '@react-native-community/cameraroll';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { colors } from '../../config/constants';
import { postStyle } from '../../assets/styles/postStyle';
import { goToRootRouteFromChild } from '../../utils/helpers';
import { getVideos, postVideoInBackground, postVideo } from '../../redux/actions/videoActions';
const { width } = Dimensions.get('window');

const checkAndroidPermission = async () => {
	try {
		const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
		await PermissionsAndroid.request(permission);
		Promise.resolve();
	} catch (error) {
		Promise.reject(error);
	}
};

const ENDPOINT = 'http://ec2co-ecsel-e7kzz6bjzpwo-1247028944.us-east-2.elb.amazonaws.com/video';

class PostVideoScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			url_video: '',
			duration: 0,
			paused: false,
			boostOption: false,
			saveVideo: false,
			allowComment: true,
			postOnFacebook: false,
			postOnIGstory: false,
			postOnIGpost: false,
			postOnTwitter: false,
			description: '',
			isPostingVideo: false,
			videoComplete: '',
			enableShare: false
		};
	}

	goBack() {
		this.props.navigation.replace('Camera');
	}

	goForward() {
		//this.props.navigation.push('Profile');
		//We past the parent route of current stack and then the root route
		goToRootRouteFromChild('Camera', 'Profile');
	}

	componentDidMount() {
		let url_video = this.props.navigation.getParam('videoToPost', 'empty');

		let duration = this.props.navigation.getParam('duration', 0);
		//console.log(`this.props.navigation.getParam VideoToPost : ${url_video} and duration : ${duration}`)

		this.setState({ url_video, duration, paused: false });
	}

	uploadSegments = async () => {
		const { loggedUser } = this.props;
		let { description, url_video } = this.state;

		//console.log(`video name : ${lastSegment.url}  ===>  ${lastSegment.url.replace("file://", "")}`);

		let options = {
			url: ENDPOINT,
			path: url_video, //(Platform.OS === 'android'?lastSegment.url.replace("file://", ""):lastSegment.url),//joinedSegments
			method: 'POST',
			field: 'video',
			type: 'multipart',
			headers: {
				'content-type': 'multipart/form-data'
			},
			parameters: {
				title: description || 'no title',
				description: description || 'no description',
				duration: `${parseInt(this.state.duration)}`,
				id_user: `${loggedUser.id}`,
				allow_comments: `${this.state.allowComment}`
			}
		};

		if (Platform.OS === 'android') {
			//only android support this optional values
			options.maxRetries = 2;
			options.notification = {
				enabled: true
			};
		}

		//let temp = 'file://'+url_video;
		if (this.state.saveVideo) {
			await CameraRoll.saveToCameraRoll(`file://${url_video}`, 'video');
		}
		console.log(`options : ${JSON.stringify(options)}`);
		await this.props.postVideoInBackground(options);
		/*
			let name = url_video.split("/")
			const data = new FormData();
			data.append('title', description || 'no title');
			data.append('description', description || 'no description');
			data.append('duration', parseInt(this.state.duration));
			data.append('id_user', loggedUser.id); //-------->change the user
			data.append('allow_comments',this.state.allowComment);
			data.append('video', {
				uri: `file://${url_video}`,
				type: 'video/mp4',
				name: name[name.length - 1]
			});

			await this.props.postVideo(data);
	*/
	};

	postVideo = async () => {
		if (Platform.OS === 'android') {
			await checkAndroidPermission();
		}

		this.setState({ isPostingVideo: true });

		console.log('about to save the video....');
		await this.uploadSegments();
		console.log('segment uploaded');

		this.setState({ isPostingVideo: false });
		this.goForward();
	};

	render() {
		const { isPostingVideo } = this.state;
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Container style={{ flex: 1, flexDirection: 'column' }}>
					{
						//********HEADER*********** */
					}
					<View style={postStyle.header}>
						<View style={{ padding: 10 }}>
							<Ionicon name="md-arrow-back" style={postStyle.backIcon} onPress={() => this.goBack()} />
						</View>
						<View style={{ paddingLeft: width * 0.3 }}>
							<Text style={postStyle.title}> New Video </Text>
						</View>
					</View>
					{
						//*****VIDEO POSTING******** */
					}
					<View style={postStyle.postFrame}>
						<View style={postStyle.leftSide}>
							{this.state.url_video ? (
								<Video
									source={{ uri: `file://${this.state.url_video}` }} // Can be a URL or a local file.
									repeat
									resizeMode="cover"
									paused={this.state.paused}
									style={postStyle.rightSide}
								/>
							) : null}
						</View>
						<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
							<View style={postStyle.commentBox}>
								<TextInput
									style={postStyle.textStyle}
									autoCapitalize="sentences"
									multiline={true}
									maxLength={39}
									textAlignVertical="bottom"
									numberOfLines={3}
									placeholder="Write a caption here!...(39 Max)."
									onChangeText={description => this.setState({ description })}
									onEndEditing={this.clearFocus}
								></TextInput>
							</View>
						</TouchableWithoutFeedback>
					</View>
					{
						//********BOOSTING********* */
					}
					<View style={postStyle.boostRow}>
						<View style={{ flexDirection: 'row' }}>
							<FeatherIcon name="zap" size={15} color={colors.MAIN} style={{ paddingTop: 2 }} />
							<Text style={postStyle.boostText}>Boost Video</Text>
						</View>
						<View>
							<ToggleSwitch
								isOn={this.state.boostOption}
								onColor="#4CD964"
								offColor={colors.SOFT_GRAY}
								onToggle={() => this.setState({ boostOption: !this.state.boostOption })}
							/>
						</View>
					</View>
					{
						//******************SETTINGS************************
					}
					<View style={postStyle.subtitleRow}>
						<Text style={postStyle.subtitleText}>Settings</Text>
					</View>
					<View style={postStyle.normalRow}>
						<View>
							<Text style={postStyle.itemText}>Save Video</Text>
						</View>
						<View>
							<ToggleSwitch
								isOn={this.state.saveVideo}
								onColor="#4CD964"
								offColor={colors.SOFT_GRAY}
								onToggle={() => this.setState({ saveVideo: !this.state.saveVideo })}
							/>
						</View>
					</View>
					<View style={postStyle.endRow}>
						<View>
							<Text style={postStyle.itemText}>Allow Commenting</Text>
						</View>
						<View>
							<ToggleSwitch
								isOn={this.state.allowComment}
								onColor="#4CD964"
								offColor={colors.SOFT_GRAY}
								onToggle={() => this.setState({ allowComment: !this.state.allowComment })}
							/>
						</View>
					</View>
					{//************SHARE********** */
					this.state.enableShare && (
						<View>
							<View style={postStyle.subtitleRow}>
								<Text style={postStyle.subtitleText}>Share</Text>
							</View>
							<ScrollView>
								<View style={postStyle.normalRow}>
									<View>
										<Text style={postStyle.itemText}>Facebook</Text>
									</View>
									<View>
										<ToggleSwitch
											isOn={this.state.postOnFacebook}
											onColor="#4CD964"
											offColor={colors.SOFT_GRAY}
											onToggle={() =>
												this.setState({ postOnFacebook: !this.state.postOnFacebook })
											}
										/>
									</View>
								</View>
								<View style={postStyle.normalRow}>
									<View>
										<Text style={postStyle.itemText}>Instagram Story</Text>
									</View>
									<View>
										<ToggleSwitch
											isOn={this.state.postOnIGstory}
											onColor="#4CD964"
											offColor={colors.SOFT_GRAY}
											onToggle={() => this.setState({ postOnIGstory: !this.state.postOnIGstory })}
										/>
									</View>
								</View>
								<View style={postStyle.normalRow}>
									<View>
										<Text style={postStyle.itemText}>Instagram Post</Text>
									</View>
									<View>
										<ToggleSwitch
											isOn={this.state.postOnIGpost}
											onColor="#4CD964"
											offColor={colors.SOFT_GRAY}
											onToggle={() => this.setState({ postOnIGpost: !this.state.postOnIGpost })}
										/>
									</View>
								</View>
								<View style={postStyle.normalRow}>
									<View>
										<Text style={postStyle.itemText}>Twitter</Text>
									</View>
									<View>
										<ToggleSwitch
											isOn={this.state.postOnTwitter}
											onColor="#4CD964"
											offColor={colors.SOFT_GRAY}
											onToggle={() => this.setState({ postOnTwitter: !this.state.postOnTwitter })}
										/>
									</View>
								</View>
							</ScrollView>
						</View>
					)}

					<View style={postStyle.postButtonContainer}>
						<TouchableOpacity style={postStyle.postButton} onPress={this.postVideo}>
							<View style={{ alignSelf: 'center', paddingTop: 4 }}>
								<Text style={postStyle.postTextButton}>Post Video</Text>
							</View>
						</TouchableOpacity>
					</View>
				</Container>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = ({ user }) => ({ loggedUser: user.loggedUser });

export default connect(mapStateToProps, { getVideos, postVideoInBackground, postVideo })(PostVideoScreen);
