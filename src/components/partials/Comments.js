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
import { heartAnimation } from '../../assets/animations/index';
import { globals } from '../../config/constants';
import { commentsStyles as styles } from '../../assets/styles';
import { connect } from 'react-redux';
import { getVideoComments } from '../../redux/actions/videoActions';
import { getShowHideStyle } from '../../utils/helpers';

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
		await this.props.getVideoComments(this.props.videoId);
	};

	componentDidUpdate(prevProps, prevState) {
		this.showHideView();
		const { comments } = this.props;
		if (prevProps.comments !== comments) this.setState({ comments, loading: false });
	}

	onLikePress = id => {
		const { comments } = this.state;
		const comment = comments.find(c => c.id === id);
		comment.liked = !comment.liked;
		if (comment.liked) comment.likes++;
		else comment.likes--;

		this.setState({ comments });
	};

	onChangeText = text => {
		this.setState({ currentComment: text });
	};

	onSubmitMessage = () => {
		const { comments, currentComment } = this.state;
		const { loggedUser } = this.props;

		if (!currentComment) return;

		const comment = {
			id: Date.now(),
			comment: currentComment,
			user: loggedUser,
			likes: 0
		};
		comments.unshift(comment);
		this.setState({ comments, currentComment: '' });
		this.commentsScroll.scrollTo({ y: 0 });
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
		const { comments, currentComment, heightBounceValue, loading } = this.state;
		const { loggedUser, isSingleVideo } = this.props;

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
								uri: loggedUser.img
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
		return (
			<View style={styles.commentItemContainer}>
				<Image
					source={{
						uri: comment.user.img
					}}
					resizeMode="contain"
					style={styles.commentUserImage}
				/>
				<View style={styles.commentCenterContainer}>
					<Text style={styles.commentUserHandleText}>{comment.user.handle}</Text>
					<Text style={styles.commentText}>{comment.comment}</Text>
				</View>
				<View style={{ alignItems: 'center' }}>
					<TouchableOpacity onPress={() => this.onLikePress(comment.id)}>
						<View style={styles.likeContainer}>
							<Icon
								name={'heart-o'}
								size={18}
								color={'#9F9F9F'}
								style={getShowHideStyle(!comment.liked)}
							/>

							{comment.liked && (
								<LottieView
									source={heartAnimation}
									autoPlay
									loop={false}
									style={[styles.likeAnimation, getShowHideStyle(comment.liked)]}
								/>
							)}
						</View>
					</TouchableOpacity>
					<Text style={styles.likeCounter}>{comment.likes}</Text>
				</View>
			</View>
		);
	};
}

const mapStateToProps = ({ videos, auth }) => ({ comments: videos.comments, loggedUser: auth.loggedUser });

export default connect(mapStateToProps, { getVideoComments })(CommentsScreen);
