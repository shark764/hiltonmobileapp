import React, { Component } from 'react';
import { validateEmail } from '../../utils/helpers';

export default class Form extends Component {
	rawInputs = [];
	inputErrors = {};

	onInputChange = (value, field) => {
		const data = { ...this.state.data };
		data[field] = value;
		this.setState({ data });
		this.validateField(field, value);
	};

	validations = () => {
		const { data } = this.state;
		let hasErrors = false;
		Object.keys(data).forEach(key => {
			const isValid = this.validateField(key, data[key]);
			hasErrors = hasErrors || !isValid;
			console.log(hasErrors);
		});
		return !hasErrors;
	};

	validateField = (name, value) => {
		const { data } = this.state;
		let error = '';

		if (name === 'email') {
			if (!validateEmail(value)) error = 'Invalid email';
		} else if (name === 'confirmPassword' && value) {
			if (value !== data['password']) error = 'Confirmation password does not match';
		} else if (!value && typeof value !== 'boolean') error = 'Please enter a value';

		if (error) {
			this.inputErrors[name] = error;
		} else {
			delete this.inputErrors[name];
		}
		this.setState({});
		return !error;
	};

	handleInputSubmit = (e, next) => {
		if (next === 'submit') return this.handleSubmit();

		//If the focus function doesnot exists, it means the input was a MaskedText,
		//So we need to get the raw Input element
		if (typeof this.rawInputs[next].focus !== 'function') this.rawInputs[next] = this.rawInputs[next].getElement();

		return this.rawInputs[next].focus();
	};

	handleSubmit = () => {
		if (!this.validations()) return;
		this.doSubmit();
	};

	render() {
		return null;
	}
}
