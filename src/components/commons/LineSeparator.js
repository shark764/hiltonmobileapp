import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../../assets/styles';

export default LineSeparator = ({ style }) => {
	return <View style={[globalStyles.line, style]}></View>;
};
