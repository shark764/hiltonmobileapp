import React, { Component } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import VideoElement from '../partials/VideoElement';
import { connect } from 'react-redux';
import { getVideos } from '../../redux/actions/videoActions';
import { getLoggedUser } from '../../redux/actions/authActions';
import LoginOrSignupHomeScreen from './SignUp/LoginOrSignupHomeScreen';
import Loader from '../commons/Loader';
import { globals } from '../../config/constants';
import { getShowHideStyle } from '../../utils/helpers';

class HomeScreen extends Component {
	state = {
		currentVideoPage: 0, //To control the pages (videos)
		listHeight: 0,
		isFocused: true,
		loading: true,
		scrollEnabled: true,
		showLoginModal: false
	};

	async componentDidMount() {
		const { getLoggedUser } = this.props;
		await getLoggedUser();
		await this.onRefresh();
	}

	async componentDidUpdate(prevProps, prevState) {
		const { videos, loggedUser, getVideos } = this.props;

		//If we have new videos, they will be aded to the end.
		if (prevProps.videos !== videos) this.setState({ loading: false });

		if (prevProps.loggedUser !== loggedUser) await getVideos(loggedUser && loggedUser.id);
	}

	onRefresh = async () => {
		this.setState({ loading: true });
		this.getNewData(1); //for page 1
	};

	getNewData = async page => {
		const { loggedUser, getVideos, videos } = this.props;
		if (page !== 1) page = Math.ceil(videos.length / globals.VIDEOS_TO_FETCH_PER_PAGE) + 1;
		await getVideos(loggedUser && loggedUser.id, page);
	};

	videoChanged = e => {
		const { listHeight, currentVideoPage } = this.state;

		var offset = e.nativeEvent.contentOffset;
		if (offset) {
			var page = Math.round(offset.y / listHeight);

			if (currentVideoPage != page) {
				this.setState({ currentVideoPage: page });
			}
		}
	};

	onLayoutList = e => {
		const { height } = e.nativeEvent.layout;
		this.setState({ listHeight: height });
	};

	playVideo = videoPage => {
		const { currentVideoPage } = this.state;
		const { isFocused } = this.state;
		const isPlaying = isFocused && videoPage === currentVideoPage;
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

	onCloseLoginModal = () => this.setState({ showLoginModal: false });

	onShowLoginModal = () => this.setState({ showLoginModal: true });

	render() {
		const { listHeight, loading, scrollEnabled, showLoginModal } = this.state;
		const { videos } = this.props;

		return (
			<View style={{ flex: 1 }}>
				<NavigationEvents onDidFocus={this.resumeVideo} onDidBlur={this.pauseVideo} />

				<LoginOrSignupHomeScreen modalVisible={showLoginModal} onCloseModal={this.onCloseLoginModal} />
				<FlatList
					style={getShowHideStyle(!loading)}
					data={videos}
					renderItem={this.renderVideoItem}
					keyExtractor={item => item.id.toString()}
					pagingEnabled
					showsVerticalScrollIndicator={false}
					initialNumToRender={5}
					nestedScrollEnabled
					scrollEnabled={scrollEnabled}
					getItemLayout={(data, index) => ({
						length: listHeight,
						offset: listHeight * index,
						index
					})}
					refreshControl={<RefreshControl refreshing={false} onRefresh={this.onRefresh} />}
					onEndReachedThreshold={globals.LIMIT_TO_FETCH_VIDEOS} //To load more content when we are x videos away from the end
					onEndReached={() => this.getNewData()}
					onMomentumScrollEnd={this.videoChanged}
					onLayout={this.onLayoutList}
				/>
				<Loader show={loading} style={{ marginTop: '60%' }} />
			</View>
		);
	}
	renderVideoItem = ({ item: video, index: page }) => {
		const { listHeight, currentVideoPage } = this.state;

		const userLeftVideo = currentVideoPage !== page;
		return (
			<VideoElement
				key={video.id}
				//video={{ ...video }}
				video={video}
				play={this.playVideo(page)}
				userLeftVideo={userLeftVideo}
				height={listHeight}
				onPauseVideo={this.pauseVideo}
				onResumeVideo={this.resumeVideo}
				onShowComments={this.onShowComments}
				onShowLoginModal={this.onShowLoginModal}
				{...this.props}
			/>
		);
	};
}

const mapstateToProps = ({ videos, user }) => ({ videos: videos.homeVideos, loggedUser: user.loggedUser });

export default connect(mapstateToProps, { getVideos, getLoggedUser })(HomeScreen);
