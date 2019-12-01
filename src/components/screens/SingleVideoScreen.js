import React, { Component } from 'react';
import { Text, View, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import VideoElement from '../partials/VideoElement';
import { setSingleVideoToPlay } from '../../redux/actions/videoActions';
import Loader from '../commons/Loader';

const { height: screenHeight } = Dimensions.get('window');

class SingleVideoScreen extends Component {
	state = {
		playVideo: true
	};

	componentDidUpdate(prevProps, prevState) {
		console.log('updated ', prevProps, this.props);
	}

	resumeVideo = () => {
		this.setState({ playVideo: true });
	};

	pauseVideo = () => {
		this.setState({ playVideo: false });
	};

	onShowComments = showedComments => {
		//If commets
		if (showedComments) this.pauseVideo();
		else this.resumeVideo();
	};

	goBack = () => {
		this.props.navigation.pop();
	};

	onVideoChanged = video => {
		const { onVideoChanged } = this.props;
		onVideoChanged(video);
	};

	render() {
		//const {video} = this.props.navigation.getParam('video');
		const { video } = this.props;
		const { playVideo } = this.state;

		return (
			<View>
				<Loader show={!video} />
				{video && (
					<React.Fragment>
						<TouchableOpacity
							onPress={this.goBack}
							style={{ position: 'absolute', zIndex: 10, top: 40, left: 10 }}
						>
							<IconFeather
								name="arrow-left"
								size={35}
								color="#757575"
								style={{
									textShadowColor: '#000',
									textShadowOffset: { width: 1, height: 1 },
									textShadowRadius: 2
								}}
							/>
						</TouchableOpacity>
						<VideoElement
							key={video.id}
							video={video}
							play={playVideo}
							height={screenHeight}
							isSingleVideo
							onPauseVideo={this.pauseVideo}
							onResumeVideo={this.resumeVideo}
							onShowComments={this.onShowComments}
							{...this.props}
						/>
					</React.Fragment>
				)}
			</View>
		);
	}
}

const mapStateToProps = ({ videos }) => ({ video: videos.singleVideoToPlay });

export default connect(mapStateToProps, { setSingleVideoToPlay })(SingleVideoScreen);
