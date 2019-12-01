'use strict';
import React, { Component } from 'react';
import { Dimensions, PermissionsAndroid } from 'react-native';
import { Container } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import RNVideoEditor from 'react-native-video-editor';
import CameraRoll from '@react-native-community/cameraroll';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { cameraStyle } from '../../assets/styles/cameraStyle';
import CameraElement from '../partials/CameraElement';
import FeedbackVideo from '../partials/FeedbackVideo';
import { goToRootRouteFromSibling } from '../../utils/helpers';

const checkAndroidPermission = async () => {
	try {
		const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
		await PermissionsAndroid.request(permission);
		Promise.resolve();
	} catch (error) {
		Promise.reject(error);
	}
};

const MAX_VIDEO_SIZE = 9000;
const MIN_VIDEO_SIZE = 5000;
class CameraScreen extends Component {
	constructor(props) {
		super(props);
	}
	state = {
		recording: false,
		progress: 0,
		animationId: 0,
		processing: false,
		pause: false,
		continue: false,
		captureAudio: true,
		//cameraType : 'back',
		//mirrorMode : false,
		feedbackSegment: false, //must be false to start
		currentSegment: '',
		videoType: 'video/mp4',
		videoSegment: []
	};

	componentDidMount() {
		this.setState({ progress: 0, continue: false, feedbackSegment: false, videoSegment: [] });
	}

	componentDidUpdate(prevProps, prevState) {
		const { loggedUser } = this.props;
		if (!loggedUser) goToRootRouteFromSibling('Profile');
	}

	chekIfLogged = () => {
		const { loggedUser } = this.props;
		if (!loggedUser) goToRootRouteFromSibling('Profile');
	};

	goBack() {
		console.log('go back.....');
		this.stopRecording();
		this.setState({ progress: 0, continue: false, feedbackSegment: false, videoSegment: [] });
		this.props.navigation.goBack(null);
	}

	showSegments() {
		let { videoSegment } = this.state;
		console.log('----------------------------------------------------');
		videoSegment.map(segment => console.log(' segment :  ' + JSON.stringify(segment)));
		console.log('----------------------------------------------------');
	}

	async startRecording() {
		if (this.state.progress > 99) return;
		this.animateProgress();
		this.setState({ recording: true, captureAudio: true });

		try {
			let { uri, codec = 'mp4' } = await this.camera.recordAsync();
			let videoType = `video/${codec}`;

			this.setState({
				recording: false,
				currentSegment: uri,
				feedbackSegment: true,
				videoType,
				captureAudio: false
			});

			if ((this.state.progress * MAX_VIDEO_SIZE) / 100 > MIN_VIDEO_SIZE)
				//it means at least 5 seconds of the current record.
				this.setState({ continue: true });
		} catch (err) {
			console.warn(err);
		}
	}

	stopRecording() {
		if (this.state.recording) {
			clearInterval(this.state.animationId);
			this.camera.stopRecording();
			console.log('stop recording....');
		}
	}

	animateProgress() {
		console.log('start animation progress...');
		if (this.state.progress > 99) {
			//this.setState({progress : 0});// we can go back by remove the last section
			this.stopRecording();
			return;
		}
		let animationId = setInterval(() => {
			if (this.state.progress > 99) {
				//this.setState({progress : 0});// we can go back by remove the last section
				this.stopRecording();
			}
			this.setState({ progress: this.state.progress + 1 });
		}, MAX_VIDEO_SIZE / 100); //with step of 1%
		this.setState({ animationId });
	}

	compileVideo() {
		//let {videoSegment = [] , progress} = this.state;
		console.log('Compiling Video....');
		this.setState({ feedbackSegment: false });

		let { videoSegment, progress, currentSegment, videoType } = this.state;
		videoSegment.push({
			segment: progress,
			realTime: progress > 0 ? (progress * MAX_VIDEO_SIZE) / 100 : 0,
			url: currentSegment,
			type: videoType
		});
		this.setState({ videoSegment: videoSegment, currentSegment: '' });

		this.showSegments();
	}

	redoVideo() {
		let { videoSegment } = this.state;
		console.log('Retake the last section of the video...');
		if (videoSegment.length > 0) {
			videoSegment.pop(); //removing the last video
			if (videoSegment.length === 0) this.setState({ progress: 0, continue: false });
			else {
				let last_segment = videoSegment[videoSegment.length - 1];
				this.setState({ progress: last_segment.segment });
				if (last_segment.segment < MIN_VIDEO_SIZE / 100) this.setState({ continue: false });
			}
		}
		this.setState({ feedbackSegment: false });
		this.showSegments();
	}

	async continueToPost() {
		let { videoSegment } = this.state;
		if (this.state.currentSegment) this.compileVideo();

		let temp = videoSegment[0].url.split("file://");
		if (this.state.continue) {
			if(videoSegment.length===1){
				this.props.navigation.navigate('PostVideo',{videoToPost : temp[1],
																										duration : videoSegment[0].realTime / 1000});
			}
			if(videoSegment.length > 1){
				RNVideoEditor.merge(
					videoSegment.map(item => item.url),
					(results) => {
						console.error('Error: ' + results);
					},
					async (results, file) => {
						console.log('Success : ' + results + " file: " + file);
						this.props.navigation.navigate('PostVideo',{videoToPost : file,
																												duration : videoSegment[videoSegment.length - 1].realTime / 1000});
					}
				);
			}
		} else 
			console.log('nothing to save or post');
	}

	async getVideosRoll() {
		if (Platform.OS === 'android') {
			await checkAndroidPermission();
		}
		CameraRoll.getPhotos({
			first: 10,
			//groupTypes: 'All',
			assetType: 'Videos'
		})
			.then(data => {
				//console.log('it works....', data.edges);
				//console.log(`The data is : ${JSON.stringify(data.edges)}`)
				this.props.navigation.push('CameraRoll', { cameraRollItems: data.edges });
				//this.props.navigation.navigate('CameraRoll',{cameraRollItems: JSON.stringify(data.edges)})
			})
			.catch(e => console.warn(e));
	}

	setCameraReference(ref) {
		this.camera = ref;
	}

	getLastSegment() {
		let { videoSegment = [] } = this.state;
		if (videoSegment.length) {
			let lastSegment = videoSegment[videoSegment.length - 1];
			console.log(`Current Segment : ${lastSegment.url}`);
			this.setState({ currentSegment: lastSegment.url });
		}
	}

	render() {
		const { feedbackSegment } = this.state;
		return (
			<Container style={cameraStyle.container}>
				<NavigationEvents onDidFocus={this.chekIfLogged} />

				<CameraElement
					reference={ref => {
						this.setCameraReference(ref);
					}}
					progress={this.state.progress}
					goBack={() => this.goBack()}
					//flipCamera={() => this.flipCamera()}
					getVideosRoll={() => this.getVideosRoll()} //TODO: actually isn't working...
					startRecording={() => this.startRecording()}
					stopRecording={() => this.stopRecording()}
					videoSegments={this.state.videoSegment}
					redoVideo={() => this.redoVideo()}
					compileVideo={() => this.compileVideo()}
					continue={this.state.continue}
					continueToPost={() => this.continueToPost()}
					processing={this.state.processing}
					compile={this.state.progress >= MIN_VIDEO_SIZE / 100 ? 1 : 0}
					hideCamera={feedbackSegment}
				/>

				<FeedbackVideo
					source={this.state.currentSegment}
					goBack={() => this.goBack()}
					redoVideo={() => this.redoVideo()}
					compileVideo={() => this.compileVideo()}
					continueToPost={() => this.continueToPost()}
					continue={this.state.continue}
					progress={this.state.progress}
				/>
			</Container>
		);
	}
}

const mapStateToProps = ({ auth }) => ({ loggedUser: auth.loggedUser });

export default connect(mapStateToProps, null)(CameraScreen);
