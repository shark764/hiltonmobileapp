import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import SearchHeaderComponent from '../partials/SearchHeaderComponent';
import SearchResultComponent from '../partials/SearchResultComponent';
import SearchBodyComponent from '../partials/SearchBodyComponent';
import { getTrandingVideos, doSearch } from '../../redux/actions/searchActions';

class SearchScreen extends Component {
	state = { searchQuery: '' };

	async componentDidMount() {
		await this.props.getTrandingVideos();
		await this.props.doSearch();
	}

	onChangeText = async searchQuery => {
		this.setState({ searchQuery });
		if (searchQuery) await this.props.doSearch(searchQuery);
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

const mapStateToProps = ({ search: { trendingVideos, searchResults } }) => ({
	trendingVideos,
	searchResults
});

export default connect(mapStateToProps, { getTrandingVideos, doSearch })(SearchScreen);
