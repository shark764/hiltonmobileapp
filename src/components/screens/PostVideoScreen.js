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
import Ionicon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import RNVideoEditor from 'react-native-video-editor';
import {  colors } from '../../config/constants';
import { postStyle } from '../../assets/styles/postStyle';
import { goToRootRouteFromChild } from '../../utils/helpers';
import { getVideos,postVideoInBackground } from '../../redux/actions/videoActions';
const {  width } = Dimensions.get('window');

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
			paused: false,
			boostOption: false,
			saveVideo: false,
			allowComment: false,
			postOnFacebook: false,
			postOnIGstory: false,
			postOnIGpost: false,
			postOnTwitter: false,
			description: '',
			isPostingVideo: false,
			videoComplete:''
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

	async componentDidMount() {
		let videoSegment = await AsyncStorage.getItem('videoToPost');
		videoSegment = JSON.parse(videoSegment);
		let lastSegment = videoSegment[videoSegment.length - 1];
		this.setState({ url_video: lastSegment.url, paused: false });
		console.log(this.state.url_video);
	}

	async uploadSegments() {
		const { loggedUser } = this.props;
		let videoSegment = await AsyncStorage.getItem('videoToPost');
		videoSegment = JSON.parse(videoSegment);
		let lastSegment = videoSegment[videoSegment.length - 1];
		//let video_name = lastSegment.url.split('/');
		let { description } = this.state;

		//console.log(`video name : ${lastSegment.url}  ===>  ${lastSegment.url.replace("file://", "")}`);

		let options = {
			url: ENDPOINT,
			path: '',//(Platform.OS === 'android'?lastSegment.url.replace("file://", ""):lastSegment.url),//joinedSegments
			method: 'POST',
			field: 'video',
			type: 'multipart',
			maxRetries: 2,
			headers: {
				"content-type": "multipart/form-data",
			  },
			parameters: {
				'title' : description || 'no title',
				'description' : description || 'no description',
				'duration' : `${parseInt(lastSegment.realTime / 1000)}`,
				'id_user' : `${loggedUser.id}`
				}
		  }

		if(videoSegment.length===1){
			options.path = videoSegment[0].url;
			console.log(options);
			await this.props.postVideoInBackground(options);
		}

		if(videoSegment.length > 1){
			RNVideoEditor.merge(
				videoSegment.map(item => item.url),
				(results) => {
					console.error('Error: ' + results);
				},
				async (results, file) => {
					console.log('Success : ' + results + " file: " + file);
					options.path = file;
					console.log(options);
					await this.props.postVideoInBackground(options);
					
				}
			);
		}

		  //await this.props.postVideoInBackground(options);
		  
	}

	async postVideo() {
		if (Platform.OS === 'android') {
			await checkAndroidPermission();
		}

		this.setState({ isPostingVideo: true });
		
		console.log('about to save the video....');
		await this.uploadSegments();
		console.log('segment uploaded');

		//Load videos for home screen, at least for the demo
		await this.props.getVideos();
		this.setState({ isPostingVideo: false });
		this.goForward();
	}

	render() {
		const { isPostingVideo } = this.state;
		return (
		<SafeAreaView style={{flex:1}}>
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
								source={{ uri: this.state.url_video }} // Can be a URL or a local file.
								repeat
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
				{
					//************SHARE********** */
				}
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
								onToggle={() => this.setState({ postOnFacebook: !this.state.postOnFacebook })}
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
				
					<TouchableOpacity style={postStyle.postButton} onPress={() => this.postVideo()}>
						<View style={{ alignSelf: 'center', paddingTop: 4 }}>
							<Text style={postStyle.postTextButton}>Post Video</Text>
						</View>
					</TouchableOpacity>

			</Container>
		</SafeAreaView>
		);
	}
}

const mapStateToProps = ({ auth }) => ({ loggedUser: auth.loggedUser });

export default connect(mapStateToProps, { getVideos,postVideoInBackground })(PostVideoScreen);
