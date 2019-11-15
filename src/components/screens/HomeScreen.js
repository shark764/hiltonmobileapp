import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import VideoElement from '../partials/VideoElement';
import { connect } from 'react-redux';
import { getVideos } from '../../redux/actions/videoActions';
import { userLogin } from '../../redux/actions/authActions';

class HomeScreen extends Component {
	state = {
		videos: [],
		currentPage: 0,
		listHeight: 0,
		isFocused: true,
		loading: true,
		scrollEnabled: true
	};

	async componentDidMount() {
		await this.props.userLogin();
		await this.props.getVideos();
	}

	componentDidUpdate(prevProps, prevState) {
		const { videos } = this.props;

		//If we have new videos, they will be aded to the end.
		if (prevProps.videos !== videos) this.setState({ videos, loading: false });
	}

	videoChanged = e => {
		const { listHeight } = this.state;

		var offset = e.nativeEvent.contentOffset;
		if (offset) {
			var page = Math.round(offset.y / listHeight);

			if (this.state.currentPage != page) {
				this.setState({ currentPage: page });
			}
		}
	};

	onLayoutList = e => {
		const { height } = e.nativeEvent.layout;
		this.setState({ listHeight: height });
	};

	playVideo = videoPage => {
		const { currentPage } = this.state;
		const { isFocused } = this.state;
		const isPlaying = isFocused && videoPage === currentPage;
		return isPlaying;
	};

	resumeVideo = () => {
		this.setState({ isFocused: true });
	};

	pauseVideo = () => {
		this.setState({ isFocused: false });
	};

	onShowComments = showedComments => {
		//if comments were shown, we disable scrolling
		this.setState({ scrollEnabled: !showedComments });

		//If commets
		if (showedComments) this.pauseVideo();
		else this.resumeVideo();
	};

	render() {
		const { videos, listHeight, loading, scrollEnabled } = this.state;

		if (loading) return null;

		return (
			<React.Fragment>
				<NavigationEvents onDidFocus={this.resumeVideo} onDidBlur={this.pauseVideo} />
				<FlatList
					data={videos}
					renderItem={this.renderVideoItem}
					keyExtractor={item => item.id.toString()}
					pagingEnabled
					showsVerticalScrollIndicator={false}
					initialNumToRender={5}
					nestedScrollEnabled
					onMomentumScrollEnd={this.videoChanged}
					onLayout={this.onLayoutList}
					scrollEnabled={scrollEnabled}
					getItemLayout={(data, index) => ({
						length: listHeight,
						offset: listHeight * index,
						index
					})}
				/>
			</React.Fragment>
		);
	}
	renderVideoItem = ({ item: video, index: page }) => {
		const { listHeight } = this.state;

		return (
			<VideoElement
				key={video.id}
				video={video}
				play={this.playVideo(page)}
				height={listHeight}
				onPauseVideo={this.pauseVideo}
				onResumeVideo={this.resumeVideo}
				onShowComments={this.onShowComments}
				{...this.props}
			/>
		);
	};
}

const mapstateToProps = ({ videos, apiMessages }) => ({ videos: videos.videosInfo, apiMessages });

export default connect(mapstateToProps, { getVideos, userLogin })(HomeScreen);
