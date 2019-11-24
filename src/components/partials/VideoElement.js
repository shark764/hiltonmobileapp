import React, { PureComponent } from 'react';
import { View, Dimensions, KeyboardAvoidingView, Platform, Text } from 'react-native';
import Video from 'react-native-video';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import DoubleTap from '../commons/DoubleTap';
import { laughAnimation } from '../../assets/animations/index';
import VideoActions from './VideoActions';
import { videoLaughed, videoWasViewed } from '../../redux/actions/videoActions';
import CommentsScreen from './Comments';
import { globals } from '../../config/constants';
import { homeStyles as styles, globalStyles } from '../../assets/styles';
import { ErrorMessage } from '../commons/ErrorMessage';
import ModalPopup from '../commons/ModalPopup';
import { goToRootRouteFromSibling, shareVideo } from '../../utils/helpers';

const screenHeight = Math.round(Dimensions.get('window').height);
const videoElementsHeight = 280;

class VideoElement extends PureComponent {
	state = {
		follow: true,
		laughed: false,
		showComments: false,
		loaded: false,
		loadedVideoError: false,
		showDialog: false
	};

	player = null;
	viewTimeout = null;

	componentDidMount() {
		if (!this.props.userLeftVideo) this.createTimerForViewVideo();
	}

	componentDidUpdate(prevProps, prevState) {
		const { userLeftVideo, video, loggedUser } = this.props;

		if (!prevProps.userLeftVideo && userLeftVideo) {
			console.log('user left video', video.id);
			clearTimeout(this.viewTimeout);
			this.viewTimeout = null;
		} else if (prevProps.userLeftVideo && !userLeftVideo) {
			this.createTimerForViewVideo();
		}
	}

	createTimerForViewVideo = () => {
		const { video, loggedUser } = this.props;
		const { loaded } = this.state;
		if (!loggedUser || !loaded) return;
		console.log('user started watching video', video.id, 'loaded:', loaded);
		this.viewTimeout = setTimeout(() => {
			console.log('==>Viewed finishd', video.id);
			this.props.videoWasViewed(video.id, loggedUser.id);
		}, globals.VIDEO_VIEW_TIME);
	};

	videoOnLoad = () => {
		this.setState({ loaded: true });
	};

	videoOnError = () => {
		this.setState({ loadedVideoError: true, loaded: false });
	};

	onShowHideCommentsPress = () => {
		const { loggedUser, onShowComments } = this.props;

		if (!loggedUser) {
			this.showNoLoggedPopup();
			return;
		}

		const { showComments } = this.state;
		//If the comments will be shown, then we run the home function to enable/disable scrolling
		onShowComments(!showComments);
		this.setState({ showComments: !showComments });
	};

	shareVideo = async () => {
		if (!this.props.loggedUser) {
			this.showNoLoggedPopup();
			return;
		}
		const { video } = this.props;
		await shareVideo(video.url);
	};

	onDoubleTap = async () => {
		const { loggedUser, videoLaughed } = this.props;
		if (!loggedUser) return;

		const { showComments } = this.state;
		const { video } = this.props;
		if (!video.laughed && !showComments) {
			const response = await videoLaughed(video.id, loggedUser.id);
			//To show the Animation
			if (response.success) this.setState({ laughed: true });
		}
	};

	showNoLoggedPopup = () => {
		this.setState({ showDialog: true });
	};

	onGoToLogin = () => {
		goToRootRouteFromSibling('Profile');
		this.hideModal();
	};

	hideModal = () => this.setState({ showDialog: false });

	hideLaughAnimation = () => this.setState({ laughed: false });

	render() {
		const { video, height, play, onPauseVideo, onResumeVideo, isSingleVideo } = this.props;
		const { laughed, showComments, loaded, loadedVideoError, showDialog } = this.state;

		const elementsViewHeight = showComments ? screenHeight - globals.NAVBAR_HEIGHT : videoElementsHeight;

		return (
			<View style={[styles.mainContainer, { height }]}>
				<DoubleTap doubleTap={this.onDoubleTap} delay={200}>
					<Video
						source={{ uri: video.url }} // Can be a URL or a local file.
						repeat
						resizeMode="cover"
						paused={!play}
						style={styles.videoPlayer}
						onLoad={this.videoOnLoad}
						onError={this.videoOnError}
					/>
				</DoubleTap>
				{loadedVideoError && (
					<ErrorMessage
						style={[globalStyles.textWhiteShadow, { position: 'absolute', marginTop: '50%', fontSize: 20 }]}
					>
						Could not load video
					</ErrorMessage>
				)}
				{laughed && (
					<View style={styles.laughContainer}>
						<LottieView
							source={laughAnimation}
							autoPlay
							loop={false}
							style={styles.laughAnimation}
							onAnimationFinish={this.hideLaughAnimation}
						/>
					</View>
				)}
				{loaded && (
					<KeyboardAvoidingView
						style={styles.bottomContainer}
						behavior={Platform.OS === 'ios' ? 'padding' : null}
						enabled
					>
						<View style={{ height: elementsViewHeight }}>
							<DoubleTap doubleTap={this.onDoubleTap} delay={200}>
								<VideoActions
									//To trigger re-render on child that has redux connet, we need to clone the object
									videoItem={{ ...video }}
									onShowHideCommentsPress={this.onShowHideCommentsPress}
									onShareVideo={this.shareVideo}
									showVideoInfo={!showComments}
									onPauseVideo={onPauseVideo}
									onResumeVideo={onResumeVideo}
								/>
							</DoubleTap>
							<CommentsScreen
								show={showComments}
								onShowHideCommentsPress={this.onShowHideCommentsPress}
								video={video}
								isSingleVideo={isSingleVideo}
							/>
						</View>
					</KeyboardAvoidingView>
				)}
				<ModalPopup
					title="Login or Register"
					confirmBtnText="Got it"
					onConfirmPressed={this.onGoToLogin}
					onCancelPressed={this.hideModal}
					confirmBtnText="Yes!"
					cancelBtnText="Not now"
					visible={showDialog}
				>
					In order to have access to this feature, you need login or create an account. Do you want to login
					or register?
				</ModalPopup>
			</View>
		);
	}
}

const mapStateToProps = ({ auth }) => ({ loggedUser: auth.loggedUser });

export default connect(mapStateToProps, { videoLaughed, videoWasViewed })(VideoElement);
