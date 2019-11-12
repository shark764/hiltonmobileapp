import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import { homeStyles as styles } from '../../assets/styles';
import { getShowHideStyle, shareVideo } from '../../utils/helpers';

export default class VideoActions extends Component {
	state = {
		follow: true
	};

	onFollowPress = () => {
		this.setState({ follow: !this.state.follow });
	};

	shareVideo = async () => {
		const { videoItem } = this.props;

		await shareVideo(videoItem.url);
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
