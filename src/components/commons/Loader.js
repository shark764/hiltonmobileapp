import React, { Component } from 'react';
import { View } from 'react-native';
import loadingAnimation from '../../assets/animations/loading.json';
import LottieView from 'lottie-react-native';
import { globalStyles } from '../../assets/styles';

const Loader = ({ show, style = {} }) => {
	if (show) {
		return (
			<View style={[globalStyles.loading, style]}>
				<LottieView source={loadingAnimation} autoPlay loop style={globalStyles.loading} />
			</View>
		);
	} else return null;
};

export default Loader;
