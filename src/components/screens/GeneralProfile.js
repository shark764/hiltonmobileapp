import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Content } from 'native-base';
import { Button } from 'react-native-elements';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { fonts, colors } from '../../config/constants';
import { profileStyle } from '../../assets/styles/profileStyle';
import { connect } from 'react-redux';
import { numberAbbreviate } from '../../utils/helpers';
import { getVideosByUser, setSingleVideoToPlay } from '../../redux/actions/videoActions';
import Loader from '../commons/Loader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

class GeneralProfile extends Component {
	static navigationOptions = ({ navigation }) => {
		const user = navigation.getParam('user');
		const title = '@' + (user.username || 'Profile');
		return { title };
	};

	constructor(props) {
		super(props);

		this.state = {
			user: props.navigation.getParam('user'),
			loading: true
		};
	}

	async componentDidMount() {
		const { loggedUser } = this.props;
		const { user } = this.state;

		await this.props.getVideosByUser(user.id, loggedUser.id);
	}

	componentDidUpdate(prevProps, prevState) {
		const { videos } = this.props;

		if (prevProps.videos !== videos) {
			this.setState({ loading: false });
		}
	}

	onThumbnailPress = async video => {
		const { navigation, setSingleVideoToPlay } = this.props;
		await setSingleVideoToPlay(video);
		navigation.push('SingleVideoPlayer');
	};

	render() {
		const { user, loading } = this.state;
		const { videos } = this.props;
		console.log(videos);
		return (
			<View style={profileStyle.container}>
				<View style={{ paddingTop: 10, paddingHorizontal: 16 }}>
					<View style={{ flexDirection: 'row' }}>
						<View style={profileStyle.profileContainer}>
							<Image source={{ uri: user.avatar }} style={profileStyle.profilePhoto} />
						</View>
						<View style={{ flex: 2, marginTop: 5, marginLeft: 10 }}>
							<Text style={profileStyle.userName}>{user.full_name}</Text>
							<Text style={profileStyle.bioInfo}>{user.bio}</Text>
						</View>
					</View>

					<View style={{ flexDirection: 'row', marginTop: 10 }}>
						<Button
							containerStyle={{ flex: 1 }}
							buttonStyle={{
								backgroundColor: colors.MAIN,
								paddingHorizontal: 13,
								paddingVertical: 10,
								borderRadius: 6
							}}
							titleStyle={{ fontSize: 11, fontFamily: fonts.OPENSANS_BOLD, color: '#fff' }}
							title="Follow"
							onPress={this.handleFollow}
						/>
						<Button
							containerStyle={{ flex: 1, marginHorizontal: 10 }}
							buttonStyle={{
								backgroundColor: '#FFF',
								paddingHorizontal: 13,
								paddingVertical: 9,
								borderRadius: 6,
								borderWidth: 1,
								borderColor: '#D8D8D8'
							}}
							titleStyle={{ fontSize: 11, fontFamily: fonts.OPENSANS_BOLD, color: '#575555' }}
							title="Message"
							onPress={this.handleSubmit}
						/>
						<Button
							containerStyle={{}}
							buttonStyle={{
								backgroundColor: '#FFF',
								padding: 7,
								borderRadius: 6,
								borderWidth: 1,
								borderColor: '#D8D8D8'
							}}
							icon={<FeatherIcon name="user" size={20} color="#2F2F2F" />}
							onPress={this.handleSubmit}
						/>
					</View>

					<View style={{}}>
						<View style={profileStyle.followersContainer}>
							<View style={{ alignItems: 'center' }}>
								<Text style={profileStyle.statsFollowers}>{numberAbbreviate(user.followers, 1)}</Text>
								<Text style={profileStyle.statsDescription}>Followers</Text>
							</View>
							<View style={{ alignItems: 'center' }}>
								<Text style={profileStyle.statsFollowers}>{numberAbbreviate(user.laughs, 1)}</Text>
								<Text style={profileStyle.statsDescription}>Laughs</Text>
							</View>
							<View style={{ alignItems: 'center' }}>
								<Text style={profileStyle.statsFollowers}>{numberAbbreviate(user.views, 1)}</Text>
								<Text style={profileStyle.statsDescription}>Views</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={{ flex: 1, borderTopWidth: 1, borderColor: '#e7e7e7' }}>
					<View style={[profileStyle.thumbnails, { borderBottomWidth: 2, borderColor: colors.MAIN }]}>
						<FeatherIcon name="video" size={26} color={colors.MAIN} />
					</View>
					<Loader show={loading} />
					<View style={{ flex: 1 }}>
						<FlatList
							data={videos}
							renderItem={this.renderItem}
							keyExtractor={item => item.id}
							numColumns={3}
							columnWrapperStyle={{
								justifyContent: 'space-between',
								alignContent: 'space-between',
								marginBottom: 1.5
							}}
						/>
					</View>
				</View>
			</View>
		);
	}

	renderItem = ({ item: video }) => (
		<TouchableOpacity onPress={() => this.onThumbnailPress(video)}>
			<View>
				<Image
					style={{
						width: screenWidth / 3 - 1.5,
						height: screenHeight / 4.5
					}}
					source={{ uri: video.thumbnail }}
				/>
			</View>
		</TouchableOpacity>
	);
}

const mapStateToProps = ({ user, videos }) => ({ loggedUser: user.loggedUser, videos: videos.userVideos });

export default connect(mapStateToProps, { getVideosByUser, setSingleVideoToPlay })(GeneralProfile);
