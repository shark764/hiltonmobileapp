import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { fonts, colors } from '../../config/constants';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import LineSeparator from './LineSeparator';

export default class ModalPopup extends Component {
	componentDidUpdate(prevProps) {
		const { visible } = this.props;
		if (prevProps.visible !== visible) this.setState({ visible: visible });
	}

	_onConfirmPressed = () => {
		const { onConfirmPressed } = this.props;
		onConfirmPressed();
	};

	_onCancelPressed = () => {
		const { onCancelPressed } = this.props;
		onCancelPressed();
	};

	render() {
		const { visible, title, children, cancelBtnText, confirmBtnText } = this.props;

		return (
			<Modal isVisible={visible} style={styles.modal}>
				<View style={styles.mainContainer}>
					{!!title && (
						<React.Fragment>
							<Text style={styles.title}>{title}</Text>
							<LineSeparator />
						</React.Fragment>
					)}
					<ScrollView>
						<Text style={styles.contentText}>{children}</Text>
						<View style={styles.footer}>
							{!!confirmBtnText && (
								<Button
									containerStyle={{ flex: 1, marginHorizontal: 10 }}
									buttonStyle={styles.button}
									titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: '#fff' }}
									title={confirmBtnText}
									onPress={this._onConfirmPressed}
								/>
							)}
							{!!cancelBtnText && (
								<Button
									containerStyle={{ flex: 1 }}
									buttonStyle={styles.button}
									titleStyle={{ fontSize: 19, fontFamily: fonts.OPENSANS_BOLD, color: '#fff' }}
									title={cancelBtnText}
									onPress={this._onCancelPressed}
								/>
							)}
						</View>
					</ScrollView>
				</View>
			</Modal>
		);
	}
}

ModalPopup.defaultProps = {
	title: '',
	visible: true,
	titleStyle: {},
	confirmBtnText: '',
	cancelBtnText: '',
	onConfirmPressed: () => {},
	onCancelPressed: () => {}
};

ModalPopup.propTypes = {
	//mode: PropTypes.oneOf(['date', 'datetime', 'time']),
	title: PropTypes.string,
	titleStyle: PropTypes.object,
	onConfirmPressed: PropTypes.func,
	onCancelPressed: PropTypes.func,
	confirmBtnText: PropTypes.string,
	cancelBtnText: PropTypes.string
};

const styles = {
	modal: { paddingVertical: 50 },
	mainContainer: { backgroundColor: 'white', borderRadius: 10, padding: 16 },
	title: {
		fontFamily: fonts.OPENSANS_BOLD,
		fontSize: 16,
		color: '#2F2F2F',
		textAlign: 'center'
	},
	contentText: {
		fontFamily: fonts.OPENSANS_REGULAR,
		fontSize: 14,
		color: '#2F2F2F',
		marginBottom: 20,
		textAlign: 'justify'
	},
	footer: { flex: 1, flexDirection: 'row' },
	button: {
		backgroundColor: colors.MAIN,
		padding: 16,
		borderRadius: 6
	}
};
