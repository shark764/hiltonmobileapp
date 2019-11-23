import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { homeStyles as styles } from '../../assets/styles';
import { getShowHideStyle } from '../../utils/helpers';

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
					<Text style={styles.actionCounters}>{videoItem.laughs}</Text>
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
					<Text style={[styles.actionCounters, { marginTop: 0 }]}>{videoItem.comments}</Text>
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
					<Text style={[styles.actionCounters, { marginTop: 0 }]}>{videoItem.shares}</Text>
					{loggedUser && loggedUser.id === videoItem.user.id && (
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
								{videoItem.views}
							</Text>
						</React.Fragment>
					)}
				</View>
			</LinearGradient>
		);
	}
}

const mapStateToProps = ({ auth }) => ({ loggedUser: auth.loggedUser });

export default connect(mapStateToProps, null)(VideoActions);
