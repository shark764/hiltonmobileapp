import React, { Component } from 'react';
import { View } from 'react-native';
import loadingAnimation from '../../assets/animations/loading.json';
import LottieView from 'lottie-react-native';
import { globalStyles } from '../../assets/styles';

export class Loader extends Component {
	render() {
		if (this.props.show) {
			return (
				<View style={globalStyles.loading}>
					<LottieView source={loadingAnimation} autoPlay loop style={globalStyles.loading} />
				</View>
			);
		} else return null;
	}
}
