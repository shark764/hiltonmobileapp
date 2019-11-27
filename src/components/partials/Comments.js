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
	ScrollView
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

const screenHeight = Math.round(Dimensions.get('window').height);
const componentHeight = (screenHeight / 4) * 3 - globals.NAVBAR_HEIGHT * 2;

class CommentsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: [],
			currentComment: '',
			heightBounceValue: new Animated.Value(0), //This is the initial height of the view,
			loading: true
		};
	}

	componentDidMount = async () => {
		const { video, loggedUser, getVideoComments } = this.props;
		const userId = loggedUser ? loggedUser.id : null;
		const result = await getVideoComments(video.id, userId);
		// if(result.success){
		// 	this.setState({comments: result.data})
		// }
	};

	async componentDidUpdate(prevProps, prevState) {
		this.showHideView();
		const { video, comments, getVideoComments, loggedUser } = this.props;
		if (prevProps.comments !== comments) {
			this.setState({ comments: comments[video.id], loading: false });
		}

		const userId = loggedUser ? loggedUser.id : null;
		if (prevProps.loggedUser !== loggedUser) await getVideoComments(video.id, userId);
	}

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
		const { loggedUser, video } = this.props;

		if (!currentComment) return;

		await this.props.postVideoComment(video.id, loggedUser.id, currentComment);
		this.setState({ currentComment: '' });
		this.commentsScroll.scrollTo({ y: 0 });
		//video.comments++;
	};

	showHideView = () => {
		const { show } = this.props;

		const toValue = show ? componentHeight : 0;

		Animated.spring(this.state.heightBounceValue, {
			toValue,
			tension: 1,
			friction: 8
		}).start();
	};

	render() {
		const { currentComment, heightBounceValue, loading } = this.state;
		const { loggedUser, isSingleVideo, video } = this.props;

		const comments = this.props.comments[video.id];

		if (loading) return null;

		let newMarginBottom = {};
		if (isSingleVideo) newMarginBottom = { marginBottom: 15 };

		return (
			<Animated.View style={[styles.mainContainer, { height: heightBounceValue }]}>
				<View style={styles.header}>
					<TouchableOpacity onPress={this.props.onShowHideCommentsPress} style={styles.backButton}>
						<IconFeather name={'arrow-left'} size={30} color={'#9F9F9F'} />
					</TouchableOpacity>
					<Text style={styles.headerText}>Comments</Text>
				</View>

				<ScrollView
					//nestedScrollEnabled
					ref={s => {
						this.commentsScroll = s;
					}}
					horizontal={isSingleVideo}
				>
					<View>
						<FlatList
							style={styles.commentsList}
							data={comments}
							renderItem={this.renderComment}
							keyExtractor={item => item.id.toString()}
							initialNumToRender={5}
							nestedScrollEnabled
							numColumns={1}
						/>
					</View>
				</ScrollView>
				{loggedUser && (
					<View style={[styles.addCommentContainer, newMarginBottom]}>
						<Image
							source={{
								uri: loggedUser.avatar || '/'
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
				)}
			</Animated.View>
		);
	}

	renderComment = ({ item: comment }) => {
		const { loggedUser } = this.props;
		return (
			<View style={styles.commentItemContainer}>
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

const mapStateToProps = ({ videos, auth }) => ({ comments: videos.comments, loggedUser: auth.loggedUser });

export default connect(mapStateToProps, { getVideoComments, postVideoComment, commentLiked })(CommentsScreen);
