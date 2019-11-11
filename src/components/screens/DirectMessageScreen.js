import React, { Component } from 'react';
import {
	Text,
	View,
	FlatList,
	Image,
	Dimensions,
	TouchableOpacity,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView
} from 'react-native';
import { Header } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Feather';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { getMessages } from '../../redux/actions/directMessagesActions';
import { directMessageStyles as styles } from '../../assets/styles';

const { height: screenHight } = Dimensions.get('window');

class DirectMessageScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		const dashboardMessage = navigation.getParam('dashboardMessage');
		const title = dashboardMessage.user.handle || 'Direct Messages';
		return { title };
	};

	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			currentMessage: null,
			safeAreaPadding: 0
		};

		this.otherUser = props.navigation.getParam('dashboardMessage').user;
	}

	async componentDidMount() {
		await this.props.getMessages(this.props.loggedUser, this.otherUser);
	}

	componentDidUpdate(prevProps, prevState) {
		const { messages } = this.props;
		if (prevProps.messages !== messages) this.setState({ messages });
	}

	onChangeText = text => {
		this.setState({ currentMessage: text });
	};

	onSubmitMessage = () => {
		const { messages, currentMessage } = this.state;

		if (!currentMessage) return;

		const message = {
			id: Date.now(),
			message: currentMessage,
			user: this.props.loggedUser,
			me: true
		};
		messages.push(message);
		this.setState({ messages, currentMessage: null });
	};

	CalculateSafeAreaPadding = e => {
		const { height } = e.nativeEvent.layout;
		const safeAreaPadding = screenHight - (height + Header.HEIGHT);

		this.setState({ safeAreaPadding });
	};

	render() {
		const { messages, currentMessage, safeAreaPadding } = this.state;
		//We need this to move the view above the keyboard with the offset caused by the safeareas and the nav header
		const keyboardOffset = Header.HEIGHT + safeAreaPadding;
		return (
			<SafeAreaView style={styles.safeArea} onLayout={this.CalculateSafeAreaPadding}>
				<KeyboardAvoidingView
					style={styles.mainContainer}
					behavior={Platform.OS === 'ios' ? 'position' : null}
					keyboardVerticalOffset={keyboardOffset}
					enabled
				>
					<View style={{ height: '100%' }}>
						<View style={{ flex: 1 }}>
							<FlatList
								data={messages}
								contentContainerStyle={styles.listContentContainer}
								renderItem={this.renderMessageItem}
								keyExtractor={item => item.id.toString()}
								initialNumToRender={20}
								onContentSizeChange={() => this.messagesScroll.scrollToEnd()}
								ref={s => {
									this.messagesScroll = s;
								}}
							/>
						</View>

						<View style={[styles.addMessageContainer, {}]}>
							<Icon name="plus" size={30} color={'#2881DD'} />
							<View style={{ flex: 1, justifyContent: 'center' }}>
								<TextInput
									placeholder="Add message..."
									placeholderTextColor="#898989"
									style={styles.addMessageInput}
									onChangeText={text => this.onChangeText(text)}
									onSubmitEditing={this.onSubmitMessage}
									value={currentMessage}
								/>
								<IconFontAwesome
									name="sticky-note-o"
									size={22}
									color={'#2881DD'}
									style={styles.iconStick}
								/>
							</View>
							<Icon name="camera" size={25} color={'#2881DD'} style={styles.iconCamera} />
							<IconMaterialCommunity name="microphone" size={25} color={'#2881DD'} />
						</View>
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}

	renderMessageItem = ({ item: message, index }) =>
		message.me ? this.renderMyMessageItem(message) : this.renderOtherMessageItem(message);

	renderMyMessageItem = message => (
		<View style={[styles.messageItemContainer, styles.mymessageItemContainer]}>
			<View style={[styles.messageContainer, styles.myMessageContainer]}>
				<Text style={styles.messageText}>{message.message}</Text>
			</View>
		</View>
	);

	renderOtherMessageItem = message => (
		<View style={styles.messageItemContainer}>
			<Image
				source={{
					uri: message.user.img
				}}
				resizeMode="contain"
				style={styles.messageUserImage}
			/>
			<View style={styles.messageContainer}>
				<View style={{}}>
					<Text style={styles.messageText}>{message.message}</Text>
				</View>
			</View>
		</View>
	);
}

const mapStateToProps = ({ directMessages, auth }) => ({
	messages: directMessages.messages,
	loggedUser: auth.loggedUser
});

export default connect(
	mapStateToProps,
	{ getMessages }
)(DirectMessageScreen);
