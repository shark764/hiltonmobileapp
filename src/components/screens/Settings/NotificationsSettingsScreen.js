import React, { Component } from 'react';
import { View, Text, Switch, Settings } from 'react-native';
import { connect } from 'react-redux';
import { getNotificationsSettings } from '../../../redux/actions/settingsAction';
import { NotificationsSettingsStyles as styles } from '../../../assets/styles';

class NotificationsSettingScreen extends Component {
	static navigationOptions = () => ({ title: 'Notification' });

	constructor(props) {
		super(props);
		this.state = {
			settings: null
		};
	}

	async componentDidMount() {
		await this.props.getNotificationsSettings();
	}

	componentDidUpdate(prevProps, prevState) {
		const { settings } = this.props;
		if (prevProps.settings !== settings) this.setState({ settings });
	}

	onInputChange = (value, field) => {
		const settings = { ...this.state.settings };
		settings[field] = value;
		this.setState({ settings });
	};

	render() {
		const { settings } = this.state;
		if (!settings) return null;

		return (
			<View style={{ flex: 1 }}>
				<View style={styles.oneItemContainer}>
					<Text style={styles.labelText}>Pause All</Text>
					<Switch
						value={settings['pauseAll']}
						onValueChange={val => {
							this.onInputChange(val, 'pauseAll');
						}}
					/>
				</View>
				<View style={styles.groupContainer}>
					<Text style={styles.groupHeaderText}>Posts and comments</Text>
					<View style={styles.groupItemContainer}>
						<Text style={styles.labelText}>Laughs</Text>
						<Switch
							value={settings['laughs']}
							onValueChange={val => {
								this.onInputChange(val, 'laughs');
							}}
						/>
					</View>
					<View style={styles.groupItemContainer}>
						<Text style={styles.labelText}>Comments on your videos</Text>
						<Switch
							value={settings['comments']}
							onValueChange={val => {
								this.onInputChange(val, 'comments');
							}}
						/>
					</View>
				</View>

				<View style={styles.groupContainer}>
					<Text style={styles.groupHeaderText}>Followers</Text>
					<View style={styles.groupItemContainer}>
						<Text style={styles.labelText}>New Follower</Text>
						<Switch
							value={settings['newFollower']}
							onValueChange={val => {
								this.onInputChange(val, 'newFollower');
							}}
						/>
					</View>
				</View>

				<View style={styles.groupContainer}>
					<Text style={styles.groupHeaderText}>Direct messages</Text>
					<View style={styles.groupItemContainer}>
						<Text style={styles.labelText}>Messages</Text>
						<Switch
							value={settings['messages']}
							onValueChange={val => {
								this.onInputChange(val, 'messages');
							}}
						/>
					</View>
				</View>
			</View>
		);
	}
}

const mapStateToProps = ({ settings }) => ({ settings: settings.notifications });

export default connect(
	mapStateToProps,
	{ getNotificationsSettings }
)(NotificationsSettingScreen);
