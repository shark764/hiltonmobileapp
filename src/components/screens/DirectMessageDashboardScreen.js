import React, { Component } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { getDashboardMessages } from '../../redux/actions/directMessagesActions';
import { directMessageDashboardStyles as styles } from '../../assets/styles';

class DirectMessageDashboardScreen extends Component {
	static navigationOptions = () => ({ title: 'Messages' });

	constructor(props) {
		super(props);
		this.state = {
			dashboardMessages: []
		};
	}

	async componentDidMount() {
		await this.props.getDashboardMessages(2);
	}

	componentDidUpdate(prevProps, prevState) {
		const { dashboardMessages } = this.props;
		if (prevProps.dashboardMessages !== dashboardMessages) this.setState({ dashboardMessages: dashboardMessages });
	}

	onMessagePressed = dashboardMessage => {
		this.props.navigation.push('DirectMessages', { dashboardMessage });
	};

	render() {
		const { dashboardMessages } = this.state;

		return (
			<View style={styles.mainContainer}>
				<FlatList
					data={dashboardMessages}
					contentContainerStyle={styles.listContentContainer}
					renderItem={this.renderDashboardMessageItem}
					keyExtractor={item => item.id.toString()}
					initialNumToRender={10}
				/>
			</View>
		);
	}

	renderDashboardMessageItem = ({ item: dashboardMessages, index }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					this.onMessagePressed(dashboardMessages);
				}}
			>
				<View style={styles.commentItemContainer}>
					<View style={styles.commentUserImageContainer}>
						<Image
							source={{
								uri: dashboardMessages.user.img
							}}
							resizeMode="contain"
							style={styles.commentUserImage}
						/>
					</View>
					<View style={styles.commentCenterContainer}>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.commentUerHandleText}>{dashboardMessages.user.handle}</Text>
							<Text style={styles.commentUserFullNameText}>{dashboardMessages.user.fullName}</Text>
						</View>
						<Text style={styles.commentText}>{dashboardMessages.lastMessageSent}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};
}

const mapStateToProps = ({ directMessages }) => ({ dashboardMessages: directMessages.dashboard });

export default connect(mapStateToProps, { getDashboardMessages })(DirectMessageDashboardScreen);
