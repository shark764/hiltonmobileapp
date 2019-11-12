import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { fonts } from '../../config/constants';

export default class SearchHeaderComponent extends Component {
	state = { searchQuery: '' };

	render() {
		const { searchQuery } = this.state;
		const { onSubmitSearch, onChangeText, value } = this.props;
		return (
			<View
				style={{
					justifyContent: 'center',
					borderBottomColor: '#D5D5D5',
					borderBottomWidth: 1
				}}
			>
				<Icon
					name="search"
					size={20}
					color={'#999999'}
					style={{ position: 'absolute', left: 30, zIndex: 100 }}
				/>
				<TextInput
					placeholder="Search"
					placeholderTextColor="#B9B9B9"
					style={{
						borderWidth: 1,
						padding: 10,
						paddingLeft: 40,
						marginHorizontal: 20,
						marginVertical: 10,
						borderRadius: 10,
						borderColor: '#D5D5D5',
						backgroundColor: '#ffffff',
						fontSize: 14,
						color: '#898989',
						fontFamily: fonts.OPENSANS_REGULAR
					}}
					onChangeText={onChangeText}
					onSubmitEditing={onSubmitSearch}
					value={value}
				/>
			</View>
		);
	}
}
