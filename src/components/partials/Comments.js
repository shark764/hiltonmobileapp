import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	FlatList,
	Dimensions,
	TextInput,
	TouchableOpacity,
	Animated,
	ScrollView,
	RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import { heartAnimation } from '../../assets/animations/index';
import { globals } from '../../config/constants';
import { commentsStyles as styles } from '../../assets/styles';
import { getVideoComments, postVideoComment, commentLiked } from '../../redux/actions/videoActions';
import { getShowHideStyle, numberAbbreviate } from '../../utils/helpers';
import Loader from '../commons/Loader';

const screenHeight = Math.round(Dimensions.get('window').height);
const componentHeight = (screenHeight / 4) * 3 - globals.NAVBAR_HEIGHT * 2;

class CommentsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentComment: '',
			heightBounceValue: new Animated.Value(0), //This is the initial height of the view,
			loading: false,
			loadingNewData: false,
			currentApiPage: 1
		};
	}

	componentDidMount = async () => {
		const { video, loggedUser, getVideoComments } = this.props;
		const userId = loggedUser && loggedUser.id;
		//await getVideoComments(video.id, userId);
	};

	async componentDidUpdate(prevProps, prevState) {
		this.showHideView();
		const { video, comments, getVideoComments, show, loggedUser } = this.props;
		const { loading, loadingNewData } = this.state;

		if (show && !comments && !loading) {
			const userId = loggedUser ? loggedUser.id : null;
			await this.onRefresh();
		}

		if (prevProps.comments !== comments && loading) this.setState({ loading: false });

		if (prevProps.comments !== comments && loadingNewData) this.setState({ loadingNewData: false });

		const userId = loggedUser && loggedUser.id;
		if (prevProps.loggedUser !== loggedUser) await getVideoComments(video.id, userId);
	}

	onRefresh = async () => {
		this.setState({ loading: true, currentApiPage: 1 });
		await this.getNewData(1);
	};

	getNewData = async page => {
		const { video, getVideoComments, loggedUser } = this.props;
		const { currentApiPage } = this.state;
		const userId = loggedUser && loggedUser.id;

		if (!page) {
			//There is a bug in the Flat list, it calls onEndReached when rendering,
			//So to avoid getting the data twice when loading the screen

			page = currentApiPage + 1;
			this.setState({ currentApiPage: page, loadingNewData: true });
		}

		await getVideoComments(video.id, userId, page);
	};

	onLikePress = async comment => {
		const { loggedUser, commentLiked } = this.props;

		if (!loggedUser) return;

		await commentLiked(comment, loggedUser.id, !comment.already_like);
	};

	onChangeText = text => {
		this.setState({ currentComment: text });
	};

	onSubmitMessage = async () => {
		const { currentComment } = this.state;
		const { loggedUser, video, postVideoComment } = this.props;

		if (!currentComment) return;

		this.setState({ currentComment: '' });
		await postVideoComment(video.id, loggedUser.id, currentComment);
		this.commentsScroll.scrollTo({ y: 0 });
	};

	showHideView = async () => {
		const { show } = this.props;
		const { heightBounceValue } = this.state;

		const toValue = show ? componentHeight : 0;

		Animated.spring(heightBounceValue, {
			toValue,
			tension: 1,
			friction: 8
		}).start();
	};

	isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
		return layoutMeasurement.height + contentOffset.y >= contentSize.height - globals.LIMIT_TO_FETCH_COMMENTS;
	};

	render() {
		const { currentComment, heightBounceValue, loading, loadingNewData } = this.state;
		const { comments, loggedUser, isSingleVideo, video, show } = this.props;
		const allowComments = loggedUser && show && video.allow_comments;
		let newMarginBottom = {};

		if (isSingleVideo) newMarginBottom = { marginBottom: 15 };

		return (
			<Animated.View style={[styles.mainContainer, { height: heightBounceValue }]}>
				<Loader show={loading} style={{ marginTop: '40%' }} />
				{!loading && (
					<View style={{ flex: 1 }}>
						<View style={[styles.header, getShowHideStyle(show)]}>
							<TouchableOpacity onPress={this.props.onShowHideCommentsPress} style={styles.backButton}>
								<IconFeather name={'arrow-left'} size={30} color={'#9F9F9F'} />
							</TouchableOpacity>
							<Text style={styles.headerText}>Comments</Text>
						</View>

						<ScrollView
							style={[styles.commentsList]}
							nestedScrollEnabled
							ref={s => {
								this.commentsScroll = s;
							}}
							//horizontal={isSingleVideo}
							refreshControl={<RefreshControl refreshing={false} onRefresh={this.onRefresh} />}
							//onEndReachedThreshold={0.2} //To load more content when we are x videos away from the end
							//onEndReached={() => this.getNewData()}
							onScroll={({ nativeEvent }) => {
								if (this.isCloseToBottom(nativeEvent)) {
									this.getNewData();
								}
							}}
							scrollEventThrottle={500}
						>
							<View style={{ flex: 1 }}>
								{/* <FlatList
								style={[styles.commentsList]}
								//contentContainerStyle={{ flexGrow: 1 }}
								data={comments}
								renderItem={this.renderComment}
								keyExtractor={item => item.id.toString()}
								initialNumToRender={5}
								nestedScrollEnabled
								numColumns={1}
								onEndReachedThreshold={0.2} //To load more content when we are x videos away from the end
								onEndReached={() => this.getNewData()}
							/> */}

								{comments && comments.map(comment => this.renderComment({ item: comment }))}
								<Loader
									show={loadingNewData}
									style={{ position: 'absolute', left: '40%', bottom: 10 }}
								/>
							</View>
						</ScrollView>

						<View style={[styles.addCommentContainer, newMarginBottom, getShowHideStyle(allowComments)]}>
							<Image
								source={{
									uri: (loggedUser && loggedUser.avatar) || '/'
								}}
								style={styles.currentUserImage}
							/>

							<TextInput
								placeholder="Add a comment..."
								placeholderTextColor="#898989"
								style={styles.addCommentInput}
								onChangeText={text => this.onChangeText(text)}
								onSubmitEditing={this.onSubmitMessage}
								value={currentComment}
							></TextInput>
						</View>
					</View>
				)}
			</Animated.View>
		);
	}

	renderComment = ({ item: comment }) => {
		const { loggedUser } = this.props;
		return (
			<View key={comment.id} style={styles.commentItemContainer}>
				<Image
					source={{
						uri: comment.user.avatar || '/'
					}}
					resizeMode="contain"
					style={styles.commentUserImage}
				/>
				<View style={styles.commentCenterContainer}>
					<Text style={styles.commentUserHandleText}>@{comment.user.username}</Text>
					<Text style={styles.commentText}>{comment.comment}</Text>
				</View>
				<View style={{ alignItems: 'center' }}>
					<TouchableOpacity onPress={() => this.onLikePress(comment)} disabled={!loggedUser}>
						<View style={styles.likeContainer}>
							<Icon
								name={'heart-o'}
								size={18}
								color={'#9F9F9F'}
								style={getShowHideStyle(!comment.already_like)}
							/>

							{comment.already_like && (
								<LottieView
									source={heartAnimation}
									autoPlay
									loop={false}
									style={[styles.likeAnimation, getShowHideStyle(comment.already_like)]}
								/>
							)}
						</View>
					</TouchableOpacity>
					<Text style={styles.likeCounter}>{numberAbbreviate(comment.likes, 1)}</Text>
				</View>
			</View>
		);
	};
}

const mapStateToProps = ({ videos, user }, { video }) => {
	let comments = videos.videoComments[video.id];
	return {
		comments,
		loggedUser: user.loggedUser
	};
};

export default connect(mapStateToProps, { getVideoComments, postVideoComment, commentLiked })(CommentsScreen);
