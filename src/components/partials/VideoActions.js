import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import Share from 'react-native-share';
import { homeStyles as styles } from '../../assets/styles';
import { getShowHideStyle } from '../../utils/helpers';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import AlertMessages from '../commons/AlertMessages';

export default class VideoActions extends Component {
	state = {
		follow: true
	};

	onFollowPress = () => {
		this.setState({ follow: !this.state.follow });
	};

	shareVideo = async () => {
		try {
			const { videoItem } = this.props;

			const videoUrl = videoItem.url;
			const message = 'Look at my awesome video uploaded to Grape app';

			const blob = await RNFetchBlob.config({
				fileCache: true,
				appendExt: 'mp4'
			}).fetch('GET', videoUrl, {});

			const base64String = await blob.base64();
			let url = 'file://' + blob.path();

			if (Platform.OS === 'android') url = `data:video/mp4;base64,${base64String}`;

			const result = await Share.open({
				title: 'Grape Share',
				message: message,
				url
			});
			console.log('after result', result);
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
				console.log('dismissed');
			}
			console.log('here');
			//onResumeVideo();

			const exists = await RNFS.exists(blob.path());
			if (exists) await RNFS.unlink(blob.path());
		} catch (error) {
			if (error.message && error.message.indexOf('User did') === -1) AlertMessages.error(error.message);
		}
	};

	render() {
		const { videoItem, showVideoInfo } = this.props;
		return (
			<LinearGradient colors={['rgba(0, 0, 0,0)', 'rgba(0, 0, 0,0.4)']} style={styles.gradientContainer}>
				<View style={[styles.userContainer, getShowHideStyle(showVideoInfo)]}>
					<View style={styles.userImageContainer}>
						<View style={styles.userImageContainer2}>
							<Image
								source={{
									uri: videoItem.user.img
								}}
								resizeMode="contain"
								style={styles.userImage}
							/>
						</View>
					</View>
					<View>
						<View style={styles.userHandleContainer}>
							<Text style={styles.userHandleText}>{videoItem.user.handle}</Text>
							<Text style={styles.dotSeparator}>•</Text>
							<TouchableOpacity onPress={this.onFollowPress}>
								<Text style={styles.userFollowText}>{this.state.follow ? 'Follow' : 'Unfollow'}</Text>
							</TouchableOpacity>
						</View>
						<Text style={styles.videoCaptionText}>{videoItem.caption}</Text>
					</View>
				</View>
				<View style={styles.actionContainer}>
					<IconFontAwesome
						name="laugh-squint"
						size={30}
						color={'#fff'}
						style={{
							textShadowColor: '#000000',
							textShadowOffset: { width: 0.3, height: 0.3 },
							textShadowRadius: 1
						}}
					/>
					<Text style={styles.actionCounters}>24k</Text>
					<TouchableOpacity onPress={this.props.onShowHideCommentsPress}>
						<Icon
							name="message-square"
							size={30}
							color={'#fff'}
							style={{
								textShadowColor: '#000000',
								textShadowOffset: { width: 0.3, height: 0.3 },
								textShadowRadius: 1
							}}
						/>
					</TouchableOpacity>
					<Text style={[styles.actionCounters, { marginTop: 0 }]}>9k</Text>
					<TouchableOpacity onPress={this.shareVideo}>
						<Icon
							name="share"
							size={30}
							color={'#fff'}
							style={{
								textShadowColor: '#000000',
								textShadowOffset: { width: 0.3, height: 0.3 },
								textShadowRadius: 1
							}}
						/>
					</TouchableOpacity>
				</View>
			</LinearGradient>
		);
	}
}
