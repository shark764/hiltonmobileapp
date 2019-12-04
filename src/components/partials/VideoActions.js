import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { homeStyles as styles } from '../../assets/styles';
import { getShowHideStyle, numberAbbreviate } from '../../utils/helpers';

class VideoActions extends Component {
	state = {
		follow: true
	};

	onFollowPress = () => {
		this.setState({ follow: !this.state.follow });
	};

	render() {
		const { videoItem, showVideoInfo, onShowHideCommentsPress, onShareVideo, loggedUser } = this.props;

		return (
			<LinearGradient colors={['rgba(0, 0, 0,0)', 'rgba(0, 0, 0,0.4)']} style={styles.gradientContainer}>
				<View style={[styles.userContainer, getShowHideStyle(showVideoInfo)]}>
					<View style={styles.userImageContainer}>
						<View style={styles.userImageContainer2}>
							<Image
								source={{
									uri: videoItem.user.avatar || '/'
								}}
								resizeMode="contain"
								style={styles.userImage}
							/>
						</View>
					</View>
					<View>
						<View style={styles.userHandleContainer}>
							<Text style={styles.userHandleText}>@{videoItem.user.username}</Text>
							<Text style={styles.dotSeparator}>•</Text>
							<TouchableOpacity onPress={this.onFollowPress}>
								<Text style={styles.userFollowText}>{this.state.follow ? 'Follow' : 'Unfollow'}</Text>
							</TouchableOpacity>
						</View>
						<Text style={styles.videoCaptionText}>{videoItem.description}</Text>
					</View>
				</View>
				<View style={styles.actionContainer}>
					<View
						style={{
							borderRadius: 20,
							backgroundColor: videoItem.already_like ? '#FFF' : 'transparent',
							justifyContent: 'center',
							alignItems: 'center',
							width: 28,
							height: videoItem.already_like ? 28.7 : 30
						}}
					>
						<IconFontAwesome
							name="laugh-squint"
							size={30}
							color={'#999'}
							color={videoItem.already_like ? '#000' : '#FFF'}
							style={[
								videoItem.already_like && { marginTop: -0.5 },
								!videoItem.already_like && {
									textShadowColor: '#000',
									textShadowOffset: { width: 0.3, height: 0.3 },
									textShadowRadius: 1
								}
							]}
						/>
					</View>
					<Text style={styles.actionCounters}>{numberAbbreviate(videoItem.laughs, 1)}</Text>
					<TouchableOpacity onPress={onShowHideCommentsPress}>
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
					<Text style={[styles.actionCounters, { marginTop: 0 }]}>
						{numberAbbreviate(videoItem.comments, 1)}
					</Text>
					<TouchableOpacity onPress={onShareVideo}>
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
					<Text style={[styles.actionCounters, { marginTop: 0 }]}>
						{numberAbbreviate(videoItem.shares, 1)}
					</Text>

					<React.Fragment>
						<Icon
							name="eye"
							size={30}
							color={'#fff'}
							style={{
								textShadowColor: '#000000',
								textShadowOffset: { width: 0.3, height: 0.3 },
								textShadowRadius: 1
							}}
						/>
						<Text style={[styles.actionCounters, { marginTop: 0, marginBottom: 0 }]}>
							{numberAbbreviate(videoItem.views, 1)}
						</Text>
					</React.Fragment>
				</View>
			</LinearGradient>
		);
	}
}

const mapStateToProps = ({ user }) => ({ loggedUser: user.loggedUser });

export default connect(mapStateToProps, null)(VideoActions);
