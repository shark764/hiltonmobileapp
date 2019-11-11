import React, { PureComponent } from 'react';
import { View, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Video from 'react-native-video';
import LottieView from 'lottie-react-native';
import DoubleTap from '../commons/DoubleTap';
import { laughAnimation } from '../../assets/animations/index';
import VideoActions from './VideoActions';
import CommentsScreen from './Comments';
import { globals } from '../../config/constants';
import { homeStyles as styles } from '../../assets/styles';

const screenHeight = Math.round(Dimensions.get('window').height);
const videoElementsHeight = screenHeight / 3;

export default class VideoElement extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			follow: true,
			laughed: false,
			showComments: false,
			loaded: false
		};
		this.player = null;
	}

	videoOnLoad = () => {
		this.setState({ loaded: true });
	};

	onShowHideCommentsPress = () => {
		const { showComments } = this.state;
		//If the comments will be shown, then we run the home function to enable/disable scrolling
		this.props.onShowComments(!showComments);

		this.setState({ showComments: !showComments });
	};

	onDoubleTap = () => {
		const { showComments } = this.state;
		const { video } = this.props;
		if (!video.laughed && !showComments) {
			video.laughed = true;
			this.setState({ laughed: true });
			setTimeout(() => {
				this.setState({ laughed: false });
			}, 2000);
		}
	};

	render() {
		const { video, height, play, onPauseVideo, onResumeVideo } = this.props;
		const { laughed, showComments, loaded } = this.state;

		const elementsViewHeight = showComments ? screenHeight - globals.NAVBAR_HEIGHT : videoElementsHeight;
		return (
			<View style={[styles.mainContainer, { height }]}>
				<DoubleTap doubleTap={this.onDoubleTap} delay={200}>
					<Video
						source={{ uri: video.url }} // Can be a URL or a local file.
						repeat
						resizeMode="cover"
						onLoad={this.videoOnLoad}
						paused={!play}
						style={styles.videoPlayer}
					/>
				</DoubleTap>
				{laughed && (
					<View style={styles.laughContainer}>
						<LottieView source={laughAnimation} autoPlay loop={false} style={styles.laughAnimation} />
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
								videoId={video.id}
							/>
						</View>
					</KeyboardAvoidingView>
				)}
			</View>
		);
	}
}
