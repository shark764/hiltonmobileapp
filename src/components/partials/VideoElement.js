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
		video: null,
		follow: true,
		laughed: false,
		showComments: false,
		loaded: false,
		loadedVideoError: false,
		showDialog: false
	};

	player = null;
	viewTimeout = null;
	firstVideoViewed = false;

	componentDidMount() {
		const { video, loggedUser } = this.props;
		this.setState({ video });
		if (!this.props.userLeftVideo) this.createTimerForViewVideo();
	}

	componentDidUpdate(prevProps, prevState) {
		const { userLeftVideo, video } = this.props;

		//If we have new videos, they will be aded to the end.
		if (prevProps.video !== video) this.setState({ video });

		if (!prevProps.userLeftVideo && userLeftVideo) {
			clearTimeout(this.viewTimeout);
			this.viewTimeout = null;
		} else if ((prevProps.userLeftVideo && !userLeftVideo) || (!this.firstVideoViewed && !userLeftVideo)) {
			this.createTimerForViewVideo();
		}
	}

	createTimerForViewVideo = () => {
		const { video, loggedUser } = this.props;
		const { loaded } = this.state;
		if (!loaded) return;

		this.firstVideoViewed = true;

		const userId = (loggedUser && loggedUser.id) || 0;
		this.viewTimeout = setTimeout(async () => {
			const response = await this.props.videoWasViewed(video.id, userId);
			if (response) {
				const videoModified = { ...video };
				videoModified.views = response.views;
				this.setState({ video: videoModified });
			}
		}, globals.VIDEO_VIEW_TIME);
	};

	videoOnLoad = () => {
		this.setState({ loaded: true });
	};

	videoOnError = () => {
		this.setState({ loadedVideoError: true, loaded: false });
	};

	onShowHideCommentsPress = () => {
		const { loggedUser, onShowComments, onShowLoginModal } = this.props;

		if (!loggedUser) {
			onShowLoginModal();
			return;
		}

		const { showComments } = this.state;
		//If the comments will be shown, then we run the home function to enable/disable scrolling
		onShowComments(!showComments);
		this.setState({ showComments: !showComments });
	};

	shareVideo = async () => {
		const { loggedUser, onShowLoginModal } = this.props;
		if (!loggedUser) {
			onShowLoginModal();
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
		if (!video.already_like && !showComments) {
			const response = await videoLaughed(video.id, loggedUser.id);
			//To show the Animation
			if (response.success) this.setState({ laughed: true });
		}
	};

	onGoToLogin = () => {
		goToRootRouteFromSibling('Profile');
		this.hideModal();
	};

	hideModal = () => this.setState({ showDialog: false });

	hideLaughAnimation = () => this.setState({ laughed: false });

	render() {
		const { height, play, onPauseVideo, onResumeVideo, isSingleVideo } = this.props;
		const { video, laughed, showComments, loaded, loadedVideoError, showDialog } = this.state;
		const elementsViewHeight = showComments ? screenHeight - globals.NAVBAR_HEIGHT : videoElementsHeight;

		if (!video) return null;

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

const mapStateToProps = ({ user }) => ({ loggedUser: user.loggedUser });

export default connect(mapStateToProps, { videoLaughed, videoWasViewed })(VideoElement);
