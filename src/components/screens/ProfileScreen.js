import React, { Component } from 'react';
import { StatusBar, View, Text, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import { Container, Content, Icon, Header, Left, Body, Right, Segment, Button } from 'native-base';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'; //https://oblador.github.io/react-native-vector-icons/
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-community/async-storage';
//import CardComponent from '../partials/CardComponent'
import * as Progress from 'react-native-progress';
import { fonts, colors } from '../../config/constants';
import { profileStyle } from '../../assets/styles/profileStyle';
import { connect } from 'react-redux';

const { height, width } = Dimensions.get('window');

class ProfileScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeIndex: 0,
			my_images: [],
			my_laughs: [],
			profile_info: {},
			url_video: []
		};
		this._isMounted = false;
	}

	getImages = () => {
		let { url_video } = this.state;
		let my_images = [
			{
				id: 1,
				url:
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnm5J_F7bcAJiIFd4UcmVTUWxjJk2e24EHJRqMQCsegfWqLTQe&s'
			},
			{
				id: 2,
				url: 'https://i.ytimg.com/vi/VzfxsPPd1XY/maxresdefault.jpg'
			},
			{
				id: 3,
				url: 'https://qph.fs.quoracdn.net/main-qimg-2a3ea44dc8b0252a98a5ca5d65edf9b1.webp'
			},
			{
				id: 4,
				url:
					'https://vignette.wikia.nocookie.net/injusticegodsamongus/images/5/52/Red_Arrow_4.jpg/revision/latest?cb=20130610053026'
			},
			{
				id: 5,
				url:
					'https://img.purch.com/o/aHR0cDovL3d3dy5uZXdzYXJhbWEuY29tL2ltYWdlcy9pLzAwMC8yNjIvNjE4L2kwMi9GbGFzaF8xLmpwZw=='
			},
			{
				id: 6,
				url: 'https://images-na.ssl-images-amazon.com/images/I/81D%2BXXEnHBL._SY550_.jpg'
			},
			{
				id: 7,
				url:
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRy2C4IW089Yyk1laXnV7MQ4FKD6h6LWyD7vYCw1WVV8O2LlWu&s'
			},
			{
				id: 8,
				url: 'http://media.comicbook.com/2016/05/scarlet-witch-powers-181506.jpg'
			},
			{
				id: 9,
				url: 'https://i.ebayimg.com/images/g/sKIAAOSwGjpXTMV2/s-l300.jpg'
			},
			{
				id: 10,
				url:
					'https://data.junkee.com/wp-content/uploads/2016/02/deadpool-movie-2015-thumbs-up-mditd0fn2czy3ps40jx65quje2tgdkslj5zcgyqd4o.jpg'
			},
			{
				id: 11,
				url:
					'https://www.trendsinternational.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/6/16528_-_carnage_-_classic.jpg'
			},
			{
				id: 12,
				url:
					'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/spiderman-lead-1535732273.jpg?resize=480:*'
			}
		];
		if (url_video) {
			my_images.unshift({
				id: 0,
				url:
					'https://embedwistia-a.akamaihd.net/deliveries/a95027e53ba655716cf130adc7a3cef8d3c2c53c.webp?image_crop_resized=1280x720' //url_video
			});
		}

		this.setState({ my_images });
	};

	getLaughs = () => {
		const my_laughs = [
			{
				id: 1,
				url: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1387736135l/19776328.jpg'
			},
			{
				id: 2,
				url:
					'https://img1.looper.com/img/gallery/rumor-report-is-marvel-really-making-captain-america-4/intro-1571140919.jpg'
			},
			{
				id: 3,
				url: 'https://static3.cbrimages.com/wordpress/wp-content/uploads/2018/09/jim-lee-manhattan.jpg'
			},
			{
				id: 4,
				url: 'https://seanmills6.files.wordpress.com/2017/05/blue-list-04.jpg?w=501&h=519'
			},
			{
				id: 5,
				url: 'https://upload.wikimedia.org/wikipedia/en/d/d4/BluejayDC.jpg'
			},
			{
				id: 6,
				url:
					'https://vignette.wikia.nocookie.net/superheroes/images/9/98/Blue_beetle_by_2013-d3a6gdd.png/revision/latest?cb=20140221233228'
			},
			{
				id: 7,
				url: 'https://www.sideshow.com/product-asset/904209/feature'
			},
			{
				id: 8,
				url: 'https://www.indiewire.com/wp-content/uploads/2019/04/Tick_205_11118_RT_fnl_rgb-e1554411994805.jpg'
			},
			{
				id: 9,
				url: 'https://i.pinimg.com/originals/52/5a/e4/525ae4e03124ec2539fe8ae3e71733f1.jpg'
			},
			{
				id: 10,
				url:
					'data:image/jpeg;base64,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'
			},
			{
				id: 11,
				url: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2019/09/Fantastic-Four-Team-Roster.jpg'
			},
			{
				id: 12,
				url:
					'https://i.pinimg.com/474x/32/a8/5e/32a85e70b758a24552cbc35664d6e6bb--apocalypse-x-men-apocalypse-character.jpg'
			}
		];
		this.setState({ my_laughs });
	};

	getProfileInfo = () => {
		const profile_info = {
			userId: '@chrispratt',
			profilePhoto:
				'https://content.swncdn.com/godvine/uploads/2017/01/image_1484237418_godupdates_actor_Chris_Pratt_shared_his_testimony_finding_god_at_grocery_fb.jpg',
			bioInfo: 'Bio, description, etc...'
		};
		this.setState({ profile_info });
	};

	async componentDidMount() {
		this._isMounted = true;
		let url_video = await AsyncStorage.getItem('videoToPost');
		url_video = JSON.parse(url_video);
		if (this._isMounted) {
			this.setState({ url_video, paused: false });
			//console.log('..................................');
			//console.log(this.state.url_video);
			//console.log('..................................');
			await this.getImages();
			await this.getLaughs();
			await this.getProfileInfo();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { loggedUser } = this.props;
		//console.log('fromProfile id update: ', loggedUser);
		if (!loggedUser) this.props.navigation.replace('LoginOrSignup', { fromScreen: 'Profile' });
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	goToSettings() {
		this.props.navigation.push('Settings');
	}

	goToDirectMessages() {
		this.props.navigation.push('DirectMessageDashboard');
	}

	segmentClicked(index) {
		this.setState({
			activeIndex: index
		});
	}

	renderMyVideos() {
		return this.state.my_images.map((image, index) => {
			return (
				<View
					key={image.id}
					style={[
						{ width: width / 3 },
						{ height: width / 2 },
						{ marginBottom: 2 },
						index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
					]}
				>
					<Image style={profileStyle.image} source={{ uri: image.url }}></Image>
				</View>
			);
		});
	}

	renderMyLaughs() {
		return this.state.my_laughs.map((image, index) => {
			return (
				<View
					key={index}
					style={[
						{ width: width / 3 },
						{ height: width / 2 },
						{ marginBottom: 2 },
						index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
					]}
				>
					<Image style={profileStyle.image} source={{ uri: image.url }}></Image>
				</View>
			);
		});
	}

	renderSection(urls) {
		if (this.state.activeIndex == 0) {
			return <View style={profileStyle.rowsThumbnails}>{this.renderMyVideos()}</View>;
		} else if (this.state.activeIndex == 1) {
			return <View style={profileStyle.rowsThumbnails}>{this.renderMyLaughs()}</View>;
		}
	}

	render() {
		const { loggedUser } = this.props;
		if (!loggedUser) return null;

		return (
			<Container style={profileStyle.container}>
				<Header style={profileStyle.header}>
					<Left>
						<Ionicon name="md-settings" style={{ fontSize: 25 }} onPress={() => this.goToSettings()} />
					</Left>
					<Right>
						<Ionicon
							name="md-paper-plane"
							style={{ fontSize: 25 }}
							onPress={() => this.goToDirectMessages()}
						/>
					</Right>
				</Header>
				<Content>
					<View style={{ paddingTop: 25, paddingBottom: 15 }}>
						<View style={{ flex: 3 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
								<View style={{ paddingLeft: 10, alignItems: 'center' }}>
									<Text style={profileStyle.price}>$0.00</Text>
								</View>
								<View style={{ alignItems: 'center' }}>
									<Text style={profileStyle.price}>$455.00</Text>
								</View>
								<View style={{ alignItems: 'center' }}>
									<Text style={profileStyle.price}>$1000.00</Text>
								</View>
							</View>
						</View>
						<View style={{ paddingLeft: 15, alignItems: 'center' }}>
							<Progress.Bar progress={0.45} height={14} width={width * 0.7} color="#404040" />
						</View>
					</View>
					<View style={{ paddingTop: 10 }}>
						<View style={{ flexDirection: 'row' }}>
							<View style={profileStyle.profileContainer}>
								<Image source={{ uri: loggedUser.avatar }} style={profileStyle.profilePhoto} />
							</View>
							<View style={{ flex: 2, paddingTop: 20 }}>
								<Text style={profileStyle.userName}>@{loggedUser.username}</Text>
								<Text style={profileStyle.bioInfo}>{loggedUser.bio}</Text>
							</View>
						</View>

						<View style={{ flex: 3 }}>
							<View style={profileStyle.followersContainer}>
								<View style={{ alignItems: 'center' }}>
									<Text style={profileStyle.statsFollowers}>9K</Text>
									<Text style={profileStyle.statsDescription}>Followers</Text>
								</View>
								<View style={{ alignItems: 'center' }}>
									<Text style={profileStyle.statsFollowers}>12K</Text>
									<Text style={profileStyle.statsDescription}>Laughs</Text>
								</View>
								<View style={{ alignItems: 'center' }}>
									<Text style={profileStyle.statsFollowers}>128K</Text>
									<Text style={profileStyle.statsDescription}>Views</Text>
								</View>
							</View>
							{/*
                              <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingTop: 10 }}>
                                  <View style={{ flexDirection: 'row' }}>
                                      <Button bordered dark style={{ flex: 3, marginLeft: 10, justifyContent: 'center', height: 30 }}>
                                        <Text>Edit Profile</Text>
                                      </Button>

                                      <Button bordered dark style={{
                                                                    flex: 1,
                                                                    height: 30,
                                                                    marginRight: 10, marginLeft: 5,
                                                                    justifyContent: 'center'
                                      }}>
                                          <Icon name="settings" style={{ color: 'black' }}></Icon>
                                      </Button>
                                  </View>
                              </View>
                              */}
						</View>
					</View>

					<View>
						<View style={profileStyle.thumbnails}>
							<Button
								onPress={() => this.segmentClicked(0)}
								transparent
								active={this.state.activeIndex == 0}
							>
								<CommunityIcon
									name="video-outline"
									style={[
										{ fontSize: 30 },
										this.state.activeIndex == 0 ? { color: colors.MAIN } : { color: colors.GRAY }
									]}
								/>
							</Button>
							<Button
								onPress={() => this.segmentClicked(1)}
								transparent
								active={this.state.activeIndex == 1}
							>
								<FontIcon
									name="laughing"
									style={[
										{ fontSize: 30 },
										this.state.activeIndex == 1 ? { color: colors.MAIN } : { color: colors.GRAY }
									]}
								/>
							</Button>
						</View>

						{this.renderSection()}
					</View>
				</Content>
			</Container>
		);
	}
}

const mapStateToProps = ({ auth }) => ({ loggedUser: auth.loggedUser });

export default connect(mapStateToProps, null)(ProfileScreen);
