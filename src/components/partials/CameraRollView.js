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

const { height, width } = Dimensions.get('window');

export default class CameraRollView extends Component {
	static navigationOptions = () => ({ title: 'Camera Roll' });

	constructor(props) {
		super(props);

		this.state = {
			cameraRollVideos: [],
			loading: true
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
				<ScrollView>
					<View style={cameraRollStyle.rowsThumbnails}>{this.renderCameraRollVideos()}</View>
					<Loader show={loading} style={{ marginTop: '60%' }} />
				</ScrollView>
			</Container>
		);
	}
}
