import React, { PureComponent } from 'react';
import { View, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Video from 'react-native-video';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import DoubleTap from '../commons/DoubleTap';
import { laughAnimation } from '../../assets/animations/index';
import VideoActions from './VideoActions';
import { videoLaughed } from '../../redux/actions/videoActions';
import CommentsScreen from './Comments';
import { globals } from '../../config/constants';
import { homeStyles as styles, globalStyles } from '../../assets/styles';
import { ErrorMessage } from '../commons/ErrorMessage';

const screenHeight = Math.round(Dimensions.get('window').height);
const videoElementsHeight = screenHeight / 3;

class VideoElement extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			follow: true,
			laughed: false,
			showComments: false,
			loaded: false,
			loadedVideoError: false
		};
		this.player = null;
	}

	videoOnLoad = () => {
		this.setState({ loaded: true });
	};

	videoOnError = () => {
		this.setState({ loadedVideoError: true });
	};

	onShowHideCommentsPress = () => {
		const { showComments } = this.state;
		//If the comments will be shown, then we run the home function to enable/disable scrolling
		this.props.onShowComments(!showComments);

		this.setState({ showComments: !showComments });
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

	hideLaughAnimation = () => this.setState({ laughed: false });

	render() {
		const { video, height, play, onPauseVideo, onResumeVideo, isSingleVideo } = this.props;
		const { laughed, showComments, loaded, loadedVideoError } = this.state;

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
									videoItem={video}
									onShowHideCommentsPress={this.onShowHideCommentsPress}
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
			</View>
		);
	}
}

const mapStateToProps = ({ auth }) => ({ loggedUser: auth.loggedUser });

export default connect(mapStateToProps, { videoLaughed })(VideoElement);
