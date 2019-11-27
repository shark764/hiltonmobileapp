import React, { Component } from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import { fonts, colors, globals } from '../../../config/constants';
import LoginOrSignupScreen from './LoginOrSignupScreen';

export default class LoginOrSignupHomeScreen extends Component {
	render() {
		const { modalVisible, onCloseModal } = this.props;

		return (
			<Modal
				transparent={true}
				animationType="slide"
				visible={modalVisible}
				supportedOrientations={globals.SUPPORTED_ORIENTATIONS}
				//onRequestClose={onRequestClose}
			>
				<View style={{ justifyContent: 'flex-end', flex: 1, backgroundColor: '#00000055' }}>
					<View
						style={{ height: 550, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden' }}
					>
						<LoginOrSignupScreen onCloseModal={onCloseModal} />
						<TouchableOpacity
							onPress={onCloseModal}
							style={{
								position: 'absolute',
								right: 12,
								top: 12,
								fontFamily: fonts.OPENSANS_BOLD,
								fontSize: 20,
								color: '#A3A3A3'
							}}
						>
							<IconEvilIcons name="close" size={30} color={'#A3A3A3'} style={{}} />
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		);
	}
}
