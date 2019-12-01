import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import SearchHeaderComponent from '../partials/SearchHeaderComponent';
import SearchResultComponent from '../partials/SearchResultComponent';
import SearchBodyComponent from '../partials/SearchBodyComponent';
import { doSearch } from '../../redux/actions/searchActions';
import { getTrendingVideos } from '../../redux/actions/videoActions';
import Loader from '../commons/Loader';

class SearchScreen extends Component {
	state = { searchQuery: '', loading: true };
	typingTimer = null;

	async componentDidMount() {
		const { loggedUser } = this.props;
		await this.props.getTrendingVideos(loggedUser && loggedUser.id);
		await this.props.doSearch();
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

	onSubmitSearch = () => {};

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

						{!searchQuery && <SearchBodyComponent trendingVideos={trendingVideos} {...this.props} />}

						{!!searchQuery && <SearchResultComponent searchResults={searchResults} {...this.props} />}
					</React.Fragment>
				)}
			</SafeAreaView>
		);
	}
}

const mapStateToProps = ({ search, videos, auth }) => ({
	trendingVideos: videos.trendingVideos,
	searchResults: search.searchResults,
	loggedUser: auth.loggedUser
});

export default connect(mapStateToProps, { getTrendingVideos, doSearch })(SearchScreen);
