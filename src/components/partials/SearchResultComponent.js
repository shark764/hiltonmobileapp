import React, { Component } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { fonts, globals } from '../../config/constants';

export default class SearchResultComponent extends Component {
	state = { following: false };

	onFollow = item => {
		const { following } = this.state;
		this.setState({});
		item.following = !item.following;
	};

	onResultPress = () => {};

	render() {
		const { searchResults } = this.props;
		return (
			<View style={{ backgroundColor: '#fff', paddingVertical: 20, paddingHorizontal: 16 }}>
				<Text
					style={{
						marginBottom: 20,
						fontFamily: fonts.OPENSANS_SEMI_BOLD,
						fontSize: 16,
						color: '#454545'
					}}
				>
					Suggested
				</Text>
				<FlatList
					data={searchResults}
					renderItem={this.renderItem}
					keyExtractor={item => item.id.toString()}
					contentContainerStyle={{ paddingBottom: globals.NAVBAR_HEIGHT }}
				/>
			</View>
		);
	}

	renderItem = ({ item: result }) => {
		return (
			<TouchableOpacity onPress={this.onResultPress}>
				<View
					style={{
						flexDirection: 'row',
						marginBottom: 20,
						width: '100%'
					}}
				>
					<Image
						source={{
							uri: result.image
						}}
						resizeMode="contain"
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							borderWidth: 1,
							alignItems: 'center',
							borderColor: '#2F2F2F'
						}}
					/>
					<View style={{ paddingLeft: 10, flex: 1, flexShrink: 1 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
							<Text style={{ fontFamily: fonts.OPENSANS_SEMI_BOLD, fontSize: 14 }}>{result.handle}</Text>
							<Text
								style={{
									marginLeft: 10,
									fontFamily: fonts.OPENSANS_REGULAR,
									fontSize: 14
								}}
							>
								{result.fullName}
							</Text>
							<Button
								onPress={() => this.onFollow(result)}
								buttonStyle={{
									borderWidth: 1,
									borderColor: '#D5D5D5',
									borderRadius: 6,
									backgroundColor: '#fff',
									paddingVertical: 2,
									marginLeft: 10
								}}
								titleStyle={{
									color: '#2F2F2F',
									fontSize: 13,
									fontFamily: fonts.OPENSANS_SEMI_BOLD
								}}
								title={result.following ? 'Following' : '+ Follow'}
							/>
						</View>

						<View style={{ flexDirection: 'row' }}>
							<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 12, color: '#2F2F2F' }}>
								{result.followers} Followers
							</Text>
							<Text style={{ marginHorizontal: 10 }}>•</Text>
							<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 12, color: '#2F2F2F' }}>
								{result.laughs} Laughs
							</Text>
							<Text style={{ marginHorizontal: 10 }}>•</Text>
							<Text style={{ fontFamily: fonts.OPENSANS_REGULAR, fontSize: 12, color: '#2F2F2F' }}>
								{result.views} Views
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	};
}