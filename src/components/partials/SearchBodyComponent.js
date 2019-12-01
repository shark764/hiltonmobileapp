import React, { Component } from 'react';
import { Text, View, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { fonts } from '../../config/constants';
import { setSingleVideoToPlay } from '../../redux/actions/videoActions';
import { connect } from 'react-redux';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

class SearchBodyComponent extends Component {
	onThumbnailPress = async video => {
		const { navigation, setSingleVideoToPlay } = this.props;
		await setSingleVideoToPlay(video);
		navigation.push('SingleVideoPlayer');
	};

	render() {
		const { trendingVideos } = this.props;
		return (
			<View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
				<Text
					style={{
						marginVertical: 20,
						marginHorizontal: 16,
						color: '#454545',
						fontFamily: fonts.OPENSANS_SEMI_BOLD,
						fontSize: 16
					}}
				>
					Trending
				</Text>
				<FlatList
					data={trendingVideos}
					renderItem={this.renderItem}
					keyExtractor={item => item.id}
					numColumns={3}
					columnWrapperStyle={{
						justifyContent: 'space-between',
						alignContent: 'space-between',
						marginBottom: 1.5
					}}
				/>
			</View>
		);
	}

	renderItem = ({ item: video }) => (
		<TouchableOpacity onPress={() => this.onThumbnailPress(video)}>
			<View>
				<Image
					style={{
						width: screenWidth / 3 - 1.5,
						height: screenHeight / 4.5
					}}
					source={{ uri: video.thumbnail }}
				/>
			</View>
		</TouchableOpacity>
	);
}

export default connect(null, { setSingleVideoToPlay })(SearchBodyComponent);
