import React, { Component } from 'react';
import { Text, View, FlatList, Image, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { fonts, globals } from '../../config/constants';
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
		const { trendingVideos, onRefresh, getNewData } = this.props;
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
						justifyContent: 'space-evenly',
						alignContent: 'space-between',
						marginBottom: 1.5
					}}
					refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
					onEndReachedThreshold={globals.LIMIT_TO_FETCH_VIDEOS_PREVIEW} //To load more content when we are x videos away from the end
					onEndReached={() => getNewData()}
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
						height: screenHeight / 4
					}}
					source={{ uri: video.thumbnail }}
				/>
			</View>
		</TouchableOpacity>
	);
}

export default connect(null, { setSingleVideoToPlay })(SearchBodyComponent);
