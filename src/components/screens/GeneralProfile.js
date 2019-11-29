import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Content } from 'native-base';
import { Button } from 'react-native-elements';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { fonts, colors } from '../../config/constants';
import { profileStyle } from '../../assets/styles/profileStyle';
import { connect } from 'react-redux';
import { numberAbbreviate } from '../../utils/helpers';
import { getVideosByUser } from '../../redux/actions/videoActions';

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
			user: props.navigation.getParam('user')
		};
	}

	async componentDidMount() {
		const { loggedUser } = this.props;
		const { user } = this.state;

		await this.props.getVideosByUser(user.id, loggedUser.id);
	}

	onThumbnailPress = video => {
		this.props.navigation.push('SingleVideoPlayer', { video });
	};

	render() {
		const { user } = this.state;
		const { videos } = this.props;

		return (
			<View style={profileStyle.container}>
				<Content>
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

						<View style={{ flexDirection: 'row', marginTop: 20 }}>
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

						<View style={{ flex: 3 }}>
							<View style={profileStyle.followersContainer}>
								<View style={{ alignItems: 'center' }}>
									<Text style={profileStyle.statsFollowers}>
										{numberAbbreviate(user.followers, 1)}
									</Text>
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

					<View style={{ borderTopWidth: 1, borderColor: '#e7e7e7' }}>
						<View style={[profileStyle.thumbnails, { borderBottomWidth: 2, borderColor: colors.MAIN }]}>
							<FeatherIcon name="video" size={26} color={colors.MAIN} />
						</View>

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
				</Content>
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

const mapStateToProps = ({ auth, videos }) => ({ loggedUser: auth.loggedUser, videos: videos.userVideos });

export default connect(mapStateToProps, { getVideosByUser })(GeneralProfile);
