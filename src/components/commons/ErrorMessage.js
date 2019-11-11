import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '../../assets/styles';

export class ErrorMessage extends Component {
	render() {
		if (this.props.children) return <Text style={globalStyles.errorText}>Error: {this.props.children}</Text>;
		else return null;
	}
}
