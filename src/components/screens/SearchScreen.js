import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import SearchHeaderComponent from '../partials/SearchHeaderComponent';
import SearchResultComponent from '../partials/SearchResultComponent';
import SearchBodyComponent from '../partials/SearchBodyComponent';
import { doSearch } from '../../redux/actions/searchActions';
import { getTrendingVideos } from '../../redux/actions/videoActions';

class SearchScreen extends Component {
	state = { searchQuery: '' };
	typingTimer = null;

	async componentDidMount() {
		const { loggedUser } = this.props;
		await this.props.getTrendingVideos(loggedUser && loggedUser.id);
		await this.props.doSearch();
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
		const { trendingVideos } = this.props;
		const { searchResults } = this.props;
		const { searchQuery } = this.state;
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
				<SearchHeaderComponent
					value={searchQuery}
					onSubmitSearch={this.onSubmitSearch}
					onChangeText={this.onChangeText}
				/>

				{!searchQuery && <SearchBodyComponent trendingVideos={trendingVideos} {...this.props} />}

				{!!searchQuery && <SearchResultComponent searchResults={searchResults} {...this.props} />}
			</SafeAreaView>
		);
	}
}

const mapStateToProps = ({ search: { trendingVideos, searchResults }, auth }) => ({
	trendingVideos,
	searchResults,
	loggedUser: auth.loggedUser
});

export default connect(mapStateToProps, { getTrendingVideos, doSearch })(SearchScreen);
