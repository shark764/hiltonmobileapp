import React, { Component } from 'react';
import {
	StatusBar,
	View,
	Text,
	StyleSheet,
	Image,
	Dimensions,
	FlatList,
	ScrollView,
	TouchableOpacity,
	Platform
} from 'react-native';
import { Container, Content, Icon, Header, Left, Body, Right, Segment, Button } from 'native-base';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'; //https://oblador.github.io/react-native-vector-icons/
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-community/async-storage';
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';
import { fonts, colors } from '../../config/constants';
import { cameraRollStyle } from '../../assets/styles/cameraRollStyle';
import RNConvertPhAsset from 'react-native-convert-ph-asset';
import Loader from '../commons/Loader';
import { element } from 'prop-types';
import { VideoPlayer, Trimmer } from 'react-native-video-processing';

const { height, width } = Dimensions.get('window');

export default class CameraRollView extends Component {
	static navigationOptions = () => ({ title: 'Camera Roll' });

	constructor(props) {
		super(props);

		this.state = {
			cameraRollVideos: [],
			loading: true,
			videoSelected: ''
		};
	}

	async componentDidMount() {
		let elements = this.props.navigation.getParam('cameraRollItems', []);

		//We need to await all th promises inside de map function
		const videos = await this.setUpVideosFromCameraRoll(elements);

		//console.log(videos);
		//videos.filter((video) => video.playableDuration>=5)//filter all the videos greater than 5 seconds.
		this.setState({ cameraRollVideos: videos, loading: false });
	}

	setUpVideosFromCameraRoll = async elements => {
		return await Promise.all(
			elements.map(async item => {
				let { playableDuration, filename, uri } = item.node.image;
				let id = filename.split('.')[0];

				//If ios we need to convert the file from phAsset format to a previous
				//path supported by RN Videos
				if (Platform.OS === 'ios') {
					try {
						const convertedVideo = await RNConvertPhAsset.convertVideoFromUrl({
							url: uri,
							convertTo: 'mov',
							quality: 'original'
						});

						filename = convertedVideo.filename;
						uri = convertedVideo.path;
					} catch (error) {
						return { id };
					}
				}

				return {
					playableDuration,
					filename,
					uri,
					id
				};
			})
		);
	};

	goBack() {
		console.log('go back.....');
		this.props.navigation.goBack(null);
	}

	editThisVideo(url) {
		console.log(`About to edit this video : ${url}`);
		this.setState({videoSelected : url})
	}

	renderCameraRollVideos() {
		let { cameraRollVideos = [] } = this.state;

		if (!cameraRollVideos.length) return;

		return cameraRollVideos.map((element, index) => {
			if (!element.uri) return;

			return (
				<TouchableOpacity key={element.id} onPress={() => this.editThisVideo(element.uri)}>
					<View
						key={element.id}
						style={[
							{ width: width / 3, height: width / 2, marginBottom: 2 },
							index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }
						]}
					>
						<Video
							source={{ uri: element.uri }}
							repeat
							resizeMode="cover"
							volume={0}
							style={[{ width: '100%', height: '100%', marginBottom: 2 }]}
							onPress={element => this.editThisVideo(element)}
						/>
					</View>
				</TouchableOpacity>
			);
		});
	}

//video editing
trimVideo() {
	const options = {
			startTime: 0,
			endTime: 9,
			quality: VideoPlayer.Constants.quality.QUALITY_1280x720, // iOS only
			saveToCameraRoll: true, // default is false // iOS only
			saveWithCurrentDate: true, // default is false // iOS only
	};
	this.videoPlayerRef.trim(options)
			.then((newSource) => console.log(newSource))
			.catch(console.warn);
}

compressVideo() {
	const options = {
			width: 720,
			height: 1280,
			bitrateMultiplier: 3,
			saveToCameraRoll: true, // default is false, iOS only
			saveWithCurrentDate: true, // default is false, iOS only
			minimumBitrate: 300000,
			removeAudio: true, // default is false
	};
	this.videoPlayerRef.compress(options)
			.then((newSource) => console.log(newSource))
			.catch(console.warn);
}

getPreviewImageForSecond(second) {
	const maximumSize = { width: 640, height: 1024 }; // default is { width: 1080, height: 1080 } iOS only
	this.videoPlayerRef.getPreviewForSecond(second, maximumSize) // maximumSize is iOS only
	.then((base64String) => console.log('This is BASE64 of image', base64String))
	.catch(console.warn);
}

getVideoInfo() {
	this.videoPlayerRef.getVideoInfo()
	.then((info) => console.log(info))
	.catch(console.warn);
}

	render() {
		const { loading } = this.state;
		return (
			<Container style={{ flex: 1, flexDirection: 'column' }}>
				{
					//********HEADER*********** */
				}
				<View style={cameraRollStyle.header}>
					<View style={{ padding: 10 }}>
						<Ionicon name="md-arrow-back" style={cameraRollStyle.backIcon} onPress={() => this.goBack()} />
					</View>
					<View style={{ paddingLeft: width * 0.3 }}>
						<Text style={cameraRollStyle.title}> Camera Roll </Text>
					</View>
				</View>
				{
					this.state.videoSelected?
						<ScrollView style={{padding: 10}}>
                <VideoPlayer
                    ref={ref => this.videoPlayerRef = ref}
                    startTime={5}  // seconds
                    endTime={10}   // seconds
                    play={true}     // default false
                    replay={true}   // should player play video again if it's ended
                    rotate={true}   // use this prop to rotate video if it captured in landscape mode iOS only
                    source={this.state.videoSelected}
                    playerWidth={300} // iOS only
                    playerHeight={500} // iOS only
                    //style={{ background: 'black' }}
                    resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
                    onChange={({ nativeEvent }) => console.log({ nativeEvent })} // get Current time on every second
                />
                <Trimmer
                    source={this.state.videoSelected}
                    height={100}
                    width={300}
                    onTrackerMove={(e) => console.log(e.currentTime)} // iOS only
                    //currentTime={this.video.currentTime} // use this prop to set tracker position iOS only
                    themeColor={'white'} // iOS only
                    thumbWidth={50} // iOS only
                    trackerColor={'green'} // iOS only
										onChange={(e) => console.log(e.startTime, e.endTime)}
										style={{paddingLeft: 10, paddingRight: 10}}
                />
					</ScrollView>
					:<ScrollView>
					<View style={cameraRollStyle.rowsThumbnails}>{this.renderCameraRollVideos()}</View>
					<Loader show={loading} style={{ marginTop: '60%' }} />
				</ScrollView>
				}
			</Container>
		);
	}
}
