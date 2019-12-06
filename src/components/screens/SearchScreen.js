import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import SearchHeaderComponent from '../partials/SearchHeaderComponent';
import SearchResultComponent from '../partials/SearchResultComponent';
import SearchBodyComponent from '../partials/SearchBodyComponent';
import { doSearch } from '../../redux/actions/searchActions';
import { getTrendingVideos } from '../../redux/actions/videoActions';
import Loader from '../commons/Loader';
import { globals } from '../../config/constants';

class SearchScreen extends Component {
	state = { searchQuery: '', loading: true, flatListAlreadyLoaded: false };
	typingTimer = null;

	async componentDidMount() {
		await this.onRefresh();
	}

	componentDidUpdate(prevProps, prevState) {
		const { trendingVideos } = this.props;

		if (prevProps.trendingVideos !== trendingVideos) {
			this.setState({ loading: false });
		}
	}

	onChangeText = async searchQuery => {
		this.setState({ searchQuery });

		if (this.typingTimer) return;

		this.typingTimer = setTimeout(async () => {
			this.typingTimer = null;
			const { searchQuery: search } = this.state;
			if (search) await this.props.doSearch(search);
		}, 100);
	};

	onRefresh = async () => {
		this.setState({ loading: true, currentApiPage: 1 });
		this.getNewData(1); //for page 1
	};

	getNewData = async page => {
		const { loggedUser, getTrendingVideos, trendingVideos } = this.props;
		const { flatListAlreadyLoaded } = this.state;

		if (page !== 1) {
			//FlatList has an issue, it executes onEndReached when loading. To avoid it, we use a flag
			if (!flatListAlreadyLoaded) {
				this.setState({ flatListAlreadyLoaded: true });
				return;
			}
			page = Math.ceil(trendingVideos.length / globals.VIDEOS_TO_FETCH_PER_PAGE) + 1;
		}

		await getTrendingVideos(loggedUser && loggedUser.id, page);
	};

	render() {
		const { trendingVideos, searchResults } = this.props;
		const { searchQuery, loading } = this.state;

		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
				<Loader show={loading} style={{ marginTop: '60%' }} />
				{!loading && (
					<React.Fragment>
						<SearchHeaderComponent
							value={searchQuery}
							onSubmitSearch={this.onSubmitSearch}
							onChangeText={this.onChangeText}
						/>

						{!searchQuery && (
							<SearchBodyComponent
								trendingVideos={trendingVideos}
								onRefresh={this.onRefresh}
								getNewData={this.getNewData}
								{...this.props}
							/>
						)}

						{!!searchQuery && <SearchResultComponent searchResults={searchResults} {...this.props} />}
					</React.Fragment>
				)}
			</SafeAreaView>
		);
	}
}

const mapStateToProps = ({ search, videos, user }) => ({
	trendingVideos: videos.trendingVideos,
	searchResults: search.searchResults,
	loggedUser: user.loggedUser
});

export default connect(mapStateToProps, { getTrendingVideos, doSearch })(SearchScreen);
